# Roadmap

No delivery dates are promised. Documentation can be public while research remains
unverified. Updated: 2026-10-21.

| Milestone | Deliverable | Completion criteria | Current state |
|---|---|---|---|
| P0 — Public foundation | Bilingual home, mechanism map, observations, payout note, method, sources, policies, prerelease | Real content, reviewed public files/history, correct license and actual public repository/release verified | Published as v0.1.0-alpha.1 |
| M0 — Evidence foundation | Claim/evidence/version structures, source inventory, read-only boundary, safe export | Valid/invalid samples; references and hashes checked; evidence-free reproduction rejected; secret-bearing exports rejected | Tooling implemented for the documented profile: records, historical snapshots, bounded RPC and metadata export; bounded live intake and metadata exports completed, historical inputs incomplete |
| M1 — First reproducible case | Version-bound public trade, independent integer model and offline explanation | Decisive historical inputs; independent output comparison; explicit mismatches/gaps; no-network replay of verified fields | CASE-001 intake published; eligible selection and replay blocked by missing historical inputs |
| M2 — Trading mechanics | Fees, liquidation, directional limits, rejection and signature semantics | Separate interface/relayer/contract rules; boundaries, holdout cases, and integer behavior checked | Partial static/case research for intent queues, opposite positions and liquidation; full milestone incomplete |
| M3 — Ledger and PAPER | Cash/claim accounting, payout queue, issuance, staking, funding lifecycle | Conservation and state transitions tested; marginal/average issuance distinguished; no guaranteed future liquidity claims | Partial mint/staking paths, a real unstake and two separate distribution-ledger windows checked; full conservation, LP-surplus and active-debt lifecycle incomplete |
| M4 — Runtime and evolution | Waiting intervals, upgrades/parameters, frontend changes, read-only explanations | Missing timing stays unknown; changes invalidate affected results; no transaction capability | Partial governance chain and executed/cancelled/scheduled operations checked; new implementations, complete history and execution timing remain unverified |

## Immediate sequence after launch

1. **Records:** define machine-readable claims, evidence and version identity;
   use the tested chain snapshot validator without upgrading unverified claims.
2. **Sources:** capture a bounded set of primary pages with timestamps, hashes,
   version identifiers where available, and minimal publishable summaries.
3. **Case:** state a deterministic selection rule, locate an already public
   settlement, and list archival state/trace dependencies. Missing decisive inputs
   block precise reproduction, not unrelated documentation updates.

A future TypeScript `bigint` model will use fixed versions and a real lockfile.
No package skeleton, invented command, or tool installation is needed for P0.
REA is optional. A generic local EVM fork is not assumed to reproduce HyperCore.

## Current research priorities

The [five-question investigation](docs/research-notes/011-loss-governance-staking-and-payments.md) changes the immediate research order:

1. **Implementation changes:** analyze the scheduled targets and initialization payloads, then separately check whether execution occurred and which state changed. An earliest execution time is not proof of execution.
2. **Distribution timing:** quantify which undistributed funds late entrants can share, using complete event order and independently supported inputs rather than a synthetic example alone.
3. **Funding and payment capacity:** find actual LP-surplus, active-debt and partial-payment cases; distinguish cash inflow, claim destruction and internal allocation.

These are research questions, not announced findings or a running monitor. Historical
state gaps remain explicit; no signing, account-channel access, paid archive service
or cloud deployment is implied.

Ordinary increments use normal commits. New prereleases are reserved for meaningful
milestones; existing tags are never moved. The initial tag is `v0.1.0-alpha.1`,
with the release title **Public Research Launch**. Independent websites, hosted
services, and trading operations are outside this roadmap's automatic authorization.

## Public tracking

[Milestones](https://github.com/KoNit-K/papertrade-research/milestones?state=all) and
six summary Issues are available: [P0](https://github.com/KoNit-K/papertrade-research/issues/1),
[M0](https://github.com/KoNit-K/papertrade-research/issues/2),
[M1](https://github.com/KoNit-K/papertrade-research/issues/3),
[M2](https://github.com/KoNit-K/papertrade-research/issues/4),
[M3](https://github.com/KoNit-K/papertrade-research/issues/5), and
[M4](https://github.com/KoNit-K/papertrade-research/issues/6).
P0 is closed after verified publication. M0–M4 remain open without promised deadlines.
