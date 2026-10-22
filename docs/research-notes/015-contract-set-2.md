# Contract set 2: official version guide and retained-code checks

Updated: 2026-10-22. Baseline: `b20c2fe`. This note adds the owner's supplied
[official protocol-changes text](https://docs.papertrade.xyz/dev/protocol-changes/)
to the earlier [upgrade observations](013-market-state-funding-and-upgrade-followup.md)
and [October 20 announcement checks](014-official-announcement-crosscheck.md).
The page reader returned “not accessible via this tool”; it exposed no HTTP status
or page content. No alternate reader, direct request or versioned-page request
was attempted. The source is **owner-supplied text attributed to the official page**,
not an independently fetched page. Its publication/update time is unknown.
Linked pages below are references supplied by that text, not newly read evidence.

[Metadata and retained byte identities](../../research/cases/012-contract-set-2.json).
No new chain request, account lookup, signature, intent, transaction, bridge quote,
stream connection or REA run was made. The new checks are local and synthetic.

## 1. What a contract set means

The official description uses **contract set** for the mainnet code between
implementation upgrades. Earlier documentation stays available through a version
picker. This is different from a frontend build ID or a webpage's last-update date.

| Version or event | What is established | What stays unknown |
|---|---|---|
| Contract set 1 | The supplied official text says live from **2026-10-07**, with Exchange implementation `0x0f3febfc94876b0c895f7acecdc8f5c863b549ee`; this matches the older implementation previously acquired. [Version 1 docs](https://docs.papertrade.xyz/v1/). | The date's exact time/timezone and a reconstructed deployment transaction. |
| October 20 announcement | Owner-supplied display: **6:30 AM · 2026-10-20**, timezone unknown. Describes the upcoming rule changes. | It is not the exact contract-set activation timestamp. |
| October 22 upgrade checks | Retained Exchange implementation `0x0a44049dbbb6b4762a6ba37aa0f7548c0b4a3723`, Tokenomics `0x7c0a72a788cff4d68cfe9586aecb98e21eb58a03`, completed Timelock sentinel and enabled new mint mode. The matching behaviors support the connection to the newly named set 2. | The supplied set-2 section does not state a start time or implementation address. Exact execution/initialization and an independently authenticated full set membership remain incomplete. |
| Official contract set 2 description | Eight behavior changes below. It supplies version names and several previously missing policy/permission details. | No fresh deployment or current parameter read is supplied by this editorial update. |

The old official mint page's **2026-10-06** date remains a document date, preceding
the now-stated October 7 launch. It must not be treated as the date the initial
contract set went live. Likewise, the two October 22 reference-header times are
observation coordinates, not the exact upgrade execution time.

## 2. Changes and the evidence behind them

| Change | Official set-2 description | What our retained evidence adds | Limit |
|---|---|---|---|
| Small winning moves | An extra holdback reduces small wins, while payout still increases with the favorable move. | Note 014 recovered the added band's constants and zero-override boundaries. | Earlier examples do not prove monotonicity for every price/instrument/rounding combination. |
| Two payout curves | A dedicated keeper chooses standard or off-hours; both curves are fixed in the contract. | The acquired library contains the two fixed parameter sets. A captured Exchange bool setter permits only the address in slot `0x59` and changes the flag in slot 8, bits 32–39. | No live keeper address, automation schedule or real switch transaction was checked here. “Off-hours” is a selected mode, not a proven calendar schedule. |
| Closing at bust | A close at or beyond bust settles as hard liquidation. | Six local branch cases confirm long `price <= bust` and short `price >= bust`, including equality, enter the hard-liquidation branch. | This is the local comparison after bust calculation, not complete oracle/signature/settlement replay. |
| Builder fee | A close using a session key naming an approved builder pays that builder **0.5% of PnL**; liquidations pay none. | Earlier Session/registry checks connect the registered fee address to an enabled builder and retained raw rate `5000000000000000`. New inspection identifies builder accrual/claim/move entries. | The exact PnL stage/sign treatment, rounding, fee addition versus carve-out and complete realized payment still need tracing. Do not infer a 2.5% total fee or substitute position notional as the base. |
| Staker fee push | Only PaperStaking calls `Exchange.pushStakerFees()`. | The same selector now checks `CALLER` against slot `0x1f`; the acquired old entry lacks that equivalent caller gate. | Passing the new gate does not establish successful fee funding, reward allocation or user withdrawal. |
| PAPER issuance | Each dollar of eligible loss mints a fixed share of supply; **no cap**. | Enabled nonzero coefficient, supply-dependent getter and controlled mint-call arguments were already checked in note 014. | “No cap” is now an explicit official statement about this issuance rule; these bounded checks do not prove unlimited arithmetic or every administrative mint/burn path. |
| Insolvency bonus | The part of a loss that refills negative LP counts up to **5×** toward minting. | Prior acquired-code checks recover the continuous-insolvency time schedule reaching 5× over 3 days, with deficit clipping. | The bonus ceiling is separate from the absence of a supply cap. A whole cross-zero loss is not simply multiplied in full. |
| Builder governance | Timelock approves builders, sets their fee and can move unclaimed fees; multisig can remove a builder immediately. | Retained registry branches have configured-authority gates. `moveBuilderFees(address,address)` is owner-guarded in the acquired Exchange. | The new owner-only test does not independently identify that owner as Timelock. Roles come from the supplied official text and earlier governance observations; no builder/account mapping or live removal was queried. |

These distinctions replace “unknown” only at the level supported by the new
source. For example, builder **rate and named base are now documented**; exact
accounting and actual receipt remain different questions. Distributor/close rules
are no longer merely an unexplained security goal, but prevention of every
gas-griefing or manipulation strategy is still not proven.

## 3. Builder fees: documented rule, accounting and payment

The session key's registration supplies the builder address. A signed address
alone is insufficient: the retained resolver also checks registry enablement.
The captured official client still defaulted to a zero fee address. We did not
register a key, enable a builder or query anyone's registration.

The source now states **0.5% of PnL**, not 0.5% of position value. The retained
raw value `5000000000000000` is consistent with `0.005 × 10^18`. That consistency
supports the documented scale; it does not settle which adjusted/signed PnL word
is used or how it interacts with the existing win fee. Liquidations' zero builder
fee is an explicit source rule; no end-to-end liquidation fee ledger was replayed.

Recovered selectors, checked locally against their signature preimages:

| Entry | Selector | Retained-code observation |
|---|---|---|
| `builderFees(address)` | `0x9d346583` | Reads mapping root `0x27`. No real builder address was queried. |
| `claimBuilderFees()` | `0x69f9a5f0` | Uses `CALLER` as the mapping key. Zeroes that liability, reduces the packed aggregate in slot `0x26`, then enters internal credit processing. |
| `moveBuilderFees(address,address)` | `0xd970fad5` | Owner guard at `0x4500`; routes to helper `0x3eba` for the source liability and destination credit path. |

Accrual at `0x32a5` updates a builder's mapping balance and the aggregate. Two
synthetic claim cases cover zero/nonzero liabilities; the nonzero case stops at
`0x3b45` **before internal credit**, after the tested liability changes. It is not
a demonstration of available cash, final account credit or external transfer.
The full internal path can involve available balance and the payout queue.

The official governance rule means builder approval and where unclaimed fees go
can change. It does not authorize this research to inspect a real builder's
balance or perform a claim/move.

## 4. Fee-push permission and the keeper

`pushStakerFees()` hashes to selector `0x7b9f5264` in both acquired implementations:

| Acquired version | Entry and local behavior |
|---|---|
| Older Exchange | Dispatch `0x2345` to helper `0x4372`; both synthetic callers reach `0x438a` with the fixture's configured staking address. No equivalent caller check at this entry. Downstream conditions remain. |
| Newer Exchange | Dispatch `0x2404` to helper `0x3c27`; compares caller to slot `0x1f`. The matching synthetic caller reaches `0x3c41`; another reaches denial at `0x3d52`. |

The official source identifies this configured role as PaperStaking. The tests
use invented role addresses and do not reread its real slot value. Therefore old
“permissionless maintenance” summaries must not be applied to this set-2 call.
This restriction is about requesting the fee push, not who earns already assigned
rewards or whether a final withdrawal succeeds.

The bool setter at selector `0xe6ac4a74` checks slot `0x59` at `0x1027–0x1038`.
Its complete synthetic dispatch preserves the low slot-8 bits and updates the
mode flag at bits 32–39 for both values; unrelated callers revert. This supports
selection between the acquired fixed curves, not permission to supply an arbitrary
new curve or proof that a timer automatically tracks real-world market hours.

## 5. Hard liquidation at the boundary

The tested local close comparison starts at `0x594d`. Under the identified stack
layout, both price and bust words are masked to their low 64 bits. Long positions take the hard branch when the execution reference price
is at/below the computed bust price; shorts do so at/above it. The branch reaches
`0x5975`; the other path reaches `0x5970`. The six fixtures use price 99/100/101
around bust 100 for both directions. Equality is explicitly included.

The later hard branch prepares liquidation-style processing. The supplied official
text resolves its intended user-visible meaning: requesting a normal close at
that point still settles as hard liquidation. This can matter while a close waits
in the relayer queue. The fixtures supply the already-computed bust price, so they
do not independently revalidate the oracle, buffer or all settlement effects.
No live close or production gas-griefing test was performed.

## 6. Issuance, old docs and remaining work

The README now says plainly that set 2 has **no fixed supply cap in this loss-based
mint rule**. The 5× insolvency bonus is a limit on the bonus, not on total supply.
The approximately 0.1%-per-$1M teaching example remains a rounded explanation from
the October 20 announcement, not the exact current coefficient or a fixed daily
release. The observed supply/rate and exact raw coefficient remain dated to the
retained October 22 reads; no fresh value was collected here.

Use the official [version-1 mint description](https://docs.papertrade.xyz/v1/how/mint-curve/#shape)
for the old flat/ratchet rule and the [current mint description](https://docs.papertrade.xyz/how/mint-curve/#shape)
for the supplied set-2 rule. These linked contents were not separately retrieved.
The old helper and old receipts keep their historical scope; no old case or source
ledger was rewritten to make it look current.

Actual checks: **16 narrow synthetic cases**, with additional caller-denial
assertions, passed against retained bytecode using the existing private interpreter.
The interpreter mocks external calls and stops on DELEGATECALL; these cases are
local gates, a close predicate and accounting before credit. They are not an
independent EVM, signature verification, actual mint/claim/close or complete replay.
Independent review and publication checks are recorded separately.

Still open: exact set-2 execution/initialization, full fee arithmetic and builder
receipt, a complete hard-liquidation ledger, keeper schedule/live authority values,
server admission/account access, final bridge payment/refund and Across migration.
