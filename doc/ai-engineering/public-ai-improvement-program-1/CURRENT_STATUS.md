# `PBAI-P1` — 現在の状態

更新日: 2026-08-26
Program: `Generation-1 Evidence-Informed Public Bao AI Improvement Program 1`（正式Program名）
状態: **`COMPLETE / KEEP-AI-GEN2`**

`PBAI-P1`は完了しています。5件のcandidateにはすべて最終状態があり、validation、release holdout、公開deploymentへ進んだ候補はありません。現在の公開AI系統は`AI-GEN2`です。

## 最終状態

```text
PROGRAM = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
PBAI-A Research Generation 1 evidence audit = COMPLETE
PBAI-B AI-GEN2 exact public baseline = COMPLETE
PBAI-C global benchmark / non-regression / release gates = COMPLETE / FROZEN
AI-GEN2 exact baseline ID = AI-GEN2-BASELINE-2026-08-26-v1
PBAI-C gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
PBAI-C001-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #61 CLOSED WITHOUT MERGE
PBAI-C002-v1 = NON-ESTIMABLE / HOLD / PR #55 CLOSED WITHOUT MERGE
PBAI-C003-v1 = NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD / PR #63 CLOSED WITHOUT MERGE
PBAI-C004-v1 = DEVELOPMENT-BENEFIT-FAIL / HOLD / PR #58 CLOSED WITHOUT MERGE
PBAI-C005 = NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD / CLOSED WITHOUT IMPLEMENTATION
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
AUTHORIZED-FOR-DEVELOPMENT = 0
active candidate implementations = 0
isolated development implementation attempts = 3
public/main candidate implementations = 0
validation execution = NOT-AUTHORIZED / NOT-EXECUTED
release holdout execution = NOT-AUTHORIZED / NOT-EXECUTED
candidate release decisions = 0
public deployments caused by PBAI-P1 = 0
public AI code changed by PBAI-P1 = false
original candidate inventory remaining = 0
Research Generation 2 evidence included = false
```

## Candidate別の判断

### `PBAI-C001-v1` — 最終判断

事前supportとpremetric safetyはPASSしましたが、固定したdecision-quality benefitの複合条件を満たしませんでした。

```text
TopSet agreement delta = +0.015625; required >= +0.05 => FAIL
mean normalized rank-loss delta = -0.011718750000000028; required <= -0.02 => FAIL
severe-loss-rate excess = +0.015625; required <= 0 => FAIL
catastrophic new loss count = 0 => PASS
median search-work ratio = 0.2772631454984396 => PASS
```

最終状態は`DEVELOPMENT-BENEFIT-FAIL / HOLD`です。計算量の改善を理由にquality gateを緩和せず、PR #61はmergeしていません。

### `PBAI-C002-v1` — 最終判断

```text
eligible target roots = 5
minimum estimable = 48
candidate benefit metrics = NOT EXECUTED
```

対象数がestimability条件を満たさなかったため`NON-ESTIMABLE / HOLD`です。`TM-S2-C03 = CONFIRMED`は不変で、PR #55はmergeしていません。

### `PBAI-C003-v1` — 最終判断

strict RAW identity bindingが、practical reachability測定より前に失敗しました。

```text
failure stage = STRICT-RAW-IDENTITY-BINDING
failure reason = ORACLE-STORED-ROW-REHASH-MISMATCH
identity difference = pending
reachability measurement executed = false
trajectoriesWithNonterminalOracleHit = null / unmeasured
uniqueNonterminalOracleStatesHit = null / unmeasured
zero-hit conclusion = NOT AUTHORIZED
```

最終状態は`NON-ESTIMABLE-PRACTICAL-REACHABILITY / HOLD`です。hit countは未測定であり、0件という結論ではありません。PR #63はmergeしていません。

### `PBAI-C004-v1` — 最終判断

事前supportとsafetyはPASSしましたが、固定したintended-benefit endpointを満たしませんでした。

```text
median nodes(candidate/baseline) = 1.000
required <= 0.950
result = FAIL
```

最終状態は`DEVELOPMENT-BENEFIT-FAIL / HOLD`で、PR #58はmergeしていません。

### `PBAI-C005` — 最終判断

現行の公開UI、AI code、diagnostic、calibration文書をread-onlyで監査しました。engine evaluationをvalidated Bao win probability、winning chance、win rate、confidence probabilityとして表示または公開する箇所はありませんでした。

```text
actionable current production semantics defect = false
implementation required = false
implementation created = false
```

最終状態は`NO-ACTIONABLE-CURRENT-PRODUCTION-SEMANTICS-DEFECT / HOLD`で、実装せずに閉じました。

## Baselineと研究証拠

```text
exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
scientific evidence cutoff = 2db7c4d65771066e914f32cbc4116fcc3e9e386a
frozen public engine SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
frozen public AI SHA-256 = 2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
```

Research Generation 2はこのProgramの証拠に含めていません。Program途中の新しい研究結果をcandidate設計やthresholdへ流入させないための境界です。

## 科学的境界

- Position Evaluation / Win-Rate Calibration Study 1は`INCONCLUSIVE`であり、engine scoreはvalidated Bao win probabilityではありません。
- Position Complexity / Difficulty Study 1は`INCONCLUSIVE`であり、machine search complexityはhuman difficultyではありません。
- Tactical Motif Human / Expert Validation Study 1は`INCONCLUSIVE-NOT-ESTIMABLE / N=0`です。
- Restricted Endgame Study 1のexactnessはfrozen 8-state domainに限られます。
- `ORISC-STUDY1`は`ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`で、unvalidated symmetry / canonicalizationは未承認です。

Research Generation 1のauthoritative RAW identityは次のとおりです。

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
```

current `AI.stateKey`は`pending`を含まないため、研究由来のexact tablebase keyとしては使えません。

## Release状態

候補がvalidation-ready / release-candidateへ到達しなかったため、保護されたholdoutにはアクセスしていません。

```text
public adoption = NONE
formal ADOPT = NONE
release candidate = NONE
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

未実行をnegative resultへ読み替えず、同じcandidate versionのthreshold変更やseed追加による救済も行いません。

## 正本

- [`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md) — Program全体の最終報告
- [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md) — candidate台帳
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — 判断記録
- [`RELEASE_REGISTER.md`](RELEASE_REGISTER.md) — release記録
- [`C005_PRODUCTION_SURFACE_AUDIT.md`](C005_PRODUCTION_SURFACE_AUDIT.md) — C005の監査

新しいAI改善はPBAI-P1を再開せず、新しいProgram identityとevidence cutoffを用いて開始する必要があります。
