# Data and publication policy

## Allowed public subset

Original explanations, source links, content hashes with stated algorithms,
minimal necessary summaries, explicitly synthetic examples, and specifically
approved redacted evidence may be considered for publication. A public blockchain
record is not automatic permission to link it to a person's report or identity.

The initial release includes only anonymized summaries of five reported behaviors.
It contains no original chat, wallet records, transaction case, raw capture,
third-party source mirror, or private local path. Unknown observation dates,
domains, amounts, and versions remain unknown.

## Keep outside public files and history

Private keys, seed phrases, access tokens, cookies, Authorization values, session
keys, active signatures, replayable requests, raw HAR/network captures, original
chat exports, environment files, private paths, and wallet identity links must not
be published. The local task handoff is not a research source and is not committed.
Ignored files are not automatically safe; `.gitignore` cannot remove history.

## Review before export

1. Determine the specific permission and redistribution basis for each item.
2. Minimize fields; remove credential values, identifying joins, private paths,
   and request material at all nesting levels. Hashes alone are not anonymization.
3. Review an explicit file allowlist, generated output, staged diff, and every
   commit being pushed. Do not use a workspace-wide blind add or mirror push.
4. Keep uncertain material private and publish the clean subset. Record checks
   actually performed and their limits; no scanner is a guarantee.
5. Review new evidence again when combining records could reveal identity.

Automated redaction/export tooling is planned, not implemented. Manual review is
required now. No sensitive raw material is needed to contribute a research question.

## Collection boundaries

Only bounded, low-rate public reads are authorized for research. Respect access
controls, site policies, and rate limits. Record missing data or denied access;
do not bypass it. Judge RPC POST by its method, not the HTTP verb alone. Signing,
transaction submission/cancellation, funding, withdrawals, claims, key registration,
and production maintenance are excluded. No cloud deployment or unsolicited outreach.
