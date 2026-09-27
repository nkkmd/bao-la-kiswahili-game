# G4-08 / BRSGT-STUDY1 — Stage 0 v1 technical-invalid checkpoint

Date: 2026-09-27  
Study: `BRSGT-STUDY1`  
Stage: `BRSGT-S0-TECHNICAL-2026-09-27-v1`  
Disposition: **`TECHNICAL-INVALID / NO RERUN OF V1`**

## Execution provenance

```text
workflow = BRSGT Stage 0 Technical
run ID = 36295138475
attempt = 1
job ID = 108552488514
source SHA = b3871b0454f6ce5e5f4a2e51afc95a10282ff4cd
audited source SHA = 1940fcc740d0636a6d1f6bd889058fff8ecfb6d1
```

## Pre-execution gates

PASS:

- checkout
- Node 24 setup
- JavaScript syntax checks
- authorization/source binding
- post-audit path restriction
- production/independent implementation byte separation
- fresh scientific access prohibition
- G4-10 depth-11 prohibition

Binding verifier reported:

```text
disposition = STAGE0-BINDING-PASS
postAuditChangedPaths = authorization JSON + trigger JSON only
freshScientificSeedAccessAuthorized = false
g4_10Depth11AccessAuthorized = false
```

## Technical failure

The technical runner failed before geometry measurement with:

```text
Error: represented seed total 34
```

The error was raised by the frozen LGTGMIV RAW-state validator while `BRSGT-TF-NYUMBA` was being canonicalized in production `selectionCore`.

The v1 hand-constructed NYUMBA fixture contained 14 board seeds and reserves `[10,10]`, representing 34 seeds rather than the authoritative 64-seed RAW contract.

## Scientific interpretation

This is **not** a scientific result about capture, nyumba, reserve decrement, Namua→Mtaji, or geometry change.

The failure occurred in technical fixture validation before:

- any fresh scientific seed access;
- any Stage 1/Stage 2 population access;
- any formal event-family measurement;
- any G4-10 depth-11 access.

```text
fresh scientific seed reads = 0
Stage 1 candidate namespace reads = 0
Stage 2 candidate namespace reads = 0
G4-10 depth-11 access = 0
scientific outcome = NONE
```

## No-rerun boundary

Stage 0 v1 was authorized for one execution and has consumed that authorization.

Therefore:

- do not rerun `BRSGT-S0-TECHNICAL-2026-09-27-v1`;
- do not mutate the v1 fixture and reclassify the same execution;
- do not treat the failure as negative scientific evidence.

A corrected technical fixture may be tested only as a **new Stage 0 version**, with a new technical spec, new source audit, new authorization, and new trigger.

## v2 design requirement

A v2 fixture must satisfy the current LGTGMIV RAW-state invariant:

```text
sum(pits) + reserve[0] + reserve[1] + pending[0] + pending[1] = 64
```

Preferred correction:

- keep NYUMBA semantics while making the hand-constructed state 64-seed valid;
- replace the manually inconsistent phase-transition state with a deterministic seed-free state reached from `engine.initialState()` under a frozen canonical move policy, so state conservation is inherited from the engine;
- retain zero scientific seed use.

Stage 1 remains not authorized.
