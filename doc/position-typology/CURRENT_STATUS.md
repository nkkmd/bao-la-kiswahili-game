# 局面類型と棋風研究 — 現在地

更新日: 2026-08-10  
Status: **Stage 2 mtaji confirmed / Stage 3 Namua continuous exploratory / Stage 4 style discovery / Stage 5 formal not-confirmed / Stage 6 protocol frozen / replay integrity next**

Branch: `research/position-typology-and-playing-style`

## Current stop point

研究 **「Baoにおける局面類型と棋風の発見・検証」** を進行中。

現在の停止点:

> **Stage 6 Study 1 cross-study bridge protocolをassociation値を見る前にfreeze済み。次はfixed formal archivesからcandidate-bearing gamesのみをread-only抽出し、candidate plyまでのdeterministic replay / stateHash / phase integrityを検証する。MTAJI-M1/M2・N-ACT/N-CON associationはまだ計算しない。**

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

## Stage 6 — Study 1 cross-study bridge

### Completed preparation

1. Study 1 final report / vocabulary / formal export index re-audited.
2. E-018/E-019/E-020 fixed archive inventory completed.
3. All three fixed archive SHA-256 values matched and unsafe member count was zero.
4. Candidate/game schema audit completed for the bridge scope.
5. Six condition schemas contain `gameId`, `candidatePly`, `phaseAtCandidate`, `classification`, regime fields, archived moves, observations and state hashes.
6. Deterministic board replay is feasible from archived moves.
7. No scientific relation value was reported by inventory/schema audit.

Schema audit SHA-256:

```text
910990b049abf31e42deccac2756dc68a721e565127f842209abf72b4a62e90c
```

### Frozen Stage 6 scientific protocol

Machine spec:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_SPEC.json
protocolHash = 4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc
```

Narrative protocol:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_PROTOCOL.md
```

Protocol was fixed **before** MTAJI-M1/M2 or N-ACT/N-CON association values were calculated.

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

Raw candidate rows are provenance only; repeated raw rows are not treated as independent structural examples.

### Phase-specific bridge

First report phase overlap.

For actual `mtaji` candidate states only:

```text
apply frozen confirmed MTAJI-M1/MTAJI-M2 classifier
no refit
```

For actual `namua` candidate states only:

```text
apply frozen discovery N-ACT/N-CON transform
no scaler refit
explicitly exploratory
```

Do not assign Mtaji types to Namua.

`STYLE-C1..C4` are excluded from the Stage 6 primary state bridge because the exact four-dimensional playing-style geometry was formally `not-confirmed` in Stage 5.

No confirmatory p-value, causal mediation claim, universal Bao claim, or general depth interaction claim is authorized.

## Replay integrity stage — next

Preparation tool:

```text
tools/experiments/prepare-position-typology-stage6-cross-study-bridge.py
```

Replay tool:

```text
tools/experiments/replay-position-typology-stage6-candidate-states.js
```

Runbook:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_REPLAY_RUNBOOK.md
```

Checkpoint:

```text
doc/position-typology/checkpoints/2026-08-10-stage6-cross-study-protocol-freeze-and-replay-start.md
```

Replay requirements:

- fixed archive SHA-256 must match again;
- candidate-bearing games only are extracted to a new local working directory;
- every traversed archived observation `stateHash` must match replay;
- move before/after hashes must match where present;
- CSV phase, archived observation phase and replayed position phase must agree;
- no new game generation;
- no formal analysis rerun;
- no archive modification;
- no scientific association calculation yet.

## Next local action

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version
node --version

python -m py_compile \
  tools/experiments/prepare-position-typology-stage6-cross-study-bridge.py

node --check \
  tools/experiments/replay-position-typology-stage6-candidate-states.js

python tools/experiments/prepare-position-typology-stage6-cross-study-bridge.py
node tools/experiments/replay-position-typology-stage6-candidate-states.js
```

Keep this local dataset:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/replay/replayed-candidate-states.json
```

Share only:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/replay/replay-audit.json
```

Only after replay integrity is accepted will Stage 6 association analysis be run.
