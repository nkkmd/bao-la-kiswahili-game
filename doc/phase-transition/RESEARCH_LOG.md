# 局面相転移点研究 — 研究ログ

追記専用。過去記録は原則として変更しない。

## 2026-07-30 — pilot-v2候補分析v2

### 実施内容
- ランダム開局除外、終局ガード、候補区間クラスタリングを導入。
- forcingイベント距離と構造イベント距離を分離。
- 3×3閾値感度分析を実施。

### 結果
- 主設定 `2.0 / 0.75` で95候補区間、66ゲーム。

### 再現情報
- commit: `dcf4b9b26601924c5587e7ac43e18d6a090e0d00`
- Notebook: `02-transition-candidate-analysis.ipynb`

## 2026-07-30 — forcingアブレーション

### 結果
- 主設定で95区間から45区間へ減少。
- forcingを独立特徴群にすると約50区間が追加される。

### 解釈
- forcingを候補成立の独立特徴群として使う設計を撤回。

### 再現情報
- commit: `f58de9f0fa3601be4f41646b6b1425eff55fb450`

## 2026-07-30 — A/B/C分類とアーキタイプ分析

### 結果
- A 15、B 30、C 51、X 0。
- A 15候補は13固有局面・13アーキタイプ。
- 終局まで5ply以上の主要6候補を盤面監査対象とした。

### 再現情報
- commit: `da1193989d8ece1ebeac9b17874f27b8dd96f684`
- commit: `1fe365382bacf46f1e939f808b1e1b5d61b04e98`
- fix: `796e2b2ea8b593d3dbfa4642aa88e9c85f09516b`

## 2026-07-30 — 優先6候補の盤面監査

### 結果
- 6候補すべてで候補plyの `forcedCapture=true`。
- 6候補すべてで `legalMoveCount=captureMoveCount`。
- `2e79188a987a` と `7360876ad5c7` は後続でmtajiへ移行。

### 解釈の変更
- 「forcing独立候補」という呼称を撤回。
- 中心現象を強制捕獲レジーム内部の捕獲選択肢構造の急変と再解釈。

### 再現情報
- commit: `b0845486b958c5e2da91405b708af9e8544efd5f`
- Notebook: `05-candidate-board-audit.ipynb`

## 2026-07-31 — 強制捕獲レジーム分析の実装

### 実施内容
- 連続 `forcedCapture=true` 区間抽出、候補対応、位置・持続・回復・イベント距離、探索的5分類を実装。
- 回帰テストとNotebookを追加。

### 状態
- 実装完了。主要6候補の実データ監査前の段階では分類閾値を未採用とした。

### 再現情報
- analysisVersion: `6-forced-capture-regimes`
- branch: `research/forced-capture-regime-analysis`

## 2026-07-31 — 主要6候補の強制捕獲レジーム監査

### 実施内容
- `pilot-v2` の固定設定から対象6局だけを決定論的に再生成。
- 既存盤面監査の候補ply・捕獲手数と一致することを検証。
- 所属レジーム、レジーム内位置、捕獲手数変化、持続率、回復距離、forcing解除・mtaji・終局距離を算出。
- GitHub Actions artifactへCSV・JSONを保存。

### 結果
- 6局、332観測、26強制捕獲レジーム。
- 主要6候補はすべてレジーム内。対応漏れ0。
- 分類: 捕獲分岐急拡大3、mtaji前兆2、一時的スパイク1。
- 急拡大: `9f778d512ae1`、`22807aff1baf`、`6b364e603366`。
- mtaji前兆: `2e79188a987a`（5ply）、`7360876ad5c7`（7ply）。
- 一時的スパイク: `0eb352745c9b`（持続率0.25）。

### 解釈の変更
- 「残る4件はすべて捕獲分岐爆発」という暫定解釈を撤回。
- 少なくとも1件は一時的スパイクであり、急増量だけでなく持続率が必要。

### 再現情報
- analysisVersion: `6-priority-forced-capture-regime-audit`
- commit: `fd0bfd02c7ba65b6efd53bd11ced1ba73f74e017`
- Actions run: `30614184554`
- artifact digest: `sha256:4a8c5aebec05f766687508cba80dc422d682bdd8a40455bb30411a884d55e9a5`

### 次工程
- 全A候補15区間の一括実行。
- 候補外レジーム対照と閾値感度分析。
