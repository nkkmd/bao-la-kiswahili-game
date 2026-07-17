# 8 ply局面パターン

生成日時: 2026-07-17T23:00:00.920Z

候補木の全8 ply葉について、C0（bao depth 2）評価、6 phase2条件の推奨手、3 seed短時間MCTSを局面特徴別に横断集計した。相関と群差は記述統計であり、因果関係や理論的価値を示さない。

## 分岐数 × 強制捕獲

| 分類 | 局面 | C0中央値 | C0正値率 | phase2全条件一致 | MCTS seed一致 | MCTS/C0一致 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2-4/forced-capture | 517 | 198.00 | 89.2% | 34.0% | 15.5% | 35.4% |
| 2-4/mixed | 23 | 188.00 | 78.3% | 21.7% | 21.7% | 36.2% |
| 5-7/forced-capture | 505 | 190.00 | 96.4% | 23.2% | 2.6% | 20.8% |
| 5-7/mixed | 36 | 223.00 | 94.4% | 19.4% | 0.0% | 19.4% |
| 8+/forced-capture | 96 | 242.50 | 100.0% | 16.7% | 2.1% | 11.5% |
| 8+/mixed | 8 | 306.00 | 100.0% | 0.0% | 0.0% | 20.8% |
| forced-move/forced-capture | 65 | 170.00 | 83.1% | 100.0% | 100.0% | 100.0% |
| terminal/mixed | 2 | n/a | n/a | 100.0% | 100.0% | 100.0% |

## nyumba所有状態

| 分類 | 局面 | C0中央値 | C0正値率 | phase2全条件一致 | MCTS seed一致 | MCTS/C0一致 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| both-owned | 128 | 221.00 | 85.2% | 28.1% | 25.8% | 40.9% |
| neither-owned | 589 | 180.00 | 91.1% | 34.3% | 12.2% | 29.6% |
| north-only | 84 | 98.50 | 89.3% | 28.6% | 10.7% | 32.9% |
| south-only | 451 | 234.00 | 97.3% | 27.9% | 11.8% | 28.5% |

## C0評価との相関

| 指標 | Pearson | Spearman |
| --- | ---: | ---: |
| legalMoveCount | -0.01 | 0.07 |
| boardSeedDifference | 0.09 | 0.53 |
| frontSeedDifference | 0.10 | 0.45 |
| nyumbaSeedDifference | 0.05 | 0.27 |

## 反例候補

### 低分岐・強制捕獲でもMCTS seedが割れる局面

- `p8-79d29d74d887`: C0 -292, 合法手 2, south-only, MCTS seed一致 no
- `p8-0badb5a5d715`: C0 -229, 合法手 3, neither-owned, MCTS seed一致 no
- `p8-68335396cf38`: C0 -213, 合法手 3, neither-owned, MCTS seed一致 no
- `p8-53f765db8822`: C0 -199, 合法手 4, neither-owned, MCTS seed一致 no
- `p8-be7028396a99`: C0 -190, 合法手 3, neither-owned, MCTS seed一致 no

### 高分岐でもMCTS seedが一致する局面

- `p8-bd5b15ec5fb2`: C0 353, 合法手 9, neither-owned, MCTS seed一致 yes
- `p8-32fcce6381fc`: C0 204, 合法手 8, south-only, MCTS seed一致 yes

### South nyumba維持中でもC0が負の局面

- `p8-dda61072c13d`: C0 -302, 合法手 2, both-owned, MCTS seed一致 no
- `p8-79d29d74d887`: C0 -292, 合法手 2, south-only, MCTS seed一致 no
- `p8-91667505a398`: C0 -218, 合法手 2, both-owned, MCTS seed一致 no
- `p8-90bf3495da55`: C0 -191, 合法手 1, south-only, MCTS seed一致 yes
- `p8-b33cdef1a518`: C0 -146, 合法手 2, both-owned, MCTS seed一致 no

### South nyumba喪失後でもC0が正の局面

- `p8-57aeef53f0ca`: C0 999999, 合法手 2, neither-owned, MCTS seed一致 yes
- `p8-17176e5b24a1`: C0 605, 合法手 2, neither-owned, MCTS seed一致 yes
- `p8-c1f65bf10696`: C0 605, 合法手 2, neither-owned, MCTS seed一致 yes
- `p8-bc84ac6a8a62`: C0 548, 合法手 8, neither-owned, MCTS seed一致 no
- `p8-f0f42663f63e`: C0 548, 合法手 8, neither-owned, MCTS seed一致 no

## 完全性

- tree hash: `ab4d564df61213cdcc97a37d969bc2d3f33aa9dae9f3cc0a78848f303b8074fa`
- 局面: 1252（C0評価あり 1250）
- Phase 4 verification hash: `d962e21c278aca860f9c0ebf35c8370613395ba2205a3f138302307d24693d68`
- MCTS verification hash: `8c2507cacfcf0cd85e0132c0b26f444ce3eb7c10fc465c78be1e47fd6f27952e`
- analysis hash: `5f3e6ab8c84ae5f124ed73fdf0cb0d852ae33bb9ef93d9bf69dbe0856abd677b`
