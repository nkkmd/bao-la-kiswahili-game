# Checkpoint — Stage 4 continuous playing-style result and freeze start

Date: 2026-08-10

## Decision fixed at this checkpoint

Stage 4 exploratory trajectory analysis does **not** support a discrete playing-style type set.

Artifact hash:

```text
bb19b78205f87ac4271884fc406cd9a12b2b9b4675a38336f17479231ae6b98c
```

Primary evidence:

- PC1–PC3 KDEs are unimodal.
- 1-component GMM has lower BIC than 2–4 components for PC1–PC3.
- k=2..6 method agreement is weak/inconsistent.
- k=2 K-means has especially poor agreement with GMM/Ward.
- game-level resampling does not support a stable discrete partition.
- higher-k probes do not rescue a discrete ontology.

Therefore:

```text
playing-style geometry = continuous multi-axis trajectory space
no discrete style count promoted
no cluster style names assigned
```

## Provisional compact coordinate system

The discovery PCA has a useful drop after PC4:

```text
PC1 = 28.42%
PC2 = 18.86%
PC3 = 14.94%
PC4 = 14.57%
cumulative PC1..4 = 76.78%
PC5 = 8.46%
```

Provisional behavioral aliases:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

These aliases are descriptive only until independent confirmation. The exact object to freeze is the StandardScaler + PCA transform.

## Freeze boundary

Added exporter:

```text
tools/experiments/export-position-typology-stage4-style-coordinates.py
```

Added runbook:

```text
doc/position-typology/STAGE_4_STYLE_COORDINATE_FREEZE_RUNBOOK.md
```

The exporter canonicalizes PCA sign using fixed positive anchors:

- C1: `mtajiM1Fraction`
- C2: `namuaStructuralContrastMean`
- C3: `namuaCaptureActivityTrendRho`
- C4: `mtajiTypeSwitchRate`

No future style-confirmation seed has been generated or inspected.

## Preserved boundaries

- Stage 2 mtaji formal confirmation remains unchanged.
- MTAJI-M1/M2 remain state-level morphologies, not styles.
- Namua N-ACT/N-CON remain continuous state coordinates.
- N-PROG remains deterministic progress context and is excluded from style features.
- AI/search/evaluator condition labels remain metadata only.
- Stage 1 same-pilot evidence is not confirmation.
- No post-hoc k/algorithm rescue is allowed.
- Study 1 formal decisions remain unchanged.

## Next action

Run the style-coordinate exporter locally and inspect only:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-coordinate-definition-v1/style-coordinate-definition.json
```

Only after validating that artifact may an untouched future style-confirmation preregistration be written.
