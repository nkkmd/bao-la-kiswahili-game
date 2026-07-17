# Bao la Kiswahili 初手・応手スクリーニング

生成日時: 2026-07-17T11:57:01.551Z

標準初期局面から2 plyを全数列挙し、相手の全合法応手に対する最悪時評価で初手を比較した。値はSouth視点のAI探索評価であり、勝率ではない。

> **Phase 7更新:** この表はPhase 1時点の短期評価順位を保存したものである。その後の全4初手継続比較では`index 5 / left`が0/6勝となり現行主要候補として`refuted`、`index 5 / right`が3/6勝で首位だが`unresolved`となった。現在の判定は[全4初手比較](FIRST_MOVE_CONTINUATIONS.md)を参照。

| 順位 | South初手 | C0最悪応手評価 | C0平均応手評価 | North最善応手 | depth上位3 | 評価方式上位3 | 状態 |
| ---: | --- | ---: | ---: | --- | ---: | ---: | --- |
| 1 | `takata:namua:0:5:left:::false` | 184.0 | 224.0 | `capture:namua:0:4:left:right::false` | 4/4 | 3/3 | screened |
| 2 | `takata:namua:0:6:left:::false` | 59.0 | 132.5 | `capture:namua:0:4:left:right::false` | 2/4 | 3/3 | screened |
| 3 | `takata:namua:0:5:right:::false` | 11.0 | 107.5 | `takata:namua:0:6:right:::false` | 3/4 | 3/3 | screened |
| 4 | `takata:namua:0:6:right:::false` | 2.0 | 146.3 | `takata:namua:0:6:right:::false` | 3/4 | 0/3 | screened |

## 完全性

- ノード: 19
- 評価結果: 228
- partial: 0
- 座席交換監査: 合格
- tree hash: `290189b74fbde08b3560f8f1f03df2cfc41916545d0df0d5530de305f77eb5b0`

## 再現コマンド

```bash
node tools/experiments/generate-joseki-tree.js --max-ply 2
node tools/experiments/evaluate-joseki-nodes.js
node tools/experiments/verify-joseki-artifacts.js
node tools/experiments/analyze-joseki-results.js
```
