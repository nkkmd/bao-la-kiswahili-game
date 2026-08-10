# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 2 mtaji confirmed / Stage 3 namua continuous exploratory / Stage 4 continuous style discovery / Stage 5 formal decision = not-confirmed / cross-study relation next**

Branch: `research/position-typology-and-playing-style`

## Current stop point

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

現在の停止点:

> **Stage 5 continuous playing-style independent confirmation完了。formal decisionは `not-confirmed`。次はStudy 1とのcross-study relationを、別のsecondary / hypothesis-generation境界で設計する。**

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

未実施:

- Study 1 cross-study relation protocol / execution
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

Condition counts:

```text
B-D1  27
B-D2  32
B-D3  30
LS-D2 28
V2-D2 31
LE-D2 28
```

All technical gates passed:

```text
full replay verification = pass
full-phase games >= 144 = pass
each condition >= 20 = pass
```

Formal result hash:

```text
6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c
```

### G1-G5

```text
G1 frozen 4D variance retention
   0.69823 >= 0.60
   PASS

G2 frozen vs held-out de-novo 4D subspace alignment
   maximum principal angle = 34.1058° > 25°
   mean principal angle    = 15.7369° > 15°
   FAIL

G3 behavioral anchors
   C1 rho = 0.7758
   C2 rho = 0.6022
   C3 rho = 0.6807
   C4 rho = 0.6637
   all >= 0.35
   PASS

G4 non-anchor behavioral signatures
   qualifying = 7/8
   >=1 qualifying relation for every C1..C4
   PASS

G5 80%-game subsample x100 subspace robustness
   p90(max principal angle) = 48.8193° > 30°
   FAIL
```

Formal decision rule:

```text
technical + G1..G5 all pass -> confirmed
technical pass + any G1..G5 fail -> not-confirmed
integrity/replay/population failure -> inconclusive
```

Therefore:

```text
FORMAL DECISION = not-confirmed
```

Result document:

```text
doc/position-typology/STAGE_5_PLAYING_STYLE_CONFIRMATION_RESULT.md
```

Formal checkpoint:

```text
doc/position-typology/checkpoints/2026-08-10-stage5-playing-style-formal-not-confirmed.md
```

## Stage 5 interpretation boundary

The correct interpretation is:

> Stage 4のfrozen continuous trajectory coordinatesはheld-out corpusでもbehavioral anchor / signatureをかなりよく再現した。しかし、事前登録したexact 4D PCA subspaceは、de-novo held-out geometryとのalignmentとgame-level resampling stabilityが不足し、formal confirmationには至らなかった。

Therefore:

```text
STYLE-C1..C4 = discovery-derived exploratory trajectory descriptors
!= formally confirmed playing-style coordinate system
```

Do not say:

- Bao has exactly four confirmed playing-style dimensions,
- STYLE-C1..C4 are confirmed styles,
- Stage 5 almost passed so it should be treated as confirmed,
- G3/G4 passing rescues G2/G5,
- a new k/cluster solution can replace the failed confirmation on the same held-out data.

Secondary density diagnostics also do not support a discrete-style rescue. C1/C3/C4 were KDE-unimodal and 1-component GMM BIC was preferred; C2 had a small secondary KDE peak but 1-component GMM BIC remained preferred.

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

Thus the strongest completed formal finding of this study remains the confirmed Mtaji two-type state morphology. The playing-style part yields useful hypothesis-generation coordinates but no independently confirmed style ontology.

## Next substantive phase — cross-study relation

The original `RESEARCH_PLAN.md` scheduled a later cross-study relation to closed phase-transition Study 1. Because independent confirmation stages were inserted during implementation, this next operational phase should be treated as **Stage 6 cross-study relation** while preserving the original plan's scientific purpose.

Candidate relation targets include:

- confirmed `MTAJI-M1` / `MTAJI-M2`,
- Mtaji relational-polarity coordinate as a continuous secondary descriptor,
- exploratory Namua N-ACT / N-CON only with explicit exploratory labeling,
- exploratory STYLE-C1..C4 only as secondary trajectory descriptors, never as confirmed styles,
- Study 1 `capture-branch-expansion`, forced-capture lifecycle, `sustained-forcing window`, and fixed depth2/depth3 search-profile findings.

This phase is secondary / hypothesis-generation. It may not change any Study 1 formal decision or rescue Stage 5.

## Next action

Before executing cross-study analysis:

1. inspect Study 1 final report / vocabulary / formal export index,
2. identify exactly which archived formal artifacts are required locally,
3. write a cross-study protocol with source hashes and interpretation boundaries,
4. only then run relation analysis.

No new confirmation of STYLE-C1..C4 is authorized on the Stage 5 held-out corpus.
