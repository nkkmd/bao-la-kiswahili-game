# Current Status — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-20
Status: **STAGE 1 MODEL SELECTED / STAGE 2 TECHNICAL VALIDATION PASS / STAGE 2 FORMAL GENERATION AUTHORIZED / FORMAL OUTCOME NOT YET EVALUATED**

## Repository identity

```text
baseline main HEAD = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
study branch = research/position-evaluation-winrate-calibration
Stage 0 validated source commit = 28bb3ba1782c2ed7ea4c78a4dd962c96c782cd0a
Stage 1 generation source commit = c97a4f620f1a0da4e013ed55eb0fcf37fec16bf4
Stage 1 analysis source commit = b02fff06a63f1908cf74d1713d6a681c58c04269
Stage 2 technical-smoke source commit = fbb84549713b0b699fc32ea87345112b378d9e5a
Stage 2 authorization commit = 2b4b186f8fd51912c5b4ed52fa0f1a6c6672e8a2
```

No closed-study formal decision has been changed.

## Stage 1 scientific corpus

```text
spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
games = 1024
seeds = 22200001..22201024
unique historical trajectories = 872
selected unique rule states = 830
Namua = 430
Mtaji = 400
administrative truncation = 0
measurementHash = 0c32a56f8724beb87d0d69cf01288c9655e769526fb384384c57cf356f70eafa
independent verification = PASS, zero replay/measurement mismatches
readiness = PASS
```

Stage 1 remains permanently exploratory and cannot be reused as formal confirmation evidence.

## Stage 1 calibration development result

Returned artifact:

```text
stage1-exploratory-calibration-result.json
SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
analysisId = PEC-S1-CALIBRATION-DEVELOPMENT-2026-08-19-v1
```

### Candidate eligibility

Phase-aware logistic:

```text
eligible = false
failed fold = 1
failed phase = Mtaji
reason = maximum-iterations-without-gradient-convergence
iterations = 100
max |gradient| = 4.513435944430988e-10
tolerance = 1e-10
```

The frozen no-rescue rule forbids tolerance relaxation, alternate optimizer, regularization, or another family.

Phase-stratified isotonic:

```text
eligible = true
pooled CV Brier = 0.1532240986334561
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
```

Frozen selection:

```text
selected family = phase-stratified-isotonic
selection reason = only-eligible-candidate
Stage 1 development status = MODEL-SELECTED-EXPLORATORY
```

### Frozen full fit

```text
Namua: 327 support points -> 24 nondecreasing blocks; n=430
Mtaji: 363 support points -> 200 nondecreasing blocks; n=400
fullFit canonical JSON SHA-256 = 94bad0adc157503a729709d138b973f99dd213ad7bd926ad6d525e207060e343
```

The marked Stage 1 phase difference in exploratory CV performance is recorded but is not a formal phase-effect claim.

Machine-readable compact record:

```text
doc/position-evaluation-calibration/results/STAGE_1_CALIBRATION_RESULT_SUMMARY.json
```

## Stage 2 formal freeze

Formal spec:

```text
doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_SPEC.json
stageId = PEC-S2-FORMAL-2026-08-20-v1
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
```

Fresh population:

```text
games = 2048
seeds = 22300001..22302048
opening = 8-ply seeded-uniform exact E.moveVariants
continuation = hard / bao / phase2 / D2 / Infinity
max ply = 160
```

The Stage 1 isotonic mapping is hash-bound. Stage 2 refitting/smoothing/clipping for the primary Brier calculation is forbidden.

### Cross-stage identity firewall

No selected Stage 2 observation may overlap Stage 1 on:

```text
historicalTrajectoryHash — reference universe: all Stage 1 generated games
openingPrefixHash — reference universe: all Stage 1 generated games
ruleStateKey — reference universe: all Stage 1 observations
```

Overlaps are excluded without replacement. No extra games or seed extension are authorized.

### Stage 2 readiness

```text
historical trajectories after Stage 1 trajectory/opening firewall >= 1600
selected unique rule states >= 1500
Namua >= 650
Mtaji >= 650
distinct opening prefixes >= 400
distinct static evaluations per phase >= 100
actor wins/losses per phase >= 150 each
administrative truncation <= 1%
final cross-stage identity overlap = 0 on all three identities
independent verification = PASS
```

Any failed gate yields formal `INCONCLUSIVE` and does not authorize replacement.

### Primary formal rule

Reference probabilities frozen from Stage 1:

```text
Namua = 0.4418604651162791
Mtaji = 0.5
```

`CONFIRMED` requires all:

```text
paired Brier-skill one-sided 95% bootstrap lower bound > 0
pooled frozen-model Brier <= 0.18
Namua frozen-model Brier <= 0.25
Mtaji frozen-model Brier <= 0.12
```

If all gates pass but any criterion fails: `NOT-CONFIRMED`.

If any estimability/identity gate fails: `INCONCLUSIVE`.

No secondary metric may rescue the primary result.

## Stage 2 technical validation

Returned non-scientific smoke:

```text
smokeId = PEC-S2-SMOKE-2026-08-20-v1
smoke artifact SHA-256 = 5cf0e2276f997cca689d52b8304e42dc1ac9df96769b7a7e858535e7c38628d2
source commit = fbb84549713b0b699fc32ea87345112b378d9e5a
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
passed = true
scientificGeneration = false
formalInferencePerformed = false
stage2GenerationAuthorized = false during smoke
smoke seeds = 990101..990108
scientificReuseAllowed = false
deterministicReplay = true
stage1ResultHashVerified = true
stage1MeasurementHashVerified = true
finiteFrozenModelPredictions = true
sourceTreeDirty = false
authorizationFilePresent = false during smoke
generationAuthorizedBySpecAlone = false
```

The smoke is technical only and is permanently excluded from formal evidence.

A separate authorization now exists:

```text
doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
authorization commit = 2b4b186f8fd51912c5b4ed52fa0f1a6c6672e8a2
```

It is bound to the exact Stage 2 spec SHA-256 and exact source-file SHA-256 mapping returned by the passing smoke.

## Current authorization state

```text
Stage 1 exploratory development = COMPLETE / MODEL SELECTED
Stage 1 formal claim = NOT AUTHORIZED
Stage 2 technical validation = PASS
Stage 2 scientific generation = AUTHORIZED
Stage 2 outcome-blind selection/measurement = AUTHORIZED after generation
Stage 2 independent verification = REQUIRED before formal evaluation
Stage 2 formal evaluation = AUTHORIZED only after verification + estimability/identity gates
Stage 1 refit = FORBIDDEN
outcome-dependent extension / seed extension / replacement = FORBIDDEN
formal Stage 2 outcome = NOT YET EVALUATED
```

Next required sequence: generate exactly the frozen 2048-game Stage 2 corpus, perform outcome-blind selection/measurement, then run the independent verifier. Return the generation manifest, Stage 2 selection/measurement summary, and verification JSON for audit **before** running the formal evaluator.
