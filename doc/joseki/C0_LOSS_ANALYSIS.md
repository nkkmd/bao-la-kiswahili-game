# C0敗着系列の評価反転分析

生成日時: 2026-07-17T23:45:42.485Z

C0（6番穴・左）後をbao-d2同士で終局まで継続し、各局面をSouth視点の深さ2探索値と静的評価値で再評価した。反転点は相関的な診断であり、単独の敗着を証明するものではない。

## 結果

- 終局: North勝、48 ply、front-empty
- 探索値の最初の正→負反転: 5 ply、139 → -43（差 -182）
- その着手: `capture:namua:0:7:left:right:stop:false`
- 静的評価の最初の正→負反転: 2 ply、98 → -67（差 -165）
- その着手: `capture:namua:0:4:left:right::false`

- 探索値が以後負のままになる反転: 25 ply、37 → -325
- その着手: `capture:namua:0:2:right:left::false`
- 静的評価が以後負のままになる反転: 36 ply、30 → -457
- 符号反転回数: 探索 13、静的評価 19

## 探索値の大幅低下

| 到達ply | 着手 | 捕獲石 | relay | 変化 |
| ---: | --- | ---: | ---: | ---: |
| 45 | `capture:mtaji:1:0:right:::false` | 2 | 1 | -881 → -999997 (-999116) |
| 39 | `capture:namua:0:4:left:right::false` | 3 | 0 | -50 → -565 (-515) |
| 21 | `capture:namua:0:6:left:right::false` | 1 | 0 | 200 → -267 (-467) |
| 23 | `capture:namua:0:3:right:left::false` | 6 | 2 | 127 → -288 (-415) |
| 43 | `capture:namua:0:2:right:left::false` | 5 | 0 | -479 → -881 (-402) |

## 反転局面でSouthに不利な静的評価要因

| 特徴 | 特徴差 | 寄与 |
| --- | ---: | ---: |
| frontSeeds | -5 | -5 |
| relayShape | -2 | -2 |
| tempo | -1 | -2 |
| boardSeeds | -1 | -1 |
| mobility | 0 | 0 |
| captureMoves | 0 | 0 |

## 解釈

- C0直後の短期評価が正でも、同一評価器の継続で勝敗へ維持されなかった。初手の頑健性判定に2〜8 ply評価だけを使うのは不十分である。
- 最大低下点は捕獲・relayと一致するが、評価差には手番交替と次手の強制性も含まれる。各着手を単独の人間的な敗着とは断定しない。
- Phase 7ではC0を定石候補から外し、全4初手比較で首位の6番穴・右を新しい未検証候補として扱う。

## 完全性

- 再生局面: 48
- trace hash: `3fde4f65cab0f616935e3e29b76b0c416d54a9df4ba218625f817d1a4073167d`
- final state一致: yes
