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
| E-009 | 候補手質的特徴量 | pilot-v2対局ファイル / A候補15区間 | `analyze-phase-transition-move-quality.js` | 捕獲量、relay長、静的評価差 | 完了 |
| E-010 | 新規seed確認実験 | 未使用seed | 未実装 | 再現率・偽陽性率 | 次工程 |
| E-011 | AI・depth頑健性 | 複数条件 | 未実装 | 条件横断再現性 | 未着手 |
| E-012 | 対照群・反例分析 | 4127候補外ply | `analyze-forced-capture-regime-controls.js` | 基準率・27設定感度表 | 完了 |
| E-013 | 終局近傍効果分離 | E-012候補・対照指標 | `terminal-distance-summary.js` | 終局距離層別表 | 完了 |

## E-009 候補手質的特徴量

- analysisVersion: `9-candidate-move-quality`
- implementation commit: `816e0254fc79411b37a3cb30aabc648bd502735c`
- workflow commit: `d338f4cd635de7728c5af11e9e3238c259b3bd5d`
- Actions run: `30622069887`
- artifact: `phase-transition-move-quality`
- artifact digest: `sha256:69fee2bf5bd8fa7fab3beece392a04dd8ff6e56fbae78d8b10ce129be1d7c09d`
- candidate members: 15
- outputs:
  - `candidate-move-quality.csv`
  - `move-quality-summary.json`
- expansion 5区間:
  - mean chosen captured seeds: 1.6
  - mean chosen capture+relay length: 2.2
  - immediate best rate: 80.0%
  - mean immediate evaluation gap: 12.6
  - mean capture opportunity gap: 0

## 共通データ識別情報

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- profile: `pilot-v2`
- games: 100
