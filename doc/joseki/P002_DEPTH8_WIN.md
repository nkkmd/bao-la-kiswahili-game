# P002 depth 8 強制勝ち系列の検証

生成日時: 2026-07-18T01:45:26.633Z

phase2・bao・depth 8・quiescence depth 1が返した勝ちスコアを主変化として再構成し、全着手を再適用した。これは現在の探索実装内の検証であり、独立実装によるゲーム理論的証明ではない。

- root score: 999991
- 探索ply: 8
- quiescence ply: 1
- 終局: South勝、front-empty
- North主変化応手は全て1択: yes

| ply | 手番 | 残depth | 合法手 | 着手 | root値 |
| ---: | --- | ---: | ---: | --- | ---: |
| 1 | South | 8 | 2 | `capture:namua:0:2:right:left::false` | 999991 |
| 2 | North | 7 | 1 | `capture:namua:0:0:right:left::false` | -999992 |
| 3 | South | 6 | 5 | `capture:namua:0:4:right:left::false` | 999993 |
| 4 | North | 5 | 1 | `capture:namua:0:1:right:left::false` | -999994 |
| 5 | South | 4 | 8 | `takata:namua:0:1:right:::false` | 999995 |
| 6 | North | 3 | 1 | `capture:namua:0:1:right:left::false` | -999996 |
| 7 | South | 2 | 2 | `capture:namua:0:5:right:left::false` | 999997 |
| 8 | North | 1 | 1 | `capture:namua:0:1:right:left::false` | -999998 |
| 9 | South | q | 1 | `capture:namua:0:7:left:right::false` | terminal |

## 解釈

- P002の探索合意手は、depth 8では単に静的評価が高いだけでなく、探索器が9 ply以内の終局勝ちを検出している。
- 3/6勝だった固定自己対局は、この強制勝ちを常に実現できていない。自己対局勝数を手の真の優劣と同一視できない。
- P002を事後的に定石へ昇格はしない。候補基準は変更せず、保存自己対局がどこで勝ち系列から外れたかを下で比較する。

## 保存自己対局との比較

| 条件 | 勝者 | 共通prefix | 分岐ply | 強制勝ち側 | 実際 |
| --- | --- | ---: | ---: | --- | --- |
| bao-d1 | North | 4 | 5 | `takata:namua:0:1:right:::false` | `takata:namua:0:5:left:::false` |
| bao-d2 | North | 2 | 3 | `capture:namua:0:4:right:left::false` | `capture:namua:0:5:left:right::false` |
| bao-d3 | South | 9 | なし | — | — |
| bao-d4 | South | 9 | なし | — | — |
| legacy-d2 | South | 2 | 3 | `capture:namua:0:4:right:left::false` | `capture:namua:0:5:left:right::false` |
| bao-v2-d2 | North | 2 | 3 | `capture:namua:0:4:right:left::false` | `capture:namua:0:5:left:right::false` |

bao-d3・d4は全9手を一致してSouth勝となった。敗戦条件は3手目または5手目のSouth着手で系列から外れており、固定した合意初手自体ではなく、その後の浅い方策が勝ち筋を維持できなかった。legacy-d2は3手目で外れても別経路で勝つため、この主変化だけが唯一の勝ち筋とは断定しない。

## 完全性

- final state hash: `55c1218fdb22abb6e7e1ac2a5c69a229ba6fbab82f419da28dc7f4f5925dfbe9`
- line hash: `5605a0fca5edee794d601ffc5235fa3368e4cefbbccf99dd539e84e523335f38`
