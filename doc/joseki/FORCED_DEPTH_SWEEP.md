# P002・P003 探索depth sweep

生成日時: 2026-07-18T01:44:34.426Z

判定: `no-terminal-best-switch-through-completed-depth`

P002・P003の正確な局面をphase2・bao・quiescence depth 1でdepth 1〜8まで反復深化し、終局首位手へ推奨が切り替わるかを調べた。候補値差はterminal-best − consensusで、負値は探索が合意手を支持することを示す。

ここで`terminal-best`は実験開始時に固定した内部名であり、6条件の近似自己対局勝数首位手を指す。ゲーム理論的な最善手を意味しない。

| 局面 | depth | 状態 | 推奨 | root値 | 候補値差 | nodes | ms |
| --- | ---: | --- | --- | ---: | ---: | ---: | ---: |
| P002 | 1 | complete | consensus | 356 | n/a | 7 | 19.7 |
| P002 | 2 | complete | consensus | 605 | -323 | 26 | 61.5 |
| P002 | 3 | complete | consensus | 474 | -459 | 67 | 110.3 |
| P002 | 4 | complete | consensus | 545 | -291 | 177 | 283.2 |
| P002 | 5 | complete | consensus | 439 | -520 | 363 | 588.3 |
| P002 | 6 | complete | consensus | 542 | -296 | 790 | 1693.3 |
| P002 | 7 | complete | consensus | 542 | -588 | 1568 | 4078.7 |
| P002 | 8 | complete | consensus | 999991 | -999716 | 3223 | 8431.5 |
| P003 | 1 | complete | consensus | -6 | n/a | 19 | 11.7 |
| P003 | 2 | complete | consensus | 240 | -427 | 53 | 58.8 |
| P003 | 3 | complete | consensus | 56 | -430 | 105 | 155.5 |
| P003 | 4 | complete | consensus | 335 | -448 | 215 | 384.9 |
| P003 | 5 | complete | consensus | 88 | -416 | 418 | 1258.3 |
| P003 | 6 | complete | consensus | 272 | -312 | 831 | 2474.1 |
| P003 | 7 | complete | consensus | 7 | -274 | 1587 | 6140.0 |
| P003 | 8 | complete | consensus | 255 | -220 | 3295 | 18074.8 |

## 到達点

- P002: 最深完了depth 8、terminal-best切替 なし、timeout なし
- P003: 最深完了depth 8、terminal-best切替 なし、timeout なし

切替がない場合も、最深完了depthより先を否定するものではない。depth増加時の候補値差と計算量を次の延長判断に使う。

## 完全性

- 記録: 16/16
- 既存depth 1〜4一致: 8
- timeout: 0
- verification hash: `1ec406f452a9b3972f27d999ad85fc2341ad04cf4c146ece72cd1a9d7ccfb1a3`
