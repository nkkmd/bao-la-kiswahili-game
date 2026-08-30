# SSGTGE-STUDY1 — Decision Register

## DR-001 — Study identity

Date: 2026-08-30  
Instantiate agenda label `G2-12` as `SSGTGE-STUDY1` — **State-Space / Game-Tree Growth Estimation Study 1**.

## DR-002 — Baseline and branch

```text
baseline remote main = c5efcdb7972d1bc775a2857c1b0641c35c9df622
branch = research/g2-12-state-space-game-tree-growth-estimation
```

## DR-003 — RAW-only scientific identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

Exclude `turn,reason`. Validated transform set remains `[]`; no canonicalization/symmetry/seat-swap/reflection reduction.

## DR-004 — G2-05 boundary

`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN` is immutable. Depth 0..9 exact summaries are development evidence only. G2-12 does not retroactively extend G2-05.

## DR-005 — Development / holdout firewall

Development = immutable G2-05 depth 0..9 summaries. Mandatory fresh formal holdout = depth 10. Secondary stress-test = depth 11 if complete. Stage 2 may not import G2-05 materialized state/edge rows as formal enumeration input.

## DR-006 — Candidate estimator set

Freeze exactly:

```text
E1-TRAILING-LOG-LINEAR-W5
E2-LOG-QUADRATIC-D2PLUS
E3-LOCAL-LOG-INCREMENT-TREND-W4
```

## DR-007 — Development selection rule

Primary series: `newRawStateCount`, `treeNodeOccurrences`. Rolling origins: `5->6`, `6->7`, `7->8`, `8->9`. Eligibility max absolute natural-log error `<=0.15`; winner by minimum worst-cell error, then mean error, then fixed candidate order.

## DR-008 — Formal endpoint

Depth 10 requires complete exact enumeration, production/independent zero mismatch, joint max abs log error `<=0.20`, and both primary values within the frozen development-calibrated envelope.

## DR-009 — Resource ceiling

Maximum target depth 11; mandatory complete depth 10; RAW cap 2,000,000; edge/move cap 12,000,000; parent expansion cap 600,000; tree occurrence cap 50,000,000; RSS 6 GiB; wall clock 1,200 s; artifact cap 1 GiB.

## DR-010 — Decision taxonomy

```text
VALIDATED-WITHIN-FRESH-DEPTH-10-HOLDOUT
NOT-VALIDATED
NON-ESTIMABLE
RESOURCE-CENSORED
TECHNICAL-INVALID
INCONCLUSIVE
```

## DR-011 — Seed/domain reservation

Scientific enumeration is deterministic and seedless; development and holdout are separated by depth/evidence access.

## DR-012 — G2-11 boundary

G2-10 and PSRRE-STUDY1 remain closed without an eligible frozen strategic representation. `G2-11 = NOT-AUTHORIZED` remains unchanged.

## DR-013 — Stage 0 authorization

Stage 0 is technical-only and must not generate/read fresh depth 10/11. Stage 1/2 are not authorized by the initial Stage 0 decision.

## DR-014 — Stage 0 v1 is technical-invalid

Run `33315971968` failed before output at `SOURCE-HASH-BINDING-MISMATCH`. The workflow also lacked `pipefail`. Formal v1 disposition:

```text
SSGTGE-S0-TECHNICAL-2026-08-30-v1 = STAGE0-TECHNICAL-INVALID
```

## DR-015 — Stage 0 v1 is not rerun

The v1 authorization fixed `sameStage0EvidenceRerunAuthorized=false`; v1 is not repaired/rerun.

## DR-016 — Prospective Stage 0 v2 correction is permitted

Because v1 failed before scientific output, a separately versioned technical-entry v2 may correct only source-binding/orchestration mechanics while preserving the scientific contract.

## DR-017 — v2 scope is technical only

Allowed changes: content-SHA gate -> Git-blob identity gate; shell -> `set -euo pipefail`; new versioned runner/verifier/workflow/spec/authorization paths. Scientific estimator/holdout/resource contract remains immutable.

## DR-018 — Stage 0 v2 remains technical-only

v2 may enumerate only a depth-2 technical fixture, read G2-05 depth 0..9 only for plumbing, use synthetic estimator tests only, and may not generate/read depth 10/11.

## DR-019 — v2 requires separate freeze and authorization

The v2 source/spec is committed before execution and authorization is a subsequent parent-bound commit.

## DR-020 — Stage 0 v2 execution is accepted

```text
source freeze = a699beb6afe7681227d0ecc8328d527ac34ff7f6
authorization = 6ed915304e4ec834ca9ff0dc7f115cdeb9988bcd
run = 33323689667
job = 99289968446
artifact = 9735609030
artifact ZIP SHA256 = bdf0dac8359147c5efaa7b3d58c798a4336c78483d95176ea38ab9960bad07d6
```

Production and independent processes both exited 0 under fail-closed pipelines. Accepted:

```text
SSGTGE-S0-TECHNICAL-2026-08-30-v2 = STAGE0-TECHNICAL-PASS
```

## DR-021 — Stage 0 PASS authorizes Stage 1 preparation only

Stage 0 PASS establishes technical operability only. It does not select an estimator or authorize fresh depth 10/11.

## DR-022 — Stage 1 development sources are prospectively frozen

Stage 1 source/spec/tooling was frozen at:

```text
3d93b6cb228bc314819495e89c1521859bf258b6
```

Only immutable G2-05 depth 0..9 summaries may be read. The candidate set, eight-cell backtest, `0.15` gate, winner rule, q/R1/R2 rule, and recursive depth-11 prediction policy remain unchanged.

## DR-023 — Stage 1 execution is separately authorized once

Authorization commit:

```text
bba6d55b1a22e403976ced5ef05ed5b9d3c99f6e
```

It fixes:

```text
realDevelopmentCandidateEvaluationAuthorized = true
freshDepth10Or11GenerationAuthorized = false
freshDepth10ReadAuthorized = false
freshDepth11ReadAuthorized = false
sameStage1EvidenceRerunAuthorized = false
stage2ExecutionAuthorized = false
```

## DR-024 — Production-only E2 proposal is not canonical

Run `33324107667` production exited 0. Production-only diagnostics gave:

```text
E1 max abs log error = 0.2813333110915206 / ineligible
E2 max abs log error = 0.07917793679237395 / eligible
E3 max abs log error = 0.1129709359542721 / eligible
production proposed winner = E2-LOG-QUADRATIC-D2PLUS
```

However mandatory independent verification failed before a canonical Stage 1 result was produced. Therefore:

```text
canonical selectedEstimator = null
production E2 proposal = diagnostic-only / not authorized for Stage 2
```

## DR-025 — Stage 1 is technical-invalid

Independent verifier failure:

```text
prediction mismatch: E2-LOG-QUADRATIC-D2PLUS/newRawStateCount/7
frozen cross-implementation relative tolerance = 1e-12
```

Production prediction was `4729.18318822039`. Post-failure diagnostic reconstruction of the independent numerical path was approximately `4729.1831882325705`, relative difference approximately `2.57568e-12`.

The tolerance is not relaxed and the same development evidence is not rerun. Accepted Stage 1 disposition:

```text
SSGTGE-S1-DEVELOPMENT-2026-08-30-v1 = STAGE1-TECHNICAL-INVALID
```

## DR-026 — Stage 2 is not authorized

Mandatory independent Stage 1 verification did not pass, so no canonical estimator exists.

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
fresh depth 10/11 = NOT GENERATED / NOT READ
```

## DR-027 — Study 1 closes TECHNICAL-INVALID

The frozen study-level taxonomy includes `TECHNICAL-INVALID`; Stage 1 is a required prerequisite and cannot be validly rerun on the same consumed development outcome. Therefore:

```text
SSGTGE-STUDY1 formal decision = TECHNICAL-INVALID
selectedEstimator = null
```

This does not change G2-05 or G2-11. A corrected attempt requires a new prospective Study or explicit new version.
