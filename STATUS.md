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
| Integer model / transaction CLI / offline replay | Not implemented |
| Real transaction reproduction | Blocked: candidate 4 has a same-case arithmetic match; historical state/price unavailable and old state temporal bindings withdrawn |
| REA installation / outputs | Not performed / none |
| Local validator tests / strict type check | Implemented and run; see checks below |
| CI, model tests, document-site build | Not configured / not run |
| Wallet operations / cloud deployment | None |

See the [publication review](docs/publication-review.md) for actual P0 checks and their limits.

## Next three tasks

1. Obtain recorded block precompile inputs/results and actual-transaction archive traces for the same fixed interval; [note 005](docs/research-notes/005-historical-source-feasibility.md) identifies the source interface and access limits. No target record was acquired.
2. Bind candidate 4 economics to actual execution pre-state, BBO/frozen price, parameters, authorization and ledger/queue deltas.
3. Preserve the original candidate order and implement M1 only after a fully eligible case and independent expected results are available.

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
