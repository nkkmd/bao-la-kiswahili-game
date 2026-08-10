# Stage 3 Namua Continuous-Gradient Audit — Result

Date: 2026-08-10  
Status: **exploratory result / continuous-coordinate interpretation retained / no namua discrete type promoted**

## Artifact

```text
artifacts/local/position-typology/stage3-namua-gradient-v1/namua-gradient-audit.json
```

Audit hash:

```text
099f376fc3ab421165d9f04cb0544a78ea3170409e1a237dd7cb31f0a6cf9c0a
```

Boundaries remain:

- `formalExperiment: false`
- `exploratory: true`
- no discrete-type search authorized
- previous namua k=2 / k=4 may not be rescued
- raw ply was not used as a feature
- future namua confirmation corpus untouched
- Study 1 formal decisions unchanged

## Population

- full eligible namua rows: 3,339
- game-phase-capped rows: 1,881
- games contributing namua: 95
- role-invariant representation: 44 dimensions

Primary geometry used the deterministic capped view; full namua sequences were used only for trajectory diagnostics.

## Main decision

Current Stage 3 interpretation:

```text
namua
= no supported discrete position-type set in the current study
= better represented by continuous state coordinates
```

The useful continuous description separates **progress**, **tactical capture activity**, and **structural contrast**.

This is an exploratory representation result, not a formally confirmed ontology.

## N-PROG — reserve-depletion progress coordinate

`reserveDepletion` was defined as negative standardized total reserve.

It is not retained as an independent morphology coordinate because within every analyzable game it behaves as a deterministic namua clock:

- games with trajectory rho: 94
- median per-game Spearman rho with ply: 1.0000
- minimum rho: ~1.0000
- every consecutive-ply delta is positive
- consecutive delta is numerically constant (~0.09660 standardized units)

Its cross-sectional correlation with ply is identical to its correlation with itself as the progress proxy.

Therefore:

```text
N-PROG = deterministic namua progression coordinate
```

Use it as trajectory context, not as evidence of a separate structural morphology dimension.

Its KDE apparent two-peak shape is shallow:

- valley / lower-peak density ratio: 0.9614

and GMM information criteria continue improving through the tested component range. This is not interpreted as discrete namua phases.

## N-ACT — continuous capture-activity coordinate

`captureActivity` summarizes role-invariant total capture-move, capturable-seed, capture-event and forced-capture measures.

Evidence:

- KDE peak count: 1
- no major two-peak valley
- PC1 correlation: Spearman rho = 0.8797
- PC1 explained variance: 25.63%
- trajectory median per-game rho with ply: 0.3060
- consecutive changes are bidirectional: ~52.4% negative, ~44.8% positive, ~2.8% zero

PC1 loadings are dominated by total capture-event, capturable-seed, capture-move, front-occupancy / connection and relay-chain measures.

Interpretation:

```text
N-ACT = continuous tactical capture-engagement coordinate
```

It varies throughout namua and is not a discrete type label.

Condition-group means explain ~9.84% of its variance, so generation policy composition matters somewhat, but most variation is not reducible to the six condition labels.

## N-CON — continuous structural-contrast coordinate

`structuralContrast` summarizes actor/opponent absolute differences across board, mobility, capture, relay and chain primitives.

Evidence:

- KDE peak count: 1
- no major two-peak valley
- PC2 correlation: rho = 0.6695
- trajectory median per-game rho with ply: 0.3291
- consecutive changes are nearly balanced: ~51.2% positive / ~48.8% negative
- condition-group means explain only ~0.67% of variance

PC2 is also related to progress (rho ~0.568), so it is not a pure contrast axis; nevertheless structural contrast provides a direct interpretable continuous descriptor that remains distinct from capture activity.

Interpretation:

```text
N-CON = continuous role-invariant structural-contrast coordinate
```

## PCA geometry

Capped role-invariant PCA:

- PC1: 25.63%
- PC1–2 cumulative: 36.05%
- PC1–3 cumulative: 44.94%
- PC1–5 cumulative: 58.38%

Thus namua is not compressed into a single dominant latent dimension, but the leading geometry is stable enough to support a low-dimensional descriptive coordinate system.

### Full vs capped subspace stability

Maximum principal angle:

- 1D: 0.85°
- 2D: 8.07°
- 3D: 6.16°
- 5D: 9.91°

### 80%-game resampling ×40

Maximum principal-angle distributions:

2D:

- median: 5.22°
- p90: 9.46°
- max: 12.80°

3D:

- median: 7.03°
- p90: 11.99°

This supports a reproducible continuous low-dimensional geometry within the Stage 1 exploratory corpus.

## Density interpretation

The audit does not provide a basis for reviving discrete namua types.

- `captureActivity`: KDE unimodal
- `structuralContrast`: KDE unimodal
- PC3: KDE unimodal
- PC1: second peak is a small tail feature and valley ratio remains high (~0.804)
- PC2: contains a small high-value tail / rare component (~2–3% in GMM fits), not a balanced broad partition

GMM component count is not used alone to create an ontology.

## Final Stage 3 position-level representation

For downstream work, use:

```text
Mtaji:
  MTAJI-M1 = Capture-Engaged Low-Contrast Morphology   [formally confirmed]
  MTAJI-M2 = Capture-Sparse High-Contrast Morphology  [formally confirmed]

Namua:
  N-PROG = deterministic reserve-depletion progress context
  N-ACT  = continuous capture-activity coordinate
  N-CON  = continuous structural-contrast coordinate
```

Do not call `N-PROG`, `N-ACT`, or `N-CON` position types.

## Research boundary

This result does not establish:

- a discrete namua ontology,
- a formally confirmed namua coordinate system,
- playing styles,
- outcome causality,
- AI implementation labels as styles.

The Stage 2 mtaji formal decision remains unchanged.

## Next step

The position-level representation is now sufficiently specified to begin **playing-style discovery at the trajectory / policy level**.

The next exploratory stage should derive per-game trajectory descriptors from:

- confirmed mtaji type occupancy / dwell / transitions,
- namua `N-ACT` and `N-CON` trajectory summaries,
- namua progression only as context,
- phase duration / transition timing,
- optionally the previously retained mtaji relational-polarity coordinate once its use is kept separate from intrinsic type identity.

AI condition IDs remain metadata-only validation labels and may not themselves be named as playing styles.
