# SSGTGE-STUDY1 — Current Status

Updated: 2026-08-30

```text
Program = G2-12 / Research Generation 2
Study ID = SSGTGE-STUDY1
Branch = research/g2-12-state-space-game-tree-growth-estimation
Baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
Study-start prospective freeze = COMPLETE
Fresh depth 10/11 holdout outcome = NOT GENERATED
Stage 0 v1 = STAGE0-TECHNICAL-INVALID
Stage 0 v1 same-run / same-version rerun = NOT AUTHORIZED
Stage 0 v2 = PROSPECTIVE TECHNICAL CORRECTION / SOURCE FREEZE IN PREPARATION
Stage 1 = NOT YET EXECUTED / NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Formal decision = NOT ESTABLISHED
G2-11 = NOT-AUTHORIZED / unchanged
```

## Frozen scientific identities

```text
Study-start Stage 0 identity = SSGTGE-S0-TECHNICAL-2026-08-30-v1
Corrective technical-entry version = SSGTGE-S0-TECHNICAL-2026-08-30-v2
Stage 1 = SSGTGE-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = SSGTGE-S2-FORMAL-2026-08-30-v1
```

Stage 0 v2 is a technical version only. It does not amend the Study-level scientific estimator, validation, identity, holdout, or resource contract.

Authoritative scientific identity remains RAW-only:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

No canonicalization or symmetry reduction is authorized.

## Stage 0 v1 disposition

Workflow run `33315971968` is permanently classified `STAGE0-TECHNICAL-INVALID` despite the Actions metadata showing `conclusion=success`.

The production process failed before technical output at the authorization source gate:

```text
SOURCE-HASH-BINDING-MISMATCH
path = tools/experiments/verify-ssgtge-stage0-independent.js
production Node exit = 1
production result generated = false
```

The workflow omitted `pipefail`, so `tee` masked the nonzero Node exit status. Independent verification subsequently failed because the production result file did not exist. No depth-2 fixture, real G2-05 candidate evaluation, or fresh depth-10/depth-11 evidence was generated.

Canonical v1 failure record:

- `results/STAGE_0_V1_TECHNICAL_INVALID_RESULT.json`
- `checkpoints/2026-08-30-stage0-v1-technical-invalid.md`

## Stage 0 v2 boundary

A new prospective technical-entry version is permitted because v1 failed before scientific outcome generation. v1 itself will not be rerun or repaired in place.

v2 changes only:

- source binding from manually copied content SHA256 to repository Git blob identity;
- workflow pipelines to `set -euo pipefail`;
- versioned runner/verifier/workflow/spec/authorization paths.

The following remain unchanged: RAW identity, candidate estimator set, development data, backtest cells, thresholds, winner rule, uncertainty rule, depth-10 holdout, depth-11 stress-test, resource ceilings, G2-05 boundary, and G2-11 boundary.

## Immediate next work

1. commit the v1 technical-invalid closure and v2 implementation/source freeze;
2. in a separate commit, explicitly authorize Stage 0 v2 technical execution;
3. accept Stage 0 only if both production and independent v2 technical gates actually pass and their result artifacts are materialized;
4. only after a valid Stage 0 PASS, prepare Stage 1 development source freeze and authorization;
5. Stage 2 remains blocked until a separate machine-readable estimator/source freeze and explicit authorization exist.

## Safety boundary

Do not generate fresh depth 10/11 scientific counts during Stage 0. Do not merge this branch to `main` without explicit user instruction.
