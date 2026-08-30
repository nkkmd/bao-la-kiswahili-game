# G2-12 Stage 0 v1 technical-invalid closure

Date: 2026-08-30  
Study: `SSGTGE-STUDY1`  
Stage: `SSGTGE-S0-TECHNICAL-2026-08-30-v1`  
Disposition: **`STAGE0-TECHNICAL-INVALID`**

## Accepted interpretation

GitHub Actions run `33315971968` is **not** accepted as a Stage 0 PASS even though the Actions run metadata reports `conclusion=success`.

The job log establishes that the production Node process terminated with exit status 1 at the pre-output authorization/source-binding gate:

```text
Error: source SHA256 mismatch: tools/experiments/verify-ssgtge-stage0-independent.js
```

No production result was written. The following independent step therefore also terminated with exit status 1 because `stage0-production-result.json` did not exist.

The workflow shell used `/usr/bin/time ... | tee ...` without `set -o pipefail`. Bash consequently returned `tee`'s success status for the failing calculation steps, allowing artifact upload and the overall Actions job to appear successful. That orchestration defect does not override the explicit technical gate failures in the logs.

## Evidence consumption

The failure occurred before any technical fixture output relevant to Stage 0 acceptance was generated.

```text
depth-2 enumeration fixture generated = false
real G2-05 candidate evaluation performed = false
fresh depth 10 generated/read = false
fresh depth 11 generated/read = false
Stage 1 scientific evidence consumed = false
Stage 2 scientific evidence consumed = false
scientific inference authorized = false
```

The uploaded artifact contains failure logs only and is retained as provenance:

```text
run = 33315971968
job = 99269373670
artifact = 9733443553
artifact ZIP SHA256 = df9bb95a22bec49141bd45ac7baf0c6829f668e2c764b3b4668103ada208d7ac
```

## Failure classification

```text
primary = SOURCE-HASH-BINDING-MISMATCH
secondary = PIPELINE-EXIT-CODE-MASKED-BY-TEE-WITHOUT-PIPEFAIL
Stage 0 v1 = STAGE0-TECHNICAL-INVALID
```

This is an instrumentation/provenance failure, not scientific evidence about Bao growth and not evidence for or against any estimator family.

## No same-v1 rerun

The v1 authorization fixed `sameStage0EvidenceRerunAuthorized=false`. Run `33315971968` will therefore not be rerun and v1 will not be repaired in place.

Repository Research Generation 2 precedent permits a genuine implementation defect found before scientific outcome to be corrected through explicit revoke/refreeze/reauthorize provenance. Because v1 generated no scientific outcome and did not evaluate the real development estimator competition, a new prospective Stage 0 technical-entry version may be created if it changes only technical source-binding/orchestration mechanics.

Any corrective v2 must leave unchanged:

```text
Study ID
RAW identity
validated transform set
estimator candidate set
rolling-origin development cells
candidate eligibility threshold
winner-selection rule
uncertainty rule
formal depth-10 endpoint
formal threshold
holdout depth
resource ceilings
G2-05 boundary
G2-11 boundary
```

Stage 1 and Stage 2 remain unauthorized.
