# Stage 1 Exploratory Protocol — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Status: **PROSPECTIVELY FROZEN / PENDING STAGE 0 TECHNICAL PASS / EXPLORATORY ONLY**

## Scientific role

Stage 1 develops a calibration mapping on fresh data. It is permanently exploratory and consumed; it cannot serve as formal Stage 2 confirmation evidence.

## Fixed corpus

```text
stageId = PEC-S1-EXPLORATORY-2026-08-18-v1
games = 1024
seed range = 22200001..22201024
opening = 8-ply seeded-uniform exact moveVariants
continuation = hard / bao / phase2 / D2
max ply = 160
```

No early stopping, seed extension, replacement, or outcome-dependent continuation extension is allowed.

## Primary measurement

```text
actor = state.player at selected root
x = AI.evaluate(state, actor)
y = 1 if frozen terminal winner == actor
    0 if frozen terminal winner == opponent
```

Administrative truncations are selected outcome-blind, retained in the audit, and omitted from binary calibration fitting. If they exceed 1% of selected states, Stage 1 readiness fails and no games are added.

Key secondary score: exact D2 root bestScore under the already validated Position Complexity search semantics.

## Calibration model development

Fixed score transform:

```text
z = staticBaoEvaluation / 100
```

Five folds are assigned deterministically from `historicalTrajectoryHash` using salt `PEC-S1-CV-v1`.

Candidate families are exactly:

1. phase-aware logistic: separate intercept and slope for Namua and Mtaji;
2. phase-stratified isotonic: separate unweighted PAVA maps for Namua and Mtaji.

Primary model-selection metric is five-fold out-of-fold Brier score. Isotonic is selected only if its Brier is at least 0.002 lower than phase-aware logistic; otherwise logistic is selected. If one candidate is technically ineligible, the other may be selected. If both are ineligible, Stage 1 is inconclusive and Stage 2 does not begin.

A pooled logistic model is descriptive/reference only and cannot replace the candidate family rule.

After selection, the chosen family is fit once on all nontruncated Stage 1 selected states and its exact parameters or isotonic knots are frozen before Stage 2 generation.

## Readiness gates

```text
unique historical trajectories >= 800
selected unique rule states >= 750
Namua selected states >= 330
Mtaji selected states >= 330
distinct opening prefixes >= 200
distinct static evaluations per phase >= 50
actor wins per phase >= 75
actor losses per phase >= 75
administrative truncation rate <= 0.01
```

Failure means Stage 1 readiness failure/inconclusive under the frozen design. No additional games are authorized as rescue.

## Stage 2 reservation

The numeric namespace is reserved now but formal generation is not authorized:

```text
Stage 2 games reserved = 2048
Stage 2 seeds = 22300001..22302048
```

The Stage 2 model, thresholds, formal endpoints, uncertainty procedure, and decision rule will be frozen only after Stage 1 development is complete and before any Stage 2 generation.
