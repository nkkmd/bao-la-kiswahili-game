# 局面相転移点研究 — 現在地

更新日: 2026-07-31  
Status: Active  
研究計画: `doc/PHASE_TRANSITION_RESEARCH_PLAN.md`

## 恒久運用ルール

再開指示は研究続行と工程完了時の研究台帳更新を含む。過去結果は黙って上書きせず、解釈変更の理由・根拠・影響を記録する。

必須更新対象:

- `CURRENT_STATUS.md`
- `RESEARCH_LOG.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `HYPOTHESES.md`
- 必要に応じて `checkpoints/`

## 現在の研究段階

100局 `pilot-v2` の探索工程、未使用seed 200局によるE-010事前登録確認実験、およびE-011 AI条件・探索深度横断頑健性実験の事前登録まで完了した。

E-011は未実施であり、次工程はmulti-condition runnerと検証器の実装である。

## 現時点で確定したこと

- 探索用100局ではA 15区間、13アーキタイプ、5650観測、421レジーム。
- 捕獲分岐急拡大は探索群で候補33.3%、対照2.9%、約11.46倍。
- forcing解除前兆は終局近傍効果であり、独立した戦略転移分類としては撤回した。
- 捕獲分岐急拡大は即時大量捕獲ではなく、後続局面の捕獲選択肢形成として扱う。
- E-010未使用seed確認実験では効果方向と大きさは再現したが、事前登録した最低主解析候補数に1件届かず、正式判定は `not-confirmed`。
- E-010の成功条件は結果後に変更しない。
- E-011ではE-010の検出・分類閾値と終局除外条件を固定し、評価器、探索実装、maxDepthだけを一要因ずつ変更する。
- 主要候補の正式な戦略的相転移認定は引き続き保留する。

## E-010 未使用seed確認実験

### 事前登録

- 200局
- base seed: `20261001`
- seed範囲: `20261001–20261200`
- 主解析: 終局まで9ply以上
- `expansionDelta=3`
- `persistenceFraction=0.5`
- 後続窓8ply

成功条件:

- 主解析A候補12件以上
- 急拡大候補5件以上
- 対照点5000件以上
- 候補／対照リスク比3以上
- 候補率が対照率を上回る

### 結果

| 指標 | 結果 | 条件 |
|---|---:|---:|
| 主解析A候補 | 11 | 12以上 |
| 急拡大候補 | 7 | 5以上 |
| 主解析対照 | 8424 | 5000以上 |
| 候補急拡大率 | 63.64% | — |
| 対照急拡大率 | 2.96% | — |
| リスク比 | 21.53 | 3以上 |

判定: `not-confirmed`

失敗した条件は主解析A候補数のみで、11件と事前固定した12件を1件下回った。急拡大件数、対照数、効果方向、リスク比はすべて基準を通過した。

## E-011 AI条件・探索深度横断頑健性実験

### 事前登録

- 5条件
- 各条件400局、合計2000局
- shared base seed: `20262001`
- shared seed範囲: `20262001–20262400`
- 同一seedのランダム開局を条件間で共有
- 正式実行は固定ローカル環境で逐次実行
- GitHub Actionsで正式2000局は実行しない

| 条件 | 変更要因 | evaluator | search | maxDepth |
|---|---|---|---|---:|
| C0 | 基準 | bao | phase2 | 2 |
| C1 | depth低下 | bao | phase2 | 1 |
| C2 | depth増加 | bao | phase2 | 3 |
| C3 | 評価器変更 | bao-v2 | phase2 | 2 |
| C4 | 探索実装変更 | bao | legacy | 2 |

固定条件:

- category `A`
- `signalThreshold=2.0`
- `persistenceThreshold=0.75`
- `pliesRemaining >= 9`
- `expansionDelta=3`
- `persistenceFraction=0.5`
- `eventWindow=8`
- `controlExclusionBuffer=8`

条件別成功条件:

- 主解析A候補12件以上
- 急拡大候補5件以上
- 主解析対照10000件以上
- リスク比3以上
- 候補率が対照率を上回る

E-010の11候補/200局を用いたPoisson近似では、400局で12候補以上を得る確率は約99.24%。これはE-011のサンプル数設計だけに使用し、E-010の判定は変更しない。

事前登録ファイル:

- `config/experiments/phase-transition-robustness-v1.json`
- `doc/phase-transition/checkpoints/2026-07-31-ai-depth-robustness-preregistration.md`

## 解釈

- 捕獲分岐急拡大の効果方向は未使用seedでも強く再現した。
- ただし事前登録判定を結果後に緩和しないため、E-010は確認成功とは扱わない。
- 結果は「実質的再現だが、事前登録上は未確認」と記録する。
- E-011はAI・探索条件への頑健性を検証する独立実験であり、E-010の再判定には使わない。

## 再現情報

### E-010

- analysisVersion: `11-unused-seed-confirmation`
- configHash: `5476e77676800c40b90953ea07359d31f2bc47decd0fadd1105070d4367cbce7`
- validated commit: `92c0ffa2354130cb43cdffc309587035be89939f`
- Actions run: `30630007008`
- artifact digest: `sha256:c1938edabbfd0a4ac39e3a5b8395bdc049dd795c52c38ea568dce0ae9c4160e3`

### E-011

- analysisVersion: `12-ai-depth-robustness`
- status: `preregistered / not-run`
- games: `400 × 5 conditions`
- seed range: `20262001–20262400`
- preregistration config: `config/experiments/phase-transition-robustness-v1.json`

## 次工程

1. E-011のmulti-condition runner、検証器、回帰テストを実装する。
2. 短いfixtureで条件ID、seed共有、config hash分離を監査する。
3. 固定ローカル環境でE-011の400局×5条件を逐次実行する。
4. E-010の候補11件と急拡大7件をアーキタイプ単位でも要約する。
5. 最大捕獲可能量の非対称化が未使用seed急拡大候補でも再現するか副次分析する。
6. 独立追加seed確認実験の必要サンプル数を別登録する。

## 研究データ識別情報

### 探索群

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- games: 100

### E-010確認群

- studyVersion: `0.4.1`
- configHash: `5476e77676800c40b90953ea07359d31f2bc47decd0fadd1105070d4367cbce7`
- games: 200

### E-011頑健性群

- studyVersion: `0.4.1`
- configHash: 未生成
- games: 400/condition
- conditions: C0–C4
