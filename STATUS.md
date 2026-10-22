# Current status

Updated: 2026-10-22. **Research preview; M0 evidence tooling.**

## P0 scope

The initial release contains bilingual entry pages, a 14-area mechanism map,
five anonymized unverified reports, one exploratory payout note, research method,
source pointers, roadmap, contribution/data/security policies, and licensing.
P0 was published and read back through GitHub on 2026-10-21 as
[v0.1.0-alpha.1](https://github.com/KoNit-K/papertrade-research/releases/tag/v0.1.0-alpha.1),
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
| REA installation / outputs | REA 6.7.0 run: partial frontend graphs and selected traces; five offline EVM interface results; see [note 010](docs/research-notes/010-rea-frontend-and-contract-crosscheck.md) |
| Local validator tests / strict type check | Implemented and run; see checks below |
| CI, model tests, document-site build | Not configured / not run |
| Wallet operations / cloud deployment | None |

See the [publication review](docs/publication-review.md) for actual P0 checks and their limits.

## Next three tasks

1. Finish semantic revalidation of the installed Exchange/SessionKeyManager/Tokenomics targets and reconstruct the exact upgrade execution/initialization effects. Installation and Timelock completion are now confirmed at reference block 49175395; see [note 013](docs/research-notes/013-market-state-funding-and-upgrade-followup.md).
2. Measure the real distribution-timing effect in a newly registered public event window: stake/unstake order, shares at allocation and already accrued versus undistributed rewards. One real unstake is now checked; complete individual historical entitlement remains missing.
3. Seek actual LP-surplus and active-debt/partial-payment examples, then reconcile available backing and obligations. Repetition of zero-debt snapshots cannot establish payment capacity.

CASE-001's historical state, recorded precompile and parameter inputs remain missing;
its original window and candidate order are unchanged. M1 requires decisive inputs
and independent expected results before implementation or a reproduction claim.

M0 tools are implemented for the documented profile: official document records,
chain-999 block-end snapshots (EIP-1967 or explicitly incomplete), bounded public
RPC, and reviewed metadata export. This is not arbitrary HAR anonymization,
a transaction-prestate decoder or independent reproduction. The first bounded live intake is complete, with no eligible settlement established;
M1–M4 remain unimplemented. No milestone is closed by test counts alone.

## Independent client, orders and funding increment

[The integration guide](docs/independent-client-guide.md) and
[note 012](docs/research-notes/012-independent-clients-orders-and-bridges.md) recover
the official intent route, exact open/close encoding and acknowledgement boundaries,
and cross-check Exchange/BatchExecutor caller gates. The bounded order inspection
distinguishes selected whole-position closes, separate additional positions and
unestablished conditional/partial-close/existing-margin-update interfaces.
Funding consumers identify Circle-related forwarding and an Across Robinhood
branch, alongside internal HyperCore/HyperEVM routes. Builder codes, bridge
completion/refunds and production admission remain unverified.

Two new REA 6.7.0 analyses each parsed four selected inputs; two semantic traces
found four submit callers and two Across-wrapper callers with partial coverage.
Nine private unsigned encoding/mock tests, six narrow synthetic caller-gate cases,
and three collector tests passed. These are not signature recovery, complete EVM
replay, production order acceptance or end-to-end cross-chain verification.

[Metadata](research/cases/009-client-orders-bridges.json) records exact source
digests, offsets, runtime identities and limits. All 26 successful captures passed
byte-length/SHA-256 checks. Collection: 20 direct HTTP attempts (17 successful),
10 RPC (nine successful), two vendor-page opens and three searches; seven prior
preflight attempts give 29/30 counted HTTP/page attempts. Documentation access was
stopped after HTTP403. Two asynchronous collector processes briefly overlapped,
duplicating one ordinal without overwriting successful captures; the raw ledger
was retained, a serial lock added and its regression tested. No signatures,
intents, transactions, personal-account queries or bridge quotes were used.

## PAPER issuance visual comparison

The bilingual README mint module and existing image paths now compare the old
retained-H threshold step and decaying tail with supply-relative issuance, total
supply growth and dilution. 100 PAPER/$ is explicitly the old early/low-LP branch;
25/20 are curve examples, not fixed tiers. The [figure appendix](docs/readme-figures.md#issuance-old-vs-new)
reconciles the October 6 old-page date, October 20 announcement and October 22
installation/new-mode observations, keeping exact execution time unknown. Figure
math is a labeled teaching recurrence, not a new contract calculator. Only this
README module changes; retained receipts, arithmetic helpers and liquidation
assets are unchanged. No new protocol collection, install or whole-app analysis
was performed for the visual revision.

## Official announcement and changed issuance rules

[Note 014](docs/research-notes/014-official-announcement-crosscheck.md) checks the
user-supplied October 20 official notice against the installed Tokenomics,
PAPER transfer route and Exchange economic library. The enabled mode uses current
supply, with a time-based insolvency bonus reaching 5× after three days. Added
profit bands have 6/10bps upper edges; they supplement the earlier cost formula.
Initial builder whitelisting is an announced policy. Bot profitability statistics,
OI relaxation, exhaustive attack elimination, exact distributor changes and
below-bust gas-griefing claims remain unverified.

The bilingual READMEs now summarize these business implications and link the
version/evidence detail. Old mint formulas and helpers retain their historical
scope. Two focused interpreter-extension tests and 31 captured-code synthetic
checks passed; two small offline REA 6.7.0 inspections reused the existing runtime.
Collection: 25 RPC attempts (23 successful), two successful direct HTTP reads,
two searches and one denied X page open. All 25 successful capture hashes/lengths
matched. No installation, full-app rerun, personal-account read, signing, intent,
transaction or event scan occurred. [Metadata](research/cases/011-official-announcement.json)
retains the exact reference and limits. The funding, server-admission and Across
migration gaps remain open.

## Market, funding and executed-upgrade follow-up

[Note 013](docs/research-notes/013-market-state-funding-and-upgrade-followup.md)
and [metadata](research/cases/010-market-funding-upgrade.json) bind the next
observations to build `2b8e2c45a33e` and chain-999 block 49175395. The scheduled
Exchange, SessionKeyManager and Tokenomics implementations are installed; the
retained Timelock operation slot is the completed sentinel. Exact execution and
all new implementation semantics remain incomplete.

Current consumers distinguish Hyperliquid quote/candle streams, Papertrade fine
price history, trading rules and credential-bearing wallet reconciliation. Funding
analysis identifies the aggregate deposit-credit heuristic, onward renewal via
`/intents/{id}/onward`, and the extra Circle completion boundary. Vendor sources
clarify forwarding domains/fees and Across authentication, embedded actions and
refund processing; the exact legacy Robinhood migration remains untested.
New Session bytes expose a protocol fee-registry dependency and no automatic
master-signature bypass of the inspected session-record checks. Builder fee base,
payout and registration policy remain unestablished.

Actual checks: the private empty-RPC classification regression failed before the
fix, then three collector tests passed (five envelope subcases); independent
review checked budget accounting; two new-window wrapper boundary checks passed.
Fourteen narrow synthetic code-path cases
passed with mocked recovery/external calls. Six small offline EVM interface
inspections succeeded using existing REA 6.7.0 and its retained image; no install
or whole-app retry. Thirty-seven successful captures passed digest/length checks,
with 51 source locators recorded. Collection used 20 direct HTTP attempts, 21 RPC,
seven vendor-page opens and six search queries, including four direct transport
failures and one page-reader error. Prior ledgers and results remain intact.
No signing, intents, transactions, account reads, live feed, bridge quote or
end-to-end bridge/production execution occurred. The READMEs retain their concise
business entry format; version/evidence detail stays in the guide and notes.

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

## Distribution reserve ledger follow-up

[Note 009](docs/research-notes/009-distribution-reserve-ledger.md) registers independent
CASE-006 at blocks 49122484–49122983, selected from an already captured official
summary height before scanning. It observes 24 stakes, 53 claims, three distributions
and 80 nonce-use events. Three distribution receipts match their Exchange fee pushes;
none demonstrates additional LP-surplus funding. Starting at the first event's reserve,
33 later claims and two later fundings reconcile exactly through both intermediate
distributions and the previously captured source-block API reserve. Two accumulator
increments match using denominators backsolved from that API and stake deltas.
These are aggregate event/indexer consistency checks, not independent historical
state, per-user entitlement or external-payment reproduction.

The previously unassigned 40 events from note 006 match the recovered `NonceUsed`
signature and bitmap/log path. Forty synthetic internal-routine checks support the
four distribution word meanings, using controlled storage and mocked Exchange calls;
they are not a full EVM, signed-entrypoint test or historical replay. No unstake
event was returned in this window; real LP-surplus and active payout-debt cases
remain unestablished.
Versioned scheduler selection/priority/retry/expiry policy remains unavailable after
bounded primary-source reads/searches; no repeated aggregate stream sample was used
to infer it. All prior case windows and structured records remain unchanged; the
completed Core credit lookup was not repeated and M1 remains unimplemented.

Collection: **25/60 RPC attempts**, 24 successful and one chain-ID network failure,
with one ordinary successful retry. One separate local plan-shape validation failure
made zero network requests and was retained. **8/30 HTTP source reads** succeeded;
**8/8 search queries** were used. Source/run digests, receipt/header/transaction
identity, exact reserve arithmetic and API-dependent accumulator checks were verified
offline. The API supplies a height without a block hash, so its canonical-state
binding remains unverified.

Local verification (Node.js 26.8.2 / pnpm 11.25.0): **152/152 tests passed**,
strict TypeScript checking passed, and existing document-record validation accepted
13 claims, six evidence records and one version. The first test run passed 151 and
failed only the localhost HTTP transport test with `listen EPERM`; the unchanged
suite passed with local-listen permission. These checks do not validate historical
protocol state or the new research JSON as a chain packet. Separate JSON/link/privacy,
source/run/search digest, plan-before-scan timing, bounded-log and arithmetic checks
passed for the six-file publication subset. All 32 prior case records, including
CASE-001's candidate ledger, remain byte-for-byte unchanged.

Independent read-only review found no blocking or important issue. It independently
recomputed source/run/search digests, registration order, log uniqueness/counts,
three receipt/transaction/header identities (including header transaction positions),
the reserve and API-dependent accumulator equations, and all forty synthetic field
checks. It inspected the acquired bitmap/log and distribution branches, recovered
signature preimages, unchanged old case records and the six-file public privacy
subset. It did not make new network requests or authenticate historical state,
API block-hash identity or individual rewards; request accounting is verifiable
only against the retained captures.

## Actual REA frontend and EVM analysis

[Note 010](docs/research-notes/010-rea-frontend-and-contract-crosscheck.md) records
REA 6.7.0 analysis of 22 retained public scripts and five acquired runtimes.
Twenty-one scripts parsed; the main app exhausted both the default 1 GiB and a
separate 4 GiB heap budget. Exact inert app/hooks excerpts produced selected local
call traces without synthesizing missing dependencies. A captured PAPER ratio
formatter computes minted PAPER divided by a record's eligible mint basis, locating
an implementation of the earlier average-versus-marginal distinction. Its page
consumer was not captured; this does not establish actual history-screen rendering.

Five offline Linux x64 EVM inspections succeeded, returning 98 / 21 / 10 / 1 / 36
interface candidates for Exchange, Tokenomics, accounting library, mint library and
staking. All 42 compared known selectors appear; seven argument-string differences
remain explicit. These are interface inferences, not verified ABI, source recovery,
target execution or settlement replay. Local calls cross-support earlier client
mechanisms; server scheduling and complete fee-preview reconstruction stay unknown.

The [new record](research/cases/007-rea-analysis.json) publishes selected identities,
timestamps, output digests, partial coverage and inference differences. Raw Evidence,
third-party code and local paths remain private. New target/account/RPC reads and
wallet operations were zero; all prior case records and windows are unchanged.
M1 remains unimplemented. Existing formulas and historical samples are not relabeled
as REA discoveries.

For this documentation/metadata update, strict TypeScript checking and the existing
document validator passed (13 claims, six evidence entries, one version; no public
capture files checked, protocol_reproduced false). Separate publication checks cover
the new JSON, source/output identities, local links, unchanged old cases and the
explicit public file subset. Production code and dependencies are unchanged; the
production test suite was not rerun for this documentation-only update. The new
research profile is not validated as a historical chain packet by the old validator.

Independent read-only review checked published input/excerpt identities, run/output
digests, candidate counts, all seven argument differences and nested privacy fields.
It caught unsupported attribution of the ratio formatter to a history screen; the
text now explicitly leaves its page consumer and runtime use unknown. Final review
found no remaining blocking or important issue. The reviewer did not rerun REA,
authenticate installation/container configuration or perform historical execution.

## Losses, governance and distribution timing

[Note 011](docs/research-notes/011-loss-governance-staking-and-payments.md) adds
five linked questions with separate official descriptions, acquired-code support,
provider-reported records and conditional examples. Two losing-close/liquidation
receipts were rechecked; eleven explicit-input mint calculations separate basis,
progress, region and parameter effects. Historical H, parameters and transaction-point
implementation identities remain incomplete. The ratio formatter's page consumer
and actual runtime use remain unknown.

Business ownership and proxy administration connect to the inspected governance
contracts. A successful transaction set minimum delay to 86400 seconds; its earlier
matching schedule had a seven-day ETA interval. A $10M reward-cap schedule was
cancelled, and a six-action batch including three upgrades remained pending at
observation time, with earliest execution 2026-10-22T05:35:19+08:00. New implementation
semantics were not analyzed. The guardian can pause new opens without timelock
scheduling; resumption requires owner authority. Eleven synthetic guard checks
passed, without claiming complete security-path coverage.

Seven synthetic signed-dispatch staking scenarios support sharing undistributed
funds at allocation, while protecting already accrued rewards. Signature recovery
and external calls were mocked. A real 762-PAPER unstake has matching input, event
and token return, not a reconstructed individual earnings history. New window
49136352–49136851 has five fee-supported distributions and 33 claims after the
first reserve anchor; reserve rollforward matches the later API. The older
three-distribution window also reconciles separately. Actual LP-surplus funding,
active debt and complete cash/obligation conservation remain missing.

The [metadata projection](research/cases/008-economics-governance-research.json)
records 58 RPC / 16 HTTP governance attempts and 39 RPC / 6 HTTP funding attempts,
including failures, with zero searches or account endpoints. Earlier REA 6.7.0
results were reused, not rerun. Raw captures, complete transaction inputs, identity
joins, local paths and interpreter scripts are excluded from public files. All
36 prior case records are byte-for-byte unchanged; M1 stays unimplemented.

For this documentation/metadata publication, strict type checking and existing
document-record validation passed (13 claims, six evidence records, one version;
no public capture files checked, protocol_reproduced false). Separate JSON, local
link, source-digest, arithmetic, public-address allowlist and disclosure checks
passed. An independent read-only review checked the proposed public subset against
local evidence and found no outstanding blocking or high-priority issue in that
scope. Production code and dependencies are unchanged; the production test suite,
REA and historical execution were not rerun for publication. This custom JSON
profile is not validated as a historical chain packet by the existing validator.
