# Checkpoint — Stage 2 smoke PASS and formal authorization

Date: 2026-08-20
Study: Position Evaluation / Win-Rate Calibration Study 1
Stage: `PEC-S2-FORMAL-2026-08-20-v1`

## Returned technical smoke

The returned Stage 2 preflight smoke was audited before any scientific Stage 2 generation.

```text
smokeId = PEC-S2-SMOKE-2026-08-20-v1
smoke artifact SHA-256 = 5cf0e2276f997cca689d52b8304e42dc1ac9df96769b7a7e858535e7c38628d2
source commit = fbb84549713b0b699fc32ea87345112b378d9e5a
spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
passed = true
scientificGeneration = false
formalInferencePerformed = false
stage2GenerationAuthorized = false during smoke
fixture seeds = 990101..990108
scientificReuseAllowed = false
deterministicReplay = true
stage1ResultHashVerified = true
stage1MeasurementHashVerified = true
uniqueHistoricalTrajectories = 8
selectedStates = 5
finiteFrozenModelPredictions = true
sourceTreeDirty = false
authorizationFilePresent = false during smoke
generationAuthorizedBySpecAlone = false
```

The smoke is technical only and is permanently excluded from Stage 2 formal evidence.

## Source binding

The exact Stage 2 frozen source SHA-256 mapping in the passing smoke was accepted. It includes the engine/evaluator, benchmark seed implementation, position feature/identity code, Stage 2 common library, spec validator, production runner, independent verifier, formal evaluator, smoke runner, and the Stage 2 formal spec itself.

No frozen source was changed between the passing smoke and authorization.

## Authorization

A separate authorization artifact was committed only after the smoke audit:

```text
file = doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
authorization commit = 2b4b186f8fd51912c5b4ed52fa0f1a6c6672e8a2
Stage 2 generation = AUTHORIZED
Stage 2 formal inference = AUTHORIZED only after independent verification + estimability/identity gates
Stage 1 refit = FORBIDDEN
```

The authorization is bound to:

```text
Stage 2 spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
Stage 1 result SHA-256 = 136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
Stage 1 measurement hash = 0c32a56f8724beb87d0d69cf01288c9655e769526fb384384c57cf356f70eafa
selected family = phase-stratified-isotonic
```

## Authorized next sequence

Exactly the frozen 2048-game corpus on seeds `22300001..22302048` may now be generated. Outcome-blind selection/measurement may follow. Independent verification is mandatory before the formal evaluator is run.

No authorization is granted for:

- extra games or seed extension;
- replacement for Stage 1 identity overlap;
- replacement for unavailable phase or duplicate state;
- Stage 1 mapping refit/smoothing;
- changing readiness gates, Brier thresholds, bootstrap mechanics, or formal decision rules;
- bypassing independent verification.

## Current scientific state

```text
Stage 1 = exploratory development complete; model selected
Stage 2 technical validation = PASS
Stage 2 scientific generation = AUTHORIZED
Stage 2 formal outcome = NOT YET EVALUATED
```
