# Program Decision — G3-02 unintended duplicate execution audit

Date: 2026-09-02

## Decision

Final Actions-history audit identified an unintended duplicate execution of `EBRWS-S1-DEVELOPMENT-2026-09-01-v1`.

This audit **does not reopen or change** the existing G3-02 closure decision. The formal state remains:

```text
EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Execution-count violation

The prospective Stage 1 authorization permitted exactly one scientific execution.

Actual history:

1. run `33569323221` / job `100059596453` — authorized one-shot; scientific step completed, canonical result push failed.
2. run `33569382663` / job `100060967285` — unintended duplicate; scientific step completed but is `INVALID-DO-NOT-USE`.

The duplicate run was queued by a workflow-arming commit while run #1 was still in progress and before run #1's scientific outcome was known. The non-cancelling concurrency group delayed the second computation until after run #1 had crossed the no-rescue boundary.

Thus this was not an outcome-driven attempt to rescue a favorable result, but it nevertheless violated the exactly-one-execution authorization and is a formal technical-integrity failure.

## Scientific handling

Run #2 is excluded from all scientific inference. Its agreement with run #1 cannot be used as replication, confirmation, repair, or rescue.

No additional Stage 1 execution is authorized. The Stage 1 execution workflow is disabled.

The already documented runner-local reply-width compression summaries remain diagnostic provenance only and are not formal promoted candidates.

## Protected evidence and downstream boundary

- Stage 2 seed `31220001..31220288` remains unconsumed.
- Stage 2 remains `NOT-AUTHORIZED-NOT-EXECUTED`.
- standard initial RAW-root complete exact depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.
- G3-03 and later studies remain subject to a separate post-G3-02 program review.
