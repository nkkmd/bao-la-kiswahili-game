# Research Generation 3 checkpoint — G3-03 technical-invalid closure

Date: 2026-09-02 (Asia/Tokyo)

## Program state

```text
Research Generation 2 = CLOSED
Research Generation 3 = ACTIVE
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-03 = TCTGD-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-03 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-03 formal promoted candidate set = []
Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## G3-03 closure event

TCTGD-STUDY1 was prospectively frozen for RAW-only relative depth-5 local game-tree / graph geometry. Stage 0 passed synthetic technical controls. Before fresh scientific execution, a non-scientific tooling review detected that the original branch-only `workflow_dispatch` control plane could not be dispatched through GitHub REST. The original prospective spec was retained, and a technical-execution-only v2 refreeze changed only the execution control plane and upstream identity firewall; no seed, endpoint, population, horizon, threshold, formal test, resource ceiling, or scientific claim boundary was changed.

Stage 1 was then separately authorized for exactly one execution using seed block `31310001..31310192`, targeting 12 Namua + 12 Mtaji roots.

Authorized GitHub Actions run `33592380079` established a durable pre-computation lease, generated fresh Stage 1 evidence once, uploaded the exact canonical output bytes as durable artifact `9832258829`, and mirrored those exact bytes to the research branch at commit `ce94af693386699a5b0cc6292d3ac817af034f19`.

The frozen runner returned:

```text
stageDisposition = TECHNICAL-INVALID
selectedPairCount = 12
selectedRootCount = 24
populationComplete = true
stageResourcePass = true
sourceIdentityExact = true
staticIndependence = true
pairComparisonExact = true
developmentExact = true
allRootExact = false
stageScientificExact = false
```

Production / independent canonical Stage 1 scientific-core SHA-256 values were nevertheless identical:

`d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f`

## Technical defect

The production endpoint implementation stores the endpoint map in an ordinary JavaScript object. The independent endpoint implementation stores the same endpoint key/value structure in an `Object.create(null)` object.

The frozen runner uses Node.js `util.isDeepStrictEqual` for root-level and stage-level in-memory object equality. That equality is prototype-sensitive. Consequently the endpoint values and canonical serialization can agree exactly while the in-memory deep equality fails solely because the object prototypes differ.

This caused `endpointExact=false` at root level, which made the mandatory `allRootExact` and `stageScientificExact` gates fail.

The defect was discovered only after fresh scientific evidence had been generated and the Stage 1 no-rescue boundary was active. Therefore no implementation correction, same-seed rerun, or post hoc verification-rule substitution is permitted.

## Diagnostic candidate provenance

The technical-invalid run diagnostically produced promotion-like directions for:

- `TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO` — `NAMUA-GREATER`
- `TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION` — `NAMUA-GREATER`
- `TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION` — `NAMUA-GREATER`
- `TCTGD-C4-RECONVERGENCE-ONSET-SCORE` — `MTAJI-GREATER`

These are not formal promoted candidates. Formal promoted candidate set remains `[]`.

## Immutable evidence boundaries

- Stage 1 seed `31310001..31310192` is consumed.
- Stage 1 same-evidence rerun is prohibited.
- Stage 2 seed `31320001..31320288` remains unconsumed.
- Stage 2 remains `NOT-AUTHORIZED-NOT-EXECUTED`.
- standard initial RAW-root complete exact depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.
- G3-01, LGTGMIV, and G3-02 formal decisions are unchanged.
- RAW-only identity and validated transform set `[]` remain authoritative.
- historical prospective protocol/spec records are retained and are not rewritten to make the result pass.

## Formal closure

```text
TCTGD-STUDY1 = CLOSED / TECHNICAL-INVALID
Stage 1 = TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Next scientific decision point

G3-04 or any later study is not automatically authorized by this closure. A separate current-state program review is required before the next independent scientific study is defined or fresh evidence is generated.
