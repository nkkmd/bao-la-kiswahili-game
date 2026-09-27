# G4-08 — main統合前最終整合性監査

Date: 2026-09-27  
Agenda: `Research Generation 4 / G4-08`  
Study: `BRSGT-STUDY1`  
Decision: **`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`**

## 1. Audit anchors

```text
repository = nkkmd/bao-la-kiswahili-game
research branch = research/g4-08-rule-semantic-geometry-transition
reviewed main HEAD = 2023860419d13b6f294b0600943de8fb4e50b1bb
audited research HEAD = 62b8961a416fa8140de2163d682a92b1fafea848
compare status = ahead
ahead by = 125
behind by = 0
merge base = 2023860419d13b6f294b0600943de8fb4e50b1bb
main integration = NOT EXECUTED
```

Remote `main` was re-read immediately before this audit and remained at the reviewed baseline.

## 2. Scientific canonical result

Canonical Stage 2 record:

`doc/rule-semantic-geometry-transition/results/stage-2/STAGE_2_CANONICAL_RECORD.json`

```text
record blob SHA = 97d5e2968faa25d6ecca5df5b6b4905ef536e34b
stage disposition = STAGE2-FORMAL-COMPLETE
scientific decision = ALL-FORMAL-SLOTS-NON-ESTIMABLE
interpretation class = NO-DIRECTIONAL-SCIENTIFIC-CONCLUSION
run = 36314208922 / attempt 1 / success
job = 108605721107
execution HEAD = 692d2d718ab55348e7fb4f8190476524b0a5bc95
audited source SHA = d2e22fa9b4ca8286480beda2a89b5e287bcdad9c
artifact ID = 10929684128
artifact ZIP SHA-256 = bbbe1e2206c9f439168829581d1bce1ef03dddaec1fe0914b8888a63767bcb1b
fresh Stage 2 reads = 1024 / 1024
fresh block = 40823001..40824024
production / independent exact agreement = true
accepted source trajectories = 0
measured event units = 0
formal family = 24
NON-ESTIMABLE = 24
```

Frozen freshness firewall source rejection:

```text
UPSTREAM-REACHABLE-RAW-ROOT = 1011
UPSTREAM-TRAJECTORY = 6
UPSTREAM-OPENING-PREFIX = 7
total rejected = 1024
```

The formal result is therefore 24 / 24 `NON-ESTIMABLE`. This is not a no-effect or negative scientific result. No directional rule-semantic geometry conclusion is authorized.

## 3. Closure consistency

Closure record:

`doc/research-program-decisions/2026-09-27-g4-08-rule-semantic-geometry-transition-study1-closure.md`

```text
closure blob SHA = 5f2cdd8d06e25ce3322079da727a368e40ec5666
G4-08 = CLOSED ON RESEARCH BRANCH
Stage 2 = FORMAL-COMPLETE
formal counts = 24 NON-ESTIMABLE
G4-10 depth-11 access = 0
public AI change = false
main integration = false
```

The canonical record, Stage 2 checkpoint, closure record, study current status, RG4 current status, research index, and future research agenda now use the same formal disposition and interpretation boundary.

## 4. Current-facing document audit

The following current-facing documents are synchronized with G4-08 formal closure:

- `doc/rule-semantic-geometry-transition/README.md`
- `doc/rule-semantic-geometry-transition/CURRENT_STATUS.md`
- `doc/research-generation-4/CURRENT_STATUS.md`
- `doc/research-generation-4/README.md`
- `doc/research-generation-4/RESUME_HERE.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`

During this final audit, two stale current-facing documents were corrected:

- `doc/RESEARCH_INDEX.md` previously described G4-08 as not authorized and lacked the G4-08 formal closure summary.
- `doc/FUTURE_RESEARCH_AGENDA.md` previously described G4-08 as a future unauthorized candidate together with G4-09.

They now record G4-08 as closed on the research branch with 24 / 24 `NON-ESTIMABLE`, while G4-09 remains not authorized.

## 5. Prospective Program Plan audit

`doc/research-generation-4/PROGRAM_PLAN.md` remains the prospective frozen program contract.

```text
main PROGRAM_PLAN blob SHA = a1b09a045e0c20966d86adb352b6ec5a29af9eb8
research PROGRAM_PLAN blob SHA = a1b09a045e0c20966d86adb352b6ec5a29af9eb8
mutation during G4-08 = none
```

The plan was not rewritten after observing G4-08 outcomes.

## 6. Branch-scope audit

The final compare from reviewed `main` to audited research HEAD contains G4-08 research documentation, research experiment code, and research GitHub Actions workflows, plus synchronized research index/status documents.

Explicit checks:

```text
public/ changed files = 0
public AI production code changes = 0
deployment changes = 0
G4-10 depth-11 access = 0
G3-11 depth-10 rerun = false
Stage 2 same-evidence rerun = false
seed extension = false
replacement population = false
post-outcome firewall rescue = false
```

The research workflows and tools remain research infrastructure; their presence in the branch does not alter the deployed public game or AI.

## 7. GitHub status / integration topology

For audited research HEAD `62b8961a416fa8140de2163d682a92b1fafea848`:

```text
commit status contexts = none
pull-request workflow runs associated with commit = none
branch protection required status checks = off
```

This is not a failing CI state; no status check was attached to the documentation-sync commit. The scientific Stage 2 execution provenance and production / independent exact agreement are recorded in the canonical result above.

The branch is a direct descendant of the current `main` baseline:

```text
behind main = 0
merge base = current main HEAD
```

## 8. Interpretation audit

The current-facing documents consistently preserve the following limits:

- 24 / 24 `NON-ESTIMABLE` does not mean no effect, negative evidence, or counterexample;
- the result does not establish capture / nyumba / reserve decrement / Namua→Mtaji geometry direction;
- the post-execution common-ply-0-root diagnostic explains freshness exhaustion only and does not reclassify the result;
- same-Study rescue by excluding ply 0, altering firewall grammar, extending seeds, or replacing the population is prohibited;
- causal effect, whole-Bao law, game-theoretic consequence, public-AI strength, and human difficulty are not established;
- G4-09 is not authorized by G4-08 closure;
- G4-10 remains protected and unopened;
- public AI remains unchanged.

## 9. Main-integration readiness

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

## 10. Decision

**`PASS / READY-FOR-MAIN-INTEGRATION-REVIEW`**

This audit does **not** itself authorize or execute the merge to `main`.

Before any actual integration, re-read remote `main` once more. If `main` has moved, re-run the compare and resolve the drift before integration. If it has not moved and explicit main-integration approval is given, the research branch is eligible for integration without additional scientific execution.

G4-09 and G4-10 remain not authorized by this decision.
