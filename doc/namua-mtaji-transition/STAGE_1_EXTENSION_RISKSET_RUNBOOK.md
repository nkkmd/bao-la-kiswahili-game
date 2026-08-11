# Stage 1 Extension Exact-Ply Risk-Set Runbook

Date: 2026-08-11  
Status: **ACTIVE / support-only audit**

## Purpose

Apply the already frozen exact-ply R0–R3 comparator-support audit to all fully ascertained Namua CBE units in the completed Stage 1 exposure-support extension.

No new games are generated.

No morphology effects are inspected.

Read with:

```text
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_2.md
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_3.md
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RESULT.md
```

## Preconditions

Use branch:

```text
research/namua-mtaji-temporal-transition
```

The completed local extension must remain at:

```text
artifacts/local/namua-mtaji-transition/stage1-extension-v1
```

Required existing files include:

```text
manifest.json
verification.json
clock-audit.json
stage1-event-table.csv
```

Do not regenerate the 768-game extension.

## Update repository

```bash
git fetch origin
git switch research/namua-mtaji-temporal-transition
git pull --ff-only

git rev-parse HEAD
git status --short
```

The working tree should be clean before the audit.

## Static check

```bash
node --check tools/experiments/audit-namua-mtaji-stage1-riskset.js
```

## Execute extension-wide risk-set audit

```bash
node tools/experiments/audit-namua-mtaji-stage1-riskset.js \
  --input artifacts/local/namua-mtaji-transition/stage1-extension-v1 \
  --events artifacts/local/namua-mtaji-transition/stage1-extension-v1/stage1-event-table.csv \
  --output artifacts/local/namua-mtaji-transition/stage1-extension-v1
```

Expected outputs:

```text
artifacts/local/namua-mtaji-transition/stage1-extension-v1/stage1-riskset-audit.json
artifacts/local/namua-mtaji-transition/stage1-extension-v1/stage1-riskset-controls.csv
```

## Required interpretation checks

Before any further exploratory generation, inspect:

1. `passed == true`;
2. `progressionViolations` is empty;
3. every fully ascertained extension Namua CBE exposure appears in the audit;
4. support is reported for every condition row in which each exposure occurs;
5. R0–R3 nesting is respected;
6. R3 unique historical trajectory support is not zero for any exposure-condition unit;
7. duplicate trajectories across conditions are not interpreted as independent controls;
8. no morphology contrast or p-value is present.

A larger R3 count is not evidence of a phenotype effect. It is only comparator feasibility.

## Return artifacts

Upload:

```text
stage1-riskset-audit.json
stage1-riskset-controls.csv
```

## Stop conditions

Stop before further corpus generation if:

- the script fails;
- progression violations occur;
- one or more extension CBE units are absent;
- R3 support is zero for any exposure-condition unit;
- morphology labels were accidentally introduced into comparator selection.

## Boundary

The extension remains consumed exploratory data.

Even a complete risk-set PASS does not authorize Stage 2 because the frozen exposure-readiness gate is still unmet:

```text
combined unique CBE trajectory-ply units = 5 < 10
combined unique CBE trajectories = 5 < 8
```
