# Bounded read-only collection

Status: implemented M0 collector. Online collection is an **explicit command**;
normal validation and tests do not access a production provider.

```sh
pnpm collect research/plans/discover-finalized.json DISCOVERY-001
```

This real command makes at most two public reads: a chain-ID handshake and a
finalized-block query. It writes a new private ledger at
`data/private/DISCOVERY-001.json`, never overwriting an existing file. A successful
ledger exits 0; recorded partial/blocked collection exits 2; invalid plans or output
failures exit 1. CLI output contains only the relative ledger path, status and count.

## Enforced network boundary

The only endpoint is `https://rpc.hyperliquid.xyz/evm`, identified in the
[official HyperEVM documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm).
No host override, authentication header, cookie, redirect, alternate endpoint,
or automatic retry is exposed by the CLI. HTTP POST is allowed solely for the
following JSON-RPC methods with validated parameters:

| Method | Constraint |
|---|---|
| `eth_chainId`, `eth_blockNumber` | No parameters |
| `eth_getBlockByNumber` | Explicit block quantity or `finalized`; transactions disabled |
| `eth_getCode` | Contract address and explicit block quantity |
| `eth_getStorageAt` | Contract, 32-byte slot, explicit block quantity |
| `eth_getTransactionReceipt`, `eth_getTransactionByHash` | One complete 32-byte transaction hash |
| `eth_getLogs` | One contract, up to four exact topics, explicit range of at most 50 blocks |

Signing, broadcasting, transaction submission/cancellation, account unlocking,
`eth_call`, production intent endpoints and maintenance are rejected. State queries
cannot fall back to `latest` or `pending`. Contract storage reads require an
independently justified slot; the collector does not identify proxy types.

Plans contain `rpc` or `logs` steps and are fully validated before any network
call. The automatic chain handshake must report 999 before subsequent reads.
Limits: at most 60 total requests including the handshake; at least one second
between starts; configurable timeout up to 30 seconds covering body reads; at most
2 MB per response. Concurrent library calls are serialized. Failed attempts count
against the budget. 401, 403 and 429 stop the client; numeric `Retry-After` is recorded
without an automatic retry. Other failures remain explicit, with no invented data.

## Pagination and completeness

A `logs` step has `address`, `topics`, `from`, and `to`. Its inclusive range is at
most 500 blocks, divided into pages of at most 50. Returned logs must be inside
the page, match the contract/topics and not be removed. Identical duplicates are
collapsed. Conflicting block hashes, transaction positions/hashes or block-wide
log indices fail closed. The library returns deterministic block/transaction/log
order. The private ledger retains the original page results for review.

`provider_reported_only` means the provider returned the pages without a detectable
internal conflict. It is not an independent proof of completeness or finality.
Pin and recheck boundary hashes when selecting a case; receipt, trace and archive
capabilities must be assessed separately. The official default RPC documentation
currently limits state reads to latest and does not promise historical state;
this collector sends explicit block tags but cannot force the server to honor them.
It records both errors and successful transport responses. A successful state read
must **not** be promoted to a historical snapshot: [CASE-001](research-notes/004-economic-path-and-state-audit.md)
found a closed-before-close inconsistency. The collector does not authenticate
state age or deployment history.

Each private outcome records the request, client start/end, HTTP status, response
hash, result if successful, or a bounded failure category/error code. Upstream error
messages are omitted. Partial scans keep `stop_reason`; an invalid log page cannot
be relabeled successful merely because HTTP succeeded. These are untrusted data,
not instructions, and are not automatically public. See [safe export](safe-export.md).

Tests use synthetic responses and a local HTTP server for actual POST/redirect
behavior. The loopback test needs permission to listen on `127.0.0.1`; it never
contacts the endpoint above. No successful test demonstrates live archival support.

Transaction lookup `ok` means the JSON-RPC envelope and transport checks passed.
It does not authenticate the returned transaction, its block/index, input semantics
or finality. Research must cross-check the requested hash, receipt identity, chain
and pinned block. Transaction inputs may contain signature material: retain raw
responses privately and publish only reviewed summaries or metadata projections.
