# BECT-STUDY1 — Post-Stage-0 Stage 1 authorization review

Date: 2026-09-02

## Review input

Stage 0 technical closure:

```text
BECT-S0-TECHNICAL-2026-09-02-v1 = TECHNICAL-INVALID / no rerun
BECT-S0-TECHNICAL-2026-09-02-v2 = STAGE0-PASS
v2 run = 33632094597
v2 artifact = 9847240252
fresh scientific evidence generated/read = false
Stage 1 seed = 31510001..31510240 / NOT CONSUMED
Stage 2 seed = 31520001..31520384 / NOT CONSUMED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

## Review questions

1. Can the frozen RAW-only depth-5 LGTGMIV families support the longitudinal BECT Stage 1 construct? **YES.**
2. Did Stage 0 validate deterministic adjacent-ply reconstruction, successor binding, overlapping-window semantics and exact event grammar? **YES.**
3. Is a new measurement/representation/canonicalization prerequisite required? **NO.**
4. Is a new scientific resource-feasibility Study required? **NO.** Stage-local fail-closed resource ceilings remain frozen.
5. May G3-03 technical-invalid diagnostics be used? **NO.**
6. May G3-04 C1/C6 outcomes select BECT candidates or roots? **NO. Context only.**
7. Are Stage 1 fresh seeds still sealed? **YES.**
8. Is the protected depth-10 holdout still sealed? **YES.**
9. Is scientific execution immediately authorized solely by Stage 0 PASS? **NO.** Preauthorization tooling and identity firewall must pass first.

## Formal review decision

**`BECT-STAGE1-PREPARATION-AUTHORIZED / SCIENTIFIC-EXECUTION-NOT-YET-AUTHORIZED`**

This decision authorizes fresh-free Stage 1 preparation only:

- materialize an upstream identity-only exclusion firewall;
- implement production and independent Stage 1 selectors/aggregators without importing each other;
- freeze source/blob bindings;
- implement fail-closed resource accounting;
- implement durable pre-computation lease and single trigger path;
- validate actual control-plane behavior with non-scientific smoke;
- validate scientific workflow source bindings without accessing Stage 1/2 seed blocks;
- audit that Stage 1 scientific workflow executions before authorization remain zero.

This decision does **not** authorize:

- reading or generating any state from seed `31510001..31510240`;
- Stage 1 root selection;
- Stage 1 local geometry measurement;
- Stage 1 event prevalence or candidate promotion computation;
- Stage 2 seed access;
- protected depth-10 access.

## Required firewall

Before Stage 1 scientific authorization, an identity-only manifest must contain exclusion sets for at least:

- RAW root identity;
- source trajectory identity;
- opening-prefix identity;

covering the canonical upstream LGTGMIV / G3-03 identities and G3-04 Stage 1/Stage 2 selected identities. The materialized manifest must set `scientificOutcomeFieldsRetained=false` and must not retain G3-03 diagnostic directions, G3-04 candidate values/directions, p-values, promotion labels or formal outcomes.

Within BECT Stage 1, selected trajectories must additionally enforce no repeated RAW root identity among all selected analysis roots and no duplicate full source trajectory/opening-prefix identity across selected trajectories.

## Execution-integrity condition

Stage 1 may receive an explicit `STAGE1-AUTHORIZED / EXACTLY ONE EXECUTION` decision only after all of the following pass without Stage 1 seed access:

1. identity-only firewall materialization and canonical hash freeze;
2. production/independent implementation separation audit;
3. canonical equality/source-binding audit;
4. actual one-trigger/one-workflow control-plane smoke;
5. durable lease path validation;
6. artifact-before-mirror path validation;
7. source validation confirming Stage 1 scientific workflow runs before authorization = 0;
8. protected-evidence checks.

Until then Stage 1 remains `NOT-AUTHORIZED-NOT-EXECUTED`.
