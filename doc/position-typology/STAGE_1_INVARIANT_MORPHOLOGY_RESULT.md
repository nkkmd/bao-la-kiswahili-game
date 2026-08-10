# Stage 1 mtaji invariant morphology audit result

更新日: 2026-08-10  
Status: **exploratory / provisional board-level two-type set promoted / not formal confirmation**

## Boundary

Artifact:

```text
artifacts/local/position-typology/stage1-pilot-v1/invariant-morphology-audit-v1/mtaji-invariant-morphology-audit.json
```

Audit hash:

`7a2cea55a48f8d5566f95ff5a08f8966a146e6add262d742724a3bcfd573d2c3`

The artifact explicitly records:

- `formalExperiment: false`
- `exploratory: true`
- `finalClusterCountSelected: false`
- `positionTypesNamed: false`
- future held-out seeds untouched

This document does not convert the Stage 1 pilot into confirmation.

## Reference candidate

Phase:

```text
mtaji
```

Population:

```text
terminal == false
ply >= 8
game × phase cap = 20
```

Reference representation:

```text
actor/opponent-invariant morphology
= total(actor, opponent)
+ absDifference(actor, opponent)
```

with the predeclared log1p transformations on skewed non-negative primitives, followed by standard scaling.

Reference clustering:

```text
K-means
k = 2
random_state = 20260809
```

Capped rows: 1,222.  
Full mtaji rows: 1,495.  
Games represented: 89.

## Stability

### Method agreement

At k=2:

- K-means vs diagonal GMM ARI: 0.9197
- K-means vs Ward ARI: 0.9134
- diagonal GMM vs Ward ARI: 0.9935

All three methods recover essentially the same coarse partition.

### Full vs capped

- K-means ARI: 0.9514
- diagonal GMM ARI: 1.0000
- Ward ARI: 0.9869

The candidate is not an artifact of the game×phase cap.

### Trajectory resampling

80% of games, 40 repetitions:

K-means:

- minimum ARI: 0.9387
- p10: 0.9572
- median: 0.9902
- p90: 1.0000

Diagonal GMM:

- minimum ARI: 0.9967
- median: 1.0000

The structure is highly stable to trajectory-level resampling within the exploratory corpus.

## Exact role invariance

Actor/opponent swap gives:

```text
max absolute matrix difference = 0.0
```

Therefore this representation is numerically invariant to player-role orientation and cannot encode the relational polarity artifact identified in the previous audit.

## Independence from the rejected relational polarity split

Agreement with the previous actor-oriented mtaji k=2 partition:

- ARI: 0.0548
- NMI: 0.0426

Thus the invariant structure is substantially different from the actor-advantage / opponent-advantage polarity coordinate.

## Discreteness evidence

### 1D GMM on the invariant centroid axis

BIC:

- 1 component: 6213.06
- 2 components: 5786.86
- 3 components: 5796.42

The 2-component description is strongly preferred to 1 component and remains preferred to 3 components.

Two-component means are approximately:

```text
-2.565
+2.932
```

with weights approximately:

```text
0.607 / 0.393
```

### KDE

KDE detects two peaks near:

```text
-2.186
+2.981
```

The valley between them has density only about 43.0% of the lower peak.

This differs sharply from the earlier relational-polarity axis, whose major-peak valley ratio was approximately 97% and therefore lacked a deep density gap.

The invariant candidate therefore has materially stronger evidence for a genuinely bimodal structure.

## Not explained by one scalar

Two predeclared scalar summaries were tested.

### Activity magnitude

ARI with invariant k=2:

`0.0236`

### Imbalance magnitude

ARI with invariant k=2:

`0.1837`

Neither scalar explains the partition.

The candidate is therefore not reducible to a simple high/low activity split or a simple high/low imbalance split.

## Trajectory persistence

Across 1,406 consecutive mtaji pairs:

- same-cluster rate: 0.6309
- flip rate: 0.3691

Run lengths:

- median: 1
- p75: 3
- p90: 5.3
- maximum: 22

For the observed 57.3% / 42.7% marginal proportions, independent random reassignment would yield a same-label probability of about 51%.

Thus the candidate shows meaningful temporal persistence without being a permanent game-level label. This is consistent with a state-level morphology that can change during a game.

## Structural interpretation

Reference K-means cluster profiles are approximately mirror-opposed on a coherent feature family.

One cluster has:

- higher total forced-capture availability
- higher total capturable seeds
- higher total capture-event counts
- higher capture-move count
- higher total front-row occupancy
- lower actor/opponent absolute differences in forced capture, capture events, front occupancy, front seeds, and reusable pits

The other cluster has the reverse profile.

For the next freeze step, provisional descriptive aliases are therefore permitted:

```text
capture-engaged / relatively balanced morphology
capture-sparse / relatively asymmetric morphology
```

These are **descriptive provisional aliases**, not final ontology labels.

They must not be interpreted as AI styles, evaluator labels, or outcome classes.

## Decision

The evidence now satisfies the exploratory criteria for promotion from a generic structural candidate to a **board-level provisional two-type set for mtaji**:

1. strong cross-method agreement,
2. strong full/capped stability,
3. strong trajectory-level resampling stability,
4. exact actor/opponent invariance,
5. near-independence from relational polarity,
6. failure of simple scalar explanations,
7. a clear two-peak density valley,
8. 2-component BIC preferred to both 1 and 3 components,
9. coherent board/legal-morphology profiles,
10. nontrivial within-trajectory persistence.

Current status:

```text
mtaji invariant morphology k=2
= board-level provisional two-type set
= discovery-corpus result only
= not formally confirmed
```

No equivalent discrete candidate is promoted for namua.

## Next step

Before any held-out corpus is touched, export and hash an exact candidate classifier specification containing:

- feature order,
- log transforms,
- scaler parameters,
- K-means centroids,
- deterministic canonical label mapping,
- source hashes,
- discovery-population definition.

Only after that candidate definition is inspected should a separate confirmation preregistration be written.

## Interpretation boundary

This result does **not** establish that Bao universally has exactly two mtaji position types.

It establishes that the Stage 1 discovery corpus contains a robust, actor/opponent-invariant, bimodal state morphology that supports a provisional two-type hypothesis suitable for independent confirmation.
