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
| S8 | [REA EVM bytecode](https://github.com/morluto/rea/blob/main/docs/evm-bytecode.md) | Subsequently read at the pinned 6.7.0 release ref and actually run; see REA sources below |
| S9 | [REA browser observation](https://github.com/morluto/rea/blob/main/docs/browser-observation.md) | Permitted observation and capture boundaries |
| S10 | [Hyperliquid: Interacting with HyperCore](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore) | Precompile and system behavior needed for future simulation |
| S11 | [Pricing: BBO precompile](https://docs.papertrade.xyz/how/pricing-bbo/) | Execution-price inputs and market state |
| S12 | [REA](https://rea.tools/) | Site not read; subsequent pinned npm installation is recorded below |

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

Code/storage responses to historical-tag requests were observed. The subsequent
[state audit](research-notes/004-economic-path-and-state-audit.md) withdraws their
historical temporal bindings: the default provider supports latest-only state.

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

## Economic path and product rules — 2026-10-21

Read official [trades/margin](https://docs.papertrade.xyz/learn/trades-pricing/),
[FAQ](https://docs.papertrade.xyz/intro/faq/),
[liquidation](https://docs.papertrade.xyz/learn/liquidations/),
[risk](https://docs.papertrade.xyz/how/risk/),
[BBO](https://docs.papertrade.xyz/how/pricing-bbo/) and
[impact](https://docs.papertrade.xyz/how/asymmetric-impact/) pages. All six display
2026-10-06 as their update date; successful direct GET capture times and body
hashes are in [the economic record](../research/cases/001-economic-recovery.json).
Three preceding web opens failed. Re-read the official HyperEVM JSON-RPC page:
its latest-only code/storage limitation is now an explicit historical-input blocker.
These current documentation descriptions do not authenticate historical parameters.

Returned economic-library bytes and event amounts support a same-case integer
consistency check, not an independent settlement result. The new source accounting
is 10/20 explicit accesses; no third-party runtime/source body is redistributed.

## Historical archive and recorded-read sources — 2026-10-21

[Note 005](research-notes/005-historical-source-feasibility.md) and its
[access/digest record](../research/cases/001-archive-feasibility.json) cover official
RPC/raw-block/market-history documentation, official node and sync/indexer examples,
nanoreth at commit `2c6525dadb8f47d4b6cf88f2401561509fab9b00`, and provider capability
pages. The key new source observation is a block extras API with recorded read
inputs, gas limits and results; no actual CASE-001 extras or trace was retrieved.
Provider capability claims are not successful target-block tests. Failed reader
accesses and the unconfirmed Dwellir search-result inventory remain explicit.

Source-file Git blob hashes were checked locally. UTF-8 SHA-256 hashes identify
connector-returned source text, not remote HTTP bodies, deployed client versions
or historical EVM state. Raw source text stays private; only original summaries,
URLs and digest metadata are published. This increment used 30 explicit source
accesses and eight search queries; exact retrieval times and a complete local
archive of web-reader responses were not recorded. No new production RPC ran.

## Current mechanism sources — 2026-10-21

[Note 006](research-notes/006-current-mechanisms.md) and the
[shared evidence record](../research/cases/002-005-current-evidence.json) describe
30 explicit official-page/module/API reads, including one connection failure and one normal
retry of the staking page. Exact retrieval intervals and SHA-256 response-body
hashes were recorded. No search queries or new credentialed/paid services were used.

Primary descriptions include architecture, solvency/queue, mint curve, staking and
claims, emissions, dividends, liquidation, risk, trading rules and contract addresses.
Frontend modules were inspected only as text, including intent rank polling,
acknowledgement uncertainty, user-state streams, and deployment definitions. Three
unauthenticated protocol-summary endpoints were read; no account query or signed
intent was submitted. API source blocks differ from the event sampling window.

The main contract addresses agree across docs and the frontend, but a collateral
address field differs; its custody/transport relationship is unverified. Current
code/storage retrievals remain acquisition-time observations without historical
transaction binding. Public records contain original explanations and digest
metadata; raw bodies, signatures and private account joins are not redistributed.

## Queue and payment follow-up sources — 2026-10-21

[Note 007](research-notes/007-queue-and-dividend-payment.md) and its
[evidence ledger](../research/cases/002-004-followup-evidence.json) record 22 source
accesses (19 successful, three connection failures) and four search queries.
Fetched app, hooks and trade bytes match the prior captures; the new order-input,
typed-data and funding-route modules were inspected as text. No frontend code
was executed, signed intent sent or wallet connected. The owner's observation of
no limit/TP/SL/scheduled orders is distinguished from the supporting current UI
and signed-schema inspection; it is not inherited as a universal protocol rule.

A registered aggregate `spotMeta` request (no account fields) identifies token 0
as USDC with eight wei decimals at acquisition time. This verifies denomination,
not the recipient's final balance.

Official Hyperliquid CoreWriter encoding, interaction timing and read-only ledger
API documentation explain the spot-send action and its confirmation boundary.
One CoreWriter document access used the web reader after direct connection
failures. Its digest identifies the retained reader result, not an upstream HTTP
body, and precise request start/end times are unavailable. Scheduler searches
did not locate primary backend scheduling evidence; third-party dashboard search
results were not used to assert server policy.

A narrowly registered, derived-chain-account ledger query was rejected by automatic
approval review before execution; that increment had zero HTTP attempts. It was
later explicitly authorized and completed in [note 008](research-notes/008-core-credit-and-relayer-pressure.md). No alternative account lookup bypassed that refusal. Real receipts
prove a claim credit and a later CoreWriter withdrawal action, not final HyperCore
credit, complete reward provenance or a subsequent bridge payment.

## Authorized Core credit and public relayer telemetry — 2026-10-21

[Note 008](research-notes/008-core-credit-and-relayer-pressure.md) and the
[Core confirmation](../research/cases/004-core-payment-confirmation.json) record one
authorized official non-funding-ledger read, following the prior recipient/time
selection. Exactly one incoming USDC transfer matches the prior withdrawal's sender,
recipient and amount. Other account activity, addresses, ledger hashes and the raw
response stay private. This confirms provider-reported HyperCore credit, not full
reward provenance, another-chain payment or independent consensus execution.

The [scheduler record](../research/cases/002-scheduler-investigation.json) has 23/30
access units and 8/8 searches: 21 successful units, a connection failure and a source
repository 404. Stream connection/connect/subscribe operations are conservatively
counted separately. Current app/hooks bytes match prior captures. The official
anonymous `pressure:current` and `trading:current` feeds provide actual aggregate
backlog and published intake configuration, not per-intent scheduling records.
No account channels or signed intent were used in this investigation.

The auditor's own Guardian report supplies scoped operational context. It does
not audit the server scheduler or establish source equivalence to the deployment.
Reader/connector digest metadata identifies retained tool responses; ordinary HTTP
entries hash response bytes, while stream units share the corresponding private
capture digest. No third-party search-result claim establishes FIFO or retry policy.

## Distribution reserve follow-up (2026-10-21)

[Note 009](research-notes/009-distribution-reserve-ledger.md) and its
[structured outcome](../research/cases/006-event-ledger-outcome.json) record eight
successful bounded official HTTP reads, eight search queries, and 25 RPC attempts
(24 successful, one network failure). The independent source-led 500-block window
49122484–49122983 was registered before the event scan; old windows are unchanged.
The official [protocol summary](https://exchange.papertrade.xyz/query/protocol/summary)
and [PAPER activity](https://exchange.papertrade.xyz/query/protocol/paper/activity)
are mutable interfaces; their retained response digests and source heights, rather
than their future contents, identify this observation. Original payloads remain private.
The summary omits a source block hash, so block-height agreement is not an independent
canonical-state proof.

Three provider-reported distribution receipts, subsequent claim events and the
captured summary reconcile the aggregate reserve. Acquired runtime interpretation
and forty synthetic internal-routine checks support event-word meanings. Accumulator
denominators are backsolved from the same API and event deltas, not authenticated
historical stake snapshots. The current [FAQ](https://docs.papertrade.xyz/intro/faq/),
[session-key page](https://docs.papertrade.xyz/learn/session-keys/) and sitemap do
not provide a versioned server scheduler policy; third-party commentary was excluded.
No real unstake, LP-surplus funding or active debt branch was established by this
sample, and no complete per-user settlement or external payment is claimed.

## Actual REA analysis (2026-10-21)

[Note 010](research-notes/010-rea-frontend-and-contract-crosscheck.md) and its
[metadata record](../research/cases/007-rea-analysis.json) retain actual REA 6.7.0
analysis identities, execution times, output digests and partial coverage. The
record reuses existing public frontend captures and five runtime byte identities;
no new Papertrade page, account or RPC request was made.

The [npm package](https://www.npmjs.com/package/rea-agents/v/6.7.0) was installed in
a separate local directory. The downloaded tarball matches registry integrity and
all 1,775 installed published regular files. These checks do not authenticate npm
signatures, attestations or every dependency. Actual CLI help and the installed
version's contracts guided invocation.

The official
[JavaScript reconstruction](https://github.com/morluto/rea/blob/27dc42d10249f0410904a75c0997842eb03b931c/docs/javascript-artifact-reconstruction.md),
[application workflows](https://github.com/morluto/rea/blob/27dc42d10249f0410904a75c0997842eb03b931c/docs/javascript-application-workflows.md)
and [EVM guide](https://github.com/morluto/rea/blob/27dc42d10249f0410904a75c0997842eb03b931c/docs/evm-bytecode.md)
were downloaded at the release ref. A separate CLI-guide download timed out and
was not treated as read. Five offline EVM results report EVMole 0.9.3 on local Linux
x64; the frontend results retain main-bundle heap failures and exact-excerpt scope.
Tool documentation describes capabilities; returned Evidence supports only the
selected analysis. Original captures, code excerpts and complete REA payloads are
not redistributed. Existing economics, user reports and historical-state gaps
retain their earlier provenance.
