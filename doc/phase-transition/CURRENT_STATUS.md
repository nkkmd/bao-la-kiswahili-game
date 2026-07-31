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

候補抽出、forcingアブレーション、アーキタイプ化、盤面監査、全A候補の強制捕獲レジーム分析、候補外対照・分類感度分析、終局距離層別分析まで完了した。

## 現時点で確定したこと

- 主設定でA 15区間、13アーキタイプ。
- 全Aアーキタイプが強制捕獲レジーム内に所属する。
- 100局再生成は5650観測、421レジーム。
- 捕獲分岐急拡大は候補33.3%、対照2.9%で、A候補の最も強い識別分類である。
- mtaji前兆は候補20.0%、対照16.8%で、現在の定義単独では識別力が弱い。
- forcing解除前兆6件は全て終局まで0–4plyの候補に集中した。
- 終局まで9ply以上残るA候補8件ではforcing解除前兆0件。対応する対照群では576/4062（14.2%）。
- よってA候補におけるforcing解除前兆の濃縮は、独立した戦略転移ではなく終局近傍効果で説明される。
- 主要候補の正式な戦略的相転移認定は保留する。

## E-012 対照・感度分析

A候補15区間の代表plyを候補群とし、候補区間前後8plyを除いた強制捕獲中の適格4127plyを対照群とした。

| 分類 | 候補率 | 対照率 | 倍率 |
|---|---:|---:|---:|
| 捕獲分岐急拡大 | 33.3% | 2.9% | 11.46 |
| forcing解除前兆 | 40.0% | 14.9% | 2.68 |
| mtaji前兆 | 20.0% | 16.8% | 1.19 |
| 一時的スパイク | 6.7% | 54.0% | 0.12 |
| 捕獲分岐収束 | 0% | 11.3% | 0 |

## E-013 終局距離層別分析

forcing解除前兆を終局までの残りplyで層別化した。

| 終局距離 | A候補 | forcing解除前兆 | 対照 | forcing解除前兆 |
|---|---:|---:|---:|---:|
| 0–4ply | 7 | 6（85.7%） | 0 | 比較不能 |
| 5–8ply | 0 | 0 | 65 | 40（61.5%） |
| 9–16ply | 1 | 0 | 711 | 246（34.6%） |
| 17ply以上 | 7 | 0 | 3351 | 330（9.8%） |

対照群は分析後窓8plyを確保する設計のため0–4plyを含まない。直接比較可能な9ply以上では、A候補8件中0件、対照4062件中576件（14.2%）であった。

この結果により、全A分類の `forcing-release-precursor` 6件は終局近傍サブタイプへ再解釈する。

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

### 終局距離層別分析

- analysisVersion: `8-terminal-distance-summary`
- implementation commit: `2a3b13420ef403b49d66c15b307510b33843669f`
- workflow commit: `652c73289379b4387c84f51d63de6107cf52ed1f`
- workflow: `Phase Transition Terminal Strata`

## 次工程

1. 捕獲分岐急拡大の閾値候補を事前固定する。
2. 候補手の質的特徴量として最大捕獲量、relay長、評価差を追加する。
3. 未使用seed確認用コーパスを生成する。
4. AI条件・探索深度横断の頑健性を検証する。
5. 終局近傍候補を主たる相転移候補から除外する正式ルールを検討する。

## 研究データ識別情報

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- profile: `pilot-v2`
- games: 100
