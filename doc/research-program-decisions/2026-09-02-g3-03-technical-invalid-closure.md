# Research Generation 3 — G3-03 formal closure decision

Date: 2026-09-02 (Asia/Tokyo)

## Decision

**`G3-03 / TCTGD-STUDY1 = CLOSED / TECHNICAL-INVALID`**

Stage disposition:

```text
Stage 0 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal promoted candidate set = []
```

## Basis

TCTGD-STUDY1 executed its prospectively frozen Stage 1 development population exactly once under separate authorization.

The single authorized run was GitHub Actions run `33592380079`. It selected all 12 required paired trajectories (24 roots), remained within resource ceilings, and preserved exact source identity, static implementation independence, paired-comparison equality and development-summary equality.

Production and independent canonical Stage 1 scientific-core SHA-256 values were identical:

`d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f`

However, the frozen mandatory in-memory exact-agreement gate failed. Production stored the endpoint map in an ordinary JavaScript object; the independent implementation stored the corresponding endpoint map in an `Object.create(null)` object. The frozen runner used Node.js `util.isDeepStrictEqual`, which is prototype-sensitive. Thus endpoint values and canonical serialization could agree exactly while `endpointExact` failed.

This produced:

```text
allRootExact = false
stageScientificExact = false
stageDisposition = TECHNICAL-INVALID
```

The defect was discovered after Stage 1 fresh evidence had been generated. Under the frozen no-rescue rule, the Study cannot be repaired by changing endpoint-map prototypes, replacing the equality rule, or rerunning the consumed Stage 1 seed block.

## Diagnostic but non-formal observations

The technical-invalid execution recorded promotion-like directions for C1–C4:

- C1 cumulative tree/RAW ratio: `NAMUA-GREATER`
- C2 duplicate/unique-transition fraction: `NAMUA-GREATER`
- C3 layer-sum multi-parent fraction: `NAMUA-GREATER`
- C4 reconvergence-onset score: `MTAJI-GREATER`

These are diagnostic provenance only and do not enter the formal promoted candidate set.

## Evidence integrity

```text
Stage 1 authorized scientific executions = 1
Stage 1 actual scientific executions = 1
Stage 1 seed 31310001..31310192 = CONSUMED
Stage 2 seed 31320001..31320288 = NOT CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

The Stage 1 canonical result was uploaded before repository mirror as durable Actions artifact `9832258829`, ZIP SHA-256 `cb03924420df2b280398f5493283dc47fae01bb4e22afdd18560d42b5bf1139b`, then mirrored at commit `ce94af693386699a5b0cc6292d3ac817af034f19`.

No result reconstruction rerun is needed or authorized.

## Protected evidence

The standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

## Consequence for later Research Generation 3 studies

This closure does not authorize G3-04 or any later Study. The next Study requires a separate current-state program review and a new prospective freeze.

The technical lesson that prototype-sensitive runtime equality should not define scientific identity may inform a future independent Study's prospective design, but it cannot be retroactively applied to TCTGD-STUDY1.
