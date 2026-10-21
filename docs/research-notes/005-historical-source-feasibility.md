# CASE-001: locating recorded precompile inputs and archive evidence

Date: 2026-10-21. **No eligible case selected; M1 remains blocked.**
The fixed interval remains **49105284–49105783**, with the original 294 candidate
coordinates and order unchanged. This is source-capability research, not a new
settlement result. The [state-binding withdrawal](004-economic-path-and-state-audit.md)
continues to apply to every old default-RPC code/storage/parameter response.

## What this investigation adds

The strongest new lead is a block's **recorded read-precompile inputs and outputs**.
The official [JSON-RPC documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/json-rpc)
says read-precompile records cover calls actually made in that block; hypothetical
reads require a full L1 replay. It also reiterates that the default implementation
does not support historical state. This is a documented acquisition path, not
proof that we possess the target block's records.

The independent archive implementation
[nanoreth](https://github.com/hl-archive-node/nanoreth/tree/2c6525dadb8f47d4b6cf88f2401561509fab9b00)
exposes `eth_blockPrecompileData` in its
[RPC source](https://github.com/hl-archive-node/nanoreth/blob/2c6525dadb8f47d4b6cf88f2401561509fab9b00/src/node/rpc/precompile.rs).
That method accepts a block identifier and returns `HlExtras`. The inspected
[types](https://github.com/hl-archive-node/nanoreth/blob/2c6525dadb8f47d4b6cf88f2401561509fab9b00/src/node/types/mod.rs)
contain `read_precompile_calls` and `highest_precompile_address`. Records group
input/result pairs by precompile address. Each input includes **bytes and gas limit**;
a successful result includes **gas used and output bytes**, with explicit failure
variants. These are source-level observations at the pinned commit, not an API
availability test against a deployed provider.

The inspected getter returns default extras if block lookup finds no block. An
empty response therefore needs a separate block-existence and hash check; it
cannot by itself establish that the historical execution had no precompile reads.

The [executor](https://github.com/hl-archive-node/nanoreth/blob/2c6525dadb8f47d4b6cf88f2401561509fab9b00/src/node/evm/executor.rs)
matches the complete input key, including gas. A historical synthetic call with
different gas can miss a recorded read even if its calldata matches. An unmatched
read without a forwarder produces an out-of-gas result. The
[RPC implementation](https://github.com/hl-archive-node/nanoreth/blob/2c6525dadb8f47d4b6cf88f2401561509fab9b00/src/node/rpc/mod.rs)
does not enable live forwarding for older blocks. Consequently, a failed
hypothetical call would not by itself refute the original transaction, and a live
forwarded response cannot fill a historical price gap.

**Research inference:** retrieving the original block extras and a trace of the
actual transaction is more directly useful than guessing bid/ask from its midpoint.
For candidate 4 we still need to establish whether the historical path used BBO
at `0x000000000000000000000000000000000000080e` or a frozen pair, and which exact
input and output it consumed. The extras are block-level data, not automatically
a transaction attribution or a cryptographic proof. Matching a block hash alone
does not authenticate every provider-supplied extra field.

## Sources checked and access boundaries

| Route | What the source establishes | What was actually obtained / limit |
|---|---|---|
| Default Hyperliquid RPC documentation | Historical state unsupported; actual read-precompile calls are recorded | Documentation only. No new RPC requests or repeated historical-tag state reads. |
| [Official raw HyperEVM blocks](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/raw-hyperevm-block-data) | Node output and S3 block files; MessagePack with LZ4 compression; requester pays for transfer | No target block file downloaded; no AWS credentials or billing used. Target object availability unverified. |
| [Official HyperEVM sync example](https://github.com/hyperliquid-dex/hyper-evm-sync/blob/main/README.md) | A proof of concept for executing historical transactions from genesis or a supplied state | Read only. No install, state seed, synchronization or replay. |
| nanoreth source at the pinned commit | Block extras interface, recorded-call replay behavior and system-transaction presentation | Source text and blob hashes retained privately. No running endpoint, retained target state or target trace verified. |
| [Quicknode HyperEVM overview](https://www.quicknode.com/docs/hyperliquid/hyperevm-overview) | Provider claims full mainnet archive and debug/trace via `/nanoreth`; `/evm` is a different route | Documentation read. Uses a provisioned endpoint/token; none created or used. Target-block success and custom extras method support untested. |
| [SolidRPC HyperEVM](https://solidrpc.io/docs/chains/hyperevm) and [tracing](https://solidrpc.io/docs/tracing) | Provider advertises archive/debug/trace for chain 999 | No key or endpoint used. Its [keyless policy](https://solidrpc.io/docs/public-rpc) rejects debug/trace, directs archive work to authenticated access, and does not list HyperEVM among public networks. |
| [Official market-data archive](https://hyperliquid.gitbook.io/hyperliquid-docs/historical-data) | L2 snapshots and asset contexts; updates roughly monthly with possible gaps; requester-pays transfer | No dataset downloaded. A nearby snapshot or a trade print would not establish the execution-time BBO. |
| [Dwellir archival-data URL](https://www.dwellir.com/docs/hyperliquid/archival-data) | Search result advertised historical products; page redirected to `historical-data` | Retrieved page text did not substantiate the search snippet's detailed coverage inventory. No target dataset, access entitlement or availability established; snippet dates are not adopted as evidence. |
| [Candidate explorer page](https://hyperevmscan.io/tx/0x44814dab6b4fed15ed1a3e912f3d3cc3c0850a03e309b87a3c8b78c7df1d678a) | Potential transaction-level evidence route | Web reader reported inaccessible. No trace, state diff or price bytes obtained. |

The official Interacting with HyperCore page did not yield usable evidence in this
round; repeated web access included timeouts. An incorrect historical-data path
also failed before the correct official page was read. These failures do not prove
that the underlying sources or datasets are unavailable to other clients.
This bounded search is not an exhaustive claim that no free archive exists.

## Two acquisition traps to avoid

**Block conversion can discard the needed fields.** The inspected official
[SDK block indexer](https://github.com/hyperliquid-dex/hyperliquid-python-sdk/blob/master/examples/evm_block_indexer.py)
selects header and transaction fields for its output. It does not preserve
`read_precompile_calls`, `highest_precompile_address`, receipts or system transactions
as separate top-level data. If original block files become available, keep the
original bytes privately and parse these fields explicitly. The example's output
alone is not a sufficient replay packet. Its transaction export also retains
signature/input fields, so it is not a public-safe exporter.

**Archive transaction coordinates may differ.** Quicknode's overview and nanoreth's
[README](https://github.com/hl-archive-node/nanoreth/blob/2c6525dadb8f47d4b6cf88f2401561509fab9b00/README.md)
describe additional system transactions/receipts in archive views. Match user
transactions by hash and receipts, record the provider's presentation mode and
account for system effects before reconstructing prestate. Do not replace the
original candidate coordinates with archive indices or assume that index 2 means
the same preceding sequence on every endpoint. No such discrepancy has yet been
measured for the candidate block itself.

## Exact target and acceptance conditions

The previously retained provider-reported candidate header gives block 49105287
hash `0xb3d6f482c4ed76969a6c8467832465214c933c63b2c376ceb08383bf05e8c58b`,
timestamp **2026-10-21 04:29:15 UTC** (**12:29:15 Asia/Singapore**). This timestamp
was decoded locally from the existing capture; it is not an independent new block
observation or a HyperCore state-height mapping. The predecessor is 49105286,
hash `0x56406858b8da3a17aca218a6b488baddadc0e07ab09b644f2e0048e217395685`.

For a future bounded acquisition in this same window:

1. Establish chain 999, provider/client identity, retained historical coverage and
   block/hash agreement. Retain raw responses privately with byte hashes; distinguish
   provider reports from independently verified state or execution.
2. Obtain actual historical proxy, implementation, library and oracle code plus
   parameters, open-position state and ledger/queue inputs. A predecessor snapshot
   must be advanced through all preceding user and system effects to reach the
   candidate's execution point; it is not automatically transaction prestate.
3. Obtain the candidate call trace and block read-precompile records. Associate the
   historical oracle call with the exact address/input/gas/result, determine market
   index and units, and reconcile the consumed bid/ask or frozen pair with the event
   exit. A missing read, error variant or unmatched gas key stays missing.
4. Reconcile execution status, authorization, event results, balances, LP, fee
   ledgers and queue deltas with independently derived expectations. A call tree
   alone is not a complete prestate or state-diff witness.
5. Revisit earlier candidates in their original order using the authenticated
   semantics before selecting the first qualifying ordinary winning close. Preserve
   candidate 4's current status until all decisive gates pass.

These are acceptance conditions, not implemented collector capabilities. The
collector still has its existing single-endpoint and method allowlist. No trace,
custom extras method, arbitrary endpoint or live forwarding was added. If a
usable access route becomes available, a separately recorded bounded acquisition
plan and reviewed collector change must precede requests. No credentials, paid
service, node installation or cloud deployment was initiated.

## Accounting, verification and remaining gaps

The [local pre-read plan](../../research/cases/001-archive-plan.json) allowed 30
explicit source accesses and eight search queries, separately counted, with zero
new RPC requests. Actual use is **30/30 source accesses and 8/8 search queries**,
including repeated reader accesses, failures, GitHub source/tree/commit reads and
two reader searches within already opened pages. Reader-internal fetches are
unknown; Git administration is excluded. Cumulative CASE-001 RPC attempts remain
**85**. The [structured follow-up](../../research/cases/001-archive-feasibility.json)
lists accesses, source digests and missing evidence. Exact per-access retrieval
timestamps were not recorded; source capture-save time is not retrieval time.
Some web-reader responses were not retained locally; no HTTP-body digest or full
raw capture is claimed for those pages.

No actual historical state, transaction trace, state diff, precompile output or
independent settlement expectation was acquired. Candidate 4's existing arithmetic
match remains a same-case consistency observation. `selected_transaction` remains
null; the original ledger is byte-for-byte unchanged. Production code and both
homepages are unchanged. Verification results for this increment are recorded in
[STATUS](../../STATUS.md); tooling tests cannot establish historical reproduction.
