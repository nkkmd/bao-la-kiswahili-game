# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 2 mtaji formal confirmation complete / Stage 3 namua continuous representation complete / Stage 4 playing-style geometry = continuous multi-axis / exact style-coordinate freeze tooling ready / future style confirmation not yet preregistered**

Branch: `research/position-typology-and-playing-style`

## Current stop point

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

現在の停止点:

> **Stage 4 continuous playing-style coordinate definition exporter のローカル実行前**

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
16. Stage 4 playing-style trajectory geometry audit
17. **Stage 4 discrete playing-style set not supported**
18. provisional four-axis continuous style geometry promoted
19. exact discovery style-coordinate freeze exporter / runbook implemented

未実施:

- local style-coordinate definition export / validation
- independent future style-confirmation preregistration
- future style-confirmation corpus generation
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
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

These remain state-level position morphologies, not playing styles, outcome classes, advantage labels, or AI implementation names.

Rejected actor-oriented mtaji k=2 remains:

```text
continuous relational-polarity coordinate
!= intrinsic position type
```

## Stage 3 Namua result

Audit hash:

```text
099f376fc3ab421165d9f04cb0544a78ea3170409e1a237dd7cb31f0a6cf9c0a
```

Current representation:

```text
N-PROG = deterministic reserve-depletion progress context
N-ACT  = continuous capture-activity coordinate
N-CON  = continuous structural-contrast coordinate
```

Previous namua k=2 / k=4 remain rejected as discrete position-type candidates.

N-PROG is effectively a deterministic namua clock and is not a style feature.

N-ACT / N-CON remain exploratory continuous state coordinates.

## Stage 4 Playing-Style result

Artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/playing-style-trajectory-audit.json
```

Audit hash:

```text
bb19b78205f87ac4271884fc406cd9a12b2b9b4675a38336f17479231ae6b98c
```

Population:

- full-phase game trajectories: 89
- unit: one game trajectory = one observation
- condition labels used as metadata only
- confirmed mtaji classifier not refit

Primary 10-descriptor style vector:

```text
namuaCaptureActivityMean
namuaCaptureActivityStd
namuaCaptureActivityTrendRho
namuaStructuralContrastMean
namuaStructuralContrastStd
namuaStructuralContrastTrendRho
mtajiM1Fraction
mtajiTypeSwitchRate
mtajiM1MeanDwell
mtajiM2MeanDwell
```

Excluded:

- raw ply
- N-PROG
- AI evaluator/search/depth
- condition ID
- winner/outcome

### PCA

```text
PC1 = 28.42%
PC2 = 18.86%
PC3 = 14.94%
PC4 = 14.57%
PC1..4 cumulative = 76.78%
PC5 = 8.46%
```

PC1–PC3 KDE density is unimodal.

For each PC1–PC3, 1-component GMM has lower BIC than 2–4 components.

### Discrete cluster decision

Predeclared k=2..6 did not yield a coherent playing-style type set.

Examples:

```text
k=2 KMeans-GMM ARI = 0.165
k=2 KMeans-Ward ARI = 0.114
k=2 GMM-Ward ARI = 0.696
```

80%-game resampling ×100 at k=2:

```text
KMeans median ARI = 0.545, p10 = 0.296
GMM median ARI    = 0.779, p10 = 0.403
```

Higher k did not rescue cross-method / resampling instability, and some GMM solutions produced one-game clusters.

Decision:

```text
playing-style geometry
= continuous multi-axis trajectory space
!= discrete style-type set in Stage 4 discovery corpus
```

No cluster count is promoted and no cluster receives a style name.

## Provisional compact style coordinate system

Use provisional IDs / behavioral aliases:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

These are trajectory-level coordinates, not state-level position types.

Interpretive anchors:

- C1: `mtajiM1Fraction`
- C2: `namuaStructuralContrastMean`
- C3: `namuaCaptureActivityTrendRho`
- C4: `mtajiTypeSwitchRate`

Aliases are provisional until independent future confirmation.

## Discovery coordinate freeze

Exporter:

```text
tools/experiments/export-position-typology-stage4-style-coordinates.py
```

Runbook:

```text
doc/position-typology/STAGE_4_STYLE_COORDINATE_FREEZE_RUNBOOK.md
```

Result document:

```text
doc/position-typology/STAGE_4_PLAYING_STYLE_RESULT.md
```

Checkpoint:

```text
doc/position-typology/checkpoints/2026-08-10-stage4-continuous-style-result-and-freeze-start.md
```

The exporter freezes:

- exact 10-feature order
- discovery StandardScaler mean / scale / variance
- PC1..PC4 component vectors
- canonical PCA signs via fixed positive behavioral anchors
- discovery game ID set hash
- source audit hashes

No future style-confirmation seed has been generated or inspected.

## Next local action

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/export-position-typology-stage4-style-coordinates.py
python tools/experiments/export-position-typology-stage4-style-coordinates.py
```

Expected artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-coordinate-definition-v1/style-coordinate-definition.json
```

Share only that JSON.

Only after validating the frozen definition may an independent style-confirmation preregistration be written.

## Global interpretation boundaries

- position type and playing style remain separate
- confirmed mtaji classifier may not be retroactively refit
- namua k=2/k=4 negative result is not rescued
- N-ACT/N-CON are continuous coordinates, not types
- N-PROG is progression context, not morphology/style
- Stage 4 same-pilot structure is not independent confirmation
- no post-hoc algorithm/k expansion to rescue discrete styles
- AI condition labels remain metadata only and may never themselves be named as styles
- future formal style confirmation must use untouched future seeds
- Study 1 formal decisions remain unchanged
