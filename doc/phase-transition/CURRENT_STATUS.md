# 局面相転移点研究 — 現在地

更新日: 2026-08-02  
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

PR #26は明示的な指示があるまでドラフトのまま維持する。

## 現在の研究段階

完了済み:

- 100局`pilot-v2`探索工程
- E-010未使用seed 200局確認実験
- E-010 trajectory重複の事後感度分析
- E-010確認群7急拡大候補の形成過程・最大捕獲可能量非対称化分析
- E-011 AI条件・探索深度横断頑健性実験の事前登録・実装・formal 2000局・integrity・評価
- E-017独立構造確認実験の事前登録・実装・formal 1000局・integrity・評価
- H16 search profile依存性直接比較E-018の事前登録・実装・fixture/infrastructure検証
- E-018固有formal開始承認、fixed-local execution lock、formal 4000局、analyze、integrity、evaluate
- E-018 H16 formal confirmation

現在の正式判定:

- E-010: **`not-confirmed`**
- E-011: **`inconclusive`**
- E-017: **`not-confirmed`**
- E-018: **`confirmed`**

E-010/E-011/E-017/E-018の判定は固定し、結果後に閾値、primary endpoint、decision ruleを変更しない。

## 主要な確定事項

### 探索群

- 100局、5650観測、421強制捕獲レジーム
- A候補15区間、13アーキタイプ
- 捕獲分岐急拡大は候補33.3%、対照2.9%、RR約11.46
- forcing解除前兆は終局近傍効果として再分類
- 捕獲分岐急拡大は即時大量捕獲ではなく、後続局面の捕獲選択肢形成として扱う

## E-010 未使用seed確認

事前登録条件:

- 200局、seed `20261001–20261200`
- primary population: `pliesRemaining >= 9`
- 主解析A候補12件以上
- 急拡大候補5件以上
- 主解析対照5000件以上
- RR 3以上
- 候補率 > 対照率

結果:

| 指標 | 結果 |
|---|---:|
| 主解析A候補 | 11 |
| 急拡大候補 | 7 |
| 主解析対照 | 8424 |
| 候補急拡大率 | 63.64% |
| 対照急拡大率 | 2.96% |
| RR | 21.53 |

正式判定: **`not-confirmed`**

最低主解析候補12件に対して11件。結果後に11へ緩和しない。

trajectory-ply事後感度:

- unique candidates: 5
- unique expansion: 2
- unique controls: 7061
- dedup candidate rate: 40.00%
- dedup control rate: 3.09%
- dedup RR: 12.96
- largest duplicate group: 6

生の7 expansion候補を7独立構造とは解釈しない。

## E-011 AI条件・探索深度横断頑健性

固定条件:

- 5条件×400局、2000局
- shared seed `20262001–20262400`
- primary population `pliesRemaining >= 9`

| 条件 | evaluator | search | depth | A候補 | expansion | controls | RR | status |
|---|---|---|---:|---:|---:|---:|---:|---|
| C0 | bao | phase2 | 2 | 16 | 9 | 16395 | 19.09 | `pass` |
| C1 | bao | phase2 | 1 | 15 | 2 | 15679 | 6.49 | `insufficient` |
| C2 | bao | phase2 | 3 | 12 | 3 | 15801 | 14.26 | `insufficient` |
| C3 | bao-v2 | phase2 | 2 | 19 | 11 | 16437 | 20.08 | `pass` |
| C4 | bao | legacy | 2 | 8 | 0 | 15412 | 0.00 | `insufficient` |

formal integrity: `valid: true`  
formal global decision: **`inconclusive`**

trajectory-ply感度:

| 条件 | unique candidates | unique expansion | unique controls | dedup RR |
|---|---:|---:|---:|---:|
| C0 | 8 | 2 | 12185 | 7.87 |
| C1 | 13 | 2 | 11407 | 7.31 |
| C2 | 10 | 2 | 11695 | 10.98 |
| C3 | 11 | 4 | 12160 | 11.70 |
| C4 | 6 | 0 | 11412 | 0.00 |

phase2 C0–C3では重複除去後も候補側濃縮方向が維持された。legacy C4では生・重複除去後ともexpansion候補0。ただしC4はavailability不足であり、E-011自体をsearch profile依存性の確定証明へ読み替えない。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-01-e011-formal-completion.md`

## E-017 独立構造確認

### 固定条件

- 1000局
- seed `20263001–20264000`
- `hard / bao / phase2 / depth 2`
- primary population: `pliesRemaining >= 9`
- primary unit: unique `trajectoryHash + eventPly`

成功条件:

- raw primary candidates >= 30
- unique candidate trajectory-ply >= 15
- unique candidate trajectories >= 12
- unique expansion trajectory-ply >= 5
- unique expansion trajectories >= 5
- unique control trajectory-ply >= 30000
- dedup RR >= 3
- dedup candidate rate > control rate

### Formal integrity

固定ローカルでformal 1000局を完了し、`verify`は次を確認した。

- observations: 56294
- games: 1000
- exact seed sequence: true
- unique game IDs: true
- all trajectory hashes present: true
- source commit matches execution lock: true
- lock preregistration/policy hash present: true
- errors: `[]`
- mode: `formal`
- valid: `true`

### Formal result

Raw endpoint:

| 指標 | 結果 |
|---|---:|
| candidates | 53 |
| expansion | 37 |
| controls | 40956 |
| control expansion | 1235 |
| candidate rate | 69.81% |
| control rate | 3.02% |
| RR | 23.15 |

Trajectory-ply deduplicated:

| 指標 | 結果 |
|---|---:|
| unique candidates | 21 |
| unique expansion | 9 |
| unique candidate trajectories | 19 |
| unique expansion trajectories | 9 |
| unique controls | 23306 |
| control expansion | 727 |
| candidate rate | 42.86% |
| control rate | 3.12% |
| RR | 13.74 |
| largest duplicate multiplicity | 24 |

criteria照合:

- raw candidates >=30: pass
- unique candidate trajectory-ply >=15: pass
- unique candidate trajectories >=12: pass
- unique expansion trajectory-ply >=5: pass
- unique expansion trajectories >=5: pass
- unique control trajectory-ply >=30000: **fail (23306)**
- dedup RR >=3: pass
- candidate rate > control rate: pass

formal decision: **`not-confirmed`**

唯一の不通過はunique control trajectory-ply。`30000`を結果後に`23306`へ緩和しない。強い効果方向、dedup RR 13.74、9固有expansion trajectoryを理由に`confirmed`へ読み替えない。

一方、独立seed blockでも構造的一般性を伴う候補側濃縮方向が再観測されたことは、formal判定と分けて記録する。

formal evaluation出力の`preregistrationStatus: preregistered-not-run`はconfig由来の古い状態文字列であり、formal実行状態の正本ではない。execution lockとformal integrity `mode=formal / valid=true`を正本とする。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-02-e017-formal-completion.md`

## E-018 H16 search profile依存性直接比較

H16:

> 捕獲分岐急拡大の顕在化はsearch profileに依存する。

E-011 C4のlegacy 0 expansionは示唆的だがavailability不足だったため、E-011を再解釈せず新規独立実験E-018として事前登録した。

### 固定設計

- P2: `hard / bao / phase2 / depth 2`
- LG: `hard / bao / legacy / depth 2`
- 2000局 / condition
- total 4000局
- shared seed `20265001–20267000`
- same seed / same random-opening boundaryをpair
- primary population: `pliesRemaining >= 9`
- primary unit: paired shared-seed game
- endpoint: eligible category-A `capture-branch-expansion` candidateがゲーム内に1件以上あるか
- test: two-sided exact McNemar
- alpha: 0.05
- minimum discordant pairs: 20
- direction requirement: `n10 > n01`

legacy側に最低expansion件数を要求しない。legacyで0件または極低率になること自体がH16と整合し得るため、E-011と同じavailability trapを持ち込まない。

`trajectoryHash + eventPly`によるprofile別構造比較、candidate/control RR、P2/LG候補率Fisher exactは副次解析で、primary McNemar判定を置き換えない。

### Fixed-local execution

- locked source commit: `1f6b129b9b3cb11580244b1d4c337c067289cfdb`
- preregistration SHA-256: `17fb28bf250d2218b91d5d6196ec58ac7ba0c8b8d2ced93d498135ea669e4298`
- execution-policy SHA-256: `b1bd2769877989a236f24576ea8e11070fbe573f4f7a92b9c56d3f998b1b9653`
- Node.js: `v24.6.0`
- platform: Linux / WSL2
- Python venv: `/home/oruorane/.venvs/bao-phase-transition-e011`
- activation: `source ~/.venvs/bao-phase-transition-e011/bin/activate`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`

formal run中、runnerの進捗表示仕様を確認するためP2 60局完了時点で一度`Ctrl+C`中断した。同一execution lock、source、config、seedのまま、atomic-write済みgameを検証再利用するresume contractで再開し、4000局を完了した。科学条件は変更していない。

### Formal integrity

- P2: 2000 games / 110985 observations
- LG: 2000 games / 115785 observations
- both conditions present: true
- unique condition config hashes: true
- common source commit: true
- source commit matches lock: true
- exact paired seed sequence: true
- paired opening hashes: true
- condition identity clean: true
- trajectory hashes present: true
- execution mode correct: true
- lock preregistration/policy hash checks: pass
- artifact verification: true
- errors: `[]`
- mode: `formal`
- **valid: true**

### Primary formal result

| endpoint | count |
|---|---:|
| `n00` | 1928 |
| `n01` LG-only | 9 |
| `n10` P2-only | 63 |
| `n11` | 0 |
| discordant pairs | 72 |

- P2 event-game rate: 63/2000 = **3.15%**
- LG event-game rate: 9/2000 = **0.45%**
- paired risk difference: **+2.70 percentage points**
- discordant odds ratio: **7.0**
- exact McNemar two-sided p: **`4.1812279092751445e-11`**

criteria:

- exact pair count: pass
- minimum discordant pairs >=20: pass (72)
- p <=0.05: pass
- P2-only > LG-only: pass (63 > 9)

formal decision: **`confirmed`**

H16は、E-018の固定`hard / bao / depth 2`、paired same-opening designにおける`phase2`対`legacy`の範囲で正式確認された。

### Structural secondary

P2:

- raw eligible candidates / expansion: 107 / 63
- controls / expansion: 80579 / 2449
- raw RR: 19.37
- unique candidate trajectory-ply / expansion: 34 / 11
- unique candidate / expansion trajectories: 32 / 11
- dedup RR: 10.12
- largest multiplicity: 37

LG:

- raw eligible candidates / expansion: 54 / 9
- controls / expansion: 77567 / 1283
- raw RR: 10.08
- unique candidate trajectory-ply / expansion: 31 / 7
- unique candidate / expansion trajectories: 30 / 7
- dedup RR: 13.43
- largest multiplicity: 5

P2対LG candidate trajectory-ply direct comparison:

- 11/34 vs 7/31
- risk difference: +9.77 percentage points
- RR: 1.43
- Fisher exact two-sided p: `0.41837226457118804`

Fisher比較はsecondaryであり、p>0.05を理由にprimary `confirmed`を変更しない。

### 解釈境界

確認されたのは固定`hard / bao / depth 2`条件でのsearch profile差である。全evaluation profile、全depth、別search implementation、trajectory-ply副次比較自体の有意差へ自動一般化しない。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-02-e018-formal-completion.md`

## 次工程

1. E-010 `not-confirmed`、E-011 `inconclusive`、E-017 `not-confirmed`、E-018 `confirmed`を固定する。
2. E-018 primary endpoint、McNemar rule、解釈境界を結果後に変更しない。
3. H16を他のevaluation profile/depth/search implementationへ一般化する場合は、E-018と分離した新規事前登録実験として設計する。
4. PR #26は明示的な指示があるまでopen / draftを維持する。

## 研究データ識別情報

### 探索群

- studyVersion: `0.4.1`
- games: 100

### E-010

- studyVersion: `0.4.1`
- games: 200
- seed: `20261001–20261200`
- formal decision: `not-confirmed`

### E-011

- studyVersion: `0.4.1`
- games: 2000
- seed: `20262001–20262400`
- formal integrity: valid
- formal decision: `inconclusive`

### E-017

- studyVersion: `0.4.1`
- games: 1000
- seed: `20263001–20264000`
- formal integrity: valid
- formal decision: `not-confirmed`

### E-018

- studyVersion: `0.4.1`
- games: 4000
- seed: `20265001–20267000`
- formal integrity: valid
- formal decision: `confirmed`
- locked source commit: `1f6b129b9b3cb11580244b1d4c337c067289cfdb`
