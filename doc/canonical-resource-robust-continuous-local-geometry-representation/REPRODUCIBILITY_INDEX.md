# CRCLGR-STUDY1 — Reproducibility Index

Updated: 2026-09-03

## Canonical protocol and preregistration

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_1_SELECTION_CONTRACT.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`
- `prereg/STAGE_2_SELECTION_CONTRACT.json`

## Authorization records

- `authorizations/STAGE_0_TECHNICAL_AUTHORIZATION.json`
- `authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json`
- `authorizations/STAGE_2_FORMAL_AUTHORIZATION.json`

Scientific trigger files are provenance records only and must not be replayed.

## Stage 0

Actions run: `33761178143`

Canonical result:

- `results/stage-0/STAGE_0_TECHNICAL_RESULT.json`

Disposition: `STAGE0-PASS`.

## Stage 1

Actions run: `33761678941`

Durable Actions artifact:

- artifact ID `9895942440`
- ZIP SHA-256 `b940b79fb4c541111b14756d51de43c069158c46d860e0f2df0fdbe7d48e78eb`

Exact-byte mirror commit:

`8b3c7ca9c3fed220a40297d03a73b4b162708c3b`

Canonical mirrored artifacts:

- `results/stage-1/STAGE_1_CANDIDATE_MANIFEST.json`
- `results/stage-1/STAGE_1_PREFLIGHT_ELIGIBILITY.json`
- `results/stage-1/STAGE_1_MEASURED_POPULATION.json`
- `results/stage-1/STAGE_1_ROOT_MEASUREMENTS_PRODUCTION.json`
- `results/stage-1/STAGE_1_ROOT_MEASUREMENTS_INDEPENDENT.json`
- `results/stage-1/STAGE_1_COORDINATES.json`
- `results/stage-1/STAGE_1_DISTANCE_ROWS.json`
- `results/stage-1/STAGE_1_NEIGHBORHOODS.json`
- `results/stage-1/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json`
- `results/stage-1/STAGE_1_DEVELOPMENT_RESULT.json`

Stage 1 disposition: `STAGE1-PASS`.

Canonical scientific result SHA-256:

`e964970c71b270aaee8857fdd99b5041abcdb2f43ba83b600aa7764b2dda613f`

## Stage 2 formal validation

Actions run: `33763404167`

Durable Actions artifact:

- artifact ID `9896703676`
- ZIP SHA-256 `614f6b7bb487473c92a609e48b3ecee21ba3d23223e28e425078744310b66787`

Exact-byte mirror commit:

`d1083ca07986fdbe3ab78d6bd4c12850e1200ef8`

Canonical mirrored artifacts:

- `results/stage-2/STAGE_2_CANDIDATE_MANIFEST.json`
- `results/stage-2/STAGE_2_PREFLIGHT_ELIGIBILITY.json`
- `results/stage-2/STAGE_2_MEASURED_POPULATION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_PRODUCTION.json`
- `results/stage-2/STAGE_2_ROOT_MEASUREMENTS_INDEPENDENT.json`
- `results/stage-2/STAGE_2_COORDINATES.json`
- `results/stage-2/STAGE_2_DISTANCE_ROWS.json`
- `results/stage-2/STAGE_2_NEIGHBORHOODS.json`
- `results/stage-2/STAGE_2_FORMAL_RESULT.json`

Formal decision:

`FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION`

Canonical Stage 2 scientific result SHA-256:

`c43ba119dbbc91f4145129dc5b24e886b0f436b577185cfb54d5f44619e5b0f5`

## Implementations

Production path:

- `tools/experiments/lib/crclgr-production.js`
- `tools/experiments/lib/crclgr-stage1-production.js`
- corresponding LGTGMIV production implementation

Independent path:

- `tools/experiments/lib/crclgr-independent.js`
- `tools/experiments/lib/crclgr-stage1-independent.js`
- corresponding LGTGMIV independent implementation

Runners / verifiers:

- `tools/experiments/run-crclgr-stage0-technical.js`
- `tools/experiments/verify-crclgr-stage0-authorization.js`
- `tools/experiments/run-crclgr-stage1-development.js`
- `tools/experiments/verify-crclgr-stage1-authorization.js`
- `tools/experiments/run-crclgr-stage2-formal.js`
- `tools/experiments/verify-crclgr-stage2-authorization.js`

## Reproduction boundary

The scientific executions are provenance-complete but are **not authorized for rerun**. Reproducibility means independent verification of frozen artifacts/source bindings and future new prospective studies, not replaying consumed scientific evidence under the same Study/version.

Protected depth-10 remains sealed. Main integration remains not authorized.
