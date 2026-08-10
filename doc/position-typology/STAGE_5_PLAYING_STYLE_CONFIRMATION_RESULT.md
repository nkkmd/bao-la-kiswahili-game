# Stage 5 Playing-Style Continuous Independent Confirmation — Formal Result

更新日: 2026-08-10  
Status: **formal decision = not-confirmed**

## Formal identity

Preregistration:

```text
PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1
```

Frozen style-coordinate definition:

```text
568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

Frozen state-ingredient definition:

```text
b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

Confirmed Mtaji classifier dependency:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Formal result hash:

```text
6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c
```

The uploaded result artifact was independently rehashed after removing only the stored `resultHash` field. The recomputed canonical SHA-256 matched exactly.

## Formal boundary

The result records:

```text
formalExperiment = true
exploratory = false
formalDecision = not-confirmed
```

Frozen transfer integrity also records:

- no cluster search,
- no Mtaji classifier refit,
- no Namua scaler refit,
- no Stage 4 style scaler refit,
- no frozen-PCA refit,
- de-novo PCA used only for preregistered subspace comparison,
- no post-hoc rescue.

Therefore the formal decision is interpreted exactly under the preregistered G1-G5 rule.

## Held-out population

Generated games:

```text
192
```

Full-phase game trajectories satisfying the formal population definition:

```text
176
```

Condition counts:

| condition | full-phase games |
|---|---:|
| B-D1 | 27 |
| B-D2 | 32 |
| B-D3 | 30 |
| LS-D2 | 28 |
| V2-D2 | 31 |
| LE-D2 | 28 |

All technical minimums passed:

```text
T1 full replay verification = pass
T2 full-phase games >= 144 = pass
T3 each condition >= 20 = pass
```

Thus this is not an inconclusive population/provenance failure. The primary gates decide the result.

## Primary G1-G5

### G1 — frozen 4D subspace variance retention

Preregistered threshold:

```text
>= 0.60
```

Observed:

```text
0.6982303297538681
```

Decision:

```text
PASS
```

The frozen STYLE-C1..C4 projections still retain approximately 69.8% of total held-out variance in the discovery-standardized 10-descriptor space.

### G2 — de-novo held-out 4D subspace alignment

Preregistered requirements:

```text
maximum principal angle <= 25 degrees
mean principal angle <= 15 degrees
```

Observed principal angles:

```text
34.1058°
18.1666°
 9.3409°
 1.3343°
```

Summary:

```text
maximum = 34.1058°
mean    = 15.7369°
```

Decision:

```text
FAIL
```

Both preregistered limits are exceeded. In particular, at least one direction in the frozen four-dimensional PCA subspace does not align sufficiently closely with the independently fitted held-out four-dimensional PCA subspace.

### G3 — behavioral-anchor reproduction

All four preregistered anchors passed:

| coordinate | anchor | rho | threshold | result |
|---|---|---:|---:|---|
| STYLE-C1 | `mtajiM1Fraction` | 0.7758 | 0.35 | pass |
| STYLE-C2 | `namuaStructuralContrastMean` | 0.6022 | 0.35 | pass |
| STYLE-C3 | `namuaCaptureActivityTrendRho` | 0.6807 | 0.35 | pass |
| STYLE-C4 | `mtajiTypeSwitchRate` | 0.6637 | 0.35 | pass |

Decision:

```text
PASS
```

The frozen coordinate scores retain their intended behavioral anchor directions strongly in the held-out corpus.

### G4 — non-anchor behavioral signature

Preregistered requirement:

```text
>= 6/8 associations preserve sign with |rho| >= 0.20
and >=1 qualifying association for each STYLE-C1..C4
```

Observed qualifying associations:

```text
7 / 8
```

Qualifying by coordinate:

```text
STYLE-C1 = 2
STYLE-C2 = 1
STYLE-C3 = 2
STYLE-C4 = 2
```

The sole non-qualifying association was:

```text
STYLE-C2 vs namuaStructuralContrastTrendRho
rho = +0.1741
```

The expected sign remained positive, but its magnitude was below the preregistered 0.20 cutoff.

Decision:

```text
PASS
```

### G5 — trajectory-subsample subspace robustness

Preregistered threshold:

```text
80%-game subsampling x100
p90(maximum principal angle) <= 30 degrees
```

Observed maximum-angle distribution:

```text
median = 36.6209°
p90    = 48.8193°
max    = 88.6724°
```

Decision:

```text
FAIL
```

The held-out de-novo four-dimensional PCA subspace is not sufficiently stable relative to the frozen subspace under trajectory-level resampling.

## Formal decision

Technical gates all passed, but G2 and G5 failed.

The preregistered rule was:

```text
technical gates pass + all G1-G5 pass -> confirmed
technical gates pass + any G1-G5 fails -> not-confirmed
```

Therefore:

```text
FORMAL DECISION = not-confirmed
```

This decision must not be rescued by changing:

- the number of style coordinates,
- descriptor set,
- preprocessing,
- PCA orientation,
- subspace thresholds,
- behavioral thresholds,
- seed block,
- or by introducing a discrete cluster solution after inspection.

## Scientific interpretation

The negative formal result is narrower than `playing style does not exist`.

What the held-out evidence supports descriptively is:

1. the frozen four-coordinate projection still captures substantial held-out trajectory variance (G1 pass),
2. all four behavioral anchors reproduce strongly (G3 pass),
3. seven of eight preregistered non-anchor behavioral relations reproduce (G4 pass),
4. but the **exact compact four-dimensional PCA subspace is not independently stable enough** under de-novo held-out geometry and game-level resampling (G2/G5 fail).

Therefore the current evidence supports the wording:

> Stage 4 discovered interpretable continuous trajectory coordinates whose behavioral associations substantially reproduce in an independent corpus, but the preregistered exact four-dimensional continuous playing-style geometry was **not confirmed** as a sufficiently stable independent subspace.

The following wording is not authorized:

- `STYLE-C1..C4 are confirmed playing styles`,
- `Bao has exactly four playing-style dimensions`,
- `the Stage 4 PCA basis is a universal Bao style ontology`,
- `phase2`, `legacy`, evaluator, or depth labels are playing styles.

The frozen STYLE-C1..C4 definitions remain useful as **discovery-derived exploratory trajectory descriptors**, but they do not acquire confirmed status.

## Secondary diagnostics

### Coordinate density

The held-out frozen-score densities do not provide a rescue path to discrete style classes.

- STYLE-C1: KDE one peak; 1-component GMM BIC preferred.
- STYLE-C3: KDE one peak; 1-component GMM BIC preferred.
- STYLE-C4: KDE one peak; 1-component GMM BIC preferred.
- STYLE-C2: KDE reports a second small peak, but 1-component GMM BIC remains preferred over 2 and 3 components.

No discrete style set is promoted.

### Condition association

Condition-group variance fractions were:

```text
STYLE-C1 = 0.24945
STYLE-C2 = 0.08085
STYLE-C3 = 0.03324
STYLE-C4 = 0.06336
```

These remain metadata-only diagnostics. In particular, the comparatively larger STYLE-C1 condition association does not authorize naming any AI/search condition as a playing style.

## Boundary for subsequent work

The research state after Stage 5 is:

```text
Mtaji position morphology M1/M2 -> formally confirmed
Namua N-ACT / N-CON            -> exploratory continuous state coordinates
Stage 4 STYLE-C1..C4           -> exploratory continuous trajectory descriptors
Stage 5 exact 4D style geometry -> formally not-confirmed
```

The original research plan's later cross-study relation with Study 1 may now proceed only as a separately bounded secondary / hypothesis-generation analysis. It must preserve the Stage 5 negative result and must not treat STYLE-C1..C4 as confirmed entities.
