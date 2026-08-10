# Stage 5 Playing-Style Continuous Coordinate Confirmation — Preregistration

Date: 2026-08-10  
Preregistration ID: `PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1`  
Status: **frozen before held-out generation**

## Research question

Does the continuous four-axis playing-style geometry discovered in Stage 4 reproduce in an independent future game corpus when the entire discovery transform is transferred without refitting?

This is not a test for discrete style clusters.

## Frozen discovery definitions

Style-coordinate definition:

```text
568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

Style-ingredient definition:

```text
b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

Confirmed Mtaji classifier:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Frozen coordinates:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

These are continuous trajectory-level coordinates, not position types or AI implementation labels.

## Held-out corpus

```text
games      = 192
base seed  = 20350001
last seed  = 20350192
conditions = 6 x 32
max ply    = 100
opening    = seeded-uniform legal for 8 plies
```

Condition assignment is `gameIndex modulo 6` using the same six policy conditions as discovery. The seed block is disjoint from all prior discovery and Stage 2 seed blocks.

The corpus is local-only. GitHub Actions is not authorized for the formal run.

## Analysis unit

```text
one game trajectory containing both eligible namua and eligible mtaji states
```

Eligible states:

- terminal excluded,
- `ply >= 8`,
- no state-identity deduplication within the trajectory.

Technical minimums:

- at least 144 full-phase trajectories,
- at least 20 full-phase trajectories per condition.

Failure of replay, provenance, integrity, or technical population requirements yields `inconclusive`.

## Frozen transfer chain

Primary confirmation performs no held-out refit:

```text
raw state
  -> frozen 44D Namua scaler -> N-ACT / N-CON
  -> frozen confirmed Mtaji classifier -> M1 / M2 sequence
  -> fixed 10 game-level trajectory descriptors
  -> frozen Stage 4 10D StandardScaler
  -> frozen canonical 4x10 projection
  -> STYLE-C1..C4 scores
```

A held-out PCA is fitted only as an independent subspace diagnostic. It does not redefine the frozen scores.

## Primary gates

All five gates must pass.

### G1 — frozen subspace variance

The frozen four-dimensional subspace must retain at least 60% of total variance in the 10 discovery-standardized held-out descriptors.

```text
variance ratio >= 0.60
```

### G2 — de-novo subspace alignment

Fit PCA to the held-out descriptors after applying the frozen discovery scaler, then compare its leading four-dimensional subspace to the frozen four-dimensional component subspace.

Pass iff:

```text
maximum principal angle <= 25 degrees
mean principal angle    <= 15 degrees
```

Individual held-out PC numbers are not required to match individual frozen axes because nearby eigenvalues can rotate within a stable subspace.

### G3 — behavioral anchors

Spearman correlations with the preregistered positive anchors must each satisfy:

```text
STYLE-C1 vs mtajiM1Fraction                  >= 0.35
STYLE-C2 vs namuaStructuralContrastMean      >= 0.35
STYLE-C3 vs namuaCaptureActivityTrendRho     >= 0.35
STYLE-C4 vs mtajiTypeSwitchRate              >= 0.35
```

### G4 — non-anchor behavioral signatures

Eight associations were fixed before held-out generation:

```text
C1 : N-ACT mean             positive
C1 : N-ACT variability      negative
C2 : N-CON variability      positive
C2 : N-CON trajectory trend positive
C3 : M2 mean dwell          negative
C3 : N-ACT variability      positive
C4 : M2 mean dwell          negative
C4 : N-CON trajectory trend negative
```

An association qualifies when it has the preregistered sign and `|rho| >= 0.20`.

Pass iff:

- at least 6 of 8 qualify, and
- every STYLE-C1..C4 has at least one qualifying non-anchor association.

### G5 — game-resampling subspace robustness

Across 100 deterministic 80%-game subsamples, fit a de-novo four-dimensional PCA in the frozen discovery-scaled descriptor space and compare it with the frozen four-dimensional subspace.

Pass iff:

```text
p90(maximum principal angle) <= 30 degrees
```

Random state: `20359999`.

## Formal decision

```text
all technical gates + G1..G5 pass -> confirmed
technical gates pass but any G1..G5 fails -> not-confirmed
integrity/replay/provenance or technical population failure -> inconclusive
```

No secondary diagnostic may rescue or veto the primary decision.

## Secondary diagnostics

Report-only:

- frozen-coordinate moments and quantiles,
- one-dimensional GMM BIC / KDE shape,
- full coordinate-by-descriptor Spearman matrix,
- condition-group variance fraction,
- optional outcome association.

No cluster search is authorized for confirmation.

## Prohibited post-hoc changes

After held-out generation begins, do not:

- change the four-coordinate count,
- rotate or permute frozen axes to improve agreement,
- refit the Namua state scaler,
- refit or relabel the Mtaji classifier,
- refit the frozen 10D style scaler,
- change the 10 descriptor set,
- change G1–G5 thresholds,
- introduce a discrete cluster rescue,
- rename AI evaluator/search/depth labels as playing styles.

Study 1 formal decisions and Stage 2 Mtaji confirmation remain unchanged.
