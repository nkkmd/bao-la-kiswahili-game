# LWSRT-STUDY1 — Stage 1 completion

Date: 2026-09-24  
Program: `Research Generation 4 / G4-03`  
Stage: `LWSRT-S1-DEVELOPMENT-2026-09-24-v1`

## Formal disposition

**`STAGE1-PASS / STAGE2-PREPARATION-ELIGIBLE`**

Stage 1 の一回限りの fresh development execution は GitHub Actions run `35987703180` / attempt `1` で完了し、全 step が `success` となった。

Canonical execution:

```text
trigger commit = a9cf4fe237b85e18987c634a2edee86fbdca7b7f
durable execution lease commit = 8e41ba2e50ebeaea0c8d59fa3670485391b68ecc
artifact ID = 10803311137
artifact name = lwsrt-stage1-actions-once-35987703180
artifact SHA-256 = aaea8b1c564dbe400d2d1fc00ebfa58f23cd485d9ae994af88cd4ceaf6b621a6
STAGE_1_RESULT.json SHA-256 = 58d5489ce918bc57b599ca168fdcefbd4e741892ad123d96d27439fb06085ac8
```

## Stage 1 gate results

```text
fresh seed block = 40312001..40312768 / 768
scientific seed reads = 768 / 768
authorized scientific executions = 1
actual scientific executions = 1
selected roots = 128
16 policy × root-family × phase × width cells = 8 / 8 each
SC1 defined = 128 / 128
SC2 defined = 128 / 128
SC3 defined = 128 / 128
production / independent exact = true
identity manifest SHA-256 = 4a1dd1f3bc516734c91f99fbd9bf63ff966e3ed0568cb1b21c3fa6ccd290a979
elapsed = 312374.380301 ms
peak RSS = 146173952 bytes
Stage 2 seed access = false
protected depth-10 access = false
G4-10 depth-11 access = false
```

All sixteen width cells reached the frozen `8 HIGH + 8 LOW` Stage 1 target after RAW-root deduplication. No endpoint undefined cases were observed for SC1/SC2/SC3.

## Interpretation boundary

Stage 1 generated only the preregistered development outputs. It did **not** compute or retain:

- HIGH-vs-LOW risk difference
- effect direction
- p-value
- Holm-adjusted significance
- generalization decision
- counterexample decision
- threshold relearning

Therefore Stage 1 is a support / definedness / implementation-exactness / resource-readiness gate only. It is not formal evidence for the G4-03 transfer claim.

## Freshness firewall for Stage 2

The canonical Stage 1 artifact contains 128 selected identity rows. Stage 2 must exclude every Stage 1:

- source seed
- full trajectory SHA-256
- opening-prefix SHA-256
- selected RAW-root SHA-256

The Stage 1 scientific rows must not be replayed as formal evidence. Stage 2 may use the canonical artifact only to materialize and verify this identity-only exclusion firewall.

## Execution metadata note

`FRESH_ACCESS_LEASE.json` inside the Stage 1 artifact records the original historical decision token `LWSRT-STUDY1-STAGE1-AUTHORIZED-LOCAL-ONCE`, because the Stage 1 runner reads the original authorization record. The effective execution environment had already been prospectively amended before fresh access to `LWSRT-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE`, and the workflow verified that amendment before execution. The durable repository lease also records the effective Actions authorization.

This is an execution-metadata naming split, not a scientific-contract violation. It does not change the fixed seeds, runner logic, selection, endpoints, or result. Stage 2 preparation must remove this ambiguity by writing the effective authorization token directly into all execution metadata.

## Next boundary

Stage 1 is closed. Stage 2 remains **NOT AUTHORIZED FOR FRESH ACCESS** until a separate post-Stage-1 pre-access authorization review, Stage 2 implementation, binding, and seed-free preflight have all been completed.

`main` integration and public AI changes remain unauthorized.
