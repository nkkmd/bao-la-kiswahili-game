# 局面相転移点研究 — 研究ログ

追記専用。過去記録は原則として変更しない。

## 2026-07-30 — pilot-v2候補分析v2

### 実施内容
- ランダム開局除外、終局ガード、候補区間クラスタリングを導入。
- forcingイベント距離と構造イベント距離を分離。
- 3×3閾値感度分析を実施。

### 結果
- 主設定 `2.0 / 0.75` で95候補区間、66ゲーム。
- early-terminal除外は候補数に影響しなかった。

### 次工程
- forcingが候補成立へ与える影響をアブレーションする。

### 再現情報
- commit: `dcf4b9b26601924c5587e7ac43e18d6a090e0d00`
- Notebook: `02-transition-candidate-analysis.ipynb`

## 2026-07-30 — forcingアブレーション

### 実施内容
- inclusive、excluded、auxiliaryの3条件を比較。

### 結果
- 主設定で95区間から45区間へ減少。
- forcingを独立特徴群にすると約50区間が追加される。
- excludedとauxiliaryは候補数が一致し、スコアのみ異なる。

### 解釈
- forcingを候補成立の独立特徴群として使う設計を撤回。

### 再現情報
- commit: `f58de9f0fa3601be4f41646b6b1425eff55fb450`
- Notebook: `03-forcing-ablation.ipynb`

## 2026-07-30 — A/B/C分類と監査表

### 実施内容
- 区間重複による対応判定へ修正。
- A/B/C候補監査表を生成。

### 結果
- A 15、B 30、C 51。
- 合計96となったため、excluded側のみのX分類を明示する設計へ更新。

### 再現情報
- commit: `da1193989d8ece1ebeac9b17874f27b8dd96f684`

## 2026-07-30 — アーキタイプ分析

### 実施内容
- A/B/C/X分類。
- stateHash、変化シグネチャ、局面帯、終局までの残りplyを追加。

### 結果
- candidateCounts: A 15、B 30、C 51、X 0。
- archetypeCounts: A 13、B 28、C 44、X 0。
- A uniqueStateCounts: 13。
- A局面帯: opening 4、middle 3、late 1、terminal_near 7。
- `9f778d512ae1` は3ゲーム・1固有局面で再現。

### 解釈
- 終局近傍7アーキタイプを主候補と分離。
- 終局まで5ply以上の主要6候補を盤面監査対象とした。

### 再現情報
- commit: `1fe365382bacf46f1e939f808b1e1b5d61b04e98`
- fix commit: `796e2b2ea8b593d3dbfa4642aa88e9c85f09516b`
- Notebook: `04-candidate-archetypes.ipynb`

## 2026-07-30 — 優先6候補の盤面監査

### 実施内容
- 各代表局面の直前1plyから直後8plyを再構成。
- phase、手番、forcing、合法手数、捕獲手数、選択手を確認。

### 結果
- 6候補すべてで候補plyの `forcedCapture=true`。
- 6候補すべてで `legalMoveCount=captureMoveCount`。
- 候補直前から候補plyへ合法・捕獲手数が急増。
- `2e79188a987a` と `7360876ad5c7` は後続でmtajiへ移行。

### 解釈の変更
- 「forcing独立候補」という呼称を撤回。
- Aを「forcing切替非同時候補」と定義。
- 中心現象を「強制捕獲レジーム内部の捕獲選択肢構造の急変」と再解釈。

### 次工程
- 強制捕獲レジーム単位の分析。

### 再現情報
- commit: `b0845486b958c5e2da91405b708af9e8544efd5f`
- Notebook: `05-candidate-board-audit.ipynb`
- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
