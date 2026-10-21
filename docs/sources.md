# Sources and access status

Reviewed: 2026-10-21 (Asia/Singapore). Sources are leads or source statements,
not independent chain reproduction. Source IDs remain stable as evidence grows.

## Read during this launch

| ID | Source | Actual access and bounded use |
|---|---|---|
| S2 | [Papertrade architecture](https://docs.papertrade.xyz/how/architecture/) | Web reader failed; direct unauthenticated HTTPS GET succeeded and HTML text was read. Describes the relayer/batch/exchange path. No deployment was queried. |
| S3 | [Papertrade asymmetric impact](https://docs.papertrade.xyz/how/asymmetric-impact/) | Web reader failed; direct unauthenticated HTTPS GET succeeded and HTML text was read. Describes staged profit adjustment; not verified against a transaction. |
| L1 | [Apache-2.0 text](https://www.apache.org/licenses/LICENSE-2.0.txt) | Read from the Apache Software Foundation and downloaded verbatim as LICENSE. |

S2 and S3 each display **Last updated: 2026-10-06**. That is a page-stated date,
not a deployment date or proof of freshness. The HTML captures are retained locally
outside the repository; their redistribution terms have not been established.
Only original summaries, URLs and hashes are published. Reading these pages does
not establish that they explain the unidentified historical user observations.

Retrieval used curl 8.7.1 (Apple platform build). The command was `curl --fail --location --max-time 25 <source-url>`; extraction used
Python's standard HTML parser. Capture dates are known; exact retrieval timestamps
were not recorded during P0. A future retrieval is a new evidence record, not a
retroactive timestamp for these captures.

| Capture | SHA-256 of downloaded bytes |
|---|---|
| S2 HTML | `300b5911c29623550f8b6cdbf4f2569297c854b7450f1efb078d59a1cc0bcaa5` |
| S3 HTML | `6c6616931e5365224bbdc2940dbc4f5230889b36ebbf4d42a72d0929037fea1a` |
| L1 LICENSE | `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30` |

Hashes identify bytes, not truth, deployment versions, or EVM code hashes. This
index is a reading log. The related record structure now has an offline validator;
it cannot verify the unpublished source bytes or establish their truth.

## Source seeds not read during P0

The URLs below come from the research brief. Their content, current availability,
licenses, update dates, and claimed test results were **not** rechecked for P0.
S4–S7 were subsequently read in the post-launch increment below; all other seeds remain unread.
No inherited blob hash is presented as a commit or a new verification.

| ID | Seed | Intended question |
|---|---|---|
| S1 | [nirholas/papertrade-sdk README](https://github.com/nirholas/papertrade-sdk/blob/main/README.md) | Community API, signature and settlement descriptions; compare independently later |
| S4 | [Contract addresses](https://docs.papertrade.xyz/dev/contract-addresses/) | Deployment and proxy identification |
| S5 | [Risk](https://docs.papertrade.xyz/how/risk/) | Directional limits, pauses and roles |
| S6 | [Solvency and queue](https://docs.papertrade.xyz/how/solvency-queue/) | Cash, claims, funding and payout branches |
| S7 | [Mint curve](https://docs.papertrade.xyz/how/mint-curve/) | Eligible losses, marginal and average issuance |
| S8 | [REA EVM bytecode](https://github.com/morluto/rea/blob/main/docs/evm-bytecode.md) | Actual tool scope, version and platform limits |
| S9 | [REA browser observation](https://github.com/morluto/rea/blob/main/docs/browser-observation.md) | Permitted observation and capture boundaries |
| S10 | [Hyperliquid: Interacting with HyperCore](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore) | Precompile and system behavior needed for future simulation |
| S11 | [Pricing: BBO precompile](https://docs.papertrade.xyz/how/pricing-bbo/) | Execution-price inputs and market state |
| S12 | [REA](https://rea.tools/) | Tool identity and installation source; no installation performed |

The task brief is not mechanism evidence and is not redistributed. No SDK test
suite, REA analysis, authenticated API capture, wallet session, archival node,
transaction trace, or contract-state read was performed for this launch.

## Post-launch reading: first M0 increment

S4, S5, S6 and S7 were each retrieved successfully by unauthenticated HTTPS GET
on 2026-10-21 after the initial release, then read as HTML text. All four pages
state an update date of 2026-10-06. No production API or chain state was queried.
Exact client start/end times, HTTP 200 statuses, curl 8.7.1 and SHA-256 digests
are in the [evidence records](../research/records/evidence.json).

- **S4:** the address page is a proxy/deployment lead, not an implementation verification.
- **S5:** separate directional caps and administrative gates suggest distinct candidates for OBS-001, not its confirmed cause.
- **S6:** cash-funded and debt-funded settlement branches require separate reconciliation. Its eventual-payment wording does not establish a payment deadline or sufficient future backing.
- **S7:** eligible basis, tracked LP and high-water progress must be distinguished before comparing a marginal display with average PAPER received.

These are bounded source summaries. The original pages are not mirrored; current
and historical deployed behavior remain unverified. See [record limitations](evidence-records.md).

## M0 tooling sources — 2026-10-21

- [HyperEVM endpoint and chain identity](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm): read through the web reader; used to constrain the collector to the documented mainnet RPC and chain 999.
- [HyperEVM JSON-RPC](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/json-rpc): read through the web reader; documents a 50-block log range and lack of historical state on the default implementation. Live capabilities are still a separate check.
- [EIP-1967](https://eips.ethereum.org/EIPS/eip-1967): read for the implementation-slot definition, not evidence that any particular proxy uses it.
- [noble-hashes](https://github.com/paulmillr/noble-hashes): primary project documentation read; registry/package metadata pins 2.4.0, MIT, for Keccak. No upstream source is vendored.
- S4 address page was re-read as HTML after one TLS failure and one normal retry. This confirms the current page content only; it does not establish historical deployments. Exact retrieval timestamps were not recorded for this documentation read. Raw HTML remains outside public history.

No external page's statements upgrade the five historical reports or establish a
settlement result. The default RPC's documented archival limitation must not be
worked around by substituting current state.

## CASE-001 intake sources — 2026-10-21

- The official public RPC was queried at fixed blocks; actual runs, limitations and
  reviewed metadata are linked in the [intake report](research-notes/002-first-case-intake.md).
- [DefiLlama adapter](https://github.com/DefiLlama/dimension-adapters/blob/815e50b0b599b5bc88cd12f7db60598d122442cc/fees/papertrade.ts),
  blob `aca70e4c45225dd60ec8e4987c4f93eebc89eb98`: read via GitHub connector;
  third-party event-signature lead, not historically authenticated ABI.
- [Community protocol reference](https://github.com/nirholas/papertrade-sdk/blob/483a760ef596564e5ad799357a92e5726dada9ba/docs/PROTOCOL.md),
  blob `493d94301845396243714696924fc448958b5aed`: read, not executed. Its reported
  validation results remain source claims; they are not this project's findings.
- Explorer source retrieval was unsuccessful. No verified source or ABI obtained.

Pinned historical code/storage responses were observed despite the documented
default archival limitation; general archival/trace capability remains unestablished.

## Historical interface follow-up — 2026-10-21

The [follow-up note](research-notes/003-historical-interface-recovery.md) records
Sourcify's no-match response, an unverified implementation explorer page, an IPFS
metadata timeout, the official frontend entry and three inspected static modules,
and a public event-signature dictionary. Current frontend definitions are leads,
not authenticated historical ABI. Body hashes, failed attempts, null retrieval
timestamps and source-access accounting are in the [recovery record](../research/cases/001-interface-recovery.json).
No third-party runtime, frontend module or ABI file is redistributed. Candidate
signatures, storage extraction descriptions and summaries were independently
written from hash comparisons and manual historical bytecode inspection.
