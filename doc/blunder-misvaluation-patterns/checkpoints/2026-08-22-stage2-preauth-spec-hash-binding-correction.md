# 2026-08-22 — Stage 2 pre-authorization spec-hash binding correction

## Scope

This checkpoint records a **technical pre-authorization hash-binding correction** for Blunder / Misvaluation Patterns Study 1 Stage 2.

No Stage 2 scientific corpus had been generated. No Stage 2 scientific outcome existed. Scientific generation remained unauthorized throughout.

## Trigger

At local HEAD:

```text
5d3b53ac9c205df396d4213762623add4429cd66
```

running:

```bash
node tools/experiments/validate-blunder-misvaluation-stage2-formal-spec.js
```

failed at the file-identity assertion because the validator contained an incorrect expected SHA-256 string for the already-frozen `STAGE_2_FORMAL_SPEC.json`.

The actual SHA-256 computed from the local file was:

```text
4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
```

The stale/incorrect expected string was:

```text
097aa6450f270254ec6dee2a7fd7e74a2d8298cae36923a39e822b2137172730
```

## Scientific-semantics audit

The final change to the Stage 2 spec before this validation attempt was commit:

```text
25fbacf9b79ace7325b29f295bdffa096f079b2f
research: require independent Stage 2 measurement verification
```

That commit added only the already-intended verification-firewall requirements:

```text
executionOrder += independent-formal-measurement-verify
evaluationBlockedUntilIndependentMeasurementVerificationPass = true
```

No population, candidate, endpoint, threshold, estimability gate, multiplicity rule, seed range, decision rule, no-rescue rule, or interpretation boundary was changed by the hash correction.

## Correction

The following live records were synchronized to the actual frozen spec SHA-256:

```text
tools/experiments/validate-blunder-misvaluation-stage2-formal-spec.js
test/blunder-misvaluation-stage2-contract.test.js
doc/blunder-misvaluation-patterns/STAGE_2_FORMAL_PROTOCOL.md
doc/blunder-misvaluation-patterns/STAGE_2_EXECUTION_RUNBOOK.md
doc/blunder-misvaluation-patterns/CURRENT_STATUS.md
doc/blunder-misvaluation-patterns/preregistration/README.md
```

The machine-readable scientific spec itself was **not edited** as part of this correction.

## Correct Stage 2 identities

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
```

## Authorization state

```text
Stage 2 scientific generation = NOT AUTHORIZED
STAGE_2_FORMAL_AUTHORIZATION.json = NOT CREATED
scientific Stage 2 artifacts = NONE expected
```

Local technical validation must be rerun from the corrected branch HEAD before any source-file SHA freeze or authorization is created.

Status: **TECHNICAL CORRECTION RECORDED / REVALIDATION REQUIRED**
