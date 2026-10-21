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
