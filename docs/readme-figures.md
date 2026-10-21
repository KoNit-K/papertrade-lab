# README figure inputs and calculations

The README figures explain the documented formulas. They use fixed example inputs,
not a live parameter feed or historical transaction replay. A reference image informs the layout only; its apparent current-LP point is not
the source of the plotted values.

## Mint-rate illustration

Primary description: [official mint curve](https://docs.papertrade.xyz/how/mint-curve/).
The acquired code and interval arithmetic are described in
[note 006](research-notes/006-current-mechanisms.md#recovered-integer-integration).

| Symbol | Meaning | Example |
|---|---|---:|
| L | Current tracked LP | Determines whether the flat region applies |
| T | Flat-region LP threshold | $2M |
| R | Flat marginal mint rate | 100 PAPER / $1 of eligible loss basis |
| S | Tail decay scale | $120M |
| H | Cumulative tail progress, retained when LP is distributed | Nonnegative; not inferred from current LP |
| C | Tracked-LP surplus reward cap | $5M; not a mint-rate breakpoint |

For `L < T`, the marginal rate is R, including when L is negative. Otherwise:

```text
r(H) = R × (S / (S + H))²
```

The left panel varies H. At H = $0 / $120M / $260.5M, the rates are respectively
100 / 25 / approximately 9.9461 PAPER per dollar of eligible basis.
The right panel is a **state cross-section holding H = $260.5M fixed** while varying
current LP. It returns to the flat branch below T and steps down to approximately
9.9 at/above T. It is not a time trajectory, a reconstruction of the reference
image's live state, or the claim that H rises when LP falls. The right tail is
horizontal because H is deliberately held fixed. The $5M marker identifies surplus
reward routing rather than a change in the mint formula.

A whole mint integrates over an interval and stages integer rounding. Its average
rate can differ from the plotted marginal rate; the existing
[`mintCurveSegment`](../packages/research/mechanics.ts) takes all inputs explicitly.

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
of its holder with a particular person or team is made here. The README therefore
says **owner-adjustable**, rather than presenting the plotted constants as immutable.

## Profit retention examples

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

Use Python with matplotlib (the published figures were rendered with 3.11.2).
Rendering adds no project dependency and does not change the lockfile.

```sh
python scripts/render-readme-figures.py --check-only
python scripts/render-readme-figures.py --output-dir docs/assets
# For the Chinese figure, supply an installed CJK font file:
python scripts/render-readme-figures.py --output-dir docs/assets --cjk-font /path/to/cjk-font.ttf
```

The script performs no network access. It checks documented rate anchors, monotonic
tail decay, the deadband, all six displayed gain-retention values and the limiting
retention bound before plotting. SVG text is outlined for portable font rendering.
The same command also renders the long/short liquidation formula cards with
mathematical typesetting. README alt text and this page provide the textual interpretation. PNG copies are
also produced for local visual inspection; only the SVGs are published.

## Source scope

The source basis is the retained official documentation and acquisition-time runtime
from the 2026-10-21 investigations, linked above and indexed in [sources](sources.md).
An attempted documentation refresh during this editorial change returned HTTP 403;
reads to that host stopped. There is no successful live parameter refresh in this
increment. No signature, intent, account query, configuration write or deployment
was performed.

The web-only/no-standalone-mobile-app description reflects the owner's current
product observation; it does not mean mobile browsers cannot load the website.
The README's order-book-depth wording concerns the execution-price formula. It does
not remove price movement during relayer waiting or the separate PnL-side haircut.
