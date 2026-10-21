# Evidence records and offline validation

Updated: 2026-10-21. **M0 is partial.** The document/observation record validator
is implemented; chain-case schemas, collection enforcement and safe export are not.

## Available records

- [Evidence](../research/records/evidence.json): six official-page readings with
  capture hashes, access scope, tool version and redistribution limits.
- [Claims](../research/records/claims.json): seven atomic user-report claims and
  six bounded statements about what the sources say.
- [Versions](../research/records/versions.json): one documentation-collection identity;
  all chain, implementation, parameter and frontend fields remain null.

OBS-005 is split into leverage, isolated margin, and full closure. All seven
user-report claims remain unverified and unattempted. The six document claims use
`supported` only for source attribution, never deployed correctness.
Every existing claim remains `reproduction_status: not_attempted`.

## Run the implemented checks

Prerequisites: Node.js >=24.12.0 and pnpm 11.25.0. Reading the research needs neither.
From a checkout of this repository:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm validate:records
pnpm test
pnpm typecheck
```

Installation may use the package registry. Validation, tests and type checking
only use local files after installation. No RPC, wallet or REA setup is required.
The CLI also accepts a local repository root: `pnpm validate:records <repository-root>`.
It exits nonzero on invalid or missing inputs; it never modifies the records.

The [schema](../packages/evidence/records.schema.json) and
[validator](../packages/evidence/validate.ts) check:

- Required fields, types, status vocabulary and unknown fields; nonempty collections.
- Unique IDs, support/counterevidence/dependency references, and acyclic evidence dependencies.
- Documentation version/source membership, consistent support scope, and revalidation flags.
- Date/time syntax and retrieval ordering, with unknown timestamps retained as null.
- HTTPS source URLs without credentials, queries or fragments; these URLs are never fetched.
- SHA-256 shape. For explicitly permitted published captures only, actual file size and digest,
  restricted to `evidence/public/`, with traversal and symlink escape checks.

The successful report for the existing records counts 13 claims, 6 evidence
records and 1 version, with **0 checked capture files and 6 unpublished capture files**.
`protocol_reproduced: false` is an explicit capability boundary, not a computed
assessment of protocol correctness. The six unpublished digests cannot be
independently checked against absent bytes by this command.

## Deliberate limits

This first schema accepts only official-document evidence and unidentified user
observations. `reproduced`, `mismatch`, chain observations and deployment identities
are rejected, even if someone supplies a URL or a verification command. Supporting
those records requires a separately tested case/evidence contract with historical
inputs and independent outputs. A documentation version cannot serve as one.

A source description can be supported, unverified, conflicting or refuted with the
corresponding evidence roles. A version marked `needs_revalidation` requires claims to remain `unverified`;
support, refutation and conflict conclusions must be rechecked. Supporting and
counterevidence must belong to the same documentation version as the claim. Historical unidentified reports remain unverified;
new permitted observations need a separately scoped schema extension.

Hashes establish byte identity, not truth or redistribution rights. `permitted`
is a contributor's reviewed declaration, not a license decision made by software.
The raw HTML remains outside public history. No exact source-capture replay is
possible from the current repository alone, and upstream pages may change.

This is **not a secret scanner, redactor, publication approval, or sandbox for
hostile filesystems**. Review free text and file contents under [DATA_POLICY](../DATA_POLICY.md)
before staging them. Validation reads a trusted local checkout; it does not claim
protection against another process changing files during a read. It never executes
record commands, follows source URLs, or infers a deployed version from a date.

## Verification

The CLI tests use real temporary files and synthetic mutations, not production
network activity. Synthetic capture bytes test integrity checks only. Cases cover
invalid statuses, unsupported reproduction, bad references, missing/malformed
JSON, capture tampering, traversal, symlinks, missing permission and stale versions.
See [tests](../tests/evidence.test.ts) and [current status](../STATUS.md) for actual runs.

The implementation uses Node's built-in TypeScript execution and a separate
TypeScript check; execution alone does not type-check. See the primary
[Node documentation](https://nodejs.org/api/typescript.html) and
[Ajv documentation](https://ajv.js.org/guide/getting-started.html).

See also [sources](sources.md), [research method](research-method.md), and the
[first-case intake plan](first-case-intake.md).
