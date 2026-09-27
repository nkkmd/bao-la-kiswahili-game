# G4-08 / BRSGT-STUDY1 — Stage 1 v1 technical invalidation

Date: 2026-09-27

## Disposition

`BRSGT-S1-DEVELOPMENT-2026-09-27-v1` is **STAGE1-TECHNICAL-INVALID / NO-RERUN-SAME-VERSION**.

This is not a scientific negative result and must not be used as evidence for or against any rule-semantic geometry claim.

## Execution provenance

- workflow run: `36298620437`
- run attempt: `1`
- job: `108561989069`
- execution HEAD: `eb8220af5e1c17bb89f4bde28b6025e7b10803d1`
- audited source HEAD: `4f307a5502abc1b5748c4080cdcbe7ef7d53dc71`
- binding result: `STAGE1-BINDING-PASS`
- artifact ID: `10924827904`
- artifact ZIP SHA-256: `f95452e80b6e70bb6801c59c9767dc0231ae1522415dd12e9f9259e1c31b121d`

## Failure

The scientific runner failed during the one-shot execution. The terminal error preserved in the GitHub Actions log is:

`ReferenceError: freshScientificSeedReads is not defined`

at `tools/experiments/run-brsgt-stage1-development.js:486`.

The runner's outer catch block attempted to build `STAGE_1_FAILURE.json` using the undefined identifier `freshScientificSeedReads`; the actual counter variable is `freshSeedReads`. Therefore the catch handler itself failed while handling an earlier technical exception.

Consequences:

1. The original technical exception was masked and is not recoverable from the retained log/artifact.
2. `STAGE_1_FAILURE.json` was not created.
3. The exact number of fresh seed reads at failure was not preserved.
4. The artifact contains only `STAGE_1_EXECUTION_CONTEXT.json` and `SHA256SUMS.txt`.
5. No Stage 1 scientific result exists.

## Fresh-evidence boundary

The frozen v1 block was:

`40813001..40813512` / 512 slots.

The execution context proves the count was zero immediately before fresh access, but the exact count after execution began is unknown because the failure handler failed. To avoid reuse of possibly exposed evidence, the **entire block is conservatively treated as consumed and permanently excluded from reuse**.

Do not rerun v1. Do not repair v1 and reuse the same seed block.

## Protected boundaries retained

- formal inference: not performed
- scientific outcome: none
- effect values/signs: not retained as scientific evidence
- Stage 2 seed access: 0
- G4-10 depth-11 access: 0
- public AI change: none
- main integration: not authorized

## Requirements before any v2 fresh execution

A v2 may only proceed after all of the following are complete:

1. new Stage 1 version identity;
2. new non-overlapping fresh seed block;
3. corrected failure-handler variable;
4. explicit pre-fresh self-test of the catch/failure-artifact path;
5. new pre-fresh static audit;
6. new frozen source binding;
7. new one-shot authorization and trigger.

Canonical machine-readable record:

`results/stage-1-v1/STAGE_1_V1_CANONICAL_FAILURE_RECORD.json`
