# README figure inputs and calculations

The bilingual PAPER images now compare old and new issuance in place. They
separate an old-mode LP cross-section, an old-mode progress curve and a deliberately
simplified new-supply example. They are original explanatory figures, not a source
mirror, live parameter feed or historical transaction replay. The liquidation
cards remain separate and unchanged.

## Issuance old vs new

The [README module](../README.md#paper-mint-curve) connects token issuance, total
supply and dilution. Both languages use the same numerical inputs and the same
figure paths as before; the old standalone image has been replaced.

### Dates and source reconciliation

| Source or observation | Date/time and what it establishes |
|---|---|
| Retained [official mint page](https://docs.papertrade.xyz/how/mint-curve/) | Page marks last update 2026-10-06. Acquired 2026-10-21 at 07:18:06 UTC; it still describes the flat/ratchet mode. SHA-256 `f263fecf03ae73a3e6922c0c944b14c8c9930d2646acec053ffd9cd0cd3ec66c`, 14717 bytes; indexed in [CASE-002–005](../research/cases/002-005-current-evidence.json). This is the old page's date, not a verified contract activation date. |
| [Official announcement](https://x.com/papertrade_xyz/status/2112310325521399982) | Owner-supplied full text and display: 6:30 AM · 2026-10-20; timezone unknown. Announces supply-relative issuance and time-based insolvency incentives. |
| First installed-target observation | 2026-10-22; reference header 49175395 is timestamped 07:38:34 Asia/Singapore. [Note 013](research-notes/013-market-state-funding-and-upgrade-followup.md#1-the-scheduled-implementations-are-now-installed) confirms matching implementation slots and the completed Timelock sentinel. This is not the exact execution time. |
| New-mode/global-parameter observation | 2026-10-22; reference header 49179954 is timestamped 08:53:18 Asia/Singapore. [Note 014](research-notes/014-official-announcement-crosscheck.md) establishes the enabled nonzero issuance coefficient and records the acquired supply, rate and code. |

The old webpage and the later announcement describe different mechanism versions.
Documentation refreshes remain stopped after HTTP 403; X also returned 403. We reused
the retained page and owner-supplied announcement without alternate retrieval.
Code/storage are latest-only acquisition-time observations from one provider,
not atomic state authenticated at either header timestamp. Exact deployment,
execution and initialization chronology remains incomplete.

## Mint-rate illustration

### Old model: the threshold step and the decaying tail are different views

The old rule takes current tracked LP L and retained tail progress H separately:

| Symbol | Old meaning | Acquired/documented parameter |
|---|---|---:|
| L | Current tracked LP | Selects flat or tail branch |
| T | Flat-region threshold | $2M |
| R | Flat rate | 100 PAPER per $1 eligible basis |
| D | Tail decay scale | $120M |
| H | Retained cumulative tail progress | Does not reset when LP is distributed |
| C | Surplus reward cap | $5M; not a mint breakpoint |

```text
L < T:  rate = 100 PAPER/$
L >= T: rate = 100 × [120 / (120 + H)]²   # H in $M
```

100 PAPER/$ was the early/low-LP flat branch, not the whole pre-upgrade model.
With H already advanced, crossing back above T can create a sharp drop. The
figure's **upper-left panel holds H=$120M fixed**: L just below $2M gives 100,
while L at/above $2M gives 25. At H=0, the threshold rate would still be 100;
a first crossing does not inherently impose a universal 25 or 20 rate.

The **lower-left panel changes H while staying in the tail**:

| Chosen H | Marginal PAPER/$ |
|---|---:|
| $120M | 25 |
| Approximately $148.328M | 20 |
| $260.5M | Approximately 9.9461 |

These two panels have different horizontal axes and are not joined into a
historical time series. The 25/20 examples are curve points, not administered
fixed tiers or evidence of their exact historical transition times. Earlier
acquisition-time H near $260M and the roughly 10 PAPER/$ amounts in retained
receipts also make clear that the old model had already left its early flat
rate. Historical transaction prestate remains missing. See
[old acquired integration](research-notes/006-current-mechanisms.md#recovered-integer-integration)
and [loss-basis receipts](research-notes/011-loss-governance-staking-and-payments.md#1-why-equal-losses-can-produce-different-paper-amounts).

### New model: issuance increases total supply and dilutes unchanged holdings

The official scale description is roughly 0.1% of then-current supply per $1M
eligible loss. This replaces a fixed token-count interpretation: the same loss
can mint more tokens as supply grows. Issuance in this mechanism is loss-driven,
not a fixed daily release. The announcement does not specify a terminal supply
schedule; this is not proof about every administrative mint/burn capability.

The figure uses a **teaching recurrence**, deliberately separate from contract math:

```text
S(0) = 10,000,000,000 PAPER
one step = $1,000,000 eligible loss
M(n) = 0.001 × S(n)
S(n+1) = S(n) + M(n)
```

| Step | New PAPER in this step | Total PAPER after step |
|---|---:|---:|
| Start | — |10,000,000,000 |
| First $1M loss step |10,000,000 |10,010,000,000 |
| Second $1M loss step |10,010,000 |10,020,010,000 |
| 100 identical steps | About 1.05116 bn cumulatively | About 11.05116 bn |

After the 100 steps, total supply is up approximately 10.51%. A holder keeping
100M PAPER goes from 1% of supply to approximately 0.905%. This is supply dilution,
not an automatic USDC entitlement calculation. Staking participation, shares and
allocation timing still determine distributions from the funds actually available.
More issued PAPER does not create more USDC backing.

This fixed 0.1%-per-step recurrence is **not** the deployed interval-mint formula,
its exact coefficient or staged integer rounding. At the October 22 acquisition,
supply was about 8.902947 bn and the base marginal rate about 9.802160 PAPER/$;
these are related snapshot quantities, not live values. With coefficient q and
18-decimal raw quantities, the acquired getter computes:

```text
baseRateRaw = floor(q × supplyRaw / 10^36)
```

Actual whole-interval issuance must be computed by the corresponding new routine.
The old [`mintCurveSegment`](../packages/research/mechanics.ts) remains a historical
helper, not a current-mode calculator. The new mode's continuous-insolvency timer
adds a 1×–5× multiplier over three days to the eligible deficit-repair portion.
It does not reward holding duration or multiply a whole cross-zero trade blindly.
See [the exact acquired parameters and controlled-path checks](research-notes/014-official-announcement-crosscheck.md#2-supply-relative-issuance-and-insolvency-timing).

### Eligible loss and the displayed ratio

The mint basis need not equal the user's gross loss: an empty-queue cash losing
close uses loss less the LP-side fee; liquidation uses full lost margin. The
retained liquidation receipt reports basis 20, tracked-LP increase 19.6 and about
199.285 PAPER. That historical amount is neither a universal current mint ratio
nor a reason to liquidate instead of closing. [Branch and receipt detail](research-notes/011-loss-governance-staking-and-payments.md#1-why-equal-losses-can-produce-different-paper-amounts).

The acquired frontend ratio formatter divides minted PAPER by eligible basis,
which is an average for that record; it does not establish the current marginal
rate. Its page consumer/runtime use remains unconfirmed. [Formatter evidence](research-notes/010-rea-frontend-and-contract-crosscheck.md#captured-paper-ratio-formatter).

## Parameter authority

The previously acquired PaperTokenomics implementation
`0x600d1b9653fd47fc1543d1cc87f33ba2d2fdf48f` contains selector `0x12baae3b`, matching
`setMintParams(uint256,uint256,uint256,uint256)`. Its dispatch at `0x0597` reads the
packed owner and compares it with `CALLER` (`0x05ab–0x05ce`). The guarded path writes
slots 5, 6, 7 and 8 at `0x0609–0x0615`, corresponding to threshold, reward cap, flat
rate and decay scale, and emits the parameter values. The cumulative H slot is not
written by this setter.

An offline synthetic dispatch check with two different callers confirmed the
owner-valued caller can write those four supplied values while the other caller
reverts. This is acquired-code support, not a live owner/timelock lookup or an
actual configuration transaction. Contract ownership is a role; no identification
of its holder with a particular person or team is made here. These are old-mode parameters under an owner guard, not immutable constants
or the new mode's complete configuration interface.

## Profit retention examples

**Old baseline only:** these BTC/ETH examples omit the October 20 on/off-hours
profit band. They are not a complete current in-band settlement estimate; see
[the added band and version boundaries](research-notes/014-official-announcement-crosscheck.md#3-the-new-profit-adjustment-is-a-price-move-band).

Primary description: [official asymmetric impact](https://docs.papertrade.xyz/how/asymmetric-impact/).
[Note 004](research-notes/004-economic-path-and-state-audit.md) distinguishes returned
code arithmetic from authenticated historical execution inputs.

The examples use the official documented parameter set:

| Parameter | BTC | ETH |
|---|---:|---:|
| baseRate | 10% | 10% |
| rateMultiplier | 15000 | 15000 |
| referenceNotional | 100000 | 100000 |
| positionMultiplier | 814.598 | 483.979 |
| Win fee | 2% of adjusted gain | 2% of adjusted gain |

For a favorable **underlying-price fraction** d, using a continuous approximation:

```text
e = max(d − 1/50000, 0)
scale = 0.9 / (1 + 1/(e × 15000) + 100000/(10^6 × e × positionMultiplier))
net fraction of raw market gain = (e/d) × scale × 0.98
```

At/below the deadband, the retained amount is zero and the division expression is
not evaluated. All nonzero examples include the deadband and win fee. They are
rounded to one decimal percentage point, not exact integer transaction outputs.

| Favorable price move | BTC retained | ETH retained |
|---|---:|---:|
| 0.01% | 21.0% | 16.0% |
| 0.1% | 72.4% | 67.6% |
| 1% | 86.4% | 85.7% |

With baseRate 10%, the nonlinear haircut alone tends toward 10% for very large
moves and toward 100% as the effective move approaches zero. Including the later
win fee, the net retention asymptote is `0.9 × 0.98 = 88.2%`. It is not a fixed
11.8% deduction. Market-specific parameters can change; these numbers do not
establish current or historical execution parameters for an individual trade.

## Liquidation formula illustration

The bilingual formula cards reproduce the arithmetic described in
[note 006](research-notes/006-current-mechanisms.md#liquidation-exact-buffer-basis-and-inclusive-threshold)
and implemented by [`bustPrice`](../packages/research/mechanics.ts).

E is entry price in contract integer units, ℓ is integer leverage, W is 10¹⁸,
and b is the W-scaled buffer. First compute d = floor(E / ℓ). For a long,
z = E − d and the trigger is z + floor(z × b / W); for a short, z = E + d
and the trigger is z − floor(z × b / W). The buffer is based on z, not E.
The execution reference price triggers at or below the long threshold, or at
or above the short threshold, including equality.

The approximately five-basis-point buffer is a documented description, not a
current parameter lookup. At the illustrative exact ratio 0.0005, entry 100 and
100× leverage give continuous reference/trigger pairs 99 / 99.0495 for a long
and 101 / 100.9495 for a short. The contract stages integer rounding; the cards
retain both floor operations. Liquidation consumes full isolated margin.

## Reproduce the figures

Use Python with matplotlib; this revision reused the retained Python 3.12 runtime,
matplotlib 3.11.2 and an installed CJK font. No package or project dependency was
installed or updated. Supply the font path available on your machine.

```sh
python scripts/render-readme-figures.py --check-only
python scripts/render-readme-figures.py --mint-only --output-dir docs/assets --cjk-font /path/to/cjk-font.ttf
# Without --mint-only, the script also renders the existing liquidation cards.
```

The offline checks cover the old fixed-H threshold boundary and tail anchors,
the first two new illustrative issuance steps, 100-step total supply and 0.905%
retained share, plus the existing deadband/profit examples. These are figure-input
checks, not tests of the new contract mint formula. SVG text is outlined for
portable font rendering; bilingual PNGs are used for visual inspection and kept
local. Only the two replacement mint SVGs are published for this revision;
liquidation assets remain byte-for-byte unchanged.

## Source scope

The comparison reuses the October 21 official-page capture, earlier old-mode
bytecode findings and October 22 implementation/global-parameter observations.
[Note 014](research-notes/014-official-announcement-crosscheck.md) and its
[metadata](../research/cases/011-official-announcement.json) preserve code hashes,
request times and the provider limitation; the snapshot is not refreshed by
rendering. This visual revision makes no new protocol request, signature, intent,
account query, transaction or installation. Official-doc and X access denials
remain respected.

The web-only/no-standalone-mobile-app description reflects the owner's current
product observation; it does not mean mobile browsers cannot load the website.
The README's order-book-depth wording concerns the execution-price formula. It does
not remove price movement during relayer waiting or the separate PnL-side haircut.
