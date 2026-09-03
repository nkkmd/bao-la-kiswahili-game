# SILGM Stage 0 v2 — Technical-invalid closure

Date: 2026-09-03  
Study: `SILGM-STUDY1`  
Stage: `SILGM-S0-TECHNICAL-2026-09-03-v2`  
Disposition: **`STAGE0-TECHNICAL-INVALID / NO RERUN`**

## Execution identity

```text
trigger commit = c41690715d7086797886bf157d301fb1d75a7684
workflow run = 33708686245
job = 100503335114
actual v2 technical executions = 1
max authorized v2 technical executions = 1
```

Pre-computation gates all passed before the technical computation:

- syntax checks;
- exact authorization/source-blob binding;
- v2 materialization `--verify-only` audit;
- durable pre-computation lease creation and upload.

Lease artifact:

```text
artifact id = 9876152121
name = silgm-stage0-v2-lease-33708686245
ZIP SHA-256 = 88233870e7f3aef3eec9866af111106e7e5516e5822a29d26f9f8b634742bb5c
```

Result artifact:

```text
artifact id = 9876152480
name = silgm-stage0-v2-result-33708686245
ZIP SHA-256 = eccdec639bec0f17b492b01052a26646dbcfaf65c9aeadd6203adaa4670c0530
canonical JSON SHA-256 = 0061d99606faaaa3e4cba0a0b229d94e7b166a23aaf38e5a0452d6fd7f10b8f6
```

## Failure

Canonical error:

```text
technical mtaji root unavailable for frozen seed 31709002
```

The v2 correction to the synthetic G5 expectation was successfully materialized before computation. The execution then constructed the fixed technical roots. Technical-only Namua seed `31709001` satisfied its target. The fixed technical-only Mtaji seed `31709002` did not produce a nonterminal Mtaji state at or after ply 44 with at least two legal moves within the frozen 80-ply technical source horizon.

This is a **technical fixture availability defect**. It is not evidence about the scientific G3-07 population, local geometry/search association, or Bao generally.

The failure happened before real technical-root geometry/search measurement was entered because the roots array was constructed before the measurement loop.

Canonical result records:

```text
freshStage1SeedAccess = false
freshStage2SeedAccess = false
protectedDepth10Access = false
```

Thus:

```text
fresh G3-07 scientific evidence = NOT GENERATED / NOT READ
Stage 1 seed namespace = RESERVED / NOT CONSUMED
Stage 2 seed namespace = RESERVED / NOT CONSUMED
no-rescue boundary = NOT CROSSED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

## No-rerun decision

The same v2 execution is not rerun. `31709002` is not replaced inside v2 and the v2 result remains immutable technical provenance.

Because no fresh scientific evidence has been generated/read, a new technical version may be prospectively frozen without changing the scientific Study contract. Any v3 technical root selection must remain inside the already reserved technical-only namespace `31709001..31709008`, must be deterministic/outcome-blind with respect to G3-07 scientific endpoints, and must not inspect Stage 1/2 populations or the protected depth-10 holdout.
