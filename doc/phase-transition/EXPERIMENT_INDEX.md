# 局面相転移点研究 — 実験索引

更新日: 2026-08-02

| ID | 実験 | 入力 | 実行コード / Notebook | 主出力 | 状態 |
|---|---|---|---|---|---|
| E-001 | Phase 0 fixture監査 | 固定fixture | `01-data-audit.ipynb` | 欠損・重複・hash監査 | 完了 |
| E-002 | pilot-v2生成 | 固定seed 100局 | `run-phase-transition-research.js` | `observations.jsonl`, `games.json`, `manifest.json` | 完了 |
| E-003 | 候補分析v2 | `pilot-v2-analysis-input.zip` | `02-transition-candidate-analysis.ipynb` | 候補区間・感度分析 | 完了 |
| E-004 | forcingアブレーション | 同上 | `03-forcing-ablation.ipynb` | inclusive / excluded / auxiliary | 完了 |
| E-005 | A/B/C/X分類 | 同上 | `analyze-phase-transition-forcing-ablation.py` | 監査表 | 完了 |
| E-006 | アーキタイプ分析 | 同上 | `04-candidate-archetypes.ipynb` | 13 Aアーキタイプ | 完了 |
| E-007 | 優先候補盤面監査 | 同上 | `05-candidate-board-audit.ipynb` | 主要6候補前後局面 | 完了 |
| E-008 | 強制捕獲レジーム分析 | pilot-v2 / A候補 | `analyze-forced-capture-regimes.js` | レジーム分類 | 完了 |
| E-009 | 候補手質的特徴量 | pilot-v2対局 / A候補 | `analyze-phase-transition-move-quality.js` | 捕獲量、relay長、静的評価差 | 完了 |
| E-010 | 未使用seed確認実験 | 200局、base seed 20261001 | `evaluate-phase-transition-confirmation.js` | 事前登録判定、候補・対照率 | 完了・`not-confirmed` |
| E-011 | AI・depth頑健性 | 5条件×400局、shared seed 20262001–20262400 | `run-phase-transition-robustness-formal.js` | 条件別濃縮、trajectory感度、全体頑健性判定 | 完了・formal `inconclusive` |
| E-012 | 対照群・反例分析 | 4127候補外ply | `analyze-forced-capture-regime-controls.js` | 基準率・27設定感度表 | 完了 |
| E-013 | 終局近傍効果分離 | E-012候補・対照 | `terminal-distance-summary.js` | 終局距離層別表 | 完了 |
| E-014 | 捕獲分岐形成過程 | 探索群急拡大5区間 | `analyze-capture-branch-formation.js` | 1–8ply時系列、ピーク差分 | 完了 |
| E-015 | E-010 trajectory重複感度 | E-010候補・対照・games.json | `analyze-confirmation-trajectory-duplication.js` | 重複除去率、アーキタイプ、重複群 | 完了・事後感度分析 |
| E-016 | E-010捕獲分岐形成確認 | 確認群急拡大7区間 | `summarize-confirmation-capture-branch-formation.js` | 生の7件平均、trajectory-ply平均 | 完了・限定的再現 |
| E-017 | 独立構造確認 | 1000局、seed 20263001–20264000 | `run-phase-transition-independent-confirmation-formal.js` | 固有trajectory-ply濃縮、構造availability | 完了・formal `not-confirmed` |
| E-018 | search profile依存性直接比較 | P2/LG各2000局、shared seed 20265001–20267000 | `run-phase-transition-search-profile-dependence-formal.js` | paired game-level McNemar、構造副次比較 | **完了・formal `confirmed`** |

## E-010 未使用seed確認実験

- analysisVersion: `11-unused-seed-confirmation`
- preregistration commit: `a3c07b14f4b01459f790d0eec38c4a341594f47e`
- validated commit: `92c0ffa2354130cb43cdffc309587035be89939f`
- Actions run: `30630007008`
- artifact: `phase-transition-confirmation-v1`
- artifact digest: `sha256:c1938edabbfd0a4ac39e3a5b8395bdc049dd795c52c38ea568dce0ae9c4160e3`
- games: 200
- base seed: `20261001`
- observation count: 11439
- regime count: 845
- A candidates before terminal filter: 22
- primary candidates, 9ply以上: 11
- primary controls: 8424
- candidate expansion: 7/11 = 63.64%
- control expansion: 249/8424 = 2.96%
- risk ratio: 21.53
- decision: `not-confirmed`
- failed criterion: minimum primary candidate count 12; observed 11

## E-015 E-010 trajectory重複感度

- analysisVersion: `13-confirmation-trajectory-duplication-audit`
- analysis type: post-hoc sensitivity audit
- deduplication key: `trajectoryHash + candidatePly`
- source artifact: E-010 run `30630007008`
- raw primary candidates: 11
- unique trajectory-ply candidates: 5
- unique candidate trajectories: 4
- unique candidate archetypes: 5
- raw expansion candidates: 7
- unique expansion trajectory-ply: 2
- unique expansion trajectories: 2
- unique expansion archetypes: 2
- largest duplicate group: 6
- deduplicated candidate expansion: 2/5 = 40.00%
- deduplicated control expansion: 218/7061 = 3.09%
- deduplicated risk ratio: 12.96
- preregistered E-010 decision changed: no

## E-011 AI条件・探索深度横断頑健性実験

- analysisVersion: `12-ai-depth-robustness`
- status: `preregistered / infrastructure-validated / formal-complete / inconclusive`
- authorization time: `2026-08-01 06:09 JST`
- authorization commit: `a0378010607aebad76420e0d377ee1b88166d861`
- completion checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e011-formal-completion.md`
- preregistration config: `config/experiments/phase-transition-robustness-v1.json`
- preregistration SHA-256: `65253e719463b4e60527bdb96cb4ce234aae76df39d5d2727bd9d09849c7eb69`
- trajectory supplement: `config/experiments/phase-transition-robustness-v1-trajectory-supplement.json`
- execution policy: `config/experiments/phase-transition-robustness-execution-policy-v1.json`
- execution-policy SHA-256: `97fa235e340b527919f9414c6859ce63b74cc5a930ce7e9893c66c2ddb02698b`
- execution runbook: `doc/phase-transition/E011_FORMAL_EXECUTION.md`
- games per condition: 400
- conditions: 5
- total formal games: 2000
- shared seed range: `20262001–20262400`
- locked source commit: `ed61d7214967b95535d9f30f8fa47480e2ea5ecb`
- Node.js: `v24.6.0`
- platform: Linux
- primary population: `pliesRemaining >= 9`

### E-011 condition results

| Condition | evaluator | search | depth | A candidates | expansion | controls | candidate rate | control rate | RR | status |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| C0 | bao | phase2 | 2 | 16 | 9 | 16395 | 56.25% | 2.95% | 19.09 | `pass` |
| C1 | bao | phase2 | 1 | 15 | 2 | 15679 | 13.33% | 2.05% | 6.49 | `insufficient` |
| C2 | bao | phase2 | 3 | 12 | 3 | 15801 | 25.00% | 1.75% | 14.26 | `insufficient` |
| C3 | bao-v2 | phase2 | 2 | 19 | 11 | 16437 | 57.89% | 2.88% | 20.08 | `pass` |
| C4 | bao | legacy | 2 | 8 | 0 | 15412 | 0.00% | 1.68% | 0.00 | `insufficient` |

Formal global decision: **`inconclusive`**

### E-011 trajectory-ply sensitivity

| Condition | unique candidates | unique expansion | unique controls | unique control expansion | dedup RR |
|---|---:|---:|---:|---:|---:|
| C0 | 8 | 2 | 12185 | 387 | 7.87 |
| C1 | 13 | 2 | 11407 | 240 | 7.31 |
| C2 | 10 | 2 | 11695 | 213 | 10.98 |
| C3 | 11 | 4 | 12160 | 378 | 11.70 |
| C4 | 6 | 0 | 11412 | 180 | 0.00 |

Interpretation: phase2条件C0–C3では重複除去後も候補側濃縮方向が残り、legacy C4ではexpansion候補0。ただしC4はavailability不足のためsearch依存性を確定せず、H16として別実験へ分離した。

Final bundle:

- archive: `e011-final-formal-evaluation.tar.gz`
- SHA-256: `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc`

## E-016 E-010捕獲分岐形成確認

- raw analysisVersion: `10-capture-branch-formation`
- trajectory analysisVersion: `14-confirmation-capture-branch-formation-trajectory-sensitivity`
- input: E-010 capture-branch-expansion 7 candidates
- sensitivity unit: unique `trajectoryHash + candidatePly`
- unique sensitivity rows: 2
- raw mean peak distance: 1.71 ply
- deduplicated mean peak distance: 1.00 ply
- raw maximum-capture asymmetry: actor +2.57 / opponent -0.86
- deduplicated maximum-capture asymmetry: actor +1.50 / opponent -0.50
- phase changes: raw 0/7, deduplicated 0/2
- interpretation: direction reproduced, but six rows are one repeated trajectory-ply and only one of two structures has non-zero asymmetry
- Actions run: `30642671291`
- artifact digest: `sha256:71b10449821604677ab94a713c580a30cf2d8c3890c7d77ccc03c66f4287edf6`

## E-017 独立構造確認

- analysisVersion: `15-independent-structural-confirmation`
- status: `preregistered / evaluator-validated / infrastructure-validated / formal-complete / not-confirmed`
- preregistration: `config/experiments/phase-transition-independent-confirmation-v2.json`
- preregistration checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e017-independent-confirmation-preregistration.md`
- evaluator checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e017-evaluator-validation.md`
- infrastructure checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e017-formal-infrastructure.md`
- authorization checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e017-formal-start-authorization.md`
- completion checkpoint: `doc/phase-transition/checkpoints/2026-08-02-e017-formal-completion.md`
- authorization time: `2026-08-01 22:47 JST`
- authorization commit: `f0f9e90be0d77dac395e9ec53d951a011ad1f1fd`
- games: 1000
- seed range: `20263001–20264000`
- condition: `hard / bao / phase2 / depth 2`
- primary population: `pliesRemaining >= 9`
- primary unit: unique `trajectoryHash + eventPly`

### E-017 formal integrity

- observations: 56294
- games: 1000
- exact seed sequence: true
- unique game IDs: true
- all trajectory hashes present: true
- source commit matches execution lock: true
- preregistration/policy hash present in lock: true
- errors: none
- mode: `formal`
- valid: `true`

### E-017 formal result

| criterion / metric | threshold | observed | result |
|---|---:|---:|---|
| raw primary candidates | >=30 | 53 | pass |
| unique candidate trajectory-ply | >=15 | 21 | pass |
| unique candidate trajectories | >=12 | 19 | pass |
| unique expansion trajectory-ply | >=5 | 9 | pass |
| unique expansion trajectories | >=5 | 9 | pass |
| unique control trajectory-ply | >=30000 | 23306 | **fail** |
| deduplicated RR | >=3 | 13.74 | pass |
| dedup candidate rate > control rate | required | 42.86% > 3.12% | pass |

Raw endpoint:

- candidates: 53
- expansion: 37
- controls: 40956
- control expansion: 1235
- candidate rate: 69.81%
- control rate: 3.02%
- RR: 23.15

Trajectory-ply deduplicated endpoint:

- candidates: 21
- expansion: 9
- controls: 23306
- control expansion: 727
- candidate rate: 42.86%
- control rate: 3.12%
- RR: 13.74
- unique candidate trajectories: 19
- unique expansion trajectories: 9
- unique expansion archetypes: 9
- largest trajectory-ply multiplicity: 24

Formal decision: **`not-confirmed`**

唯一の不通過はminimum unique control trajectory-ply 30000に対する23306。結果後に閾値を緩和せず、強いRRや構造的再現を理由に`confirmed`へ読み替えない。

`preregistrationStatus: preregistered-not-run`というevaluator出力はconfig由来の状態ラベルであり、formal execution状態の正本ではない。execution lockとformal integrity `mode=formal / valid=true`で実行成立を確認する。

## E-018 search profile依存性直接比較

- hypothesis: H16
- analysisVersion: `16-search-profile-dependence`
- status: **preregistered / infrastructure-validated / formal-complete / confirmed**
- preregistration: `config/experiments/phase-transition-search-profile-dependence-v1.json`
- preregistration SHA-256: `17fb28bf250d2218b91d5d6196ec58ac7ba0c8b8d2ced93d498135ea669e4298`
- preregistration checkpoint: `doc/phase-transition/checkpoints/2026-08-02-e018-search-profile-dependence-preregistration.md`
- infrastructure checkpoint: `doc/phase-transition/checkpoints/2026-08-02-e018-formal-infrastructure.md`
- authorization checkpoint: `doc/phase-transition/checkpoints/2026-08-02-e018-formal-start-authorization.md`
- completion checkpoint: `doc/phase-transition/checkpoints/2026-08-02-e018-formal-completion.md`
- authorization time: `2026-08-02 08:39 JST`
- authorization commit: `9c5a902f3fbe0df02975050f2648a2a08cefb109`
- execution policy: `config/experiments/phase-transition-search-profile-dependence-execution-policy-v1.json`
- execution-policy SHA-256: `b1bd2769877989a236f24576ea8e11070fbe573f4f7a92b9c56d3f998b1b9653`
- locked source commit: `1f6b129b9b3cb11580244b1d4c337c067289cfdb`
- fixed Python environment: `/home/oruorane/.venvs/bao-phase-transition-e011`
- Python: `3.12.3`; numpy: `2.5.1`; pandas: `3.0.5`
- Node.js: `v24.6.0`
- fixture runner: `tools/experiments/run-phase-transition-search-profile-dependence.js`
- guarded formal runner: `tools/experiments/run-phase-transition-search-profile-dependence-formal.js`
- verifier: `tools/experiments/verify-phase-transition-search-profile-dependence.js`
- pair builder: `tools/experiments/build-phase-transition-search-profile-pairs.js`
- evaluator: `tools/experiments/evaluate-phase-transition-search-profile-dependence.js`
- structural secondary: `tools/experiments/summarize-phase-transition-search-profile-structure.js`
- conditions:
  - P2: `hard / bao / phase2 / depth 2`
  - LG: `hard / bao / legacy / depth 2`
- games: 2000 / condition, 4000 total
- shared seed: `20265001–20267000`
- paired random-opening boundary required: yes
- primary population: `pliesRemaining >= 9`
- primary unit: paired shared-seed game
- game endpoint: eligible A `capture-branch-expansion` candidateが1件以上あるか
- primary test: two-sided exact McNemar
- alpha: 0.05
- minimum discordant pairs: 20
- direction: P2-only > LG-only
- legacy minimum expansion count: none
- structural `trajectoryHash + eventPly` comparison: secondary
- formal GitHub Actions run: prohibited

### E-018 formal integrity

- P2 games: 2000; observations: 110985
- LG games: 2000; observations: 115785
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
- `errors: []`
- `mode: formal`
- `valid: true`

### E-018 primary formal result

| endpoint | count |
|---|---:|
| n00 | 1928 |
| n01 LG-only | 9 |
| n10 P2-only | 63 |
| n11 | 0 |
| discordant pairs | 72 |

- P2 event-game rate: 63/2000 = 3.15%
- LG event-game rate: 9/2000 = 0.45%
- paired risk difference: +2.70 percentage points
- discordant odds ratio: 7.0
- two-sided exact McNemar p: `4.1812279092751445e-11`
- minimum discordant pairs >=20: pass
- direction P2-only > LG-only: pass
- alpha p<=0.05: pass

Formal decision: **`confirmed`**

### E-018 structural secondary

P2:

- raw eligible candidates / expansion: 107 / 63
- raw controls / expansion: 80579 / 2449
- raw RR: 19.37
- unique candidate trajectory-ply / expansion: 34 / 11
- unique candidate / expansion trajectories: 32 / 11
- deduplicated RR: 10.12
- largest trajectory-ply multiplicity: 37

LG:

- raw eligible candidates / expansion: 54 / 9
- raw controls / expansion: 77567 / 1283
- raw RR: 10.08
- unique candidate trajectory-ply / expansion: 31 / 7
- unique candidate / expansion trajectories: 30 / 7
- deduplicated RR: 13.43
- largest trajectory-ply multiplicity: 5

Direct candidate trajectory-ply comparison:

- P2: 11/34 = 32.35%
- LG: 7/31 = 22.58%
- risk difference: +9.77 percentage points
- RR: 1.43
- two-sided Fisher exact p: `0.41837226457118804`

このFisher比較はpreregistered secondaryで、paired game-level exact McNemar primary decisionを置き換えない。

### E-018 interpretation

H16「捕獲分岐急拡大の顕在化はsearch profileに依存する」は、固定`hard / bao / depth 2`条件の`phase2`対`legacy`、paired same-opening designにおいてformal confirmed。

E-011 `inconclusive`、E-017 `not-confirmed`、E-010 `not-confirmed`は変更しない。全evaluator、全depth、別search implementationへ自動一般化しない。

### E-018 infrastructure validation

- validated infrastructure head: `c37b0e3d00b11d0d9563a815dbb653297503a90d`
- workflow: `Phase Transition Search Profile Dependence`
- Actions run: `30723040531`
- result: `success`
- formal-guard regression tests: pass
- paired two-game fixture: pass
- paired seed/opening/source/condition integrity: pass
- paired endpoint builder: pass
- structural secondary: pass

## 共通データ識別情報

### 探索群

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- games: 100

### E-010確認群

- studyVersion: `0.4.1`
- configHash: `5476e77676800c40b90953ea07359d31f2bc47decd0fadd1105070d4367cbce7`
- games: 200
- unique trajectories: 167

### E-011頑健性群

- studyVersion: `0.4.1`
- games: 400/condition, 2000 total
- seed range: `20262001–20262400`
- formal integrity: valid
- formal decision: `inconclusive`

### E-017独立構造確認群

- studyVersion: `0.4.1`
- games: 1000
- seed range: `20263001–20264000`
- formal integrity: valid
- formal decision: `not-confirmed`

### E-018 search profile比較群

- studyVersion: `0.4.1`
- games: 2000/condition, 4000 total
- seed range: `20265001–20267000`
- formal integrity: valid
- formal decision: `confirmed`
- locked source commit: `1f6b129b9b3cb11580244b1d4c337c067289cfdb`
