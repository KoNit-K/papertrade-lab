# CASE-001: bounded public settlement intake

Date: 2026-10-21. Status: **unverified; reproduction blocked; no eligible
settlement case established**. The earliest event lead is retained for follow-up,
not promoted to an ordinary winning close. The subsequent [interface recovery](003-historical-interface-recovery.md)
adds structural call/position mapping without completing M1. This note does not connect a transaction
to any of the five anonymous reports.

## Selection and actual reads

The [registered plan](../../research/cases/001-intake-plan.json) used a two-request
discovery run (chain ID and finalized header), then fixed the most recent 500-block window before event reads:
**49105284–49105783**, inclusive, on chain 999. The end was reported as `finalized`
by the sole provider. Both boundary hashes were persisted before the log scan.
This is a locally timestamped plan, published after collection; it is not an
independently timestamped public preregistration. The interval was not expanded.

The fixed endpoint was `https://rpc.hyperliquid.xyz/evm`. All requests used the
committed collector with a minimum one-second interval and 15-second timeout.
Six runs attempted **29 of 30** allowed RPC requests: 28 returned `ok`; one failed
with `network_error` on its initial chain handshake. That run therefore reports
`blocked / chain_identity`, meaning the handshake could not establish identity,
not that a wrong chain was observed. A single normal retry succeeded. No access
denial or rate limit was bypassed. The remaining request was not used after the
shared historical-input gate failed.

| Run | Attempts | Outcome | Public metadata |
|---|---:|---|---|
| Finalized discovery | 2 | completed | [manifest](../../evidence/public/CASE001-DISCOVERY.json) |
| Start boundary | 2 | completed | [manifest](../../evidence/public/CASE001-BOUNDARY.json) |
| Code, ten 50-block log pages, boundary rereads | 14 | completed | [manifest](../../evidence/public/CASE001-SCAN.json) |
| Start proxy code, two implementation slots | 4 | completed | [manifest](../../evidence/public/CASE001-VERSION.json) |
| First detail attempt | 1 | network failure at handshake | [manifest](../../evidence/public/CASE001-DETAIL.json) |
| Detail retry: two implementation codes, receipt, boundaries | 6 | completed | [manifest](../../evidence/public/CASE001-DETAIL-RETRY.json) |

The scan returned **1,039 Exchange logs in 458 transactions**. Pagination/order
checks passed; boundary hashes matched on both later rereads. These are
provider-reported results, not an independently complete or finalized chain view.
The [outcome record](../../research/cases/001-outcome.json) contains topic counts,
point-in-time code hashes and explicit nulls.

## Historical identity: what was established

The deployment address came from the [official address page](https://docs.papertrade.xyz/dev/contract-addresses/).
At both boundary block ends, the Exchange proxy code was identical (925 bytes;
Keccak-256 `0x93076ef48e1d48172af505f739606cf1fa8425dbf9dbc6bee6743307bd4bd63b`).
Manual inspection of its runtime bytecode found the fallback entry at offset
`0x02fc`: it copies the constant at `0x0348`, loads that storage slot, and uses
its value as the `DELEGATECALL` target. The constant is the implementation slot
specified in [EIP-1967](https://eips.ethereum.org/EIPS/eip-1967). This control-flow
inspection, not merely a matching literal or function selector, motivated the
slot reads. It is a bounded manual classification, not a full proxy audit.

Both pinned slot reads returned implementation
`0x0f3febfc94876b0c895f7acecdc8f5c863b549ee`. Its pinned runtime code was identical
at the two endpoints: 23,052 bytes, Keccak-256
`0x9d20287df886415035d53344a0dc8a1044949308cc3283ee0fe7ea5f3ea28d92`.

This does **not** establish unchanged code throughout the interval or at an
individual transaction's execution point: an upgrade and reversal within a block
or between endpoints remains possible. Parameter snapshots and transaction
pre-state remain unknown. Both version records are therefore `incomplete`,
`needs_revalidation: true`, with null effective ranges and parameter hashes.
The [chain metadata](../../evidence/public/CASE001-CHAIN.json) exports two versions,
nine evidence items and two blocked claims. The private evidence packet passed
the implemented chain validator; public metadata omits its payloads and is not
itself a replay packet.

The provider accepted these explicit historical block numbers for code/storage
reads. That observation is narrower than a general archival capability claim;
it does not override the [RPC documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/json-rpc)
or establish historical execution state, traces or HyperCore prices.

## Earliest event lead and exclusion ledger

A third-party [DefiLlama adapter at commit 815e50b](https://github.com/DefiLlama/dimension-adapters/blob/815e50b0b599b5bc88cd12f7db60598d122442cc/fees/papertrade.ts)
provides a `PositionsClosed(address,uint256,uint256,uint256,uint256)` event
signature. Its Keccak topic is
`0xa32e4800a59f03b131f5fea90951bdf00d8d505ad98f48ece29d8620a0bf09b0`.
**294 logs** match that topic and the proposed two-topic/four-data-word layout.
This is an adapter-authored ABI lead, not an ABI authenticated against the
historical implementation or proof that a close was profitable.

Ordering by block, transaction index and log index gives the first lead:

- Transaction: [0xa27ad6fe…a3691f83b](https://hyperevmscan.io/tx/0xa27ad6fea35d00f484f244485f2a09fd6d002c7e5189086ca6a0b20a3691f83b).
- Block `49105284`; transaction index `0`; log index `3`.
- Receipt status `0x1`; 14 receipt logs. The selected log exactly matches the
  scan result; receipt transaction/block/index match the lead.
- Intended position, intent outcome, ordinary-winning classification, parameter
  values, execution prices and independent expected settlement: **unknown**.

Receipt success is a transaction-level observation. It does not prove each
batched intent succeeded, that fees imply a win, or that end-of-block balances
isolate this close. No payout number was computed or reconciled.

The [ordered ledger](../../research/cases/001-candidate-ledger.json) lists all 294
signature-matched leads with their shared missing-input exclusion. Only the first
receipt was inspected; the other 293 did not receive individual receipt/position
review. The remaining 745 logs remain unclassified; they are not evidence that
no other settlement exists. **No eligible case was established** is a limit of
this intake, not a claim that the interval contains no winning close.

The pinned [community protocol reference](https://github.com/nirholas/papertrade-sdk/blob/483a760ef596564e5ad799357a92e5726dada9ba/docs/PROTOCOL.md)
was also read for leads. Its reported matches and formulas were not adopted as
independent results or executed. Explorer source access was unsuccessful; no
verified source/ABI was obtained through it.

## Publication, checks and next evidence

Only original summaries, the minimized ordering ledger, public contract/transaction
identifiers and reviewed metadata are published. Contract identifiers describe
protocol deployment; the single transaction identifies a research lead and is not
attributed to a person. Raw logs, receipt payloads, bytecode, indexed user addresses,
chat records and wallet/report joins are excluded. Public coordinates still allow
chain lookups and are not claimed to anonymize a chain participant.

Each metadata export was bound to SHA-256 of its exact private source bytes,
validated, projected and reviewed under the user's authorized public research
scope. Provider-response hashes record captured response bytes; the collector
retains parsed results plus hashes, not the original wire bytes. Hash-only public
records cannot independently prove provider responses or reproduce settlement.
No third-party code, documents or raw chain dataset is relicensed or mirrored.

The actual offline packet check was:

```sh
pnpm validate:chain data/private/CASE001-CHAIN.json
```

That private input is deliberately not distributed. Readers can inspect the
public manifests and repeat bounded collection, subject to provider availability;
there is **no implemented settlement replay command**. Before M1 can select this
or a later eligible case, obtain an authenticated historical ABI/storage layout,
intent-to-position mapping, exact execution pre-state/parameters/prices and an
independent result. Preserve the fixed window and ordered ledger when revisiting
it. Do not replace these inputs with current defaults, a model output, or a
successful batch receipt.
