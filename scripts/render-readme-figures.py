#!/usr/bin/env python3
"""Render old/new issuance comparisons and liquidation formulas offline.

Requires matplotlib. See docs/readme-figures.md for inputs and interpretation.
The marginal curve is not an integer settlement or a whole-trade mint estimate.
"""
from __future__ import annotations

import argparse
from decimal import Decimal, localcontext
from pathlib import Path

FLAT_RATE = 100.0
THRESHOLD_M = 2.0
DECAY_M = 120.0
CAP_M = 5.0
ILLUSTRATIVE_H_M = 260.5


def tail_rate(progress_m: float) -> float:
    if progress_m < 0:
        raise ValueError('Progress must be nonnegative')
    return FLAT_RATE * (DECAY_M / (DECAY_M + progress_m)) ** 2


def legacy_rate(lp_m: float, progress_m: float) -> float:
    """Old mode: fixed-H state cross-section, not an LP/time trajectory."""
    rate = tail_rate(progress_m)
    return FLAT_RATE if lp_m < THRESHOLD_M else rate


def issuance_steps(initial_supply: Decimal, steps: int) -> list[Decimal]:
    """Illustration only: add 0.1% of prior supply per $1M eligible loss step.

    This recurrence is a rounded announcement-scale teaching example, not the
    current contract's coefficient, interval integration or integer rounding.
    """
    if initial_supply < 0 or steps < 0:
        raise ValueError('Supply and steps must be nonnegative')
    with localcontext() as context:
        context.prec = 50
        values = [initial_supply]
        for _ in range(steps):
            values.append(values[-1] * Decimal('1.001'))
        return values


def unchanged_holder_share(holding: Decimal, total_supply: Decimal) -> Decimal:
    if holding < 0 or total_supply <= 0:
        raise ValueError('Holding must be nonnegative and total supply positive')
    return holding / total_supply


def net_gain_kept(move_percent: str, position_multiplier: str) -> Decimal:
    """Fraction of raw market gain retained, including deadband and 2% win fee."""
    with localcontext() as context:
        context.prec = 50
        move = Decimal(move_percent) / 100
        if move <= 0:
            raise ValueError('Move must be positive')
        effective = max(move - Decimal('0.00002'), Decimal(0))
        if effective == 0:
            return Decimal(0)
        scale = Decimal('0.9') / (
            1 + 1 / (effective * 15000)
            + Decimal(100000) / (1000000 * effective * Decimal(position_multiplier))
        )
        return effective / move * scale * Decimal('0.98')


def check_values() -> None:
    assert tail_rate(0) == 100
    assert tail_rate(120) == 25
    assert legacy_rate(1.999, 120) == 100
    assert legacy_rate(2, 120) == 25
    assert abs(legacy_rate(2, 120 * (5 ** .5 - 1)) - 20) < 1e-12
    supplies = issuance_steps(Decimal('10000000000'), 2)
    assert supplies == [Decimal('10000000000'), Decimal('10010000000'), Decimal('10020010000')]
    assert issuance_steps(Decimal('0'), 3) == [Decimal('0')] * 4
    assert issuance_steps(Decimal('10000000000'), 100)[-1].quantize(Decimal('.01')) == Decimal('11051156977.21')
    assert unchanged_holder_share(Decimal('100000000'), supplies[-1]) < Decimal('.01')
    final_share_percent = unchanged_holder_share(Decimal('100000000'), issuance_steps(Decimal('10000000000'), 100)[-1]) * 100
    assert final_share_percent.quantize(Decimal('.001')) == Decimal('.905')
    assert abs(tail_rate(ILLUSTRATIVE_H_M) - 9.946107980888277) < 1e-12
    assert all(tail_rate(i + 1) < tail_rate(i) for i in range(360))
    assert net_gain_kept('0.002', '814.598') == 0
    expected = [('0.01', '21.0', '16.0'), ('0.1', '72.4', '67.6'), ('1', '86.4', '85.7')]
    for move, btc, eth in expected:
        values = [(net_gain_kept(move, p) * 100).quantize(Decimal('.1')) for p in ['814.598', '483.979']]
        assert list(map(str, values)) == [btc, eth]
    for market in ['814.598', '483.979']:
        assert net_gain_kept('1000000', market) < Decimal('.882')
    print('PASS: legacy threshold/tail, supply issuance/dilution, deadband and retained gain examples')


def render(output: Path, language: str, font: str | None) -> None:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from matplotlib import font_manager
    from matplotlib.patches import FancyBboxPatch
    import numpy as np

    if font:
        prop = font_manager.FontProperties(fname=font)
        font_manager.fontManager.addfont(font)
        family = prop.get_name()
    else:
        family = 'DejaVu Sans'
    plt.rcParams.update({'font.family': family, 'svg.fonttype': 'path', 'font.size': 12,
                         'axes.unicode_minus': False, 'text.parse_math': False,
                         'svg.hashsalt': 'papertrade-issuance-comparison-v2'})
    zh = language == 'zh-CN'
    bg, panel, text, muted, grid = '#0e1713', '#15241c', '#eff6ee', '#adc1b2', '#34483b'
    mint, amber = '#b7f58b', '#f2bc72'
    fig = plt.figure(figsize=(14, 10), facecolor=bg)
    fig.text(.055, .945, 'PAPER 发行：旧曲线 → 新机制' if zh else 'PAPER ISSUANCE  /  OLD → NEW',
             color=text, fontsize=27, weight='bold')
    fig.text(.055, .90, '看发了多少币，也看总量增长后你还占多少。' if zh
             else 'Read the token count together with total supply and your remaining share.',
             color=muted, fontsize=15)
    fig.text(.055, .855, '2026 · 10/06 旧官网页标注  →  10/20 新机制公告  →  10/22 已安装核验（并非精确执行时间）' if zh
             else '2026 · Oct 06: old docs date  →  Oct 20: announcement  →  Oct 22: installation checked (not execution time)',
             color=muted, fontsize=11)
    fig.text(.055, .79, '旧模型  /  门槛降档 + 尾段衰减' if zh else 'OLD  /  THRESHOLD + DECAY',
             color=amber, fontsize=15, weight='bold')
    fig.text(.545, .79, '新模型  /  按现有供应量比例增发' if zh else 'NEW  /  SUPPLY-RELATIVE ISSUANCE',
             color=mint, fontsize=15, weight='bold')
    step = fig.add_axes((.085, .56, .37, .16), facecolor=panel)
    tail = fig.add_axes((.085, .275, .37, .16), facecolor=panel)
    supply_ax = fig.add_axes((.575, .275, .36, .19), facecolor=panel)
    for ax in [step, tail, supply_ax]:
        ax.tick_params(colors=muted, labelsize=10)
        ax.grid(axis='y', color=grid, linewidth=.7)
        ax.set_axisbelow(True)
        for spine in ax.spines.values():
            spine.set_color(grid)
    fig.text(.055, .745, '① 保留旧进度后，再过 LP 门槛会突然降档' if zh
             else '01  A threshold re-entry can step down at retained H', color=text, fontsize=12)
    # Hold H fixed. Do not join this LP cross-section to the H-axis tail plot.
    step.plot([1, 2], [legacy_rate(1, 120)] * 2, color=amber, linewidth=3)
    step.plot([2, 3.5], [legacy_rate(2, 120)] * 2, color=amber, linewidth=3)
    step.plot([2, 2], [100, 25], color=amber, linestyle='--', linewidth=2)
    step.set(xlim=(1, 3.5), ylim=(0, 115), xticks=[1, 2, 3], yticks=[0, 25, 100])
    step.set_xlabel('当前 LP（百万美元）；H 固定为 $120M' if zh
                    else 'Current LP ($M); H held at $120M', color=muted, fontsize=10)
    step.set_ylabel('PAPER / $1', color=muted, fontsize=10)
    step.text(1.07, 104, '100：平坦段' if zh else '100: flat branch', color=amber, fontsize=10)
    step.text(2.13, 38, '25：保留进度的例子' if zh else '25: retained-H example', color=amber, fontsize=10)
    fig.text(.055, .49, '② 尾段继续衰减：25 → 20 → 约 10' if zh
             else '02  The tail keeps decaying: 25 → 20 → about 10', color=text, fontsize=12)
    h = np.linspace(120, 280, 401)
    tail.plot(h, [tail_rate(float(x)) for x in h], color=amber, linewidth=3)
    tail.fill_between(h, [tail_rate(float(x)) for x in h], color=amber, alpha=.09)
    tail.set(xlim=(115, 285), ylim=(0, 31), xticks=[120, 180, 260], yticks=[0, 10, 20, 25])
    tail.set_xlabel('累计尾段进度 H（百万美元），不是当前 LP' if zh
                    else 'Cumulative tail H ($M), not current LP', color=muted, fontsize=10)
    tail.set_ylabel('PAPER / $1', color=muted, fontsize=10)
    for x, label in [(120, '25'), (120 * (5 ** .5 - 1), '20'), (260.5, '9.95')]:
        y = tail_rate(x)
        tail.scatter([x], [y], color=amber, s=30)
        tail.annotate(label, (x, y), xytext=(3, 9), textcoords='offset points',
                      color=amber, fontsize=11, weight='bold')
    fig.text(.055, .205, '100 不是升级前一直适用的水平；25 / 20 也不是固定跳档值。' if zh
             else '100 was not the universal pre-upgrade rate; 25 / 20 are not fixed tiers.',
             color=amber, fontsize=10)
    fig.text(.545, .745, '① 相同亏损，供应量越大，新增币数越多' if zh
             else '01  Same loss: a larger supply creates more new tokens', color=text, fontsize=12)
    supplies = issuance_steps(Decimal('10000000000'), 100)
    unit, suffix = (Decimal('1e8'), ' 亿') if zh else (Decimal('1e9'), ' bn')
    precision = [3, 3, 4] if zh else [3, 3, 5]
    cards = [f'{supply / unit:.{places}f}' + suffix
             for supply, places in zip(supplies[:3], precision)]
    for j, value in enumerate(cards):
        x = .545 + .137 * j
        patch = FancyBboxPatch((x, .59), .123, .115,
                              boxstyle='round,pad=0.005,rounding_size=0.01',
                              transform=fig.transFigure, facecolor=panel, edgecolor=grid)
        fig.add_artist(patch)
        fig.text(x + .009, .668, ('起始总量' if j == 0 else f'第 {j} 次后') if zh
                 else ('Starting supply' if j == 0 else f'After step {j}'), color=muted, fontsize=10)
        fig.text(x + .009, .622, value, color=mint, fontsize=14, weight='bold')
    fig.text(.545, .55, '每步 $1M 合格亏损 → 按前一步总量增发约 0.1%' if zh
             else 'Each $1M eligible loss → issue about 0.1% of the prior supply',
             color=muted, fontsize=11)
    supply_ax.plot(range(101), [float(x / Decimal('1000000000')) for x in supplies],
                   color=mint, linewidth=3)
    supply_ax.fill_between(range(101), 10, [float(x / Decimal('1000000000')) for x in supplies],
                           color=mint, alpha=.1)
    supply_ax.set(xlim=(0, 100), ylim=(9.9, 11.4), xticks=[0, 50, 100], yticks=[10, 10.5, 11])
    supply_ax.set_xlabel('累计合格亏损（百万美元）' if zh else 'Cumulative eligible loss ($M)',
                         color=muted, fontsize=10)
    supply_ax.set_ylabel('总供应量（十亿枚）' if zh else 'Total supply (bn PAPER)',
                         color=muted, fontsize=10)
    supply_ax.annotate('+10.51%', (100, float(supplies[-1] / Decimal('1e9'))),
                       xytext=(-74, 12), textcoords='offset points', color=mint,
                       fontsize=13, weight='bold')
    share = unchanged_holder_share(Decimal('100000000'), supplies[-1]) * 100
    fig.text(.545, .205, ('持币数不变：原占比 1% → 约 ' + f'{share:.3f}%') if zh
             else f'Unchanged holding: 1% of supply → about {share:.3f}%',
             color=mint, fontsize=12, weight='bold')
    fig.text(.055, .135, '资不抵债加成：1 → 5 倍 / 3 天，仅作用于符合条件的缺口修复部分。' if zh
             else 'Insolvency incentive: 1 → 5× over 3 days, limited to the eligible deficit-repair portion.',
             color=text, fontsize=12)
    fig.text(.055, .085, '图为机制示意：右侧每步固定 0.1%，不是合约精确计算；左侧使用旧参数与指定 H，不是历史行情。' if zh
             else 'Illustrations: right uses a fixed 0.1% step, not exact contract math; left uses old parameters and chosen H, not history.',
             color=muted, fontsize=10)
    fig.text(.055, .045, '更多 PAPER ≠ 更多 USDC；实际分红还取决于资金来源、质押份额与分配时点。' if zh
             else 'More PAPER does not create more USDC; distributions depend on funding, staking shares and allocation timing.',
             color=muted, fontsize=11)
    output.mkdir(parents=True, exist_ok=True)
    stem = output / f'paper-mint-curve.{language}'
    svg_path = stem.with_suffix(stem.suffix + '.svg')
    fig.savefig(svg_path, facecolor=bg, metadata={
        'Date': None, 'Creator': 'papertrade-research / matplotlib',
        'Description': 'Old retained-H threshold and decaying tail versus illustrative supply-relative issuance and dilution. Not contract replay.'})
    svg_path.write_text('\n'.join(line.rstrip() for line in svg_path.read_text().splitlines()) + '\n')
    fig.savefig(stem.with_suffix(stem.suffix + '.png'), facecolor=bg, dpi=140)
    plt.close(fig)
    print(f'Rendered issuance comparison {language} SVG/PNG')


def render_liquidation(output: Path, language: str, font: str | None) -> None:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from matplotlib import font_manager
    from matplotlib.patches import FancyBboxPatch

    if font:
        prop = font_manager.FontProperties(fname=font)
        font_manager.fontManager.addfont(font)
        family = prop.get_name()
    else:
        family = 'DejaVu Sans'
    plt.rcParams.update({'font.family': family, 'svg.fonttype': 'path',
                         'text.parse_math': False, 'svg.hashsalt': 'papertrade-liquidation-v1'})
    zh = language == 'zh-CN'
    bg, panel, text, muted = '#0e1713', '#15241c', '#eff6ee', '#adc1b2'
    mint, amber = '#b7f58b', '#f2bc72'
    fig = plt.figure(figsize=(12, 6.3), facecolor=bg)
    fig.text(.055, .90, '清算价格 · 缓冲与触发条件' if zh else 'LIQUIDATION · BUFFER & TRIGGER',
             color=text, fontsize=24, weight='bold')
    fig.text(.055, .835, '先计算理论归零价，再朝开仓价方向加入缓冲。' if zh
             else 'Find the zero-equity reference, then buffer it toward entry.',
             color=muted, fontsize=13)
    fig.text(.055, .735, r'$d=\left\lfloor\frac{E}{\ell}\right\rfloor$',
             parse_math=True, color=text, fontsize=23)
    fig.text(.30, .735, r'$\frac{b}{W}\approx 0.0005=0.05\%$',
             parse_math=True, color=muted, fontsize=21)
    for x, is_long in [(.055, True), (.535, False)]:
        color = mint if is_long else amber
        card = FancyBboxPatch((x, .24), .41, .43, boxstyle='round,pad=0.015,rounding_size=0.018',
                              transform=fig.transFigure, facecolor=panel, edgecolor='#34483b')
        fig.add_artist(card)
        fig.text(x + .015, .615, ('多仓 LONG' if zh else 'LONG') if is_long
                 else ('空仓 SHORT' if zh else 'SHORT'), color=color, fontsize=16, weight='bold')
        formulas = ([r'$z_L=E-d$',
                     r'$P_{\mathrm{liq},L}=z_L+\left\lfloor\frac{z_L b}{W}\right\rfloor$',
                     r'$P_t\leq P_{\mathrm{liq},L}$'] if is_long else
                    [r'$z_S=E+d$',
                     r'$P_{\mathrm{liq},S}=z_S-\left\lfloor\frac{z_S b}{W}\right\rfloor$',
                     r'$P_t\geq P_{\mathrm{liq},S}$'])
        for y, formula in zip([.53, .425, .32], formulas):
            fig.text(x + .015, y, formula, parse_math=True, color=text if y > .32 else color,
                     fontsize=23)
    fig.text(.055, .15, 'E：开仓价   ℓ：杠杆倍数   b / W：缓冲比例   P(t)：执行时参考价   ⌊·⌋：向下取整' if zh
             else 'E: entry   ℓ: leverage   b / W: buffer ratio   P(t): execution reference price   ⌊·⌋: floor',
             color=muted, fontsize=11)
    fig.text(.055, .075, '价格按合约整数单位计算 · 约 5 bps 为文档描述，非实时参数 · 触发后损失全部逐仓保证金' if zh
             else 'Use contract integer price units · Approx. 5 bps is documented, not live · Full isolated margin is lost',
             color=muted, fontsize=10)
    output.mkdir(parents=True, exist_ok=True)
    stem = output / f'liquidation-formula.{language}'
    svg_path = stem.with_suffix(stem.suffix + '.svg')
    fig.savefig(svg_path, facecolor=bg, metadata={
        'Date': None, 'Creator': 'papertrade-research / matplotlib',
        'Description': 'Liquidation formula: integer rounding, zero-equity-price buffer, inclusive long/short triggers.'})
    svg_path.write_text('\n'.join(line.rstrip() for line in svg_path.read_text().splitlines()) + '\n')
    fig.savefig(stem.with_suffix(stem.suffix + '.png'), facecolor=bg, dpi=160)
    plt.close(fig)
    print(f'Rendered liquidation {language} SVG/PNG')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check-only', action='store_true')
    parser.add_argument('--output-dir', type=Path, default=Path(__file__).resolve().parents[1] / 'docs/assets')
    parser.add_argument('--mint-only', action='store_true', help='Render only the issuance comparison')
    parser.add_argument('--cjk-font', help='Installed CJK font file for the Chinese figure')
    args = parser.parse_args()
    check_values()
    if not args.check_only:
        render(args.output_dir, 'en', None)
        if not args.mint_only:
            render_liquidation(args.output_dir, 'en', None)
        if args.cjk_font:
            render(args.output_dir, 'zh-CN', args.cjk_font)
            if not args.mint_only:
                render_liquidation(args.output_dir, 'zh-CN', args.cjk_font)


if __name__ == '__main__':
    main()
