# First public case: intake and stop conditions

Status: bounded intake executed on 2026-10-21 after the M0 tooling push.
[CASE-001 report](research-notes/002-first-case-intake.md): 500 blocks, 29 RPC
attempts, one earliest event lead retained; no eligible winning settlement
established. Historical inputs remain incomplete and reproduction is blocked.

## Bounded selection rule

Before querying a public provider, record a fixed finalized block interval, request
budget, provider capabilities, and the reason for the interval. Within it, order
candidate settlement events by block, transaction index and log index. Select the
first ordinary winning close for which the intended position and all decisive
historical inputs can be established. Record every skipped candidate and reason;
do not choose the highest profit or tune selection to match a model.

The first intake used a bounded finalized-header discovery before fixing
49105284–49105783 and both boundary hashes, then queried events. See the
[registered plan](../research/cases/001-intake-plan.json). This plan was stored
locally before the scan and published afterward, not publicly preregistered.
The address page is a deployment lead; proxy classification and implementation
reads must precede historical deployment claims. Do not associate the selected transaction
with any anonymous report author, even if amounts happen to resemble a report.

## Required packet and stop conditions

| Input | Required check | If absent |
|---|---|---|
| Chain, block number and hash | Stable chain identity and finalized block consistency | No version-bound execution claim |
| Proxy and implementation | Evidence of proxy type, historical implementation and code hash | Do not substitute an address from current docs |
| Parameters and position | Historical state at the relevant execution point, with units | Do not use present defaults |
| Batch and intent outcome | Intent-specific success and intra-transaction order | Batch success alone is insufficient |
| Prices and arithmetic | Exact execution inputs, scale, sign and rounding | Limit result to observable fields |
| Ledger before/after | Isolate earlier/later transactions and unrelated account flows | End-of-block delta cannot silently become the case delta |
| Independent expected result | Receipt/state/trace provenance separate from the model | Do not test against the model's own output |
| Redistribution and privacy | Review minimal evidence and metadata for identity joins | Publish only approved summaries and missing-input report |

Only read-only provider methods with explicit budgets may be used. No wallet,
signature, transaction submission, claim, cancellation or maintenance call may
be used to produce a case. If a provider rejects access or lacks historical state,
record it; do not bypass restrictions or replace missing fields with guesses.

## Expected report

State the sampling rule, included/excluded fields, version identity, observed
versus computed values, exact mismatches, replay command actually implemented,
and unavailable inputs. A future replay should be offline and preserve holdout
cases. Neither this checklist nor a successful JSON parse constitutes M1 completion.
