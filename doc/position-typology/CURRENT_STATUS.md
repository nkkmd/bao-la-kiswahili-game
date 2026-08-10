# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 2 mtaji confirmed / Stage 3 Namua continuous exploratory / Stage 4 style discovery / Stage 5 formal not-confirmed / Stage 6 replay integrity accepted / association analysis next**

Branch: `research/position-typology-and-playing-style`

## Current stop point

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

現在の停止点:

> **Stage 6 cross-study bridgeのfrozen protocolに従うcandidate-state deterministic replayを全6条件で完了・受理。全stateHash / move before-after / candidate phase integrityが通過した。次はfreeze済みprotocolを変更せず、MTAJI-M1/M2およびN-ACT/N-CONとのsecondary associationを計算する。**

## Completed scientific state

### Stage 2 — Mtaji position morphology

Frozen classifier:

```text
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Formal confirmation:

```text
PTYP-S2-MTAJI-CONFIRM-2026-08-10-v1
resultHash = 26b429e75f7a8ffd5681f3ba1f7b1915b8ad6f0470b1d3155f07381ffd6c5347
FORMAL DECISION = confirmed
```

Confirmed bounded ontology:

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

Actor-oriented old mtaji k=2 remains a **continuous relational-polarity coordinate**, not an intrinsic type.

### Stage 3 — Namua

```text
N-PROG = deterministic reserve-depletion progress context
N-ACT  = exploratory continuous capture-activity coordinate
N-CON  = exploratory continuous structural-contrast coordinate
```

No discrete Namua type is promoted. N-PROG is context only.

Stage 3 audit hash:

```text
099f376fc3ab421165d9f04cb0544a78ea3170409e1a237dd7cb31f0a6cf9c0a
```

### Stage 4 / 5 — Playing style

Stage 4 discovery found no coherent discrete playing-style cluster set.

Discovery-side continuous coordinates:

```text
STYLE-C1 = Engagement-Persistence
STYLE-C2 = Structural-Contrast Intensity
STYLE-C3 = Activity-Escalation Dynamics
STYLE-C4 = Morphology-Switching Tempo
```

Exact discovery coordinate definition:

```text
styleCoordinateDefinitionHash = 568f272bac81bf3a99e4629e9f5e75fe426383278064b5465b62fd6b01c08afc
```

Underlying exact state ingredient:

```text
styleIngredientDefinitionHash = b7ac18a99228cd38a8a29580e5f852240c3b9e16a1d1f7bb45c779e4c599c3da
```

Stage 5 independent confirmation:

```text
PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1
resultHash = 6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c
FORMAL DECISION = not-confirmed
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
STYLE-C1..C4 = discovery-derived exploratory trajectory descriptors
!= formally confirmed playing-style coordinate system
```

Passing G1/G3/G4 does not rescue G2/G5. No alternative coordinate count, cluster solution, threshold or preprocessing may be retrofitted to the same held-out corpus as confirmation.

## Fixed global boundaries

- Closed phase-transition Study 1 formal decisions remain unchanged.
- Study 1 formal corpus was not used for position/style discovery or Stage 2/5 confirmation.
- position type = state-level structural object.
- playing style = trajectory/policy-level pattern.
- AI evaluator/search/depth/condition labels are metadata, never position/style definitions.
- Study 1 formal archive data are read-only.
- No formal corpus is generated on GitHub Actions.
- negative / null / inconclusive results are not rescued post hoc.
- Stage 6 is secondary / hypothesis-generation only.
- Stage 6 may not rescue Stage 5 or alter Study 1.
- no new cluster search or Namua discrete-type search is authorized.
- Stage 6 relation protocol was frozen before association values were calculated and may not now be revised from the observed relation values.

## Stage 6 — Study 1 cross-study bridge

### Completed preparation

1. Study 1 final report / vocabulary / formal export index re-audited.
2. E-018/E-019/E-020 fixed archive inventory completed.
3. All three fixed archive SHA-256 values matched and unsafe member count was zero.
4. Candidate/game schema audit completed for the bridge scope.
5. Deterministic board replay feasibility established from archived moves.
6. Stage 6 scientific bridge protocol frozen before relation values.
7. Candidate-bearing formal games extracted read-only to a separate working area.
8. Deterministic replay completed for all fixed candidate targets.
9. **All six condition replay-integrity checks passed.**

Schema audit SHA-256:

```text
910990b049abf31e42deccac2756dc68a721e565127f842209abf72b4a62e90c
```

### Frozen Stage 6 protocol

Machine spec:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_SPEC.json
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

Narrative protocol:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_PROTOCOL.md
```

Core corpus scope:

```text
E-018 D2: P2 / LG
E-019 D3: P2 / LG
E-020 D3: P2 / LG
```

E-019 D1/V2 are outside the core D2/D3 bridge.

Inherited candidate population:

```text
category = A
distanceToTerminal >= 9
```

Positive phenotype:

```text
capture-branch-expansion
```

Frozen non-precursor comparator:

```text
temporary-spike
capture-branch-convergence
```

Excluded from comparator but reported in phase-overlap provenance:

```text
namua-to-mtaji-precursor
forcing-release-precursor
```

Primary descriptive unit:

```text
experiment + condition + trajectoryHash + candidatePly
```

Raw candidate rows are provenance only. No cross-condition/cross-experiment deduplication or pooled confirmatory inference is allowed.

### Replay integrity — accepted

Accepted hashes:

```text
replayedCandidateStateDatasetHash = 798dd665dd60e76c4860f95c0e1714b5bcb2aa9c968cabd715789aff23dfe3dc
replayAuditHash = 3cdacb0aacd1fcecb53b72833cfffd8c02576ae882956f780c0c465bfdf8acf5
allReplayChecksPassed = true
```

`auditHash` was independently recomputed from canonical JSON and matched exactly.

Per-condition replay:

```text
E-018 D2-LG  games 53   targets 54   PASS
E-018 D2-P2  games 104  targets 107  PASS
E-019 D3-LG  games 194  targets 194  PASS
E-019 D3-P2  games 114  targets 114  PASS
E-020 D3-LG  games 176  targets 176  PASS
E-020 D3-P2  games 112  targets 112  PASS
```

At replay completion:

```text
formalExperiment = false
associationAnalysisPerformed = false
gamesExecuted = false
formalAnalysisRerun = false
archivesModified = false
scientificAssociationValuesComputed = false
study1FormalDecisionsModified = false
stage5DecisionModified = false
```

Result document:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_REPLAY_RESULT.md
```

Checkpoint:

```text
doc/position-typology/checkpoints/2026-08-10-stage6-replay-integrity-accepted-association-authorized.md
```

## Stage 6 association analysis — next

Analyzer:

```text
tools/experiments/analyze-position-typology-stage6-cross-study-association.py
```

Runbook:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_ASSOCIATION_RUNBOOK.md
```

The analyzer is fixed to:

1. verify protocol / replay / classifier / ingredient hashes;
2. deduplicate only by `experiment + condition + trajectoryHash + candidatePly`;
3. report phase overlap first;
4. apply frozen MTAJI-M1/M2 only to `mtaji`;
5. apply frozen N-ACT/N-CON only to `namua`;
6. compare expansion with the already frozen non-precursor comparator;
7. report M1-fraction differences, Namua median differences and Cliff's delta;
8. compute no confirmatory p-values;
9. perform no refit, cluster search, STYLE-C1..C4 analysis, causal mediation, or pooled formal D2/D3 inference.

## Next local action

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile \
  tools/experiments/analyze-position-typology-stage6-cross-study-association.py

python tools/experiments/analyze-position-typology-stage6-cross-study-association.py
```

Expected output:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/association/cross-study-association-result.json
```

Share only that JSON.

The resulting relation is secondary / hypothesis-generation evidence only. It cannot modify Study 1 formal decisions or Stage 5 `not-confirmed`.
