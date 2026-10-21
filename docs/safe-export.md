# Reviewed metadata export

Status: implemented for `chain-evidence-v1` and `collection-run-v1` only.
It deliberately refuses arbitrary HAR/chat files. Raw imports remain local;
this is a strict minimal projection, not a general-purpose anonymizer.

```sh
pnpm export:metadata <private-packet.json> <approval.json>
```

After reviewing the exact input bytes, prepare a local declaration with this
structure (replace the digest and choose a new filename):

```json
{
  "source_sha256": "<SHA-256 of the exact input file bytes>",
  "approved": true,
  "scope": "chain_metadata",
  "redistribution": "permitted",
  "identity_linkage": "none",
  "file_name": "CASE-001.json"
}
```

Use `collection_metadata` for a collector ledger. This declaration records the
review within existing task authorization; it is not a cryptographic signature,
proof of rights, or substitute for permission to disclose identifying material.
Do not create it for uncertain or unauthorized data.

The exporter checks the **raw bytes** against the approved digest before strict
UTF-8 decoding. Invalid encoding, changed input, unknown schema/fields, unsupported
scope, absent permission and nested sensitive keys/values fail. Recursive checks
include arrays and common naming variants for Authorization, cookies, private or
session keys, mnemonic/seed phrases, signatures, secrets and wallet-owner joins.
Tests also check sensitive fields within otherwise valid collector results, where
schema validation alone would not reject them.

The output is `evidence/public/<file_name>`, exclusively created with no overwrite.
Directory traversal and directory-symlink escapes are refused. The manifest records
the source digest, supported scope and `protocol_reproduced: false`.

- Chain projection: IDs, block/version metadata, evidence content digests and
  unverified/blocked labels. No original payload, bytecode, storage values, proxy
  addresses, transaction hashes or wallet addresses are copied.
- Collection projection: endpoint, timing, stop category, method, request/response
  digests and bounded error metadata. No request parameters or response bodies
  are copied. A result returned by a provider does not become a finding.

Automatic detection cannot recognize every secret disguised as a permitted hash,
or determine whether metadata creates an identity join with another publication.
Hashes are not anonymization. Manual review of the output, explicit staged-file
allowlists and outgoing Git history remains mandatory. These checks assume a
trusted local checkout; they do not defend against a concurrent attacker replacing
files during a write. No publishing, Git push or credential operation occurs here.
