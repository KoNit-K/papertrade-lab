# Papertrade Mechanics Lab

**Understand Papertrade—from trade intent to final settlement.**

An independent, open research project investigating Papertrade through user
observations, source analysis, and, in future milestones, REA-assisted investigations
and reproducible models.

[简体中文](README.zh-CN.md) · [Mechanism map](docs/mechanism-map.md) ·
[First research note](docs/research-notes/001-winning-trade-payout.md) ·
[Status](STATUS.md) · [Roadmap](ROADMAP.md) · [Contributing](CONTRIBUTING.md)

> **Research preview — building in public.** This documentation release contains
> research questions, methods, and an exploratory payout analysis. It contains no
> independently reproduced on-chain results, working model suite, or completed
> REA investigation. Publication is not verification of protocol correctness.

## Questions we are investigating

- Why might BTC accept shorts while longs are unavailable?
- Where does opening or closing an order wait, and how does that differ from waiting for a payout?
- How does a displayed profit become a balance change or an unpaid claim?
- Why might the reported PAPER received per loss change over time?
- Which leverage, margin, and close-size rules belong to the interface, relayer, or contracts?

## Available now

| Resource | What you can read |
|---|---|
| [Mechanism map](docs/mechanism-map.md) | Questions, observable boundaries, source pointers, unknowns, and next checks across 14 areas |
| [Five user observations](research/observations.md) | Anonymized reports, competing explanations, and missing inputs; all unverified |
| [Why did a winning trade pay less than expected?](docs/research-notes/001-winning-trade-payout.md) | Candidate payout stages and a plan to distinguish deductions from delayed availability |
| [Research method](docs/research-method.md) | Separate provenance, support, reproduction, implementation, and version scope |
| [Source index](docs/sources.md) | Actual retrieval status distinguished from unread source seeds |
| [Initial evidence records](docs/evidence-records.md) | Six source readings, thirteen atomic claims and an offline document/observation validator |
| [Data policy](DATA_POLICY.md) | What may be contributed and what must stay out of public history |

Start with the mechanism map, then the payout note and its evidence gaps.
No installation or wallet connection is needed to read this release.

## Next milestone

M0 has begun with structured source/claim records and a documentation version identity.
An offline validator now checks document/observation records and published capture integrity.
Read the [validation guide](docs/evidence-records.md) for real commands and limits.
M0 now includes [historical chain snapshot checks](docs/chain-evidence.md),
[bounded read-only collection](docs/readonly-collection.md) and
[reviewed metadata export](docs/safe-export.md). Live case evidence and M1 replay remain unverified.
Then M1 selects a bounded public settlement case and
compares an independent integer model with independently sourced execution results.
See the [roadmap](ROADMAP.md) for acceptance criteria and the [status](STATUS.md)
for actual progress.

Optional REA (Reverse Engineer Anything) analysis, transaction explanations and
offline settlement replay remain planned. The implemented M0 commands are linked
above; they do not establish protocol correctness. There is no trading terminal or hosted service.

## Participate

Contribute corrections, alternative explanations, or carefully redacted evidence
through this repository's Issues or pull requests. Start with
[CONTRIBUTING.md](CONTRIBUTING.md), especially the disclosure rules. Public chain
data can still identify a person when linked to a report. Do not post credentials,
session secrets, active signatures, raw authenticated captures, or identifying
wallet records without explicit permission for the specific disclosure.

## Independence and license

Unofficial; not affiliated with Papertrade or the REA team. This is research,
not a security audit, production trading client, or investment advice. This
release performs no wallet operations and submits no transactions.

Original project code and documentation are licensed under [Apache-2.0](LICENSE).
Third-party material retains its own terms; see [Third-party notices](THIRD_PARTY_NOTICES.md).
