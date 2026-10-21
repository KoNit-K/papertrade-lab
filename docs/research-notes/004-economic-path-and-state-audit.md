# CASE-001: economic fields, fees and the historical-state audit

Date: 2026-10-21. **Candidate 4 is not eligible; M1 remains blocked and unimplemented.**
This increment keeps blocks **49105284–49105783** and the original ordering.
It explains a same-case arithmetic match, and corrects the historical interpretation
of state reads in the [intake](002-first-case-intake.md) and
[interface recovery](003-historical-interface-recovery.md).

## The decisive limitation

The default HyperEVM RPC [documents](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/json-rpc)
`eth_getCode` and `eth_getStorageAt` as **latest only**. It separately supports
historical transaction/receipt/block lookup. We previously recorded successful
state responses to explicit historical block tags; success does not demonstrate
that the server honored those tags.

For position **1712494**, both the requested predecessor block 49105286 and
candidate block 49105287 return the same two position slots, already marked
closed. In the inspected Exchange code, `0x3642–0x3652` tests the slot-1 byte
at bit 240 before entering a close, and `0x36ba–0x36c7` clears it. Thus the
predecessor response cannot simply be used as the open position's execution
pre-state. Instrument slots also match across the two requests. Account-balance
responses match each other but differ from the candidate receipt's balance-after
word; they are not independently reconstructed ledger states.

The candidate transaction is third in its block. We read both earlier transactions
and receipts: their destinations are other contracts and their receipts contain no
Exchange events. This is **not** proof that no internal call affected Exchange:
we have no internal-call trace or state diff. The candidate batch has only one
item, so there is no earlier item inside that batch. Neither observation repairs
the invalid historical-state assumption.

The provider's documented capability, together with the closed-before-close
inconsistency, makes these responses unsuitable as historical state evidence.
We do not claim to have independently proved exactly which latest block each
response represents. Earlier CASE-001 byte hashes still identify returned bytes;
**their temporal bindings for proxy, implementation, library, storage and parameters
are withdrawn pending an archive-backed check**. Block headers and transaction
records retain their provider-reported status. The old capture/manifests remain
intact as an audit trail, not usable historical replay inputs. No new chain-snapshot
packet is promoted from these responses.

## Original-order candidate review

The fourth aggregate lead is transaction
[`0x44814dab6b4fed15ed1a3e912f3d3cc3c0850a03e309b87a3c8b78c7df1d678a`](https://hyperevmscan.io/tx/0x44814dab6b4fed15ed1a3e912f3d3cc3c0850a03e309b87a3c8b78c7df1d678a),
block **49105287**, transaction index **2**, individual log **3**, aggregate log
**5**. The receipt reports success. Block hashes were read and rechecked:

| Context | Hash |
|---|---|
| Predecessor 49105286 | `0x56406858b8da3a17aca218a6b488baddadc0e07ab09b644f2e0048e217395685` |
| Candidate 49105287 | `0xb3d6f482c4ed76969a6c8467832465214c933c63b2c376ceb08383bf05e8c58b` |

The single BatchExecutor item contains selector `0x2792e706` and position ID
1712494. Input, event and returned position owner fields agree privately. The
close event has two positive signed words and its debt flag is false. This supports
a normal cash-funded winning-close interpretation, but does not authenticate the
historical implementation, authorization, or accounting inputs.

Ordinals 1–3 remain ahead of it. Their negative signed-word leads and unresolved
common evidence gates are retained; they have not all been independently replayed
or conclusively excluded by fully authenticated semantics. We do not skip them
and label ordinal 4 the first qualified winner. Ordinal 4 also fails the historical
input gate, so **selected_transaction remains null**. Later candidates are not
resampled to find a more convenient result.

## Where the economic calculation lives

In the returned Exchange runtime (Keccak-256
`0x9d20287df886415035d53344a0dc8a1044949308cc3283ee0fe7ea5f3ea28d92`),
the close branch performs two `DELEGATECALL`s to
`0xcd617f984158a4f5d287ddee0e8eb0fed204916d`:

| Exchange offset | Selector | Observed role |
|---|---|---|
| `0x37e3` | `0x82296364` | Receives entry, exit, margin, leverage, side and four impact parameters; returns two signed PnL words. |
| `0x3882` | `0xef1a27a9` | Receives queue/accounting context, margin, adjusted PnL, debt flag and fee rates; returns accounting amounts. |

The returned library has 5,790 bytes and Keccak-256
`0x6dd521e90deaa283432285694770360cf42830025b2b1e6916a3c41799160792`.
Its bytes match across the two requested tags, **without establishing historical
code identity**. We have not authenticated a complete source ABI or compiler
storage layout. The official [impact documentation](https://docs.papertrade.xyz/how/asymmetric-impact/)
names `QueueLib.applyMarketImpact`; that source name is a description, not recovered
source authentication.

The instrument getter at `0x11d7`, mapping root 7, reads three slots. Its packed
outputs were exercised locally against the returned getter bytes; meanings below
are inferred from call argument flow and documentation, not compiler field names.

| Output | Slot / bit / width | Candidate meaning | Returned raw value |
|---|---|---|---|
| 0 | 0 / 0 / 96 | rateMultiplier | 15000000000000000000000 |
| 1 | 0 / 96 / 96 | positionMultiplier | 814598000000000000000 |
| 2 | 0 / 192 / 32 | Price-cache index, not fully established | 0 |
| 3 | 0 / 224 / 32 | Maximum leverage | 1000 |
| 4 | 1 / 0 / 120 | Maximum position notional | 10000000000000000000000000 |
| 5 | 1 / 120 / 64 | Bust-buffer candidate, not validated | 476041580087574 |
| 6 | 1 / 184 / 64 | baseRate | 100000000000000000 |
| 7 | 2 / 0 / 128 | referenceNotional | 100000000000000000000000 |

The impact call uses outputs 6, 0, 1 and 7. With `W = 10^18`, they correspond to
0.1, 15,000, 814.598 and 100,000 respectively. The two global fee-rate responses,
slots 23 and 24, each contain `20000000000000000` (0.02 W). None is an authenticated
historical parameter. In particular, the bust-buffer candidate must not be silently
replaced with a rounded value from current documentation.

## Integer path and same-case consistency

This is a derivation for the observed positive, non-overflowing branch, **not a
complete model**. Zero/overflow guards, all losing branches, liquidation and queue
transitions have not been exhaustively modeled. Inputs combine the event exit
with returned position/parameter values, so the outcome is not a holdout result.

For the long-position interpretation:

- Entry = 827865; event exit = 827905; margin = 10000000000000000000; leverage = 100.
- The library's `0x01ff–0x0203` constant/division sequence computes `floor(entry / 50000) = 16` ticks.
- Effective exit = 827889; favorable difference after deadband = 24 ticks.
- Signed division at `0x027a` gives PnL = 28990233914949901.

**The event's first signed word matches PnL after deadband**, not PnL calculated
from the unadjusted 40-tick move. Calling it unqualified “raw market profit” would
hide a material deduction. The impact helper starts at `0x10a8`; the integer
stages observed for this branch can be expressed as follows (`//` means floor
for these positive values):

```text
move  = difference * W // entry
term1 = W^3 // (move * rateMultiplier)
term2 = referenceNotional * W // (move * 1000000 * positionMultiplier // W)
scale = (W - baseRate) * W // (W + term1 + term2)
adjustedPnl = postDeadbandPnl * scale // W
```

Rounding the final rational expression once would be a different calculation.
The observed intermediate values are:

| Stage | Integer result |
|---|---|
| move | 28990233914949 |
| term1 | 2299625000000071491 |
| term2 | 4234527337410731718 |
| scale | 119456039603958312 |
| adjustedPnl | 3463058530672270 |

A bounded temporary offline interpreter ran the returned library's PnL entry
with those candidate inputs. It returned exactly the two event signed words in
706 executed instructions. A separate integer calculation of the stages above
also matched. This tests interpretation of the returned code with supplied inputs;
it does not prove that this code or these inputs were used historically. The
interpreter is research scratch tooling, not a committed or audited EVM implementation.

For the observed winning branch, the proposed fee is
`floor(adjustedPnl * 20000000000000000 / W) = 69261170613445`.
The library's accounting branch contains the W-scaled fee division at `0x1415`
and split-by-two operation at `0x148d`. The corresponding event amounts agree:

| Quantity | Raw integer |
|---|---|
| Total fee | 69261170613445 |
| First fee share (floor half) | 34630585306722 |
| Second share (remainder) | 34630585306723 |
| Adjusted gain less fee | 3393797360058825 |
| Margin plus that gain | 10003393797360058825 |

The aggregate event's first word equals the last row. The two fee words equal
the proposed split (the third-party ABI labels them staker/dev shares). The
account's full before/after delta, queue state, LP movements and fee recipients
are **not** reproduced by these equalities. Loss-path fees must not be added
mechanically to trader loss: the [official FAQ](https://docs.papertrade.xyz/intro/faq/)
describes fees drawn from LP gains under solvency conditions.

## Price and execution-state inputs still missing

The returned Exchange branch calls a price helper at `0x5331`. Its path at
`0x5838` checks mapping root 35; a nonzero retirement flag selects a frozen pair
whose midpoint is calculated at `0x58c8–0x58ef`. Otherwise it calls the oracle
address held in slot 2 (external call at `0x5883`). The returned root-35 value
is zero; the returned oracle address is `0xa9b4c7b7ca5835652d81e25739c870d49f39cc2e`,
whose code is a 925-byte proxy. These are current-response clues, not historical
retirement or oracle-implementation evidence.

The [pricing documentation](https://docs.papertrade.xyz/how/pricing-bbo/) describes
HyperCore BBO precompile `0x000000000000000000000000000000000000080e` and the integer
midpoint `(bid + ask) / 2`, with a separate frozen-price path for retired markets.
The event supplies only exit 827905. Neither bid nor ask, the actual precompile
return, nor the historical retirement state is available. A midpoint does not
uniquely determine its two inputs. We do not manufacture them or substitute a
current quote. The oracle implementation was not resolved historically.

M1 requires authenticated transaction-point code/parameters, open-position and
ledger/queue pre-state, actual execution-price context, prior-call effects,
authorization/intent identity, and independent expected accounting results. Those
inputs are still absent. An archive-backed source or actual recorded execution
trace for these same blocks would be a next evidence source; no alternate endpoint,
new window, trace RPC, production transaction or L1 replay was used here.

## Collection and publication record

The [economic plan](../../research/cases/001-economic-plan.json) was recorded locally
before this increment's reads, not publicly preregistered. It permits 60 new RPC
attempts and 20 explicit public-source accesses, counting failed calls and retries.
Actual use: **42 RPC attempts, 40 successful, one storage timeout and one handshake
network failure**. Each stopped run received one ordinary retry; no access denial
or rate limit was bypassed. Cumulative CASE-001 RPC attempts are 85, including
43 from earlier phases. The fixed interval never changed.

Source accesses: three failed web opens of official pages, six successful direct
page GETs, and one successful web read of the official RPC documentation: **10/20**.
The six official pages cover trades, FAQ, liquidation, risk, BBO and impact. Their
retrieval timestamps and SHA-256 body hashes are in the
[economic record](../../research/cases/001-economic-recovery.json). Web-reader
internal requests are not observable. Repository push/verification is administrative,
not protocol-source sampling.

Five [reviewed metadata manifests](../../evidence/public/CASE001-FOURTH.json) were
exported for the new runs; the other names are `CASE001-ECON-STATE`,
`CASE001-ECON-STATE-RETRY`, `CASE001-PRICE-CONTEXT` and
`CASE001-PRICE-CONTEXT-RETRY`. Raw source bodies, signatures, calldata, account
identifiers, code/storage results and private review declarations are not published.
Public case coordinates permit a chain lookup and are not anonymity; no identity
or personal observation is joined to this case.
