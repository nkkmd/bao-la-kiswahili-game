# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 2 mtaji confirmed / Stage 3 namua continuous / Stage 4 playing style continuous multi-axis / Stage 5 formal preregistration complete / held-out generation not yet executed**

Branch: `research/position-typology-and-playing-style`

## Current stop point

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

現在の停止点:

> **Stage 5 continuous playing-style independent confirmation のformal preregistration完了。次は未使用seed blockのローカルheld-out生成。**

Stage 5 held-out corpusは、このstatus更新時点ではまだ生成・inspectionしていない。

## 完了済み

1. Stage 0 instrumentation / corpus / symmetry audit
2. 96-game Stage 1 exploratory discovery pilot
3. feature / redundancy / clustering diagnostics
4. actor-oriented mtaji k=2をintrinsic typeとして棄却
5. actor-oriented mtaji k=2をcontinuous relational-polarity coordinateとして固定
6. actor/opponent-invariant mtaji morphology k=2発見
7. exact mtaji candidate definition freeze
8. Stage 2 independent confirmation preregistration
9. 192-game Stage 2 held-out generation / full replay verification
10. **Stage 2 mtaji formal decision = confirmed**
11. confirmed mtaji ontology naming
12. Stage 3 namua continuous-gradient audit
13. **namua = continuous-coordinate representation preferred / no discrete type promoted**
14. Stage 4 one-game-one-trajectory playing-style geometry audit
15. **Stage 4 discrete style set not supported**
16. **playing style = continuous multi-axis trajectory space** をdiscovery resultとして採用
17. exact Stage 4 style-coordinate definition export / validation / acceptance
18. Stage 5 future seed block and G1–G5 design fixed before held-out generation
19. underlying Stage 3 N-ACT/N-CON scaler dependencyを検出しformal runをguard
20. exact 44D style-ingredient definition export / validation / acceptance
21. Stage 5 machine spec finalization
22. Stage 5 formal analyzer implementation
23. Stage 5 narrative preregistration / runbook / formal checkpoint

未実施:

- Stage 5 held-out corpus generation
- Stage 5 full replay / provenance verification
- Stage 5 formal G1–G5 analysis
- Stage 5 formal result interpretation
- Study 1 cross-study relation analysis

## Fixed global boundaries

- Study 1 formal decisions are unchanged.
- Study 1 formal corpus is not used for current typology/style discovery or Stage 5 confirmation.
- position type = state-level structural object.
- playing style = trajectory / policy-level pattern.
- AI evaluator/search/depth/condition labels are metadata, not styles.
- negative/null discrete-cluster results may not be rescued post hoc.
- same-pilot robustness is not independent confirmation.
- Stage 5 formal confirmation is local only; GitHub Actions is not authorized.

## Confirmed Mtaji ontology

Frozen classifier:

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Formal Stage 2 result:

```text
preregistration = PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
resultHash = 26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347
FORMAL DECISION = confirmed
```

Confirmed names:

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

These remain state-level position morphologies, not playing styles or outcome classes.

Rejected actor-oriented mtaji k=2 remains:

```text
continuous relational-polarity coordinate
!= intrinsic position type
```

## Stage 3 Namua representation

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

Namua k=2 / k=4 remain rejected as discrete position-type candidates.

N-PROG is a progress clock and is excluded from playing-style features.

## Stage 4 Playing-Style discovery result

Audit hash:

```text
bb19b78205f87ac4271884fc406cd9a12b2b9b4675a38336f17479231ae6b98c
```

Population:

```text
89 full-phase game trajectories
one game trajectory = one observation
```

Primary 10-descriptor vector:

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

PCA:

```text
PC1 = 28.42%
PC2 = 18.86%
PC3 = 14.94%
PC4 = 14.57%
PC1..4 cumulative = 76.78%
```

Predeclared k=2..6 did not yield coherent cross-method / resampling-stable discrete styles. PC1-PC3 density was unimodal and 1-component GMM BIC was preferred.

Decision:

```text
playing-style geometry
= continuous multi-axis trajectory space
!= discrete style-type set in Stage 4 discovery corpus
```

No cluster count or discrete style class is promoted.

## Frozen Stage 4 style-coordinate definition

Accepted artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-coordinate-definition-v1/style-coordinate-definition.json
```

Accepted hash:

```text
568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

Frozen coordinates:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

Canonical positive anchors:

```text
C1 -> mtajiM1Fraction
C2 -> namuaStructuralContrastMean
C3 -> namuaCaptureActivityTrendRho
C4 -> mtajiTypeSwitchRate
```

These remain continuous trajectory-level coordinates.

## Frozen Stage 5 state ingredients

Accepted artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-ingredient-definition-v1/style-ingredient-definition.json
```

Accepted hash:

```text
b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

The artifact freezes the exact discovery-side 44D Namua state transform:

- field order,
- log1p field set,
- StandardScaler mean / scale / variance,
- N-ACT definition,
- N-CON definition.

Validation confirmed 44 dimensions, positive scaler scales, and scaler variance consistency.

It also binds the already frozen Mtaji classifier hash.

Held-out refit of the Namua state scaler or Mtaji classifier is prohibited.

Result document:

```text
doc/position-typology/STAGE_5_STYLE_INGREDIENT_DEFINITION_RESULT.md
```

## Stage 5 formal preregistration

Preregistration ID:

```text
PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1
```

Machine spec:

```text
doc/position-typology/preregistration/STAGE_5_PLAYING_STYLE_CONFIRMATION_SPEC.json
```

Spec state:

```text
status = preregistered-before-heldout-generation
formalExperiment = true
exploratory = false
executionBoundary.formalRunAuthorized = true
```

Frozen seed block:

```text
20350001..20350192
192 games
6 conditions x 32
maxPly = 100
opening = seeded-uniform legal, first 8 plies
```

This seed block is disjoint from prior discovery and Stage 2 blocks.

At preregistration checkpoint:

```text
held-out generated = false
held-out inspected = false
```

### Primary G1–G5

```text
G1 frozen 4D subspace variance ratio >= 0.60

G2 frozen vs de-novo 4D subspace:
   maximum principal angle <= 25 degrees
   mean principal angle <= 15 degrees

G3 behavioral anchors:
   C1 vs mtajiM1Fraction              >= 0.35
   C2 vs namuaStructuralContrastMean  >= 0.35
   C3 vs namuaCaptureActivityTrendRho >= 0.35
   C4 vs mtajiTypeSwitchRate          >= 0.35

G4 non-anchor signatures:
   >= 6/8 preserve sign with |rho| >= 0.20
   and >=1 qualifying association for every C1..C4

G5 80%-game subsample x100:
   p90(max principal angle) <= 30 degrees
```

Technical minimums:

```text
full-phase trajectories >= 144
full-phase trajectories per condition >= 20
full replay verification = passed
```

Formal decision:

```text
technical + G1..G5 all pass -> confirmed
technical pass, any G1..G5 fail -> not-confirmed
integrity/replay/provenance/population failure -> inconclusive
```

No secondary diagnostic can rescue or veto the decision.

Formal code:

```text
tools/experiments/run-position-typology-stage5-style-confirmation.js
tools/experiments/verify-position-typology-stage5-style-confirmation.js
tools/experiments/analyze-position-typology-stage5-style-confirmation.py
```

Narrative preregistration:

```text
doc/position-typology/STAGE_5_PLAYING_STYLE_CONFIRMATION_PREREGISTRATION.md
```

Runbook:

```text
doc/position-typology/STAGE_5_PLAYING_STYLE_CONFIRMATION_RUNBOOK.md
```

Checkpoint:

```text
doc/position-typology/checkpoints/2026-08-10-stage5-playing-style-confirmation-preregistration.md
```

## Next local action

Follow the formal runbook exactly.

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version
node --version

python -m py_compile tools/experiments/analyze-position-typology-stage5-style-confirmation.py

node tools/experiments/run-position-typology-stage5-style-confirmation.js
node tools/experiments/verify-position-typology-stage5-style-confirmation.js
python tools/experiments/analyze-position-typology-stage5-style-confirmation.py
```

Expected final artifact:

```text
artifacts/local/position-typology/stage5-playing-style-confirmation-v1/confirmation-result.json
```

Share only that JSON.

## No-post-hoc boundary after Stage 5 generation begins

Do not change:

- seed block,
- STYLE-C1..C4 count,
- 10-descriptor set,
- 44D Namua state scaler,
- N-ACT/N-CON definitions,
- Mtaji classifier,
- Stage 4 10D scaler,
- 4x10 canonical component matrix,
- axis orientation,
- G1–G5 thresholds,
- formal decision rule.

No discrete-cluster rescue is authorized.

Study 1 formal decisions and Stage 2 Mtaji formal confirmation remain unchanged.
