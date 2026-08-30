# SSGTGE-STUDY1 — Current Status

Updated: 2026-08-31

```text
Program = G2-12 / Research Generation 2
Study ID = SSGTGE-STUDY1
Branch = research/g2-12-state-space-game-tree-growth-estimation
Baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
Study status = COMPLETE / TECHNICAL-INVALID
Formal decision = TECHNICAL-INVALID
Fresh depth 10/11 holdout outcome = NOT GENERATED / NOT READ
Stage 0 v1 = STAGE0-TECHNICAL-INVALID / permanently closed
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID / same-evidence rerun NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Canonical selectedEstimator = null
G2-11 = NOT-AUTHORIZED / unchanged
```

## Scientific identity

Authoritative state identity remains RAW-only:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn,reason` are excluded. Validated transform set remains `[]`; no canonicalization or symmetry reduction is authorized.

## Stage 0

Stage 0 v1 failed before output at a source-binding gate and remains permanently `STAGE0-TECHNICAL-INVALID`.

A separately versioned corrective v2 changed only technical source-binding/orchestration mechanics. It passed production and independent depth-2 technical validation:

```text
v2 source freeze = a699beb6afe7681227d0ecc8328d527ac34ff7f6
authorization = 6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
run = 33323689667
job = 99289968446
artifact = 9735609030
artifact ZIP SHA256 = bdf0dac8359147c5efaa7b3d58c798a4336c78483d95176ea38ab9960bad07d6
Stage 0 v2 = STAGE0-TECHNICAL-PASS
```

## Stage 1

Stage 1 was prospectively frozen and separately authorized:

```text
source freeze = 3d93b6cb228bc314819495e89c1521859bf258b6
authorization = bba6d55b1a22e403976ced5ef05ed5b9d3c99f6e
run = 33324107667
job = 99291109199
artifact = 9735723141
artifact ZIP SHA256 = 7b415b0fad9cadf92568d0b1103b44d9325d8b4c2a729edb40cb1f673e3af09f
```

Production completed the real G2-05 depth 0..9 candidate competition and proposed `E2-LOG-QUADRATIC-D2PLUS`. Mandatory independent verification then failed under the frozen `1e-12` cross-implementation relative tolerance:

```text
prediction mismatch: E2-LOG-QUADRATIC-D2PLUS/newRawStateCount/7
```

Therefore:

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
canonical selectedEstimator = null
production-only E2 proposal = diagnostic only / not authorized for Stage 2
```

The authorization fixed `sameStage1EvidenceRerunAuthorized=false`; no post-outcome verifier repair, tolerance relaxation, or same-evidence rerun is permitted.

## Stage 2 and holdout

No canonical estimator survived Stage 1. Stage 2 was never authorized and no fresh depth 10/11 exact scientific count was generated or read.

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal depth-10 validation = NOT PERFORMED
full Bao state-space/game-tree estimate = NOT AUTHORIZED
```

## Canonical closure records

- `results/STAGE_1_TECHNICAL_INVALID_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`
- `checkpoints/2026-08-31-stage1-technical-invalid.md`
- `STUDY_1_FINAL_REPORT.md`

## Interpretation boundary

G2-05 remains exactly `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`. G2-11 remains `NOT-AUTHORIZED`. A corrected growth-estimator validation requires a new prospective Study or explicit new version; this Study is not reopened or rescued.

Do not merge this branch to `main` without explicit user instruction.
