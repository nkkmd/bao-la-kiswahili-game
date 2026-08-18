# Current Status — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Status: **STAGE 0 DESIGN FROZEN / LOCAL TECHNICAL VALIDATION PENDING / SCIENTIFIC GENERATION NOT AUTHORIZED**

## Repository identity

```text
baseline main HEAD = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
study branch = research/position-evaluation-winrate-calibration
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

## Current gate

Before scientific generation, the investigator must run the Stage 0 contract test, spec validator and non-scientific smoke from `STAGE_1_RUNBOOK.md` and return the smoke JSON for audit.

Until a separate `STAGE_1_EXPLORATORY_AUTHORIZATION.json` is created and source-hash bound:

```text
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
formal inference = NOT AUTHORIZED
```
