# Current Status — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Status: **STAGE 0 TECHNICAL VALIDATION PASS / STAGE 1 GENERATION AUTHORIZED / FORMAL INFERENCE NOT AUTHORIZED**

## Repository identity

```text
baseline main HEAD = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
study branch = research/position-evaluation-winrate-calibration
Stage 0 validated source commit = 28bb3ba1782c2ed7ea4c78a4dd962c96c782cd0a
Stage 1 authorization commit = e4323705087c854650097c7d3789ef1371f7a489
```

The branch remains based on current main; no closed-study formal decision has been changed.

## Completed Stage 0 design work

- evaluation/search semantics audit complete;
- prior-study scientific boundaries restored;
- declared research-corpus seed namespace audit closed;
- Stage 1 seeds frozen at `22200001..22201024` for 1024 games;
- Stage 2 namespace reserved at `22300001..22302048` for 2048 games;
- frozen opening = first 8 plies seeded-uniform exact `E.moveVariants`;
- frozen continuation = `hard / bao / phase2 / D2 / Infinity`;
- frozen trajectory max ply = 160;
- one selected state maximum per unique historical trajectory;
- frozen SHA phase assignment and within-phase state selection;
- duplicate selected `ruleStateKey` collapse with no replacement;
- administrative truncation is not a draw and receives no binary outcome;
- Stage 1 model candidate family and 5-fold selection rule frozen;
- Stage 1 production runner and replay/measurement verifier implemented;
- production runner requires separate source-bound authorization artifact.

## Stage 0 technical validation

Returned smoke artifact:

```text
smokeId = PEC-S0-SMOKE-2026-08-18-v1
smoke SHA-256 = 11172d1a31d5716b40a5dd8d4cf092d0e7d6142c6b2299d30e6591e305d007f8
spec SHA-256 = a5015789b8293105dbfd7a9c977d0dbd66fc7564ab93ba9848f7b662d53b0f7c
passed = true
sourceTreeDirty = false
deterministicReplay = true
staticPerspectiveAntisymmetry = true
games = 8
uniqueHistoricalTrajectories = 8
selectedStates = 8
selectedNamua = 6
selectedMtaji = 2
scientificGeneration = false
scientificInferenceAuthorized = false
```

The smoke is technical only. Its eight states are not calibration evidence and are not reusable as Stage 1 scientific observations.

## Primary construct

```text
primary score = AI.evaluate(state, state.player)
key secondary = exact D2 root bestScore
empirical outcome = selected actor terminal win under frozen continuation
```

This remains distinct from game-theoretic value, human perception, causal effect, and Position Complexity constructs.

## Stage 1 readiness design

```text
unique historical trajectories >= 800
selected unique rule states >= 750
Namua >= 330
Mtaji >= 330
distinct opening prefixes >= 200
distinct static evaluations per phase >= 50
actor wins per phase >= 75
actor losses per phase >= 75
administrative truncation <= 1%
```

Failure does not authorize extra games.

## Current authorization state

`STAGE_1_EXPLORATORY_AUTHORIZATION.json` now exists and is bound to the exact Stage 1 spec SHA-256 and exact frozen source-file SHA-256 mapping returned by the passing smoke.

```text
Stage 1 scientific corpus generation = AUTHORIZED
Stage 1 exploratory inference before independent verification = NOT AUTHORIZED
Stage 1 confirmatory reuse = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```

Next required sequence: generate the fixed 1024-game Stage 1 corpus, perform selection/measurement, then run the independent verifier. No Stage 1 exploratory model fitting should be interpreted until verification PASS is established.
