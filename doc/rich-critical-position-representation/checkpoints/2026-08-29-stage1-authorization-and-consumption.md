# RCPR-STUDY1 — Stage 1 authorization and consumption checkpoint

Date: 2026-08-29  
Stage: `RCPR-S1-DEVELOPMENT-2026-08-28-v1`

## Classification

**STAGE 1 EXPLICITLY AUTHORIZED / SCIENTIFIC PRODUCTION STARTED / CONSUME-ONCE DEVELOPMENT BLOCK CONSUMED / RESULT PENDING / STAGE 2 NOT AUTHORIZED**

## Authorization

```text
authorization ID = RCPR-S1-EXECUTE-2026-08-29-v1
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
authorization path = doc/rich-critical-position-representation/authorizations/STAGE_1_EXECUTE.json
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
source-freeze checkpoint commit = 4366e439c2838dd7f2f388e834ecc93aed7efcb6
Stage 1 spec SHA256 = 813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb
execution addendum SHA256 = e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64
```

The exact runtime/orchestration source-blob map is frozen in `results/STAGE_1_SOURCE_FREEZE_AUDIT.json` and bound by the authorization.

## Execution

```text
workflow = RCPR Stage 1 Development
workflow run = 33196954082
production job = 98936414477
trigger = push of explicit authorization file
source SHA checked out by workflow = a0d630df2ee5fbd943d306ab959ce509cbcc2330
production step = Execute fresh Stage 1 development population once
observed state at checkpoint = in_progress
```

The production step has started. Under `RCPR-S1-EXECUTION-CONTRACT-2026-08-29-v1`, this is conservatively classified as having crossed, or as no longer provably preceding, the `execution-start.json` consumption boundary. Therefore the scientific Stage 1 seed block is permanently treated as **consumed** for this Study:

```text
games = 3072
seeds = 28610001..28613072
use = CONSUME-ONCE-DEVELOPMENT-ONLY
consumption state = CONSUMED
replacement/extension = NOT AUTHORIZED
same-block rerun = NOT AUTHORIZED
```

This classification is irreversible within `RCPR-STUDY1` unless repository evidence proves the production runner never crossed its frozen execution-start boundary; no such evidence is presently available, and the production execution step is already active.

## Fail-closed continuation

While workflow run `33196954082` is active:

- do not modify scientific source files or frozen scientific contracts;
- do not create another Stage 1 authorization;
- do not dispatch or rerun the Stage 1 scientific workflow;
- do not extend or replace the seed block;
- do not interpret partial production state as a scientific result;
- do not authorize Stage 2.

If production fails after consumption, classify Stage 1 as `STAGE1-TECHNICAL-INVALID`; do not repair and rerun the same evidence block. If production succeeds, the already-frozen workflow proceeds to structurally independent full-corpus replay and recomputation. Only complete independent verification may support a Stage 1 development decision.

## Scientific result status

At this checkpoint:

```text
production result = PENDING
independent verification = NOT YET COMPLETE
Stage 1 development decision = NOT YET AVAILABLE
Stage 2 authorization = false
```

The next action is read-only inspection of workflow run `33196954082` until it reaches a terminal production/verification state; no scientific design changes are authorized meanwhile.
