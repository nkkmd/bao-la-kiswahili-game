# TCTGD-STUDY1 — Stage 0 technical authorization

Date: 2026-09-02

## Authorized stage

`TCTGD-S0-TECHNICAL-2026-09-02-v1`

Evidence class:

`TECHNICAL-FIXTURE`

## Preconditions confirmed

- post-G3-02 G3-03 program review = `G3-03-AUTHORIZED`
- prospective Study/preregistration freeze = complete
- freeze checkpoint = `checkpoints/2026-09-02-study-preregistration-freeze.md`
- frozen-content HEAD before checkpoint = `1ddf1f292ce48be2a0c866b0fa86ea060f2e613d`
- freeze checkpoint commit = `9a9b5f834bdef216f370dbec56279ac3ed6e105e`
- G3-03 fresh scientific evidence generated/read = false
- Stage 1 seed `31310001..31310192` = unconsumed
- Stage 2 seed `31320001..31320288` = unconsumed
- protected standard-root exact depth-10 holdout = `SEALED / NOT GENERATED / NOT READ`

## Scope

Stage 0 is authorized only to run the frozen synthetic technical runner:

`tools/experiments/run-tctgd-stage0-technical.js`

Frozen runner blob:

`8fe976990de7792926401334cfc0171599cd9059`

It may inspect only synthetic fixture objects and source text required for static independence checks.

It may not:

- instantiate or enumerate a G3-03 fresh source trajectory;
- consume Stage 1 or Stage 2 seeds;
- generate a G3-03 fresh RAW root;
- read any G3-03 fresh scientific endpoint;
- generate/read/peek the protected standard initial RAW-root complete depth-10 holdout;
- read G3-02 runner-local diagnostic outcomes as scientific input.

## Required Stage 0 gates

All must pass:

1. known no-transposition synthetic control;
2. same-parent/different-move duplicate synthetic control;
3. distinct-parent multi-parent synthetic control;
4. duplicate vs multi-parent semantic separation;
5. first-reconvergence semantics;
6. root-branch-overlap semantics;
7. traversal/order invariance;
8. production / independent exact endpoint agreement;
9. development-promotion boundary agreement;
10. exact sign-test boundary agreement;
11. exact Holm boundary agreement;
12. static independence audit;
13. fresh scientific seed access = false;
14. protected depth-10 access = false.

## Decision rule

- all mandatory gates pass -> `STAGE0-PASS`
- any source/semantic/exact-agreement/static-independence failure -> `TECHNICAL-INVALID`
- resource ceiling exceeded without scientific-integrity mismatch -> `NON-ESTIMABLE`

Stage 0 PASS does not authorize Stage 1.

## Execution count

Stage 0 is non-scientific synthetic validation and does not consume a scientific execution count. Its result must nevertheless be durably recorded before any Stage 1 authorization review.
