# FDEGHV-STUDY1 — CURRENT STATUS

更新日: 2026-09-04

## Current state

```text
Program = Research Generation 3 / G3-11
Study = FDEGHV-STUDY1
Program authorization = G3-11-AUTHORIZED
Lifecycle = STARTED / PRE-HOLDOUT-FREEZE
Reviewed main anchor = e537199a959c0808cbef6cf8aaeb1caab91e3702
Research branch = research/g3-11-fresh-depth10-exact-geometry-holdout
Stage 0 = FDEGHV-S0-TECHNICAL-2026-09-04-v1 / NOT YET EXECUTED
Stage 1 = FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1 / NOT AUTHORIZED / NOT EXECUTED
Protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
Depth-11 access = PROHIBITED
G2-12 estimator scientific input = PROHIBITED / NOT USED
Main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Frozen formal target

```text
E0 = complete exact RAW domain through depth 10
H1 = newRawStateCount[10] == uniqueRawStateCount[10]
H2 = treeNodeOccurrences[10] > uniqueRawStateCount[10]
H3 = cumulative tree/RAW ratio through 10 > through 9, exact cross-product
H4 = duplicateArrivalCount[10] > 0 AND statesWithMultiplePredecessors[10] > 0
```

## Pre-access gates still required

Before any protected depth-10 access:

1. formal JSON specs materialized;
2. G3-11 production/independent/target source identities frozen;
3. Stage 0 technical controls PASS;
4. G3-10 current-facing `FUTURE_RESEARCH_AGENDA.md` integration wording synchronized without editing historical `PROGRAM_PLAN.md`;
5. Stage 1 machine authorization materialized with exact source bindings;
6. durable pre-computation lease uploaded successfully.

Until all six gates pass, `FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1` remains not authorized.

## No-rescue boundary

The no-rescue boundary becomes irrevocably active at first protected depth-10 scientific access. After that point there is no same-Study rerun, cap increase, endpoint change, subset promotion, root replacement, symmetry/canonicalization rescue, G2-12 prediction use, or depth-11 extension.
