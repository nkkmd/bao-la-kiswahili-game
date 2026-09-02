# SFCDF-STUDY1 — Stage 1 development authorization

Date: 2026-09-02

## Formal decision

**`STAGE1-AUTHORIZED`**

Exactly one scientific execution of `SFCDF-S1-DEVELOPMENT-2026-09-02-v1` is authorized.

```text
authorized scientific executions = 1
authorization nonce = SFCDF-S1-AUTH-2026-09-02-V1-01
authorized scientific-content baseline = 140d5827fea9affee46aa15f08cbe15eb7775129
Stage 1 seed = 31410001..31410192 / NOT CONSUMED at authorization
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Authorization review gates

PASS:

- G3-04 program authorization exists;
- prospective Study/prereg freeze complete;
- Stage 0 = `STAGE0-PASS`;
- identity-only upstream firewall materialized and verified;
- actual control-plane tooling smoke run `33621353261` = success;
- tooling smoke trigger produced one workflow run and zero Stage 1 scientific runs;
- source validation run `33621535038` = success;
- production/independent Stage 1 source blobs frozen separately;
- scientific runner contains no prototype-sensitive deep-strict scientific equality gate;
- canonical scientific-content SHA equality is mandatory;
- durable pre-computation lease path tested;
- durable artifact-before-mirror path tested;
- Stage 1 scientific workflow runs before authorization = 0;
- Stage 1 seed unconsumed;
- Stage 2 seed unconsumed;
- no-rescue boundary not crossed;
- protected depth-10 holdout sealed/not generated/not read.

## Execution boundary

The authorization itself does not consume the seed block.

Only creation of the dedicated file

`authorizations/STAGE1_EXECUTION_TRIGGER`

may arm the single scientific workflow. The workflow must acquire and durably push the execution lease before any fresh computation.

After the fresh runner begins, the no-rescue boundary is crossed. No same-evidence rerun, seed extension, root replacement, endpoint/gate change, equality-contract change, or implementation repair is authorized.

Stage 2 remains blocked regardless of Stage 1 outcome until a separate post-Stage-1 authorization review.
