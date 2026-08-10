# Stage 2 Mtaji Independent Confirmation — Preregistration

更新日: 2026-08-10

Status: **preregistered before held-out corpus generation or inspection**

Machine-readable specification:

```text
doc/position-typology/preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json
```

Preregistration ID:

```text
PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
```

## 1. Purpose

Stage 1 exploratory discovery produced one board-level provisional two-type candidate in `mtaji` after rejecting an actor-oriented relational-polarity split as an intrinsic type system.

Stage 2 asks one narrow confirmatory question:

> Does the **already frozen** actor/opponent-invariant mtaji two-type candidate reproduce in an independent held-out corpus without refitting the discovery classifier?

This is not a new clustering search.

No alternative k, feature set, preprocessing, scaler, centroid set, or semantic relabeling may be selected after held-out inspection.

## 2. Frozen discovery candidate

Required candidate definition hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Representation:

```text
actor-opponent-invariant-morphology-v1
```

Canonical provisional IDs:

```text
MTAJI-M1
MTAJI-M2
```

The frozen artifact contains:

- 40-feature order,
- log1p field set,
- discovery StandardScaler parameters,
- discovery K-means centroids,
- raw-label to canonical-label mapping.

For the frozen classifier:

```text
refit = forbidden
held-out restandardization = forbidden
held-out relabeling = forbidden
```

Held-out observations are transformed by the **discovery-fitted scaler** and assigned to the nearest **discovery centroid**.

## 3. Formal corpus

Total games:

```text
192
```

Seed block:

```text
20310001 .. 20310192 inclusive
```

The seed block is disjoint from the Stage 1 discovery block.

Conditions remain exactly the six Stage 1 generation strata, with 32 games each:

1. `B-D1`: hard / bao / phase2 / depth1
2. `B-D2`: hard / bao / phase2 / depth2
3. `B-D3`: hard / bao / phase2 / depth3
4. `LS-D2`: hard / bao / legacy-search / depth2
5. `V2-D2`: hard / bao-v2 / phase2 / depth2
6. `LE-D2`: hard / legacy evaluator / phase2 / depth2

Condition assignment is deterministic:

```text
gameIndex modulo 6
```

Opening:

```text
seeded-uniform legal
8 plies
unpaired across conditions
```

Maximum game length:

```text
100 plies
```

The corpus is formal and held-out. It is not reusable as a new exploratory discovery set if the preregistered confirmation fails.

## 4. Confirmation population

Primary held-out population:

```text
phase == mtaji
terminal == false
ply >= 8
```

Identity handling mirrors discovery:

1. traverse game files in deterministic order and observations in ply order,
2. globally deduplicate by `ruleStateKey`, retaining the first occurrence,
3. within each contributing game, retain at most 20 mtaji states,
4. if more than 20 remain, rank by lexical `SHA-256(ruleStateKey)` and retain the first 20.

This cap is independent of feature values and type labels.

### Technical minimum population

The formal metric decision is only made if:

```text
contributing mtaji games >= 144
capped mtaji rows >= 1500
```

Failure of either threshold is `inconclusive`, not evidence against the candidate.

Replay, provenance, source integrity, or formal-boundary failure is also `inconclusive`.

## 5. Primary confirmation gates

**All five gates must pass.**

### G1 — type non-collapse

Apply the frozen classifier.

Requirement:

```text
min(fraction(MTAJI-M1), fraction(MTAJI-M2)) >= 0.20
```

Purpose: a nominal two-type classifier that collapses almost all held-out states into one type does not confirm the discovery structure.

### G2 — frozen separation

Compute silhouette using:

- held-out capped rows,
- discovery-standardized 40D representation,
- frozen canonical labels,
- all rows; no silhouette row subsampling.

Requirement:

```text
silhouette >= 0.12
```

The discovery value was approximately 0.196. The confirmatory threshold intentionally allows attenuation while requiring nontrivial multivariate separation.

### G3 — frozen-axis discreteness

Project held-out frozen-standardized states onto the line joining the two frozen discovery centroids.

Fit 1D Gaussian mixtures with 1, 2, and 3 components using the fixed settings in the machine-readable spec.

Requirements:

```text
BIC(2) <= BIC(1) - 10
BIC(2) < BIC(3)
```

Thus a two-component description must show strong improvement over a single component and must not be inferior to a three-component description.

KDE peak/valley shape is secondary and cannot rescue or veto this gate.

### G4 — de-novo k=2 agreement

This is a separate replication check, not a refit of the frozen classifier.

On held-out capped rows only:

1. fit a held-out StandardScaler,
2. fit exactly k=2 with:
   - K-means,
   - diagonal GMM,
   - Ward agglomerative clustering,
3. do not search any other k,
4. compare each de-novo solution with frozen canonical labels using ARI.

Requirements:

```text
at least 2 of 3 ARI values >= 0.70
median of the 3 ARI values >= 0.70
```

ARI is permutation-invariant, so no held-out semantic label remapping is necessary.

### G5 — trajectory-level subsample robustness

To reduce dependence on a particular set of trajectories:

```text
100 repetitions
80% of contributing games per repetition
without replacement within repetition
random_state = 20319999
```

For each repetition:

- select games only,
- fit a StandardScaler on that selected held-out subset,
- fit de-novo K-means k=2,
- compare its labels with the frozen classifier labels on the same selected rows.

Requirement:

```text
p10(ARI across 100 repetitions) >= 0.60
```

## 6. Fixed de-novo analysis settings

K-means:

```text
k = 2
n_init = 50
random_state = 20319999
```

Diagonal GMM:

```text
components = 2
covariance_type = diag
n_init = 10
reg_covar = 1e-6
random_state = 20319999
```

Ward:

```text
k = 2
linkage = ward
```

1D axis GMM:

```text
components = 1, 2, 3 only
covariance_type = full
n_init = 20
reg_covar = 1e-6
random_state = 20319999
```

No hyperparameter search is permitted.

## 7. Secondary diagnostics

The following are reported but do not change the formal decision:

- KDE peak count and peak-valley ratio,
- condition NMI,
- per-condition M1/M2 fractions,
- held-out profile means by frozen type,
- consecutive-ply type persistence and run lengths,
- pairwise agreement among the three de-novo methods.

The provisional aliases may be reconsidered later if profile direction changes, but alias validity cannot rescue or overturn the existence decision.

No condition-specific confirmation claim is preregistered.

## 8. Formal decision rule

### Confirmed

```text
technical integrity gates pass
AND G1 pass
AND G2 pass
AND G3 pass
AND G4 pass
AND G5 pass
```

### Not confirmed

```text
technical integrity gates pass
AND at least one of G1-G5 fails
```

The failed gate is retained as a negative result. No post-hoc rescue by alternative representation or clustering is allowed.

### Inconclusive

Only for predeclared technical conditions:

- replay/integrity/provenance failure,
- formal source mismatch,
- contributing mtaji games <144,
- capped mtaji rows <1500.

`Inconclusive` must not be used to relabel a metric failure.

## 9. Interpretation if confirmed

Confirmation supports only:

> Within the preregistered generation domain, the frozen actor/opponent-invariant mtaji morphology candidate reproduces as a discrete two-type state structure.

It does **not** by itself establish:

- a universal Bao ontology,
- final human-facing type names,
- a playing-style ontology,
- causal strategic value,
- association with winning,
- superiority of an AI implementation.

Final ontology naming and playing-style analysis remain later stages.

## 10. Interpretation if not confirmed

If a primary gate fails after technical validity passes:

> The Stage 1 provisional mtaji two-type candidate is not confirmed by the preregistered independent corpus.

The result must remain negative/null under this preregistration.

Any later alternative morphology model must be explicitly described as a new exploratory study and must not reuse this held-out corpus as if it were untouched.

## 11. Study 1 boundary

The closed phase-transition Study 1 remains unchanged.

This confirmation neither reopens nor modifies:

- prior formal decisions,
- forced-capture regime definition,
- `capture-branch-expansion` vocabulary,
- `sustained-forcing window` interpretation boundary,
- prior null/negative results.

## 12. Execution boundary

Formal generation and analysis must be local, not GitHub Actions.

Before generation:

- checkout the preregistered branch state,
- require a clean source tree for formal source files,
- do not alter seed block or condition configuration.

Before metric analysis:

- complete full replay verification,
- verify candidate-definition hash,
- verify preregistration spec identity and exact spec-file hash recorded in corpus provenance.

At preregistration time, no held-out game from seeds `20310001..20310192` has been generated or inspected for this study.
