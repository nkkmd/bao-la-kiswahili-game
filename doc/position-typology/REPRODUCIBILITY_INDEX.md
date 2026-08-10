# Reproducibility Index — Bao Position Typology and Playing Style Study

Date: 2026-08-10  
Status: **final index**

This index records the principal definitions, result hashes, local artifact paths and repository documents required to reconstruct the scientific state of the study without changing its formal decisions.

## 1. Canonical repository documents

```text
doc/position-typology/CURRENT_STATUS.md
doc/position-typology/STUDY_1_OVERVIEW.md
doc/position-typology/STUDY_1_FINAL_REPORT.md
doc/position-typology/STUDY_1_VOCABULARY.md
doc/position-typology/RESEARCH_PLAN.md
doc/position-typology/REPRODUCIBILITY_INDEX.md
```

## 2. Stage 0 — instrumentation / identity

Primary feature extractor:

```text
tools/experiments/lib/position-typology-features.js
```

Identity definitions:

```text
historicalStateHash
ruleStateKey
seatCanonicalKey
```

Feature audit hash:

```text
3a98b99dd5fbe1cf94a61124ad4687348cc2ce8ed49db450540ae6d236391129
```

Stage 0 smoke source hash:

```text
d72c2c20e4f4e6376208e687d65157b1ee4756c8
```

Key documents:

```text
doc/position-typology/STAGE_0_AUDIT.md
doc/position-typology/STAGE_0_RUNBOOK.md
doc/position-typology/STAGE_0_SMOKE_RESULT.md
```

## 3. Stage 1 — exploratory discovery

Exploratory pilot source hash:

```text
cb5376145a8aeddf5ca42bc9c74e6a0efdb0e114
```

Population:

```text
96 games
4834 primary eligible states
3339 Namua
1495 Mtaji
```

Key analysis hashes:

```text
initial clustering diagnostic
  dc57cd1b5da3d1ff67c5a59bccef0f4bf9463bcc57296aaf48acec19b47243cf

candidate stability
  7ed8bad7137cee50fa7f55d80f27d27ea90f4be9756de023acc020f25f0df1ae

polarity/discreteness audit
  3ac4b402c122702682ccbca7fea4488694a6d89544f1632e951d23aa1613733d

role-invariant Mtaji audit
  7a2cea55a48f8d5566f95ff5a08f8966a146e6add262d742724a3bcfd573d2c3
```

Frozen Mtaji candidate definition:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Typical local artifact path:

```text
artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json
```

Key documents:

```text
doc/position-typology/STAGE_1_PILOT_RESULT.md
doc/position-typology/STAGE_1_FEATURE_AUDIT_RESULT.md
doc/position-typology/STAGE_1_CLUSTER_DIAGNOSTIC_RESULT.md
doc/position-typology/STAGE_1_POLARITY_AUDIT_RESULT.md
doc/position-typology/STAGE_1_STABILITY_AUDIT_RESULT.md
doc/position-typology/STAGE_1_INVARIANT_MORPHOLOGY_RESULT.md
doc/position-typology/STAGE_1_MTAJI_CANDIDATE_DEFINITION_RESULT.md
```

## 4. Stage 2 — Mtaji formal confirmation

Preregistration:

```text
PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
```

Preregistration spec SHA-256:

```text
f34adfc156026147f5253de24c1cf256332d38c4e8deaf7aeab98a97275b3507
```

Formal seed block:

```text
20310001..20310192
192 games
```

Formal result:

```text
resultHash
= 26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347

FORMAL DECISION = confirmed
```

Canonical ontology:

```text
doc/position-typology/MTAJI_CONFIRMED_ONTOLOGY.md
```

Other key documents:

```text
doc/position-typology/STAGE_2_MTAJI_CONFIRMATION_PREREGISTRATION.md
doc/position-typology/STAGE_2_MTAJI_CONFIRMATION_RUNBOOK.md
doc/position-typology/STAGE_2_MTAJI_CONFIRMATION_RESULT.md
```

## 5. Stage 3 — Namua continuous representation

Audit hash:

```text
099f376fc3ab421165d9f04cb0544a78ea3170409e1a237dd7cb31f0a6cf9c0a
```

Coordinates:

```text
N-PROG
N-ACT
N-CON
```

Analyzer:

```text
tools/experiments/analyze-position-typology-stage3-namua-gradients.py
```

Result document:

```text
doc/position-typology/STAGE_3_NAMUA_GRADIENT_RESULT.md
```

Interpretation boundary:

```text
exploratory continuous representation
no discrete Namua position type promoted
```

## 6. Stage 4 — playing-style discovery

Trajectory audit hash:

```text
bb19b78205f87ac4271884fc406cd9a12b2b9b4675a38336f17479231ae6b98c
```

Discovery population:

```text
89 full-phase trajectories
```

Exact style coordinate definition:

```text
styleCoordinateDefinitionHash
= 568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

Typical local artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-coordinate-definition-v1/style-coordinate-definition.json
```

Underlying state ingredient definition:

```text
styleIngredientDefinitionHash
= b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

Typical local artifact:

```text
artifacts/local/position-typology/stage4-playing-style-exploratory-v1/style-ingredient-definition-v1/style-ingredient-definition.json
```

Key documents:

```text
doc/position-typology/STAGE_4_PLAYING_STYLE_RESULT.md
doc/position-typology/STAGE_4_STYLE_COORDINATE_DEFINITION_RESULT.md
doc/position-typology/STAGE_5_STYLE_INGREDIENT_DEFINITION_RESULT.md
```

## 7. Stage 5 — formal independent playing-style confirmation

Preregistration:

```text
PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1
```

Formal seed block:

```text
20350001..20350192
192 generated games
176 full-phase trajectories
```

Formal result:

```text
resultHash
= 6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c

FORMAL DECISION = not-confirmed
```

Formal analyzer:

```text
tools/experiments/analyze-position-typology-stage5-style-confirmation.py
```

Key documents:

```text
doc/position-typology/STAGE_5_PLAYING_STYLE_CONFIRMATION_PREREGISTRATION.md
doc/position-typology/STAGE_5_PLAYING_STYLE_CONFIRMATION_RUNBOOK.md
doc/position-typology/STAGE_5_PLAYING_STYLE_CONFIRMATION_RESULT.md
```

Critical boundary:

```text
No post-hoc coordinate count / descriptor / preprocessing / threshold / cluster rescue
on the Stage 5 held-out corpus.
```

## 8. Stage 6 — Study 1 cross-study bridge

### Fixed Study 1 formal archives

```text
E-018
bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5

E-019
6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75

E-020
37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2
```

Archive inventory local artifact:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/study1-archive-inventory.json
```

Schema audit SHA-256:

```text
910990b049abf31e42deccac2756dc68a721e565127f842209abf72b4a62e90c
```

Frozen cross-study protocol:

```text
protocolHash
= 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

Machine spec:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_SPEC.json
```

Replay dataset hash:

```text
798dd665dd60e76c4860f95c0e1714b5bcb2aa9c968cabd715789aff23dfe3dc
```

Replay audit hash:

```text
3cdacb0aacd1fcecb53b72833cfffd8c02576ae882956f780c0c465bfdf8acf5
```

Replay tools:

```text
tools/experiments/prepare-position-typology-stage6-cross-study-bridge.py
tools/experiments/replay-position-typology-stage6-candidate-states.js
```

Association analyzer:

```text
tools/experiments/analyze-position-typology-stage6-cross-study-association.py
```

Association result:

```text
resultHash
= 59b210fb76970314a9c3c29b3cf47070172e0aa850d1e47c0c1ab06f3006537a
```

Local result:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/association/cross-study-association-result.json
```

Result document:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_ASSOCIATION_RESULT.md
```

## 9. Closed phase-transition Study 1 dependency

Stage 6 depends on but does not modify the closed phase-transition study.

Canonical sources:

```text
doc/phase-transition/STUDY_1_FINAL_REPORT.md
doc/phase-transition/STUDY_1_VOCABULARY.md
doc/phase-transition/FORMAL_EXPORT_INDEX.md
```

Fixed formal decisions remain:

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only at hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only at hard / bao / depth3, legacy > phase2
```

## 10. Reproduction rules

When reproducing any stage:

1. use the exact frozen definition/hash for that stage;
2. do not regenerate a formal corpus when an archived formal artifact is being verified;
3. do not fit scalers/classifiers on held-out or Stage 6 bridge data;
4. preserve game/trajectory dependence and the stage-specific deduplication unit;
5. keep Namua and Mtaji representations phase-specific;
6. do not use AI condition IDs as semantic features;
7. do not reinterpret Stage 5 `not-confirmed` as confirmation because some secondary metrics passed;
8. do not pool Stage 6 corpora into a new confirmatory inference;
9. do not modify closed Study 1 decisions from cross-study secondary analysis;
10. retain all negative/null results in the scientific record.
