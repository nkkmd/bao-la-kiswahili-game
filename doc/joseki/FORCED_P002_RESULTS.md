# 強制捕獲局面P002 固定継続比較

生成日時: 2026-07-18T00:54:54.581Z

判定: `no-conditional-candidate`

MCTS感度試験の2〜4手・強制捕獲層から、phase2全6条件と192 iteration MCTS全3 seedが同じ手を選ぶ局面を抽出し、合法手最少・node ID順で代表を固定した。

- node: `p8-c1f65bf10696`
- state hash: `5a8aac4659368e29d2788d9375a48a08694b15e42f14dd357d5eb3f389eb6eaf`
- 合法手: 2（全手capture）
- consensus: `capture:namua:0:2:right:left::false`
- South静的bao評価: 187

## 事前固定基準

- 6条件のSouth勝数が単独または同率首位
- 4/6勝以上
- 首位手が既存phase2・MCTS consensusと同じ
- 昇格には候補後の全合法相手応手固定試験が必要

## 結果

| 順位 | 捕獲手 | South勝 | North勝 | consensus | 判定 |
| ---: | --- | ---: | ---: | --- | --- |
| 1 | 3番穴・direction left・side right | 5 | 1 | no | screened-out |
| 2 | 3番穴・direction right・side left | 3 | 3 | yes | screened-out |

## 条件別勝者

| 捕獲手 | bao-d1 | bao-d2 | bao-d3 | bao-d4 | legacy-d2 | bao-v2-d2 |
| --- | --- | --- | --- | --- | --- | --- |
| 3番穴・direction left・side right | South | South | North | South | South | South |
| 3番穴・direction right・side left | North | North | South | South | South | North |

## 完全性

- 対局: 12
- 固定捕獲手を含むreplay検証手数: 502
- timeout: 0
- verification hash: `e8cb32bc6c724ca39d6b6b2868b498cc3ab09e8d247136bcf29e086c0eb32097`
