# G4-07 — main統合前最終整合性監査

Date: 2026-09-27  
Agenda: `Research Generation 4 / G4-07`  
Study: `MLGMR-STUDY1`  
Decision: **`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`**

## 1. Audit anchors

```text
repository = nkkmd/bao-la-kiswahili-game
research branch = research/g4-07-multiscale-geometry-memory-return
reviewed main HEAD = 8edf791aa789d77ba27d3d7704ab02acd6e35eac
audited research HEAD = 4bd435862075fa4308d08375175d6f59d39cc6d0
compare status = ahead
ahead by = 68
behind by = 0
merge base = 8edf791aa789d77ba27d3d7704ab02acd6e35eac
main integration = NOT EXECUTED
```

Remote `main` was re-read immediately before this audit and remained at the reviewed baseline.

## 2. Scientific canonical result

Canonical Stage 2 record:

`doc/multiscale-local-geometry-memory-return/results/stage-2/STAGE_2_CANONICAL_RECORD.json`

```text
record blob SHA = 0cdfced7d3c91b1e6eadf21d916ed5a3b25c0e67
run = 36278926636 / attempt 1 / success
head = f73e2ade42b3379b9eaf2007292a057cfeaf88f0
artifact ID = 10919769185
artifact ZIP SHA-256 = 4d8370ccad1be7fa4052a4293e6b64c4e1b77f7c11c94c1f4dbabead694394f2
STAGE_2_RESULT.json SHA-256 = 970083e5f2a5f06e05d52c271e7b4b2bda3e8eb7889ba699b96c9cc3efc98726
candidate manifest SHA-256 = 1c4b8479a04169a50e89e4c33b79fc4a95930c2d61c52f1d6ddb51cf958b28af
formal measurements SHA-256 = be67b4e7d78291e008eaf8b40d94b08cf5924a703ddb54df183824f237751ab8
formal inference SHA-256 = 365e7ae66571d6e6621a81ea6755185c7e581d13a38f81491f428b3a7f03b429
fresh Stage 2 reads = 363
formal measured trajectories = 64 / P1 32 / P2 32
formal family = 16
REVERSAL-CONFIRMED = 6
PERSISTENCE-CONFIRMED = 0
NOT-CONFIRMED = 10
NON-ESTIMABLE = 0
confirmedContiguousPersistenceLagMax = NONE for all six axes
return endpoint = DESCRIPTIVE ONLY
```

The six `REVERSAL-CONFIRMED` decisions are exactly the six lag-1 slots. All fixed-family lag-2 slots and all four fixed-family lag-4 slots are `NOT-CONFIRMED`. Lag 8 and A4/A5 lag 4 are outside the formal family and are not assigned Stage 2 scientific decisions.

## 3. Closure consistency

Closure record:

`doc/research-program-decisions/2026-09-27-g4-07-multiscale-local-geometry-memory-return-study1-closure.md`

```text
closure blob SHA = c3aed95f4265d7849ba365c917f4d616981c9528
G4-07 = COMPLETE ON RESEARCH BRANCH
Stage 2 = FORMAL-COMPLETE
formal counts = 6 reversal / 0 persistence / 10 not-confirmed / 0 non-estimable
G4-10 depth-11 access = 0
public AI change = false
main integration = false
```

The canonical record, Stage 2 checkpoint, final report, closure record, individual current status, RG4 current status, research index, and future research agenda use the same formal disposition and the same interpretation boundary.

## 4. Current-facing document audit

The following current-facing documents were synchronized after formal closure:

- `doc/multiscale-local-geometry-memory-return/CURRENT_STATUS.md`
- `doc/multiscale-local-geometry-memory-return/FINAL_REPORT.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/RESUME_HERE.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`

Historical G4-06 closure documents that state G4-07 was the next authorization candidate were intentionally left unchanged because they accurately describe the state at the time of G4-06 closure. They are not current-facing status authorities.

## 5. Prospective Program Plan audit

`doc/research-generation-4/PROGRAM_PLAN.md` remains the prospective frozen program contract.

```text
PROGRAM_PLAN blob SHA = a1b09a045e0c20966d86adb352b6ec5a29af9eb8
mutation during G4-07 = none
```

The plan was not rewritten after observing G4-07 outcomes.

## 6. Branch-scope audit

The final compare from reviewed `main` to audited research HEAD contains G4-07 research documentation, research experiment code, and research GitHub Actions workflows, plus synchronized research index/status documents.

Explicit checks:

```text
public/ changed files = 0
public AI production code changes = 0
deployment changes = 0
G4-10 depth-11 access = 0
G3-11 depth-10 rerun = false
Stage 1 same-evidence rerun = false
Stage 2 same-evidence rerun = false
seed extension = false
replacement population = false
post-outcome formal-family rescue = false
```

The research workflows and tools remain research infrastructure; their presence in the branch does not alter the deployed public game or AI.

## 7. Interpretation audit

The current-facing documents consistently preserve the following limits:

- lag-1 reversal confirmation is not a universal oscillation law;
- it is not a causal rule-event mechanism;
- it is not a physical half-life or decay constant;
- lag-8 absence from the formal family is not negative scientific evidence;
- the return endpoint remains descriptive-only;
- the result does not establish game-theoretic value, best-move correctness, public-AI strength, or human difficulty;
- G4-08 remains the separate rule-semantic transition agenda;
- G4-09 remains the separate search-reliability agenda;
- G4-10 remains protected and unopened.

## 8. Main-integration readiness

All pre-main audit gates pass:

| Gate | Result |
| --- | --- |
| Canonical Stage 2 provenance | PASS |
| Formal counts / labels consistency | PASS |
| Closure consistency | PASS |
| Current-facing documentation sync | PASS |
| Prospective Program Plan unchanged | PASS |
| Research branch behind main | `0 / PASS` |
| Merge base equals current main | PASS |
| `public/` changes | `0 / PASS` |
| Public AI production changes | `0 / PASS` |
| G4-10 depth-11 access | `0 / PASS` |
| Same-evidence rerun / rescue | `none / PASS` |

## 9. Decision

**`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`**

This audit does **not** itself authorize or execute the merge to `main`.

Before any actual integration, re-read remote `main` once more. If `main` has moved, re-run the compare and resolve the drift before integration. If it has not moved and explicit main-integration approval is given, the research branch is eligible for integration without any additional scientific execution.

G4-08, G4-09, and G4-10 remain not authorized by this decision.
