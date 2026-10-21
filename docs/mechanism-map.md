# Mechanism map

Status: research agenda, not a verified protocol specification. Updated: 2026-10-21.
Every row remains **unverified / not_attempted / not_started** for mechanism
support, independent reproduction, and model implementation respectively.
Source IDs resolve in the [source index](sources.md); an unread seed is a lead, not evidence.

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

## What would change this map

A missing API field does not establish a missing contract capability. A successful
batch does not establish success of every intent. Identical descriptions copied
between sources are not independent confirmation. A future mismatch should update
the relevant claim and version scope, rather than silently rewrite prior results.

Read the [first note](research-notes/001-winning-trade-payout.md) for one concrete
investigation, or contribute a competing explanation via [the contribution guide](../CONTRIBUTING.md).
