# Papertrade Mechanics Lab

**研究 Papertrade 的交易、结算与 PAPER 机制。**

这是一个独立的开源研究项目。我们阅读官方文档，分析公开前端、历史合约字节码、
交易输入和事件，把 Papertrade 的规则拆成可以追踪证据、核对版本和逐步复验的解释。
重点是弄清楚：一笔交易如何执行，盈亏如何进入余额或待赔付债权，PAPER 又如何产生。

[English](README.md) · [机制地图](docs/mechanism-map.md) · [研究笔记](docs/research-notes/003-historical-interface-recovery.md) · [资料来源](docs/sources.md)

## Papertrade 的机制是什么样的？

下面区分**官方文档描述**与**已观察的链上结构**。文档中的经济规则尚未完成独立结算复验，
不能把当前说明或某次区块快照直接套用到所有历史交易。

### 交易意图如何变成合约执行

官方架构把用户签署的交易意图交给 relayer，再由 BatchExecutor 批量调用 Exchange。
因此，意图被接收、交易被打包、某条调用成功，是不同阶段。等待交易执行也不同于等待盈利赔付。
见[架构来源](https://docs.papertrade.xyz/how/architecture/)。

```mermaid
flowchart LR
    A[用户交易意图] --> B[Relayer]
    B --> C[BatchExecutor 批量执行]
    C --> D[Exchange 仓位与账本]
    D --> E[余额或待赔付债权]
```

这是官方文档中的路径。我们已在一个历史候选中观察到批处理内的平仓调用，
其仓位 ID 与平仓事件一致；完整的意图授权和经济结果仍需更多证据。

### 仓位与账户余额分别记录

在已检查的历史实现中，字节码显示仓位按 ID 查询，账户余额另有映射。
首条候选的平仓输入只指定一个仓位，区块末仍能读取相应记录。
这为区分“仓位结果”和“账户汇总变化”提供了结构线索；字段业务含义和执行前状态仍需核对。
证据见[历史接口与存储布局笔记](docs/research-notes/003-historical-interface-recovery.md)。

### 盈利到账不是固定扣一个百分比

官方文档描述的盈利路径包含 deadband、非线性收益调整，以及对调整后收益收取的费用。
其中的启动参数 `10%` 不等于每笔盈利都固定扣除 `10%`；文档描述的 `2%` 费用也有自己的计费基数。
要解释到账金额，需要分开看价格变化、调整后盈亏、费用、返还保证金和实际可用余额。
详见[盈利到账研究](docs/research-notes/001-winning-trade-payout.md)。

### 现金、债权和赔付队列是不同的账

官方偿付说明区分可用现金和待赔付债权，并描述资金不足时的排队支付，以及使用债权开仓的不同分支。
因此，“记账上应得多少”和“现在可以取出多少”不能混为一谈；是否已经付款，需要结合账本与后续事件判断。
文档中的最终支付描述也不能当作固定到账期限。见[偿付与队列来源](https://docs.papertrade.xyz/how/solvency-queue/)。

### PAPER 发行要看合格亏损和曲线状态

官方发行说明把 PAPER 与合格亏损、tracked LP 和高水位进度联系起来。
某一时点的边际发行率，与整笔亏损对应的平均发行率，是两个不同量。
研究“为什么每单位亏损得到的 PAPER 变少”时，还需要核对发行基数、区间和单位，不能只比较两个页面数字。
见[发行曲线来源](https://docs.papertrade.xyz/how/mint-curve/)。

### 开多、开空和清算受各自条件约束

官方风险文档描述了方向性持仓容量、市场开关、杠杆和仓位限制。
界面、中继接收规则和合约执行检查是不同层次；某次单边开仓失败，仍需当时的参数、状态和错误证据才能解释。
见[风险来源](https://docs.papertrade.xyz/how/risk/)与[机制地图](docs/mechanism-map.md)。

---

研究采用只读方式，不操作钱包或提交交易。项目非官方；原创代码与文档采用 [Apache-2.0](LICENSE)。
[研究方法](docs/research-method.md) · [证据与进度](STATUS.md) · [贡献与数据边界](CONTRIBUTING.md) · [第三方声明](THIRD_PARTY_NOTICES.md)
