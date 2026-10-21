# Current status

Updated: 2026-10-21. **Research preview; M0 evidence tooling.**

## P0 scope

The initial release contains bilingual entry pages, a 14-area mechanism map,
five anonymized unverified reports, one exploratory payout note, research method,
source pointers, roadmap, contribution/data/security policies, and licensing.
P0 was published and read back through GitHub on 2026-10-21 as
[v0.1.0-alpha.1](https://github.com/KoNit-K/papertrade-lab/releases/tag/v0.1.0-alpha.1),
a public, non-draft prerelease bound to commit `54a5340215d1846709fc115d37e9f0c83a0d6f83`.
The current branch additionally contains the M0 records and validator increments below.

## Capability and verification

| Area | Actual status |
|---|---|
| Original research documentation | Present |
| User observations | 5 reports; all unverified; no identifying records |
| Source reading | Per-source status in [source index](docs/sources.md) |
| Structured records | 6 document evidence entries; 13 atomic claims; 1 documentation version; see [records](docs/evidence-records.md) |
| Evidence/version validator | Document records plus separate chain snapshot profile; historical identity, dependency, conflict and hash checks |
| Read-only collector / safe export tooling | Implemented for one public RPC and reviewed metadata-only export; see guides |
| Research arithmetic / full settlement replay | Three bounded offline helpers for mint integration, bust price and pending rewards; full settlement model and transaction CLI not implemented |
| Real transaction reproduction | Blocked: candidate 4 has a same-case arithmetic match; historical state/price unavailable and old state temporal bindings withdrawn |
| REA installation / outputs | Not performed / none |
| Local validator tests / strict type check | Implemented and run; see checks below |
| CI, model tests, document-site build | Not configured / not run |
| Wallet operations / cloud deployment | None |

See the [publication review](docs/publication-review.md) for actual P0 checks and their limits.

## Next three tasks

1. Complete actual intent submit/ack/execution timelines and missing queue/debt/distribution ledger cases identified in [note 008](docs/research-notes/008-core-credit-and-relayer-pressure.md).
2. Obtain archive/trace and recorded precompile evidence for CASE-001 and authenticate candidate 4 prestate, prices, parameters and ledger deltas.
3. Preserve registered selection rules and implement M1 only after decisive historical inputs and independent expected results are available.

M0 tools are implemented for the documented profile: official document records,
chain-999 block-end snapshots (EIP-1967 or explicitly incomplete), bounded public
RPC, and reviewed metadata export. This is not arbitrary HAR anonymization,
a transaction-prestate decoder or independent reproduction. The first bounded live intake is complete, with no eligible settlement established;
M1–M4 remain unimplemented. No milestone is closed by test counts alone.

## Checks for the post-launch increment

JSON syntax, stable-ID uniqueness, cross-file references, expected record counts,
source-capture hashes, and unattempted reproduction states were checked with a
temporary Python standard-library script. Local links, sensitive patterns and
whitespace were checked again for the changed files and outgoing commit.
No executable schema, model tests, chain replay or REA investigation was run.

## Checks for the validator increment

On 2026-10-21, with Node.js 26.8.2 and pnpm 11.25.0:

- `pnpm test`: 52 CLI/file integration tests passed, including negative cases.
- `pnpm typecheck`: strict TypeScript check passed.
- `pnpm validate:records`: 13 claims, 6 evidence records and 1 version accepted.
  No capture bytes were checked: all 6 raw captures remain unpublished.

The same 52 tests, type check and record check also passed in a fresh temporary
copy after `pnpm install --offline --frozen-lockfile --ignore-scripts`, using
the populated local package cache. The minimum Node.js version and Windows
were not tested; no hosted CI or dependency vulnerability audit was run.

The validator runs offline after dependencies are installed, does not execute
record commands, and rejects unsupported chain/reproduction records. It does not
perform redaction or grant permission to publish. No protocol/model tests,
transaction replay, REA investigation or production operation was run.

## Checks for the chain, collector and export increment

The implementation and scope are documented in [chain evidence](docs/chain-evidence.md),
[read-only collection](docs/readonly-collection.md), and [safe export](docs/safe-export.md).
Tests cover synthetic complete/incomplete snapshots, conflicting historical evidence,
Keccak versus SHA-256, unsupported reproduction, method/parameter rejection,
budgets, limits, pagination conflicts, real CLI files, exact-byte review, invalid
UTF-8, nested sensitive fields and exclusive output paths.

The loopback HTTP transport test initially encountered `listen EPERM` in a sandbox
that prohibits listening on localhost. It passed when run with local-listen access;
no production provider was used for tests. Reviewer findings were fixed and
regression-tested before push. All protocol claims remain unverified.

Final checks for this increment (Node.js 26.8.2, pnpm 11.25.0): **140/140 tests
passed**, strict TypeScript check passed, original records passed, and the
synthetic chain packet passed while retaining `protocol_reproduced: false`.
All checks also passed in a fresh temporary copy installed offline from the
frozen lockfile and populated package cache. Minimum Node/Windows compatibility,
hosted CI and a dependency vulnerability audit were not run.

## First bounded live intake

[CASE-001](docs/research-notes/002-first-case-intake.md) fixed blocks
49105284–49105783 before event reads. Across 29/30 RPC attempts, 28 succeeded
and one chain handshake failed with a network error; one normal retry succeeded.
The scan returned 1,039 logs and 294 third-party close-signature leads. The first
lead receipt was checked; remaining leads have a shared missing-input exclusion.
Two block-end implementation identities match, but neither transaction pre-state
nor a continuous unchanged interval is established. Two incomplete versions, nine
evidence items and two blocked claims passed the chain validator. Seven reviewed
metadata exports omit raw payloads. All mechanism claims remain unverified;
there is no integer settlement replay or eligible winning-case selection yet.

## Historical interface follow-up

[The follow-up](docs/research-notes/003-historical-interface-recovery.md) recovered
selector/topic preimages, three partial mapping roots, and a structural link from
batch item 0 to close position 1712506 and its emitted call result. These are
partial bytecode/layout observations, not authenticated full ABI, business-field
semantics, signature authorization or settlement reproduction. The first positive
signed-word pair is an ordinal-4 structural lead; the original ledger is unchanged.

Four additional bounded runs used 14/30 new RPC attempts at the same candidate
block; five metadata manifests were exported. The expanded private chain packet
passed with two incomplete versions, 14 evidence items (five reused), and two
blocked claims. Source lookup failures and a one-access post-plan source-budget
accounting overrun are disclosed in the note. No sampling-window expansion occurred.

The transaction lookup whitelist extension has seven new regressions; the full
**147/147** tests and strict type check passed. Full-test launch first encountered
an automatic permission-review timeout, then the allowed retry succeeded.
The homepages now explain project purpose and documented/observed mechanisms;
implementation status and evidence limitations remain in dedicated documents.
M1 remains blocked and unimplemented.

## Economic path and historical-state audit

[Note 004](docs/research-notes/004-economic-path-and-state-audit.md) traces the
returned Exchange bytecode to a separate economic library, recovers eight packed
instrument outputs, and matches candidate 4's post-deadband PnL, impact adjustment,
fee, fee split and aggregate return with integer arithmetic. This is a same-case
consistency result using the event exit, not independent execution reproduction.

**Correction to prior phases:** the default RPC documents latest-only code and
storage. The supposed predecessor state already marks candidate 4 closed; its
code/storage/parameter temporal bindings, and those of earlier CASE-001 responses
from this endpoint, are withdrawn. Returned byte hashes and old manifests remain
an audit trail. The validator checks declared consistency, not provider state age.
Actual historical BBO/frozen-price inputs, pre-state, authorization and ledger/queue
results remain missing. Candidate 4 is blocked; none is selected; M1 remains
unimplemented. The original order and 500-block window are unchanged.

This increment used 42/60 RPC attempts: 40 successful, one timeout and one network
failure, with one ordinary retry per stopped run. Five metadata-only exports were
reviewed; source accesses were 10/20. Homepages now explain isolated margin,
immutable positions, separate additional positions, full closure, leverage,
liquidation and fees with official sources and explicit evidence boundaries.

Strict type checking and document-record validation passed. Private research
checks matched input/event/position identifiers and all displayed arithmetic;
768 synthetic single-bit inputs exercised the returned instrument getter. These
scratch checks do not establish historical semantics or M1 correctness.

The unchanged production tooling suite passed **147/147** tests, including local
HTTP transport; strict type checking and the 13-claim/6-evidence/1-version document
record check passed. No new production model or CI was added in this increment.
Independent review found no blocking or important issue; two non-blocking opcode
references were corrected before publication. The public file/digest/link/privacy
subset was checked again after those corrections.

## Historical source feasibility

[Note 005](docs/research-notes/005-historical-source-feasibility.md) identifies
nanoreth's `eth_blockPrecompileData` and its exact address/input/gas matching from
pinned source. Official documentation distinguishes recorded actual reads from
hypothetical precompile calls. Archive presentation of system transactions also
requires explicit reconciliation with the original candidate coordinates. These
are source observations and acquisition requirements, not historical execution evidence.

The bounded investigation used 30/30 explicit source accesses and 8/8 search
queries, with **zero new RPC requests**; cumulative CASE-001 RPC attempts remain
85. Official S3 access is requester-pays; inspected hosted archive/trace routes
use provisioned credentials. No account, token, paid service, node or deployment
was created. The explorer read failed, and no target trace, prestate, state diff
or precompile result was obtained. This is not an exhaustive provider survey.

Candidate 4 remains ineligible, `selected_transaction` remains null and M1 is
unimplemented. The original candidate ledger, fixed 500-block window, production
tooling and purpose/mechanism-focused homepages are unchanged. The
[structured record](research/cases/001-archive-feasibility.json) preserves the
access log, source-file digests, unverified fields and acquisition limits.

Verification on Node.js 26.8.2 and pnpm 11.25.0: **147/147 tests passed** after
rerunning with local-listen permission. The first run passed 146 tests and failed
only the loopback transport test with `listen EPERM`; no test or code was changed.
Strict type checking and the existing 13-claim/6-evidence/1-version document record
validation passed. The new research JSON summaries were checked separately for
syntax, null evidence gates, budgets and unchanged scope; they are not new
validated chain packets. All 12 published source-text digest/length entries match
private captures. Original ledger bytes, local links, public sensitive-pattern
checks and whitespace checks passed. These checks do not validate historical
prices, state, provider truth or an M1 model.

Independent read-only review found no blocking or important issue. It confirmed
the retained source digests and research boundaries, while noting that the partial
local reader captures cannot independently prove every search/access execution.
The source count conservatively includes two reader `find` operations; the
original pre-read plan is retained without retrospective edits.

## Current mechanism investigation: CASE-002–005

[Note 006](docs/research-notes/006-current-mechanisms.md) covers frontend intent
queue/rank behavior, losing-close versus liquidation mint bases, a separate
585-byte mint integration library, staking reward precision and claims, a real
opposite-position pair and its two closes, and exact liquidation buffer/threshold
behavior in the acquired runtime. The bilingual homepages now explain all five
questions with evidence boundaries and links to the detailed records.

The first registered window remains 49115089–49115588, independent of CASE-001.
Source text, runtime bytes and acquisition-time parameter responses were retained
privately. Default-RPC state observations are latest-only and not transaction
prestate. Provider-reported receipts support amount associations, not full
settlement reproduction. Actual execution-queue discipline and user timing,
active payout-queue/debt branches, and full ledger reconciliation remain missing.

Three offline research helpers require explicit inputs and bounded integer domains;
they do not implement a full protocol model or select historical parameters. Five
focused tests passed after the calculation tests first failed on unimplemented
behavior. A bounded research interpreter compared 720 synthetic inputs with the
acquired bytes, and six synthetic oracle-price cases checked inclusive liquidation
gates. Those scratch checks do not constitute an independent EVM or M1 replay.

Collection: 118 new RPC attempts (116 successful, one log timeout, one chain
handshake network error), charged as CASE-002 59, CASE-003 29, CASE-004 20,
CASE-005 10. Thirty explicit source reads include one page connection failure and normal
retry. The initial window is unchanged; a separately registered single-block
CASE-004 follow-up checked the API-advertised distribution at 49114617. Its
fee-push/distribution amounts agree, while exact prior reward shares, LP-excess
funding and final external payment remain unreproduced. No search, credential,
paid service, signing, broadcast or cloud deployment was used.

Final implementation checks (Node.js 26.8.2, pnpm 11.25.0): **152/152 tests passed**,
including local HTTP transport; strict type checking passed; the existing document
record validator accepted 13 claims, six evidence entries and one version. The
new mechanism case summaries use a separate research profile and were checked
for JSON, links, budgets, byte hashes and missing-input boundaries; they are not
new validated historical snapshots. The collector/validator/exporter behavior
and all CASE-001 records are unchanged.

Independent read-only review found no blocking or important issue across all 20
public files. The reviewer reran the five arithmetic tests and 720 synthetic
bytecode comparisons, recomputed request counts and event ordering from private
captures, and checked receipt amounts and publication boundaries. A minor source
error description was corrected from timeout to connection failure.

## Queue and dividend payment follow-up

[Note 007](docs/research-notes/007-queue-and-dividend-payment.md) reuses the original
CASE-002/004 window. All 438 batch summaries were reconciled with 734 result
indices; 730 succeed and four fail. The six-item failure batch has successful
items before and after four matching reverts. The acquired Exchange bytes map
that selector to a direction-cap check, without reproducing historical capacity.
First open/close receipts were checked; actual intake clocks, server FIFO/priority,
server retries and real expired/cancelled/pending examples remain unavailable.
Client deduplication, one-hour default signed deadline, single-pending action
choices and UI/index reconciliation are now explained separately from server rules.
The current official app's lack of limit/TP/SL/scheduled orders is recorded as an
owner observation supported by the current form and signed schema.

The original window's first withdrawal has an earlier same-chain-account claim.
Claim and Exchange credit match at approximately 1115.251243442. The later
1115.251244 withdrawal matches input scaling, Exchange accounting and a CoreWriter
spot-send payload. The slight difference and unknown preclaim balance prevent
reward-only attribution. The prior 131.938049 distribution is a separate example,
not asserted as the source of this claim. Final Core credit and onward payment
remain unverified. A separately registered account-free `spotMeta` read confirms
current token 0 is USDC with eight wei decimals; it does not confirm payment.
An explicit-account public-ledger lookup was rejected by
automatic approval review before network execution; it was later authorized and
completed in note 008 below.

This follow-up used 26 RPC attempts (25 successful, one failed chain handshake
and one successful ordinary retry): CASE-002 19/60, CASE-004 7/60. Source reads
were 22/30 (19 successful, three connection failures); searches 4/8. Finalized
reference 49118768 and re-observed implementation bytes do not supply historical
prestate. All CASE-001 files, original windows, production code and dependencies
are unchanged. Private raw responses and chain-account joins are excluded.

This increment reran the full offline suite: **152/152 passed**, strict type check
passed, and the existing document validator accepted 13 claims, six evidence
entries and one version. A separate offline receipt check passed for the six-item
batch, first open/close receipts, claim-credit identity and amount, and withdrawal
unit conversion/CoreWriter fields. JSON, local links/anchors, source/run digests,
request counts, original-record immutability and public sensitive-pattern checks
passed. These checks do not authenticate historical state or final Core payment.

Independent read-only review found no blocking or important issue across all 12
public files. The reviewer independently recomputed batch ordering/counts, checked
receipt identities and unit conversions, checked all 22 source accesses, the successful captures, and seven
RPC run digests/counts, and confirmed frontend rules, bilingual consistency and
publication boundaries. The account-ledger lookup was unexecuted at that review; it was later explicitly
authorized and completed in note 008. Review did not bypass that restriction.

## Official HyperCore credit and observed server backlog

[Note 008](docs/research-notes/008-core-credit-and-relayer-pressure.md) records the
previously blocked, now explicitly authorized one-request ledger lookup. The
selected withdrawal has exactly one matching incoming `spotTransfer` for
**1115.251244 USDC** from Exchange to the selected recipient. Its eight-decimal
amount matches CoreWriter exactly; the ledger reports zero transfer/native fee
for that entry. Raw account, ledger hash, response and other activity remain
private. This closes provider-reported HyperCore credit for one case, not full
dividend provenance, later bridge payment or independent settlement reproduction.
The prior follow-up's source total becomes 23/30; no retry or extra account lookup.

A separate prospective scheduler investigation used 23/30 source access units,
8/8 search queries and zero RPC. Public `pressure:current` supplies 12 real aggregate
snapshots labeled `relayer-postgres`, with 159–217 queued intents and 0–59 submitted
intents. A snapshot has 217 queued at 0% reported saturation; sampled saturation
tracks submitted gas, not the entire backlog. Pending/active counters are not
interchangeable. Six public trading snapshots expose current enabled actions and
intake limits; no submitted intent tested their enforcement. Frontend app/hooks
were refetched and match previous bytes. Original windows and CASE-001 are unchanged.

The actual selection, priority, batching, retry and expiry-worker algorithms remain
unverified. Guardian's primary report places operated off-chain services outside
its contract review, and its linked source tree returned 404. Public aggregate
telemetry does not supply per-intent receive/select/broadcast clocks. No account
channels, signing, trade, cancellation, new credential, fee or deployment was used.

This increment reran the full suite: **152/152 tests passed**, strict type check
passed, and the original document validator accepted 13 claims, six evidence
entries and one version. Separate offline checks passed for the unique Core credit,
all displayed pressure/count/gas relations, source/search digests, public links,
JSON and unchanged prior case bytes. Exact private account/ledger identifiers,
other account activity, stream client IDs, secrets and private paths were checked
against the 11-file public subset and excluded. These research summaries are not
new validator-authenticated chain snapshots or an independent M1 replay.

Independent read-only review found no blocking or important issue across all 11
public files. The reviewer recomputed the Core match and all pressure/configuration
summaries, checked stream plans against captures, verified source/search/Core
digests and counts, and independently reran the link/JSON/original-case/privacy
checks. The review preserved the distinction between official-ledger credit,
aggregate service observation and an unverified server scheduling algorithm.
