# 局面相転移点研究 — 現在地

更新日: 2026-07-30  
Status: Active  
研究計画: `doc/PHASE_TRANSITION_RESEARCH_PLAN.md`

## 恒久運用ルール

本研究に対して、次のような再開指示が与えられた場合、特に明示的な除外指示がない限り、**研究の続行だけでなく、各工程完了時の研究台帳更新まで含む指示**として扱う。

```text
CURRENT_STATUS.mdを読んで再開して
```

再開後は、各工程について実装・実験・結果監査まで進め、完了時に必要な研究台帳を更新してから次工程へ進む。

必須更新対象:

- `doc/phase-transition/CURRENT_STATUS.md`
- `doc/phase-transition/RESEARCH_LOG.md`
- `doc/phase-transition/DECISION_REGISTER.md`
- `doc/phase-transition/EXPERIMENT_INDEX.md`
- `doc/phase-transition/HYPOTHESES.md`
- 必要に応じて `doc/phase-transition/checkpoints/`

運用原則:

- 過去の判断・結果・数値を黙って上書きしない。
- 解釈を変更した場合は、旧解釈、変更理由、根拠、影響範囲を記録する。
- 実験ごとに入力識別情報、analysisVersion、configHash、commit SHA、Notebook、出力先を残す。
- 工程途中で停止する場合も、再開地点、未完了事項、次に実行する操作を `CURRENT_STATUS.md` に記録する。
- 新しい判断は `DECISION_REGISTER.md`、仮説の支持状況は `HYPOTHESES.md`、時系列経過は `RESEARCH_LOG.md` に反映する。
- 節目となる結果、重要な解釈変更、正式検証開始前にはチェックポイント文書を作成する。

## 現在の研究段階

100局 `pilot-v2` を用いた探索的パイロットの後半。候補抽出・forcingアブレーション・アーキタイプ化・代表局面監査まで完了した。

現在は、候補を単一plyではなく **連続する強制捕獲レジームの内部構造**として再解釈し、次の確認的分析へ進む直前である。

## 現時点で確定したこと

- ランダム開局中と終局観測は候補検出から除外する。
- 候補は隣接plyをクラスタ化した区間として扱う。
- forcingを候補成立の独立特徴群として数えると候補が過剰になる。
- 主閾値 `signal=2.0 / persistence=0.75` では、forcing込み95区間、forcing除外45区間。
- 45区間はA 15、B 30へ分かれ、forcing込みでのみ成立するCは51区間。
- A 15候補は13固有局面・13アーキタイプに集約された。
- A主要6候補はすべて候補plyで `forcedCapture=true` かつ `legalMoveCount=captureMoveCount`。
- 主要6候補の中心現象は、forcingから独立した転移ではなく、強制捕獲レジーム内部の捕獲選択肢構造の急変である。
- `2e79188a987a` と `7360876ad5c7` は監査窓内で `namua → mtaji` へ接続する前兆候補。
- 残る4件は暫定的に「捕獲分岐爆発候補」とする。

## 撤回・修正した解釈

- 撤回: `nearestForcingDistance > 0` を「forcing独立」と呼ぶ。
- 修正: 正しくは「forcing切替非同時」。候補局面自体は強制捕獲状態に含まれる場合がある。
- 撤回: strict閾値だけで独立した戦略的相転移を認定できる。
- 保留: 主要6候補を正式な「戦略的相転移」と認定すること。

## 次工程

### 強制捕獲レジーム分析

各ゲームの連続する `forcedCapture=true` 区間を抽出し、候補について次を測定する。

- レジーム開始・終了ply
- レジーム長
- 候補のレジーム内位置
- 候補前後の捕獲手数平均と持続性
- 捕獲手数が元の水準へ戻るか
- forcing解除までの距離
- `namua → mtaji` までの距離
- 終局までの距離

候補を次へ分類する。

1. 捕獲分岐の急拡大
2. 捕獲分岐の収束
3. 強制捕獲解除前兆
4. `namua → mtaji` 前兆
5. 一時的スパイク

## 次工程の後に必要な作業

1. 候補手の質的特徴量追加
2. 検出定義・閾値・持続期間の事前固定
3. 未使用seedによる確認用コーパス生成
4. AI条件・探索深度横断の頑健性検証
5. 対照群・反例分析
6. 人間による局面評価
7. 統計的検証
8. 正式認定とBao固有語彙化

## 研究データ識別情報

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- corpus: `pilot-v2-analysis-input.zip`
- profile: `pilot-v2`
- games: 100

## 最新の実装

- 最新マージコミット: `c1810f45c582c8147725d67a737b44ec368b8514`
- PR: `#23 Add resumable phase-transition research ledger`

## 再開手順

1. 本ファイルを読む。
2. 本ファイルの「恒久運用ルール」を適用する。
3. `doc/phase-transition/DECISION_REGISTER.md` で採用・撤回判断を確認する。
4. `doc/phase-transition/EXPERIMENT_INDEX.md` で入力、Notebook、成果物を確認する。
5. `doc/phase-transition/checkpoints/2026-07-30-board-audit.md` を読む。
6. `pilot-v2-analysis-input.zip` を用意する。
7. 強制捕獲レジーム分析の実装から再開する。

## 完了済みNotebook

- `notebooks/phase-transition/01-data-audit.ipynb`
- `notebooks/phase-transition/02-transition-candidate-analysis.ipynb`
- `notebooks/phase-transition/03-forcing-ablation.ipynb`
- `notebooks/phase-transition/04-candidate-archetypes.ipynb`
- `notebooks/phase-transition/05-candidate-board-audit.ipynb`
