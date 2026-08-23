# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **RESEARCH COMPLETE / final integration complete**

Branch: `research/position-typology-and-playing-style`

## Current state

研究 **「Baoにおける局面類型と棋風の発見・検証」** は、discovery、独立confirmation、negative-result retention、Study 1 cross-study bridge、最終統合まで完了した。

現在の停止点:

> **科学的解析は完了。Stage 7 final integrationとしてOverview / Final Report / Vocabulary / Reproducibility Indexを作成済み。今後この研究のformal decisionや解釈境界を変更する追加解析は行わず、新しい問いはfuture studyとして開始する。**

Scientific source of truth:

```text
doc/position-typology/STUDY_1_FINAL_REPORT.md
```

First-read overview:

```text
doc/position-typology/STUDY_1_OVERVIEW.md
```

Vocabulary:

```text
doc/position-typology/STUDY_1_VOCABULARY.md
```

Reproducibility:

```text
doc/position-typology/REPRODUCIBILITY_INDEX.md
```

## Final scientific decisions

### Mtaji position morphology

Frozen classifier:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Stage 2:

```text
PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
resultHash = 26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347
FORMAL DECISION = CONFIRMED
```

Confirmed bounded ontology:

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
           捕獲関与・低コントラスト型局面形態

MTAJI-M2 = Capture-Sparse High-Contrast Morphology
           捕獲希薄・高コントラスト型局面形態
```

These are state-level bounded morphologies, not playing styles, outcome classes, strength labels, or universal/final Bao ontology.

### Namua

```text
N-PROG = deterministic reserve-depletion progress context
N-ACT  = exploratory continuous capture-activity coordinate
N-CON  = exploratory continuous structural-contrast coordinate
```

Final decision:

```text
no discrete Namua position type promoted
```

N-PROG is context only. N-ACT/N-CON remain exploratory continuous coordinates.

Stage 3 audit:

```text
099f376fc3ab421165d9f04cb0544a78ea3170409e1a237dd7cb31f0a6cf9c0a
```

### Actor-oriented old Mtaji k=2

Final decision:

```text
continuous relational-polarity coordinate
!= intrinsic position type
```

It must not be resurrected as a confirmed/provisional discrete type from the existing corpus.

### Playing style discovery

Stage 4 discrete k=2..6 diagnostics did not support a coherent stable cluster set.

```text
no discrete playing-style typology promoted
```

Discovery-derived continuous descriptors:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

Exact discovery definition:

```text
styleCoordinateDefinitionHash
= 568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

Underlying state transform:

```text
styleIngredientDefinitionHash
= b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

### Stage 5 formal playing-style confirmation

```text
PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1
resultHash = 6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c
FORMAL DECISION = NOT-CONFIRMED
```

Primary gates:

```text
G1 frozen 4D variance retention      PASS  0.69823 >= 0.60
G2 de-novo subspace alignment        FAIL  max 34.1058° > 25°; mean 15.7369° > 15°
G3 behavioral anchors                PASS
G4 non-anchor signatures             PASS  7/8
G5 game-resample subspace robustness FAIL  p90 max-angle 48.8193° > 30°
```

Therefore:

```text
STYLE-C1..C4
= discovery-derived exploratory trajectory descriptors
!= formally confirmed playing-style coordinate system
```

Passing G1/G3/G4 does not rescue G2/G5.

## Stage 6 — Study 1 cross-study bridge

Closed phase-transition Study 1 formal decisions remain unchanged.

Fixed bridge scope:

```text
E-018 D2: P2 / LG
E-019 D3: P2 / LG
E-020 D3: P2 / LG
```

Frozen bridge protocol:

```text
protocolHash
= 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

Replay integrity:

```text
replayedCandidateStateDatasetHash
= 798dd665dd60e76c4860f95c0e1714b5bcb2aa9c968cabd715789aff23dfe3dc

replayAuditHash
= 3cdacb0aacd1fcecb53b72833cfffd8c02576ae882956f780c0c465bfdf8acf5

allReplayChecksPassed = true
```

Association result:

```text
resultHash
= 59b210fb76970314a9c3c29b3cf47070172e0aa850d1e47c0c1ab06f3006537a

raw eligible candidate rows = 757
unique trajectory-ply units = 227
duplicate rows collapsed = 530
```

### Phase relation

Across all six fixed conditions:

```text
capture-branch-expansion = 59
Namua expansion = 59
Mtaji expansion = 0
```

Therefore MTAJI-M1/M2 association with expansion is not estimable in this bridge population.

Correct bounded interpretation:

> In the fixed E-018 D2 / E-019 D3 / E-020 D3 bridge population, every observed capture-branch-expansion unit occurred during Namua rather than Mtaji.

Do not generalize this to universal impossibility of Mtaji expansion.

### N-ACT relation

Expansion-versus-comparator Cliff's delta was positive in all six conditions.

Repeated strongest D3 legacy relation:

```text
E-019 D3-LG  +0.6732
E-020 D3-LG  +0.6923
```

Bounded interpretation:

> Within the fixed bridge scope, capture-branch-expansion tended to occupy comparatively high Namua capture-activity states.

This is secondary/hypothesis-generation evidence only.

### N-CON relation

No universal direction was observed.

Repeated D3 descriptive contrast:

```text
legacy:
  E-019 -0.1111
  E-020 -0.0989

phase2:
  E-019 +0.6667
  E-020 +0.5429
```

This does not establish causal mediation or a general search-profile × depth interaction.

Stage 6 result document:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_ASSOCIATION_RESULT.md
```

## Final scientific synthesis

```text
Bao position structure
├─ Namua
│  ├─ discrete type: not promoted
│  ├─ N-PROG: context
│  ├─ N-ACT: exploratory continuous coordinate
│  └─ N-CON: exploratory continuous coordinate
│
└─ Mtaji
   ├─ MTAJI-M1: formally confirmed
   └─ MTAJI-M2: formally confirmed

Playing style
├─ discrete style clusters: unsupported
└─ exact STYLE-C1..C4 4D geometry: formal NOT-CONFIRMED

Cross-study
└─ capture-branch-expansion:
   fixed D2/D3 bridgeでは59/59がNamua
   and descriptively toward higher N-ACT
```

The study therefore supports a **phase-dependent asymmetric representation**, not one universal clustering scheme for all Bao states.

## Negative / null results that must remain preserved

- old actor-oriented Mtaji k=2 is not an intrinsic position type.
- no discrete Namua type is promoted.
- Stage 4 k=2..6 does not support a coherent discrete style ontology.
- Stage 5 exact 4D style geometry is formally `NOT-CONFIRMED`.
- Stage 6 cannot estimate M1-vs-M2 expansion preference because observed Mtaji expansion count is zero.
- N-CON does not show one universal expansion direction across all conditions.

None of these may be removed from the scientific synthesis because later results are more convenient.

## Fixed global boundaries

- position type = state-level structural object.
- playing style = trajectory/policy-level pattern.
- AI evaluator/search/depth/condition labels are metadata, not type/style definitions.
- closed phase-transition Study 1 formal decisions are unchanged.
- Study 1 formal corpus was not used for discovery or Stage 2/5 confirmation.
- negative/null/inconclusive results are not rescued post hoc.
- no formal threshold is relaxed after result inspection.
- no held-out-side classifier/scaler refit is allowed for a frozen analysis.
- no Namua discrete-type rescue is allowed on the existing data.
- no Stage 5 coordinate-count/feature/preprocessing/cluster rescue is allowed on the existing held-out corpus.
- Stage 6 remains secondary/hypothesis-generation only.
- no confirmatory p-value or causal mediation claim is authorized from Stage 6.
- no pooled new D2/D3 formal inference is authorized from Stage 6.

## Stage 7 — final integration

Complete:

```text
doc/position-typology/STUDY_1_OVERVIEW.md
doc/position-typology/STUDY_1_FINAL_REPORT.md
doc/position-typology/STUDY_1_VOCABULARY.md
doc/position-typology/REPRODUCIBILITY_INDEX.md
```

The original `RESEARCH_PLAN.md` called final integration Stage 6. During implementation, independent confirmation stages were inserted and the cross-study bridge became operational Stage 6; final integration is therefore recorded as Stage 7 without changing the original plan document retrospectively.

## Future work

Any further empirical work starts as a new study with new prospective boundaries.

Priority candidates:

1. independent formal replication of N-ACT/N-CON as Namua state coordinates;
2. prospective temporal analysis of Namua→Mtaji and capture-branch-expansion;
3. a new playing-style model family that does not reuse Stage 5 held-out data as confirmation;
4. human/expert validation of MTAJI-M1/M2 representative boards;
5. broader engine/search implementation external-validity studies.

No additional analysis is required to close the present research.
