# Current status

Updated: 2026-10-21. **Research preview; documentation foundation.**

## P0 scope

The initial release contains bilingual entry pages, a 14-area mechanism map,
five anonymized unverified reports, one exploratory payout note, research method,
source pointers, roadmap, contribution/data/security policies, and licensing.
Publication status is established by GitHub's repository and Releases records;
this file describes the contents of the release, not proof of a remote operation.

## Capability and verification

| Area | Actual status |
|---|---|
| Original research documentation | Present |
| User observations | 5 reports; all unverified; no identifying records |
| Source reading | Per-source status in [source index](docs/sources.md) |
| Structured evidence/version validator | Not implemented |
| Read-only collector / safe export tooling | Not implemented |
| Integer model / transaction CLI / offline replay | Not implemented |
| Real transaction reproduction | Not attempted; no case packet |
| REA installation / outputs | Not performed / none |
| CI, model tests, document-site build | Not configured / not run |
| Wallet operations / cloud deployment | None |

See the [publication review](docs/publication-review.md) for actual P0 checks and their limits.

## Next three tasks

1. Establish claim/evidence/version records and reject unsupported `reproduced` claims.
2. Retrieve and version primary source descriptions with explicit access and redistribution limits.
3. Select one bounded public settlement case and inventory historical inputs before modeling.

M0–M4 remain open. P0 publication does not imply any of these technical milestones
are complete. See [ROADMAP.md](ROADMAP.md) for their acceptance criteria.
