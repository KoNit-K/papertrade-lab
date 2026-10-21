#!/usr/bin/env python3
"""Render documented mint-rate illustrations and liquidation formulas offline.

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
    assert abs(tail_rate(ILLUSTRATIVE_H_M) - 9.946107980888277) < 1e-12
    assert all(tail_rate(i + 1) < tail_rate(i) for i in range(360))
    assert net_gain_kept('0.002', '814.598') == 0
    expected = [('0.01', '21.0', '16.0'), ('0.1', '72.4', '67.6'), ('1', '86.4', '85.7')]
    for move, btc, eth in expected:
        values = [(net_gain_kept(move, p) * 100).quantize(Decimal('.1')) for p in ['814.598', '483.979']]
        assert list(map(str, values)) == [btc, eth]
    for market in ['814.598', '483.979']:
        assert net_gain_kept('1000000', market) < Decimal('.882')
    print('PASS: marginal-rate anchors/monotonicity, deadband, gain examples and asymptote')


def render(output: Path, language: str, font: str | None) -> None:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from matplotlib import font_manager
    import numpy as np

    if font:
        prop = font_manager.FontProperties(fname=font)
        font_manager.fontManager.addfont(font)
        family = prop.get_name()
    else:
        family = 'DejaVu Sans'
    plt.rcParams.update({'font.family': family, 'svg.fonttype': 'path', 'font.size': 12,
                         'axes.unicode_minus': False, 'text.parse_math': False, 'svg.hashsalt': 'papertrade-mint-v1'})
    zh = language == 'zh-CN'
    bg, panel, text, muted, grid = '#0e1713', '#15241c', '#eff6ee', '#adc1b2', '#34483b'
    mint, amber = '#b7f58b', '#f2bc72'
    fig = plt.figure(figsize=(12, 6.5), facecolor=bg)
    left = fig.add_axes((.075, .23, .40, .48), facecolor=panel)
    right = fig.add_axes((.57, .23, .385, .48), facecolor=panel)
    for ax in (left, right):
        ax.set_ylim(0, 112)
        ax.set_yticks([0, 25, 50, 75, 100])
        ax.tick_params(colors=muted, labelsize=10)
        ax.grid(axis='y', color=grid, linewidth=.7, alpha=.8)
        ax.set_axisbelow(True)
        for spine in ax.spines.values():
            spine.set_color(grid)
    fig.text(.075, .91, 'PAPER 铸币曲线' if zh else 'PAPER MINT CURVE',
             color=text, fontsize=25, weight='bold')
    fig.text(.075, .85, '每 1 美元合格亏损基数对应的边际 PAPER 数量' if zh
             else 'Marginal PAPER per $1 of eligible loss basis', color=muted, fontsize=13)
    left.set_title('① 累计进度越大，尾段铸币率越低' if zh else '01  A one-way decaying tail',
                   loc='left', color=text, fontsize=13, pad=17)
    h = np.linspace(0, 360, 721)
    rates = FLAT_RATE * (DECAY_M / (DECAY_M + h)) ** 2
    left.plot(h, rates, color=mint, linewidth=2.8)
    left.fill_between(h, rates, color=mint, alpha=.10)
    left.set_xlim(0, 360)
    left.set_xticks([0, 120, 240, 360])
    left.set_xlabel('累计尾段进度 H（百万美元）' if zh else 'Cumulative tail progress H (USD millions)',
                    color=muted, labelpad=12, fontsize=11)
    left.set_ylabel('PAPER / $1', color=muted, labelpad=8, fontsize=11)
    for x, offset in [(0, (12, 8)), (120, (10, 12)), (ILLUSTRATIVE_H_M, (-10, 18))]:
        y = tail_rate(x)
        left.scatter([x], [y], color=mint, s=35, zorder=4)
        left.annotate(f'{y:.1f}', (x, y), xytext=offset, textcoords='offset points',
                      color=mint, fontsize=12, weight='bold')
    right.set_title('② 保留历史进度后，LP 阈值出现阶跃' if zh else '02  Retained history creates a step',
                    loc='left', color=text, fontsize=13, pad=17)
    rate = tail_rate(ILLUSTRATIVE_H_M)
    # This is a state cross-section at fixed H, not a trajectory with increasing H.
    right.plot([-1, THRESHOLD_M], [FLAT_RATE, FLAT_RATE], color=amber, linewidth=2.8)
    right.plot([THRESHOLD_M, THRESHOLD_M], [FLAT_RATE, rate], color=amber, linewidth=2,
               linestyle=(0, (3, 3)))
    right.plot([THRESHOLD_M, 12], [rate, rate], color=amber, linewidth=2.8)
    right.fill_between([-1, THRESHOLD_M], FLAT_RATE, color=amber, alpha=.10)
    right.fill_between([THRESHOLD_M, 12], rate, color=amber, alpha=.10)
    right.axvline(THRESHOLD_M, color=muted, linestyle=(0, (3, 4)), linewidth=1)
    right.axvline(CAP_M, color=mint, linestyle=(0, (3, 4)), linewidth=1, alpha=.8)
    right.set_xlim(-1, 12)
    right.set_xticks([0, 2, 5, 8, 12])
    right.set_xlabel('当前 tracked LP（百万美元）' if zh else 'Current tracked LP (USD millions)',
                     color=muted, labelpad=12, fontsize=11)
    right.text(-.45, 103, '平坦段 100' if zh else 'Flat: 100', color=amber, fontsize=11)
    right.text(6.0, 22, '固定 H = $260.5M\n示意铸币率 ≈ 9.9' if zh else 'Fixed H = $260.5M\nIllustrative rate ≈ 9.9',
               color=amber, fontsize=11, linespacing=1.5)
    right.text(2.15, 85, '$2M 阈值' if zh else '$2M threshold', color=muted, fontsize=10)
    right.text(5.15, 67, '$5M 分红上限\n不是铸币折点' if zh else '$5M reward cap\nNot a mint breakpoint',
               color=mint, fontsize=10, linespacing=1.6)
    fig.text(.075, .095, '平坦段：LP < $2M 时为 100 PAPER/$；尾段：100 × [120 / (120 + H)]²（H 单位为百万美元）' if zh
             else 'Flat: 100 PAPER/$ below $2M LP. Tail: 100 × [120 / (120 + H)]², with H in USD millions.',
             color=text, fontsize=11)
    fig.text(.075, .045, '文档示例参数 · 右图固定历史 H，并非实时状态 · 分红划走 LP 不重置 H · Owner 可调整参数' if zh
             else 'Documented defaults · Fixed illustrative H, not live state · LP distributions do not reset H · Owner-adjustable parameters',
             color=muted, fontsize=10)
    output.mkdir(parents=True, exist_ok=True)
    stem = output / f'paper-mint-curve.{language}'
    metadata = {'Date': None, 'Creator': 'papertrade-research / matplotlib',
                'Description': 'Documented marginal mint-rate illustration; fixed illustrative H, not live state.'}
    svg_path = stem.with_suffix(stem.suffix + '.svg')
    fig.savefig(svg_path, facecolor=bg, metadata=metadata)
    svg_path.write_text('\n'.join(line.rstrip() for line in svg_path.read_text().splitlines()) + '\n')
    fig.savefig(stem.with_suffix(stem.suffix + '.png'), facecolor=bg, dpi=160)
    plt.close(fig)
    print(f'Rendered {language} SVG/PNG')


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
    parser.add_argument('--cjk-font', help='Installed CJK font file for the Chinese figure')
    args = parser.parse_args()
    check_values()
    if not args.check_only:
        render(args.output_dir, 'en', None)
        render_liquidation(args.output_dir, 'en', None)
        if args.cjk_font:
            render(args.output_dir, 'zh-CN', args.cjk_font)
            render_liquidation(args.output_dir, 'zh-CN', args.cjk_font)


if __name__ == '__main__':
    main()
