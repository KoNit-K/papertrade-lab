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
