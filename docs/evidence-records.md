# Evidence records: first M0 increment

Updated: 2026-10-21, after the public P0 release. **Data records, not a complete schema or validator.**

## Available records

- [Evidence](../research/records/evidence.json): six actually read official pages,
  with capture hashes, access scope, tool version and redistribution limits.
- [Claims](../research/records/claims.json): seven atomic user-report claims and
  six bounded statements about what the sources say.
- [Versions](../research/records/versions.json): one documentation-collection identity;
  all chain, implementation, parameter and frontend fields remain null.

OBS-005 is split into leverage, isolated margin, and full closure. All seven
user-report claims remain unverified and unattempted. The six document claims use
`supported` only for faithful source attribution, never deployed correctness.
Every claim remains `reproduction_status: not_attempted`.

## Proposed record contract

Stable IDs resolve within these files. Claims identify support and counterevidence
separately. A source description refers to the document-collection version; it
cannot borrow a future chain case's version or be reclassified as a chain observation.
Dates for the first two captures have day precision; later captures have client
UTC start/end times. No timestamps have been backfilled from file modification times.

Future validation must reject evidence-free `reproduced` claims, dangling IDs,
unknown status values, malformed hashes, escaping file paths, and incomplete
chain case identities. It must also distinguish hash shape from actual byte
integrity. Those rejection paths and automated export checks are **not implemented**.
A syntax/reference check on these records is not a substitute for that validator.

The raw HTML is deliberately not distributed because redistribution rights have
not been established. Public digests identify locally held bytes; they are not
self-contained replay evidence. A future independently reproducible packet needs
permitted evidence bytes or another independently obtainable immutable source.

## Why this increment matters

Source testimony and historical user reports now have separate, inspectable IDs.
A reader can trace each summary without mistaking current documentation for an
explanation of an unknown historical trade. M0 remains partial: executable schemas,
negative tests, collection enforcement and safe export are still outstanding.

See [sources](sources.md), [method](research-method.md), and the
[first-case intake plan](first-case-intake.md).
