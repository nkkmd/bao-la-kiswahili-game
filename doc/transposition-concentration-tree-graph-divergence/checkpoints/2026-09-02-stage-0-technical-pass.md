# TCTGD-STUDY1 — Stage 0 technical PASS

Date: 2026-09-02

## Formal Stage 0 disposition

`TCTGD-S0-TECHNICAL-2026-09-02-v1 = STAGE0-PASS`

GitHub Actions run:

- run: `33589334375`
- job: `100119933850`
- trigger commit: `0c0a707bfa0baa64815dac0b826d2720e247ff52`
- conclusion: `success`

Durable artifact:

- artifact ID: `9831182022`
- name: `tctgd-stage0-technical-result`
- ZIP SHA-256: `efa3669c06a20b793d3f8feff80f71535fb582c0d1165fed38cf4dc0c3f78924`

Deterministic Stage 0 scientific-core hash:

`e7e7831cf9503c94441a5dc9b30253485dc4b498e9b397408901186c914765d5`

## Mandatory gates

All passed:

- synthetic no-transposition control
- same-parent / different-move duplicate control
- distinct-parent multi-parent control
- duplicate / multi-parent semantic separation
- first reconvergence semantics
- root-branch overlap semantics
- traversal/order invariance
- production / independent exact agreement
- development-promotion boundary agreement
- exact sign-test boundary agreement
- exact Holm boundary agreement
- static implementation independence

The technical core explicitly records:

```text
freshScientificSeedAccess = false
protectedDepth10Access = false
```

## Scientific evidence state

```text
Stage 1 seed 31310001..31310192 = NOT CONSUMED
Stage 2 seed 31320001..31320288 = NOT CONSUMED
fresh G3-03 scientific evidence generated = false
fresh G3-03 scientific evidence read = false
protected standard-root depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

## Progression boundary

Stage 0 PASS does **not** authorize Stage 1.

Before any Stage 1 authorization, the scientific workflow/runner must be materialized and a non-scientific execution-integrity smoke must demonstrate at minimum:

- Stage 1 workflow has no `push` scientific trigger;
- workflow arming and scientific computation are separated;
- durable pre-computation execution lease precedes any fresh seed/root generation;
- duplicate queue exits before scientific computation;
- result artifact upload precedes repository mirror push;
- remote branch advancement fails closed;
- exactly-one-execution authorization can be audited;
- protected depth-10 holdout remains sealed.

Only after that smoke and a separate Stage 1 authorization review may fresh development evidence be generated/read.
