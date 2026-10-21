# Independent client integration guide

Initial recovery: 2026-10-22, Asia/Singapore, build `38f2c40c4112`.
The [upgrade/data-flow follow-up](research-notes/013-market-state-funding-and-upgrade-followup.md)
checks build `2b8e2c45a33e` and confirms installation of the scheduled implementations.
Exact signing details below retain their original recovery scope unless explicitly
rechecked; a new frontend build does not certify backend compatibility.
This is a recovered compatibility guide, not an official SDK or a tested production
order client. [Research, permission checks and funding routes](research-notes/012-independent-clients-orders-and-bridges.md)
· [Versioned source coordinates](../research/cases/009-client-orders-bridges.json).

A replacement client can construct compatible intents for Papertrade's official
submission service. It still depends on the official relayer and authorized
BatchExecutor for opens and closes. The captured [official architecture](https://docs.papertrade.xyz/how/architecture/)
describes that route; current client bytes and acquired contract caller checks
cross-support it. No signature, intent submission or fill was tested here.

## 1. Choose the connection route

| Route | What is established | Integration consequence |
|---|---|---|
| Own client → official `/intents` → relayer → BatchExecutor → Exchange | Exact client URL, message types, serialization and acknowledgement correlation recovered; contract caller gates cross-checked. | Use this as the recovered open/close integration route. Production admission and compatibility guarantees remain unknown. |
| Own client → some other relayer service | No second public submission endpoint or independent relayer protocol established within the inspected sources. | Anonymous backlog telemetry is not a submission endpoint. Do not invent a port or assume RPC is a relayer API. |
| Own EVM transaction → Exchange or BatchExecutor | Exchange open/close gates compare caller with the configured executor; BatchExecutor batch intake checks its relayer allowlist. | Paying gas and possessing a user signature do not supply either execution role. |

Withdrawal, session revocation and maintenance have different authorization paths.
The captured architecture describes permissionless transaction delivery for
withdrawals/maintenance and owner-driven direct session revocation. This is not a
blanket assertion that every such call succeeds: signatures, deadlines, balances,
liquidation conditions and contract roles still apply. Our new synthetic checks
cover only the open/close caller gates and BatchExecutor allowlist branch.

## 2. End-to-end stages

```mermaid
sequenceDiagram
    participant C as Independent client
    participant W as User-controlled signer
    participant A as Official intents API
    participant R as Official relayer
    participant B as Authorized BatchExecutor
    participant E as Exchange
    participant I as Indexer and state streams
    C->>C: Read current rules; validate units and authorization
    C->>W: Request exact EIP-712 signature
    W-->>C: Signature; client derives matching intentId
    C->>A: POST /intents with action and signed fields
    A-->>C: Correlated receipt or ambiguous confirmation
    A->>R: Intake and scheduling
    R->>B: Authorized on-chain batch
    B->>E: Dispatch individual call
    E->>E: Check permissions/signature; execute using protocol price
    E-->>I: Execution events and state
    I-->>C: Reconcile same intent and positions at sufficient revision
```

This diagram describes the recovered route. The signing and submission stages
were not exercised. A valid HTTP receipt is not proof of successful execution;
a successful batch transaction can contain failed items. The observed batch
behavior is documented in [note 007](research-notes/007-queue-and-dividend-payment.md).

## 3. URLs and client transport behavior

Relative paths below resolve against `https://exchange.papertrade.xyz`.
They are recovered client interfaces, not a public availability/SLA commitment.

| Purpose | Method / path | Captured transport and verification |
|---|---|---|
| Protocol aggregate | `GET /query/protocol/summary` | Prior anonymous public read succeeded; not requested again in this increment. |
| Quote / candle updates | Hyperliquid `wss://api.hyperliquid.xyz/ws`, `bbo` / `candle` | Current consumer and instrument scaling recovered statically; not connected in this follow-up. |
| Fine price history | `GET /query/markets/{instrumentId}/price-history` with time/interval parameters | Current consumer validates series, alignment, gaps and coverage; not called. |
| Candle history | Hyperliquid `POST /info`, read type `candleSnapshot` | Separate historical OHLC source; located statically, not called. |
| Public trading rules | `wss://stream.papertrade.xyz/connection/websocket`, channel `trading:current` | Static subscription path recovered; no new stream connection in this increment. |
| Session registration | `POST /intents`, action `registerSessionKey` | Separate wrapper: JSON, `credentials: include`, 5-second timeout; no build header in this wrapper. Not called. |
| Open / close | `POST /intents`, action `openPosition` / `closePositions` | JSON, `Accept`, `X-Papertrade-Build`, `credentials: same-origin`, 35-second timeout. Not called. |
| Account reconciliation | SSE `/state/user/live?wallet=<user>` and account queries | Client uses credential-bearing modes; routes read statically only. No account lookup or stream connection. |

The four origins in the HTML serve different purposes: `exchange`, `sign`,
`stream` and `preview`. The signing origin is not the order submission URL.
No API-key injection was found in the captured submission wrapper. Server-side
cookie, Origin/CORS, build admission, rate limits and long-term compatibility
remain untested. `credentials: same-origin` describes browser behavior; it does
not define how a different-origin client is admitted.

Quotes, rules and account state have separate clocks/revisions. Use deployment
instrument identity and scale to join them; recover history and a full account
snapshot after the relevant stream reconnects. A quote timestamp, history revision
or HTTP acknowledgement is not an execution confirmation. See the
[data-plane and reconciliation details](research-notes/013-market-state-funding-and-upgrade-followup.md#2-assemble-three-independent-data-planes).

## 4. Exact open/close message contract

Exchange EIP-712 domain:

| Field | Captured value |
|---|---|
| `name` | `String` — the literal string |
| `version` | `1` |
| `chainId` | `999` |
| `verifyingContract` | `0x6cd5661646289fb6e65ea5c032310fded797d0a2` — Exchange proxy |

Type names, field order and widths:

```text
OpenPosition(address user,uint32 instrumentId,bool isLong,uint128 size,uint32 leverage,bool useDebt,uint256 nonce,uint64 deadline)
Close(address user,uint256[] positionIds,uint256 nonce,uint64 deadline)
RegisterSessionKey(address user,address key,uint64 expiry,address feeAddress,uint256 nonce,uint64 deadline)
```

`Close` is the signature type; `closePositions` is the HTTP action. The staking
and cancellation domains differ from the Exchange domain. In particular,
`CancelIntent` uses `PaperTrade Intent Cancel`, version `2`, and a `uint256`
deadline; it must not be encoded as an Exchange `Close` message.

For the open path, `size = parseUnits(margin, 18)` is collateral margin.
Leverage is separate. An illustrative margin of 20 at 100× has
`size="20000000000000000000"`, `leverage="100"`; do not encode 2,000 as margin.
The wire encoder emits uints and uint arrays as decimal strings, preserves
booleans, lowercases addresses/bytes, and appends signature components
`v` (decimal string 27/28), `r` and `s` (32-byte lowercase hex).

Non-replayable structural example; every angle-bracket value is a placeholder:

```text
{
  "action": "openPosition",
  "signed": {
    "user": "<owner address>",
    "instrumentId": "<uint32 decimal>",
    "isLong": <boolean>,
    "size": "<margin in 18-decimal units; uint128>",
    "leverage": "<uint32 decimal>",
    "useDebt": <boolean>,
    "nonce": "<uint256 decimal>",
    "deadline": "<Unix seconds; uint64 decimal>",
    "v": "<27 or 28>", "r": "<signature r>", "s": "<signature s>"
  }
}

{
  "action": "closePositions",
  "signed": {
    "user": "<owner address>",
    "positionIds": ["<uint256 decimal>", "<another position ID>"],
    "nonce": "<uint256 decimal>",
    "deadline": "<Unix seconds; uint64 decimal>",
    "v": "<27 or 28>", "r": "<signature r>", "s": "<signature s>"
  }
}
```

The outer body contains `action` and `signed`, not an entire typed-data object.
These messages contain no limit, trigger, slippage or requested execution-price
field. Additional JSON fields do not establish an on-chain price constraint.

## 5. Session, nonce and deterministic correlation

The captured client uses a registered session key for open/close and the master
wallet for registration, withdrawal and PAPER actions. The prior captured
[session documentation](https://docs.papertrade.xyz/learn/session-keys/) describes
scoped authorization and a 30-day session. A replacement signer/custody design
still needs its own verification; merely observing session use does not prove
that master-signed opens are rejected by the server or signature validator.

Nonce state is partitioned by chain, contract, user and the client's paper/session
routing group, with a random initial seed and subsequent increments. It is not
an EOA transaction nonce or a separate sequence for every HTTP action. Coordinate
concurrent processes/devices; do not reuse a nonce for different messages. The
captured default deadline is `floor(nowMs / 1000) + 3600`, in seconds. Recheck
current authorization, market rules and pending operations before requesting a
signature; neither a stale local balance nor a nonce alone establishes admission.

The statically recovered intent identifier is:

```text
tagHash  = Keccak256(UTF8("papertrade:intent-id:v2"))
digest   = Keccak256(0x1901 || domainSeparator || hashStruct(message))
signer   = recoverAddress(digest, r, s, v)
intentId = Keccak256(tagHash[32] || digest[32] || signer[20])
```

Concatenate raw bytes; the signer address is 20 bytes, not a padded 32-byte word.
For EIP-712, a dynamic uint256 array hashes its ordered, individually 32-byte
encoded elements. Use Ethereum Keccak, not NIST SHA3-256. This increment tested
unsigned units/widths/array encoding and Keccak distinction, but did not run
signature recovery or an end-to-end cryptographic intentId vector. The formula
therefore retains its static-recovery status.

## 6. Acknowledgement and recovery rules

| Observation | Required interpretation |
|---|---|
| Receipt action and intentId match | Associate it with the reserved operation; retain queue revision. Receipt states such as queued/prepared/confirmed alone do not prove a successful individual call. |
| Timeout, network failure, malformed or mismatched receipt | Confirmation may be unknown. Keep the original intent association and reconcile before considering another submission. |
| Definite recognized intake rejection | Record rejection and reason; do not turn rate limiting or admission failure into an automatic new-nonce loop. |
| Duplicate receipt | Reconcile idempotently; do not create another logical operation. |
| Stream disconnected or revision behind the acknowledgement | Preserve pending/unconfirmed state; obtain a sufficiently current authorized snapshot before deciding the result. |
| Chain batch receipt succeeded | Check the individual item outcome and resulting state, not just transaction status. |

Recognized client error codes include `invalid_intent`, `deadline_expired`,
`unauthorized_intent`, `intent_conflict`, `admission_rejected`,
`intake_action_paused` and `rate_limited`; this is not an exhaustive server spec.
`INTENT_CONFIRMATION_UNKNOWN` explicitly represents uncertain confirmation.
An expired deadline prevents future authorized execution under that signature;
it does not prove that the intent did not execute earlier.

The page splits selected position IDs into sequential groups of at most 12 and
filters locally pending/closed IDs. Twelve is a client grouping rule, not an
established contract maximum. A later-group failure may leave earlier groups
submitted; that is distinct from partially reducing one position.

## 7. Remaining integration gates

Before treating a replacement client as production-ready, establish server
admission, supported build/version policy, account-state access, authoritative
rules/revision handling, cross-device nonce coordination, key custody and one
explicitly authorized end-to-end order lifecycle. Those tests are outside this
research authorization. Relayer availability, scheduling, execution price and
on-chain item failure still matter even with correct encoding.

The captured registration path supplies the zero address as `feeAddress`.
[Builder codes](https://docs.papertrade.xyz/how/builder-codes/) are a future
integration lead: the page was denied during this research session, and arbitrary
fee addresses, revenue attribution, eligibility and fee calculation were not
validated. No builder registration or fee configuration was performed.
