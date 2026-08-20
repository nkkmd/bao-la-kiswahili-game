# Position Evaluation / Win-Rate Calibration Study 1 — Final Closure

Date: 2026-08-20  
Status: **CLOSED / FORMAL INCONCLUSIVE / REPOSITORY CLOSURE MATERIALIZED**

## Canonical formal result

```text
studyId = PEC-STUDY1
stageId = PEC-S2-FORMAL-2026-08-20-v1
Stage 2 spec SHA-256 = 92473695bc81832358be8ceb3e9b0cf41c3c70a5638402319863f70ec0f66d38
canonical stage2-formal-result SHA-256 = 94602023bdf8e9086703cbff44a68a9a070ada85c0bdbb2aaad104ffbd0b5405
formalDecision = INCONCLUSIVE
```

## Why the formal result is inconclusive

Stage 2 generation and independent verification were technically clean:

```text
games = 2048
seeds = 22300001..22302048
game replay mismatches = 0
measurement mismatches = 0
measurement hash match = true
final Stage 1 trajectory/opening/rule-state overlap = 0 / 0 / 0
```

Three preregistered estimability gates failed after the strict Stage 1 identity firewall and no-replacement selection:

```text
unique historical trajectories after firewall = 1383 < 1600
selected unique rule states = 1290 < 1500
Mtaji selected states = 627 < 650
```

The frozen formal decision tree therefore stops at `INCONCLUSIVE`. Bootstrap and primary success criteria are not decision-eligible.

## Descriptive-only observations

```text
pooled frozen-model Brier = 0.15550141283724248
Namua Brier = 0.22678074548187638
Mtaji Brier = 0.08012948693071474
observed paired Brier skill = +0.09555981447607745
exact unclipped log-loss boundary contradictions = 7
```

These observations do not rescue or alter the formal decision.

## Final repository records

Created/finalized:

```text
STUDY_1_OVERVIEW.md
STUDY_1_FINAL_REPORT.md
STAGE_2_FORMAL_RESULT.md
REPRODUCIBILITY_INDEX.md
CURRENT_STATUS.md
DECISION_REGISTER.md
EXPERIMENT_INDEX.md
README.md
results/STAGE_2_FORMAL_RESULT_SUMMARY.json
```

Central cross-study navigation updated:

```text
/README.md
doc/RESEARCH_INDEX.md
doc/FUTURE_RESEARCH_AGENDA.md
```

`FUTURE_RESEARCH_AGENDA.md` now records calibration Study 1 as completed/formal inconclusive and promotes **Bad Move / Misconception Patterns** as the next recommended Stage-2 research theme, with an explicit firewall against treating the exploratory isotonic mapping as a formally validated win-probability instrument.

## Immutable no-rescue boundary

The closed Study 1 is not changed by:

- additional Stage 2 games;
- seed extension;
- overlap replacement;
- estimability-threshold relaxation;
- Stage 1 mapping refit;
- descriptive Brier performance;
- alternative post-hoc primary endpoints.

A future formal calibration attempt must be a new prospective independent study with fresh data.

## Main integration boundary

This checkpoint closes the research branch scientifically and documents repository-level closure. It does **not** by itself authorize or perform a merge into `main`.
