# E-010 未使用seed確認実験チェックポイント

日付: 2026-07-31  
analysisVersion: `11-unused-seed-confirmation`

## 事前登録

- games: 200
- base seed: `20261001`
- seed range: `20261001–20261200`
- primary population: `pliesRemaining >= 9`
- expansionDelta: 3
- persistenceFraction: 0.5
- eventWindow: 8

成功条件:

- primary candidates >= 12
- expansion candidates >= 5
- primary controls >= 5000
- risk ratio >= 3
- candidate rate > control rate

## 結果

| 指標 | 結果 | 通過 |
|---|---:|---|
| 主解析候補 | 11 | いいえ |
| 急拡大候補 | 7 | はい |
| 主解析対照 | 8424 | はい |
| 候補急拡大率 | 63.64% | — |
| 対照急拡大率 | 2.96% | — |
| リスク比 | 21.53 | はい |
| 候補率 > 対照率 | true | はい |

正式判定: `not-confirmed`

## 解釈

効果方向と大きさは未使用seedで強く再現した。しかし、事前登録した最低主解析候補12件に対して11件であり、確認成功とはしない。結果後に成功条件を緩和しない。

研究上の表現は次に固定する。

> 捕獲分岐急拡大の候補群への濃縮は未使用seedで実質的に再現したが、E-010は事前登録上not-confirmedである。

## 入力契約修正

初回判定器は候補と対照を同一CSVから読む設計だったが、実際の分析出力は以下へ分離される。

- `candidate-control-metrics.csv`
- `control-point-metrics.csv`

二入力契約へ修正した。閾値、成功条件、seed、サンプル数は変更していない。

## 再現情報

- preregistration commit: `a3c07b14f4b01459f790d0eec38c4a341594f47e`
- evaluator fix commit: `ff7337aa0b2a014676222754d5b99e6fe9ac332a`
- workflow fix commit: `92c0ffa2354130cb43cdffc309587035be89939f`
- Actions run: `30630007008`
- artifact: `phase-transition-confirmation-v1`
- artifact digest: `sha256:c1938edabbfd0a4ac39e3a5b8395bdc049dd795c52c38ea568dce0ae9c4160e3`
- confirmation configHash: `5476e77676800c40b90953ea07359d31f2bc47decd0fadd1105070d4367cbce7`

## 次工程

1. E-011 AI条件・探索深度横断の頑健性実験を事前登録する。
2. 確認群急拡大7件の形成過程を副次分析する。
3. 独立追加確認実験のサンプル数を設計する。
