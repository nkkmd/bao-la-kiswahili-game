# CRCLGR-STUDY1 — Post-Stage-1 Stage 2 Authorization Review

Date: 2026-09-03

## Reviewed state

- Study: `CRCLGR-STUDY1`
- Stage 0: `CRCLGR-S0-TECHNICAL-2026-09-03-v1` = `STAGE0-PASS`
- Stage 1: `CRCLGR-S1-DEVELOPMENT-2026-09-03-v1` = `STAGE1-PASS`
- Stage 1 authorized scientific executions = 1
- Stage 1 actual scientific executions = 1
- Stage 1 Actions run = `33761678941`
- Stage 1 trigger commit = `83a597c0a6ec590aca83075df4389fa8a2e0bdce`
- Stage 1 canonical artifact ID = `9895942440`
- Stage 1 artifact ZIP SHA-256 = `b940b79fb4c541111b14756d51de43c069158c46d860e0f2df0fdbe7d48e78eb`
- Stage 1 exact-byte repository mirror commit = `8b3c7ca9c3fed220a40297d03a73b4b162708c3b`
- Stage 1 fresh seed block `32110001..32110256` = consumed / no rerun
- Stage 2 fresh seed block `32120001..32120384` = not consumed at review
- protected depth-10 = `SEALED / NOT GENERATED / NOT READ / NOT PEEKED`

## Stage 1 prerequisite review

The frozen Stage 1 gates all passed:

- candidate manifest = 64/64 complete;
- canonical candidate digest production/independent exact;
- preflight complete;
- resource-eligible support = Namua 31/32, Mtaji 32/32, exceeding the frozen 28/32 minimum in both phases;
- measured population = 24 Namua + 24 Mtaji;
- all six axes defined;
- production/independent reconstruction, raw primitives, axes and coordinates exact for 48/48 roots;
- exact pairwise L1 matrix agreement;
- exact k=3 tie-inclusive neighborhood agreement;
- root-order invariance passed;
- distinct coordinate vectors = Namua 24, Mtaji 23, exceeding the frozen minimum 8 in each phase;
- all six axes, therefore at least the required four, had at least four distinct exact values in each phase.

Canonical Stage 1 scientific result SHA-256:

`e964970c71b270aaee8857fdd99b5041abcdb2f43ba83b600aa7764b2dda613f`

The complete Stage 1 candidate identities were separately materialized with `scientificOutcomeFieldsRetained=false` for Stage 2 exclusion. Stage 2 does not need to load Stage 1 coordinates, distances or favorable directions for population selection.

## Independence and no-rescue review

Stage 2 remains prospectively fixed by the original CRCLGR protocol and `STAGE_2_FORMAL_SPEC.json`. The Stage 1 result is used only for the preregistered gate that a valid development pass must precede formal validation and for identity exclusion. It does not alter the Stage 2 representation, axes, scaling, weights, distance, neighborhood rule, seed namespace, population size, preflight ceilings, formal endpoints or decision rule.

No G3-04/G3-07 outcome is used to select a Stage 2 feature, direction, threshold or population. G3-08/G3-09/RRCLGR scientific measurements remain prohibited inputs. G3-09 identity-only manifests may remain in the upstream identity firewall.

Stage 1 fresh evidence will not be rerun or extended. Stage 2 failure after first Stage 2 fresh access must fail closed.

## Stage 2 frozen boundary

`CRCLGR-S2-FORMAL-2026-09-03-v1` remains:

- fresh seeds `32120001..32120384`;
- candidate target 48 Namua + 48 Mtaji;
- minimum resource-eligible support 42/48 in each phase;
- measured population 36 Namua + 36 Mtaji selected from a fully frozen preflight manifest before coordinate generation;
- exact RAW relative depth 5;
- representation `CRCLGR-R1-EXACT-SQUASHED-L1`;
- six prospectively fixed exact axes;
- equal-weight exact L1;
- k=3 exact tie-inclusive neighborhoods;
- production/independent exact verification;
- no root replacement, seed extension or same-evidence rerun after fresh access.

## Formal decision

**`CRCLGR-STAGE2-AUTHORIZED`**

Exactly one source-bound Stage 2 formal scientific execution may be authorized after Stage 2 tooling, selection contract, workflow and source bindings are frozen.

This decision does **not** authorize G3-10. A valid Stage 2 formal decision and a separate post-prerequisite G3-10 authorization review remain required.

```text
Stage 2 scientific execution = AUTHORIZED subject to exact source binding / exactly-one execution / durable lease / artifact-before-mirror
G3-10 scientific execution = NOT AUTHORIZED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```
