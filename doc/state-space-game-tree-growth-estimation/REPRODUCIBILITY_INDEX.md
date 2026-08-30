# SSGTGE-STUDY1 — Reproducibility Index

## Canonical identity

```text
Program = G2-12 / Research Generation 2
Study ID = SSGTGE-STUDY1
Baseline main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
Branch = research/g2-12-state-space-game-tree-growth-estimation
```

## Prospective authorities

- `preregistration/STUDY_START_FREEZE.md` — human-readable scientific contract frozen before fresh holdout outcome generation.
- `preregistration/STUDY_START_SPEC.json` — machine-readable equivalent.
- `authorizations/STAGE_0_TECHNICAL_AUTHORIZATION.json` — initial technical-only authorization boundary; explicitly excludes fresh depth 10/11 scientific generation.
- `checkpoints/2026-08-30-study-start-freeze.md` — startup checkpoint.

## Upstream immutable evidence

Primary development anchor:

- `../deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json`
- `../deep-raw-state-space-enumeration/STUDY_1_PROTOCOL.md`
- `../deep-raw-state-space-enumeration/STUDY_1_OVERVIEW.md`

Expected immutable G2-05 values:

```text
formalDecision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
rootRawStateKey = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
lastCompleteDepth = 9
cumulativeRawStates = 102857
treeNodeOccurrencesThrough9 = 136645
```

G1 `SSGTC-STUDY1` may be used only as a consistency/reference fixture, not as independent formal validation evidence.

## Stage 0 v1 — permanently technical-invalid

```text
Stage ID = SSGTGE-S0-TECHNICAL-2026-08-30-v1
implementation freeze commit = 00b89802c9d40313cc0309bc36f59eecc53899b2
authorization commit = 76afec9b0ba3d1c5ef84cb42bc3d205360da9b97
workflow run = 33315971968
job = 99269373670
artifact = 9733443553
artifact ZIP SHA256 = df9bb95a22bec49141bd45ac7baf0c6829f668e2c764b3b4668103ada208d7ac
Stage disposition = STAGE0-TECHNICAL-INVALID
```

Primary failure:

```text
SOURCE-HASH-BINDING-MISMATCH
path = tools/experiments/verify-ssgtge-stage0-independent.js
```

Secondary workflow defect:

```text
PIPELINE-EXIT-CODE-MASKED-BY-TEE-WITHOUT-PIPEFAIL
```

The Actions API reported `success`, but the accepted technical disposition follows the job logs: production Node exited 1 before output and independent verification subsequently exited 1 because the production result file did not exist.

Canonical failure records:

- `results/STAGE_0_V1_TECHNICAL_INVALID_RESULT.json`
- `checkpoints/2026-08-30-stage0-v1-technical-invalid.md`

Evidence state:

```text
depth-2 technical result generated = false
real G2-05 candidate evaluation performed = false
fresh depth 10/11 generated/read = false
scientific evidence generated = false
same v1 rerun authorized = false
```

## Stage 0 v2 — prospective technical correction

A separate technical-entry version is frozen before any v2 output:

```text
Stage ID = SSGTGE-S0-TECHNICAL-2026-08-30-v2
corrective predecessor = v1 technical-invalid
scientific contract changed = false
```

Primary v2 files:

- `preregistration/STAGE_0_V2_TECHNICAL_SPEC.json`
- `results/STAGE_0_V2_SOURCE_HASHES.json`
- `checkpoints/2026-08-30-stage0-v2-prospective-freeze.md`
- `tools/experiments/lib/ssgtge-production.js`
- `tools/experiments/lib/ssgtge-independent.js`
- `tools/experiments/run-ssgtge-stage0-v2-technical.js`
- `tools/experiments/verify-ssgtge-stage0-v2-independent.js`
- `.github/workflows/ssgtge-stage0-v2-technical.yml`

The v2 source gate binds repository Git blob identities, not manually copied content SHA256 values. The workflow uses `set -euo pipefail` for calculation pipelines.

v2 retains the Stage 0 evidence firewall:

```text
maximum technical enumeration depth = 2
G2-05 depth 0..9 read = plumbing only
real candidate ranking = forbidden
fresh depth 10/11 = forbidden
scientific inference = false
```

A separate `authorizations/STAGE_0_V2_TECHNICAL_EXECUTE.json` commit is required before v2 execution.

## Planned Stage 1 reproducibility

Stage 1 will materialize only after a valid Stage 0 PASS:

- exact development input summary/hash;
- all candidate rolling-origin predictions;
- all 8-cell error vectors per candidate;
- eligibility flags;
- deterministic winner selection;
- selected estimator parameters;
- `q`, `R1`, `R2`;
- frozen depth 10/11 point predictions and envelopes;
- production and independent recomputation hashes.

## Planned Stage 2 reproducibility

Before formal authorization, Stage 2 must bind exact source/blob hashes and the complete Stage 1 frozen estimator artifact.

Formal execution must preserve:

- fresh enumeration layer summaries;
- materialized state/edge hashes or deterministic equivalent audit hashes;
- production result core;
- independent full recomputation core;
- resource usage and stop classification;
- frozen estimator application;
- formal endpoint metrics;
- final decision mapping;
- workflow/artifact provenance where applicable.

No formal scientific decision is valid without mandatory independent verification.
