# 局面相転移点研究 — 現在地

更新日: 2026-07-31  
Status: Active  
研究計画: `doc/PHASE_TRANSITION_RESEARCH_PLAN.md`

## 恒久運用ルール

再開指示は、特に明示的な除外がない限り、研究の続行だけでなく各工程完了時の研究台帳更新まで含む。

必須更新対象:

- `doc/phase-transition/CURRENT_STATUS.md`
- `doc/phase-transition/RESEARCH_LOG.md`
- `doc/phase-transition/DECISION_REGISTER.md`
- `doc/phase-transition/EXPERIMENT_INDEX.md`
- `doc/phase-transition/HYPOTHESES.md`
- 必要に応じて `doc/phase-transition/checkpoints/`

過去の判断・結果・数値は黙って上書きしない。解釈変更時は旧解釈、変更理由、根拠、影響範囲を残す。実験ごとに入力識別情報、analysisVersion、configHash、commit SHA、Notebook、出力先を記録する。

## 現在の研究段階

100局 `pilot-v2` を用いた探索的パイロット後半。

候補抽出、forcingアブレーション、アーキタイプ化、代表局面監査は完了した。強制捕獲レジーム分析（E-008）は実装済みで、固定入力による実行と結果監査が次の再開地点である。

## 現時点で確定したこと

- ランダム開局中と終局観測は候補検出から除外する。
- 候補は隣接plyをクラスタ化した区間として扱う。
- forcingを候補成立の独立特徴群として数えると候補が過剰になる。
- 主閾値 `signal=2.0 / persistence=0.75` ではforcing込み95区間、forcing除外45区間。
- 45区間はA 15、B 30。forcing込みでのみ成立するCは51区間。
- A 15候補は13固有局面・13アーキタイプに集約された。
- A主要6候補はすべて候補plyで `forcedCapture=true` かつ `legalMoveCount=captureMoveCount`。
- 中心現象は、forcingから独立した転移ではなく、強制捕獲レジーム内部の捕獲選択肢構造の急変である。
- `2e79188a987a` と `7360876ad5c7` は `namua → mtaji` 前兆候補。
- 残る4件は暫定的に捕獲分岐爆発候補。

## E-008 実装済み内容

- 連続する `forcedCapture=true` 区間の抽出
- レジーム開始・終了ply、長さ、phase、捕獲手数統計
- 候補と所属レジームの対応付け
- 候補のレジーム内絶対位置・正規化位置
- 候補前平均、候補ply、候補後平均・最大
- 捕獲分岐上昇の持続率と基準水準への回復距離
- forcing解除、`namua → mtaji`、終局までの距離
- 暫定5分類

実装:

- `tools/experiments/lib/forced-capture-regimes.js`
- `tools/experiments/analyze-forced-capture-regimes.js`
- `test/forced-capture-regimes.test.js`
- `notebooks/phase-transition/06-forced-capture-regimes.ipynb`

analysisVersion: `6-forced-capture-regimes`

## 暫定分類

1. `capture-branch-expansion`
2. `capture-branch-convergence`
3. `forcing-release-precursor`
4. `namua-to-mtaji-precursor`
5. `temporary-spike`

分類閾値は探索用であり未固定。実データ監査前に正式採用しない。

## 未完了事項

- `pilot-v2-analysis-input.zip` と `candidate-archetypes.csv` を用いたE-008実行
- 出力件数、候補対応漏れ、距離計算、分類結果の監査
- 主要6候補と全A候補の分類照合
- 閾値感度分析
- 結果に基づく `DECISION_REGISTER.md` と `HYPOTHESES.md` の更新
- E-008完了チェックポイント作成

## 次に実行する操作

1. `pilot-v2-analysis-input.zip` を展開する。
2. `candidate-archetypes.csv` を用意する。
3. `06-forced-capture-regimes.ipynb` またはCLIを実行する。
4. `forced-capture-regimes.csv`、`candidate-regime-metrics.csv`、summary JSONを監査する。
5. 盤面監査結果と分類を照合する。
6. 研究台帳を更新してE-008を完了扱いにする。

## 研究データ識別情報

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- corpus: `pilot-v2-analysis-input.zip`
- profile: `pilot-v2`
- games: 100

## 完了済みNotebook

- `01-data-audit.ipynb`
- `02-transition-candidate-analysis.ipynb`
- `03-forcing-ablation.ipynb`
- `04-candidate-archetypes.ipynb`
- `05-candidate-board-audit.ipynb`

## 実装済み・未実行Notebook

- `06-forced-capture-regimes.ipynb`
