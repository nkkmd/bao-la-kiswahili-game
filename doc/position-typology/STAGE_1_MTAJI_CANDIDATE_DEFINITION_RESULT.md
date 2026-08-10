# Stage 1 Mtaji Candidate Definition — Freeze Inspection Result

更新日: 2026-08-10

Status: **accepted as the immutable discovery-side classifier definition for preregistration; confirmation not yet performed**

## Artifact

Local artifact:

```text
artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

Candidate definition hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Source invariant-morphology audit hash:

```text
7a2cea55a48f8d5566f95ff5a08f8966a146e6add262d742724a3bcfd573d2c3
```

Source feature-audit hash:

```text
3a98b99dd5fbe1cf94a61124ad4687348cc2ce8ed49db450540ae6d236391129
```

## Inspection result

The artifact is accepted for preregistration because it contains a complete deterministic classification specification:

- exact 40-feature order,
- exact log1p field set,
- discovery-only StandardScaler mean / scale / variance,
- exact K-means settings,
- both 40-dimensional standardized centroids,
- deterministic raw-label to canonical-label mapping,
- discovery training-population rule-state hash,
- discovery-side diagnostic summaries,
- explicit interpretation boundary,
- explicit confirmation-not-yet-performed marker.

Dimension checks:

```text
fieldOrder: 40
scaler.mean: 40
scaler.scale: 40
scaler.var: 40
centroid 0: 40
centroid 1: 40
```

No held-out classifier refit is permitted.

## Frozen candidate

Representation:

```text
actor-opponent-invariant-morphology-v1
```

For each base field:

```text
total(actor, opponent)
absDifference(actor, opponent)
```

with the predeclared skewed non-negative fields transformed by log1p before total / absolute-difference construction. `forcedCapture` is treated analogously without log1p.

Classifier:

```text
KMeans
k = 2
n_init = 50
random_state = 20260809
```

The frozen classifier for confirmation consists of the discovery-fitted scaler and discovery centroids. Confirmation data are transformed by the frozen scaler and assigned to the nearest frozen centroid. **Neither scaler nor centroids may be refit on confirmation data.**

## Canonical IDs

Raw K-means numeric labels are not semantic.

Canonical mapping is frozen as:

```text
raw 0 -> MTAJI-M1
raw 1 -> MTAJI-M2
```

The discovery-side canonicalization rule was:

```text
cluster with larger transformed total.meanCapturableSeeds -> MTAJI-M1
other cluster -> MTAJI-M2
```

The discovery means were:

- raw 0: 3.4164855070203703
- raw 1: 1.0894800676107672

This rule is **not rerun on held-out data**. Held-out labels use the frozen mapping above.

## Provisional aliases

### MTAJI-M1

```text
capture-engaged / relatively balanced morphology
```

### MTAJI-M2

```text
capture-sparse / relatively asymmetric morphology
```

These remain provisional descriptive aliases only.

They are not:

- final ontology names,
- playing styles,
- AI/search implementation labels,
- win/loss classes,
- actor-advantage labels.

## Discovery population frozen in artifact

```text
phase = mtaji
terminal excluded
ply >= 8
ruleState primary identity
game-phase cap = 20
cap order = SHA-256(ruleStateKey) lexical order
```

- full mtaji rows: 1,495
- capped training rows: 1,222
- contributing games: 89
- training rule-state-key hash:
  `4896bd10146e4e808f2749959ef13d18a5ee46f54f1a566328b899873723be4d`

## Discovery-only diagnostics retained for provenance

- MTAJI-M1: 700 / 1,222 = 0.5728
- MTAJI-M2: 522 / 1,222 = 0.4272
- silhouette: 0.1962
- method agreement ARI: approximately 0.913–0.993
- invariant-axis two-component BIC preferred over one and three components
- KDE two-peak valley ratio: 0.4305
- relation to rejected relational-polarity k=2: ARI 0.0548

These values are not reoptimized into the held-out classifier.

## Freeze decision

The following is now immutable for the independent confirmation unless the confirmation is abandoned and a new study version is explicitly preregistered before data inspection:

1. representation definition,
2. feature order,
3. preprocessing,
4. discovery scaler,
5. k=2,
6. discovery centroids,
7. canonical raw-label mapping,
8. provisional IDs `MTAJI-M1` / `MTAJI-M2`,
9. candidate definition hash.

The artifact field:

```text
candidateDefinitionFrozenForPreregistration = true
```

is accepted.

## Boundary

At this checkpoint:

```text
formal confirmation performed = false
held-out corpus generated = false
held-out results inspected = false
```

The next step is the separately preregistered Stage 2 independent confirmation. Failure of the held-out test cannot be rescued by changing k, features, preprocessing, scaler, centroids, or labels after inspection.
