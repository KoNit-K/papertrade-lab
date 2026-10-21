# Current status

Updated: 2026-10-21. **Research preview; documentation foundation.**

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
| Evidence/version validator | Implemented for documentation and unidentified observations; schema, references, version scope and published capture integrity |
| Read-only collector / safe export tooling | Not implemented |
| Integer model / transaction CLI / offline replay | Not implemented |
| Real transaction reproduction | Not attempted; no case packet |
| REA installation / outputs | Not performed / none |
| Local validator tests / strict type check | Implemented and run; see checks below |
| CI, model tests, document-site build | Not configured / not run |
| Wallet operations / cloud deployment | None |

See the [publication review](docs/publication-review.md) for actual P0 checks and their limits.

## Next three tasks

1. Extend the record contract for version-bound chain evidence, with incomplete-identity and independent-output rejection tests.
2. Enforce read-only collection and reviewed export boundaries; add negative tests before accepting raw evidence.
3. Select a bounded public settlement case under the [intake plan](docs/first-case-intake.md) and inventory historical inputs.

M0 is partial: the document/observation validator is implemented; chain-case
schemas, collection enforcement and safe export are outstanding. M1–M4 have not started implementation. All remain open.
P0 publication does not imply any of these technical milestones
are complete. See [ROADMAP.md](ROADMAP.md) for their acceptance criteria.

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
