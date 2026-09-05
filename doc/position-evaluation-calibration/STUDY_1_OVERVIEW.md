# Position Evaluation / Win-Rate Calibration Study 1 — Overview （概要）

更新日: 2026-08-20  
Status: **CLOSED / FORMAL INCONCLUSIVE**

## 研究題目

> **Baoにおける形勢評価値と実現勝率の校正 — phase-aware empirical win-probability calibration と評価値の解釈境界**

## 何を調べたか

Bao engineの内部評価値を、そのまま「勝率」とみなさず、固定した局面母集団と継続方策のもとで実現するempirical continuation win probabilityへ対応付けられるかを調べた。

本研究では次を明確に分離した。

```text
engine evaluation
empirical continuation win probability
game-theoretic value
human perception of advantage
```

Primary scoreはactor-perspectiveのstatic `bao` evaluationである。

## Stage 0 — 測定と設計

評価値のperspective、phase-specific weights、terminal score、deterministic continuation、administrative truncation、trajectory/state identityを監査し、Stage 1/2をprospectiveに分離した。

Stage 1とStage 2はfresh seed blockを使い、Stage 1の結果をStage 2 confirmation evidenceとして再利用しない設計とした。

## Stage 1 — exploratory calibration development （Stageの記録）

Fresh exploratory corpus:

```text
1024 games
seeds 22200001..22201024
selected binary states = 830
Namua = 430
Mtaji = 400
independent verification = PASS
readiness = PASS
```

候補model familyは事前に2つへ限定した。

```text
phase-aware logistic
phase-stratified isotonic PAVA
```

Phase-aware logisticは5-fold CVのfold 1 / Mtajiで、100 iterations後も凍結済みgradient tolerance `1e-10`を満たさずineligibleとなった。alternate optimizerやtolerance緩和による救済は行わなかった。

Phase-stratified isotonicはeligibleだった。

```text
pooled CV Brier = 0.1532240986334561
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
```

したがってfrozen selection ruleにより:

```text
selected family = phase-stratified-isotonic
Stage 1 status = MODEL-SELECTED-EXPLORATORY
```

となった。

## Stage 2 — fresh formal evaluation （Stageの記録）

Fresh formal corpus:

```text
2048 games
seeds 22300001..22302048
```

全2048局を独立verifierで再生し、game replay mismatch 0、measurement mismatch 0、measurement hash一致を確認した。

Stage 1とのcross-stage overlapも最終的にすべて0だった。

```text
historicalTrajectoryHash = 0
openingPrefixHash = 0
ruleStateKey = 0
```

しかし、事前登録したestimability gateのうち3項目が未達だった。

```text
unique trajectories after Stage 1 firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

そのためformal decision ruleにより:

```text
OVERALL FORMAL DECISION = INCONCLUSIVE
```

となった。

これはcalibrationが失敗したことを意味しない。formal questionを判定するための凍結済みminimum-support条件を満たせなかったため、確認も棄却もできなかったという結果である。

## Descriptive performance （日本語の要点）

Formal gate failure後の値は記述的参考のみである。

```text
pooled frozen-model Brier = 0.15550141283724248
phase-only reference Brier = 0.2510612273133199
observed paired Brier skill = +0.09555981447607745

Namua Brier = 0.22678074548187638
Mtaji Brier = 0.08012948693071474
```

これらは事前のabsolute Brier thresholds以下だったが、estimability gateが先に失敗しているためformal criteriaとしては未評価である。paired bootstrapも実行対象外であり、この見かけ上良好な値から`CONFIRMED`へ救済しない。

またexact unclipped log lossでは、isotonicの0/1 boundary predictionに対する反例が7件あり、pooled log lossは非有限となった。

## 最終結論

Study 1で確立できたのは:

- evaluationとempirical win probabilityを分離する測定枠組み;
- phase-aware calibration development pipeline;
- Stage 1でのfrozen isotonic mapping;
- fresh Stage 2 corpusの完全なreplay/measurement verification;
- Stage 1/2 identity leakageを0にするfirewall;
- formal estimability failureを結果後に救済しないdecision discipline。

一方、held-out calibration generalizationそのものはformalには解決しなかった。

```text
OVERALL FORMAL DECISION = INCONCLUSIVE
```

## 次に何をすべきか

同じStage 2 dataに追加game、replacement、threshold緩和、mapping refitを加えてStudy 1を救済してはならない。

calibration generalizationを再検証するなら、fresh prospective replicationとして、Stage 1とのidentity firewallによる実効sample lossを事前に見込んだpopulation/gate設計を固定して新しいseed blockを使う。

悪手・錯覚研究へ進むこと自体は可能だが、本Study 1のisotonic mappingを「formalにvalidatedされた勝率」として扱ってはならない。使用する場合はexploratory/descriptive calibrationとして明示し、formal severity endpointはfresh continuation outcomesなど独立に定義するのが適切である。

## 詳細

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`STAGE_2_FORMAL_RESULT.md`](STAGE_2_FORMAL_RESULT.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
