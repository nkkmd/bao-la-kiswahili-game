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

候補抽出、forcingアブレーション、アーキタイプ化、代表局面監査、主要6候補の強制捕獲レジーム監査まで完了した。E-008の実装は完了し、主要6候補について決定論的再生成による結果監査も完了した。全A候補15区間の一括実行と閾値感度分析は未完了である。

## 現時点で確定したこと

- ランダム開局中と終局観測は候補検出から除外する。
- 候補は隣接plyをクラスタ化した区間として扱う。
- forcingを候補成立の独立特徴群として数えると候補が過剰になる。
- 主閾値 `signal=2.0 / persistence=0.75` ではforcing込み95区間、forcing除外45区間。
- 45区間はA 15、B 30。forcing込みでのみ成立するCは51区間。
- A 15候補は13固有局面・13アーキタイプに集約された。
- A主要6候補はすべて候補plyで `forcedCapture=true` かつ `legalMoveCount=captureMoveCount`。
- 主要6候補はすべて連続する強制捕獲レジーム内に位置する。
- 主要6候補の探索的分類は、捕獲分岐急拡大3、`namua → mtaji` 前兆2、一時的スパイク1。
- `2e79188a987a` はmtajiまで5ply、forcing解除まで8ply。
- `7360876ad5c7` はmtajiまで7ply、forcing解除まで7ply。
- `0eb352745c9b` は候補plyの捕獲手数が8まで増えるが、後続8plyの持続率が0.25で一時的スパイクに分類された。
- `9f778d512ae1`、`22807aff1baf`、`6b364e603366` は捕獲分岐急拡大に分類された。
- 正式な「戦略的相転移」の認定は引き続き保留する。

## E-008 実装・監査

実装:

- `tools/experiments/lib/forced-capture-regimes.js`
- `tools/experiments/analyze-forced-capture-regimes.js`
- `tools/experiments/run-priority-forced-capture-regime-audit.js`
- `test/forced-capture-regimes.test.js`
- `notebooks/phase-transition/06-forced-capture-regimes.ipynb`

主要6候補監査:

- analysisVersion: `6-priority-forced-capture-regime-audit`
- commit: `fd0bfd02c7ba65b6efd53bd11ced1ba73f74e017`
- GitHub Actions run: `30614184554`
- artifact: `phase-transition-ci-artifacts`
- artifact digest: `sha256:4a8c5aebec05f766687508cba80dc422d682bdd8a40455bb30411a884d55e9a5`
- games: 6
- observations: 332
- forced-capture regimes: 26
- candidates outside regimes: 0

## 暫定分類結果

| archetypeId | 分類 | レジーム位置 | 捕獲手数変化 | mtajiまで | forcing解除まで |
|---|---|---:|---:|---:|---:|
| `9f778d512ae1` | 捕獲分岐急拡大 | 4 / 46 | 2.00 → 8 | 37 | 42 |
| `22807aff1baf` | 捕獲分岐急拡大 | 22 / 39 | 2.00 → 9 | 14 | 17 |
| `0eb352745c9b` | 一時的スパイク | 23 / 46 | 3.67 → 8 | 12 | 23 |
| `2e79188a987a` | `namua → mtaji` 前兆 | 13 / 21 | 3.33 → 9 | 5 | 8 |
| `7360876ad5c7` | `namua → mtaji` 前兆 | 33 / 40 | 4.33 → 9 | 7 | 7 |
| `6b364e603366` | 捕獲分岐急拡大 | 5 / 44 | 1.67 → 7 | 35 | 39 |

分類閾値は探索用であり、全A候補・対照群・新規seedでの検証前には固定しない。

## 次工程

1. 全A候補15区間を固定入力で一括実行する。
2. 分類閾値の感度分析を行う。
3. 候補外の強制捕獲レジームを対照群として分岐急増の基準率を測定する。
4. 候補手の質的特徴量（最大捕獲量、relay長、評価差）を追加する。
5. 検出定義・閾値・持続期間を事前固定する。
6. 未使用seedによる確認用コーパスを生成する。

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

## 実装済みNotebook

- `06-forced-capture-regimes.ipynb`
