# SFCDF-STUDY1 — Stage 2 preparation eligibility review

Date: 2026-09-02

## Decision

**`STAGE2-PREPARATION-ELIGIBLE`**

This decision authorizes only non-scientific Stage 2 preparation and validation. It does **not** authorize Stage 2 fresh formal evidence generation or seed access.

## Required gates

All prerequisite gates for Stage 2 preparation are satisfied:

```text
Stage 1 disposition = STAGE1-PASS
Stage 1 authorized scientific executions = 1
Stage 1 actual scientific executions = 1
Stage 1 population complete = true
Stage 1 integrity / estimability = PASS
Stage 1 promoted set nonempty = true
Stage 1 no-rescue boundary = CROSSED / ACTIVE
Stage 2 seed 31420001..31420288 = NOT CONSUMED
protected standard-root exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

## Frozen Stage 2 scientific input

Only the following Stage 1 promoted candidates may enter Stage 2:

```json
[
  {"candidateId":"SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION","direction":"MTAJI-GREATER"},
  {"candidateId":"SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO","direction":"NAMUA-GREATER"}
]
```

C2–C5 remain non-promoted and cannot be revived.

Stage 2 formal validation remains prospectively bound to:

- 18 paired trajectories / 36 roots,
- seed block `31420001..31420288`,
- RAW-only relative depth 5,
- exact rational arithmetic,
- C1/C6 coverage 18/18,
- `3 * nonZero >= 2 * comparable`,
- exact two-sided sign test on nonzero paired differences,
- Holm-Bonferroni FWER alpha `1/20` across the two frozen promoted candidates,
- observed direction equal to frozen Stage 1 direction,
- no same-evidence rerun rescue.

## Preparation allowed before Stage 2 authorization

The following non-scientific operations are allowed:

1. materialize a minimal Stage 2 formal input containing only the frozen promoted set/directions and Stage 1 identity fields required for the within-G3-04 firewall;
2. implement production/independent Stage 2 selectors and formal validator bindings without changing the frozen endpoint or statistical contract;
3. implement the one-shot Stage 2 lease / computation / durable-artifact / exact-mirror control plane;
4. perform source/static/control-plane validation without accessing Stage 2 seed values;
5. freeze exact source blob SHAs and then conduct a separate Stage 2 authorization review.

Until that separate authorization is committed:

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
fresh Stage 2 scientific evidence = PROHIBITED
Stage 2 seed access = PROHIBITED
```
