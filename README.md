<h1 align="center">papertrade-research</h1>

<p align="center">
  <strong>A plain guide to Papertrade trading, fees and PAPER rewards.</strong>
</p>

![papertrade-research: trading, fees and PAPER explained](docs/assets/readme-banner.svg)

<p align="center">
  <a href="docs/mechanism-map.md"><img alt="Network: HyperEVM 999" src="https://img.shields.io/badge/HyperEVM-999-b7f58b?style=flat-square&amp;labelColor=17251d" /></a>
  <a href="STATUS.md"><img alt="Status: research preview" src="https://img.shields.io/badge/status-research_preview-d8e5db?style=flat-square&amp;labelColor=17251d" /></a>
  <a href="LICENSE"><img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-d8e5db?style=flat-square&amp;labelColor=17251d" /></a>
</p>

<p align="center">
  <a href="README.zh-CN.md">中文</a> ｜ <strong>English</strong>
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#paper-mint-curve">Mint curve</a> ·
  <a href="#trading-costs">Fees</a> ·
  <a href="#paper-the-dividend-token">PAPER</a> ·
  <a href="#independent-clients-and-api-access">API access</a> ·
  <a href="#explore-the-research">Explore the research</a> ·
  <a href="docs/sources.md">Sources</a>
</p>

[Papertrade](https://docs.papertrade.xyz/) lets you trade perpetual futures on HyperEVM. The protocol's trading pool (LP) takes the other side of each trade. Losses can earn PAPER, and staking PAPER lets you share in USDC rewards.

🔎 We use official docs, public code and [REA](https://github.com/morluto/rea) to explain how it works and check what the evidence supports. [Progress](STATUS.md) · [Sources](docs/sources.md)

**Versions:** the docs call the first release **Contract set 1**, live from **2026-10-07**, and the newer rules **Contract set 2**. This page covers set 2. Old docs remain available in the official version picker. [Official changes](https://docs.papertrade.xyz/dev/protocol-changes/) · [Our checks](docs/research-notes/015-contract-set-2.md)

## Features

| Feature | How it works |
|---|---|
| 🤝 **Trade against the pool** | You trade against Papertrade's LP. Your gains come from the pool; cash losses add to it. |
| 📊 **Hyperliquid prices** | Trade prices use the midpoint between HyperCore's best buy and sell prices. Balances are recorded on HyperEVM. |
| ⚡ **Up to 1000× leverage** | Each position has its own margin. You choose margin and leverage when opening; they stay fixed. Each position closes in full, and long and short positions stay separate. |
| 💸 **0 opening fee · 0 funding payments** | Winning trades have profit deductions and a fee. The order service pays gas for trades it sends. |
| ⏳ **Orders can wait** | The order service, called the relayer, groups requests and sends them on chain. Both opening and closing can take time. |
| 🪙 **Losses can earn PAPER** | The mint rules decide how much of a loss earns PAPER. Stake those tokens to share in USDC rewards. |

> 🖥️ <strong>You need to watch your positions:</strong> the web app we reviewed uses market orders, with no limit orders, automatic take-profit/stop-loss or separate mobile app.
> At high leverage, a small move against you can wipe out a position. A close request can still be waiting when liquidation happens.

🧩 <strong>Why look at PAPER?</strong> A losing close or liquidation can create PAPER, which can then be staked for rewards. To understand that trade-off, look at the trading loss, the new tokens and the money available for rewards together.

[How trading works](docs/mechanism-map.md)

## PAPER mint curve

**Before, the old curve gave fewer PAPER per $1 as it progressed. Now, new tokens are based on the total PAPER already issued.** As that total grows, the same loss can earn more tokens, while existing holders own a smaller share.

![Old and new PAPER rules: a sharp drop and falling rewards per $1 under the old curve; more tokens, a growing total and a smaller share for unchanged holdings under the new rules](docs/assets/paper-mint-curve.en.svg)

| Question | Before | Now |
|---|---|---|
| **How much PAPER does a loss earn?** | 100 PAPER/$ applied in the old low-LP branch. The later curve could already be at 25 → 20 → about 10. Crossing the LP threshold again could cause a sharp drop; 25/20 are examples, not fixed levels. | Roughly $1M of losses counted by the mint rules adds 0.1% of the PAPER already issued. A bigger total means more new tokens for the same loss. The exact rate depends on the settings. |
| **How does the total grow?** | In the falling part of the old curve, equal losses added fewer new tokens over time. | Losses keep adding tokens based on the total at that point. There is no fixed daily release, and the docs state **no supply cap**. If you keep the same number of tokens, your share of the total falls. |
| **What if the LP owes more than it has?** | The old low-LP rate applied. | The longer the shortfall lasts, the bigger the bonus: 1× to 5× over 3 days. It only boosts the part of a loss that qualifies and helps fill the shortfall. |

💡 **A simple example:** start with 10B PAPER. If each $1M loss step adds 0.1% of the previous total, it grows **10B → 10.01B → 10.02001B**. This shows the idea; the contract uses a more detailed calculation. Creating PAPER does not add the same value in USDC.

📍 **What we found on 2026-10-22:** about **8.903B PAPER** had been issued. The base rate for a small loss was about **9.802 PAPER per $1** before any shortfall bonus. These are values from that check, not live numbers. USDC rewards also depend on how much money is available, who has staked and when it is shared out.

🗓️ **When it changed:** set 1 went live on **2026-10-07**. The new rules were announced at **6:30 AM on 2026-10-20** (timezone unknown). They were active when we checked on **October 22**; we have not found the exact upgrade time.

[Old mint rules](https://docs.papertrade.xyz/v1/how/mint-curve/#shape) · [New mint rules](https://docs.papertrade.xyz/how/mint-curve/#shape) · [Examples and formulas](docs/readme-figures.md#issuance-old-vs-new) · [Versions and evidence](docs/research-notes/015-contract-set-2.md#6-issuance-old-docs-and-remaining-work)

## Trading costs

| When | What you pay |
|---|---|
| **Open a position** | 0 opening fee |
| **Keep it open** | 0 funding payments |
| **The relayer sends your trade** | The relayer pays gas |
| **Close with a profit** | Several deductions reduce the gain, then a fee takes **2% of the remaining profit** |
| **Close with a loss** | Your loss, with no extra trading fee added |

💡 The first **0.002%** of a favorable price move does not count toward profit. This is called the **deadband**. The new rules add another cut for small gains, within **6bps (0.06%) in on-hours mode** or **10bps (0.1%) in off-hours mode**. This extra cut is zero at the ends of its set range and outside it. The cut also depends on where the move sits inside that range.

The docs say the payout still grows as the price moves further in your favor. A dedicated keeper account selects the standard or off-hours mode. Both formulas are built into the contract.

Those numbers describe price moves, not fee rates. Larger moves still face the existing profit adjustment, called asymmetric impact, and the final 2% fee.

[Fee examples and formulas](docs/readme-figures.md#profit-retention-examples) · [How the new cut works](docs/research-notes/014-official-announcement-crosscheck.md#3-the-new-profit-adjustment-is-a-price-move-band)

**Builder fees:** if your session key names an approved builder, the docs say a close pays it **0.5% of PnL (profit/loss)**. Liquidations pay none. The base is PnL, not position value; [our fee notes](docs/research-notes/015-contract-set-2.md#3-builder-fees-documented-rule-accounting-and-payment) explain what still needs checking about the full fee calculation.

**The rules can change.** Rule changes and upgrades use the protocol's governance permissions. The timelock we checked had a 1-day minimum delay. A guardian can pause new positions without that wait; the owner must approve reopening them. [Who can change the rules](docs/research-notes/011-loss-governance-staking-and-payments.md#2-who-can-change-rules-and-what-actually-changed) · [Upgrade history](docs/research-notes/013-market-state-funding-and-upgrade-followup.md#1-the-scheduled-implementations-are-now-installed)

## Who pays whom?

```mermaid
flowchart TB
    Price[HyperCore buy/sell midpoint] -.->|Trade price| Trader[Trader: separate positions]
    Trader -->|Cash loss| Pool[Protocol trading pool: LP]
    Pool -->|Paid profit or money owed| Trader
    Trader -->|Loss counted by mint rules| PAPER[New PAPER]
    classDef accent fill:#e1f4d5,stroke:#477a35,color:#18351b
    class Pool,PAPER accent
```

| Two different waits | What is waiting? |
|---|---|
| **Order queue** | Your open or close request waits for the relayer to send it and for it to succeed. |
| **Payout queue** | Profit that has already been recorded waits for enough money to pay it. The docs say the oldest claims are paid first. |

For a position opened with cash, returned margin is recorded separately from profit still owed. Some positions use a claim on unpaid money instead of cash; a loss then reduces that claim and adds no new cash to the pool.

New PAPER and the LP balance shown by the protocol do not tell you how much cash is ready to pay winners. A payout queue orders payments; it does not create money or promise a fixed wait. We still need real examples of partly paid claims to check the full process.

[Order and payout queues](docs/research-notes/007-queue-and-dividend-payment.md) · [What affects payment](docs/research-notes/011-loss-governance-staking-and-payments.md#5-payment-capacity-when-many-traders-win)

## PAPER: the dividend token

🪙 Losses can create PAPER. USDC rewards come from trading fees and money the LP can share above its set limit.

**You cannot freely send PAPER from one wallet to another.** Transfers use the allowed staking contract path. The team says an outside market for shorting PAPER could make attacks on the LP more profitable. That is a risk argument; it does not prove that outside derivatives or attacks are impossible. [Transfer rules and the team's reasoning](docs/research-notes/014-official-announcement-crosscheck.md#1-transfer-restrictions-and-the-external-short-argument)

```mermaid
flowchart TB
    Loss[Loss counted by the mint rules] --> Mint[Receive PAPER]
    Mint --> Stake[Stake PAPER]
    Fees[Half of paid trading fees] --> Rewards[USDC rewards]
    Surplus[LP money above the set limit] --> Rewards
    Stake -.->|Share based on stake| Rewards
    Rewards --> Claim[Claim to trading balance]
    Claim -->|Withdraw| Core[HyperCore USDC]
    classDef accent fill:#e1f4d5,stroke:#477a35,color:#18351b
    class Stake,Rewards accent
```

| Step | How it works |
|---|---|
| 🪙 **Get PAPER** | The amount depends on the loss counted by the rules, the total supply and any LP-shortfall bonus. |
| 📥 **Stake** | You share rewards based on your stake when they are divided up. Holding PAPER without staking earns no share. The docs list no lockup or cooldown. |
| 💵 **Fund rewards** | Half of paid trading fees, plus LP money above the set limit that can be moved into rewards. The documented example limit is $5M. |
| ↗️ **Claim** | Rewards enter your trading balance. Withdrawing to HyperCore is a separate step. |

**Who can move the fees into staking?** Set 2 lets only the PaperStaking contract request this step from Exchange. Other addresses cannot call it directly. Moving fees, assigning rewards, claiming and withdrawing remain separate steps. [Old and new permissions](docs/research-notes/015-contract-set-2.md#4-fee-push-permission-and-the-keeper)

**When rewards are shared matters.** The code we checked gives no extra weight for staking longer. Adding or removing a stake does not first share out the waiting fees. For example, if 100 reward units are waiting and a second equal stake joins before they are shared, each gets 50. If they are shared first, the first stake gets 100. Rewards already assigned stay with that holder after unstaking. This is a code-based example, not a tested way to make money. [Reward timing](docs/research-notes/011-loss-governance-staking-and-payments.md#3-long-term-staking-versus-joining-immediately-before-allocation)

We checked 8 reward distributions in two periods; their amounts matched fee funding. None showed an extra LP-surplus payment, but that does not rule it out at other times. A plan to raise the LP reward limit to $10M was cancelled. Sharing rewards, claiming them and receiving money outside the platform are separate steps. [Where rewards came from](docs/research-notes/011-loss-governance-staking-and-payments.md#4-where-distributions-actually-came-from) · [Cancelled limit change](docs/research-notes/011-loss-governance-staking-and-payments.md#2-who-can-change-rules-and-what-actually-changed)

[More on PAPER and staking](docs/research-notes/006-current-mechanisms.md) · [How rewards are paid](docs/research-notes/007-queue-and-dividend-payment.md)

## Liquidation: trigger price and margin loss

⚠️ Liquidation happens before the price that would use up all your margin. The documented safety buffer is about 5bps (0.05%) around that price. Liquidation takes the position's full margin.

![Long and short liquidation formulas, including rounding and the prices that trigger liquidation](docs/assets/liquidation-formula.en.svg)

> 🧮 <strong>Example: 100× long.</strong> Entry price 100 → zero-margin price 99 → liquidation price about 99.0495, or 99.05.
> Closing before that point can return the margin left in the position. Liquidation takes it all.

**A close request can still end as liquidation.** In set 2, a close executed at or beyond the contract's bust price settles as hard liquidation and takes the full margin. This matters while a close waits in the queue. [Rule and boundary checks](docs/research-notes/015-contract-set-2.md#5-hard-liquidation-at-the-boundary)

The higher the leverage, the bigger the buffer is relative to your margin. [Formula and rounding](docs/research-notes/006-current-mechanisms.md#liquidation-exact-buffer-basis-and-inclusive-threshold).

## Independent clients and API access

🛠️ A custom client follows this path: **read prices, rules and account data → sign a request → send it to the official relayer → follow the trade and balance changes**. Opens and closes still go through the allowed BatchExecutor contract.

| Interface | What you use it for |
|---|---|
| HTTP: `/query/protocol/…` | Protocol totals, queues and PAPER activity. |
| Public WebSocket: `trading:current` | Whether trading is open and what limits apply, such as leverage and position size. |
| Account queries and live updates: `/query/accounts/…`, `/state/user/live?wallet=…` | Your balance, positions and past actions. The exact login and access rules still need checking. |
| Signed requests: `POST /intents` | Session setup, open/close requests, withdrawal to HyperCore and PAPER actions. Match the reply to your request, then check execution. A request being accepted does not mean the trade happened. |

You can close selected positions in full. Opening again creates a separate position. We have not found a confirmed interface for closing part of one position, built-in limit/TP/SL orders or changing an open position's margin or leverage.

**Deposits and withdrawals:**

| Deposit source | Route |
|---|---|
| USDC on Ethereum, Arbitrum or Solana | Circle sends funds toward your deposit address. Papertrade then processes them and credits your trading balance. |
| USDG on Robinhood | Across brings USDC to HyperEVM. The destination contracts then send it through CoreDepositWallet to your deposit address. |
| USDC on HyperEVM or HyperCore | Core/EVM transfers send funds to your deposit address, followed by platform credit. |

Withdrawals first move trading funds to your HyperCore spot account. Sending them onward to HyperEVM, Ethereum, Arbitrum or Solana needs extra transfer approval. The withdrawal routes we found do not include Robinhood. A bridge transfer, a platform credit and arrival at the final address are different steps.

**Still needed for a full client:** permission to use the server and account APIs, reliable recovery after a lost connection, complete fee/payment/refund handling, and clear builder credit and payment rules. Across calls the captured `/suggested-fees` API legacy, so its replacement needs checking before a new integration uses it.

**Builder codes:** a builder named by the session key must also be approved to earn the documented 0.5% of close PnL. The timelock approves builders, sets the rate and can move unclaimed fees; the multisig can remove a builder immediately. Sign-up requirements, exact accounting and actual payment still need checking. [Builder fees and control](docs/research-notes/015-contract-set-2.md#3-builder-fees-documented-rule-accounting-and-payment)

[Client and signing guide](docs/independent-client-guide.md) · [Orders and funding routes](docs/research-notes/012-independent-clients-orders-and-bridges.md)

## Explore the research

| Start here | What you will find |
|---|---|
| [How the parts fit together](docs/mechanism-map.md) | A map of 14 topics covered by this project |
| [Notes](docs/research-notes/) · [Case records](research/cases/) | Explanations, sources and the results of checks |
| [Losses, rule changes and reward timing](docs/research-notes/011-loss-governance-staking-and-payments.md) | Five common questions, examples and what is still unknown |
| [REA analysis](docs/research-notes/010-rea-frontend-and-contract-crosscheck.md) | How the client sends requests, shows PAPER ratios and calls contracts |
| [Calculation helpers](packages/research/mechanics.ts) | Functions for the old mint curve, liquidation price and pending rewards |
| [Evidence tools](docs/chain-evidence.md) | Checks that records and versions fit together |
| [Read-only collection](docs/readonly-collection.md) · [Safe export](docs/safe-export.md) | How public data is collected and reviewed before sharing |
| [Method](docs/research-method.md) · [Progress](STATUS.md) · [Roadmap](ROADMAP.md) | How we work and what comes next |

<details>
<summary><strong>Run the local checks</strong> · Node.js ≥ 24.12.0 / pnpm 11.25.0</summary>

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm validate:records
```

Tests and validation run locally. Live collection is an explicit, separate command.

</details>

---

[Contribute](CONTRIBUTING.md) · [Data policy](DATA_POLICY.md) · [Apache-2.0](LICENSE) · [Third-party notices](THIRD_PARTY_NOTICES.md)
