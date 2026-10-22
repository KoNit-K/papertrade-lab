# Mechanism map

**Contract set 2:** [note 015](research-notes/015-contract-set-2.md) adds the official eight-change guide and retained-code checks. Builder rate/base and named governance roles now have source-level answers; exact fee accounting, payment and upgrade chronology remain partial.

Status: research agenda, not a verified protocol specification. Updated: 2026-10-22.
This map separates source descriptions, partial bytecode support, provider-reported
cases and independent reproduction. No mechanism has a complete independently
reproduced historical settlement; three bounded research arithmetic helpers exist.
Source IDs resolve in the [source index](sources.md); an unread seed is a lead, not evidence.
The [CASE-001 interface follow-up](research-notes/003-historical-interface-recovery.md)
adds partial bytecode, storage and call/position observations without upgrading
any economic mechanism to independently reproduced.

## A proposed investigation path

```text
User intent → interface → relayer → batch execution → exchange state
                                  ↓                  ↓
                           execution evidence   balance / claim / token changes
```

The [official architecture page](https://docs.papertrade.xyz/how/architecture/)
read on 2026-10-21 (S2) describes signed intents passing through a relayer and
BatchExecutor to Exchange, with pricing obtained through a precompile wrapper.
The diagram reflects that description; it is not an observed transaction trace. Each arrow needs version-specific evidence. Read-only
HyperCore dependencies, governance, and off-chain scheduling may cross these boundaries.

| Area | Research question and observable boundary | Source leads | Unknowns | Next verification action |
|---|---|---|---|---|
| Architecture | Which component accepts intent, executes it, and stores balances? Public interface versus server internals. | S2, S10 | Actual deployment path and hidden scheduling | Compare architecture text with a public transaction trace, recording unobserved steps. |
| Deployment, roles, upgrades | Which proxy, implementation, role, and parameter set apply? Public state versus governance promises. | S4, S5 | Proxy type, implementation history, role holders, effective upgrade interval | Pin a block and hash, identify proxy type before reading implementation slots, then record code hash and role evidence. |
| Pricing | How do displayed, quoted, and executed prices differ? UI versus execution input. | S11, S10 | Units, quote age, precompile semantics, freeze conditions | Obtain one timestamped quote and execution context; separate missing intermediate prices. |
| Profit and fees | Which transformations connect gross profit to credited profit? Calculation versus display. | S3; OBS-003 | Deployed formula, order of operations, parameters, integer rounding | Bind parameters to a case; independently compute each stage and compare receipts/state. |
| Direction and opening limits | Why can one side fail? Interface, relayer admission, contract risk checks. | S5; OBS-001 | Directional capacity, reservations, stale state, account limits | Capture redacted error and contemporaneous limits; do not explain a historical rejection with today's cap. |
| Liquidation, leverage, closing | Are maximum leverage, isolated margin, and full closure enforced at the same layer? | S5, S1; OBS-005 | Market/version differences; supported close sizes; liquidation buffer | Split into atomic claims and compare public schema, UI, and version-bound execution evidence. |
| Cash, claims, payout queue | What is spendable now versus owed? Ledger credit versus liquid assets. | S6; OBS-002, OBS-003 | Queue rules, liquidity, partial payment, priority | Reconcile pre/post cash, liability, and payout events without counting the same value twice. |
| Claim-funded margin | Can claims fund positions and how do losses affect them? Funding source versus trade outcome. | S6 | Distinct cash and claim state transitions | Obtain documented branches, then design separate cash/claim ledger cases. |
| PAPER issuance | Is a displayed marginal rate comparable to actual tokens divided by eligible loss? | S7; OBS-004 | Eligible basis, curve integration, high-water state, units | Recover interval endpoints and mint amount; test average versus marginal rate as competing explanations. |
| Staking and rewards | Where do distributable rewards come from, and when are they available? Accrual versus payment. | S6, S7, S1 (leads only) | Reward indexing, queue interaction, distribution conditions | Locate primary staking documentation and relevant events before designing a ledger. |
| Deposits and withdrawals | Which stage moves funds and which only signals intent? Cross-layer lifecycle. | S2, S4, S10 | Intermediate accounts, confirmation rules, failure recovery | Map an existing public lifecycle using read-only receipts; no deposit checks or maintenance calls. |
| Signatures and permissions | What is authorized, for how long, and how is replay prevented? Signature fields versus effective roles. | S1, S4, S5 | Domain, nonce, expiry, session scopes, revocation | Read versioned public structures; only decode existing safe data, never generate a live signature. |
| Relayer and waiting | Where can intent acceptance, batching, expiry, or failure be observed? External timing versus hidden scheduling. | S2; OBS-002 | Server receive/broadcast times, queue discipline, censored failures | Record known time intervals and missing timestamps; distinguish intent waiting from payout waiting. |
| Frontend/API evolution | Can displayed rules lag contracts or change independently? Public bundles and schemas versus implementation. | S8, S9, S12, S1 | Actual tool compatibility, bundle history, schema drift | Hash a permitted public snapshot and compare versions; REA output remains inference until independently supported. |

## Announcement and changed-rule follow-up

[Note 014](research-notes/014-official-announcement-crosscheck.md) separates official
claims from acquired-code support for supply-relative issuance, insolvency timing,
PAPER transfer gates and the on/off-hours profit band. Builder whitelisting is an
announced initial policy; 15× bot profitability effects, OI relaxation and complete
attack elimination remain unverified. Prior flat/tail results retain their dated
scope; the historical helpers are not current-mode calculators.

## What would change this map

A missing API field does not establish a missing contract capability. A successful
batch does not establish success of every intent. Identical descriptions copied
between sources are not independent confirmation. A future mismatch should update
the relevant claim and version scope, rather than silently rewrite prior results.

Read the [first note](research-notes/001-winning-trade-payout.md) for one concrete
investigation, or contribute a competing explanation via [the contribution guide](../CONTRIBUTING.md).

## Economic-path evidence boundary

[Candidate 4](research-notes/004-economic-path-and-state-audit.md) supplies a
same-case match for deadband, impact and fee arithmetic. Historical state and
execution price remain unavailable. Earlier default-RPC code/storage temporal
bindings are withdrawn; returned bytecode analysis does not establish deployment
at a historical block. The homepages separately summarize current official
margin/position rules. No mechanism claim is promoted to reproduced.

## Current partial results

[Note 006](research-notes/006-current-mechanisms.md) adds registered CASE-002–005:
frontend queue ranks and state transitions; loss/liquidation PAPER basis receipts;
staking accumulator and claim support; a same-account opposite-position example
with both terminal closes; and liquidation buffer/inequality recovery. Each
result retains its source/version limits. Queue scheduling and full cash/claim,
reward and supply reconciliation remain open. The homepages summarize practical
mechanics; case records keep detailed coordinates and missing inputs.
