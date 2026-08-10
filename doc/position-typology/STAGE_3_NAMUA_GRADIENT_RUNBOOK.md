# Stage 3 Namua Continuous-Gradient Audit Runbook

Date: 2026-08-10  
Status: **exploratory / no discrete-type rescue / no formal confirmation**

## Purpose

Namua k=2 and k=4 were not promoted because cross-method, preprocessing, and representation agreement were insufficient.

This audit therefore does **not** search for another cluster count. It asks whether namua is better described by continuous state coordinates.

Primary questions:

1. Is there a strong state-intrinsic reserve-depletion/progress coordinate?
2. Is tactical capture activity a distinct continuous coordinate?
3. Is actor/opponent structural contrast another distinct coordinate?
4. How do these interpretable coordinates relate to the leading role-invariant PCA axes?
5. Are the leading axes continuous or strongly multimodal?
6. Are the low-dimensional subspaces stable under full/capped views and game-level resampling?
7. Do the coordinates evolve coherently along full namua trajectories?

## Fixed boundary

This is exploratory analysis of the original Stage 1 discovery pilot only.

It does not use:

- Stage 2 mtaji held-out confirmation rows,
- Study 1 formal corpus,
- future namua confirmation seeds.

It does not authorize:

- promoting k=2 or k=4,
- searching alternative k until one appears stable,
- naming namua position types,
- calling a PCA axis a playing style.

## Population

Source:

```text
artifacts/local/position-typology/stage1-pilot-v1/python-feature-audit-v1/eligible-primary-rule-state.csv
```

Namua only:

```text
phase == namua
terminal == false
ply >= 8
```

Primary geometry uses deterministic game×phase capping:

```text
max 20 states / game
selection order = SHA-256(ruleStateKey) lexical order
```

Full namua sequences are used only for trajectory diagnostics.

## Representation

Role-invariant representation:

```text
for each base field:
  total(actor, opponent)
  absDifference(actor, opponent)
```

Base fields include:

- reserve
- houseOwned
- nyumbaSeeds
- front/back seeds
- front/back occupancy
- reusable pits
- front connections
- legal/capture move counts
- pit concentration/variance primitives
- capturable-seed measures
- capture/relay/chain event measures
- forcedCapture

Predeclared skewed non-negative fields receive `log1p` before total/absolute-difference construction.

The resulting matrix is standardized for PCA.

## Interpretable continuous coordinates

### Reserve Depletion

```text
-z(total reserve)
```

Higher means less reserve remains.

This is a state-intrinsic progress proxy. Raw ply is not used as a feature.

### Capture Activity

Mean standardized value of role-invariant total:

- captureMoveCount
- maxCapturableSeeds
- meanCapturableSeeds
- maxCaptureEvents
- meanCaptureEvents
- forcedCapture

### Structural Contrast

Mean standardized actor/opponent absolute difference across selected board, mobility, capture, relay, and chain primitives.

This measures magnitude of structural contrast, not advantage direction.

## PCA diagnostics

Report:

- explained variance ratios,
- cumulative variance,
- top loadings for PC1–PC5,
- Spearman correlations of PC1–PC5 with the three interpretable coordinates,
- Spearman correlation with ply as descriptive-only context,
- full-vs-capped principal subspace angles,
- 80%-game resampling principal subspace angles ×40.

PCA is a descriptive coordinate system, not a type definition.

## Density diagnostics

For:

- reserveDepletion
- captureActivity
- structuralContrast
- PC1
- PC2
- PC3

report:

- quantiles,
- 1D GMM AIC/BIC for 1–4 components,
- KDE peak count,
- major two-peak valley ratio where applicable.

These are geometry diagnostics only. No automatic discrete-type claim follows from a GMM component count.

## Trajectory diagnostics

Using the full namua sequence:

- per-game Spearman rho with ply,
- consecutive-ply delta distribution,
- positive/negative/zero delta fractions.

This tests whether a coordinate acts like progression, oscillating tactical activity, or a less directional state descriptor.

## Condition audit

For each coordinate report the fraction of variance explained by condition-group means.

Condition labels remain metadata and are never input features.

## Local execution

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/analyze-position-typology-stage3-namua-gradients.py
python tools/experiments/analyze-position-typology-stage3-namua-gradients.py
```

Expected output:

```text
artifacts/local/position-typology/stage3-namua-gradient-v1/namua-gradient-audit.json
```

Share only this JSON.

## Decision after audit

Possible scientifically acceptable outcomes:

### A. Coherent continuous coordinate system

If reserve depletion and one or more tactical/contrast axes are stable and density is broadly continuous:

> represent namua by continuous coordinates rather than discrete types.

### B. Mixed geometry

If one axis is clearly continuous but another shows strong, reproducible multimodality:

> preserve the continuous coordinate and design a new, separately justified discrete follow-up only if the multimodality is not a post-hoc rescue of k=2/k=4.

### C. No compact low-dimensional account

If PCA subspaces are unstable or no interpretable coordinate explains the geometry:

> record that the current pilot does not support either a stable discrete typology or a compact continuous namua representation.

Do not add methods until something works.

## Downstream boundary

Playing-style analysis remains separate. It may later use:

- confirmed mtaji type occupancy/dwell/transitions,
- mtaji relational polarity coordinate,
- any namua continuous coordinates that survive this audit,

but AI implementation labels themselves are never playing styles.
