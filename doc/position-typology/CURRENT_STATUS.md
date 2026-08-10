# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 2 mtaji confirmed / Stage 3 namua continuous exploratory / Stage 4 continuous style discovery / Stage 5 formal decision = not-confirmed / Stage 6 Study 1 inventory accepted / schema audit next**

Branch: `research/position-typology-and-playing-style`

## Current stop point

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

現在の停止点:

> **Stage 6 Study 1 formal archive inventoryをread-onlyで完了・受理。3 archiveの固定SHA-256一致とmember-path availabilityを確認済み。次はcandidate/game schemaだけを監査し、cross-study relation値を計算する前にbridge protocolを固定する。**

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
16. Stage 4 continuous multi-axis trajectory geometryをdiscovery resultとして採用
17. exact Stage 4 style-coordinate definition export / validation / acceptance
18. underlying Stage 3 N-ACT/N-CON 44D state transform freeze
19. Stage 5 future seed block / G1-G5 / no-rescue rule preregistration
20. 192-game Stage 5 held-out generation
21. Stage 5 full replay / provenance verification
22. Stage 5 frozen-transfer formal analysis
23. **Stage 5 formal decision = not-confirmed**
24. Stage 5 formal result document / checkpoint / README更新
25. closed Study 1 final report / vocabulary / formal export index再監査
26. Stage 6 read-only archive inventory tooling / runbook / checkpoint実装
27. **Stage 6 local archive inventory complete / accepted**
28. Stage 6 schema-only audit tooling / runbook / checkpoint実装

未実施:

- Stage 6 archive schema audit local execution
- Stage 6 exact cross-study scientific bridge protocol freeze
- Stage 6 cross-study relation analysis
- final research integration / overview / final report / vocabulary / reproducibility index

## Fixed global boundaries

- Closed phase-transition Study 1のformal decisionsを変更しない。
- Study 1 formal corpusはposition/style discoveryやStage 2/5 confirmationには使用していない。
- position type = state-level structural object.
- playing style = trajectory / policy-level pattern.
- AI evaluator/search/depth/condition labelsはmetadataでありstyle名ではない。
- negative / null / inconclusive resultをpost-hoc rescueしない。
- same-pilot robustnessをindependent confirmationと呼ばない。
- formal corpusをGitHub Actionsで生成しない。
- Stage 5失敗後にcoordinate数、descriptor、preprocessing、threshold、seed、cluster searchを変更して同じheld-out dataをconfirmationへ再利用しない。
- Stage 6はsecondary / hypothesis-generationであり、Study 1 formal resultやStage 5 resultを救済しない。
- Stage 6 relation protocolを固定する前にposition-type / coordinate association値を計算しない。

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

These are bounded, state-level position morphologies under the frozen representation / preregistered population. They are not playing styles, outcome classes, strength labels, or universal/final Bao ontology.

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

Current exploratory representation:

```text
N-PROG = deterministic reserve-depletion progress context
N-ACT  = continuous capture-activity coordinate
N-CON  = continuous structural-contrast coordinate
```

Namua k=2 / k=4 remain rejected as discrete position-type candidates.

N-PROG is a progress clock and is excluded from playing-style features.

N-ACT / N-CON remain exploratory continuous state coordinates; they have not received independent formal confirmation as a fixed state-coordinate system.

## Stage 4 Playing-Style discovery

Stage 4 audit hash:

```text
bb19b78205f87ac4271884fc406cd9a12b2b9b4675a38336f17479231ae6b98c
```

Discovery population:

```text
89 full-phase game trajectories
one game trajectory = one observation
```

Frozen 10-descriptor vector:

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

Excluded from style definition:

- raw ply,
- N-PROG,
- AI evaluator/search/depth,
- condition ID,
- outcome/winner.

Discovery PCA:

```text
PC1 = 28.42%
PC2 = 18.86%
PC3 = 14.94%
PC4 = 14.57%
PC1..4 cumulative = 76.78%
```

Predeclared k=2..6 did not yield coherent cross-method / resampling-stable discrete playing styles. No discrete cluster set is promoted.

Frozen discovery coordinate definition:

```text
styleCoordinateDefinitionHash = 568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

Discovery-derived coordinates:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

These are continuous trajectory descriptors, not discrete classes.

Underlying frozen state-ingredient definition:

```text
styleIngredientDefinitionHash = b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

## Stage 5 formal independent confirmation

Preregistration:

```text
PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1
```

Formal seed block:

```text
20350001..20350192
192 generated games
6 conditions x 32
```

Full-phase formal population:

```text
176 game trajectories
```

All technical gates passed.

Formal result hash:

```text
6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c
```

Primary result:

```text
G1 frozen 4D variance retention      PASS  0.69823 >= 0.60
G2 de-novo subspace alignment        FAIL  max 34.1058° > 25°; mean 15.7369° > 15°
G3 behavioral anchors                PASS  all four rho >= 0.35
G4 non-anchor signatures             PASS  7/8; >=1 per coordinate
G5 game-resample subspace robustness FAIL  p90 max-angle 48.8193° > 30°
```

Therefore:

```text
FORMAL DECISION = not-confirmed
```

Correct synthesis:

> Frozen trajectory coordinates retained substantial held-out variance and reproduced their behavioral anchors/signatures, but the preregistered exact four-dimensional PCA subspace lacked sufficient independent alignment and trajectory-resampling stability. The exact 4D playing-style geometry is therefore not confirmed.

```text
STYLE-C1..C4 = discovery-derived exploratory trajectory descriptors
!= formally confirmed playing-style coordinate system
```

Passing G1/G3/G4 does not rescue G2/G5. Secondary density diagnostics do not authorize a discrete-style rescue.

## Current scientific synthesis

### Position-level

```text
Mtaji:
  MTAJI-M1 / MTAJI-M2
  -> formally confirmed bounded two-type morphology

Namua:
  N-PROG / N-ACT / N-CON
  -> exploratory continuous representation
  -> no discrete type promoted
```

### Trajectory / playing-style level

```text
Stage 4 discrete style clustering -> unsupported
Stage 4 STYLE-C1..C4 continuous geometry -> discovered / exploratory
Stage 5 exact 4D continuous geometry -> formally not-confirmed
```

The strongest completed formal finding remains the confirmed Mtaji two-type state morphology. The playing-style part yields useful hypothesis-generation coordinates but no independently confirmed style ontology.

## Stage 6 — Study 1 cross-study bridge

The original `RESEARCH_PLAN.md` scheduled a later cross-study relation to closed phase-transition Study 1. Because independent confirmation stages were inserted during implementation, this operational phase is called **Stage 6**.

Study 1 fixed sources:

```text
doc/phase-transition/STUDY_1_FINAL_REPORT.md
doc/phase-transition/STUDY_1_VOCABULARY.md
doc/phase-transition/FORMAL_EXPORT_INDEX.md
```

### Archive inventory — completed

Accepted local artifact:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/study1-archive-inventory.json
```

Boundary flags remained:

```text
archivesExtracted = false
formalAnalysisRerun = false
gamesExecuted = false
scientificResultValuesInspected = false
study1FormalDecisionsModified = false
stage5DecisionModified = false
```

Archive identity:

```text
E-018
SHA-256 bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5
member count 4046
unsafe members 0
formal game JSON 4000

E-019
SHA-256 6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75
member count 26120
unsafe members 0
formal game JSON 26000

E-020
SHA-256 37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2
member count 9049
unsafe members 0
formal game JSON 9000
```

Required member classes exist in all relevant archives:

- formal game JSON,
- `candidate-control-metrics.csv`,
- candidate/archetype CSV,
- manifests,
- integrity reports,
- evaluation results,
- paired endpoint results.

Inventory result document:

```text
doc/position-typology/STAGE_6_STUDY1_ARCHIVE_INVENTORY_RESULT.md
```

### Fixed core bridge scope

The core cross-study bridge is limited to:

```text
E-018 D2: P2 / LG
E-019 D3: P2 / LG
E-020 D3: P2 / LG
```

E-019 D1 and V2 are not part of this D2/D3 bridge core.

No candidate position is forced into a phase-incompatible representation. MTAJI-M1/M2 may classify only `mtaji`; Namua remains separate.

### Schema audit — next

Tool:

```text
tools/experiments/inspect-position-typology-stage6-study1-archive-schemas.py
```

Runbook:

```text
doc/position-typology/STAGE_6_STUDY1_ARCHIVE_SCHEMA_AUDIT_RUNBOOK.md
```

Checkpoint:

```text
doc/position-typology/checkpoints/2026-08-10-stage6-study1-archive-inventory-accepted.md
```

The schema audit reports only:

- exact candidate-metrics member paths,
- candidate CSV header names,
- archived game JSON key/type structure,
- move / observation field availability,
- deterministic replay feasibility.

It may not calculate candidate frequencies, phenotype associations, position-type frequencies, coordinate values, or search-profile relation values.

## Next local action

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile \
  tools/experiments/inspect-position-typology-stage6-study1-archive-schemas.py

python tools/experiments/inspect-position-typology-stage6-study1-archive-schemas.py
```

Expected artifact:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/study1-archive-schema-audit.json
```

Share only that JSON.

Only after schema feasibility is accepted will the exact cross-study relation population, comparator, replay verification, phase-specific representation and descriptive endpoints be frozen. Association values remain prohibited until that protocol freeze.
