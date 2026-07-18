# 全4初手 継続自己対局比較

生成日時: 2026-07-17T23:45:36.616Z

判定: `not-supported`

標準初期局面で合法な4初手をそれぞれ指した直後から、同一の6 AI条件を両側に適用し、最大120 plyまで継続した決定論的比較である。人間の勝率に対する統計推定ではない。

## 事前固定基準

- 相対支持: C0のSouth勝数が他の全初手以上（同率首位を含む）
- 絶対支持: C0が6条件中4勝以上

## 順位

| 順位 | 初手 | Phase 1順位 | South勝 | North勝 | 打切り | 平均終局ply |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 6番穴・右 | 3 | 3 | 3 | 0 | 60.2 |
| 2 | 7番穴・左 | 2 | 1 | 5 | 0 | 61.2 |
| 3 | 7番穴・右 | 4 | 1 | 5 | 0 | 55.5 |
| 4 | 6番穴・左 (C0) | 1 | 0 | 6 | 0 | 60.3 |

## 条件別勝者

| 初手 | bao-d1 | bao-d2 | bao-d3 | bao-d4 | legacy-d2 | bao-v2-d2 |
| --- | --- | --- | --- | --- | --- | --- |
| 6番穴・右 | South | South | North | North | North | South |
| 7番穴・左 | South | North | North | North | North | North |
| 7番穴・右 | North | North | North | North | South | North |
| 6番穴・左 (C0) | North | North | North | North | North | North |

## C0の直接比較

| 対案 | C0のみSouth勝 | 対案のみSouth勝 | 差 |
| --- | ---: | ---: | ---: |
| `takata:namua:0:5:right:::false` | 0 | 3 | -3 |
| `takata:namua:0:6:left:::false` | 0 | 1 | -1 |
| `takata:namua:0:6:right:::false` | 0 | 1 | -1 |

## 判定

- 相対支持: no
- 絶対支持: no

## 完全性

- 対局: 24
- replay検証手数: 1399
- timeout: 0
- verification hash: `7cb5632e7afd4afb759d3e0f3cd1fe9ad4bde5457daae6e3cc022d1c675a2173`
