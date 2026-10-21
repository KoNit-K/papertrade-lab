# Roadmap

No delivery dates are promised. Documentation can be public while research remains
unverified. Updated: 2026-10-21.

| Milestone | Deliverable | Completion criteria | Initial state |
|---|---|---|---|
| P0 — Public foundation | Bilingual home, mechanism map, observations, payout note, method, sources, policies, prerelease | Real content, reviewed public files/history, correct license and actual public repository/release verified | Launch scope |
| M0 — Evidence foundation | Claim/evidence/version structures, source inventory, read-only boundary, safe export | Valid/invalid samples; references and hashes checked; evidence-free reproduction rejected; secret-bearing exports rejected | Planned |
| M1 — First reproducible case | Version-bound public trade, independent integer model and offline explanation | Decisive historical inputs; independent output comparison; explicit mismatches/gaps; no-network replay of verified fields | Planned |
| M2 — Trading mechanics | Fees, liquidation, directional limits, rejection and signature semantics | Separate interface/relayer/contract rules; boundaries, holdout cases, and integer behavior checked | Planned |
| M3 — Ledger and PAPER | Cash/claim accounting, payout queue, issuance, staking, funding lifecycle | Conservation and state transitions tested; marginal/average issuance distinguished; no guaranteed future liquidity claims | Planned |
| M4 — Runtime and evolution | Waiting intervals, upgrades/parameters, frontend changes, read-only explanations | Missing timing stays unknown; changes invalidate affected results; no transaction capability | Planned |

## Immediate sequence after launch

1. **Records:** define machine-readable claims, evidence and version identity;
   introduce a small offline validator only with real negative tests.
2. **Sources:** capture a bounded set of primary pages with timestamps, hashes,
   version identifiers where available, and minimal publishable summaries.
3. **Case:** state a deterministic selection rule, locate an already public
   settlement, and list archival state/trace dependencies. Missing decisive inputs
   block precise reproduction, not unrelated documentation updates.

A future TypeScript `bigint` model will use fixed versions and a real lockfile.
No package skeleton, invented command, or tool installation is needed for P0.
REA is optional. A generic local EVM fork is not assumed to reproduce HyperCore.

Ordinary increments use normal commits. New prereleases are reserved for meaningful
milestones; existing tags are never moved. The initial tag is `v0.1.0-alpha.1`,
with the release title **Public Research Launch**. Independent websites, hosted
services, and trading operations are outside this roadmap's automatic authorization.
