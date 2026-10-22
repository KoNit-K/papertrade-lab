# Market state, funding continuation and the executed upgrade

**Later version guide:** [note 015](015-contract-set-2.md) adds the official contract-set names, 0.5%-of-PnL builder rule, governance and fee-push/bust-boundary checks. Unknowns below describe this earlier observation window; the later source narrows some without completing settlement or payment replay.

Observed: 2026-10-22, Asia/Singapore. This bounded follow-up reuses the prior
REA 6.7.0 graphs and source index, then checks changed inputs. It supersedes the
**current-version** assumptions in [note 012](012-independent-clients-orders-and-bridges.md),
not its dated observations. [Integration guide](../independent-client-guide.md) ·
[Source coordinates and chain observations](../../research/cases/010-market-funding-upgrade.json).

No signing, intent submission, transaction, bridge quote, personal-account lookup
or stream connection was performed. Statements about consumers and synthetic
branches are distinguished below from live protocol state and vendor descriptions.

**Subsequent announcement cross-check:** [note 014](014-official-announcement-crosscheck.md)
adds Tokenomics mode/issuance semantics, PAPER transfer restrictions, the added
profit band and the team's initial builder-whitelist policy. Statements below
that new Tokenomics logic is unreviewed describe this note's original scope;
the later checks remain partial and do not close funding or admission gaps.

## 1. The scheduled implementations are now installed

At chain-999 block **49175395** (`0x2ee5b63`), hash
`0x9230dbdb9eae0f5e4e46a78f10ec1681b1c7979d74dd67aff524bbed13f77941`,
the three implementation slots match the earlier scheduled targets:

| Proxy | Implementation at the reference block |
|---|---|
| Exchange `0x6cd5661646289fb6e65ea5c032310fded797d0a2` | `0x0a44049dbbb6b4762a6ba37aa0f7548c0b4a3723` |
| SessionKeyManager `0x8326eb8896e358717f10502ec73ce8d28e37b108` | `0x04b5ea4cdd8d6de4bd6e0ef3865266947f043946` |
| Tokenomics `0x75174549dbbd44497d31a47e2e2d7406408d63d9` | `0x7c0a72a788cff4d68cfe9586aecb98e21eb58a03` |
| BatchExecutor `0x233ff29b239abc1d7748605da9b205c3e008626e` | `0xe0bc9cc7b067060aafccbaa3e250700c9cdd7262` |

The retained six-action Timelock operation slot is `1`, the completion sentinel,
rather than its former ETA. Together with the installed targets this establishes
completion by the reference block. The execution transaction, exact execution
block and all initialization effects were not reconstructed. The reference header
was read twice with identical results; storage and code requests use its block
number. This is one provider's consistent block-end observation, not independently
verified historical state.

The acquired frontend build is **`2b8e2c45a33e`**. Its deployment module still lists
the old Exchange implementation as the default and the installed one as
`exchangeNext`. The rules decoder separately recognizes `exchange: next` and
rejects mismatched instruments. A source configuration entry alone cannot decide
which implementation is active. No live rules publication was obtained here.
New Tokenomics business logic and the upgrade's complete effects remain unreviewed.

## 2. Assemble three independent data planes

| Client need | Recovered producer | How it joins the client |
|---|---|---|
| Current quote and live candles | Hyperliquid `wss://api.hyperliquid.xyz/ws`; `bbo` per coin and `candle` per coin/interval | Deployment maps instrument ID to coin, asset index and price scale. Quotes carry source time; the consumer also records local receipt time and connection epoch. |
| Fine historical chart prices | Papertrade `GET /query/markets/{instrumentId}/price-history?fromMs=…&toMs=…&intervalMs=…` | Validates the requested series, boundaries, interval alignment, price/time column lengths, ordered offsets, gaps and publication `asOfMs`. |
| Historical OHLC candles | Hyperliquid `POST /info`, read request `candleSnapshot` with coin, interval, start/end | The consumer validates coin/interval and candle bounds, then filters and sorts the requested interval. This read-only API was located statically, not called. |
| Trading availability and risk limits | Papertrade public `trading:current` | Supplies pause/lifecycle, intake controls, leverage and notional limits, scale and related parameters; it is not the quote producer. |
| Wallet and operation reconciliation | Credential-bearing account SSE and account history queries | Reconciles operations, positions, balance and index progress with account/queue revisions. Only the code was read; no wallet was queried. |

The `bbo` decoder checks bid/ask ordering and exact conversion to the instrument's
integer price scale. It distinguishes raw bid/ask, midpoint and a size-weighted
chart price. A chart point is therefore not automatically the exact settlement
price. The socket consumer drops older source times within an epoch, resubscribes
after reconnect, increments its epoch and clears live candle buffers. Fine tick
history and candles have separate backfill/cache logic; a reconnect is not proof
that missed ticks were replayed.

Papertrade price history carries `coverage`, gaps and source `generation`/
`revision`. Its consumer checks publication structure and uses incomplete coverage
to drive refreshes; these values are not a common sequence number shared with
Hyperliquid quotes or wallet SSE. The trading-state merger independently keeps
the newer indexed block and newer intake revision. Its instrument identity check
must succeed before using those rules with deployment metadata.

The account decoder requires a patch's `baseAccountRevision` to match the current
account snapshot. Reopening the SSE marks it as needing a fresh full snapshot;
an out-of-sync patch triggers recovery instead of being applied to an arbitrary
state. Queue expectations also have a catch-up timeout. Account history and
funding are separate queries, so an independent client still needs to reconcile
intent IDs and relevant index progress after disconnection. These are recovered
consumer rules, not a tested server resume contract.

Sources: current [app](https://exchange.papertrade.xyz/assets/app-LLsjk1IE.js),
[hooks](https://exchange.papertrade.xyz/assets/hooks-CcThqb8N.js),
[chart history](https://exchange.papertrade.xyz/assets/chart-history-BsyjblFC.js),
[quote decoder](https://exchange.papertrade.xyz/assets/focus-B4j7CxoU.js) and
[trading-state adapter](https://exchange.papertrade.xyz/assets/trading-state-CbSDF5ke.js).
Exact digests and offsets are retained in the metadata. No live feed completeness,
latency or cross-origin access was measured.

## 3. Admission and authentication remain a server-side dependency

Current transport consumers preserve the previously recovered distinction:
account SSE uses `withCredentials: true`; query GETs use `credentials: same-origin`;
ordinary intent calls add `X-Papertrade-Build`, while the separate registration
wrapper uses `credentials: include` without that build header. An HTTP error helper
maps 401/403 to a sign-in message, and a shared request wrapper honors 429
`Retry-After` with separate query/edge cooldowns.

This establishes what the browser sends and how it reacts. It does not establish
whether arbitrary clients can obtain a session, whether account reads require
that session, which Origins are admitted, how builds are accepted, or actual
rate limits. Generic sign-in text is not evidence of a particular authentication
protocol. The inspected wrappers do not supply an API key. No cookie replay,
account probe, alternate Origin, invalid intent or CORS experiment was used.
`docs.papertrade.xyz` remains stopped following the prior 403.

## 4. Deposit arrival, proxy sweep and Exchange credit are different events

The current deposit consumer obtains the user's counterfactual address through
`computeProxyAddress(address)`. Static factory implementation bytes contain the
CREATE2 address calculation and deployment path. Neither computing an address
nor sending to it proves that the proxy is deployed or its HyperCore account is
activated. Activation and activation-fee debt are checked separately by consumers.
No personal address was computed or queried here.

The frontend's reconciliation helper reads the proxy's available spot/perp
balances. At its captured 10-USDC threshold it invokes the coordination endpoint
`POST /funding/deposits/check`. That request carries the user and build header;
it is a state-coordinating command and was not called. The Exchange runtime's
`sweep(address)` selector candidate routes through a registration marker into
separate registration/sweep paths. Full CoreWriter scheduling, asynchronous
completion and exact credit arithmetic were not replayed. A minimum checked in
the browser does not establish the worker's retry, dust or recovery policy.

The factory and CoreDepositWallet addresses are themselves proxies. Their
reference-block implementations are respectively
`0x8f22a73a23a2de0dbfdf6729f4d8c07dbdc69cf0` and
`0x7537af00779cc053a696e47ebd451b5bc4790da3`. Inspecting only the proxy dispatcher
would miss their business methods. Both implementations were acquired and
inspected offline; generated selector/argument candidates are not verified ABIs.

The current funding UI saves a sent-deposit record for one hour and calls a deposit
credited when account lifetime `depositedRaw` exceeds its saved `depositedBefore`.
That aggregate comparison does not uniquely bind a particular bridge transfer to
an Exchange credit. Concurrent deposits or a separate delayed credit can satisfy
it. A defensible per-transfer reconciliation still needs the source receipt,
bridge result, proxy/Core action and matching Exchange/indexer credit evidence.
No exploit or live misattribution was tested.

Sources: current [deposit consumer](https://exchange.papertrade.xyz/assets/deposit-BKFZXORl.js),
[funding client](https://exchange.papertrade.xyz/assets/client-6rwzf9Ah.js) and
[funding sheet](https://exchange.papertrade.xyz/assets/FundingSheet-Bake0-tm.js).

### Circle forwarding: a better-supported provider boundary

Circle's [domain table](https://developers.circle.com/cctp/concepts/supported-chains-and-domains)
identifies **19 as HyperEVM**, distinct from EVM chain ID 999, and lists forwarding
support. Papertrade's retained encoder targets domain 19 and the HyperCore deposit
recipient, with an additional proxy/destination payload; domain 19 alone must not
be described as a separate HyperCore domain.

Circle's [forwarding guide](https://developers.circle.com/cctp/howtos/transfer-usdc-with-forwarding-service)
describes burn, attestation and destination mint, and uses Iris `forwardTxHash` to
locate the latter. Its [service description](https://developers.circle.com/cctp/concepts/forwarding-service)
explicitly discusses HyperCore deposits/withdrawals, dynamic forwarding fees and
no refund of excess gas. It also requires recipient setup handling for a missing
Solana token account. These provider descriptions improve the route evidence;
they do not certify Papertrade's exact extended hook, proxy sweep or a particular
arrival. No blanket refund promise for a stalled Papertrade deposit was found.

## 5. Withdrawal has two authorizations and another completion boundary

For a non-Core route, the current controller first signs the Hyperliquid onward
action, then signs `WithdrawToCore`, and includes the onward authorization in the
submitted withdrawal metadata. Both signatures belong to the future user flow;
none was created in this study. The onward nonce is a millisecond value, separate
from the Exchange action nonce. Its submission metadata includes a maximum fee
and recipient-creation decision.

If the server reports `needs_signature`, the client obtains fresh route terms,
checks the transfer route/recipient, and would submit a replacement authorization
to `POST /intents/{id}/onward`. It does not create another `WithdrawToCore` in that
continuation method. This is an additional recovered mutation endpoint, not an
alternative order intake or a read-only status request. It was not called.

The retained route encoder uses HyperCore `sendAsset` for HyperEVM delivery and
`sendToEvmWithData` for Ethereum, Arbitrum and Solana, with the relevant Circle
domain/recipient encoding. The acquired UI checks route fees and recipient setup;
its received amount is an estimate after activation, gas allowance and route fee.
No measured user payout or permanent fee schedule is inferred from these checks.

The [current timeline consumer](https://exchange.papertrade.xyz/assets/timeline-BhBQk2eJ.js)
only shows an external Circle route as received when the platform transfer is
`settled` **and** Iris supplies `forwardTxHash`. Thus even the official UI separates
platform completion from onward mint progress. A hash alone is not a receipt or
a verified destination token balance. Its progress durations and remaining-time
animation are client estimates, not provider deadlines. `needs_signature` keeps
the continuation pending; `failed` alone does not establish a refund, its payee or
where funds remain. No refund/arrival transaction was followed.

## 6. Across legacy migration is a route-preservation task

The current deposit consumer still builds a `/suggested-fees` request and manually
encodes the bridge deposit plus handler message. The message is essential: it
approves/deposits the received token through CoreDepositWallet for the proxy and
drains leftovers to the encoded owner. Merely replacing the URL would not preserve
this destination behavior.

Across's [API reference](https://docs.across.to/api-reference) now requires Bearer
authentication and an Integrator ID. Its indexed migration guide describes replacing
manual legacy encoding with returned `approvalTxns` and `swapTx`; production keys,
quote expiry and attribution must be handled. The canonical migration-page open
failed in this reader; the retained search excerpt, not a successful page capture,
is identified in the metadata. No alternative fetch followed that failure.

The successfully read [embedded-actions guide](https://docs.across.to/introduction/embedded-actions)
uses `POST /swap/approval` with structured actions for destination calls. A proposed
migration therefore needs to preserve the handler recipient, runtime output amount,
CoreDepositWallet/proxy call and leftover/refund recipient. Production credentials
and the exact Robinhood USDG → HyperEVM USDC route were not tested or obtained.
Supplier support for both chains is insufficient proof of that token pair or its
message-bearing execution. No quote or new deposit-address API was called.

Across's [refund description](https://docs.across.to/introduction/refunds) distinguishes
expiry without a fill from eventual on-chain refund after settlement processing.
An expired deposit is still escrowed, and refund arrival can take hours. Those
are supplier rules, not a verified refund for Papertrade's legacy handler route.
The captured UI recognizes `expired`/`refunded` and a fill hash; it does not supply
an independently checked refund receipt, amount or recipient.

## 7. New Session and builder paths narrow two earlier unknowns

The new Exchange open/close entries still compare the caller with executor slot
`0x58`. Four synthetic branch checks exercise the acquired byte ranges at
`0x080a–0x081b` and `0x2e50–0x2e64`, stopping before signature/settlement. Both permit
the configured BatchExecutor and reject an unrelated synthetic caller. Old gate
program counters are not reused as proof for the new implementation.

The new Session validator is called through selector `0x7f608253` by the open path
and `0xd95208cd` by the close path. Both reach the recovered-signer session-record
check, including nonzero expiry and timestamp validation. In six synthetic checks,
mocking recovery as the master address did **not** bypass a missing session record;
a synthetic registered key passed the checked validator. This narrows the previous
master-signing question for these paths. It does not validate real signatures,
registration reachability, revocation races, replay protection or every entry.

The close-path resolver also looks up the registration's `feeAddress` through the
protocol dependency in Session slot 8:
`0xfdc6550436dd75ce8a0b145f935b7d3a64f53248`. Its selector `0xd779e270` returns zero
unless the address's enable flag is set; otherwise it returns a packed global
raw rate. That rate was **`5000000000000000`** at the reference block. Enable/disable
branches compare callers with configured authority addresses. No builder entry
or personal mapping was queried. The EIP-1967 slot was zero for this dependency;
that alone is not a universal non-upgradeability proof.

Four additional synthetic checks confirm disabled/enabled resolution and the
Session resolver dropping/retaining attribution for a mocked zero/nonzero registry
rate. Together with the current frontend still supplying zero `feeAddress`, this
shows that changing the signed address alone is insufficient evidence of enabled
attribution. The raw rate is not presented as an end-user percentage: its fee base,
divisor, additional charge versus carve-out, payout entitlement, registration
policy and claim/revocation lifecycle still need complete tracing.

REA's inferred Exchange selector set changed from **98 to 103**: six additions and
one removal. The additions are `0x69f9a5f0`, `0x9d346583`, `0xcbce7532`, `0xd970fad5`,
`0xe6ac4a74`, `0xf009ac03`; removed: `0x415f1240`. Retained selectors have unchanged
inferred argument strings, which does not prove unchanged semantics. The new
branches include caller-keyed accounting and authority checks; none is assigned
an invented order name. Native conditional orders, single-position partial closes
and existing-position adjustments remain unestablished, not globally disproved.

## Verification and remaining work

- Private reader repair: a real-path empty-body regression failed before the fix;
  three tests now pass, including five envelope subcases. Independent review also
  checked that the failed response consumes the final available RPC attempt. Two
  additional new-window wrapper checks pass at the 30-attempt budget boundary.
- Fourteen narrow offline code-path checks passed: four Exchange caller gates,
  six Session cases with mocked recovery and four fee-resolution cases. These
  use synthetic state and an existing bounded interpreter; they are not full EVM,
  real signature verification or production execution.
- Six new small EVM interface inspections succeeded using the existing REA 6.7.0
  installation and retained offline Linux image. Two of these inspect proxy
  dispatchers only; implementations were then inspected separately. Initial
  Docker access denial is retained. No install or whole-app/OOM retry occurred.
- Collection: 20 direct HTTP attempts (17 successful, three transport failures),
  21 RPC attempts (20 successful, one transport failure), seven vendor-page opens
  (six successful, one reader error), and six search queries. HTTP/page budget:
  27/30; RPC: 21/30; search: 6/8. Successful direct captures: 37. Requests were serial
  with at least one second between starts; prior ledgers remain unchanged.

The remaining integration gates are actual server admission/account authorization,
complete CoreWriter/sweep/credit reconciliation, destination payment/refund
receipts, route-preserving Across migration with approved credentials, complete
builder fee accounting and classification of all changed or previously unknown
contract entries. Existing CASE-001 windows and reproduction gates are unchanged.
