# SFCDF-STUDY1 — Stage 2 formal PASS / Study closure

Date: 2026-09-02

## Formal Stage 2 disposition

**`STAGE2-PASS`**

The single authorized Stage 2 formal execution completed successfully.

```text
workflow run = 33624399706
execution trigger commit = 40fd586e3bc3bf77fa2fc5303cc11fcf99655946
lease commit = 325366baedcd437f45991e2941bc38fc2e04bd1f
result mirror commit = e850dca8236745cb611cf2e0f60ed9113b6ed4a8
authorized scientific executions = 1
actual scientific executions = 1
selected pairs = 18
selected roots = 36
Stage 2 seed = 31420001..31420288 / CONSUMED
no-rescue = ACTIVE
protected depth-10 access = false
```

Durable canonical artifact:

```text
artifact ID = 9844368476
artifact name = sfcdf-stage2-formal-result-33624399706
artifact size = 15299 bytes
artifact ZIP SHA-256 = c4d10eb07eec6ed75510f344f5c06d13deabeb03210023cd541035f05bd5da0f
```

Canonical repository result:

```text
results/stage-2/scientific-result.json blob = 099c45134e2816aac7bafdd5aab5ade03903c64a
results/stage-2/execution-summary.json blob = d2e4db04a5f2b35cc3da573fd9ab82ec6131f03a
production Stage scientific core SHA-256 = e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039
independent Stage scientific core SHA-256 = e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039
```

## Formal candidate decisions

### SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION

**`CONFIRMED`** / frozen direction `MTAJI-GREATER`

```text
comparable = 18/18
Mtaji > Namua = 18
Namua > Mtaji = 0
ties = 0
nonzero = 18
coverage gate = PASS
nonzero gate = PASS
direction gate = PASS
exact two-sided sign-test p = 1 / 131072
Holm rank = 1
Holm threshold = 1 / 40
Holm gate = PASS
```

### SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO

**`CONFIRMED`** / frozen direction `NAMUA-GREATER`

```text
comparable = 18/18
Mtaji > Namua = 0
Namua > Mtaji = 18
ties = 0
nonzero = 18
coverage gate = PASS
nonzero gate = PASS
direction gate = PASS
exact two-sided sign-test p = 1 / 131072
Holm rank = 2
Holm threshold = 1 / 20
Holm gate = PASS
```

C2–C5 were not Stage 1 promoted candidates and were not tested in Stage 2.

## Study closure

```text
Study = SFCDF-STUDY1
Program position = Research Generation 3 / G3-04
Study status = CLOSED / FORMAL-COMPLETE
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-PASS
Stage 2 = STAGE2-PASS
Formal candidate C1 = CONFIRMED / MTAJI-GREATER
Formal candidate C6 = CONFIRMED / NAMUA-GREATER
```

`CLOSED / FORMAL-COMPLETE` is a repository lifecycle status. The preregistered inferential labels are the candidate-level `CONFIRMED` / `NOT-CONFIRMED` labels above; no additional unpreregistered omnibus scientific decision label is introduced.

## Interpretation boundary

The confirmed findings are limited to the prospectively defined bounded RAW local descriptors at relative depth 5 in the frozen paired Namua/Mtaji populations.

They do **not** establish:

- game-theoretic or tactical forcing,
- optimal-move inevitability,
- best-move clarity,
- search stability or search ease,
- strategic simplicity,
- human difficulty/ease,
- position value or win probability,
- causal phase effects,
- validity beyond the frozen depth-5 local geometry.

The standard initial RAW-root complete exact depth-10 holdout remains **`SEALED / NOT GENERATED / NOT READ`**.
