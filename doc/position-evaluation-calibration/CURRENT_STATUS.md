# Current Status — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-20
Status: **STAGE 2 GENERATED / INDEPENDENT VERIFICATION PASS / ESTIMABILITY FAIL / FORMAL DECISION FORCED INCONCLUSIVE**

## Repository identity

```text
baseline main HEAD = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
study branch = research/position-evaluation-winrate-calibration
Stage 0 validated source commit = 28bb3ba1782c2ed7ea4c78a4dd962c96c782cd0a
Stage 1 generation source commit = c97a4f620f1a0da4e013ed55eb0fcf37fec16bf4
Stage 1 analysis source commit = b02fff06a63f1908cf74d1713d6a681c58c04269
Stage 2 technical-smoke source commit = fbb84549713b0b699fc32ea87345112b378d9e5a
Stage 2 authorization commit = 2b4b186f8fd51912c5b4ed52fa0f1a6c6672e8a2
Stage 2 generation source commit = a6f36a7cb86eab38897372680acd7eadc6f3436b
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

Phase-aware logistic became ineligible in CV fold 1 Mtaji under the frozen 100-iteration / `1e-10` gradient criterion. No numerical rescue is allowed.

Phase-stratified isotonic remained eligible:

```text
pooled CV Brier = 0.1532240986334561
Namua CV Brier = 0.2296469061338478
Mtaji CV Brier = 0.07106958057053532
selected family = phase-stratified-isotonic
selection reason = only-eligible-candidate
```

Frozen full fit:

```text
Namua: 327 support points -> 24 nondecreasing blocks; n=430
Mtaji: 363 support points -> 200 nondecreasing blocks; n=400
fullFit canonical JSON SHA-256 = 94bad0adc157503a729709d138b973f99dd213ad7bd926ad6d525e207060e343
```

## Stage 2 frozen design

```text
stageId = PEC-S2-FORMAL-2026-08-20-v1
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
games = 2048
seeds = 22300001..22302048
opening = 8-ply seeded-uniform exact E.moveVariants
continuation = hard / bao / phase2 / D2 / Infinity
max ply = 160
```

The exact Stage 1 isotonic mapping is hash-bound. Stage 2 refitting, smoothing, endpoint substitution, and primary-probability clipping are forbidden.

Cross-stage identity firewall reference universes are:

```text
historicalTrajectoryHash — all Stage 1 generated games
openingPrefixHash — all Stage 1 generated games
ruleStateKey — all Stage 1 observations
```

Overlaps are excluded without replacement.

## Stage 2 technical validation and authorization

`PEC-S2-SMOKE-2026-08-20-v1` passed on fixture seeds `990101..990108`, with deterministic replay, Stage 1 result/measurement binding, finite frozen-model predictions, clean source, and no scientific reuse.

A separate source-bound `STAGE_2_FORMAL_AUTHORIZATION.json` then authorized exactly the frozen 2048-game Stage 2 generation. It did not authorize Stage 1 refit, seed extension, identity-overlap replacement, or outcome-dependent extension.

## Stage 2 returned corpus

Artifact SHA-256 values:

```text
generation-manifest = 1b5aae5333bc9b02a36fc72cbaf2514a303f9bfd5fae97ceb0ad530d4828e71b
stage2-selection-measurement-summary = 575caef5058cb3d04209708b7e04f0f09381f7beea6d41706624cb73534f1b51
verification = 10790c52ec15bf89dfd301942d91424504bf5bf2afd7230182382d33134515ff
measurementHash = 373d780504814999466c3bc822a17b048054e8079b1c000e903a503cac9d1a33
```

Generation:

```text
games = 2048
seed range = 22300001..22302048
source commit = a6f36a7cb86eab38897372680acd7eadc6f3436b
sourceTreeDirty = false
```

Independent verification:

```text
passed = true
gamesVerified = 2048
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
stage1HistoricalTrajectoryOverlap = 0
stage1OpeningPrefixOverlap = 0
stage1RuleStateOverlap = 0
```

The Stage 2 corpus is therefore technically reproducible and the final selected-state set respects the cross-stage identity firewall.

## Stage 2 selection accounting

```text
unique historical trajectories before Stage 1 firewall = 1618
Stage 1 trajectory overlaps excluded = 235
Stage 1 opening-prefix overlaps excluded = 0
unique historical trajectories after trajectory/opening firewall = 1383
Stage 1 rule-state observations excluded = 1199
provisional selected states = 1292
unavailable assigned phase = 91
duplicate selected rule states collapsed = 2
selected unique rule states = 1290
Namua = 663
Mtaji = 627
administrative truncation = 0
```

No replacement occurred and none is authorized.

## Stage 2 estimability / identity gates

Passed:

```text
Namua selected states = 663 >= 650
distinct opening prefixes = 1290 >= 400
distinct static evaluations = Namua 440 / Mtaji 534 >= 100 each
Namua actor wins/losses = 324 / 339 >= 150 each
Mtaji actor wins/losses = 336 / 291 >= 150 each
administrative truncation = 0 <= 1%
final Stage 1 overlap = 0 on historicalTrajectoryHash/openingPrefixHash/ruleStateKey
independent verification = PASS
```

Failed:

```text
unique historical trajectories after Stage 1 firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

Machine-readable audit:

```text
doc/position-evaluation-calibration/results/STAGE_2_READINESS_AUDIT.json
```

## Formal consequence

The frozen Stage 2 decision rule states:

```text
if any estimability or identity gate fails -> INCONCLUSIVE
```

Therefore, before inspecting the preregistered performance criteria:

```text
formal decision = INCONCLUSIVE
formal performance criteria eligible = false
paired bootstrap eligible = false
```

This is an **estimability failure**, not a `NOT-CONFIRMED` calibration-performance result. It does not establish that the frozen mapping performs poorly, and it cannot be rescued by additional games, seed extension, replacement, threshold relaxation, or mapping refit.

The frozen formal evaluator may now be run once to materialize the canonical `stage2-formal-result.json`. Under the frozen implementation it must retain `formalDecision = INCONCLUSIVE`, set bootstrap and primary criteria to null because readiness failed, and treat any computed Brier/reliability/log-loss values as descriptive only.

## Current state

```text
Stage 1 exploratory development = COMPLETE / MODEL SELECTED
Stage 1 formal claim = NOT AUTHORIZED
Stage 2 scientific generation = COMPLETE
Stage 2 independent verification = PASS
Stage 2 estimability = FAIL
Stage 2 formal decision = INCONCLUSIVE (forced by frozen gate rule)
formal performance criteria = NOT ELIGIBLE FOR DECISION
additional generation / replacement / rescue = FORBIDDEN
canonical formal-result materialization = READY
```
