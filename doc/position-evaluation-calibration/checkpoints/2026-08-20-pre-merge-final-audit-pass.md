# Position Evaluation / Win-Rate Calibration Study 1 — Pre-merge Final Audit PASS

Date: 2026-08-20

Status: **PASS / READY FOR FAST-FORWARD INTEGRATION**

## Scope

This checkpoint records the final repository audit performed after Study 1 scientific closure and before integration into `main`.

## Canonical result identity

The returned local Stage 2 formal result has:

```text
studyId = PEC-STUDY1
stageId = PEC-S2-FORMAL-2026-08-20-v1
formalDecision = INCONCLUSIVE
canonical local result SHA-256 = 94602023bdf8e9086703cbff44a68a9a070ada85c0bdbb2aaad104ffbd0b5405
```

The repository machine-readable summary records the same result SHA, stage/spec identity, failed estimability gates, verification PASS state, and no-rescue boundary.

## Current-state consistency

The following current-state records were checked and agree on Study 1 closure and the formal `INCONCLUSIVE` decision:

```text
doc/position-evaluation-calibration/README.md
doc/position-evaluation-calibration/CURRENT_STATUS.md
doc/position-evaluation-calibration/EXPERIMENT_INDEX.md
doc/position-evaluation-calibration/DECISION_REGISTER.md
doc/position-evaluation-calibration/STUDY_1_OVERVIEW.md
doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md
doc/position-evaluation-calibration/STAGE_2_FORMAL_RESULT.md
doc/position-evaluation-calibration/REPRODUCIBILITY_INDEX.md
```

No current-state document relabels the result as `CONFIRMED` or `NOT-CONFIRMED`.

## Formal-decision boundary

The final decision remains driven by the frozen estimability gate tree:

```text
unique historical trajectories after firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
formalDecision = INCONCLUSIVE
bootstrap = null
criteria = null
```

Descriptive Brier values are retained as descriptive only and do not rescue the formal decision.

## Reference / link audit

The study directory and its subdirectories were checked on the research branch. The final-report, overview, formal-result, reproducibility, current-status, decision-register, experiment-index, preregistration, authorization, readiness-audit and result-summary targets referenced from the study README and central research documents exist.

Central integration points were checked:

```text
README.md
doc/RESEARCH_INDEX.md
doc/FUTURE_RESEARCH_AGENDA.md
```

They reference Position Evaluation / Win-Rate Calibration Study 1 and preserve the final `INCONCLUSIVE` boundary. `FUTURE_RESEARCH_AGENDA.md` records Bad-Move / Misconception Patterns as the next recommended Stage 2 research topic while explicitly forbidding treatment of the exploratory isotonic mapping as a formally validated win probability.

## Freeze-time historical wording

Several prospective/frozen records intentionally retain status language such as `PENDING`, `NOT AUTHORIZED`, or `OPEN` from the point in the chronology when they were frozen or used:

```text
STAGE_0_TECHNICAL_PROTOCOL.md
STAGE_1_EXPLORATORY_PROTOCOL.md
STAGE_2_FORMAL_PROTOCOL.md
HYPOTHESES.md
STATISTICAL_ANALYSIS_PLAN.md
SEED_AUDIT.md
STAGE_1_RUNBOOK.md
STAGE_2_RUNBOOK.md
```

These are provenance records, not current-state records. Their historical wording was not rewritten after outcome inspection. The study README now explicitly documents this distinction and directs readers to `CURRENT_STATUS.md`, `STUDY_1_FINAL_REPORT.md`, and `STAGE_2_FORMAL_RESULT.md` for current state.

## Branch / diff audit

Before this checkpoint, the research branch was a strict fast-forward descendant of baseline `main`:

```text
baseline main = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
behind main = 0
```

The branch diff is limited to the Position Evaluation / Win-Rate Calibration study implementation/research records plus the intended central documentation updates:

```text
README.md
doc/RESEARCH_INDEX.md
doc/FUTURE_RESEARCH_AGENDA.md
```

No prior closed-study formal decision is changed.

## Execution-status note

GitHub reports no commit-status checks or pull-request workflow runs for the final research-branch commit. The assistant-side container could not clone the public repository because DNS resolution for `github.com` is unavailable in that environment, so no new assistant-side test execution is claimed here.

Scientific execution evidence remains the user-returned artifacts and independent Stage 1/Stage 2 verifiers already archived and audited. Stage 2 verification passed with 2048/2048 games replayed, zero replay mismatches, zero measurement mismatches, measurement-hash match, and zero final cross-stage identity overlap.

## Decision

```text
final documentation audit = PASS
reference audit = PASS
current-state consistency = PASS
formal no-rescue boundary = PASS
branch fast-forward eligibility = PASS
READY FOR MAIN INTEGRATION = true
```
