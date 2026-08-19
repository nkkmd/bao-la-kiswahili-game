# Current Status — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-19
Status: **STAGE 1 GENERATION COMPLETE / INDEPENDENT VERIFICATION PASS / READINESS PASS / EXPLORATORY MODEL FITTING OPEN**

## Repository identity

```text
baseline main HEAD = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
study branch = research/position-evaluation-winrate-calibration
Stage 0 validated source commit = 28bb3ba1782c2ed7ea4c78a4dd962c96c782cd0a
Stage 1 generation source commit = c97a4f620f1a0da4e013ed55eb0fcf37fec16bf4
Stage 1 authorization commit = e4323705087c854650097c7d3789ef1371f7a489
```

The branch remains based on current main; no closed-study formal decision has been changed.

## Frozen scientific design

```text
Stage 1 seeds = 22200001..22201024 (1024 games)
Stage 2 reserved = 22300001..22302048 (2048 games; generation not authorized)
opening = first 8 plies seeded-uniform exact E.moveVariants
continuation = hard / bao / phase2 / D2 / Infinity
max ply = 160
primary score = AI.evaluate(state, state.player)
key secondary = exact D2 root bestScore
trajectory support unit = unique historicalTrajectoryHash
selected states per trajectory <= 1
```

Administrative truncation is not a draw and receives no binary outcome. Stage 1 remains exploratory only.

## Stage 0 technical validation

`PEC-S0-SMOKE-2026-08-18-v1` passed with clean source, deterministic replay, static actor-perspective antisymmetry, and both Namua/Mtaji exercised. The smoke is technical only and is not calibration evidence.

## Stage 1 returned corpus and verification

```text
spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
games = 1024
seed range = 22200001..22201024
sourceTreeDirty = false
unique historical trajectories = 872
selected unique rule states = 830
Namua = 430
Mtaji = 400
administrative truncation = 0 / 830
selectionHash = 29b270b7dbfca8ef67c393c60f6232694c629b80228665eb1166dddeb257dd79
measurementHash = 0c32a56f8724beb87d0d69cf01288c9655e769526fb384384c57cf356f70eafa
```

Independent verification:

```text
passed = true
gamesVerified = 1024
gameReplayMismatches = 0
measurementMismatches = 0
measurementHashMatches = true
```

## Stage 1 readiness

All frozen gates passed:

```text
unique historical trajectories: 872 >= 800
selected unique rule states: 830 >= 750
Namua: 430 >= 330
Mtaji: 400 >= 330
distinct opening prefixes: 830 >= 200
distinct static evaluations: Namua 327 >= 50; Mtaji 363 >= 50
actor wins/losses: Namua 190/240; Mtaji 200/200; each >= 75
administrative truncation rate: 0 <= 0.01
```

Machine-readable audit:

```text
doc/position-evaluation-calibration/results/STAGE_1_READINESS_AUDIT.json
```

## Stage 1 analysis method freeze

Before individual score–outcome model fitting, residual mechanics were frozen in:

```text
doc/position-evaluation-calibration/preregistration/STAGE_1_ANALYSIS_METHOD_FREEZE.json
```

Candidate set remains exactly:

```text
phase-aware logistic
phase-stratified isotonic PAVA
```

Selection remains five-fold trajectory-level CV Brier score, with isotonic selected only if its Brier is at least 0.002 lower than logistic. No rescue model, alternate optimizer, alternate fold assignment, or outcome-dependent extension is authorized.

## Current authorization state

```text
Stage 1 scientific generation = COMPLETE
Stage 1 independent verification = PASS
Stage 1 readiness = PASS
Stage 1 exploratory model fitting = AUTHORIZED / OPEN
Stage 1 confirmatory reuse = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```

Next required step: run the frozen Stage 1 analysis mechanics, return `stage1-exploratory-calibration-result.json`, audit candidate eligibility/CV Brier/model selection, and only then freeze the exact selected mapping and prospective Stage 2 formal protocol before any Stage 2 generation.
