# Stage 2 Mtaji Independent Confirmation — Formal Result

Date: 2026-08-10  
Preregistration: `PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1`  
Formal decision: **confirmed**

## Scope

This document records the preregistered independent confirmation of the Stage 1 discovery:

```text
mtaji actor/opponent-invariant morphology k=2
```

The confirmed structure uses the frozen discovery classifier:

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

No discovery refit, held-out restandardization, held-out relabeling, alternative `k`, alternative feature set, or alternative preprocessing was allowed.

## Formal artifact

Local result artifact:

```text
artifacts/local/position-typology/stage2-mtaji-confirmation-v1/confirmation-result.json
```

Result hash:

```text
26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347
```

Preregistration spec file SHA-256 recorded by the formal run:

```text
f34adfc156026147f5253de24c1cf256332d38c4e8deaf7aeab98a97275b3507
```

## Formal population

Preregistered held-out corpus:

```text
192 games
seed block = 20310001..20310192
6 generation conditions × 32 games
```

Observed formal population:

- games: 192
- mtaji-contributing games: 180
- raw eligible mtaji rows: 2,704
- rule-state-deduplicated rows: 2,704
- game-phase-capped rows: 2,256

Technical minimums were satisfied:

- contributing games: 180 >= 144
- capped rows: 2,256 >= 1,500
- full replay / provenance verification: passed

Therefore the run is not `inconclusive`.

## Frozen classifier integrity

The formal analysis used exactly the frozen Stage 1 classifier.

Recorded boundaries:

```text
refitPerformed = false
restandardizedOnHeldout = false
```

Frozen canonical counts:

- `MTAJI-M1`: 1,245 (0.5519)
- `MTAJI-M2`: 1,011 (0.4481)

Condition NMI:

```text
0.00807
```

Thus the frozen types did not collapse and were not primarily reproducing the six generation-condition labels.

## Primary preregistered gates

All five formal gates passed.

### G1 — type non-collapse

Preregistered rule:

```text
minimum frozen canonical type fraction >= 0.20
```

Observed:

```text
0.44814
```

Decision: **passed**.

### G2 — frozen separation

Preregistered rule:

```text
frozen-label silhouette >= 0.12
```

Observed:

```text
0.19640
```

Decision: **passed**.

The held-out silhouette is essentially the same magnitude as the discovery value (~0.1962).

### G3 — axis discreteness

Preregistered rules:

```text
BIC(2) <= BIC(1) - 10
BIC(2) < BIC(3)
```

Observed:

- BIC(1): 11612.37
- BIC(2): 10722.08
- BIC(3): 10735.33
- BIC(1) - BIC(2): 890.28
- BIC(3) - BIC(2): 13.25

Decision: **passed**.

Secondary KDE diagnostic also reproduced a two-peak density shape:

- peak count: 2
- peaks near -2.260 and +3.257
- valley / lower-peak density ratio: 0.3826

The KDE diagnostic is descriptive only and was not used as a rescue or veto rule.

### G4 — de-novo held-out agreement

Held-out-only standardization was permitted only for the separate de-novo replication check. The frozen classifier itself remained unchanged.

ARI with frozen labels:

- K-means k=2: 0.9167
- diagonal GMM k=2: 0.9184
- Ward k=2: 0.9031

Preregistered rule:

```text
at least 2 of 3 ARI values >= 0.70
median ARI >= 0.70
```

Observed:

```text
3 of 3 >= 0.70
median = 0.9167
```

Decision: **passed**.

De-novo method-pair agreement was also high:

- K-means vs GMM: 0.8451
- K-means vs Ward: 0.8402
- GMM vs Ward: 0.9666

### G5 — trajectory-level subsample robustness

Preregistered rule:

```text
100 deterministic 80%-game subsamples
p10 frozen-vs-de-novo-KMeans ARI >= 0.60
```

Observed distribution:

- min: 0.8790
- p10: 0.8931
- median: 0.9205
- p90: 0.9476
- max: 0.9780

Decision: **passed**.

## Held-out morphology profile

The Stage 1 descriptive aliases retained their direction in the independent corpus.

### MTAJI-M1

Current descriptive alias:

```text
capture-engaged / relatively balanced morphology
```

Held-out profile includes:

- total forced capture ~1.999
- total capture moves ~6.298
- total mean capturable seeds ~3.418
- total mean capture events ~2.082
- total front occupied ~11.049
- smaller actor/opponent absolute differences on several front-row and capture-related measures

### MTAJI-M2

Current descriptive alias:

```text
capture-sparse / relatively asymmetric morphology
```

Held-out profile includes:

- total forced capture ~0.865
- total capture moves ~2.123
- total mean capturable seeds ~1.020
- total mean capture events ~0.744
- total front occupied ~9.092
- larger actor/opponent absolute differences on several front-row and capture-related measures

These profiles reproduce the Stage 1 interpretation direction. The labels remain state-morphology labels, not win/loss classes, player-strength labels, AI search labels, or playing styles.

## Trajectory behavior

Across 2,524 consecutive mtaji pairs:

- same-type rate: 0.6311
- flip rate: 0.3689
- run-length median: 1
- p75: 3
- p90: 5
- max: 16

This independently reproduces the Stage 1 pattern: the morphology can persist for several plies but can also transition during a game.

## Formal decision

The preregistered rule was:

```text
all technical gates + G1..G5 pass -> confirmed
technical gates pass + any G1..G5 fails -> not-confirmed
technical/integrity insufficiency -> inconclusive
```

All technical gates and all G1–G5 gates passed.

Therefore:

```text
FORMAL DECISION = confirmed
```

The confirmed claim is narrowly:

> Within the preregistered Bao mtaji population and the frozen actor/opponent-invariant morphology representation, the Stage 1 two-type structural partition replicates in an independent held-out corpus.

## Interpretation boundary

This confirmation supports a reproducible two-type mtaji position morphology under the fixed study design.

It does **not** by itself establish:

- a universal Bao ontology covering every legal state,
- that namua has two corresponding types,
- that the two types are playing styles,
- that either type is intrinsically superior,
- a causal relation to winning,
- a causal relation to a particular evaluator/search implementation,
- any revision of the closed phase-transition Study 1 decisions.

The previously rejected actor-oriented mtaji k=2 remains a relational polarity coordinate and is not reclassified as an intrinsic position type.

## Post-confirmation status

The provisional IDs `MTAJI-M1` / `MTAJI-M2` may now be treated as **formally confirmed study types** for this fixed classifier and population boundary.

Their English descriptive aliases remain provisional wording pending a separate ontology/naming review. No statistical re-analysis is needed to perform that naming review.

Next research work should remain separate:

1. final terminology / ontology wording for the confirmed mtaji types,
2. namua continuous-gradient analysis,
3. playing-style analysis using state-type occupancy / dwell / transitions and other trajectory coordinates,
4. later Study 1 cross-study relation analysis without changing Study 1 formal decisions.
