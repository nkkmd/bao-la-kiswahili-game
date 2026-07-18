# 全初手・全North応手 固定継続比較

生成日時: 2026-07-18T00:24:52.088Z

判定: `no-response-robust-candidate`

標準初期局面の4初手と、その直後の合法North応手全14通りを固定し、6 AI条件で終局まで継続した84局の比較である。J001の既検証24局を同一条件・seed規則の成果物から再利用し、残り60局を追加した。

## 事前固定基準

- 順位: 最悪応手でのSouth勝数、全応手合計South勝数、Phase 1順位の順
- 応手頑健性: 各応手でSouth 3/6勝以上、かつ全応手合計50%以上

## 初手順位

| 順位 | South初手 | 応手数 | 最悪応手South勝 | 合計South勝 | 合計North勝 | South率 | 判定 |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | 7番穴・右 | 4 | 2/6 | 14/24 | 10/24 | 58.3% | response-sensitive |
| 2 | 6番穴・左 | 4 | 1/6 | 11/24 | 13/24 | 45.8% | response-sensitive |
| 3 | 7番穴・左 | 2 | 1/6 | 3/12 | 9/12 | 25.0% | response-sensitive |
| 4 | 6番穴・右 | 4 | 0/6 | 7/24 | 17/24 | 29.2% | response-sensitive |

## 最悪応手

| South初手 | 最終勝敗基準の最悪North応手 | South勝 |
| --- | --- | ---: |
| 7番穴・右 | `takata:namua:0:5:right:::false` | 2/6 |
| 6番穴・左 | `capture:namua:0:5:left:right::false` | 1/6 |
| 7番穴・左 | `capture:namua:0:4:right:left::false` | 1/6 |
| 6番穴・右 | `takata:namua:0:5:left:::false` | 0/6 |

## 完全性

- 全応手局面: 14
- 統合対局: 84
- 新規対局: 60
- 再利用J001対局: 24
- 固定応手を含むreplay検証手数: 4931
- timeout: 0
- verification hash: `ab72da9337d3bf255522772931af9c057819127cc0b94d32a9cec483be0160f0`
