# Chain evidence and historical snapshots

Status: M0 tooling implemented for the profile below. **No real settlement has
been reproduced.** This schema is separate from the original document records.

```sh
pnpm validate:chain fixtures/synthetic/chain-packet.json
```

This committed example is synthetic. Its `complete` result tests consistency of
declared fields; its bytecode and addresses are not a real proxy or deployment.
All supported claims remain `unverified`; `reproduced`, `mismatch` and `supported`
are rejected until an independent M1 replay contract exists.

## Profile and identity

[Schema](../packages/evidence/chain.schema.json), [validator](../packages/evidence/chain.ts).
A packet includes `fixture_kind`, versions, evidence and claims. Unknown fields
are rejected. Quantities are decimal strings, addresses and EVM hashes are
lowercase hexadecimal, and unknown implementation/parameter fields stay null.

Each version identifies chain 999, block number **and hash**, proxy, implementation,
parameter snapshot and execution context. Each evidence row must match its
version's chain, block and proxy. A source URL cannot substitute for content.
Every payload has a checked SHA-256 of recursively key-sorted compact JSON;
arrays retain order. `source_response_sha256` identifies privately retained response
bytes and is **not** byte-verified by this packet validator.

Supported payloads are block headers, minimal receipt descriptions, proxy storage
slots, bytecode and storage-backed parameter snapshots. Receipt transaction/index
and selected log index must agree with the payload. All state snapshots are
`block_end`: none represents a transaction's pre-state or intra-batch state.

`binding_status: complete` requires internally consistent block evidence,
reviewed proxy-code evidence for the declared EIP-1967 type, the implementation
slot/address, implementation bytecode with the actual **Keccak-256**, and a
parameter-payload SHA-256 backed by matching storage observations. SHA-256 is not
used in place of Keccak. Contradictory values for one historical slot, code
address, block or receipt are rejected even if their individual hashes are valid.

This validates a reviewer's declared proxy classification and supplied slot list;
it does **not** prove that the code implements EIP-1967 or that every decisive
parameter was found. Other proxy types stay incomplete rather than being guessed.
A parameter packet can be structurally complete while insufficient for a trade.
Implementation and parameter fields that are supplied are checked even if the
version is marked incomplete.

## Historical boundaries

- Incomplete identities and `needs_revalidation` require blocked reproduction.
- `supersedes` must resolve to the same chain/proxy at an earlier block.
- A single snapshot may claim only its exact block or unknown effective bounds;
  it cannot establish an unchanged interval from one sample.
- `compareVersions` compares implementation, parameters, block identity and scope.
  Parameter changes alone require revalidation; unknown fields cannot establish
  that a deployment stayed unchanged. It reports the requirement, not a fabricated
  revalidation run or an automatic upgrade of a claim.
- Evidence and dependencies cannot cross versions. A new version does not inherit
  an old claim's evidence or reproduction result.

Provider truth, finality, proxy classification, ABI semantics, pre-state and input
completeness still need independent evidence. A successful validation is not M1
completion. The public exporter intentionally removes payloads and addresses;
its manifest is not a self-contained replay packet.

Primary references: [EIP-1967](https://eips.ethereum.org/EIPS/eip-1967),
[HyperEVM RPC limitations](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/json-rpc),
and [noble-hashes](https://github.com/paulmillr/noble-hashes).
