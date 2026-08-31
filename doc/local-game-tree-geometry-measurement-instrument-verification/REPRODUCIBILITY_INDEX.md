# Reproducibility Index — LGTGMIV-STUDY1

## Frozen identity

- Study ID: `LGTGMIV-STUDY1`
- baseline: `a53aabd26f78ac408445aff2d18ace3b21b827d7`
- branch: `research/pre-g3-02-local-game-tree-geometry-measurement-instrument-verification`

## Prospective documents

- `README.md`
- `CURRENT_STATUS.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `DECISION_REGISTER.md`
- `preregistration/STUDY_START_SPEC.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
- `preregistration/STAGE_2_FORMAL_SPEC.json`
- `checkpoints/2026-08-31-study-start-freeze.md`
- `authorizations/2026-08-31-stage-0-technical-authorization.md`

## Planned Stage 0 implementation

Stage 0 tooling will be materialized after this prospective freeze. Production and independent implementations must be distinct files and may not share LGTGMIV canonicalization/metric/hash helpers.

Expected artifact class:

- `results/stage-0/technical-validation.json`
- separate production/independent telemetry if materialized

## Scientific evidence state at Study start

- Stage 1 seeds `31110001..31110128`: reserved, not generated, not read
- Stage 2 seeds `31120001..31120192`: reserved, not generated, not read
- G3-01 Stage 1 block `31010001..31010096`: historical only, prohibited as new scientific population
- protected standard-root exact depth-10 holdout: `SEALED / NOT GENERATED / NOT READ`

## Hash policy

Scientific canonical objects use SHA-256 lowercase hex over UTF-8 canonical JSON without trailing newline. Runtime/resource telemetry is never an input to root/stage scientific digests.

This index must be updated with exact implementation/workflow/result paths and blob/commit hashes as each authorized stage is materialized. Such updates may not alter the frozen scientific contract after fresh evidence begins.
