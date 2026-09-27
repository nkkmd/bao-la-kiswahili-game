# G4-07 — 関連文書最終整合性チェック

Date: 2026-09-27  
Agenda: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
Decision: **`PASS / NO REMAINING DOCUMENTATION INCONSISTENCY FOUND`**

## 1. Check anchors

```text
repository = nkkmd/bao-la-kiswahili-game
research branch = research/g4-07-multiscale-geometry-memory-return
reviewed main HEAD = 8edf791aa789d77ba27d3d7704ab02acd6e35eac
audited research HEAD = ad723b5f68ef0260aaf543ec1021da7174263b0d
compare status = ahead
ahead by = 71
behind by = 0
merge base = 8edf791aa789d77ba27d3d7704ab02acd6e35eac
main integration = NOT EXECUTED
```

Remote `main` was re-read immediately before the final compare and remained unchanged.

## 2. Documents checked

Current-facing and canonical G4-07 documents:

- `doc/multiscale-local-geometry-memory-return/CURRENT_STATUS.md`
- `doc/multiscale-local-geometry-memory-return/FINAL_REPORT.md`
- `doc/multiscale-local-geometry-memory-return/results/stage-2/STAGE_2_CANONICAL_RECORD.json`
- `doc/multiscale-local-geometry-memory-return/checkpoints/2026-09-27-stage-2-formal-complete.md`
- `doc/research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/RESUME_HERE.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- root `README.md` research entry points
- frozen `doc/research-generation-4/PROGRAM_PLAN.md`

Historical authorization / pre-execution records were treated as historical records and were not rewritten merely because later stages completed.

## 3. Canonical G4-07 values reverified

```text
Stage 2 run = 36278926636 / attempt 1 / success
artifact ID = 10919769185
artifact ZIP SHA-256 = 4d8370ccad1be7fa4052a4293e6b64c4e1b77f7c11c94c1f4dbabead694394f2
fresh Stage 2 scientific seed reads = 363
formal measured trajectories = 64 / P1 32 / P2 32
formal family = 16
REVERSAL-CONFIRMED = 6
PERSISTENCE-CONFIRMED = 0
NOT-CONFIRMED = 10
NON-ESTIMABLE = 0
all six lag-1 slots = REVERSAL-CONFIRMED
confirmedContiguousPersistenceLagMax = NONE for all six axes
return endpoint = DESCRIPTIVE ONLY
G4-10 depth-11 access = 0
public AI change = false
main integration = false
```

These values agree across the canonical record, final report, closure decision, individual current status, RG4 current status, research index, and future research agenda.

## 4. Update omission found and corrected

The final check found one current-facing omission:

- `doc/RESEARCH_INDEX.md` had the correct G4-07 scientific closure and `MAIN NOT INTEGRATED`, but had not yet been advanced to the later `PRE-MAIN-AUDIT-PASS / READY-FOR-MAIN-INTEGRATION-REVIEW` state.

The index was updated to match the other current-facing authorities and now includes the pre-main audit checkpoint in the G4-07 references.

After that edit, existing G4-04, G4-05, G4-06 and G4-07 canonical run IDs and identifiers were re-read. The canonical values remain intact, including:

```text
G4-04 Stage 2 run = 36095831961
G4-05 Stage 2 run = 36120286922
G4-06 Stage 1 run = 36214800357
G4-07 Stage 2 run = 36278926636
```

## 5. Branch / protection check

Final compare from current `main` to audited research HEAD confirms:

```text
research branch behind main = 0
merge base equals current main = true
public/ changed files = 0
public AI production code changes = 0
deployment changes = 0
G4-10 depth-11 access = 0
G3-11 depth-10 rerun = false
G4-07 same-evidence rerun = false
G4-07 seed extension = false
G4-07 replacement population = false
PROGRAM_PLAN mutation = false
```

Research workflows and experiment tools remain research-only infrastructure and do not alter the deployed public game.

## 6. Interpretation boundaries checked

The current-facing documents consistently preserve these limits:

- lag-1 reversal confirmation is not a universal oscillation or mean-reversion law;
- it is not a causal rule-event mechanism;
- it is not a physical half-life or decay constant;
- lag 8 being outside the formal family is not negative scientific evidence;
- return remains descriptive-only;
- the result does not establish game-theoretic value, best-move correctness, AI strength, or human difficulty;
- G4-08 / G4-09 / G4-10 are not automatically authorized;
- research results do not automatically change public AI.

## 7. Final decision

**`PASS / NO REMAINING DOCUMENTATION INCONSISTENCY FOUND`**

The G4-07 branch is documentation-consistent and remains eligible for a separate main-integration review. This checkpoint does not itself authorize or execute integration.

Immediately before any actual main integration, remote `main` must be re-read once more and the branch must still be `behind = 0` with the same protected boundaries.