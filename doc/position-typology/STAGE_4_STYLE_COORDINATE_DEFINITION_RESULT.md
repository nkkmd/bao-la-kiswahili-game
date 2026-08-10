# Stage 4 Playing-Style Coordinate Definition — Freeze Result

Date: 2026-08-10  
Status: **accepted / frozen for independent preregistration / confirmation not yet performed**

## Accepted artifact

Local artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-coordinate-definition-v1/style-coordinate-definition.json
```

Accepted definition hash:

```text
568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

The hash was independently recomputed from canonical JSON after removing the `styleCoordinateDefinitionHash` field and matched exactly.

## Integrity checks

Accepted checks:

- `formalExperiment: false`
- `exploratory: true`
- `confirmationPerformed: false`
- `futureStyleConfirmationSeedsTouched: false`
- `coordinateDefinitionFrozenForPreregistration: true`
- exactly 10 descriptor fields
- scaler mean / scale / variance each length 10
- every scaler scale strictly positive
- scaler variance consistent with squared scale
- exactly four frozen PCA coordinates
- each canonical component length 10
- every declared behavioral anchor has a positive canonical loading
- source hashes match the accepted Stage 2 / Stage 3 / Stage 4 artifacts

## Frozen representation

Machine-facing representation:

```text
playing-style-trajectory-descriptor-v1
```

Unit:

```text
one full-phase game trajectory
```

Feature order is frozen as:

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

The discovery `StandardScaler` mean / scale and the canonical 4×10 component matrix are part of the frozen definition and may not be refit for the frozen-coordinate arm.

## Frozen coordinates

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

Canonical orientation anchors:

```text
STYLE-C1 -> mtajiM1Fraction > 0 loading
STYLE-C2 -> namuaStructuralContrastMean > 0 loading
STYLE-C3 -> namuaCaptureActivityTrendRho > 0 loading
STYLE-C4 -> mtajiTypeSwitchRate > 0 loading
```

Discovery explained variance:

```text
C1 = 0.28418
C2 = 0.18857
C3 = 0.14938
C4 = 0.14571
cumulative C1-C4 = 0.76785
```

## Discovery behavioral anchor correlations

For preregistration design only, the already-fixed discovery trajectories show the following Spearman correlations between each frozen coordinate score and its declared behavioral anchor:

```text
STYLE-C1 vs mtajiM1Fraction              rho = 0.7798
STYLE-C2 vs namuaStructuralContrastMean  rho = 0.7781
STYLE-C3 vs namuaCaptureActivityTrendRho rho = 0.6419
STYLE-C4 vs mtajiTypeSwitchRate          rho = 0.7003
```

These values are discovery evidence, not confirmation thresholds after the fact. The future formal thresholds must be fixed before any future held-out style corpus is generated or inspected.

## Fixed interpretation boundary

The accepted object is a continuous trajectory-level coordinate system.

It is **not**:

- a discrete playing-style taxonomy,
- a position-type taxonomy,
- an AI implementation label set,
- an outcome / win-loss classification,
- an independently confirmed result yet.

Stage 4 k=2..6 remains non-promoted. No future failure of continuous-coordinate confirmation may be rescued by returning to those clusters without a separately justified new study.

## Important PCA boundary

PC3 and PC4 have similar discovery eigenvalues. Therefore independent confirmation must not require a held-out de-novo PCA to preserve the same numeric PC ordering one-by-one. The scientifically appropriate object is primarily the frozen **four-dimensional style subspace**, plus the behavioral meaning of the frozen projected coordinates.

Any held-out de-novo PCA comparison must therefore use principal-subspace agreement rather than post-hoc component permutation or rotation to rescue individual axes.
