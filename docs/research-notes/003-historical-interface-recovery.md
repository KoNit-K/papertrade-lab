# CASE-001: historical interface, storage and call mapping

> Superseding audit (2026-10-21): [note 004](004-economic-path-and-state-audit.md)
> withdraws historical code/storage temporal bindings. Layouts and byte offsets
> describe returned bytes only. The default provider documents latest-only state;
> successful historical-tag requests did not authenticate historical deployment.

Date: 2026-10-21. **Partial structural recovery; economic claims unverified;
M1 blocked.** This continues the [original intake](002-first-case-intake.md) without
expanding blocks **49105284–49105783** or changing the existing candidate order.
The first eligible ordinary winning settlement has not been established.

## Source recovery and its limits

The Exchange runtime already captured at block 49105284 has a Solidity CBOR trailer
identifying compiler `0.8.24` and the IPFS metadata CID
`QmX46b3W8qXKJWqiheKCwQaeyY1AhJK88ct7FQwezQiGyE`. This is an identifier extracted
from the runtime, not retrieved or validated compiler metadata.

- [Sourcify lookup](https://sourcify.dev/server/v2/contract/999/0x0f3febfc94876b0c895f7acecdc8f5c863b549ee?fields=all)
  returned HTTP 404 and null match fields. It supplied no source or ABI.
- The [implementation explorer page](https://hyperevmscan.io/address/0x0f3febfc94876b0c895f7acecdc8f5c863b549ee#code)
  was retrieved this time and displayed the invitation to verify/publish source;
  no verified ABI or source was available in that response.
- [Content-addressed metadata retrieval](https://ipfs.io/ipfs/QmX46b3W8qXKJWqiheKCwQaeyY1AhJK88ct7FQwezQiGyE)
  timed out after 25 seconds with no body. No payload hash match or source
  reconstruction was claimed.
- The official [frontend entry](https://exchange.papertrade.xyz/) referenced
  [index-CDAp4ke1.js](https://exchange.papertrade.xyz/assets/index-CDAp4ke1.js).
  Its [typed-data definition](https://exchange.papertrade.xyz/assets/typed-data-B0hqt2-N.js)
  describes Close fields `user`, `positionIds`, `nonce`, `deadline`. It is a
  current source lead, not proof of the frontend version used by this transaction.
  Downloaded scripts were read as text, never executed. The inspected schema/wire
  files did not supply the missing historical contract ABI or compiler layout.
- The public [signature service](https://docs.sourcify.dev/docs/api/) supplied some
  event names but no match for the individual close event or call-result event.
  A dictionary's `hasVerifiedContract` flag does not identify this deployment.

No complete, authenticated historical ABI or compiler-generated `storageLayout`
was obtained from these sources. This is an access finding for the consulted
sources, not proof that the material exists nowhere else. The [recovery record](../../research/cases/001-interface-recovery.json)
contains body hashes and failed attempts. Raw pages/scripts are not mirrored.
Exact per-GET client timestamps were not captured and remain null.

## Interface candidates recovered from historical bytes

Small candidate-name/type searches were performed locally with Keccak-256. The
following preimages match observed selectors/topics and compatible byte layouts:

| Candidate | Selector or topic | Historical cross-check |
|---|---|---|
| `execute((address,bytes,bool,bytes32,bytes32)[])` | `0x251fb27d` | Batch runtime dispatcher PUSH4 at byte 49; observed three-item dynamic tuple array |
| `closeBySig(address,uint256[],uint256,uint64,uint8,bytes32,bytes32)` | `0x2792e706` | Exchange dispatcher PUSH4 at byte 157; complete 292-byte inner-call layout |
| `PositionClosed(uint256,address,uint64,int256,int256,bool,uint256)` | `0x87902ed2…582f89bf` | Exchange runtime topic constant starts at byte 14761; three topics and five data words |
| `CallExecuted(bytes32,uint256,bytes32,bool,bytes)` | `0x8a23ef11…84e349cad` | Batch runtime constant at byte 3334 (`0x0d06`), referenced through CODECOPY; four topics and ABI-shaped bool/bytes data |

Full topics and indexed-field candidates are in the recovery record. A function's
four-byte selector can collide; a matching preimage alone is not an authenticated
ABI. Event types do not encode parameter names or indexed flags. Those assignments
come from the observed layout and bytecode inspection and retain the stated scope.
Neither a name match nor a boolean event field independently proves authorization.

The BatchExecutor proxy code at block end was identical to the previously inspected
Exchange proxy code, supporting the same EIP-1967 slot-read procedure. The pinned
batch implementation was `0xe0bc9cc7b067060aafccbaa3e250700c9cdd7262`, 3,451 bytes,
with Keccak-256 `0xe926c659aca61daaaf9e68267817be4dae5152f11320a6ba970549dfdd15f62a`.
The Exchange remains bound to the previously recorded 23,052-byte runtime and hash.
A reread of block 49105284 matched the original hash. These are block-end identities;
no trace proves the implementation identity throughout transaction execution.

## Partial storage layout

Manual inspection followed the getter dispatch paths in the pinned Exchange runtime:

| Candidate getter | Entry byte | Observed mapping root | Read extent |
|---|---:|---:|---|
| `positions(uint256)` | `0x1d57` | 10 | base slot and base + 1 |
| `instruments(uint32)` | `0x11d7` | 7 | base through base + 2 |
| `balances(address)` | `0x3105` | 9 | base slot |

For the position path, base is `keccak256(pad32(id) || pad32(10))`. The return
extraction is: slot 0 bits 0–159, 160–191, 192–255; slot 1 bits 0–127,
128–159, 160–223, then three nonzero-byte booleans at bits 224, 232 and 240.
The JSON record lists these as numbered outputs rather than established business
field names. The instrument getter's complete economic field layout and units
have not been recovered. No aggregate balance read was needed or published.

The two slots for position 1712506 and three instrument-0 slots were read at
**block end 49105284**, within the fixed window. The position record was retained,
not zeroed. Its address field matches the close call's user field in the private
records. This establishes a structural association, not a wallet/person identity.
These snapshots do not establish exact transaction pre-state or intra-batch state.

## First candidate: what the mapping now supports

The hash-addressed transaction read matched the requested hash, receipt's block
hash/number and transaction index, chain 999, and the expected BatchExecutor target.
Its 1,508-byte input parses as three candidate batch items. The first item targets
Exchange and contains the candidate `closeBySig` call with exactly one position ID:
**1712506**. That ID matches the first position-close event; the private user fields
also match the retained position record.

The call-result event at log 4 has item index 0, its indexed call identifier equals
the first tuple's fifth field, and its first indexed identifier matches the final
batch-summary event. Under the recovered event layout, its boolean is true and
return bytes are empty. This improves on the earlier transaction-only success
observation. The identifier's cryptographic derivation and signature authorization
have **not** been independently verified; the two bytes32 tuple fields' full
business semantics remain unknown. Raw calldata, signature components and user
addresses are withheld.

The two signed close-event words both decode to `-5564780542590255595`. A plausible
interpretation of the retained position gives entry price 828065, margin
57600000000000000000, leverage 500 and a long direction, with event price 827905.
Under that **field-meaning hypothesis**, truncating
`-(57600000000000000000 × 500 × (828065 − 827905) / 828065)` toward zero matches
the two negative words. This is a sanity check on a hypothesis suggested by this
same case, not a held-out test, a verified formula, or M1 implementation.
It does not justify promoting the first candidate as an ordinary winning close.

Across the already collected window, 310 individual-close topic matches have
compatible word shapes. Of these, 142 have both signed words negative, 139 have
both positive, and 29 have other sign pairs. The earliest positive-pair event is
at block 49105287, transaction index 2, log index 3, preceding aggregate lead
**ordinal 4** at log index 5. It remains a structural lead, not a selected eligible
case. The original ledger and its order are preserved; no later case was chosen
because it better fits a model, and no additional receipt/position review of
ordinal 4 is claimed. Economic meanings cannot be inferred solely from signs.

## Reads, publication and the M1 gate

This follow-up used **14/30 new RPC attempts**, all returned `ok`: transaction
lookup (2), batch proxy and five storage words (7), batch implementation slot (2),
batch implementation code and block reread (3). All state requests used block
49105284. Combined with intake, there have been 43 RPC attempts, not 14 in total.
No additional event range was scanned. Collection stopped with shared decisive
inputs still missing rather than consuming the entire budget.

Source-access accounting has a limitation: four initial source accesses preceded
the local plan. After registration, ten direct artifact GETs and three web-reader
accesses were made. Counting both exceeds the plan's 12-access source budget by
one. In total this turn had 12 direct artifact attempts plus five web-reader
accesses. This counts tool-level operations, not hidden web-reader retries. The
plan is retained as issued and the discrepancy is recorded; no further source
access was made. This did not change the chain sampling window or RPC budget.

Reviewed exports: [transaction metadata](../../evidence/public/CASE001-TX.json),
[layout reads](../../evidence/public/CASE001-LAYOUT.json),
[batch slot](../../evidence/public/CASE001-BATCH-SLOT.json),
[batch code](../../evidence/public/CASE001-BATCH-CODE.json), and
[chain metadata](../../evidence/public/CASE001-RECOVERY-CHAIN.json).
The expanded private packet validates as two incomplete versions, 14 evidence
items and two blocked claims. It reuses five earlier Exchange evidence items;
these are not 14 independent new observations. Metadata excludes payloads and
cannot itself reproduce settlement.

A sufficiently validated reconstruction of relevant bytecode behavior could
satisfy the evidence gate without published source. The present reconstruction
does not yet do so. M1 still needs validated economic field semantics and parameter units,
execution pre-state and dependencies, exact price-source context, authorization
and intent identity, transaction-point implementation identity, and an independent
integer settlement/ledger result. The current block-end records and matched
selectors do not supply these. **No eligible case is selected, no M1 replay command
is implemented, and no protocol claim is upgraded to verified.**

The collector now supports a strictly hash-addressed transaction read. Of its seven
new tests, the successful-lookup and missing-result cases failed before support
was added; five malformed-request cases were already rejected. All seven passed afterward;
all 147 tests and strict type checking then passed. Tests used synthetic data and
a loopback HTTP server. The first full-test launch hit an automatic permission
review timeout and did not run; the permitted retry completed successfully.
