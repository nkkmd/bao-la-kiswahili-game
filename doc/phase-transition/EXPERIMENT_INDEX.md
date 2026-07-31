# 局面相転移点研究 — 実験索引

更新日: 2026-07-31

| ID | 実験 | 入力 | 実行コード / Notebook | 主出力 | 状態 |
|---|---|---|---|---|---|
| E-001 | Phase 0 fixture監査 | 固定fixture | `01-data-audit.ipynb` | 欠損・重複・hash監査 | 完了 |
| E-002 | pilot-v2生成 | 固定seed 100局 | `run-phase-transition-research.js` | `observations.jsonl`, `games.json`, `manifest.json` | 完了 |
| E-003 | 候補分析v2 | `pilot-v2-analysis-input.zip` | `02-transition-candidate-analysis.ipynb` | 候補点・候補区間・感度分析 | 完了 |
| E-004 | forcingアブレーション | 同上 | `03-forcing-ablation.ipynb` | inclusive / excluded / auxiliary比較 | 完了 |
| E-005 | A/B/C/X分類 | 同上 | `analyze-phase-transition-forcing-ablation.py` | `candidate-audit-table.csv` | 完了 |
| E-006 | アーキタイプ分析 | 同上 | `04-candidate-archetypes.ipynb` | `archetype-summary.json`, `candidate-archetypes.csv` | 完了 |
| E-007 | 優先候補盤面監査 | 同上 | `05-candidate-board-audit.ipynb` | 主要6候補の前後局面 | 完了 |
| E-008 | 強制捕獲レジーム分析 | 同上 | `analyze-forced-capture-regimes.js` / `06-forced-capture-regimes.ipynb` | `forced-capture-regimes.csv`, `candidate-regime-metrics.csv`, summary JSON | 実装完了・データ実行待ち |
| E-009 | 候補手質的特徴量 | 未定 | 未実装 | 最大捕獲量、relay長、評価差等 | 未着手 |
| E-010 | 新規seed確認実験 | 未使用seedコーパス | 未実装 | 再現率・偽陽性率 | 未着手 |
| E-011 | AI・depth頑健性実験 | 複数条件コーパス | 未実装 | 条件横断再現性 | 未着手 |
| E-012 | 対照群・反例分析 | 候補外局面 | 未実装 | 反例集・適用範囲 | 未着手 |

## E-008 実装識別情報

- analysisVersion: `6-forced-capture-regimes`
- input corpus: `pilot-v2-analysis-input.zip`
- candidate input: `candidate-archetypes.csv`（category A）
- implementation branch: `research/forced-capture-regime-analysis`
- test: `test/forced-capture-regimes.test.js`
- output directory: `artifacts/local/phase-transition-forced-capture-regimes/`
- 未完了: 入力アーカイブを用いた実行、結果監査、分類閾値の判断台帳反映

## 共通データ識別情報

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- profile: `pilot-v2`
- games: 100
- input archive: `pilot-v2-analysis-input.zip`

## Google Drive保存先

- `pilot-v2-analysis-v2/`
- `pilot-v2-forcing-ablation/`
- `pilot-v2-archetypes/`
- `pilot-v2-candidate-board-audit/`
- `pilot-v2-forced-capture-regimes/`（予定）

## 主要コミット

- `dcf4b9b26601924c5587e7ac43e18d6a090e0d00` — 候補分析v2
- `f58de9f0fa3601be4f41646b6b1425eff55fb450` — forcingアブレーション
- `da1193989d8ece1ebeac9b17874f27b8dd96f684` — A/B/C分類
- `1fe365382bacf46f1e939f808b1e1b5d61b04e98` — アーキタイプ分析
- `796e2b2ea8b593d3dbfa4642aa88e9c85f09516b` — representative ply修正
- `b0845486b958c5e2da91405b708af9e8544efd5f` — 盤面監査
