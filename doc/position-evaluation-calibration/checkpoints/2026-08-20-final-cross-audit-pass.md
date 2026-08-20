# Position Evaluation / Win-Rate Calibration Study 1 — Final Cross-Audit PASS

Date: 2026-08-20  
Status: **PASS / READY FOR OPTIONAL MAIN INTEGRATION**

## Canonical scientific state

```text
Study 1 = CLOSED
Stage 1 = COMPLETE / exploratory phase-stratified isotonic selected
Stage 2 = COMPLETE / independent verification PASS / estimability FAIL
OVERALL FORMAL DECISION = INCONCLUSIVE
canonical Stage 2 result SHA-256 = 94602023bdf8e9086703cbff44a68a9a070ada85c0bdbb2aaad104ffbd0b5405
```

No document in the current-state closure set promotes descriptive Stage 2 performance into formal confirmation.

## Cross-audited study documents

Confirmed mutually consistent:

```text
README.md
CURRENT_STATUS.md
DECISION_REGISTER.md
EXPERIMENT_INDEX.md
RESEARCH_LOG.md
STUDY_1_OVERVIEW.md
STUDY_1_FINAL_REPORT.md
STAGE_2_FORMAL_RESULT.md
REPRODUCIBILITY_INDEX.md
results/STAGE_2_READINESS_AUDIT.json
results/STAGE_2_FORMAL_RESULT_SUMMARY.json
```

Historical runbooks, preregistration files, authorization artifacts and dated checkpoints intentionally retain the state that existed when each record was frozen; those historical status strings are not current-state contradictions.

## Central repository documents

### Root README

Updated with a direct entry to:

```text
doc/position-evaluation-calibration/STUDY_1_OVERVIEW.md
```

and the correct formal label `inconclusive`.

### `doc/RESEARCH_INDEX.md`

Added Position Evaluation / Win-Rate Calibration Study 1 as the ninth indexed research area, including:

- Stage 1 selected-family result;
- Stage 2 verification PASS;
- the three failed estimability gates;
- final `INCONCLUSIVE` label;
- links to Overview, Final Report, Formal Result and Reproducibility Index;
- no-rescue and downstream-use boundaries.

### `doc/FUTURE_RESEARCH_AGENDA.md`

Advanced to version `1.7.0` / 2026-08-20 while retaining the detailed prior research agenda. It now records:

```text
Position Evaluation / Win-Rate Calibration Study 1 = completed / INCONCLUSIVE
Bad Move / Misconception Patterns = next recommended Stage-2 research
```

The agenda explicitly forbids treating the Stage 1 isotonic mapping as a formally validated win probability and recommends fresh continuation outcomes / exact-search regret / another prospectively frozen endpoint for future bad-move severity.

## Branch / main boundary

At the final compare before this checkpoint:

```text
base main = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
branch status = ahead
behind = 0
changes outside the new calibration study are limited to:
  README.md
  doc/RESEARCH_INDEX.md
  doc/FUTURE_RESEARCH_AGENDA.md
```

No merge to `main` is performed by this checkpoint.

## Final no-rescue boundary

The closed result is not changed by additional Stage 2 data, seed extension, overlap replacement, gate relaxation, map refit, alternate post-hoc endpoints or descriptive Brier performance.

Any future calibration confirmation attempt is a new prospective independent study with fresh data.
