# Stage 1 Runbook Amendment 1 — Deterministic Clock Gate

Date: 2026-08-11  
Status: **applies before Stage 1 exploratory candidate inspection**

This amendment supplements `STAGE_1_RUNBOOK.md` and implements `STAGE_1_PROTOCOL_AMENDMENT_1.md`.

## 1. Additional static check

Before generation, also run:

```bash
node --check tools/experiments/audit-namua-mtaji-stage1-clock.js
```

## 2. Additional post-generation integrity gate

After:

```bash
node tools/experiments/verify-namua-mtaji-stage1-pilot.js
```

and before Category-A candidate extraction, run:

```bash
node tools/experiments/audit-namua-mtaji-stage1-clock.js
```

Expected result:

```text
passed = true
firstMtajiPlyForSurvivingStandardTrajectory = 44
violations = []
```

If this fails, stop before exploratory candidate/event inspection.

## 3. Interpretation change

The following quantities may still appear in Stage 1 event artifacts:

```text
rawCandidateToMtaji
postAscertainmentToMtaji
```

After Protocol Amendment 1 they are **deterministic clock diagnostics**, not candidate survival endpoints.

Do not interpret group differences in these values as accelerated or delayed formal phase transition.

The Stage 1 design focus is now:

1. progression support / candidate localization;
2. progression-matched comparator feasibility;
3. post-ascertainment structural carry-through toward the fixed ply-44 boundary;
4. frozen first-Mtaji morphology feasibility and later progression-matched comparison.

## 4. Additional file to return

Along with the files listed in the original runbook, also upload:

```text
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/clock-audit.json
```
