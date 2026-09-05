# Position Evaluation / Win-Rate Calibration Study 1 — Reproducibility Index （再現性）

## 日本語での要点

formal decisionはINCONCLUSIVEで、校正modelをformalに確認したとは扱わない。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

更新日: 2026-08-20  
Status: **CLOSED / FORMAL INCONCLUSIVE**

## Repository / branch identity （識別と表現）

```text
baseline main = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
research branch = research/position-evaluation-winrate-calibration
```

## Stage 1 （Stageの記録）

```text
stageId = PEC-S1-EXPLORATORY-2026-08-18-v1
spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
seeds = 22200001..22201024
```

Stage 0 smoke:

```text
smokeId = PEC-S0-SMOKE-2026-08-18-v1
smoke SHA-256 = 11172d1a31d5716b40a5dd8d4cf092d0e7d6142c6b2299d30e6591e305d007f8
validated source commit = 28bb3ba1782c2ed7ea4c78a4dd962c96c782cd0a
```

Stage 1 production:

```text
generation manifest SHA-256 = 0a1ad53c2ac5dff272b771d6b9c48ca26b349aad650029a5d13464c0aa990813
selection/measurement summary SHA-256 = 1e843c9fbc3f286f2e6bc17a99e6590b51f636d09b051ff73fa96228fb756d73
verification SHA-256 = 6b4e08a11b1145337410036a697e81f7c7f2408378f4584bc1a2b27cef76ff21
selectionHash = 29b270b7dbfca8ef67c393c60f6232694c629b80228665eb1166dddeb257dd79
measurementHash = 0c32a56f8724beb87d0d69cf01288c9655e769526fb384384c57cf356f70eafa
```

Stage 1 analysis:

```text
analysisId = PEC-S1-CALIBRATION-DEVELOPMENT-2026-08-19-v1
analysis method freeze SHA-256 = 72ac928403c1465d40d4bee0f849a847761381260be29742f7ffbd65e413c71c
stage1 result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
selected family = phase-stratified-isotonic
fullFit canonical JSON SHA-256 = 94bad0adc157503a729709d138b973f99dd213ad7bd926ad6d525e207060e343
```

## Stage 2 （Stageの記録）

```text
stageId = PEC-S2-FORMAL-2026-08-20-v1
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
seeds = 22300001..22302048
```

Technical smoke:

```text
smokeId = PEC-S2-SMOKE-2026-08-20-v1
smoke SHA-256 = 5cf0e2276f997cca689d52b8304e42dc1ac9df96769b7a7e858535e7c38628d2
source commit = fbb84549713b0b699fc32ea87345112b378d9e5a
```

Authorization:

```text
authorization commit = 2b4b186f8fd51912c5b4ed52fa0f1a6c6672e8a2
authorization SHA-256 = e0513a4bc33f9029b485dce9674a21601a91f0d094ea7de455ed29e75b362d26
```

Stage 2 production / verification:

```text
generation manifest SHA-256 = 1b5aae5333bc9b02a36fc72cbaf2514a303f9bfd5fae97ceb0ad530d4828e71b
selection/measurement summary SHA-256 = 575caef5058cb3d04209708b7e04f0f09381f7beea6d41706624cb73534f1b51
verification SHA-256 = 10790c52ec15bf89dfd301942d91424504bf5bf2afd7230182382d33134515ff
selectionHash = 8fcb8400d0e404fc8edfc98e1683b01a92ab640bd917e000afa689d068eb7f4d
measurementHash = 373d780504814999466c3bc822a17b048054e8079b1c000e903a503cac9d1a33
```

Stage 2 formal result:

```text
canonical local result SHA-256 = 94602023bdf8e9086703cbff44a68a9a070ada85c0bdbb2aaad104ffbd0b5405
formalDecision = INCONCLUSIVE
```

## Canonical machine-readable repository summaries （リポジトリ状態）

```text
results/STAGE_1_READINESS_AUDIT.json
results/STAGE_1_CALIBRATION_RESULT_SUMMARY.json
results/STAGE_2_READINESS_AUDIT.json
results/STAGE_2_FORMAL_RESULT_SUMMARY.json
```

## Core preregistration / authorization records （日本語の要点）

```text
preregistration/STAGE_0_DESIGN_FREEZE.json
preregistration/STAGE_1_EXPLORATORY_SPEC.json
preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json
preregistration/STAGE_1_ANALYSIS_METHOD_FREEZE.json
preregistration/STAGE_2_FORMAL_SPEC.json
preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
```

## Core tooling （日本語の要点）

```text
tools/experiments/lib/position-evaluation-calibration-common.js
tools/experiments/run-position-evaluation-calibration-stage0-smoke.js
tools/experiments/run-position-evaluation-calibration-stage1.js
tools/experiments/verify-position-evaluation-calibration-stage1.js
tools/experiments/analyze-position-evaluation-calibration-stage1.js

tools/experiments/lib/position-evaluation-calibration-stage2-common.js
tools/experiments/run-position-evaluation-calibration-stage2-smoke.js
tools/experiments/run-position-evaluation-calibration-stage2.js
tools/experiments/verify-position-evaluation-calibration-stage2.js
tools/experiments/evaluate-position-evaluation-calibration-stage2.js
```

## Contract tests （日本語の要点）

```text
test/position-evaluation-calibration-stage0.test.js
test/position-evaluation-calibration-stage1-analysis.test.js
test/position-evaluation-calibration-stage2.test.js
```

## Final interpretation boundary （結論）

The archived Stage 2 result is `INCONCLUSIVE` because frozen estimability gates failed. Reproduction should reproduce that gate state and decision; descriptive performance values are not a substitute for the formal decision.
