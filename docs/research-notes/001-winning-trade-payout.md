# Why did a winning trade pay less than expected?

**Exploratory note — not independently reproduced.** 2026-10-21.
Related report: [OBS-003](../../research/observations.md). No transaction, amount,
wallet, original timestamp, or observed domain is available for this report.

## The question

A user previously understood the deduction on a winning trade to be 10%.
That interpretation does not yet establish a fee schedule or explain an actual
payout. Before testing it, we need to specify what “profit” and “paid” meant:
price return, return on margin, gross position PnL, credited profit, spendable
balance, and external withdrawal are different measurements.

This note proposes an investigation that can distinguish a smaller entitlement
from an entitlement that is not yet available. It reports no completed replay.

## Candidate stages to investigate

```text
Executed position and prices
  → gross profit/loss
  → any version-specific adjustment or dead zone
  → any fee on its defined basis
  → settlement entitlement (including applicable margin treatment)
  → cash/balance credit and/or unpaid claim
  → later payment or withdrawal, if observed
```

These are candidate accounting boundaries, not a proven execution order. The
relevant implementation may combine, omit, or order stages differently.

| Candidate stage | What could change the expected result? | Evidence needed |
|---|---|---|
| Position and execution | Displayed price differs from fill; size or side differs from the user's denominator | Position fields, execution prices, units, intent outcome |
| Gross PnL | Leverage and margin return are confused with price return; integer rounding differs | Exact size, collateral treatment, arithmetic semantics |
| Adjustment | A nonlinear or state-dependent adjustment differs from a fixed fraction | Version-bound formula and all decisive parameters/state |
| Fee | Fee applies to a different profit basis or stage | Rate, denominator, ordering, charged amount/event |
| Ledger credit | Returned margin is included in one display but excluded in another | Cash and claim pre/post balances; other account activity |
| Payout | Some entitlement remains unpaid or a later transfer is mistaken for settlement | Queue/claim events, liquid payout, subsequent receipts |

A reconciliation worksheet should track returned collateral, adjusted profit,
fees, immediate credit, and unpaid claim separately. This is not yet a conservation
formula: the correct signs and branches depend on funding source, liquidation,
and observed ledger semantics. Cash and claims must not be counted twice.

## What the primary description actually says

The [official profit-adjustment page](https://docs.papertrade.xyz/how/asymmetric-impact/)
was read on 2026-10-21 (S3; page-stated update 2026-10-06). It describes a deadband,
then an impact scaling step, followed by a fee of 2% of the scaled gain. Its 10%
value is a launch base-rate parameter, not a statement that every profitable
settlement loses exactly 10%. It also distinguishes the deadband-adjusted move
used by the implementation from a simple displayed price move.

This is **source testimony**, not a verified current fee schedule or replay of
OBS-003. It makes the fixed-deduction interpretation worth testing, but cannot
resolve an unidentified historical trade. We have not verified the deployed
formula, historical parameters, rounding, or credited result.

## Sources and competing explanations

The [source index](../sources.md) lists official design leads (S3 for profit
adjustment, S6 for accounting), a community implementation lead (S1), and their
actual reading status. The planning material is task input, not protocol evidence.
No unread page or third-party test count is treated as verification here.

- **Execution-price hypothesis:** using actual prices removes the discrepancy.
  It weakens if the user's expectation already used exact execution values.
- **Adjustment/fee hypothesis:** a version-bound computation predicts a different
  amount from a flat 10% deduction. Reject it for a case if independent outputs
  disagree with its complete-input prediction.
- **Display-definition hypothesis:** one number includes returned margin or
  measures a different denominator. Compare the definitions and account deltas.
- **Rounding hypothesis:** exact integer stages explain a residual. It cannot
  justify an arbitrarily large mismatch; derive a bound from actual operations.
- **Availability hypothesis:** entitlement is split between cash and an unpaid
  claim. It requires evidence of both branches, not just the absence of a transfer.
- **Version hypothesis:** earlier and later deployments or parameters differ.
  It requires historical evidence, not today's defaults.

These hypotheses can coexist. No fixed fee rate or current-deployment formula is
asserted in this release.

## Minimum case packet

Select one ordinary, already public winning settlement under a stated sampling
rule, without connecting it to the report author's identity. Needed fields are:
chain and block/hash; transaction and intent outcome; proxy and implementation
code/hash; transaction and intra-batch ordering; position and funding source;
execution inputs; historical parameters; relevant events; and pre/post ledger
state or a justified substitute. Record node capability and unavailable traces.

Use an independent integer implementation only after documenting these inputs.
Compare intermediate fields where observable. A match of the final number alone
may hide compensating errors. Reserve another case for validation rather than
using every case to tune the formula.

## Current conclusion and next falsification

There is insufficient evidence to explain the reported payout or affirm a fixed
10% rule. The useful result so far is a decomposition of the question and an
explicit collection plan. No SDK, model, REA analysis, or chain replay was run.

Next: read and version the relevant primary descriptions, register competing
claims, then seek a bounded public case with decisive historical inputs. If those
inputs cannot be obtained, publish the missing-input report and keep the case
`blocked` or `not_attempted`, as appropriate; do not fill gaps with current values.
