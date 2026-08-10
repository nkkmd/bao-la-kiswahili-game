# Stage 4 Playing-Style Trajectory Geometry — Result

Date: 2026-08-10  
Status: **exploratory result / no discrete playing-style set promoted / continuous trajectory-style coordinates promoted provisionally**

## Scope

Stage 4 tested whether Bao playing style is better represented as discrete trajectory classes or continuous trajectory coordinates.

The unit of analysis was:

```text
one full-phase game trajectory = one observation
```

This preserves the fixed distinction:

```text
position type = state-level structural object
playing style = trajectory / policy-level pattern
```

Artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/playing-style-trajectory-audit.json
```

Audit hash:

```text
bb19b78205f87ac4271884fc406cd9a12b2b9b4675a38336f17479231ae6b98c
```

Boundaries remained:

- `formalExperiment: false`
- `exploratory: true`
- `finalStyleCountSelected: false`
- `playingStylesNamed: false`
- `futureStyleConfirmationSeedsTouched: false`
- AI/search/evaluator condition labels were metadata only
- confirmed mtaji classifier was not refit
- namua coordinates remained continuous

## Population

Primary trajectory population:

- Stage 1 games total: 95
- games with both eligible namua and mtaji: 89
- B-D1: 16
- B-D2: 16
- B-D3: 15
- LS-D2: 13
- V2-D2: 14
- LE-D2: 15

No Stage 2 held-out game was reused as a style-discovery observation.

## Primary descriptor vector

Ten standardized trajectory descriptors:

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

`N-PROG`, raw ply, outcome, condition ID, evaluator/search/depth are excluded from the style vector.

## PCA geometry

Explained variance:

- PC1: 0.2842
- PC2: 0.1886
- PC3: 0.1494
- PC4: 0.1457
- PC5: 0.0846

Cumulative:

- PC1–2: 0.4728
- PC1–3: 0.6221
- PC1–4: **0.7678**
- PC1–5: 0.8524

There is a useful dimensional break after PC4: the first four axes each explain roughly 14.6%–28.4%, while PC5 falls to ~8.5%.

For downstream freezing, the first four axes are therefore treated as a **provisional compact continuous style coordinate system**, while the original ten descriptors remain the full trajectory representation.

## Density shape

PC1–PC3 all showed a single KDE peak.

### PC1

- KDE peak count: 1
- BIC(1): 354.50
- BIC(2): 367.09
- BIC(3): 376.42
- BIC(4): 387.29

### PC2

- KDE peak count: 1
- BIC(1): 318.00
- BIC(2): 331.90
- BIC(3): 343.86
- BIC(4): 336.46

### PC3

- KDE peak count: 1
- BIC(1): 297.27
- BIC(2): 310.80
- BIC(3): 322.67
- BIC(4): 330.37

This does not prove that every possible Bao style distribution must be unimodal, but it strongly argues against interpreting the discovery trajectory space as several clean islands.

## Discrete-cluster diagnostics

No k in the predeclared range `2..6` produced a coherent discrete playing-style candidate.

### k=2

Silhouette was only ~0.16–0.17.

Method ARI:

- K-means vs GMM: 0.165
- K-means vs Ward: 0.114
- GMM vs Ward: 0.696

The apparent GMM/Ward agreement did not generalize across all methods.

80%-game resampling ×100:

- K-means median ARI: 0.545; p10: 0.296
- GMM median ARI: 0.779; p10: 0.403

### k=3..6

No higher-k probe repaired the problem.

- method agreement remained weak/moderate and inconsistent
- GMM produced single-game ~1.1% clusters at some k
- resampling stability remained insufficient for a discrete ontology
- silhouette stayed low

Therefore:

```text
no discrete playing-style count promoted
no cluster receives a playing-style name
```

Do not search additional k or algorithms post hoc to rescue a type set.

## Provisional continuous style coordinates

The first four frozen-orientation PCA axes may be described provisionally as follows.

### STYLE-C1 — Engagement–Persistence coordinate

Positive direction is associated with:

- higher `mtajiM1Fraction`
- longer `mtajiM1MeanDwell`
- higher mean namua capture activity
- lower namua capture-activity variability
- lower mtaji type-switch rate
- shorter M2 dwell

This axis contrasts sustained capture-engaged trajectories with more volatile / M2-persistent trajectories.

### STYLE-C2 — Structural-Contrast Intensity coordinate

Positive direction is dominated by:

- higher namua structural-contrast mean
- higher namua structural-contrast variability
- increasing structural contrast through namua
- secondary positive association with mtaji switching

### STYLE-C3 — Activity-Escalation Dynamics coordinate

Positive direction is dominated by:

- stronger positive namua capture-activity trend
- greater namua capture-activity variability
- higher M1 occupancy
- shorter M2 dwell
- some positive structural-contrast variability/trend

### STYLE-C4 — Morphology-Switching Tempo coordinate

Positive direction is dominated by:

- higher mtaji M1↔M2 switch rate
- shorter M1 and M2 dwell
- weaker/inverse namua structural-contrast trend

These names are **provisional descriptive aliases**. The machine-facing object to freeze is the exact 10-descriptor StandardScaler + PCA transform, not the wording.

## Condition association

Condition labels were not input features.

Cluster-condition NMI was low to modest across probes (~0.08–0.17), not evidence that condition labels are themselves styles.

A separate descriptive calculation on the Stage 4 table gives approximate between-condition variance fractions of:

- STYLE-C1 / PC1: 0.214
- STYLE-C2 / PC2: 0.098
- STYLE-C3 / PC3: 0.131
- STYLE-C4 / PC4: 0.063

Thus generated policy condition is associated with parts of the continuous style geometry, especially C1, but does not define the style coordinate system.

## Decision

Stage 4 decision:

```text
playing-style geometry
= continuous, multi-axis trajectory space
!= discrete style-type set in the current discovery corpus
```

Promote provisionally:

```text
STYLE-C1 = Engagement–Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

Do not call these formally confirmed until an independent future corpus tests the frozen coordinate definition.

## Next step

Before any future style-confirmation corpus is generated:

1. export the exact Stage 4 discovery StandardScaler and PCA orientation;
2. freeze feature order and PC1–PC4 components;
3. validate the exported candidate definition against this audit;
4. only then write a separate preregistration using untouched future seeds.

Stage 2 mtaji confirmation and all Study 1 formal decisions remain unchanged.
