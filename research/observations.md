# User observations

Registered: 2026-10-21. Registration is not the original observation date.
All five reports start as `user_report / unverified / not_attempted`.
These are authorized, anonymized summaries, not a release of underlying personal records.

For every report: `origin_domain`, `observed_at`, `reported_at`, wallet,
transaction, intent ID, amounts, screenshots, frontend version, and deployment
are **unknown/not provided**. Numeric descriptions below are reported impressions,
not independently measured transaction values. No wallet association is published.
Do not merge Popdex and Papertrade identities without evidence of the relevant
site, product, and time; attribution of the historical observations is unresolved.

| ID | Report | Competing explanations | Evidence needed and acceptance boundary |
|---|---|---|---|
| OBS-001 | BTC could be shorted but not longed. | Directional open-interest cap; market/global pause; account/position limit; stale UI; relayer admission rule. | Original domain/time, redacted error, intended side/size, same-time state and limits. Result must distinguish `confirmed_reason`, `supported_candidate`, and `insufficient_evidence`. |
| OBS-002 | Opening and closing involved waiting. | Client delay; admission queue; batching; transaction inclusion; indexing; separate payout queue. | Submit/ack times and their clocks, status transitions, intent outcome, receipt and UI timing. Unknown broadcast time stays unknown; include pending and failed samples. |
| OBS-003 | Profit was previously understood to incur a 10% deduction. | Fixed deduction; state-dependent adjustment; different fee basis; execution price; display denominator; delayed payment. | Exact position, prices, historical parameters, events and ledger deltas. Do not assume 10% is the expected result. See the [payout note](../docs/research-notes/001-winning-trade-payout.md). |
| OBS-004 | PAPER per loss appeared to fall from about 100:1 to the teens per 1. | Marginal versus average issuance; changing curve interval/high-water state; eligible-loss basis; units; version differences. | Define numerator/denominator and assets first; obtain interval state, eligible loss and actual mint. Reported ratios are approximate and their original unit convention is unknown. |
| OBS-005 | The interface was understood to offer up to 1000× leverage, isolated margin, and only full closure. | UI choice; API schema; signature structure; contract rule; market/version differences. | Split leverage, isolation, and close-size into separate claims. Missing UI controls do not prove contract impossibility. |

## Evidence intake

A contributor may offer a correction without sharing a wallet or transaction.
Never infer disclosure permission from participation. Follow [DATA_POLICY.md](../DATA_POLICY.md)
before submitting any packet. The five summaries above are approved for this
project; additional identifying data requires separate, specific permission.
