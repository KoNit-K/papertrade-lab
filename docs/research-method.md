# Research method

Updated: 2026-10-21. This describes the method; it is not an implemented validator.

## Separate five dimensions

| Dimension | Values / interpretation |
|---|---|
| Provenance | `official_doc`, `chain_observation`, `frontend_observation`, `api_observation`, `user_report`, `third_party`, `model_inference` |
| Support | `unverified`, `supported`, `conflicting`, `refuted`; these are not a linear score |
| Reproduction | `not_attempted`, `reproduced`, `mismatch`, `blocked` |
| Implementation | `not_started`, `partial`, `implemented`; a working model can still be wrong |
| Scope | Deployment, execution order, block/time range, parameters, frontend/API/doc/tool versions; unknown stays null |

A successfully read official page supports a statement about what the page says.
It does not prove deployed behavior. A third-party SDK can suggest a formula but
cannot supply independent expected outputs for a model that copies it. A user
report motivates a question; its details and protocol attribution still need evidence.

## Concrete claim registration example

The following is an actual unverified research hypothesis derived from OBS-003,
not an assertion that a particular transaction paid a particular amount.

```yaml
claim_id: CLM-003-A
statement_en: "A fixed ten-percent deduction explains the reported winning-trade payout."
statement_zh: "固定扣减百分之十足以解释所报告盈利交易的到账。"
provenance_kinds: [user_report, model_inference]
support_status: unverified
reproduction_status: not_attempted
implementation_status: not_started
observation_ids: [OBS-003]
evidence_ids: []
counterevidence_ids: []
source_dependencies: []
scope:
  origin_domain: null
  chain_id: null
  block_number: null
  block_hash: null
  proxy: null
  implementation_code_hash: null
  parameter_snapshot: null
falsification: "A version-bound case with complete inputs contradicts the fixed-rate prediction."
missing_inputs: [execution_prices, position, parameters, receipt, pre_post_ledger]
verification_command: null
limitations: "No identified transaction; seed descriptions are not execution evidence."
```

An empty evidence list is deliberate. Later source statements must get their own
claims; they cannot silently upgrade this report to `reproduced`.

## From question to result

1. State a falsifiable claim and alternatives before selecting favorable examples.
2. Record the source URL, actual collection time, source-stated update time, tool
   version, retrieval method, content hash, redaction, and redistribution status.
3. Bind chain evidence to chain ID, block number/hash, proxy, actual implementation
   and code hash, transaction/log order, and relevant parameter snapshots.
4. For a batch, identify the specific intent and its outcome. End-of-block state
   may include later transactions and is not automatically the pre-state of a case.
5. Implement independently with explicit integer units, signedness, scaling,
   rounding, width, and overflow/revert behavior. Keep discovery and holdout cases separate.
6. Compare against independently sourced execution outputs. Report matched fields,
   mismatches, unavailable inputs, and commands actually run. Preserve failed cases.

Git blob hashes identify file objects, not commits. File SHA-256 is not EVM Keccak
code hashing. Hashing a local capture does not verify its accuracy or authenticity.
URLs alone are not immutable evidence. Copied sources must retain dependency links.

## Version and timing limits

Version identity combines chain, proxy, implementation code hash, block range,
parameters, frontend bundle, observed API schema, documentation snapshot, and tool
versions. A parameter change can invalidate results without a code upgrade.
Mark affected claims `needs_revalidation`; do not inherit old verification.

Without observed broadcast time, acknowledgement-to-block time cannot be split
precisely into relayer and chain delay. Record clock source, granularity, uncertainty,
missing events, failed/expired cases, and still-pending samples. First observed time
is not necessarily effective time. Do not infer intent or causation from correlation.

## Read-only and simulation boundaries

Collection must use a bounded host/path/RPC-method allowlist. A read-only RPC POST
may be acceptable; intent submission, cancellation, signatures, deposit checks,
claims, and maintenance actions are not read-only. No bypass of access controls.

A generic EVM fork is not assumed to implement HyperCore precompiles. Recorded
responses or substitutes must be labeled conditional simulation. REA is optional;
its inferred interfaces are not recovered original source or chain proof.

See [data policy](../DATA_POLICY.md) and [status](../STATUS.md). No model tests,
chain replays, or REA runs exist in the initial documentation release.
