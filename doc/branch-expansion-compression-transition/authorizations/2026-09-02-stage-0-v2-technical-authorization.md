# BECT-STUDY1 — Stage 0 v2 technical authorization

Date: 2026-09-02  
Decision: **`BECT-S0-TECHNICAL-2026-09-02-v2 / AUTHORIZED / EXACTLY ONE FORMAL EXECUTION`**

## Review basis

Stage 0 v1 is immutable:

```text
BECT-S0-TECHNICAL-2026-09-02-v1 = TECHNICAL-INVALID
run = 33631597307
cause = technical seed 31500001 terminated before fixed assumed ply 26
fresh scientific evidence access = false
```

The failure was confined to the technical replay fixture. The Stage 1/2 scientific contract and protected evidence were untouched.

## Authorized correction

The canonical technical refreeze is:

`../prereg/STAGE_0_V2_TECHNICAL_REFREEZE.json`

v2 keeps technical seed `31500001` but removes the invalid minimum-length assumption. After deterministic replay up to at most ply 26, v2 selects the latest pair of consecutive post-move roots that are both nonterminal. The pair selection is geometry-blind, endpoint-blind and scientific-outcome-blind and exists solely to validate adjacent-root binding and overlapping depth-5 window reconstruction.

Reusing this technical-only seed is permitted for the versioned technical correction because no G3-05 fresh scientific evidence has been generated/read and the Study no-rescue boundary has not been crossed. The seed remains permanently prohibited from scientific use.

## Unchanged scientific contract

No change is authorized to:

- M1-M8 endpoint universe;
- exact delta/event grammar or threshold policy;
- RAW identity / relative depth 5 / transforms `[]`;
- Stage 1 seeds/population/promotion rule;
- Stage 2 seeds/population/formal test;
- firewalls or resource ceilings;
- canonical equality or implementation separation;
- protected depth-10 status.

## Execution boundary

```text
authorization nonce = BECT-S0-AUTH-2026-09-02-V2-01
max formal v2 executions = 1
v1 rerun = prohibited
Stage 1 seed access = prohibited
Stage 2 seed access = prohibited
protected depth-10 access = prohibited
```

The execution must retain source blob binding, branch-advancement allowlist, concurrency guard and artifact-before-mirror behavior.

Stage 0 v2 PASS would establish technical readiness only and would not authorize Stage 1.
