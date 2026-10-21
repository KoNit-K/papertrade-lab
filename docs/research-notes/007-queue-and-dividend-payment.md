# Execution queue and dividend payment: receipt follow-up

Date: 2026-10-21. Baseline: `4707147`. This follows [note 006](006-current-mechanisms.md)
and retains CASE-002/004's original **49115089–49115588** window and ordering.
No new log window was sampled. CASE-001, its candidate order and M1 gate are unchanged.

**Later update:** the owner authorized the blocked ledger query, and
[note 008](008-core-credit-and-relayer-pressure.md) records a unique official
HyperCore credit match plus real anonymous relayer backlog. The access/credit
limitations below describe the end of this earlier increment.

## Scope, identity and collection

The [follow-up plan](../../research/cases/002-004-followup-plan.json) was registered
before new online collection. We reused retained logs first, then selected the
first failed batch and the first withdrawal in the original block/transaction/log
order. The withdrawal's recipient happened to have an earlier claim in that same
window; this did not change the withdrawal selection rule.

The [reference record](../../research/cases/002-004-followup-reference.json) pins a
new finalized reference at **49118768**, hash
`0xe426436d41860ebfc5efc182d31189208c1639ee1b139602381b90f4671ca82a`.
Exchange, BatchExecutor and PaperStaking proxy implementation responses and runtime
bytes match note 006. Current app, hooks and trade-module responses are also
byte-for-byte equal to the earlier captures. Default-RPC state remains **latest-only
acquisition-time evidence**, not this reference block's state or transaction prestate.

[Collection metadata](../../research/cases/002-004-followup-evidence.json) records
26 RPC attempts: CASE-002 **19/60**, CASE-004 **7/60**. Twenty-five succeeded; an
open/close run stopped at a chain-ID network error, and one ordinary retry succeeded.
There were **22/30 source accesses**, 19 successful and three connection failures,
and **4/8 search queries**. One successful source access used the web reader after
direct document reads failed; its saved reader-response hash is distinct from an
upstream response-body hash, and exact request start/end times are unavailable.
The scheduler searches did not identify primary server implementation or scheduling
records; this is not an exhaustive source survey. A git fetch encountered HTTP/2
failure; one ordinary HTTP/1 retry succeeded. Git operations are outside RPC budgets.

## Execution: array order and partial failures are real; scheduler FIFO is unknown

**Provider-reported chain cases + acquired bytecode support.** Recomputing the
retained BatchExecutor logs gives **438 batch summaries**, **734 per-item results**,
**730 successes and four failures**. For every observed batch, result indices in
log order are `0..N-1`; observed batch sizes range from one to eight. These are
observed sizes, not a protocol maximum. A batch's submitted array determines its
execution order; it does not reveal how the relayer selected that array.

The first failure occurs in transaction
`0x6f48d78e4e47973a09b4911eec21a7a6861151e882925b4b8a7a6775b1ac3765`,
block **49115510**, transaction index **3**. Its EVM receipt succeeds, but its six
open calls have the following outcomes:

| Array index | Cash margin, 18-decimal units | Leverage | Result |
|---|---:|---:|---|
| 0 | 100 | 500 | Success |
| 1 | 100 | 500 | Revert `0x40f92143` |
| 2 | 100 | 500 | Revert `0x40f92143` |
| 3 | 89 | 500 | Revert `0x40f92143` |
| 4 | 60 | 500 | Revert `0x40f92143` |
| 5 | 35.6 | 500 | Success |

All are market 0 shorts. Input call identifiers match the emitted per-item
identifiers; the tuple's failure-tolerant flag is true for all six. The final
successful open after four failures directly demonstrates that these failures did
not abort this batch. The summary reports `6 / 2 / 4 / 0`, consistent with six items,
two successes, four failures and no observed skipped items. Failed items are terminal
failed execution attempts in this transaction, not evidence that they were still
waiting or automatically rescheduled afterwards.

In the acquired Exchange runtime, `0x40f92143` is emitted at `0x0ea4` after a
**directional OI plus proposed notional versus direction-cap check**. The short
branch is `0x0eb6–0x0ee0`; the other direction is `0x09fc–0x0a48`. The result is
consistent with a smaller final order fitting while larger ones fail. We do not
have the historical capacity prestate and do not claim an independently reproduced
capacity value or authenticated transaction-point implementation.

The transaction's block timestamp is **1792567011 seconds**. All six signed inputs
carry deadline **1792570601**, leaving **3590 seconds** at this block. These four
failures therefore do not look like expiry from those two fields. This arithmetic
is **not a ten-second wait measurement**: the actual signing, submission,
acknowledgement and broadcast clocks were not observed.

We also fetched the original first open and first close transactions/receipts.
Their call identifiers, item indices and successful result flags match. The first
open batch contains two open calls; the first close batch contains one close call.
No real expired, cancelled or still-pending intent was acquired from chain logs.
Those states may terminate before inclusion and cannot be inferred from their absence.

## Frontend waiting rules: what is actually in the current client

**Frontend static support; server enforcement is not demonstrated.** The current
app and hooks expose more precise behavior than a generic “transaction pending”:

- Open and close signed payloads receive `floor(Date.now()/1000) + 3600` as the
  default deadline. This is the client clock and a validity field, not a guaranteed
  fill time or server queue TTL.
- Open and close are not globally marked `singlePending` in the client action
  table. Close requests filter out IDs already absent from the current snapshot
  and IDs covered by an existing local/streamed close operation. A later close
  is therefore not automatically a duplicate retry of the same position.
- Close submission splits selected IDs into groups of at most **12**, submits
  groups sequentially, and can report partial submission when a later group fails.
  This is a frontend limit, not the maximum observed batch size above.
- Withdraw, session registration, PAPER unstake and PAPER claim have a client
  single-pending restriction. PAPER stake and open/close do not share that flag.
- An ambiguous acknowledgement remains `unconfirmed`. Reconciliation uses the
  indexed account stream, queue revision, position IDs and terminal outcomes.
  The client request's 35-second HTTP timeout does not cancel a server intent or
  prove execution failure. Local tracking's five-minute cleanup is also not a
  demonstrated backend queue expiry.
- The queue-position component polls every two seconds while queued operations
  exist. This is an interface refresh interval. The public `queue-summary` endpoint
  describes **payout debt**, not the relayer execution backlog.

Thus we can substantiate array ordering, partial failure, client deduplication and
several client waiting states. **FIFO/priority across users, server batching interval,
server retries, actual receipt-to-execution delay, and a real expiry/cancellation
case remain unknown.** The minimum evidence to close these gaps is a public server
policy/source or authorized actual intake/ack/broadcast/outcome records with their
clock definitions. Chain timestamps alone cannot supply them. No test intent,
transaction or cancellation was submitted to manufacture a sample.

## Official app order types

The owner reports that the current official app has **no limit orders, take-profit,
stop-loss or other scheduled/conditional orders**. The fetched current trade form
and input schema support this observation: the open intent carries market,
direction, margin, leverage and cash/debt choice; the close intent carries position
IDs. Their signed schemas have no limit price, trigger price or order-type field.
The deadline above expires an intent; it is not a planned execution time.

We inspected the current trade module, order-input module, app submission code and
typed-data schema as text. This confirms the inspected app paths and records the
owner's observation; it is not a claim that every undisclosed interface or a future
protocol version is incapable of conditional execution. An execution queue is not
an order book waiting for a user's chosen limit price.

## Dividend: a real claim followed by a withdrawal action

**Provider-reported chain case + current bytecode/frontend support.** The first
CoreWithdrawal in the unchanged window is transaction
`0xa0124e620089b846de7a6d0719b6687d94a1f8c44f1502d3dc50cebc0ca545f1`,
block **49115156**. Its recipient has an earlier PAPER claim in transaction
`0x045dd012d9e5900d4f7adc1705f9ae45c410d8926279675803172b897484fe36`,
block **49115113**. The linkage is between public chain fields only; no account
address or association to an owner report is published.

| Stage | Checked observation | Meaning and boundary |
|---|---|---|
| Claim | PaperStaking `Claimed` log 2: `1115251243441981349132` | About `1115.251243441981349132` in internal 18-decimal units |
| Internal credit | Exchange `StakingRewardCredited` log 1 has exactly the same amount and account | A credit to the trading balance, not an external token transfer |
| Withdrawal intent executed | `withdrawToCoreBySig`, selector `0x8d09f23f`, input amount `1115251244`; successful item/receipt | Input uses six-decimal units in this case |
| Exchange withdrawal | `CoreWithdrawal` log 6: internal amount `1115251244000000000000`, Core amount `111525124400` | Input × `10^12` internal; input × `100` Core units |
| CoreWriter | Log 5 from `0x3333333333333333333333333333333333333333`, sender Exchange, destination matches claimant privately | Version 1, action **6**, token index **0**, amount `111525124400` |
| HyperCore final credit | **Not obtained** | Requires actual Core ledger/result confirmation |
| Optional onward route | **Not obtained** | A further external destination requires its own receipt |

The CoreWriter payload's action and fields match the official
[spot-send encoding](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).
A separately registered public aggregate `spotMeta` read identifies token index 0
as **USDC**, with both size and wei decimals **8**, at acquisition time. This
checks denomination without sending any account address. The observed conversion
therefore corresponds to `1115.251244` USDC at eight Core decimals. A
successful EVM call and CoreWriter event establish that the action was emitted;
they do not independently prove its subsequent HyperCore acceptance or credit.
Official [interaction timing](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interaction-timings)
describes CoreWriter processing after EVM block construction, not an actual receipt
for this case. We do not turn that description into a measured final-payment time.

The withdrawal exceeds the claim by **558018650868** internal raw units
(`0.000000558018650868`). No other event for this account was found in the retained
Exchange window between these two events, but its earlier cash balance is unknown.
Consequently this is a real **claim-then-withdrawal** association, not proof that
all withdrawn funds came from this particular dividend. No fungible balance can
be attributed to a single source just by matching nearly equal amounts.

The previously checked fee push/distribution of approximately `131.938049` in
note 006 is a separate protocol-level sample. We do not attribute this much larger
claim to that one distribution: accrued rewards may span earlier distributions.

The current frontend signs `WithdrawToCore` with the real wallet, then can attach
an additional onward-route signature for HyperEVM/Ethereum/Arbitrum/Solana routes.
The contract's base action remains the transfer to the user's HyperCore spot
account. A route acknowledgement, prepared state or EVM receipt alone is not a
receipt from the final selected destination.

## Final-payment access gap

A [separate prospective plan](../../research/cases/004-core-payment-followup-plan.json)
prepared a maximum-two-read lookup of the first recipient's public non-funding
ledger in the withdrawal block's timestamp ±60 seconds, using the official
[read-only info API](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint/perpetuals).
Automatic approval review rejected the command **before any HTTP request** because
it would send a derived account and precise interval outside the parent plan's
aggregate-only source boundary. No alternate route was used to bypass the refusal.
The lookup awaits explicit permission. Raw account addresses and responses would
remain private; the public result would retain only necessary match fields and limits.

Until actual Core receipt evidence is available, **final external payment is
unverified**. Full distribution-before-state, claim reserve reconciliation,
LP-excess funding and onward destination confirmation also remain open.

## Checks and records

An offline receipt check verifies transaction/receipt identity, the six call IDs
and success/failure order, first open/close item success, claim versus internal
credit amount/account, and withdrawal input/internal/CoreWriter unit conversion.
It does not infer historical state, validate signatures or replay settlement.
The complete suite and publication/independent review checks are recorded in
[STATUS](../../STATUS.md). The [queue outcome](../../research/cases/002-queue-followup-outcome.json)
and [payment outcome](../../research/cases/004-payment-followup-outcome.json)
preserve unknown scheduler clocks, final credit and funds provenance as nulls.
