# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 2 mtaji confirmed / Stage 3 namua continuous / Stage 4 style geometry continuous multi-axis / STYLE-C1..C4 exact definition accepted / Stage 5 formal run blocked pending underlying state-ingredient freeze**

Branch: `research/position-typology-and-playing-style`

## Current stop point

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

現在の停止点:

> **Stage 5 style ingredient definition exporter のローカル実行前。Stage 5 held-out corpus generationはまだ禁止。**

完了済み:

1. Stage 0 instrumentation / corpus / symmetry audit
2. 96-game Stage 1 exploratory discovery pilot
3. feature / redundancy / clustering diagnostics
4. actor-oriented mtaji k=2をintrinsic typeとして棄却し relational-polarity coordinateへ整理
5. actor/opponent-invariant mtaji morphology k=2発見
6. exact mtaji candidate definition freeze
7. Stage 2 independent confirmation preregistration / 192-game held-out run / full replay verification
8. **Stage 2 mtaji formal decision = confirmed**
9. confirmed mtaji ontology naming
10. Stage 3 namua continuous-gradient audit
11. **namua = continuous-coordinate representation preferred / no discrete type promoted**
12. Stage 4 one-game-one-trajectory playing-style geometry audit
13. **Stage 4 discrete style set not supported**
14. **playing style = continuous multi-axis trajectory space** をprovisional discovery resultとして採用
15. exact Stage 4 style-coordinate definition export / inspection / acceptance
16. Stage 5 future seed block and G1-G5 design drafted before any held-out generation
17. underlying Stage 3 N-ACT/N-CON scaler dependencyを検出し、formal runをguard
18. exact state-ingredient freeze exporter実装

未実施:

- Stage 5 style ingredient definition export / hash acceptance
- Stage 5 machine spec finalization
- Stage 5 formal preregistration checkpoint
- Stage 5 held-out corpus generation
- Stage 5 full replay verification
- Stage 5 formal G1-G5 analysis
- Study 1 cross-study relation analysis

## Fixed global boundaries

- Study 1 formal decisions are unchanged.
- Study 1 formal corpus is not used for current typology/style discovery or Stage 5 confirmation.
- position type = state-level structural object.
- playing style = trajectory / policy-level pattern.
- AI evaluator/search/depth/condition labels are metadata, not styles.
- negative/null discrete-cluster results may not be rescued post hoc.
- same-pilot robustness is not independent confirmation.
- future formal confirmation is local only; GitHub Actions is not authorized.

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

## Accepted exact style-coordinate definition

Artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-coordinate-definition-v1/style-coordinate-definition.json
```

Accepted hash:

```text
568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

The uploaded artifact was independently checked for canonical JSON hash, dimensions, scaler consistency, component dimensions, anchor orientation, and source hashes.

Frozen provisional coordinates:

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

These are continuous trajectory-level coordinates. They are not discrete style classes.

Result document:

```text
doc/position-typology/STAGE_4_STYLE_COORDINATE_DEFINITION_RESULT.md
```

## Stage 5 future confirmation design — currently guarded draft

Future seed block already selected before any generation:

```text
20350001..20350192
192 games
6 conditions x 32
```

Draft machine spec:

```text
doc/position-typology/preregistration/STAGE_5_PLAYING_STYLE_CONFIRMATION_SPEC.json
```

Primary intended gates are already fixed conceptually:

```text
G1 frozen 4D subspace variance retention
G2 frozen vs held-out de-novo 4D subspace principal-angle alignment
G3 four behavioral-anchor correlations
G4 eight prespecified non-anchor behavioral signatures
G5 80%-game subsample subspace robustness
```

No cluster rescue is permitted.

### Important guard discovered before held-out generation

Stage 4's Namua game descriptors depend on Stage 3 `N-ACT` / `N-CON`. Stage 3 did not serialize the exact discovery-side 44D StandardScaler arrays.

Held-out refitting of that scaler is not acceptable for the intended frozen-transfer confirmation.

Therefore the exact state ingredient must be frozen first.

Current machine-spec state:

```text
status = draft-pending-style-ingredient-freeze
formalExperiment = false
executionBoundary.formalRunAuthorized = false
coordinateIngredients.requiredHash = null
```

Stage 5 corpus generation is **not authorized yet**.

## Next local action

Run only the ingredient exporter:

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile tools/experiments/export-position-typology-stage5-style-ingredient-definition.py
python tools/experiments/export-position-typology-stage5-style-ingredient-definition.py
```

Expected artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-ingredient-definition-v1/style-ingredient-definition.json
```

Share only that JSON.

Runbook:

```text
doc/position-typology/STAGE_5_STYLE_INGREDIENT_FREEZE_RUNBOOK.md
```

Checkpoint:

```text
doc/position-typology/checkpoints/2026-08-10-stage4-style-coordinate-freeze-and-stage5-ingredient-guard.md
```

After that artifact is accepted, its hash will be inserted into the machine spec, the Stage 5 analyzer will be finalized, formal preregistration will be checkpointed, and only then will held-out generation be authorized.
