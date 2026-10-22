# October 20 announcement: issuance, transfers, fees and builder access

Observed: 2026-10-22. Baseline: `75438b3`. This note cross-checks the owner's
supplied full text of the [official announcement](https://x.com/papertrade_xyz/status/2112310325521399982),
displayed as **6:30 AM · Oct 20, 2026**. The display timezone is unknown. Direct X
access returned HTTP403; no alternate access route was used. The announcement's
attribution, text and displayed timestamp are user-supplied, not an independently
retrieved X page. Only a limited summary is published.

This supersedes current-rule use of the earlier flat/tail mint illustration and
adds the new profit band to the earlier cost description. It does not change old
receipts, candidate order, arithmetic helpers or historical results. [Metadata](../../research/cases/011-official-announcement.json)
records sources, exact byte identities, current global values and boundaries.

| Announcement point | Result of this cross-check |
|---|---|
| No plans then for off-contract PAPER transferability | Acquired PAPER code restricts transfers through the configured staking route. Future policy and absence of external derivatives cannot be proven by this gate. |
| Issuance relative to supply; time-based insolvency incentive | New Tokenomics mode is enabled; supply-dependent rate and a three-day 1×–5× multiplier have bytecode and controlled-path support. |
| New adjustments only within on/off-hours 6/10bps | Constants, frontend curves and economic-library branches agree. Boundary checks return no added override at/outside the configured band. |
| About 15× greater effect on bot profitability | Team's retrospective empirical claim; no dataset, classification or independent reproduction here. Not a 15× fee. |
| More generous open-interest limits may follow | Announced intent, not an observed limit change. |
| New minting removes the straddle mint attack | Design claim; these checks do not establish an exhaustive attack analysis or proof of elimination. |
| Initially whitelisted builders | Official policy description; recovered registry/enablement paths are compatible with controlled admission. Exact admission criteria, fee base and payment remain unresolved. |
| Distributor permission and below-bust close changes prevent gas griefing | Announced changes and security goal. Exact before/after permissions, close outcomes and attack-cost proof were not reconstructed here. |
| Queued upgrades go live after 24 hours | Historical future tense. Installed targets and the completed Timelock sentinel were already confirmed in [note 013](013-market-state-funding-and-upgrade-followup.md#1-the-scheduled-implementations-are-now-installed); execution transaction and initialization remain missing. |

## 1. Transfer restrictions and the external-short argument

The PAPER proxy is `0xe40f17915daa230324030003a197cdaef2261c0e`, acquired
implementation `0x433bd418ec92818a960585f4d5fae563e735bb4a`. Its slot 9 names
PaperStaking, `0xaad6c7b0cc3014fc80ffedae0ed7ce5967b0f016`, as the transfer route.
The shared gate at `0x0c5b–0x0d31` requires **both**:

- a nonzero route and `CALLER == route`;
- `from == route` or `to == route`.

Ordinary wallet-to-wallet `transfer` fails. An ordinary wallet's direct `transfer`
to the staking address also fails: the caller condition still applies. A synthetic
route-originated transfer succeeds, and a route caller's `transferFrom` between
two ordinary addresses fails even when the separate allowance check is bypassed
by a configured privileged-spender fixture. These are controlled code-path tests,
not calls involving real holders. Staking's own transfer workflow is a separate
operation. Administrative configuration and proxy upgrades mean the restriction
is not a proof of permanent immutability.

The team's economic argument is conditional: a PAPER derivative short that gains
when LP solvency deteriorates could increase the payoff from manipulating the
BBO-based settlement reference. A useful decomposition is:

```text
attack payoff = proceeds extracted from the bankroll
              + realized external-short PnL
              - manipulation cost - execution/hedging frictions
```

External short **notional** is not realized profit. Liquidity, collateral,
liquidation, basis, oracle design and market access all matter. A restriction on
spot-token transfers does not itself rule out a separately cash-settled derivative.
The announcement's illustrative attack numbers are not a demonstrated attack or
an independent estimate of present manipulation cost. Hyperliquid reference-price
quality remains a dependency; these tests do not quantify its robustness.

PAPER's loss rebate/counter-insolvency purpose describes an incentive. It does not
make minted tokens cash backing, guarantee distributions or reimburse a loss.

## 2. Supply-relative issuance and insolvency timing

New Tokenomics implementation: `0x7c0a72a788cff4d68cfe9586aecb98e21eb58a03`.
The low 128 bits of slot 9 contain a nonzero normalized issuance coefficient `q`,
so the new branch is enabled. Legacy parameters and a fallback library still exist;
their presence alone does not make the old curve active.

The acquired marginal-rate getter `0xeedf4c43` reads PAPER `totalSupply()` and
computes, in internal 18-decimal accounting units:

```text
baseRateRaw = floor(q × supplyRaw / 10^36)
```

Acquisition-time global values were:

| Value | Integer raw units |
|---|---:|
| q, slot 9 low 128 bits | 1101001766258568981998368146 |
| PAPER total supply, token slot 6 | 8902946992095273801392426640 |
| Base marginal PAPER per $1 of eligible basis | 9802160363203310436, or about 9.802160 PAPER/$ |
| Insolvency start, slot 9 bits 128–191 | 0 |
| Tracked LP, slot 3 | 3513193471545262177456824 |
| Surplus cap, slot 6 | 5000000000000000000000000 |

The announcement's roughly **0.1% of supply per $1M** is a scale description,
not an exact fixed rate for every trade. The acquired mint routine integrates
issuance over the eligible interval using current supply and integer arithmetic;
a marginal rate multiplied by an entire large loss is not the exact mint output.
With a synthetic `q=10^27`, supply `10^28` and $1M eligible basis, its emitted
mint-call argument is `10005001667073399994998332` raw PAPER, approximately
**0.1000500%** of that synthetic starting supply. This is not an actual $1M trade.
Doubling the supplied starting supply doubles the checked small-basis result.

The time getter `0x4ec7182e` calls helper `0x1354`. Let W = 10^18 and let `t0`
be the stored nonzero insolvency start. The recovered time schedule is:

```text
elapsed = clamp(now - t0, 0, 259200 seconds)
x       = floor(elapsed × W / 259200)
bonus   = floor(4 × x × (2W - x) / W)
multiplierRaw = W + bonus
```

A zero `t0` returns 1×. Synthetic checks give approximately 3.222222× at one day,
4.555556× at two days and 5× from three days onward. The new mint branch clips
the additional insolvency-eligible part against the outstanding negative LP before
applying the elapsed bonus; a trade that crosses back above zero is not simply
multiplied in full. This time multiplier concerns issuance, not staking reward
weight or holding duration. The observed `t0=0` and positive tracked LP do not
show an active insolvency bonus at acquisition.

For an unchanged holder with h tokens, new issuance M changes supply share from
`h / S` to `h / (S + M)`. The team explicitly describes dilution in favor of more
recent users. Actual dividend entitlement still depends on staking shares and
allocation timing; a supply share is not automatically a USDC entitlement.
Changing the incentive can affect an attack's economics, but does not establish
that every straddle/hedging strategy is unprofitable.

Earlier flat/tail formulas, numerical figures and receipts remain dated material
in [note 006](006-current-mechanisms.md) and the [figure inputs](../readme-figures.md).
They must not be used as a current-mode calculator.

## 3. The new profit adjustment is a price-move band

The installed Exchange target remains `0x0a44049dbbb6b4762a6ba37aa0f7548c0b4a3723`.
It delegates the checked economic path to
`0x583d0bd818c991c5830fea93aef04e474b272459`. Its helper at `0x15a2–0x1671`
contains the same band and shape constants as the retained frontend:

| Mode | startPpm | endPpm | holdbackWad | Shape |
|---|---:|---:|---:|---|
| On-hours | 75 | 600 | 3597000000000000000 | Symmetric fall |
| Off-hours | 30 | 1000 | 6085000000000000000 | Additional cubic fall factor |

600 ppm = **6bps = 0.06%**, and 1000 ppm = **10bps = 0.1%** of the underlying
price. The lower edges are 0.75bps and 0.3bps. The added effect is zero at and
outside either edge, rather than a fixed deduction for every profitable close.
The selected global off-hours flag was `1`; the flag's real-world hours/calendar,
updater policy and historical changes were not reconstructed.

The frontend's chart expression, in its basis-point coordinate `d`, is:

```text
u = (d - start) / (end - start)
extraHoldback(d) = k × (end - start) × [u × (1-u)]²
# Off-hours additionally multiplies by (1-u).
# Zero when u <= 0 or u >= 1.
```

This is a continuous display expression, not an integer settlement calculator.
For a synthetic entry price 100000000 and a favorable 300ppm move, the library's
new-override path returns effective move fractions `166741690962099` on-hours
and `108131892881859` off-hours (W-scaled), after the deadband and additional
holdback. Boundary and just-outside cases return the **zero override sentinel**:
they take the existing formula, rather than setting total profit to zero.

Existing asymmetric impact and the 2% win fee remain separate downstream terms.
“Outside the band unchanged” describes the added adjustment relative to that
baseline; it does not mean no deadband, no impact or no fee. The earlier
[BTC/ETH retention examples](../readme-figures.md#profit-retention-examples) omit
the added band and cannot be used unchanged for an in-band current trade.
No real close was replayed, and no bots-versus-humans dataset was evaluated.
The team may revise fees and limits; neither an OI relaxation nor a 15× empirical
result is independently established by these constants.

## 4. Builders, distribution permissions and below-bust closes

The announcement says builder codes will initially be whitelisted. This narrows
the earlier policy unknown: unrestricted self-service registration should not be
assumed. The new SessionKeyManager's protocol fee-registry dependency and the
Exchange's builder registration/enablement and configured-caller checks in
[note 013](013-market-state-funding-and-upgrade-followup.md#7-new-session-and-builder-paths-narrow-two-earlier-unknowns)
are compatible with controlled admission. They do not identify whitelist criteria,
prove a particular builder is enabled, or establish fee base, payer, rounding,
recipient split and actual payout. No builder or personal account was queried.

The team also announces a reward-distributor permission change and modified
below-bust close processing as gas-griefing defenses. These are retained as
announced implementation/security claims. This increment did not reconstruct
the full old/new authorization matrix, the exact below-bust close call path or a
measured gas-griefing strategy. An unchanged staking implementation address does
not prove unchanged permissions: configuration or a different caller can change.
No absolute attack-prevention claim follows from an installed target address.

## 5. Version and verification limits

Current header reference: chain **999**, block **49179954** (`0x2ee6d32`), hash
`0xffe3d8135f4197a84148679252df87b7ad2d9d75fb9eabe6acf10a9930a22e06`.
Its header was read twice identically. Subsequent requests explicitly name that
block; the provider's code/storage are nevertheless treated as **latest-only
acquisition-time observations, not an atomic or authenticated historical snapshot**.
The installed Exchange and Tokenomics targets match note 013; PAPER and staking
targets were also checked. The frontend entry still identifies build `2b8e2c45a33e`;
the app and deployment inputs were reused after entry/target consistency checks.
No exact upgrade execution transaction, complete initialization or continuous
unchanged interval was established.

Two small offline interface inspections reused existing **REA 6.7.0** and its
retained image, on Tokenomics and the economic library only. No installation,
upgrade or whole-app retry was performed. Private interpreter extensions added
MULMOD and a controlled timestamp; two focused extension tests and **31 synthetic
checks** passed. Those checks use acquired code, mocked external supply/mint calls
and an interpreter that stops on DELEGATECALL. They are not an independent EVM,
signature validation, actual PAPER mint or full settlement reproduction.
Independent read-only review also checked fee boundaries and the transferFrom
endpoint condition. Only reviewed metadata and original explanations are public.

Collection: **25 RPC attempts, 23 successful; two direct HTTP reads, both successful**.
Two transport failures were counted before ordinary bounded retries. All 25
successful captures passed byte-length/SHA-256 checks. Two discovery searches and
one failed X page open are separate from direct reads; documentation reads remained
stopped after the prior 403. There was no account query, signing, intent, bridge
quote, production transaction, new event scan or live market-feed connection.
The funding/admission/Across gaps in note 013 remain open; this announcement does
not supply missing bridge completion or server-authorization evidence.
