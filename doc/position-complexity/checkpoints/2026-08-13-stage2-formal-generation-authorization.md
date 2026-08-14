# 2026-08-13 — Stage 2 formal generation authorization

Status: **CANONICAL FORMAL FIREWALL CHECKPOINT / LOCAL EXECUTION AUTHORIZED / CORPUS NOT YET GENERATED**

## Stage identity

```text
study = PCX-STUDY1
stage = PCX-S2-FORMAL-2026-08-13-v1
formal corpus = NOT YET GENERATED
execution mode = local only
```

## Scientific design already frozen

The formal design was frozen before Stage 2 outcome generation in:

```text
doc/position-complexity/STAGE_2_FORMAL_PROTOCOL.md
doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json
```

Frozen spec SHA-256:

```text
f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
```

Formal population:

```text
1024 games
seeds 20410001..20411024
8-ply seeded-uniform moveVariants opening
then hard / bao / phase2 / depth2
max ply 100
timeLimitMs = Infinity
adaptive = false
```

Stage 1 states/seeds are not reusable as confirmation.

## Frozen formal hypotheses

Primary PCX-H1:

```text
D23Instability ~ phase + log1pLegalMoveCount
vs phase-only reduced model
unpenalized binomial logistic likelihood-ratio test
df = 1
alpha = 0.05
two-sided association
```

Key secondary PCX-H2:

```text
ordinary-domain log1pD2BestSecondGap
incremental beyond phase + log1pLegalMoveCount
confirmatory only if H1 is confirmed
```

## Tooling validation

Dedicated formal tooling exists:

```text
tools/experiments/run-position-complexity-stage2-formal.js
tools/experiments/verify-position-complexity-stage2-formal.js
tools/experiments/analyze-position-complexity-stage2-formal.py
tools/experiments/check-position-complexity-stage2-authorization.js
test/position-complexity-stage2-formal-tooling.test.js
```

Successful technical CI used to freeze the authorization fingerprint:

```text
validated tooling branch commit = 767d59b08b4772aa904058a47457ff3a822b0017
workflow = Position Complexity Research CI
run = 31673666993
job = 94363432226
result = success
```

It passed:

- existing search regression;
- Stage 0 exact-root diagnostic tests/smoke;
- Stage 1 runner/verifier regression;
- Stage 2 formal runner/verifier technical replay test;
- Stage 2 analyzer syntax validation;
- Stage 2 deterministic logistic-analysis self-test;
- authorization fingerprint materialization.

Authorization record then created:

```text
doc/position-complexity/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
```

A subsequent CI with the authorization present also passed:

```text
workflow = Position Complexity Research CI
run = 31673835352
job = 94363941841
result = success
```

This second run additionally passed:

```text
Position-complexity Stage 2 authorization preflight = success
```

Therefore the committed authorization record is operational against the frozen source/tooling fingerprint.

## Frozen source fingerprint

```text
public/engine.js
  e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
public/ai.js
  2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
public/ai-weights.js
  7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8
tools/benchmark.js
  2a893d7fe78d9d9cb211b38840c45f5c3dd9053fa3e05255b123985a08cfa808
tools/symmetry/transform-candidates.js
  fc85e8520b23b0b4ceb0bd8a95ad7f2b47171405190eedecdc822054d44decc5
tools/experiments/lib/phase-transition-features.js
  b0948a94b8e6358d12194e4dad10018448f85814ac735ca3ceee7a4c74a78480
tools/experiments/lib/position-typology-features.js
  94ec8283cdc9d8f75cbdb13215cc2acd95fd33a2ca3a14afccd3a26ca8644242
tools/experiments/lib/position-complexity-search-diagnostic.js
  471dace470d1d83651d75b2e239b35bbfd55fd65cccc562ac3b47c020988eda9
tools/experiments/run-position-complexity-stage1-exploratory.js
  1b44ff5fb0f58e3391f1b19bcb05f613484f3974d0266919b56fb363f50181a3
tools/experiments/run-position-complexity-stage2-formal.js
  0916a2f530a459dd55ace97c8ee4e6809e6c7a26dd734b8005c96794d43c48e2
STAGE_2_FORMAL_SPEC.json
  f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
```

Pipeline files separately frozen in the authorization record:

```text
verify-position-complexity-stage2-formal.js
  a719a83989d8adb33a0312b0708e7ebf4f1107baa6edf0848e7223017e918ffc
analyze-position-complexity-stage2-formal.py
  5b20fdba78418c243313ed0601554159e9b2e5e361127c3ccd903ba8237ad761
position-complexity-stage2-formal-tooling.test.js
  a6c2c7551dcc466912d614b8a753388749dcddb630a0a5c1998c1c9e5e72a4b3
```

## Execution authorization

The formal generation firewall is now open **only** for the exact frozen Stage 2 v1 pipeline.

Required local runbook:

```text
doc/position-complexity/STAGE_2_FORMAL_RUNBOOK.md
```

Required execution order:

```text
authorization preflight
generate 1024 fixed games
full independent verification
frozen deterministic selection
D2/D3 measurement
formal H1/H2 analysis
```

GitHub Actions must not generate the scientific corpus.

## Permanent prohibitions after authorization

Authorization does not permit:

- protocol modification;
- seed extension;
- early stopping;
- alternate formal metrics/models;
- alternate depth pair;
- phase-stratified rescue;
- phase-interaction rescue;
- replacement of unavailable assigned-phase trajectories;
- Stage 1 evidence reuse;
- post-hoc ambiguity metric substitution;
- reinterpretation of a valid nonsignificant H1 result as inconclusive.

## Current stopping point

```text
Stage 0 = COMPLETE / PASS
Stage 1 = COMPLETE / READINESS PASS / EXPLORATORY-CONSUMED
Stage 2 design = FROZEN
Stage 2 tooling = VALIDATED
Stage 2 authorization = ACTIVE
Stage 2 corpus = NOT YET GENERATED
PR #29 = draft / unmerged
```

Next authorized scientific action is the local Stage 2 formal run according to `STAGE_2_FORMAL_RUNBOOK.md`.
