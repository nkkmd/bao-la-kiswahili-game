# 局面相転移点研究 — 現在地

更新日: 2026-07-31  
Status: Active  
研究計画: `doc/PHASE_TRANSITION_RESEARCH_PLAN.md`

## 恒久運用ルール

再開指示は研究続行と工程完了時の研究台帳更新を含む。過去結果は黙って上書きせず、解釈変更の理由・根拠・影響を記録する。

必須更新対象:

- `CURRENT_STATUS.md`
- `RESEARCH_LOG.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `HYPOTHESES.md`
- 必要に応じて `checkpoints/`

## 現在の研究段階

100局 `pilot-v2` の探索的パイロット後半。

候補抽出、forcingアブレーション、アーキタイプ化、盤面監査、全A候補の強制捕獲レジーム分析、候補外対照・分類感度分析まで完了した。

## 現時点で確定したこと

- 主設定でA 15区間、13アーキタイプ。
- 全Aアーキタイプが強制捕獲レジーム内に所属する。
- 100局再生成は5650観測、421レジーム。
- 全A分類は捕獲分岐急拡大3アーキタイプ、mtaji前兆3、forcing解除前兆6、一時的スパイク1。
- mtaji前兆は候補時点がnamuaで、将来の初回mtajiがevent window内にある場合だけ成立する。
- 主要候補の正式な戦略的相転移認定は保留する。

## E-012 対照・感度分析

A候補15区間の代表plyを候補群とし、候補区間前後8plyを除いた強制捕獲中の適格4127plyを対照群とした。

主設定結果:

| 分類 | 候補率 | 対照率 | 倍率 |
|---|---:|---:|---:|
| 捕獲分岐急拡大 | 33.3% | 2.9% | 11.46 |
| forcing解除前兆 | 40.0% | 14.9% | 2.68 |
| mtaji前兆 | 20.0% | 16.8% | 1.19 |
| 一時的スパイク | 6.7% | 54.0% | 0.12 |
| 捕獲分岐収束 | 0% | 11.3% | 0 |

感度設定:

- `expansionDelta`: 2 / 3 / 4
- `persistenceFraction`: 0.25 / 0.5 / 0.75
- `eventWindow`: 5 / 8 / 12
- 合計27設定

主要解釈:

- 捕獲分岐急拡大は全27設定で候補側に濃縮し、A候補の最も強い識別分類である。
- forcing解除前兆も候補側に濃縮するが、終局近傍効果の分離が必要。
- mtaji前兆は対照群との差が小さく、現在の定義単独では候補固有性が弱い。
- 対照群では一時的スパイクが54.0%を占め、候補検出器の持続性要件が一過性変動を除外している。

## 再現情報

### 全Aレジーム分析

- analysisVersion: `6-forced-capture-regimes`
- commit: `1a6fed9b98410f0bd3ee9c4cfdad0cb3ea8756f0`
- Actions run: `30615605472`

### 対照・感度分析

- analysisVersion: `7-forced-capture-regime-controls`
- commit: `463f8059ce41fe0a828ae77541acf284ecb6b79f`
- Actions run: `30616999870`
- artifact digest: `sha256:8d64b6d923a5bf1f44c883e4465a8147c990acba7e6071389ef18ffb778a2b7a`

## 次工程

1. forcing解除前兆から終局近傍効果を分離する。
2. 候補手の質的特徴量として最大捕獲量、relay長、評価差を追加する。
3. 捕獲分岐急拡大の閾値候補を事前固定する。
4. 未使用seed確認用コーパスを生成する。
5. AI条件・探索深度横断の頑健性を検証する。

## 研究データ識別情報

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- profile: `pilot-v2`
- games: 100
