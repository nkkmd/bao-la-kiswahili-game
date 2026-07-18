# P003 評価反転trace比較

生成日時: 2026-07-18T01:21:06.010Z

P003の終局首位手と探索合意手について、同じ6条件の保存局面を共通bao depth 2で再評価した。相関的な診断であり、単独の敗着を証明するものではない。

## 固定手直後

- terminal-best静的評価: 101
- consensus静的評価: 192
- terminal-best − consensus: -91

| 特徴 | terminal-best | consensus | 寄与差 |
| --- | ---: | ---: | ---: |
| maxCapture | -8 | -1 | -56 |
| houseValue | 0 | 1 | 7 |
| frontOccupied | 2 | 3 | -5 |
| relayShape | 1 | 5 | -4 |
| frontConnections | 1 | 0 | 3 |
| reserveEfficiency | 1 | 2 | -1 |

## 条件別trace

| 条件 | 固定手 | 勝者 | 初期探索値 | 初期静的値 | 最初の探索負転 | 恒久探索負転 |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| bao-d1 | consensus | South | 56 | 192 | 19 | なし |
| bao-d1 | terminal-best | South | -374 | 101 | 13 | なし |
| bao-d2 | consensus | South | 56 | 192 | 15 | なし |
| bao-d2 | terminal-best | South | -374 | 101 | 33 | なし |
| bao-d3 | consensus | South | 56 | 192 | 33 | なし |
| bao-d3 | terminal-best | South | -374 | 101 | 15 | なし |
| bao-d4 | consensus | North | 56 | 192 | 13 | 43 |
| bao-d4 | terminal-best | South | -374 | 101 | 13 | なし |
| legacy-d2 | consensus | North | 56 | 192 | 15 | 17 |
| legacy-d2 | terminal-best | North | -374 | 101 | 23 | 45 |
| bao-v2-d2 | consensus | South | 56 | 192 | 15 | なし |
| bao-v2-d2 | terminal-best | South | -374 | 101 | 33 | なし |

## 完全性

- trace: 12
- 再評価局面: 577
- 全終局state一致: yes
- summary hash: `7651f88c94b60cc2fcaeceaeab84b9f474c945cffe3bacd8c5e906fcdf54a628`
