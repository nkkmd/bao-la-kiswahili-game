# Stage 1 Supplemental Risk-Set Audit Runbook

Date: 2026-08-11  
Status: active supplemental Stage 1 design audit  
Study: Namua→Mtaji Strategic Temporal Transition

## 1. Purpose

Run the prespecified exact-ply risk-set comparator feasibility audit defined in:

```text
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_2.md
```

This uses only the already-generated consumed Stage 1 exploratory corpus.

No new games are generated.

## 2. Scientific boundary

The audit is support-only.

It must not be used for:

- p-values or effect tests;
- M1/M2 contrast optimization;
- choosing a comparator because it maximizes a morphology difference;
- changing Category-A or CBE definitions;
- formal confirmation.

## 3. Required existing local artifacts

The following Stage 1 directory must still exist locally:

```text
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/
```

Required contents include:

```text
manifest.json
games/game-*.json
stage1-event-table.csv
```

## 4. Update the research branch

From repository root:

```bash
git fetch origin
git switch research/namua-mtaji-temporal-transition
git pull --ff-only

git rev-parse HEAD
git status --short
```

Do not run the audit with uncommitted modifications to the audit source or study protocol.

## 5. Static syntax check

```bash
node --check tools/experiments/audit-namua-mtaji-stage1-riskset.js
```

If this fails, stop and report the full error.

## 6. Run the support audit

```bash
node tools/experiments/audit-namua-mtaji-stage1-riskset.js
```

Default input:

```text
artifacts/local/namua-mtaji-transition/stage1-pilot-v1
```

Expected outputs:

```text
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/stage1-riskset-audit.json
artifacts/local/namua-mtaji-transition/stage1-pilot-v1/stage1-riskset-controls.csv
```

## 7. What the audit checks

For every unique CBE exposure unit, duplicate exposure rows are collapsed by:

```text
historicalTrajectoryHash + candidatePly
```

For each condition carrying the exposure row, the audit measures:

```text
R0 = same condition + exact candidate ply
R1 = R0 + no Category-A representative at the exact index ply
R2 = R1 + same forced-capture status
R3 = R2 + no Namua CBE anywhere in the control trajectory
```

The audit reports both raw game rows and unique historical trajectories.

## 8. Deterministic progression gate

The tool verifies:

```text
candidate total reserve = 44 - candidatePly
```

and, for Namua landmark observations:

```text
landmark total reserve = 44 - (candidatePly + 8)
```

Any violation causes a failed audit. Do not bypass this gate.

## 9. Outcome-use boundary

The audit may count only whether a control:

- reaches Mtaji;
- has an eligible first-Mtaji morphology state;
- terminates before Mtaji;
- is administratively truncated.

It intentionally does not load or report MTAJI-M1 versus MTAJI-M2 labels by risk-set family.

## 10. Files to return

After successful execution, upload:

```text
stage1-riskset-audit.json
stage1-riskset-controls.csv
```

The JSON file is the primary handoff. The CSV is needed for identity/support inspection if the aggregate report exposes an anomaly.

## 11. What happens next

After the support audit:

- if exact-ply risk-set support is adequate, the next exploratory task will target **additional independent CBE exposure yield**;
- if forced-capture-matched support is sparse, we will decide whether forced-capture should be adjusted rather than matched;
- if even R0/R1 is sparse, the sampling design itself must be revised.

Stage 2 design freeze remains unauthorized until this decision is made.
