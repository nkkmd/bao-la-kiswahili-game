# BMP Study 1 — Stage 1 measurement readiness PASS / discovery gate OPEN

Date: 2026-08-22

## Execution identity

```text
studyId = BMP-STUDY1
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
measurement execution HEAD = 1c7fc1f8d979d6952433406e7ab5d0a515a633fb
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
```

The pre-measurement status showed 2048 generated games, manifest present, full verification present, selection audit present, zero measurement files and no discovery result. The source-file SHA-256 map remained identical to the authorization-bound map.

## Measurement result

The frozen measurement phase completed all selected roots:

```text
completedMeasurements = 1200
measuredMoveRecords = 5295
minimumMeasuredMoveRecords = 3600
allSelectedRootsFiniteD3CandidateTables = true
measurementReadinessPassed = true
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
sourceTreeDirty = false
```

All measurement readiness gates passed:

```text
completed measurements = 1200                  PASS
measured move records >= 3600                  PASS (5295)
finite D3 candidate tables for every root      PASS
```

Machine-readable record:

```text
results/STAGE_1_MEASUREMENT_RESULT.json
measurement result commit = 5e916c6676022a50d551310f21cf1d3414b6c27c
```

## Decision

```text
Stage 1 measurement readiness = PASS
candidate discovery gate = OPEN
candidate discovery result = PENDING
confirmatory inference = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
```

The next permitted operation is the frozen automatic Stage 1 candidate discovery procedure. It must use the preregistered matcher/failure grammar, support-equivalence collapse, promotion gates, deterministic ranking and caps without threshold retuning, favorable subset selection, phase relabeling, failed-candidate renaming or manual promotion.

A discovery result, including zero promoted candidates, remains exploratory and does not itself authorize confirmatory, game-theoretic, human-misconception, expert-traditional or pedagogical claims.
