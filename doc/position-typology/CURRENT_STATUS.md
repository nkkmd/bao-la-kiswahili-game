# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 2 mtaji formal confirmation complete / mtaji ontology names fixed / Stage 3 namua continuous representation complete / Stage 4 playing-style trajectory audit tooling ready**

Branch: `research/position-typology-and-playing-style`

## Current stop point

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

現在の停止点:

> **Stage 4 playing-style trajectory audit のローカル実行前**

完了済み:

1. Stage 0 instrumentation / corpus / symmetry audit
2. 96-game Stage 1 exploratory discovery pilot
3. feature / redundancy / clustering diagnostics
4. mtaji actor-oriented polarity audit
5. actor-oriented mtaji k=2をintrinsic typesとして棄却
6. actor/opponent-invariant mtaji morphology k=2発見
7. invariant morphology stability / discreteness audit
8. exact mtaji candidate definition freeze
9. Stage 2 independent confirmation preregistration
10. 192-game held-out formal corpus generation / full replay verification
11. preregistered G1–G5 analysis
12. **Stage 2 mtaji formal decision = confirmed**
13. confirmed mtaji human-readable ontology naming
14. Stage 3 namua continuous-gradient audit
15. namua continuous-coordinate interpretation固定
16. Stage 4 playing-style trajectory geometry design / tooling

未実施:

- Stage 4 playing-style audit execution / interpretation
- provisional playing-style geometry decision
- playing-style independent confirmation design
- Study 1 cross-study relation analysis

## Study 1 fixed boundary

Closed phase-transition Study 1は変更しない。

過去のformal decisions、`capture-branch-expansion` classifier / vocabulary、forced-capture regime、`sustained-forcing window` interpretation boundary、trajectory-ply sensitivity、negative/null resultsを維持する。

Study 1 formal corpusはcurrent typology/style discoveryへ使用しない。

## Confirmed Mtaji ontology

Frozen classifier:

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
actor-opponent-invariant-morphology-v1
40 dimensions
KMeans k=2
```

Formal Stage 2 result:

```text
preregistration = PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
resultHash = 26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347
FORMAL DECISION = confirmed
```

Confirmed IDs / names:

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
           捕獲関与・低コントラスト型局面形態

MTAJI-M2 = Capture-Sparse High-Contrast Morphology
           捕獲希薄・高コントラスト型局面形態
```

These are state-level position morphologies, not playing styles, outcome classes, advantage labels, or AI implementation names.

The previously rejected actor-oriented mtaji k=2 remains:

```text
continuous relational-polarity coordinate
!= intrinsic position type
```

## Stage 3 Namua result

Artifact:

```text
artifacts/local/position-typology/stage3-namua-gradient-v1/namua-gradient-audit.json
```

Audit hash:

```text
099f376fc3ab421165d9f04cb0544a78ea3170409e1a237dd7cb31f0a6cf9c0a
```

Population:

- full namua rows: 3,339
- capped rows: 1,881
- contributing games: 95
- role-invariant representation: 44 dimensions

### Namua discrete decision

Previous namua k=2 / k=4 remain rejected as discrete position-type candidates.

Stage 3 did not authorize a new cluster search and does not revive those results.

Current representation:

```text
N-PROG = deterministic reserve-depletion progress context
N-ACT  = continuous capture-activity coordinate
N-CON  = continuous structural-contrast coordinate
```

### N-PROG

Reserve depletion is effectively a deterministic namua clock:

- per-game Spearman rho with ply: median 1.0000
- every consecutive-ply delta positive
- consecutive delta numerically constant

Therefore N-PROG is trajectory context, not an independent morphology dimension and not a playing-style feature.

### N-ACT

Continuous tactical capture-engagement coordinate:

- KDE unimodal
- PC1 correlation rho = 0.8797
- PC1 explained variance = 25.63%
- trajectory behavior is bidirectional with a modest positive progress tendency

### N-CON

Continuous role-invariant structural-contrast coordinate:

- KDE unimodal
- PC2 correlation rho = 0.6695
- condition-group mean variance fraction ~0.0067
- trajectory changes nearly balanced positive/negative

### Namua geometry stability

PCA cumulative variance:

```text
PC1    = 25.63%
PC1-2  = 36.05%
PC1-3  = 44.94%
PC1-5  = 58.38%
```

Full-vs-capped maximum principal angles:

```text
1D = 0.85°
2D = 8.07°
3D = 6.16°
5D = 9.91°
```

80%-game resampling ×40, 2D maximum-angle:

```text
median = 5.22°
p90    = 9.46°
max    = 12.80°
```

Decision:

```text
namua = continuous-coordinate representation preferred
no discrete namua position type promoted
```

This remains exploratory, not formal confirmation.

Result document:

```text
doc/position-typology/STAGE_3_NAMUA_GRADIENT_RESULT.md
```

## Stage 4 Playing-Style discovery

Position-level representation is now sufficiently specified to move to trajectory / policy-level analysis.

Implementation:

```text
tools/experiments/analyze-position-typology-stage4-playing-style.py
```

Runbook:

```text
doc/position-typology/STAGE_4_PLAYING_STYLE_RUNBOOK.md
```

Checkpoint:

```text
doc/position-typology/checkpoints/2026-08-10-stage3-namua-continuous-result-and-stage4-start.md
```

### Analysis unit

```text
one full-phase game trajectory = one observation
```

Primary discovery uses Stage 1 games containing both eligible namua and mtaji states.

Stage 2 held-out rows are not reused as style-discovery observations.

### Primary style descriptor vector

Namua trajectory summaries:

```text
namuaCaptureActivityMean
namuaCaptureActivityStd
namuaCaptureActivityTrendRho
namuaStructuralContrastMean
namuaStructuralContrastStd
namuaStructuralContrastTrendRho
```

Confirmed mtaji trajectory summaries:

```text
mtajiM1Fraction
mtajiTypeSwitchRate
mtajiM1MeanDwell
mtajiM2MeanDwell
```

Total = 10 trajectory-level descriptors.

Excluded from primary style vector:

- raw ply
- N-PROG / reserve-depletion clock
- AI evaluator/search labels
- condition ID
- winner / outcome
- mtaji classifier QA margin

### Exploratory diagnostics

- PCA trajectory geometry
- PC1–PC3 density
- k=2..6 diagnostic only
- K-means / diagonal GMM / Ward
- method-pair ARI
- silhouette / GMM AIC-BIC
- cluster fractions
- condition NMI as metadata-only diagnostic
- 80%-game resampling ×100 for K-means / GMM
- trajectory descriptor profiles

No style count or style name is fixed before this audit is interpreted.

AI condition labels such as `phase2`, `legacy`, evaluator IDs, or depth labels may never themselves be called playing styles.

## Next local action

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/analyze-position-typology-stage4-playing-style.py
python tools/experiments/analyze-position-typology-stage4-playing-style.py
```

Expected artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/playing-style-trajectory-audit.json
```

Share only that JSON.

## Global interpretation boundaries

- position type and playing style remain separate
- confirmed mtaji classifier may not be retroactively refit
- namua k=2/k=4 negative result is not rescued
- N-ACT/N-CON are continuous coordinates, not types
- N-PROG is progression context, not morphology/style
- same-pilot Stage 4 stability is not independent confirmation
- no post-hoc algorithm/k expansion until something works
- condition labels are metadata only
- Study 1 formal decisions remain unchanged
