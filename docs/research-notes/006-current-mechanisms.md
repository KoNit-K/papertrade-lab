# Current mechanisms: intent waiting, PAPER, dividends, hedging and liquidation

Date: 2026-10-21. Baseline: `b5f5509`. This investigation adds CASE-002–005.
**No full historical settlement reproduction is claimed; CASE-001 stays blocked.**

## Evidence and version boundaries

The four locally registered plans fix a shared first window of **49115089–49115588**
before event reads, ordered by block, transaction and log index. The finalized
discovery end hash is `0x7066bb03e6580d5078b4042f8266989bf81aeba63aee746b56b2181570cfdc58`.
The original CASE-001 interval and candidate ledger are unchanged.

We use four distinct descriptions: **official description**, **bytecode support**,
**provider-reported chain case support**, and **independent reproduction passed**.
The last has not been established for any new case. Source descriptions, static
paths, matching event arithmetic and full state reconciliation are separate results.

Default-RPC code/storage are latest-only acquisition-time observations, including
when requests carry explicit block tags. They are not transaction-point versions
or atomic snapshots. The obtained Exchange, BatchExecutor and QueueLib bytes match
previously retained byte hashes; that does not restore CASE-001's withdrawn temporal
bindings. The [shared record](../../research/cases/002-005-current-evidence.json)
contains request times, source hashes, code hashes, failures and per-case budgets.

Official address documentation and the fetched frontend agree on the principal
Exchange/PAPER/staking addresses. There is a separate collateral-address discrepancy:
the docs list native HyperEVM USDC, while the frontend's `deployment.collateral.address`
is different. We have not authenticated that transport/custody relationship. Internal
amounts below use the observed 18-decimal accounting convention; they do not prove
an external USDC transfer or a universal collateral deployment address.

| Acquired runtime | Implementation / library | Keccak-256 |
|---|---|---|
| Exchange | `0x0f3febfc94876b0c895f7acecdc8f5c863b549ee` | `0x9d20287df886415035d53344a0dc8a1044949308cc3283ee0fe7ea5f3ea28d92` |
| PaperTokenomics | `0x600d1b9653fd47fc1543d1cc87f33ba2d2fdf48f` | `0xd9fbc7091e10f4d56188f3097454bd8464ed4b77b5f44d1c6391be72b9362169` |
| Mint arithmetic library | `0xe991817199363046da0a28da6fbad0284e4aa492` | `0xa13304bc6fdad736a3ee6ad77d713c6077f1b130501d577be1bf9487d005388d` |
| PaperStaking | `0xe6e3519455170913c5c3bfe541dd918a2d0cbb15` | `0x54573c497e5109e353cf5330343323915e0c0f26e1b410fd3cb2cd8d1460f154` |

These are returned-byte identities, not authenticated compiler source or full ABI.
Selector/event preimages are checked locally with Keccak and compatible paths;
selector collisions and field-name inference remain relevant limitations.

## CASE-002: execution waiting is observable separately from payout waiting

**Official description + frontend static support + batch event leads.** The official
[architecture](https://docs.papertrade.xyz/how/architecture/) gates opens/closes through
the relayer and BatchExecutor. Current frontend modules show a specific intent
queue interface:

- `submitting` is a local reservation. A successful acknowledgement moves it to
  `queued`; an uncertain acknowledgement uses `unconfirmed` instead of treating
  the operation as a confirmed failure.
- `hooks-a3qtukpN.js` defines a query to `/queue-rank/accounts/{address}` returning
  intent-ID/rank entries and an optional queue revision. The queued-intent component
  polls every **2000 ms while queued operations exist**. We read the scripts as
  text; no account endpoint or signed intent was submitted.
- A separate `/state/user/live` stream supplies account snapshots, index progress
  and terminal outcomes, including succeeded, failed, expired, cancelled and unknown.
  A UI update can lag acknowledgement or execution. These state names are not
  measurements of an actual user's waiting interval.
- Close submission groups up to **12 position IDs per intent**. It can report
  partial submission across groups. This is a frontend batching limit, not proof
  of the contract's maximum close count.

The BatchExecutor scan has 1,172 logs, including 734 compatible call-result events.
Four have a false success word under the recovered layout. We retain them as
failure leads; their individual receipts and exact causes were not investigated.
No real submit/ack/broadcast timeline, pending or expired live example was acquired.
**Execution FIFO discipline, priority rules and expected waiting time stay unknown.**

The [payout queue](https://docs.papertrade.xyz/how/solvency-queue/) has a different
purpose. Documentation describes FIFO unpaid claims, no payment of new winners
ahead of an existing queue, sideBucket backing, and permissionless harvest. On a
cash-funded close, returned collateral is credited separately; unpaid gains can
queue. Debt-funded collateral was itself a claim, so the entire surviving claim
can be paid or queued. The docs describe a keeper using `harvest(32)` on new blocks;
we did not measure its schedule or any promised payment deadline.

The acquired code exposes `harvest(uint256)` (`0xddc63262`, entry `0x1177`),
`queueHead`, `totalQueued`, `sideBucket` and `lpBankrollAvailable`. This round did
not reconstruct the full queue state machine. A later official API snapshot reports
zero payout debt at its own source block; it is not queue prestate for sampled
transactions, nor evidence that execution waiting is absent.

[CASE-002 outcome](../../research/cases/002-current-outcome.json) preserves missing
clock fields as null and separates failure leads from investigated transactions.

## CASE-003: loss basis, liquidation basis and the mint curve

**Official description + bytecode support + receipt amount consistency.** The
[mint documentation](https://docs.papertrade.xyz/how/mint-curve/) distinguishes the
mint basis from LP credit. The observed branch matrix is:

| Branch described by docs | PAPER basis | LP / fee treatment |
|---|---|---|
| Cash-funded losing close, empty queue | Realized loss less charged LP-side loss fee | Retained loss credits tracked LP; fee comes from LP's gain, not an extra trader deduction. |
| Cash-funded losing close, active queue | Full realized loss | Loss fee waived; backing earmarked in sideBucket while tracked LP still advances. |
| Cash-funded liquidation | Full lost margin | Tracked LP may receive margin less fee; active queue waives the fee and routes backing to sideBucket. |
| Debt-funded loss / liquidation | Destroyed claim, net of any applicable loss-close fee; full destroyed margin on liquidation | No new cash arrives. Debt liquidation has no liquidation fee. |

Only the first cash-loss and cash-liquidation interpretations have individual
receipt checks here. Debt-funded and active-queue branches remain documentation
claims, not independently exercised cases.

The first losing close in the registered order is in
[transaction 0x247767…a4fd0](https://hyperevmscan.io/tx/0x24776737d73b9880652a81e4a622f74ae9024c4ba9fd431ccf19394d609a4fd0),
block 49115099. Its signed loss is `374541263507595663`; fee is
`7490825270151913`; the proposed mint basis and tracked-LP advance are both
`367050438237443750`, exactly loss minus fee. A zero-sender PAPER Transfer to the
same privately matched account and the tokenomics event both report
`3657393757128285613` PAPER units. This reconciles receipt quantities; prior
high-water state and independently expected mint remain missing.

The first liquidation lead is in
[transaction 0xe36d93…45bf3](https://hyperevmscan.io/tx/0xe36d933b3496824ff0c7a66edbe5c4b9b34c4bee37b651cf5770c5b3b4245bf3),
block 49115441. The full-margin basis interpretation is `20000000000000000000`;
fee shares are `200000000000000000` each. The tokenomics event's tracked-LP delta
is `19600000000000000000`, while its mint basis and interpreted tail advance are
`20000000000000000000`. PAPER Transfer and tokenomics amount match at
`199285237980903299820`. **Mint basis and LP advance must not be silently equated.**

### Recovered integer integration

PaperTokenomics getters expose tracked LP at slot 3, tail progress at 4, flat
threshold at 5, reward cap at 6, rate at 7 and decay scale at 8. Two paths delegate
to a separate 585-byte arithmetic library (`0x0829`, `0x0abc`). Selector `0x7aac24ba`
accepts `L, H, B, T, R, S`: LP start point, prior tail progress, mint basis, threshold,
flat rate and decay scale. It returns minted amount and tail advance.

For the bounded, non-overflowing domain, with `W = 10^18`:

```text
flat = min(B, max(T - L, 0))
tail = B - flat
flatMint = floor(flat * R / W)
a = floor(S * W / (S + H))
b = floor(S * W / (S + H + tail))
segmentRate = floor(floor(R * a / W) * b / W)
mint = flatMint + floor(tail * segmentRate / W)
tailAdvance = tail
```

The tail expressions are skipped when tail is zero. The marginal rate
`R * (S / (S + H))²` differs from a whole loss's average rate. The implementation
uses both interval endpoints and staged rounding. It must not be replaced by a
single final rational division or the UI's displayed rate times loss.

The later [REA/frontend cross-check](010-rea-frontend-and-contract-crosscheck.md#captured-paper-ratio-formatter)
locates a PAPER ratio formatter that computes minted PAPER divided by a record's
eligible mint basis. This is a per-record average, not the current marginal rate.
Its page consumer was not captured, and its guard does not verify the API fields.

Acquisition-time slots and the official API separately report a $2M threshold,
100 PAPER per unit basis, $120M decay scale and $5M reward cap. Tail progress is
about $260M in these observations, even though tracked LP is about $4M. These
reads occurred later than the sample transactions and are not their inputs.
The inspected excess-drain path debits tracked LP but leaves tail progress intact.
Below the flat threshold the flat branch still applies; re-entering the tail uses
retained H. A decrease in LP does not generally restore the original tail rate.

The [research helper](../../packages/research/mechanics.ts) takes every parameter
explicitly. It does not determine the eligible loss or the LP start point from a
trade. [CASE-003](../../research/cases/003-current-outcome.json) remains incomplete
for historical mint reproduction and whole-supply reconciliation.

## CASE-004: dividends are an accumulator and a claim against internal balance

**Official description + bytecode support + stake/claim receipt support.** The
[staking page](https://docs.papertrade.xyz/paper/staking/) requires staking PAPER to
share rewards. The [dividend description](https://docs.papertrade.xyz/learn/staking-dividends/)
identifies half of paid trading fees and sweepable LP excess above the documented
$5M cap. Fees depend on queue/solvency conditions; a nominal fee is not automatically
an immediate staker payment.

The stages are distinct: Exchange accumulates staker fees; `pushStakerFees()` moves
funds/credit toward staking; a signed distribution updates `accRewardPerShare`;
a user claim credits Exchange balance; external withdrawal is another operation.
Current staking `stake`, `unstake`, `claim` and `distribute` direct entrypoints route
to a revert (`0x0e81` / `0x0ea4`); separate signed entrypoints exist. Thus “no lockup”
describes the stake terms, not bypassing the relayer or a guarantee of zero latency.

The acquired code uses **10^27 accumulator precision**, not the 10^18 token scale:

```text
pending = storedAccrued + floor(staked * accumulator / 10^27) - rewardDebt
```

The earned-minus-debt subtraction is checked before adding stored accrued rewards.
The inspected distribution branch at `0x1414–0x153c` leaves newly received rewards
unallocated when total stake is zero; later distribution can include unallocated
funds. A claim updates debt/accrual, caps the immediate amount by reward reserve,
and calls Exchange to credit balance. This is not proof of external USDC delivery.

The window contains nine Staked and 31 Claimed event leads plus 40 other
event leads without assigned business semantics. The first reviewed stake has a matching PAPER
transfer into staking of `15748500080935349468261`. The first reviewed claim is
`16507496179005009832`, matching its Exchange credit event and private recipient.
The distribution branch's event topic is absent from the scan; the official API's
latest distribution is at block 49114617, outside the registered window. No window
expansion was performed. A separately registered, targeted single-block follow-up
then checked the exact distribution advertised by that already captured API; it
is source-led validation, not an unbiased sample or a replacement window.

At block **49114617**, [transaction 0xd625f1…7d10d](https://hyperevmscan.io/tx/0xd625f18310617f150e4a4da234f98b08b7266fa8cef08583756eece55f67d10d)
reports success. Exchange fee-push and staking distribution amounts both equal
`131938049237073168703`, also matching the API. The observed fee component equals
the entire push; no extra LP-surplus component is demonstrated by this case. The
distribution event reports accumulator `13855166686623322083430450`, matching the
later API snapshot, but its prior accumulator and exact stake denominator are not
independently reconstructed. A later trade in the same batch generates additional
fees after this distribution; those are not retroactively part of its allocation.

We have not reconciled a full fee/excess funding → distribution → user claim →
withdrawal lifecycle, nor a real unstake or zero-stake distribution.
[CASE-004](../../research/cases/004-current-outcome.json) records those gaps.

## CASE-005: opposite positions can coexist in the observed case

**Bytecode/storage structure + provider-reported input/event support.** We screened
opens in original order, keeping positions observed opened within the window and
removing known close/liquidation events. Thirty-three later opens met the private
same-owner, same-instrument, opposite-side overlap screen; this is a lead count,
not a count of unique users or independently verified storage snapshots.

The first selected pair is position **1719299** (short, block 49115114) and
**1719300** (long, block 49115115). Both input/event matches have instrument 0,
entry 827975, margin `96711537000000000000`, leverage 20, cash-funded, one batch
item each and successful receipts. The first has no known ending event before the
second opens. They have distinct position IDs; their owner equality was checked
privately without publishing account identifiers or joining a personal report.

The same pair ends inside the original window. The short closes at block 49115175
with PnL `-350414699719194420`; the long closes at 49115183 at the same event exit
828125, with post-deadband PnL `313037131749147015`, adjusted gain
`129804064407852451` and fee `2596081288157049`. The short's PAPER mint is
`3421796579212319468`, matching its zero-sender Transfer and tokenomics event.

The two close events imply combined trading PnL of **`-223206716599499018`**
(about −0.223207 internal accounting units). We do not subtract the short's LP-side
loss fee again from trader PnL. Returned margins, other account activity and payout
routing are not a fully reproduced account balance delta. This is an observed
example of why opposite exposure need not yield zero net trading cost: deadband,
winning-side impact and fees affect the legs differently, and PAPER is a separate
asset whose value is not treated as recovered collateral.

Directional OI caps and account admission still matter. Independent isolated
positions do not cross-collateralize each other. Full double-leg liquidation,
queue-funded hedges and a universal frontend/relayer acceptance policy remain
unverified. Details and coordinates are in [CASE-005](../../research/cases/005-current-outcome.json).

## Liquidation: exact buffer basis and inclusive threshold

**Bytecode support + one liquidation receipt.** `getBustPrice(uint256)` enters at
`0x28a0` and calls the calculation at `0x4efb`. For entry E, integer leverage l,
and W-scaled buffer b in the supported domain:

```text
d = floor(E / l)
long:  z = E - d; bust = z + floor(z * b / W)
short: z = E + d; bust = z - floor(z * b / W)
```

**The buffer applies to the zero-equity reference z.** Adding a rounded five-basis-
point offset directly to entry would give a different result. Prices and intermediate
integer units must be preserved. The helper intentionally excludes extreme uint64
wrapping and is not a complete ABI implementation.

The liquidation path checks the stored open flag (`0x2a57–0x2a64`), obtains the
price, and accepts **price ≤ bust for long, price ≥ bust for short**. Comparisons
are inclusive (`0x2adb–0x2af0`, `0x2e01–0x2e15`). Once accepted, `0x2af1–0x2afd`
clears the open flag before settlement. A later close/liquidation encounters the
closed-position guard. These are static guards; real close-versus-keeper races
and transaction ordering were not replayed.

The [liquidation docs](https://docs.papertrade.xyz/learn/liquidations/) describe a
hard bust consuming full isolated margin, even when voluntary-close equity would
still be positive. A keeper watches prices, but the documented maintenance surface
is public. Its stated priority-fee policy is not a guarantee of execution order.
The inspected public entry has no caller gate before the price/open-state checks.
The actual liquidation receipt reports event price 827725 and bust 827730, consistent
with the long-side inequality; independent historical BBO and parameter verification
remain missing.

## Verification, collection and publication

- CASE-002: **59/60 RPC attempts**, including one handshake network failure and one
  ordinary retry; 30/30 source accesses including one staking-page connection failure/retry.
- CASE-003: **29/60 RPC attempts**, including one log-page timeout and one ordinary
  retry from the failed page to the fixed end. Exchange scan: 1,086 logs; PAPER: 104.
- CASE-004: **20/60 RPC attempts**; staking scan: 80 logs, plus the four-request
  targeted distribution follow-up at its separately registered block.
- CASE-005: **10/60 RPC attempts**, including the selected pair's terminal receipts.
- Total: **118 new RPC attempts**, 116 successful and two failed. No searches,
  paid service, credentials, trace RPC, signing, broadcast or deployment. CASE-001's
  original 85 attempts and old records are unchanged.

Thirty source reads include official docs, frontend modules and three public
protocol-summary endpoints. Exact HTTP retrieval intervals and SHA-256 body hashes
were captured. API summaries retain their own later source blocks. Script bodies,
raw logs, input signatures, account joins and original HTTP/RPC responses stay private.

Three small offline helpers were added with explicit inputs and bounded domains.
Five focused tests were written first: four failed on unimplemented behavior, then
all five passed; the fifth checks input rejection. A bounded scratch VM compared
240 mint, 240 bust and 240 pending-reward inputs against the acquired bytes. Six
additional synthetic liquidation cases exercised the actual dispatch-to-price-gate
path with a controlled oracle return, covering both sides just below, equal to and
above the trigger. The scratch interpreter is not shipped or claimed to be an
independent EVM. No actual historical execution was reproduced by these checks.

Final suite/type/record checks and independent review are reported in
[STATUS](../../STATUS.md). New case summaries are research records, not validated
historical chain snapshots. Missing decisive historical inputs still block M1.
