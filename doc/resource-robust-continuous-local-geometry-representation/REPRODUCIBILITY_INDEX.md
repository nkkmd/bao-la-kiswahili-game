# RRCLGR-STUDY1 — Reproducibility Index

Updated: 2026-09-03

## Identity

```text
Study ID = RRCLGR-STUDY1
reviewed main = 0bcd1695b6dbd044acf2eed91740d282c63dbb07
research branch = research/pre-g3-10-resource-robust-continuous-local-geometry
formal status = CLOSED / TECHNICAL-INVALID
representation = RRCLGR-R1-EXACT-SQUASHED-L1
```

## Prospective protocol

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `prereg/STAGE_1_SELECTION_CONTRACT.json`
- `prereg/STAGE_2_FORMAL_SPEC.json`

## Core implementations

Production:

- `tools/experiments/lib/rrclgr-production.js`
- `tools/experiments/lib/rrclgr-stage1-production.js`
- upstream `tools/experiments/lib/lgtgmiv-stage1-production.js`

Independent:

- `tools/experiments/lib/rrclgr-independent.js`
- `tools/experiments/lib/rrclgr-stage1-independent.js`
- upstream `tools/experiments/lib/lgtgmiv-stage1-independent.js`

Stage runners / authorization verifiers:

- `tools/experiments/run-rrclgr-stage0-technical.js`
- `tools/experiments/verify-rrclgr-stage0-authorization.js`
- `tools/experiments/run-rrclgr-stage1-development.js`
- `tools/experiments/verify-rrclgr-stage1-authorization.js`

Actions:

- `.github/workflows/rrclgr-stage0-technical.yml`
- `.github/workflows/rrclgr-stage1-development.yml`

## Stage 0

GitHub Actions run: `33758538923`

Disposition: `STAGE0-PASS`

Canonical repository result:

- `results/stage-0/STAGE_0_TECHNICAL_RESULT.json`
- JSON SHA-256: `82e6d1c15b92e6f8adfc080bbcf77d278a7a3f83f20047c650e0a6fba80b1fe7`
- Git blob: `95b25311915a1befc543c6a58b536511918ff3b8`

Actions result ZIP SHA-256:

`3635e5a9a9d2a882ab7df170fc769c3c8f54a5231ffd6c25b03a7634b5dedfbd`

No fresh Stage 1/2 seed or protected depth-10 access occurred in Stage 0.

## Stage 1 authorization

Authorization artifact:

- `authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json`
- blob at authorization: `6028e460405cdbc313911ea087adaaf53e132bb9`

Tooling commit bound by authorization:

`b2d68a6314019a70d90b00675f33f71411786960`

Authorization commit:

`da0ae19a1ce399c6684b2051a97adfd4f808cd4c`

Single trigger commit:

`00cbdb11c3310ea7a529c320ee03273c80dc8c7f`

## Stage 1 execution

GitHub Actions run: `33759611989`

Execution container result: workflow `success`; all control-plane steps completed, including source binding, durable lease, scientific runner and artifact upload.

Scientific runner disposition:

`STAGE1-TECHNICAL-INVALID`

Result artifact:

- artifact name: `rrclgr-stage1-result-33759611989`
- artifact id: `9894879572`
- ZIP SHA-256: `7b8a44a9e4873731d813e68b51755be39495980588564da8d4a504afad3c9b78`

Canonical JSON:

- `results/stage-1/STAGE_1_DEVELOPMENT_RESULT.json`
- bytes: `523`
- SHA-256: `c9d3d3d3f987a88a90a27f6c0c118e15e584e778ad3234eafb5ab36130dcebd0`
- repository Git blob: `5a1c7949578dae70e1299b849ec4957030c0a85f`

The downloaded artifact bytes and repository mirror were verified by SHA-256 and Git-blob identity. No scientific recomputation was used for mirror creation.

## Technical failure location

`rrclgr-stage1-production.js` and its independent counterpart computed the candidate-core digest through an inherited low-level `digest`. The upstream LGTGMIV implementation exports its raw SHA function as `digest`; that function calls `crypto.update` directly and expects a string. Passing the identity-row array raised the recorded Array type error.

This diagnosis is technical provenance only. It does not authorize a repaired same-evidence run.

## Evidence restrictions

- RRCLGR Stage 1 fresh evidence cannot be reused as successor scientific evidence.
- candidate manifest did not complete.
- no Stage 1 coordinate/distance/neighborhood summary is authorized.
- Stage 2 was never authorized or executed.
- protected depth-10 remained sealed.
- G3-09 scientific values were not valid scientific inputs to RRCLGR.

## Closure records

- `README.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `STUDY_1_FINAL_REPORT.md`
- `../research-program-decisions/2026-09-03-rrclgr-stage1-technical-invalid-closure.md`
- `../research-generation-3/checkpoints/2026-09-03-rrclgr-stage1-technical-invalid-closure.md`
