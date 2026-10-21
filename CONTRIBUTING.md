# Contributing

Useful contributions include source corrections, competing explanations,
version-bound observations, and independently reproducible public cases.
Read [the method](docs/research-method.md) and [data policy](DATA_POLICY.md) first.

Use this repository's Issues for non-sensitive research questions and pull
requests for changes. Check existing topics before opening another issue. Provide:

1. The question or claim ID, its scope, and what could falsify the explanation.
2. Source URLs and exact versions; separate first-hand evidence from copied claims.
3. Actual commands/checks run, inputs, results, gaps, and alternative explanations.
4. A minimal redacted packet only if you have rights and explicit disclosure permission.

Do not post raw chats, authenticated HAR captures, credentials, active signed
requests, wallet-to-person links, or unreviewed exploit details. Removing a public
comment later cannot guarantee removal from copies. See [SECURITY.md](SECURITY.md)
for sensitive findings; no private reporting channel is promised at launch.

Keep changes focused. Future model changes need regression coverage of the actual
path, exact integer semantics, and independently sourced expected results.
Synthetic fixtures must say synthetic. Never call a test passed if it was not run.

Contributions intentionally submitted for inclusion are under Apache-2.0 unless
explicitly stated otherwise and accepted under compatible terms. Keep third-party
licenses and provenance; do not assume linked material is freely redistributable.
This project does not authorize contributors to trade, bypass restrictions,
probe private systems, or contact third parties on its behalf.
