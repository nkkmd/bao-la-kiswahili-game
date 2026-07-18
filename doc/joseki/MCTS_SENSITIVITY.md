# MCTS iteration感度試験

生成日時: 2026-07-17T15:09:45.200Z

判定: `unstable`

8 ply葉を合法手数と強制捕獲の有無で6層に分け、各層4局面をhash順で固定抽出した。同じ局面・3 seedでiterationだけを12、48、192へ変更した。

## 事前固定判定

- 192 iterationのseed完全一致率: 50.0%以上
- 12から192 iterationの改善: 20.0%以上
- timeout: 0

## 結果

| iteration | seed完全一致 | phase2一致 | 選択手平均visit |
| ---: | ---: | ---: | ---: |
| 12 | 8.3% | 29.2% | 3.32 |
| 48 | 12.5% | 31.9% | 15.47 |
| 192 | 25.0% | 31.9% | 58.19 |

seed完全一致率の改善: 16.7%

## 192 iteration 層別結果

| 層 | seed完全一致 | phase2一致 |
| --- | ---: | ---: |
| 2-4/forced-capture | 100.0% | 50.0% |
| 2-4/mixed | 25.0% | 58.3% |
| 5-7/forced-capture | 0.0% | 16.7% |
| 5-7/mixed | 0.0% | 25.0% |
| 8+/forced-capture | 0.0% | 25.0% |
| 8+/mixed | 25.0% | 16.7% |

## 完全性

- 局面: 24
- 評価: 216
- simulation: 18144
- partial: 0
- timeout: 0
- sample hash: `a91c13a9493364e2690be7c2e794978de6de1df48fed1ebfc92d9117279d56b6`
- verification hash: `f4532f85981284b35faa695bec9c88cebb41dca43e799bc465ddc0811c5b9c3d`
