# 局面相転移点研究 — 実験索引

更新日: 2026-07-31

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
| E-009 | 候補手質的特徴量 | 未定 | 未実装 | 最大捕獲量、relay長、評価差 | 次工程 |
| E-010 | 新規seed確認実験 | 未使用seed | 未実装 | 再現率・偽陽性率 | 未着手 |
| E-011 | AI・depth頑健性 | 複数条件 | 未実装 | 条件横断再現性 | 未着手 |
| E-012 | 対照群・反例分析 | 4127候補外ply | `analyze-forced-capture-regime-controls.js` | 基準率・27設定感度表 | 完了 |
| E-013 | 終局近傍効果分離 | E-012候補・対照指標 | `terminal-distance-summary.js` | 終局距離層別表 | 完了 |

## E-008 全A分析

- analysisVersion: `6-forced-capture-regimes`
- commit: `1a6fed9b98410f0bd3ee9c4cfdad0cb3ea8756f0`
- Actions run: `30615605472`
- artifact digest: `sha256:1a6d937dd22908841aae3b211505fb601a8304817c376ffc7fefee655e2cda26`
- observations: 5650
- regimes: 421
- A candidate members: 15
- A archetypes: 13

## E-012 対照・感度分析

- analysisVersion: `7-forced-capture-regime-controls`
- commit: `463f8059ce41fe0a828ae77541acf284ecb6b79f`
- Actions run: `30616999870`
- artifact digest: `sha256:8d64b6d923a5bf1f44c883e4465a8147c990acba7e6071389ef18ffb778a2b7a`
- candidate members: 15
- control points: 4127
- exclusion buffer: 8ply
- sensitivity settings: 27

## E-013 終局距離層別分析

- analysisVersion: `8-terminal-distance-summary`
- implementation commit: `2a3b13420ef403b49d66c15b307510b33843669f`
- workflow commit: `652c73289379b4387c84f51d63de6107cf52ed1f`
- Actions run: `30617983989`
- artifact: `phase-transition-terminal-strata`
- artifact digest: `sha256:af2f30d495a84c20b97c856dffa428197a2366532d9630f77122264271ce8ec3`
- terminal bands: `0-4`, `5-8`, `9-16`, `17+`
- comparable non-terminal band: 9ply以上
- A candidates at 9ply以上: 8、forcing解除前兆0
- controls at 9ply以上: 4062、forcing解除前兆576（14.2%）
- outputs:
  - `terminal-distance-strata.csv`
  - `terminal-distance-summary.json`

## 共通データ識別情報

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- profile: `pilot-v2`
- games: 100
