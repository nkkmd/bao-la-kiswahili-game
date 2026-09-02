# Research Generation 3 checkpoint — G3-02 unintended duplicate execution audit

Date: 2026-09-02 (Asia/Tokyo)

Final GitHub Actions history audit identified an unintended second scientific execution of G3-02 Stage 1:

```text
authorized Stage 1 scientific executions = 1
actual Stage 1 scientific executions = 2
run #1 = 33569323221 / authorized one-shot / canonical materialization failure
run #2 = 33569382663 / unauthorized duplicate / INVALID-DO-NOT-USE
execution-count contract = violated
```

The second run was queued by a workflow-arming commit while run #1 was still in progress, before the first scientific outcome was known. The concurrency group delayed its actual computation until after run #1 had crossed the no-rescue boundary.

This does not create a valid replication and does not alter the already fail-closed formal decision:

`G3-02 / EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`

Formal promoted candidate set remains `[]`; Stage 2 remains `NOT-AUTHORIZED-NOT-EXECUTED`; Stage 2 seed remains unconsumed.

The duplicate run is excluded from scientific inference. No third Stage 1 execution is authorized, and the Stage 1 execution workflow has been disabled.

Protected standard-initial RAW-root complete exact depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.
