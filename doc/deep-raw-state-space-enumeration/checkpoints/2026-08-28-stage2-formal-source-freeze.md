# DRSSE Stage 2 formal source freeze

Date: 2026-08-28
Study: `DRSSE-STUDY1`
Stage: `DRSSE-S2-FORMAL-2026-08-28-v1`
Status: FROZEN BEFORE FORMAL OUTCOME
Baseline main: `c515c36a9b27a796dc7eae13fd1b2cec2b9d3ea6`
Scientific inference: AUTHORIZABLE ONLY BY SEPARATE STAGE 2 AUTHORIZATION

## Readiness inherited without redesign

- Stage 0 accepted decision: `STAGE0-TECHNICAL-PASS`
  - workflow run `33155526103`
  - job `98797262242`
  - artifact `9679427896`
  - artifact ZIP SHA256 `7cd8dbb4e61acf113c0085b79bd298a7588994447750e0f7d4d8201e51c638c4`
- Stage 1 accepted decision: `STAGE1-DEVELOPMENT-PASS`
  - workflow run `33155886879`
  - job `98798433942`
  - artifact `9679565765`
  - artifact ZIP SHA256 `47f83b614876a988495c8a68f8d63dda9bf9de105b967398178e6b4bc4fade04`

Stage 1 rows, roots, state counts, transposition observations, and artifacts are not formal Stage 2 inputs.

## Frozen formal domain

- root: fresh `public/engine.js` `initialState()`
- required RAW key: `2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6`
- target depth: 9
- exact reachable layers required: 0 through 9
- complete parent expansion layers required: 0 through 8
- RAW-only identity: `pits,reserve,houseOwned,player,phase,winner,pending`
- `turn` and `reason` excluded
- missing `pending` invalid
- validated transform set: `[]`
- symmetry reduction/canonicalization/quotient counting: prohibited

## Frozen source Git blobs

```text
doc/deep-raw-state-space-enumeration/preregistration/STAGE_2_FORMAL_SPEC.json = 705628a3cdfcc2899e3ae53f0fa17d614cb227e9
tools/experiments/lib/drsse-production.js = e8fc23799415f566850c817c22cf658216bb98be
tools/experiments/lib/drsse-independent.js = 906e0412bcf47fe37d95ac29ad83f9c83bc52857
tools/experiments/run-drsse-stage2-formal.js = 18b2f539e1062a703dd511379e8c3889eaec3866
tools/experiments/verify-drsse-stage2-independent.js = 7c0189ce468a697e0283cae57bb5959a9d5e3870
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
.github/workflows/drsse-stage2-formal.yml = facd279003bbb7d85c9156a54696d59266c1ca91
```

## Decision firewall

No formal outcome may be rescued by changing root, target depth, resource ceilings, RAW identity, move identity, endpoint, decision rule, transform authorization, or formal namespace. A complete exact result requires successful production integrity, materialized artifact verification, and full independent depth-9 re-enumeration agreement. Resource/admin incomplete output cannot be converted into an estimate.
