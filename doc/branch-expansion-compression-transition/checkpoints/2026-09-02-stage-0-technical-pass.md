# BECT-STUDY1 — Stage 0 technical closure

Date: 2026-09-02

## Decision

**`BECT-S0-TECHNICAL-2026-09-02-v2 = STAGE0-PASS`**

Stage 0 longitudinal technical readiness is established. This checkpoint does not authorize Stage 1 scientific execution.

## Version history

### v1

```text
Stage ID = BECT-S0-TECHNICAL-2026-09-02-v1
run = 33631597307
job = 100252124483
disposition = TECHNICAL-INVALID
authorized executions = 1
actual executions = 1
same-version reruns = 0
```

The fixed technical root-pair assumption 24->25 was invalid because technical seed `31500001` terminated before ply 26. No fresh scientific evidence, Stage 1/2 seed or protected depth-10 evidence was accessed.

### v2

v2 was prospectively refrozen as a separate technical version before any fresh scientific evidence. Scientific endpoints, transition grammar, populations, fresh seed blocks, resource ceilings, formal inference and representation were unchanged. Only the technical fixture root-selection rule changed to the latest consecutive nonterminal post-move root pair.

```text
Stage ID = BECT-S0-TECHNICAL-2026-09-02-v2
run = 33632094597
job = 100253778721
workflow head = 9a2c4549f748085ec11b8f30263e97459b3caff4
disposition = STAGE0-PASS
authorized executions = 1
actual executions = 1
same-version reruns = 0
```

## Durable artifact

```text
artifact ID = 9847240252
artifact name = bect-stage0-technical-v2-33632094597
artifact size = 1265 bytes
artifact ZIP SHA-256 = ac0b114f40e610b2353c03757a3e69839fcea4674a035a5935e795d82571292f
result file SHA-256 = 8e3cb7631fcbdc3acee486f5b1495987b81624cea65746879824eac7328d25fe
provenance file SHA-256 = 3f533544209763106d83548844505a482ee7dc9184813d79e1d88db195559453
```

Repository mirror was materialized from the downloaded artifact bytes. No technical result recomputation was used for recovery.

## Mandatory technical gates

All passed in v2:

- exact synthetic level arithmetic;
- event grammar fixtures;
- no-change / expansion / compression controls;
- persistence / reversal / recovery / stall controls;
- branch reopening / extinction controls;
- rule-phase-crossing exclusion control;
- deterministic technical trajectory replay;
- adjacent successor binding;
- overlapping-window semantics;
- repeated RAW identity time-index semantics;
- production/independent root reconstruction exactness;
- production/independent LGTGMIV family exactness;
- production/independent BECT level exactness;
- canonical prototype-insensitive scientific equality;
- prototype-sensitive equality negative control;
- property-order invariance;
- implementation separation.

Technical replay:

```text
technical seed = 31500001
scientific use = permanently prohibited
observed trajectory length = 24
measured roots = ply 22 -> ply 23
deterministic core SHA-256 = f446b41b33910071cdef310bedd53e734e19d38dca7083b6efe9504a6bdbe716
```

## Evidence boundary

```text
fresh scientific evidence generated = false
fresh scientific evidence read = false
Stage 1 seed 31510001..31510240 = NOT CONSUMED
Stage 2 seed 31520001..31520384 = NOT CONSUMED
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

## Next transition

Stage 0 PASS authorizes only a separate post-Stage-0 Stage 1 authorization review and fresh-free technical preparation. Stage 1 scientific seed access/execution remains prohibited until its own explicit authorization artifact exists.
