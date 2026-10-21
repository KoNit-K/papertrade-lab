<h1 align="center">papertrade-research</h1>

<p align="center">
  <strong>REA 辅助逆向：Papertrade 交易、清算与 PAPER 分红。</strong>
</p>

![papertrade-research：观察、追踪与对账](docs/assets/readme-banner.svg)

<p align="center">
  <a href="docs/mechanism-map.md"><img alt="网络：HyperEVM 999" src="https://img.shields.io/badge/HyperEVM-999-b7f58b?style=flat-square&amp;labelColor=17251d" /></a>
  <a href="STATUS.md"><img alt="状态：研究预览" src="https://img.shields.io/badge/status-research_preview-d8e5db?style=flat-square&amp;labelColor=17251d" /></a>
  <a href="LICENSE"><img alt="许可证：Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-d8e5db?style=flat-square&amp;labelColor=17251d" /></a>
</p>

<p align="center">
  <strong>中文</strong> ｜ <a href="README.md">English</a>
</p>

<p align="center">
  <a href="#特性介绍">特性介绍</a> ·
  <a href="#paper-铸币曲线">铸币曲线</a> ·
  <a href="#交易成本">交易费用</a> ·
  <a href="#paper分红代币怎样运作">PAPER 分红</a> ·
  <a href="#独立客户端与-api-接入">API 接入</a> ·
  <a href="#探索研究仓库">仓库导航</a> ·
  <a href="docs/sources.md">来源</a>
</p>

[Papertrade](https://docs.papertrade.xyz/) 是 HyperEVM 上的永续合约协议：与协议 LP 交易，亏损可产生 PAPER，质押参与 USDC 分红。

🔎 这个仓库结合 [REA](https://github.com/morluto/rea) 与人工分析，研究它怎样收费、怎样清算，以及亏损和 PAPER 激励怎样连在一起。[研究进度](STATUS.md) · [来源](docs/sources.md)

## 特性介绍

| 特性 | 怎么运作 |
|---|---|
| 🤝 **与协议 LP 交易** | 每笔交易直接与 Papertrade 协议流动性池结算，盈亏由 LP 承接。 |
| 📊 **Hyperliquid 定价** | 读取 HyperCore 最优买卖价的中间价，在 HyperEVM 记账结算。 |
| ⚡ **最高 1000×，逐仓隔离** | 保证金与杠杆开仓时固定，每仓整仓平仓；多空仓位独立。 |
| 💸 **0 开仓费 · 0 资金费率** | 盈利平仓有盈利调整和手续费；经 relayer 执行的交易由其支付 gas。 |
| ⏳ **高峰期可能排队** | 市价意图由 relayer 接收、排队并批量上链；开仓和平仓都可能等待。 |
| 🪙 **亏损产生 PAPER** | 合格亏损和清算按排放曲线铸币；质押 PAPER 后按份额参与 USDC 分配。 |

> 🖥️ <strong>需要自己盯盘：</strong> 目前只有网页市价单，没有限价单、自动止盈止损或独立手机 App。
> 高杠杆下，小幅逆向波动就可能爆仓。想控制退出时机，需要自己看盘、手动平仓；平仓排队时也仍可能被清算。

🧩 <strong>机制看点：</strong> 亏损平仓／清算结束仓位，同时按合格亏损基数产生 PAPER；PAPER 质押后再参与分红。清算风险与亏损后的代币激励，被放在了同一套机制里。

[交易机制导览](docs/mechanism-map.md)

## PAPER 铸币曲线

![PAPER 铸币曲线：累计进度推动边际铸币率衰减，保留进度后跨越 LP 阈值可出现阶跃](docs/assets/paper-mint-curve.zh-CN.svg)

- 📉 <strong>怎么衰减：</strong> 文档示例中，LP 低于 200 万美元时为 100 PAPER/$；达到阈值后，铸币率随累计尾段进度 H 衰减。
- ⚙️ <strong>谁能调整：</strong> 合约 owner 可修改 LP 阈值、铸币率、衰减尺度和 LP 盈余分红门槛。

H 是累计进度，分红减少 LP 不会重置 H。右图固定 H 展示阈值阶跃，使用示例参数；整笔铸币按区间计算。
[公式与绘图输入](docs/readme-figures.md#mint-rate-illustration) · [参数权限](docs/readme-figures.md#parameter-authority)

**参与发币的亏损基数也会不同：** 没有赔付队列时，现金亏损平仓按亏损减去 LP 侧费用计算；清算则按全部损失保证金计算。这部分费用从 LP 所得划出，不是给交易者再加一笔亏损。

| 已核对的清算例，内部记账单位 | 金额 |
|---|---:|
| 损失保证金与 PAPER 发币基数 | 20 |
| 扣除费用后的 tracked LP 增量 | 19.6 |

基数、累计进度和可调参数都能改变拿币数量，比例变化本身不能证明有人改参。这笔收据核对了金额关系，仍缺独立重现历史发币的完整输入。[亏损分支与算例](docs/research-notes/011-loss-governance-staking-and-payments.md#1-why-equal-losses-can-produce-different-paper-amounts)

🔎 已采集的前端代码中，**PAPER 比例函数**按铸币数量 ÷ 合格亏损基数计算该笔平均比例。页面调用方和实际运行时使用仍未确认。[REA 与前端复核](docs/research-notes/010-rea-frontend-and-contract-crosscheck.md#captured-paper-ratio-formatter)

## 交易成本

| 发生什么 | 交易者承担什么成本 |
|---|---|
| **开仓** | 0 开仓手续费 |
| **持仓** | 0 资金费率 |
| **Relayer 执行交易** | Gas 由 relayer 支付 |
| **盈利平仓** | 先扣 deadband、调整盈利，再收取 <strong>调整后盈利的 2%</strong> |
| **亏损平仓** | 承担亏损，不额外加收交易费 |

💡 Deadband 约为开仓价的 <strong>0.002%</strong>。文档示例中，非线性调整会削减 deadband 后盈利的约 <strong>10% 到接近 100%</strong>；顺向价格变动越小，削减越明显。
最后的 2% 按调整后盈利计算，不按仓位名义本金计算。

[盈利调整公式与 BTC／ETH 示例](docs/readme-figures.md#profit-retention-examples)

**费用和结算规则可以修改。** 2026-10-21 采集时，已核对的业务 owner 和升级路径连接到治理合约。真实成功交易把时间锁最小延迟设为 **1天**，而捕获的官网地址页仍写7天。guardian 多签可不经时间锁排期暂停新开仓；解除暂停需要 owner。

三项实现升级已排期，最早可于 **2026-10-22 05:35:19（新加坡）** 执行。观察时仍待执行，不能当作已经升级，新实现尚未分析。[规则权限与真实变更记录](docs/research-notes/011-loss-governance-staking-and-payments.md#2-who-can-change-rules-and-what-actually-changed)

## 盈亏由谁承担？

```mermaid
flowchart TB
    Price[HyperCore BBO 中间价] -.->|成交价格| Trader[交易者：独立逐仓仓位]
    Trader -->|现金保证金亏损| Pool[协议 LP：交易对手方]
    Pool -->|盈利结算或待付债权| Trader
    Trader -->|合格亏损基数| PAPER[铸出 PAPER]
    classDef accent fill:#e1f4d5,stroke:#477a35,color:#18351b
    class Pool,PAPER accent
```

| 两种不同的等待 | 等待的是什么？ |
|---|---|
| **执行排队** | 开／平仓意图等待 relayer 选取并成功执行。 |
| **赔付排队** | 已结算债权等待可用 LP 背书资金与 harvest；文档描述的赔付顺序为 FIFO。 |

现金开仓的保证金返还与未付盈利分开记账；债权保证金的亏损销毁相应债权，不形成新增现金。
因此，PAPER 发币量和 tracked LP 不能代替可付给赢家的现金。赔付队列只安排已有资金的支付顺序，不产生资金，也没有由此得到固定清偿期限。真实活跃欠款与部分付款案例仍缺。
[执行队列与赔付机制](docs/research-notes/007-queue-and-dividend-payment.md) · [付款能力与条件算例](docs/research-notes/011-loss-governance-staking-and-payments.md#5-payment-capacity-when-many-traders-win)

## PAPER：分红代币怎样运作？

🪙 PAPER 把合格亏损转成代币发行；USDC 分红的资金来自交易费用和 LP 盈余。

```mermaid
flowchart TB
    Loss[符合条件的亏损或清算] --> Mint[铸出 PAPER]
    Mint --> Stake[质押 PAPER]
    Fees[已支付交易费用的一半] --> Rewards[USDC 奖励分配]
    Surplus[可划转 LP 盈余] --> Rewards
    Stake -.->|按质押份额| Rewards
    Rewards --> Claim[领取至交易余额]
    Claim -->|经 CoreWriter 提款| Core[HyperCore USDC]
    classDef accent fill:#e1f4d5,stroke:#477a35,color:#18351b
    class Stake,Rewards accent
```

| 环节 | 规则 |
|---|---|
| 🪙 **铸币** | 合格亏损基数与曲线进度决定数量。 |
| 📥 **质押** | 按分配时份额累计分红，仅持有不分红；新加入可分享此前未分配的钱。文档无锁定期或冷却期。 |
| 💵 **资金来源** | 已支付交易费用的一半，加上 tracked LP 超过门槛的可划转盈余；文档示例门槛为 500 万美元。 |
| ↗️ **领取** | 先计入交易余额，再单独提款至 HyperCore。 |

**分配时点影响谁能分到这笔钱。** 取得的代码中，持有时长不额外加权，加入和退出质押也不会先把积累的费用分掉。假设有100单位奖励待分，后来者在分配前加入相同份额，两人各得50；若先分配再加入，则原持有人得100。已分配收益归原持有人，退出后也保留。这是条件代码算例，未证明真实临时质押策略已获利。[质押时机分析](docs/research-notes/011-loss-governance-staking-and-payments.md#3-long-term-staking-versus-joining-immediately-before-allocation)

两个独立窗口中已核对的8笔分配均与手续费来源相符，未证明额外 LP 盈余划转，但不能排除其他时期有盈余分红。将 tracked LP 盈余分红门槛设为1000万美元的方案已取消，没有生效。分配、领取入账和外部到账仍需分别核对。[资金来源与储备核账](docs/research-notes/011-loss-governance-staking-and-payments.md#4-where-distributions-actually-came-from) · [门槛方案取消记录](docs/research-notes/011-loss-governance-staking-and-payments.md#2-who-can-change-rules-and-what-actually-changed)

[铸币与质押机制分析](docs/research-notes/006-current-mechanisms.md) · [分红支付路径](docs/research-notes/007-queue-and-dividend-payment.md)

## 清算：触发价格与保证金损失

⚠️ 清算在理论归零价之前触发。文档缓冲约为 5 个基点（0.05%），按归零价计算；一旦触发，损失整笔逐仓保证金。

![清算公式：保留整数取整顺序的多空清算价格，以及包含等号的触发条件](docs/assets/liquidation-formula.zh-CN.svg)

> 🧮 <strong>100× 多仓示意：</strong> 开仓价 100 → 理论归零价 99 → 清算价约 99.0495 ≈ 99.05。
> 触发前主动平仓可返还剩余权益；触发清算则损失整笔保证金。

杠杆越高，缓冲占保证金的比例越大。具体取整见[公式与计算](docs/research-notes/006-current-mechanisms.md#liquidation-exact-buffer-basis-and-inclusive-threshold)。

## 独立客户端与 API 接入

🛠️ 接入流程是 **读取规则和账户状态 → 签署交易意图 → 提交官方 relayer →
跟踪执行及余额变化**。自写客户端可以用这些接口串起自己的交易流程；开平仓仍由
获授权的 BatchExecutor 执行。

| 接口 | 在独立客户端中的作用 |
|---|---|
| HTTP 查询：`/query/protocol/…` | 获取协议汇总、队列概况和 PAPER 动态，用于了解协议运行情况。 |
| 公共 WebSocket：`trading:current` | 获取交易开关和市场规则，包括杠杆、仓位限制，用于下单前校验。 |
| 账户查询与 SSE：`/query/accounts/…`、`/state/user/live?wallet=…` | 获取本人余额、仓位、操作状态和历史，用于核对账户变化；具体接入鉴权条件仍待补齐。 |
| 签名指令：`POST /intents` | 提交会话授权、开平仓、提现到 HyperCore 及 PAPER 操作。先匹配接单回执，再跟踪实际执行；接单不等于成交。 |

可以选择若干仓位逐个全平，再次开仓会形成独立仓位。单仓部分减仓、原生限价/
止盈止损，以及修改旧仓保证金或杠杆，尚未找到已确立的支持接口。

**充值与提现：**

| 充值来源 | 资金路线 |
|---|---|
| Ethereum、Arbitrum、Solana 的 USDC | 走 Circle 相关销毁与转发流程到用户充值代理，再由平台处理并记入交易余额。 |
| Robinhood 的 USDG | 走 Across，在 HyperEVM 侧以 USDC 到达，再经目标链处理器和 CoreDepositWallet 转入代理。 |
| HyperEVM、HyperCore 的 USDC | 经 Core/EVM 内部转移进入代理，再由平台记账。 |

提现先将平台余额转回用户的 HyperCore 现货账户。继续转到 HyperEVM、Ethereum、
Arbitrum 或 Solana 时需要额外的后续转账授权；已恢复的提现路线不包含 Robinhood。
跨链完成、平台入账和最终目的地到账是需要分别跟踪的阶段。

**串成完整客户端还缺：** 服务端准入与账户鉴权、可靠的断线重连和状态对账、完整的
费用/到账/退款处理，以及 builder 归属和费用规则。Across 已将这里使用的
`/suggested-fees` 标为 legacy，新接入还需核对迁移路线。

[API 与签名指南](docs/independent-client-guide.md) ·
[订单能力及资金路线](docs/research-notes/012-independent-clients-orders-and-bridges.md)

## 探索研究仓库

| 从这里开始 | 可以找到什么 |
|---|---|
| [机制地图](docs/mechanism-map.md) | 协议的 14 个研究方向 |
| [研究笔记](docs/research-notes/) · [案例记录](research/cases/) | 机制解释、来源坐标与结构化结果 |
| [亏损、治理与质押时机](docs/research-notes/011-loss-governance-staking-and-payments.md) | 五题的真实记录、代码观察、条件算例与缺口 |
| [REA 分析](docs/research-notes/010-rea-frontend-and-contract-crosscheck.md) | 客户端提交路径、PAPER 比例显示与合约接口推断 |
| [离线算术](packages/research/mechanics.ts) | 铸币曲线、清算价格和待领取奖励的计算函数 |
| [证据工具](docs/chain-evidence.md) | 记录验证与版本一致性检查 |
| [只读采集](docs/readonly-collection.md) · [安全导出](docs/safe-export.md) | 有界公开读取与经审阅的元数据导出 |
| [研究方法](docs/research-method.md) · [研究进度](STATUS.md) · [路线图](ROADMAP.md) | 工作方法、验证状态与下一阶段目标 |

<details>
<summary><strong>运行本地检查</strong> · Node.js ≥ 24.12.0 / pnpm 11.25.0</summary>

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm validate:records
```

测试与验证在本地运行；在线采集使用单独的显式命令。

</details>

---

[参与贡献](CONTRIBUTING.md) · [数据政策](DATA_POLICY.md) · [Apache-2.0](LICENSE) · [第三方声明](THIRD_PARTY_NOTICES.md)
