# SSGTGE-STUDY1 — Current Status

Updated: 2026-08-31

```text
Program = G2-12 / Research Generation 2
Study ID = SSGTGE-STUDY1
Branch = research/g2-12-state-space-game-tree-growth-estimation
Baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
Study-start prospective freeze = COMPLETE
Fresh depth 10/11 holdout outcome = NOT GENERATED
Stage 0 v1 = STAGE0-TECHNICAL-INVALID / permanently closed
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = NOT YET EXECUTED / NOT YET AUTHORIZED
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

Workflow run `33315971968` remains permanently `STAGE0-TECHNICAL-INVALID`. It failed before technical output at the authorization source gate and was not rerun or repaired in place.

Canonical v1 failure record:

- `results/STAGE_0_V1_TECHNICAL_INVALID_RESULT.json`
- `checkpoints/2026-08-30-stage0-v1-technical-invalid.md`

## Stage 0 v2 accepted result

The prospectively versioned v2 technical entry executed once from authorization commit:

```text
implementation/source freeze = a699beb6afe7681227d0ecc8328d527ac34ff7f6
authorization = 6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
run = 33323689667
job = 99289968446
artifact = 9735609030
artifact ZIP SHA256 = bdf0dac8359147c5efaa7b3d58c798a4336c78483d95176ea38ab9960bad07d6
Stage 0 v2 decision = STAGE0-TECHNICAL-PASS
```

Direct job-log inspection confirmed:

- production process exit status 0;
- independent verifier exit status 0;
- `set -euo pipefail` active;
- exact standard-root depth-2 technical fixture completed with 19 cumulative RAW states and 18 depth-labelled edges;
- materialized and full independent depth-2 verification passed;
- synthetic E1/E2/E3 fixtures passed under the frozen cross-implementation tolerance;
- all frozen negative controls were detected;
- real G2-05 candidate evaluation was not performed;
- fresh depth 10/11 outcome was not generated or read.

Canonical records:

- `results/STAGE_0_V2_TECHNICAL_RESULT.json`
- `checkpoints/2026-08-31-stage0-v2-technical-acceptance.md`

## Immediate next work

1. prepare a separate Stage 1 development implementation/spec/source freeze using only immutable G2-05 depth 0..9 summaries;
2. keep the candidate set, rolling origins, `0.15` eligibility gate, winner rule, uncertainty rule, and holdout contract unchanged;
3. authorize Stage 1 only in a separate commit after its source freeze;
4. Stage 1 must either freeze exactly one eligible estimator or close `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`;
5. fresh depth 10/11 generation remains forbidden until a subsequent Stage 2 estimator/source freeze and explicit authorization.

## Safety boundary

Stage 0 PASS is not scientific validation of a growth estimator. Stage 1 may use only pre-existing depth 0..9 development evidence. Do not generate fresh depth 10/11 counts and do not merge this branch to `main` without explicit user instruction.
