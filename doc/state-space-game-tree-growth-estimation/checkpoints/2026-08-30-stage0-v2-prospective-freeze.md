# G2-12 Stage 0 v2 prospective technical-entry freeze

Date: 2026-08-30  
Study: `SSGTGE-STUDY1`  
New technical version: `SSGTGE-S0-TECHNICAL-2026-08-30-v2`  
Corrective predecessor: `SSGTGE-S0-TECHNICAL-2026-08-30-v1 = STAGE0-TECHNICAL-INVALID`  
Status: **FROZEN BEFORE ANY v2 TECHNICAL OUTPUT**

## Why v2 is permitted

v1 failed at its pre-output source-binding gate. No depth-2 fixture, real-data estimator comparison, Stage 1 evidence, or fresh depth-10/depth-11 outcome was generated.

The v1 run is not rerun and is not repaired in place. v2 is a new prospective technical-entry version with separate source freeze and separate authorization.

This follows the Research Generation 2 technical-correction boundary: a genuine implementation defect discovered before scientific outcome may be corrected only with explicit versioning, refreeze, and reauthorization provenance.

## Changes from v1

Only technical orchestration / source-binding mechanics change:

1. authorization source identity is checked with repository Git blob identity (`git hash-object`) rather than manually copied content SHA256 values;
2. workflow calculation pipelines run under `set -euo pipefail`, so a failing Node process cannot be masked by `tee`;
3. v2 uses new runner, verifier, workflow, spec, result names, and authorization path.

The G2-12 scientific contract is unchanged.

## Explicitly unchanged

```text
Study ID = SSGTGE-STUDY1
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded identity = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
candidate estimators = E1 / E2 / E3 exactly as Study-start freeze
rolling development origins = 5->6, 6->7, 7->8, 8->9
candidate eligibility max abs log error = 0.15
winner rule = min worst error, then min mean error, then E1/E2/E3 order
mandatory fresh holdout = depth 10
secondary stress depth = 11
formal joint max abs log error = 0.20
uncertainty rule = unchanged
formal resource ceilings = unchanged
G2-05 immutable boundary = unchanged
G2-11 = NOT-AUTHORIZED / unchanged
```

## Stage 0 v2 evidence boundary

v2 remains technical-only:

```text
maximum real enumeration depth = 2
G2-05 depth 0..9 = read-only plumbing fixture
real G2-05 candidate ranking = forbidden
fresh depth 10/11 = forbidden
scientific inference = false
```

Estimator family calculations are tested only on synthetic series. Production and independent implementations remain separately coded.

## Frozen source identities

Machine-readable source freeze:

`results/STAGE_0_V2_SOURCE_HASHES.json`

The v2 execution runner checks each frozen source with its Git blob identity before any technical fixture is generated.

## Authorization boundary

This freeze commit itself does not execute v2. A separate commit must add:

`authorizations/STAGE_0_V2_TECHNICAL_EXECUTE.json`

and must bind this exact freeze commit as its immediate parent. Stage 1 and Stage 2 remain unauthorized regardless of the v2 outcome.
