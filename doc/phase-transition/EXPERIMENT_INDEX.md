# 局面相転移点研究 — 実験索引

更新日: 2026-08-01

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
| E-010 | 未使用seed確認実験 | 200局、base seed 20261001 | `evaluate-phase-transition-confirmation.js` | 事前登録判定、候補・対照率 | 完了・not-confirmed |
| E-011 | AI・depth頑健性 | 5条件×400局、shared seed 20262001 | `run-phase-transition-robustness.js` | 条件別濃縮、全体頑健性判定 | 事前登録・基盤検証済み・正式未実施 |
| E-012 | 対照群・反例分析 | 4127候補外ply | `analyze-forced-capture-regime-controls.js` | 基準率・27設定感度表 | 完了 |
| E-013 | 終局近傍効果分離 | E-012候補・対照 | `terminal-distance-summary.js` | 終局距離層別表 | 完了 |
| E-014 | 捕獲分岐形成過程 | 探索群急拡大5区間 | `analyze-capture-branch-formation.js` | 1–8ply時系列、ピーク差分 | 完了 |
| E-015 | E-010 trajectory重複感度 | E-010候補・対照・games.json | `analyze-confirmation-trajectory-duplication.js` | 重複除去率、アーキタイプ、重複群 | 完了・事後感度分析 |
| E-016 | E-010捕獲分岐形成確認 | 確認群急拡大7区間 | `summarize-confirmation-capture-branch-formation.js` | 生の7件平均、trajectory-ply平均 | 実装済み・結果未確定 |

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
- outputs:
  - `trajectory-duplication-summary.json`
  - `primary-candidate-events.csv`
  - `trajectory-ply-deduplicated-candidates.csv`
  - `trajectory-ply-deduplicated-controls.csv`
  - `primary-candidate-archetypes.csv`
  - `candidate-duplicate-groups.csv`

## E-011 AI条件・探索深度横断頑健性実験

- analysisVersion: `12-ai-depth-robustness`
- status: `preregistered / infrastructure-validated / formal-not-run`
- preregistration config: `config/experiments/phase-transition-robustness-v1.json`
- trajectory supplement: `config/experiments/phase-transition-robustness-v1-trajectory-supplement.json`
- checkpoint: `doc/phase-transition/checkpoints/2026-07-31-ai-depth-robustness-preregistration.md`
- infrastructure checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e011-infrastructure-and-e010-trajectory-audit.md`
- games per condition: 400
- conditions: 5
- total planned games: 2000
- shared base seed: `20262001`
- shared seed range: `20262001–20262400`
- run environment: fixed local environment
- run order: `C0 → C1 → C2 → C3 → C4`
- condition grid:
  - C0: `bao / phase2 / depth 2`
  - C1: `bao / phase2 / depth 1`
  - C2: `bao / phase2 / depth 3`
  - C3: `bao-v2 / phase2 / depth 2`
  - C4: `bao / legacy / depth 2`
- fixed primary population: `pliesRemaining >= 9`
- fixed expansion rule: `expansionDelta=3 / persistenceFraction=0.5`
- condition minimums:
  - primary candidates: 12
  - expansion candidates: 5
  - controls: 10000
  - risk ratio: 3
  - candidate rate > control rate
- implementation status:
  - multi-condition runner: 完了
  - condition integrity validator: 完了
  - combined evaluator: 完了
  - trajectory sensitivity output: 完了
  - regression fixture: 完了
  - formal 400×5 corpus: 未実施
- fixture validation:
  - commit: `5ebc7800d1721179214d896f9587345fe55ebe08`
  - run: `30641768496`
  - artifact digest: `sha256:3b909d26b5f404b55318f157319fb108d4c03ee7d542695ba156ad400cc9ac26`
  - result: success

## E-016 E-010捕獲分岐形成確認

- analysisVersion: `14-confirmation-capture-branch-formation-trajectory-sensitivity`
- input: E-010 capture-branch-expansion 7 candidates
- window: 8 ply
- raw unit: 7 candidate rows
- sensitivity unit: unique `trajectoryHash + candidatePly`
- expected unique sensitivity rows: 2
- implementation:
  - `analyze-capture-branch-formation.js`
  - `summarize-confirmation-capture-branch-formation.js`
  - `test/phase-transition-confirmation-capture-formation-sensitivity.test.js`
- status: CI再生成結果待ち

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
- configHash: 未生成
- games: 400/condition
- conditions: C0–C4
