# Checkpoint — Stage 2 Mtaji Independent Confirmation Preregistration

Date: 2026-08-10

Status: **FORMAL PREREGISTRATION FROZEN BEFORE HELD-OUT GENERATION**

Branch:

```text
research/position-typology-and-playing-style
```

Implementation/document bundle immediately before this checkpoint commit:

```text
3f277d5fbb5207336e91f3fe3d59f1c93f52d646
```

## 1. Discovery candidate frozen

Required candidate-definition hash:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Candidate:

```text
phase = mtaji
representation = actor-opponent-invariant-morphology-v1
provisional type count = 2
canonical IDs = MTAJI-M1, MTAJI-M2
```

Frozen discovery classifier includes:

- 40-dimensional feature order,
- fixed log1p field set,
- discovery StandardScaler parameters,
- K-means k=2,
- discovery centroids,
- raw-label to canonical-ID mapping.

No Stage 2 refit, restandardization, or semantic relabeling is allowed.

## 2. Prior rejected interpretation preserved

The actor-oriented mtaji S-pruned k=2 split remains rejected as two intrinsic types.

Its interpretation remains:

```text
continuous relational polarity coordinate
```

This formal confirmation concerns only the **actor/opponent-invariant morphology** candidate.

## 3. Preregistration identity

Preregistration ID:

```text
PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
```

Machine-readable spec:

```text
doc/position-typology/preregistration/STAGE_2_MTAJI_CONFIRMATION_SPEC.json
```

Git blob SHA at preregistration:

```text
b16ca10fcd6cb96f39353bb4f188d57c4570c277
```

Raw spec-file SHA-256:

```text
f34adfc156026147f5253de24c1cf256332d38c4e8deaf7aeab98a97275b3507
```

The formal corpus runner records the exact spec-file SHA-256 in the manifest and the verifier/analyzer require an exact match.

## 4. Held-out corpus frozen

```text
games = 192
seed block = 20310001..20310192 inclusive
conditions = 6
per condition = 32
maxPly = 100
opening = seeded-uniform legal for 8 plies
opening pairing across conditions = false
```

Condition assignment:

```text
gameIndex modulo 6
```

The six condition definitions are exactly those in the machine-readable spec.

## 5. Held-out population frozen

```text
phase == mtaji
terminal == false
ply >= 8
identity dedup = ruleStateKey
population view = game-phase-capped
cap = 20 states per game
cap order = SHA-256(ruleStateKey) lexical order
```

Dedup order:

```text
game file order -> observation ply order -> retain first occurrence
```

Technical minimum:

```text
contributing mtaji games >= 144
capped mtaji rows >= 1500
```

Failure of technical minimum or replay/provenance integrity yields `inconclusive`.

## 6. Primary confirmation gates frozen

All five must pass.

### G1

```text
minimum frozen type fraction >= 0.20
```

### G2

```text
frozen-label silhouette >= 0.12
```

### G3

Frozen centroid-axis 1D GMM BIC:

```text
BIC(2) <= BIC(1) - 10
BIC(2) < BIC(3)
```

### G4

Held-out de-novo fixed k=2 solutions:

```text
K-means
diagonal GMM
Ward
```

Requirements:

```text
at least 2 of 3 frozen-vs-de-novo ARIs >= 0.70
median ARI >= 0.70
```

No k search.

### G5

```text
100 repetitions
80% contributing games per repetition
selection RNG = 20319999
K-means random_state = 20319999
p10 frozen-vs-de-novo K-means ARI >= 0.60
```

## 7. Formal decision frozen

```text
technical pass + G1..G5 all pass
=> confirmed

technical pass + any G1..G5 fails
=> not-confirmed

technical/integrity insufficiency
=> inconclusive
```

Metric failure may not be relabeled `inconclusive`.

## 8. Forbidden post-hoc rescue

After held-out inspection, do not rescue with:

- alternative k,
- alternative feature set,
- alternative preprocessing,
- different scaler,
- refitted centroids,
- different canonical mapping,
- threshold changes,
- condition subset cherry-picking.

A later alternative model would be a new exploratory study and this held-out corpus would no longer be untouched.

## 9. Secondary-only diagnostics

The following cannot change the formal decision:

- KDE peak/valley,
- condition NMI,
- per-condition type fractions,
- profile-direction checks,
- trajectory persistence,
- pairwise de-novo method agreement beyond G4's formal summary.

## 10. Formal tooling frozen

Corpus generation:

```text
tools/experiments/run-position-typology-stage2-confirmation.js
```

Replay verification:

```text
tools/experiments/verify-position-typology-stage2-confirmation.js
```

Formal analysis:

```text
tools/experiments/analyze-position-typology-stage2-mtaji-confirmation.py
```

Runbook:

```text
doc/position-typology/STAGE_2_MTAJI_CONFIRMATION_RUNBOOK.md
```

Formal run is local only. GitHub Actions is not authorized.

## 11. State at freeze

At this checkpoint:

```text
Stage 2 held-out games generated = 0
Stage 2 held-out metrics inspected = false
formal confirmation result = not yet available
```

The seed block has been **defined** but not executed or inspected.

## 12. Namua boundary

Namua remains:

```text
no discrete position-type candidate promoted
```

Namua is outside this formal confirmation and must not be added post hoc.

## 13. Study 1 boundary

Closed Study 1 remains untouched.

No prior formal decision, freeze condition, negative/null result, forced-capture definition, classifier vocabulary, or interpretation boundary is modified by this checkpoint.

## 14. Next permitted action

The next permitted research action is the exact local execution in:

```text
doc/position-typology/STAGE_2_MTAJI_CONFIRMATION_RUNBOOK.md
```

No further discovery-side model editing is authorized before the formal Stage 2 result.
