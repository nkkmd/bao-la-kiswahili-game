# EBRWS-STUDY1 — unintended duplicate Stage 1 execution

Date: 2026-09-02 (Asia/Tokyo)

## Finding

Final Actions-history audit found a second execution of `EBRWS-S1-DEVELOPMENT-2026-09-01-v1`:

- run: `33569382663`
- job: `100060967285`
- formal status: `UNAUTHORIZED-DUPLICATE-INVALID`

This does not change the already fail-closed Study decision:

`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`

## Cause and chronology

While the first authorized one-shot run `33569323221` was still executing, a technical workflow-arming commit added the Stage 1 workflow's own file path to its push trigger because the trigger run had not yet been visible in the monitoring query.

That commit queued a second workflow run before the first scientific outcome was known. Because the workflow used a non-cancelling concurrency group, the second job waited. Its actual Stage 1 computation began only after the first run had completed its scientific step and therefore after the no-rescue boundary had already been crossed.

The second computation was not authorized by the frozen exactly-one-execution contract.

## Invalid duplicate output

Run #2 repeated the same seed block and locally logged the same deterministic scientific summary:

```text
selected roots = 12 Namua + 12 Mtaji
production / independent stage core = 4203300a9fc3648fd41fe05aaa6c555e6afa4c86537cef787fc748ae34b1f02e
candidateSetSha256 = 4f18c50b5fdab6452d9f3ccc9ae97f2277dfc94ba9e210a7e6c36b919d6155f6
scientificResultFileSha256 = 1c5444ab050e85735763231a7c5913489c1254017b9acbb6a286fdaf742ff30a
```

Its telemetry hash differed, as expected for runtime-dependent telemetry:

`6f9c5323ff5cf95b9261a8b90dcfb2385702ca53329739cb87267a71e92f9da4`

The duplicate output is explicitly excluded from scientific inference. It does not validate, replicate, repair, or rescue the first execution.

The second runner-local result commit `24c57398` was also rejected non-fast-forward and is not recoverable from GitHub after runner teardown.

## Formal handling

- authorized Stage 1 execution count = 1
- actual scientific executions = 2
- execution-count contract = violated
- run #1 = diagnostic provenance only after canonical materialization failure
- run #2 = `INVALID-DO-NOT-USE`
- formal promoted candidate set = `[]`
- Stage 2 = `NOT-AUTHORIZED-NOT-EXECUTED`
- no third execution is authorized

The Stage 1 execution workflow has been disabled after closure to prevent any further accidental execution.

## Protected evidence

Neither Stage 1 execution generated or read the protected standard-initial RAW-root complete exact depth-10 holdout. It remains:

`SEALED / NOT GENERATED / NOT READ`
