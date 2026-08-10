# Stage 4 Playing-Style Trajectory Geometry — Runbook

Date: 2026-08-10  
Status: **exploratory / trajectory-level / no style naming / no formal confirmation**

## Purpose

Stage 4 begins the playing-style half of the study.

The unit of analysis is no longer a board state. It is:

```text
one game trajectory = one trajectory-level observation
```

This preserves the fixed distinction:

```text
position type = state-level structural object
playing style = trajectory / policy-level pattern
```

AI evaluator/search condition IDs are metadata only. They may be used to check composition or external alignment, but they are **not** playing-style labels and are never input features.

## Inputs

Stage 1 feature table:

```text
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/eligible-primary-rule-state.csv
```

Frozen / confirmed mtaji classifier:

```text
artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

Stage 2 formal confirmation result:

```text
artifacts/local/position-typology/stage2-mtaji-confirmation-v1/confirmation-result.json
```

Stage 3 namua continuous geometry:

```text
artifacts/local/position-typology/stage3-namua-gradient-v1/namua-gradient-audit.json
```

Required hashes are hard-guarded in the implementation.

## Primary population

Primary style discovery uses only Stage 1 games that contain both eligible namua and eligible mtaji states.

Reason:

- the primary descriptor vector explicitly combines both phases,
- missing mtaji should not be silently imputed into a style definition,
- games that never reach mtaji may be analyzed later as a separate sensitivity rather than being encoded as a pseudo-style.

Expected population is approximately the 89 Stage 1 games that reached mtaji, subject to exact script verification.

This is exploratory discovery only. It does not reuse Stage 2 held-out rows as style-discovery observations.

## State-level ingredients

### Namua

Use Stage 3 continuous coordinates:

- `N-ACT`: continuous capture activity
- `N-CON`: continuous structural contrast

`N-PROG` is **not** included in the style feature vector because Stage 3 showed it is a deterministic reserve-depletion clock. Raw ply is also excluded from the style vector.

For each game, summarize N-ACT and N-CON by:

- mean,
- within-game standard deviation,
- Spearman trajectory trend with ply.

These descriptors ask not only where a game lies on a coordinate, but how strongly and in what direction it evolves.

### Mtaji

Apply the already frozen classifier without refit:

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

Per game summarize:

- MTAJI-M1 occupancy fraction,
- M1↔M2 switch rate across consecutive mtaji plies,
- mean MTAJI-M1 dwell length,
- mean MTAJI-M2 dwell length.

Classifier margin is recorded as QA/context only and is not part of the primary style feature vector.

## Primary style descriptor vector

Ten trajectory-level fields:

```text
namuaCaptureActivityMean
namuaCaptureActivityStd
namuaCaptureActivityTrendRho
namuaStructuralContrastMean
namuaStructuralContrastStd
namuaStructuralContrastTrendRho
mtajiM1Fraction
mtajiTypeSwitchRate
mtajiM1MeanDwell
mtajiM2MeanDwell
```

All ten are standardized across game trajectories before PCA / clustering diagnostics.

No AI/search/evaluator condition field is included.

## Exploratory geometry

### PCA

Report:

- explained variance,
- cumulative variance,
- top loadings for PC1–PC5,
- density diagnostics for PC1–PC3.

PCA axes are style coordinates only if interpretation later supports that wording. They are not automatically named styles.

### Cluster diagnostics

Probe only:

```text
k = 2..6
```

Methods:

- K-means
- diagonal GMM
- Ward

Report:

- silhouette,
- cluster fractions,
- pairwise method ARI,
- GMM AIC/BIC,
- condition NMI,
- descriptor profiles.

No cluster count is final at this stage.

### Game-level resampling

For each k=2..6:

- 80% games,
- 100 repetitions,
- K-means and diagonal GMM,
- compare full-data labels with subset-fitted out-of-sample labels by ARI.

This is same-pilot robustness, not confirmation.

## Interpretation order

1. Integrity / source hashes / confirmed mtaji boundary.
2. Population and condition counts.
3. Descriptor distributions and obvious redundancies.
4. PCA dimensionality / loadings.
5. PC density shape.
6. k=2..6 method agreement.
7. trajectory-resampling stability.
8. descriptor profiles.
9. condition NMI / composition.
10. Decide whether style structure is better treated as:
   - discrete candidate styles,
   - continuous style coordinates,
   - mixed geometry,
   - or unresolved.

## Important condition-label boundary

A high condition NMI does **not** authorize statements such as:

```text
phase2 is a style
legacy-search is a style
bao-v2 is a style
```

At most it means trajectory geometry is associated with a policy implementation condition in this generated corpus.

Style names, if later justified, must describe trajectory behavior itself.

## No post-hoc rescue

If k=2..6 do not yield a coherent discrete candidate, do not add more k values or alternative algorithms until one works.

A continuous or mixed playing-style representation is an acceptable result.

## Local execution

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/analyze-position-typology-stage4-playing-style.py
python tools/experiments/analyze-position-typology-stage4-playing-style.py
```

Expected output:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/playing-style-trajectory-audit.json
```

Share only this JSON.

## Boundary after Stage 4

Do not preregister a playing-style confirmation until:

- descriptor interpretation is stable,
- discrete-vs-continuous geometry is decided,
- any provisional style labels are defined behaviorally rather than by AI implementation,
- the same Stage 1 games are not reused as confirmatory evidence.

Study 1 formal decisions and Stage 2 mtaji formal confirmation remain unchanged.
