# SSGTC-STUDY1 — Current Status

Updated: 2026-08-25

```text
studyStatus = IN-PROGRESS
currentStage = STAGE-0-TECHNICAL-VALIDATION-PREP
scientificInference = NOT-AUTHORIZED
formalDecision = NOT-YET-AVAILABLE
representation = RAW-ONLY
symmetryReduction = PROHIBITED
canonicalization = NOT-AUTHORIZED
stage1ScientificInference = NOT-AUTHORIZED
stage2 = NOT-AUTHORIZED
```

## Baseline

```text
remoteMainAtStudyStart = 9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901
studyBranch = research/state-space-game-tree-complexity
studyId = SSGTC-STUDY1
```

## Frozen upstream boundaries

Restricted Endgame / Winning Regions Study 1 remains `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` for its frozen 8-state / 7-edge domain only.

Symmetry / Isomorphic Positions Study 1 remains `NON-ESTIMABLE`, with 0 validated / 0 rejected / 5 non-estimable; corrected v2 remains not authorized and not executed.

ORISC-STUDY1 remains completed with Axis A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED` and Axis B `NOT-AUTHORIZED-NOT-EXECUTED`. Its validated symmetry transformation set remains empty.

## Technical audit status

Current `public/engine.js` initializes `pending:[0,0]`, but compatibility paths in engine cloning / terminal handling can synthesize a missing `pending` as `[0,0]`. Therefore this study will place a study-owned hard raw-state validator before engine transitions and will reject missing `pending` before any engine fallback can act. Post-transition validation is also mandatory.

ORISC production and independent representation implementations already demonstrate separate raw serializers that reject missing `pending`; SSGTC will preserve that separation while creating study-owned tooling and fresh artifacts.

## Current authorization

Authorized now:

- prospective documentation and firewall freeze;
- technical implementation audit;
- Stage 0 technical fixtures and exact shallow cross-check after the Stage 0 protocol is frozen;
- no scientific interpretation of Stage 0 counts.

Not authorized now:

- Stage 1 scientific inference;
- Stage 2 execution;
- any symmetry reduction;
- any global Bao state-space count;
- any estimator not separately preregistered;
- any rescue or reinterpretation of upstream studies;
- merge to `main`.