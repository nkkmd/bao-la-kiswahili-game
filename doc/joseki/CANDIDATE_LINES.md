# 8 ply定石候補系列

生成日時: 2026-07-17T13:27:02.811Z

最有力初手を固定し、C0上位3と深度・評価方式別推奨手の和集合を8 plyまで保持した候補木をminimax集計した。評価値はSouth視点の探索値であり、勝率ではない。

## C0本線

候補評価: 38

1. `takata:namua:0:5:left:::false`
2. `capture:namua:0:4:right:left::false`
3. `capture:namua:0:2:left:right::false`
4. `capture:namua:0:4:right:left::false`
5. `capture:namua:0:4:right:left::false`
6. `capture:namua:0:2:left:right::false`
7. `capture:namua:0:0:right:left::false`
8. `capture:namua:0:4:left:right::false`

## 条件別評価

| 条件 | 候補評価 | C0本線との一致手数 |
| --- | ---: | ---: |
| bao-d1 | -162 | 2/8 |
| bao-d2 | 38 | 8/8 |
| bao-d3 | -229 | 8/8 |
| bao-d4 | 65 | 4/8 |
| legacy-d2 | 79 | 2/8 |
| bao-v2-d2 | 35 | 8/8 |

## 完全性

- ノード: 1252
- 評価結果: 7512
- partial: 0
- 座席交換監査: 合格
- tree hash: `ab4d564df61213cdcc97a37d969bc2d3f33aa9dae9f3cc0a78848f303b8074fa`
