# 条件付き局面P001 第3手比較

生成日時: 2026-07-18T00:37:26.550Z

判定: `no-conditional-candidate`

対象系列はSouth 7番穴・右、North 6番穴・右。正確な2 ply局面からSouthの合法第3手4通りを固定し、6 AI条件で終局まで継続した。

- 開始state hash: `10316a873e4d70c19cf34afc0f3736c4971e772772dae4aa2caa5f97df4d67a5`
- South静的bao評価: -3
- reserve: 21 / 21
- 前列石: 9 / 10
- nyumba: 6 / 6

## 事前固定基準

- South勝数が単独または同率首位
- 6条件中4勝以上
- 昇格には候補後の全合法North第4手固定試験が必要

## 第3手順位

| 順位 | South第3手 | South勝 | North勝 | 自然推奨条件数 | 判定 |
| ---: | --- | ---: | ---: | ---: | --- |
| 1 | 8番穴・右 | 3 | 3 | 0/6 | screened-out |
| 2 | 6番穴・左 | 2 | 4 | 5/6 | screened-out |
| 3 | 6番穴・右 | 1 | 5 | 1/6 | screened-out |
| 4 | 8番穴・左 | 1 | 5 | 0/6 | screened-out |

## 条件別勝者

| South第3手 | bao-d1 | bao-d2 | bao-d3 | bao-d4 | legacy-d2 | bao-v2-d2 |
| --- | --- | --- | --- | --- | --- | --- |
| 8番穴・右 | North | South | South | North | North | South |
| 6番穴・左 | North | North | South | North | South | North |
| 6番穴・右 | North | North | South | North | North | North |
| 8番穴・左 | North | North | South | North | North | North |

## 完全性

- 対局: 24
- 固定第3手を含むreplay検証手数: 1269
- timeout: 0
- verification hash: `7ce6ab2ddd1f7b6cd005fc0ed5143175983a951a169d440b56ecc3338958c341`
