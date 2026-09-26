# G4-07 / MLGMR-STUDY1 — Stage 1 development checkpoint

Date: 2026-09-27  
Agenda: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
Stage: `MLGMR-S1-DEVELOPMENT-2026-09-26-v1`  
Final disposition: **`STAGE1-DEVELOPMENT-COMPLETE`**

## 1. Purpose

Stage 1 is a fresh scientific **development / support-only** stage. Its purpose is to determine, using the prospectively frozen support gate and without formal inference, which of the 24 preregistered axis×lag slots have enough comparable-nonzero trajectory support to be eligible for a later formal Stage 2 holdout.

Stage 1 does **not** confirm persistence, reversal, memory length, or return. Effect direction is not used for promotion, and no Stage 1 p-value or formal confirmation label is permitted.

## 2. Canonical execution

```text
run = 36247459779 / attempt 1
head = cf9244d760fac807c604fef1ae9639103bfa4b31
conclusion = success
binding = MLGMR-STUDY1-STAGE1-BINDING-2026-09-26-V1
frozen source commit = acae88384e74d9d8b7d2661adcee69d1fe1f3175
artifact ID = 10908816662
artifact name = mlgmr-stage1-development-result
artifact ZIP SHA-256 = 65081316d7f3dc0f59b7da5a527af65c052ea33b0ab7e8e8b07d06d764f27469
STAGE_1_RESULT.json SHA-256 = 2a712105917da91c954689f42665fc248fdf16e22721e13726e7e0cfd356d196
STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json SHA-256 = bcc53e7f7a561552e0a67ac0225b0da29da6d7904834b6b8130531cc48b6e13b
```

All workflow gates passed: syntax check, frozen binding verification, retrieval of the frozen G4-01/G4-04 identity-only artifacts, upstream artifact presence checks, the one-shot fresh Stage 1 runner, and artifact upload.

## 3. Fresh-access and firewall accounting

```text
upstream firewall digest = c601463cfa56acbe3b80fd02345f5ef2e7f3afc4dd72cda37503fbc6e7a156d7
fresh scientific seed reads = 96
first seed read = 40713001
last seed read = 40713145
Stage 2 seed reads = 0
G4-10 depth-11 access = 0
public AI change = false
main integration = false
```

The identity-only firewall was fully materialized and verified **before** the first fresh Stage 1 seed read. The consumed-identity record contains 96 rows and becomes a mandatory exclusion source for Stage 2.

The no-rescue boundary has been crossed. Unread Stage 1 reservation slots must not be used as a replacement population, extension, or same-evidence rerun.

## 4. Candidate and measurement accounting

```text
P1 fully eligible candidate count = 16
P2 fully eligible candidate count = 16
P1 rejection: TERMINAL-BEFORE-72 = 57
P2 rejection: TERMINAL-BEFORE-72 = 7
measured trajectories = 16
measured P1 = 8
measured P2 = 8
production / independent exact agreement = true
elapsedMs = 2051988
rssBytes = 387956736
stage elapsed ceiling = 10800000
stage RSS ceiling = 4294967296
```

All measured trajectories satisfy the frozen Stage 1 contract and production/independent exact agreement requirement.

## 5. Support-only promotion result

The frozen support gate promoted **16 of 24** candidate slots for possible Stage 2 formal holdout.

Supported slots:

```text
CRCLGR-A1-ROOT-LEGAL-WIDTH-LAG1
CRCLGR-A1-ROOT-LEGAL-WIDTH-LAG2
CRCLGR-A1-ROOT-LEGAL-WIDTH-LAG4
CRCLGR-A2-CUMULATIVE-TREE-OCCURRENCE-LAG1
CRCLGR-A2-CUMULATIVE-TREE-OCCURRENCE-LAG2
CRCLGR-A2-CUMULATIVE-TREE-OCCURRENCE-LAG4
CRCLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES-LAG1
CRCLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES-LAG2
CRCLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES-LAG4
CRCLGR-A4-CUMULATIVE-TREE-RAW-RATIO-LAG1
CRCLGR-A4-CUMULATIVE-TREE-RAW-RATIO-LAG2
CRCLGR-A5-DUPLICATE-TRANSITION-FRACTION-LAG1
CRCLGR-A5-DUPLICATE-TRANSITION-FRACTION-LAG2
CRCLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION-LAG1
CRCLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION-LAG2
CRCLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION-LAG4
```

Summary by lag:

```text
lag 1: 6 / 6 axes supported
lag 2: 6 / 6 axes supported
lag 4: 4 / 6 axes supported
lag 8: 0 / 6 axes supported
```

At lag 4, A1, A2, A3, and A6 are supported; A4 and A5 are not supported.

This is a **support sufficiency** statement only. It is not a claim that the supported slots exhibit positive persistence, negative persistence/reversal, or any statistically confirmed effect.

## 6. Canonical record and raw artifact

Repository canonical summary/provenance record:

`results/stage-1/STAGE_1_CANONICAL_RECORD.json`

The byte-exact raw outputs remain the GitHub Actions artifact `10908816662`:

- `STAGE_1_RESULT.json` — SHA-256 `2a712105917da91c954689f42665fc248fdf16e22721e13726e7e0cfd356d196`
- `STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json` — SHA-256 `bcc53e7f7a561552e0a67ac0225b0da29da6d7904834b6b8130531cc48b6e13b`

The repository canonical record preserves the prospectively relevant support-only classification, execution provenance, firewall digest, resource accounting, and raw-file digests without treating Stage 1 as a formal scientific decision.

## 7. Next gate

Stage 2 remains **NOT AUTHORIZED**.

The next allowed step is a prospective post-Stage-1 / pre-Stage-2 authorization review. That review must:

- use only the frozen Stage 1 support gate to define the formal family;
- carry forward exactly the 16 supported slot IDs above;
- add all 96 Stage 1 consumed identities to the Stage 2 firewall;
- preserve the frozen Stage 2 seed reservation `40723001..40724024`;
- preserve the frozen exact two-sided sign test and Holm-Bonferroni family alpha `1/20`;
- preserve nonzero trajectory balance as the formal unit;
- prohibit rescue, seed extension, replacement populations, and favorable subgroup selection;
- keep G4-10 depth 11, public-AI change, and main integration unauthorized until separately decided.
