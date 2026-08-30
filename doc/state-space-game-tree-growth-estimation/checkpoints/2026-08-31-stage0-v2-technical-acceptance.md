# G2-12 Stage 0 v2 technical acceptance

Date: 2026-08-31  
Study: `SSGTGE-STUDY1`  
Stage: `SSGTGE-S0-TECHNICAL-2026-08-30-v2`  
Decision: **`STAGE0-TECHNICAL-PASS`**

## Accepted execution

```text
implementation/source freeze commit = a699beb6afe7681227d0ecc8328d527ac34ff7f6
execution authorization commit = 6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
workflow run = 33323689667
job = 99289968446
artifact = 9735609030
artifact name = ssgtge-stage0-v2-technical-6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
artifact size = 13991 bytes
artifact ZIP SHA256 = bdf0dac8359147c5efaa7b3d58c798a4336c78483d95176ea38ab9960bad07d6
```

Actions run `33323689667` completed with `conclusion=success`. Unlike v1, acceptance does not rely on this metadata alone: the direct job log was inspected and both scientific-logic processes ended with explicit exit status 0 under `set -euo pipefail`.

## Production technical result

```text
SSGTGE_STAGE0_V2_PRODUCTION passed = true
productionCoreSha256 = 6cc54143124c80e3cc4e2f4653b13840706a112ef6dfbcad5a81cba973848426
process exit status = 0
elapsed = 0.65 s
maximum RSS = 56872 KiB
```

The standard-root technical enumeration completed exactly through depth 2:

```text
cumulative RAW states = 19
depth-labelled legal edges = 18
cumulative tree node occurrences = 19
RAW-state-set SHA256 = 0a942b654f00265542c82b87f5dc53d685e96f3c0ef69a61fc574f90c6990a1f
```

G2-05 was read only through depth 9 for source/schema plumbing. `candidateEvaluationPerformed=false` and `freshHoldoutRead=false` were materialized in the production result.

## Independent verification

```text
SSGTGE_STAGE0_V2_INDEPENDENT passed = true
resultCoreSha256 = f7bbd991ad61befc24d8164b90ae1e8fd8c254454a2fe96469013e1d1c898b5a
process exit status = 0
elapsed = 0.04 s
maximum RSS = 55132 KiB
materialized depth-2 verification = pass
full independent depth-2 recomputation = pass
```

The independent path reports:

```text
importsProductionGrowthEstimator = false
importsProductionGrowthSerializer = false
```

All frozen negative controls were detected:

```text
missingDepth = true
nonPositiveCount = true
transformLeakage = true
depthGap = true
numericMismatch = true
```

## Canonical result identity

Repository result copied verbatim from the accepted workflow artifact:

- `results/STAGE_0_V2_TECHNICAL_RESULT.json`

Artifact-file SHA256:

```text
STAGE_0_V2_TECHNICAL_RESULT.json = 8b3f19a3a182133a46236abc979a11a93f8fd921053aa507333c566b7c5a5923
stage0-v2-production-result.json = 5b7c74d364b362d8c13c77220306b57952f7c8a35d0ea0c6752fc380a475a04d
```

## Scientific firewall

Stage 0 v2 remains technical-only.

```text
scientificInferenceAuthorized = false
real development candidate evaluation performed = false
fresh depth 10 generated/read = false
fresh depth 11 generated/read = false
Stage 2 evidence consumed = false
```

Therefore this PASS authorizes preparation of a separate Stage 1 development freeze. It does not select an estimator, authorize Stage 2, or change G2-11.

Stage 0 v1 remains permanently `STAGE0-TECHNICAL-INVALID`; the v2 PASS does not rewrite or erase that provenance.
