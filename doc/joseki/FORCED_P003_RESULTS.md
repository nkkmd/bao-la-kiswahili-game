# 強制捕獲局面P003 固定継続比較

生成日時: 2026-07-18T01:23:07.242Z

判定: `no-conditional-candidate`

P002選定時にcross-method一致を満たしたもう一つの低分岐強制捕獲局面を、P003として全4合法手で比較した。固定手直後のfrontSafetyは結果確認前に全手同値と確認した。

- node: `p8-701bf2f6430d`
- state hash: `19248f08cc4ec61b00e7e8e780cbca24f9a866b14a0298b5a8ba5ec59a1218b9`
- 合法手: 4（全手capture）
- consensus: `capture:namua:0:4:right:left::false`

## 結果

| 順位 | 捕獲手 | South勝 | consensus | 直後bao | frontSafety | North応手 | 判定 |
| ---: | --- | ---: | --- | ---: | ---: | ---: | --- |
| 1 | 3番穴・direction left・side right | 5/6 | no | 101 | 2 | 2 | screened-out |
| 2 | 5番穴・direction right・side left | 4/6 | yes | 192 | 2 | 2 | screened-out |
| 3 | 3番穴・direction right・side left | 2/6 | no | 142 | 2 | 2 | screened-out |
| 4 | 5番穴・direction left・side right | 0/6 | no | 151 | 2 | 2 | screened-out |

## 条件別勝者

| 捕獲手 | bao-d1 | bao-d2 | bao-d3 | bao-d4 | legacy-d2 | bao-v2-d2 |
| --- | --- | --- | --- | --- | --- | --- |
| 3番穴・direction left・side right | South | South | South | South | North | South |
| 5番穴・direction right・side left | South | South | South | North | North | South |
| 3番穴・direction right・side left | North | North | South | South | North | North |
| 5番穴・direction left・side right | North | North | North | North | North | North |

## 完全性

- 対局: 24
- 固定捕獲手を含むreplay検証手数: 1169
- timeout: 0
- verification hash: `7853f5b641f612356bdd6b9a68ea74175597ec8540d32ce000e39341d4307c8d`
