# J001 全North応手固定継続

生成日時: 2026-07-17T23:58:58.715Z

判定: `response-sensitive`

J001（South 6番穴・右）の直後にNorthが指せる4応手を一つずつ固定し、同じ6 AI条件を両側へ適用して最大120 plyまで継続した。決定論的な応手感度スクリーニングであり、昇格判定や人間勝率ではない。

## 事前固定基準

- 24局すべてが終局し、保存最終局面まで再生一致
- 各応手でSouth 3/6勝以上
- 全体でSouth 12/24勝以上

## 応手別結果

| North応手 | South勝 | North勝 | 打切り | 平均終局ply |
| --- | ---: | ---: | ---: | ---: |
| 6番穴・左 | 0 | 6 | 0 | 54.0 |
| 7番穴・右 | 1 | 5 | 0 | 59.8 |
| 7番穴・左 | 2 | 4 | 0 | 66.0 |
| 6番穴・右 | 4 | 2 | 0 | 59.7 |

## 条件別勝者

| North応手 | bao-d1 | bao-d2 | bao-d3 | bao-d4 | legacy-d2 | bao-v2-d2 |
| --- | --- | --- | --- | --- | --- | --- |
| 6番穴・左 | North | North | North | North | North | North |
| 7番穴・右 | South | North | North | North | North | North |
| 7番穴・左 | South | North | South | North | North | North |
| 6番穴・右 | South | South | South | North | North | South |

## 条件別応手耐性

| 条件 | South勝応手数 | North勝応手数 | 全応手でSouth勝 | Phase 1最悪応手 |
| --- | ---: | ---: | --- | --- |
| bao-d1 | 3 | 1 | no | `takata:namua:0:5:right:::false` |
| bao-d2 | 1 | 3 | no | `takata:namua:0:6:right:::false` |
| bao-d3 | 2 | 2 | no | `takata:namua:0:6:left:::false` |
| bao-d4 | 0 | 4 | no | `takata:namua:0:6:right:::false` |
| legacy-d2 | 0 | 4 | no | `takata:namua:0:6:right:::false` |
| bao-v2-d2 | 1 | 3 | no | `takata:namua:0:6:right:::false` |

## 判定

- 全局終局・再生一致: yes
- 各応手3/6勝以上: no
- 全体12/24勝以上: no
- 合計: South 7勝、North 17勝、打切り 0

## 完全性

- 対局: 24
- 固定応手を含むreplay検証手数: 1413
- timeout: 0
- verification hash: `ac7a963a3dc95b98f2cab301beaccee7594c693334ada49d28619be68ae5326f`
