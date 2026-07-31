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
| E-008 | 強制捕獲レジーム分析 | pilot-v2 100局 / A 13アーキタイプ | `analyze-forced-capture-regimes.js`, `06-forced-capture-regimes.ipynb` | レジーム・候補指標・分類 | 全A分析完了 |
| E-009 | 候補手質的特徴量 | 未定 | 未実装 | 最大捕獲量、relay長、評価差等 | 未着手 |
| E-010 | 新規seed確認実験 | 未使用seedコーパス | 未実装 | 再現率・偽陽性率 | 未着手 |
| E-011 | AI・depth頑健性実験 | 複数条件コーパス | 未実装 | 条件横断再現性 | 未着手 |
| E-012 | 対照群・反例分析 | 候補外強制捕獲レジーム | 未実装 | 基準率・反例集・適用範囲 | 次工程 |

## E-008 全A分析識別情報

- analysisVersion: `6-forced-capture-regimes`
- source replication commit: `1a6fed9b98410f0bd3ee9c4cfdad0cb3ea8756f0`
- Actions run: `30615605472`
- artifact: `phase-transition-ci-artifacts`
- artifact digest: `sha256:1a6d937dd22908841aae3b211505fb601a8304817c376ffc7fefee655e2cda26`
- gameCount: 100
- observationCount: 5650
- regimeCount: 421
- candidateCount: 13 archetypes
- candidatesOutsideRegimes: 0
- classCounts: expansion 3, mtaji precursor 3, forcing-release precursor 6, temporary spike 1
- note: 初回全A実行のmtaji前兆9件は、既存mtaji局面を距離0で数えた実装バグのため撤回

## 共通データ識別情報

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- profile: `pilot-v2`
- games: 100

## 主要コミット

- `dcf4b9b26601924c5587e7ac43e18d6a090e0d00` — 候補分析v2
- `f58de9f0fa3601be4f41646b6b1425eff55fb450` — forcingアブレーション
- `da1193989d8ece1ebeac9b17874f27b8dd96f684` — A/B/C分類
- `1fe365382bacf46f1e939f808b1e1b5d61b04e98` — アーキタイプ分析
- `b0845486b958c5e2da91405b708af9e8544efd5f` — 盤面監査
- `fd0bfd02c7ba65b6efd53bd11ced1ba73f74e017` — 主要6候補レジーム監査
- `1a6fed9b98410f0bd3ee9c4cfdad0cb3ea8756f0` — mtaji前兆定義修正・全A再実行
