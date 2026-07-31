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

過去の判断・結果・数値は黙って上書きしない。解釈変更時は旧解釈、変更理由、根拠、影響範囲を残す。

## 現在の研究段階

100局 `pilot-v2` を用いた探索的パイロット後半。

候補抽出、forcingアブレーション、アーキタイプ化、主要6候補監査、全Aアーキタイプ13件の強制捕獲レジーム分析まで完了した。次工程は候補外レジームを用いた対照分析と分類閾値感度分析である。

## 現時点で確定したこと

- 主閾値ではA 15区間、13固有局面・13アーキタイプ。
- 全13アーキタイプが連続する強制捕獲レジーム内に所属し、対応漏れは0。
- 100局再生成では5650観測、421強制捕獲レジームを得た。
- 修正後の探索的分類は、捕獲分岐急拡大3、`namua → mtaji` 前兆3、forcing解除前兆6、一時的スパイク1。
- 捕獲分岐急拡大は `9f778d512ae1`、`22807aff1baf`、`6b364e603366`。
- `namua → mtaji` 前兆は `0a11b2c44bc5`、`7360876ad5c7`、`2e79188a987a`。
- 一時的スパイクは `0eb352745c9b`。
- 終局近傍のmtaji候補6件は、mtaji前兆ではなくforcing解除前兆に分類された。
- 正式な戦略的相転移認定と分類閾値固定は引き続き保留する。

## 重要な修正

初回の全A分析では、候補時点ですでに `mtaji` の候補に `distanceToMtaji=0` を与え、mtaji前兆と誤分類していた。

修正後は次を要件とする。

- 候補時点のphaseが `namua`
- 候補より後に初回の `mtaji` が存在する
- その距離がevent window以内

これにより、初回結果の「mtaji前兆9件」は撤回し、修正後の3件を採用する。

## E-008 全A分析

- analysisVersion: `6-forced-capture-regimes`
- source replication commit: `1a6fed9b98410f0bd3ee9c4cfdad0cb3ea8756f0`
- GitHub Actions run: `30615605472`
- artifact digest: `sha256:1a6d937dd22908841aae3b211505fb601a8304817c376ffc7fefee655e2cda26`
- games: 100
- observations: 5650
- regimes: 421
- candidates: 13 archetypes
- candidates outside regimes: 0

## 次工程

1. 421レジームから候補外対照群を構成する。
2. 捕獲分岐急増、forcing解除前兆、mtaji前兆の基準率を測定する。
3. `expansionDelta`、`persistenceFraction`、`eventWindow` の感度分析を行う。
4. 終局近傍除外幅と強制捕獲レジーム最低長を検討する。
5. 候補手の質的特徴量を追加する。
6. 未使用seedによる確認用コーパスを生成する。

## 研究データ識別情報

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- profile: `pilot-v2`
- games: 100

## 完了済みNotebook

- `01-data-audit.ipynb`
- `02-transition-candidate-analysis.ipynb`
- `03-forcing-ablation.ipynb`
- `04-candidate-archetypes.ipynb`
- `05-candidate-board-audit.ipynb`
- `06-forced-capture-regimes.ipynb`
