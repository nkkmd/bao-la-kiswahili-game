# Stage 4 Playing-Style Coordinate Freeze Runbook

Date: 2026-08-10  
Status: **discovery-side definition freeze only / no confirmation / future style seeds untouched**

## Purpose

Stage 4 found no coherent discrete playing-style set. The discovery result is instead a continuous multi-axis trajectory space.

Before any independent confirmation is designed, freeze the exact discovery transform:

```text
10 trajectory descriptors
-> discovery StandardScaler
-> PCA
-> canonicalized PC1..PC4
```

This step does not generate or inspect any future style-confirmation corpus.

## Required source artifact

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/playing-style-trajectory-audit.json
```

Required audit hash:

```text
bb19b78205f87ac4271884fc406cd9a12b2b9b4675a38336f17479231ae6b98c
```

## Frozen descriptor order

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

## Frozen provisional coordinate set

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

PCA component sign is mathematically arbitrary, so the exporter canonicalizes orientation by requiring a positive loading on a predefined behavioral anchor:

- STYLE-C1: `mtajiM1Fraction`
- STYLE-C2: `namuaStructuralContrastMean`
- STYLE-C3: `namuaCaptureActivityTrendRho`
- STYLE-C4: `mtajiTypeSwitchRate`

This orientation rule changes only sign convention, not the PCA subspace.

## Local execution

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/export-position-typology-stage4-style-coordinates.py
python tools/experiments/export-position-typology-stage4-style-coordinates.py
```

Expected output:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-coordinate-definition-v1/style-coordinate-definition.json
```

Share only this JSON.

## Validation before preregistration

The exported definition must contain:

- `formalExperiment: false`
- `exploratory: true`
- `confirmationPerformed: false`
- `futureStyleConfirmationSeedsTouched: false`
- `coordinateDefinitionFrozenForPreregistration: true`
- source Stage 4 audit hash exactly matching the discovery artifact
- 89 discovery games
- 10-feature order exactly matching the Stage 4 protocol
- 10-element scaler mean/scale/variance arrays
- four 10-element canonical PCA component vectors
- positive anchor loading for all four axes
- cumulative discovery variance through PC4 ~0.76785
- a nonempty `styleCoordinateDefinitionHash`

Only after this artifact is inspected and accepted may an independent style-confirmation preregistration be written.

## Boundary

Do not:

- select a discrete style count,
- rename AI conditions as styles,
- modify confirmed MTAJI-M1/M2,
- change N-ACT/N-CON definitions,
- use Stage 2 mtaji held-out results as formal style confirmation,
- generate future style-confirmation seeds before preregistration.
