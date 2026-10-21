# REA cross-check: client requests, PAPER display and contract interfaces

Date: 2026-10-21. Baseline: `59503fd`. This adds actual **REA 6.7.0** runs to
earlier manual research. [Metadata-only record](../../research/cases/007-rea-analysis.json).
It does not establish complete source recovery or historical settlement reproduction.

## What this adds

| Finding | Meaning |
|---|---|
| Local calls connect close grouping, PAPER actions and submission | An acknowledged request is a separate stage from completed execution. |
| A captured PAPER ratio formatter divides minted PAPER by eligible mint basis | A per-record average differs from the current marginal mint rate; the page consumer is unavailable. |
| Five acquired runtimes have actual REA interface results | Known selectors are cross-supported, with explicit inference gaps. |
| The full main app exceeded both tested heap budgets | Key controller paths use exact excerpts; complete reconstruction remains unavailable. |

The ratio formatter is a newly located implementation detail of the earlier
[average-versus-marginal distinction](006-current-mechanisms.md#recovered-integer-integration).
The other mechanism findings cross-check previous research. None binds the original
user reports to a transaction, time or deployment.

## Inputs, version and actual coverage

The package is pinned to `rea-agents@6.7.0`, whose repository metadata names
[morluto/rea](https://github.com/morluto/rea). Its tarball SHA-512 matches registry
integrity; all 1,775 published regular files match the installation. Registry
signatures, attestations and all transitive dependency provenance were not verified.
The tool and dependencies remain outside this repository. The EVM provider reports
`evmole@0.9.3`. Version-pinned documentation links and actual run metadata are in the record.

The input comprises 22 previously captured public scripts from
`exchange.papertrade.xyz`, restored to URL-relative paths, totaling 939,463 bytes.
Copied files match capture SHA-256. No missing module, package metadata or source
map was synthesized. A separate literal top-level import/reexport check found 171
missing reference sites / 79 distinct paths; dynamic dependencies are not exhausted.
Capture times and later REA execution times are distinct.

The first frontend attempt failed during macOS ownership-helper preparation. With
a writable compiler cache, the run parsed 21 scripts, while the main app exhausted
the default 1 GiB worker heap. A separate 4 GiB main-app run also exhausted its heap.
Exit zero with partial Evidence is not complete analysis success. The 21 parsed
scripts yielded 788 structural nodes / 1,358 edges and 73,126 semantic nodes /
79,519 relations; coverage remains partial, including per-file semantic limits.

An unchanged app excerpt contains complete top-level statements at UTF-16
`[549710,575530)` / UTF-8 `[549750,575587)`, totaling 25,837 bytes. Two exact hooks
excerpts add 9,739 bytes. Original/excerpt hashes and offsets are recorded. External
bindings were not synthesized; these are not complete apps or complete cross-module
data flows. The app excerpt yielded 5,389 semantic nodes / 6,093 relations; hooks
yielded 1,944 / 1,810, retaining partial/unknown coverage.

Actual follow-ups include `trace-application-feature`, `trace-javascript-semantics`
and `inspect-analysis-view`. The staking outgoing feature trace contains 377 nodes,
530 edges and five terminal paths, with partial coverage. The hooks reference view
read 16 of 94 items; 78 remain unread through that view. Some endpoint/property
queries matched zero seeds under partial coverage; that is not feature absence.

EVM inspection rejects macOS arm64. A local Linux x64 slim container then lacked
procps `ps`; dependency installation encountered HTTP 502 and certificate errors.
No security check was removed. The final official full Node image supplies `ps`
and util-linux `prlimit`; five EVM runs succeeded with no container network,
read-only input mounts and REA's worker ownership/resource limits preserved.

The 44 major operational records contain 31 successes, including setup/help, and
13 preserved failures; they do not cover every exploratory shell read. The record
binds run times, exit codes, Evidence IDs and private output digests. Raw scripts,
bytecode payloads, complete Evidence, stderr and local paths remain private.

Portable CLI forms for the operations used are shown here; paths stand in for
selected local captures or complete inline-Evidence requests:

```sh
rea analyze-javascript-application ./captured-app --format json --full-output
rea trace-application-feature ./feature-input.json --format json --full-output
rea trace-javascript-semantics ./trace-input.json --format json --full-output
rea inspect-analysis-view ./view-input.json --format json --full-output
rea inspect-evm-interface ./runtime.hex hex --format json --full-output
```

## Client requests: local calls and manual interpretation

REA returned resolved **static** calls for these selected relationships:

| Trace | Local relationship | Meaning from the corresponding source range |
|---|---|---|
| `028-close-callers` | One call to `D`, excerpt `[24767,24787)` | Close code passes successive groups of at most 12 IDs. |
| `029-paper-callers` | Three calls to `be` | Claim, stake and unstake wrappers share the PAPER action path. |
| `033-submit-callers` | Four calls to `le` | PAPER, close, withdrawal and open use the submission helper. |
| `031-http-submit` | Three calls to `sb`, including one in `le` | Intent submission uses the HTTP wrapper. |
| `030-intent-tracker` | One call to `pb` | The account controller initializes local operation tracking. |

Add 549710 to an app-excerpt UTF-16 offset to locate the original, e.g. the close
call maps to `[574477,574497)`. Private traces retain node IDs, ranges, resolution
and unknowns; public metadata binds each output digest and Evidence ID. Business
meanings require source inspection. Cross-module joins were not all recovered.

These traces cross-support the earlier [client waiting rules](007-queue-and-dividend-payment.md#frontend-waiting-rules-what-is-actually-in-the-current-client):
close groups submit sequentially; later failure can leave partial submission; an
uncertain acknowledgement stays `unconfirmed`; indexed positions/outcomes reconcile
local operations. The 35-second HTTP timeout is not server cancellation or queue
expiry. Rank queries and account streams were read as source, never contacted.

Trace `040` retains three resolved relations from literal 3600 through its binding
into `Pe`, whose source constructs client-clock seconds plus that value. The
overall query remains **ambiguous**, with dynamic-call unknowns. The single-pending
table was manually rechecked; its property query `041` matched no seed. Existing
single-pending claims are not relabeled as automatically recovered table values.

The open path converts margin to an 18-decimal integer and places it in the signed
field named `size`; leverage is separate. The name alone must not be interpreted
as leveraged notional. Close signs position IDs rather than a closure percentage.
PAPER's shared helper signs Claim/Stake/Unstake; withdrawal is separate. Internal
claim credit and final payment semantics still rely on earlier contract and
[payment evidence](008-core-credit-and-relayer-pressure.md).

Trace `043` connects the order-input preview to local bust-price function `W`.
Source inspection finds the zero-equity reference is calculated before applying
the buffer, consistent with the previous formula. Signed open/close fields have
no displayed profit, fee, limit/trigger price or slippage setting. The valuation
dependency is missing, so full profit/fee preview versus actual settlement remains
unverified. Static calls do not prove execution, server FIFO, priority or ETA.

## Captured PAPER ratio formatter

In captured `emissions-BZPaNUNb.js`, formatter `d` calls guard `s`; REA trace `042`
recovers that resolved local call. Manual inspection of those bounded ranges shows:

```text
record average = paperMintedRaw / paperMintBasisRaw
```

The function applies display precision. It requires a positive basis and either
an unavailable batch total or minted PAPER no greater than that total; otherwise
it displays a placeholder. This guard does not verify the API fields or actual mint.

The denominator is **eligible mint basis**, which need not equal the entire cash
loss. This is an average for that record, not today's marginal rate. The formatter
is exported, but its page consumer was not captured. A local `d` to `s` call does
not prove any particular screen calls `d`, or that it is reached at runtime.
An earlier local explanation described this as the history display; publication
review narrows that wording to the captured formatter. The actual screen binding
and the original observer's display remain unknown. The ratio and guard meanings
come from source inspection; REA directly supports locations and the local call.

## Five EVM interfaces and seven argument differences

| Acquired runtime | Bytes | Inferred candidates |
|---|---:|---:|
| Exchange | 23052 | 98 |
| PaperTokenomics | 3324 | 21 |
| Profit/accounting library | 5790 | 10 |
| Mint arithmetic library | 585 | 1 |
| PaperStaking | 6054 | 36 |

All results state `runtime_execution: not-performed` and
`discovery_completeness: unknown`. Names come from earlier candidate preimages,
rehashed with Ethereum Keccak-256, not authenticated compiler ABI or REA name lookup.
All 42 compared selectors were returned; 35 argument strings agree and seven differ:

| Existing candidate | REA inference | Treatment |
|---|---|---|
| Signed open, close and claim | Final two `bytes32` words inferred as `uint256` | Equal word width does not recover original source types. |
| Signed withdrawal | Five of seven candidate arguments | Do not omit the two signature words when interpreting old inputs. |
| Four-uint `setMintParams` | First argument inferred as `bool` | Preserve the old four-uint, owner-guarded path interpretation. |
| Direct `stake(uint256)` and `unstake(uint256)` | No arguments, `view`, shared offset 1768 | Earlier work identifies disabled/reverting direct paths; business behavior uses signed paths. |

The record preserves all seven differences, offsets and JSON pointers. The mint
library's sole `0x7aac24ba` candidate has six uint256 inputs, cross-supporting the
previous interface. `getBustPrice` at 10400, `liquidate` at 10772 and `harvest` at
4471 agree with earlier entry locations; formulas, permissions and historical
transitions are not newly proved. The accounting library's argument candidates
are not a complete recovery of all economic inputs.

Five terminal CBOR candidates declare solc release bytes for 0.8.24. This is not
authenticated compiler/source/deployment identity. IPFS content was not fetched;
an inferred library `payable` does not establish a business payment permission.

## Boundaries retained

Notes 004/006's formulas, the [parameter-authority path](../readme-figures.md#parameter-authority)
and note 009's reserve checks remain prior manual/script results. Server scheduling,
complete fee preview, historical state/prices, original user-case binding and M1
replay remain unresolved. Prior case windows and records are preserved. No new
Papertrade HTTP, account-channel or RPC read, target execution, signature,
transaction, cancellation, funding, claim, credential service or cloud deployment
was used. The public record is an explicit metadata projection under the data
policy, not a new validator-authenticated historical chain packet.
