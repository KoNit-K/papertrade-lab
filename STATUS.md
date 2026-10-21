# Current status

Updated: 2026-10-21. **Research preview; documentation foundation.**

## P0 scope

The initial release contains bilingual entry pages, a 14-area mechanism map,
five anonymized unverified reports, one exploratory payout note, research method,
source pointers, roadmap, contribution/data/security policies, and licensing.
P0 was published and read back through GitHub on 2026-10-21 as
[v0.1.0-alpha.1](https://github.com/KoNit-K/papertrade-lab/releases/tag/v0.1.0-alpha.1),
a public, non-draft prerelease bound to commit `54a5340215d1846709fc115d37e9f0c83a0d6f83`.
The current branch additionally contains the M0 document/data increment below.

## Capability and verification

| Area | Actual status |
|---|---|
| Original research documentation | Present |
| User observations | 5 reports; all unverified; no identifying records |
| Source reading | Per-source status in [source index](docs/sources.md) |
| Structured records | 6 document evidence entries; 13 atomic claims; 1 documentation version; see [records](docs/evidence-records.md) |
| Evidence/version validator | Not implemented; current data only has syntax/reference checks |
| Read-only collector / safe export tooling | Not implemented |
| Integer model / transaction CLI / offline replay | Not implemented |
| Real transaction reproduction | Not attempted; no case packet |
| REA installation / outputs | Not performed / none |
| CI, model tests, document-site build | Not configured / not run |
| Wallet operations / cloud deployment | None |

See the [publication review](docs/publication-review.md) for actual P0 checks and their limits.

## Next three tasks

1. Implement an offline record validator with real invalid-input and unsupported-reproduction tests.
2. Enforce read-only collection and reviewed export boundaries; add negative tests before accepting raw evidence.
3. Select a bounded public settlement case under the [intake plan](docs/first-case-intake.md) and inventory historical inputs.

M0 is partial; M1–M4 have not started implementation. All remain open.
P0 publication does not imply any of these technical milestones
are complete. See [ROADMAP.md](ROADMAP.md) for their acceptance criteria.

## Checks for the post-launch increment

JSON syntax, stable-ID uniqueness, cross-file references, expected record counts,
source-capture hashes, and unattempted reproduction states were checked with a
temporary Python standard-library script. Local links, sensitive patterns and
whitespace were checked again for the changed files and outgoing commit.
No executable schema, model tests, chain replay or REA investigation was run.
