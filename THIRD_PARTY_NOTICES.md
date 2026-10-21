# Third-party notices

Copyright 2026 papertrade-research contributors.
Original project documentation and original code are licensed under
Apache-2.0; see [LICENSE](LICENSE).

The full license text is obtained from the
[Apache Software Foundation](https://www.apache.org/licenses/LICENSE-2.0.txt).
Papertrade, Hyperliquid, REA, GitHub, and other names identify their respective
projects; no affiliation, endorsement, or trademark license is asserted.

The [source index](docs/sources.md) attributes links to Papertrade documentation,
Hyperliquid documentation, `nirholas/papertrade-sdk`, and `morluto/rea` / `rea.tools`.
The initial release does not vendor their code, scripts, screenshots, documentation
pages, or datasets. Linked content retains its own license and terms. Unknown
redistribution rights are not replaced by this repository's Apache-2.0 license.

Before incorporating upstream code or assets, pin the actual version, inspect its
license, retain required notices, and document copied versus independently written
parts. Minimal original summaries and source pointers do not assert ownership of
upstream content. Tool outputs also require provenance and disclosure review.

## Validator tooling dependencies

The lockfile records the exact resolved dependency graph. Packages are installed
from the registry, not vendored into this repository. Ajv 8.17.1 (MIT) supplies
JSON Schema validation; TypeScript 5.9.3 (Apache-2.0) and @types/node 26.6.5
(MIT) are development tools. Their transitive dependencies retain their respective
package licenses; installing them does not relicense them under this project's license.

The M0 chain validator uses @noble/hashes 2.4.0 (MIT) for Keccak-256. Its code is
installed through the lockfile, not copied into this repository.

## Public chain intake

CASE-001 publishes original factual summaries, reviewed metadata, minimal event
coordinates and source links. Raw provider responses, bytecode, third-party ABI
files and SDK/adapter implementations are not distributed. The event-signature
lead is attributed to the pinned DefiLlama source in the research note. These
original summaries do not relicense linked sources or assert rights over raw
provider data. No wallet-to-report or personal identity association is included.
