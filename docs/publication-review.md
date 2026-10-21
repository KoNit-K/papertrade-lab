# Initial publication review

Date: 2026-10-21. Scope: the original P0 documentation snapshot plus this record.

## Checks actually performed

- Confirmed an empty parent workspace and initialized a dedicated new repository
  on `main`; no prior commits or unrelated changes were imported.
- Confirmed authenticated GitHub account ownership. An authenticated target lookup
  returned 404, followed by a paginated owned-repository listing with no name match.
- Reviewed the complete authored Markdown text, status labels, source attributions,
  and file list. The task handoff and raw HTML captures remain outside the repository.
- Ran a temporary Python standard-library check of public file types, local Markdown
  link targets, license markers, and patterns for private keys, GitHub tokens,
  credential values, private local paths, and wallet addresses. No matches/errors.
- Checked the full Apache-2.0 text downloaded from its official source; its SHA-256
  is recorded in [sources](sources.md). No third-party code or assets are vendored.
- Used an explicit staged-file allowlist and checked whitespace and the outgoing
  root-commit contents before push. No older history exists in the initial snapshot.

The final initial allowlist comprises 18 files: the 17 content/policy/license files
and this review record. Counts are snapshot-specific, not a promise about later commits.
Local link checks do not test all remote seed URLs. Two Papertrade pages and the
license were retrieved; other source links remain explicitly unread seeds.

## Limits

This was a full review of a small original-document set plus lightweight pattern
checks, not a dedicated comprehensive secret scanner or proof that arbitrary future
data is safe. No raw user data was imported. No protocol tests, SDK tests, chain
replays, REA runs, CI workflow, or document-site build were run. Those are absent,
not passed. Actual remote publication is confirmed separately through GitHub records.

## M0 validator increment review — 2026-10-21

- Reconfirmed the public repository, default branch, release flags, original tag
  target and authenticated owner. The existing release is reused, not overwritten.
- Reviewed the 30-file publication set, local Markdown links, original license
  SHA-256, and both existing commits with a temporary Python standard-library
  check for private paths, private-key markers, token patterns and wallet addresses.
  No pattern or local-link findings. Synthetic invalid inputs in tests are labeled.
- Reviewed the new source, schema, tests, lockfile and documentation changes with
  an independent code reviewer. Fixed version-scope checks for counterevidence
  and stale conclusions; the follow-up review found no blocking issue.
- Ran 52 real CLI/file tests, strict type checking and validation of the existing
  records; all passed. Repeated those checks in a clean temporary file copy after
  installing the frozen lockfile offline from the populated local cache.
- Used an explicit staging list and reviewed the outgoing increment. No capture
  bytes, raw chats, handoff files, identifying wallet data or credentials are added.

These checks are not a comprehensive secret scanner, upstream content
authentication, dependency vulnerability audit, protocol test or proof of safety
for arbitrary future records. All six original capture files remain unpublished
and are not byte-verified by the distributed validator. Hosted CI, minimum-runtime
and Windows compatibility remain untested.

## M0 chain/collector/export review — 2026-10-21

- Reviewed the 50-file public subset, local links, license digest, explicit new
  file inventory and staged changes. Raw source HTML stays outside the repository;
  future collector output is confined to ignored `data/private/`.
- Checked private-path, private-key and token patterns; no findings. Repeated
  numeric addresses in tests/fixtures are explicit synthetic values, not wallets.
- Independent review found conflicting-history, inconsistent-log and input-byte
  review defects. Regression cases reproduced them before fixes; follow-up review
  confirmed the fixes. No unresolved blocking review finding remains.
- The full 140 tests, strict type check, original record validation and synthetic
  chain validation passed, including a real loopback-only HTTP test. A clean
  temporary copy passed after offline frozen-lockfile installation.
- The local-listen test initially failed with `EPERM` in the restricted sandbox;
  the complete run passed with localhost listening permitted. No production RPC,
  transaction, signing, cloud service or outreach was used during these checks.

Snapshot `complete` means the declared metadata and supplied bytes are internally
consistent; it does not verify provider truth, proxy behavior, finality, all
parameters, pre-state or settlement. Export manifests omit raw content and do not
replace manual disclosure review. Tests are synthetic, not on-chain findings.

## CASE-001 intake publication review — 2026-10-21

- M0 tooling was tested and ordinarily pushed as `7afb25e` before live intake.
  This increment changes documentation and evidence metadata only.
- Reviewed 20 explicit files: ten documentation files, three case JSON records,
  and seven exporter-generated metadata manifests. The local intake plan was
  saved before event reads but published afterward; no public preregistration
  claim is made.
- Checked 29/30 attempted requests, 28 successful responses, one network failure,
  1,039 unique log coordinates, 458 transactions, 294 ordered event-signature leads,
  and the first lead's receipt identity against private collection results.
- Checked original-byte SHA-256 bindings for all seven exports. The private chain
  packet validates as two incomplete versions, nine evidence items and two blocked
  claims. The original document records still validate; no protocol reproduction
  is reported by either validator.
- Reviewed the public field subset, local links, whitespace, private-path/token/key
  patterns and outgoing diff. Raw results, indexed user addresses, bytecode and
  approval declarations remain outside public history. Public event coordinates
  and the single transaction pointer allow chain lookup and are not anonymity.
- Independent review rechecked counts, candidate ordering, all seven projections,
  the nine evidence mappings and manual proxy classification against private records;
  no blocking finding remained. A discovery-request wording ambiguity was corrected.
- Export review covers this user's authorized public research subset: original
  summaries, protocol contract identifiers, one transaction lead, minimized
  ordering coordinates and hashes. No wallet is associated with a person or report;
  no raw third-party dataset or source implementation is redistributed.

The 140-test suite and type check were completed for the preceding tooling commit;
this metadata-only increment adds packet, digest, count, order and publication
checks. It does not claim a new protocol test, independent finality check, archival
execution trace or settlement replay. Private payloads and original wire bytes are
not distributed, so these public manifests alone cannot verify the provider or
replay the case. M1 case selection remains blocked by missing decisive inputs.

## Historical interface and homepage review — 2026-10-21

- Reviewed the 19-file public increment: the hash-only transaction lookup change
  and tests, mechanism-focused English/Chinese homepages, research/status/source
  updates, two case JSON files and five metadata manifests. Original candidate
  ordering and the original interval plan remain unchanged.
- Seven new tests cover the actual plan/collector path and malformed/missing
  transaction reads. The two new supported-result paths failed before the one-line
  implementation; all seven then passed. Full tests passed **147/147**, including
  loopback HTTP, and strict type checking passed. An initial automatic approval
  review timeout prevented the first full-test launch; its allowed retry succeeded.
- Private chain evidence validates as two incomplete versions, 14 evidence items
  (five reused) and two blocked claims. Original documentation records still pass.
  Five exact-source-byte export digests and their metadata-only fields were checked.
- Checked all 14 new RPC attempts: successful responses, original candidate block,
  fixed endpoint and private outputs. These are collection results, not proof of
  provider truth or M1 settlement. The separate source-access accounting overrun
  is disclosed rather than retroactively changing the issued plan.
- Independent review verified selector/topic preimages, byte offsets, storage keys,
  call/position associations and exported digests. A bounded offline interpreter
  exercised the actual position getter extraction with 512 synthetic single-bit
  inputs; all nine output extractions matched. This verifies bit extraction, not
  economic field meanings or settlement. No blocking review finding remained.
- Checked JSON, links, sensitive patterns and whitespace across the outgoing
  files. Read-only source bodies, calldata, signatures, user addresses, approvals
  and storage/code payloads remain private. Original summaries, hash preimages,
  numbered storage extraction fields and limited case values are published under
  the authorized research scope without a person/report association.

The interface/field reconstruction remains partial. Selector matches can collide;
source timestamps are null where not recorded; block-end state cannot silently
become execution pre-state. A same-case arithmetic sanity check is not an
independent model or holdout result. The first positive signed pair remains an
ordinal-4 structural lead, with no eligible-case selection or M1 implementation.

## Economic-path and state-binding review — 2026-10-21

- The public subset includes the candidate-4 coordinate/position pointer, minimal
  economic integers, bytecode hashes/offsets, source descriptions, and five
  metadata-only manifests. This is authorized research publication; no wallet is
  linked to a person/report. Public transaction pointers are not anonymous.
- Raw calldata, signatures, owners, account storage keys, source/code bodies,
  private local paths and byte-bound review declarations remain private. Export
  digests were checked against the exact retained bytes. No new historical chain
  snapshot is asserted from the latest-only provider.
- The research plan predates this increment's network reads. Counts are 42/60 RPC
  attempts (40 successful, one timeout, one network failure), 10/20 source accesses,
  five exported ledgers, and 85 cumulative RPC attempts. Retry/stop outcomes remain
  visible. Original sampling boundaries and candidate ordering are preserved.
- Private checks compared the candidate input, position and event association,
  requested before/after state, block/receipt identity and re-read block hashes.
  The returned instrument getter matched 768 synthetic single-bit inputs. A
  bounded scratch interpreter and a separate integer calculation matched the
  candidate's PnL/fee/return values. Neither is a historical replay or independent
  expected settlement; scratch tools are not an audited EVM or a production model.
- Existing production tooling tests passed **147/147**; strict TypeScript and
  original record validation passed. There is no new production code, model test,
  hosted CI, archive-backed trace or real settlement reproduction in this change.
- Historical interpretation of earlier state captures is explicitly superseded
  in both human and machine-readable case records, while original capture hashes
  remain intact. Candidate 4 remains blocked and no transaction is selected.
- Independent review found no blocking or important issue after checking integer
  results against receipt words, packed fields, bytecode hashes/opcodes, source
  captures, counts, original candidate order and homepage claims. Two opcode
  references were refined to the actual DIV/SHR locations; conclusions were unchanged.
- The final 22-file subset passed JSON parsing, local-link checks, explicit contract
  address allowlisting, private-path/credential pattern checks, manifest digest
  checks and whitespace checks. These scoped checks are not a guarantee of anonymity
  or correctness of the underlying provider.

## Losses, governance and staking publication — 2026-10-21

- The owner authorized publishing the reviewed research summaries. The selected
  eight-file subset is README.md, README.zh-CN.md, ROADMAP.md, STATUS.md,
  docs/sources.md, this review, note 011 and the CASE-008 metadata projection.
  No raw local report, handoff, capture, interpreter or REA output is included.
- The new projection uses selected fields rather than whole local objects. Public
  addresses identify eleven protocol governance/proxy/implementation contracts;
  no governance signer, claimant or user address, account storage key, signature,
  complete calldata, cookie, credential or private filesystem path is exported.
  Public transaction links remain linkable blockchain coordinates, not anonymous
  evidence or a general-purpose redaction guarantee.
- The evidence checks distinguish successful delay setting, cancelled mint-cap
  scheduling, failed direct setter attempts and upgrades pending at observation
  time. The earliest upgrade time is not promised execution. Current storage is
  acquisition-time evidence, not historical prestate; the seven-day source wording
  comes from an earlier captured official page. The new implementations were not
  analyzed, and no claim is made about their effects after execution.
- Local checks cover two mint receipts, eleven conditional mint calculations,
  eleven synthetic governance guards, seven staking scenarios, the first real
  unstake and two separate reserve-ledger windows. Signature recovery and external
  calls in the staking scenarios are mocked. Real active debt, LP-surplus funding
  and complete individual entitlements remain missing. No full replay is claimed.
- Independent read-only review compared the proposed public text and projected
  identities, digests, amounts and operation states to retained local evidence.
  No outstanding blocking or high-priority issue was found in that scope. The
  earlier local unstake-topic typo was corrected and independently rechecked;
  final text retains the unknown ratio-formatter page consumer.
- On Node.js 26.8.2 with pnpm 11.25.0, strict type checking and the existing document
  validator passed: 13 claims, six evidence records, one version, no public capture
  bytes checked, protocol_reproduced false. Separate JSON/link/whitespace, explicit
  protocol-address allowlist, private-path/token patterns and prior-record byte
  comparisons passed. All 36 earlier case records are unchanged.
- Production code/dependencies are unchanged; the production suite and REA were
  not rerun for this publication. CASE-008 is a custom research profile, not a
  historical chain packet accepted by the old validator. No new protocol or account
  read, signing, production transaction, credential, paid service or cloud resource
  was needed to prepare the public subset. The prior research's 97 RPC and 22 HTTP
  attempts, including failures, remain separately identified in its metadata.

These are scoped disclosure and consistency checks, not an audit of provider truth,
complete protocol safety or future payment capacity. Git history and staging use
the explicit subset; publication does not include the raw local evidence directory.
