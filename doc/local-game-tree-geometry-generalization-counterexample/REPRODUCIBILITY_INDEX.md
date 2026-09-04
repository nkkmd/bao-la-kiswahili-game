# LGTGGC-STUDY1 — Reproducibility Index

Date: 2026-09-04

## Study identity

```text
Study = LGTGGC-STUDY1
Program = Research Generation 3 / G3-12
Final decision = CLOSED / TECHNICAL-INVALID
Source main HEAD = 5597ae696d9eb76d8395e114cdb4f83af1138a3d
Research branch = research/g3-12-local-game-tree-geometry-generalization-counterexample
```

## Canonical contract documents

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `PROSPECTIVE_TECHNICAL_AMENDMENT_V2.md`
- `prereg/STUDY_1_TECHNICAL_AMENDMENT_V2.json`
- `prereg/STAGE_1_DEVELOPMENT_SPEC.json`
- `../research-program-decisions/2026-09-04-post-g3-11-g3-12-authorization-review.md`
- `../research-program-decisions/2026-09-04-post-g3-12-stage0-stage1-authorization-review.md`
- `../research-program-decisions/2026-09-04-post-g3-12-stage1-stage2-authorization-review.md`

Historical base protocol/spec retain the original pre-Stage0 `P2-CAPTURE-FIRST` provenance. Active scientific execution uses the pre-fresh versioned amendment `P2-MAX-CAPTURE`; the historical files are not retroactively rewritten.

## Bound source identities for Stage 1

The Stage 1 authorization bound 24 files. Core scientific implementation bindings include:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/ai.js = 8d472be415fac17e47a8e5e667cea9672e7a9ef5
lgtgmiv-stage1-production.js = a4664f01535d6abbf6f83821befbb2fafd55cde6
lgtgmiv-stage1-independent.js = 0c7239ac7acf146e9aee63dae66194681b8631d6
sfcdf-production.js = b6fca5d533ff4fdf906e64509185b480c6dc5818
sfcdf-independent.js = 3bbc16d41c56f2eb00d7169ace2359f0fa9b9b53
silgm-production.js = 9712e897540b54ff5fe3aa6acd997d286b09331d
silgm-independent.js = 0bd60c96e5abfce9d1c99b474709177d52509138
crclgr-production.js = f9d90792d729a42f738e7cd1c3b045bdd758ffa5
crclgr-independent.js = 77d3a91b2165019e4b50c195a1bb14147c35e6d2
gcld-production.js = 8bd203832387be1957bf75cf310b06e861c86956
gcld-independent.js = ffb234c0bba523c1e72c17e903a3edb9c2585656
lgtggc-stage0-production.js = c4d79334dca42ac3f98381ab0bcb6db1e6ec7c54
lgtggc-stage0-independent.js = e071fe803aeddac049a1688bd8425d4b12368758
lgtggc-stage1-production.js = 794dfce0c204018240b98e8350be623aca934910
lgtggc-stage1-independent.js = 7830a5d6c035e6a8bd3a86a75c5868a229c899a8
run-lgtggc-stage1-sfcdf.js = 5d9d142baafc3acf263d5d7a58d3b3a8c0cbd561
run-lgtggc-stage1-silgm.js = f1882d5fc63e1ec61b6ec703c0df6f6eb2539316
run-lgtggc-stage1-gcld.js = 4053d30ea6dfd7b0666a048c645a75b0e472d4bc
finalize-lgtggc-stage1-development.js = 1633aa8eb0fb9c8249e17817dd1d54a6f8c5e559
verify-lgtggc-stage1-authorization.js = 37813aa7fb78f67d20e0c64ce85c335268842845
STUDY_1_SPEC.json = 097ac62b0e18eccc77b40c6342617002f2a8c4ec
STUDY_1_TECHNICAL_AMENDMENT_V2.json = dd55ca2306b930e82f2936ed7ee4a5539d4d9e4e
STAGE_1_DEVELOPMENT_SPEC.json = f8e438dab42270ba86e09580e7b6064e5acf253e
```

## Stage 0 canonical technical result

```text
Active Stage 0 = LGTGGC-S0-TECHNICAL-2026-09-04-v3
Actions run = 33843233392
artifact ID = 9925602227
technical core SHA-256 = 79a34669df5e5d80c179dbb40e2a8e6b8b3e58e05747ef0c1b21d7e493e8a834
stage disposition = STAGE0-PASS
```

Stage 0 V1/V2 are historical technical-invalid attempts and are not scientific evidence.

## Non-adopted technical diagnostic Actions history

GitHub Actions history also retains two later technical runs from a temporary, non-adopted `CAPTURE-FIRST` execution path:

```text
run 33847428204 = LGTGGC Stage 0 Technical / failure / NON-ADOPTED TECHNICAL DIAGNOSTIC
run 33847684538 = LGTGGC Stage 0 Technical V4 / success / NON-ADOPTED TECHNICAL DIAGNOSTIC
```

These runs are **not** canonical Stage 0 revisions and are not scientific readiness evidence. They were produced after the active pre-fresh source-policy amendment had already established `P1-UNIFORM-LEGAL / P2-MAX-CAPTURE`. No Stage 1 or Stage 2 scientific seed block was accessed by these technical diagnostics.

All workflow/authorization/result files belonging to this non-adopted path were removed from the active branch tree before the first-fresh Stage 1 execution. The active Stage 0 production/independent helpers were restored to the pre-contamination blobs bound by Stage 1 authorization, and the active tree was restored to the pre-contamination tree before the Stage 1 execution control plane was added. The two historical Actions entries remain visible only as technical provenance and must not be interpreted as canonical V1/V4 evidence.

## Stage 1 authorization and execution

Authorization commit:

`0522dfd245b9702fa9e0229af95caccf9a50e680`

Execution token commit:

`9cd7e40421d6a6e19518c67770393a7832b6f569`

Exactly-once trigger commit:

`013f3fd2f859ef1758674b6a53ac5a05cd14efc8`

Workflow:

`.github/workflows/lgtggc-stage1-development-execute.yml`

Execution:

```text
Actions run = 33848876682
job = 100946889620
conclusion = failure / fail-closed at SILGM
scientific execution count consumed = 1
same-evidence rerun = NOT AUTHORIZED
```

## Durable lease artifact

```text
artifact ID = 9927555827
name = lgtggc-stage1-lease-33848876682
ZIP SHA-256 = 927759cb9f521a484479efec3a54df0db6f22f7262a936d2ee742d5a6a313231
```

The lease artifact was uploaded before first Stage 1 fresh access.

## Stage 1 result artifact

```text
artifact ID = 9927866205
name = lgtggc-stage1-result-33848876682
ZIP SHA-256 = b93e5401c3191979b35252eaa2003df0e8511db2bbfc1325396d298557b75cdb
```

Downloaded artifact file identities:

```text
sfcdf.json SHA-256 = 2939007b9e95bc545ea29b048c9f7f35d230621252739cd3735ea1f0e3a63218
silgm.json SHA-256 = b0c9947f6cb16ba9c7d615ec6c5c1d28fefdd9579bb821abd273b1ff9b61148d
```

Repository provenance summary:

`results/stage-1/STAGE_1_EXECUTION_RECORD.json`

The immutable Actions artifact remains authoritative for exact Stage 1 files. No scientific recomputation was used to create the repository execution record.

## SFCDF development core

```text
stageDisposition = STAGE1-PASS
selectedPairs = 40
selectedRoots = 80
definedRoots = 80
productionIndependentExact = true
selectionCoreSha256 = a49491bd973ba2ef8807b09e88b17ba929cd97869add1c8f49dc1521d017eff5
measurementCoreSha256 = 59667e24c250e74dc94746311ba23a448b0947fc40b3fe53e424cdf0054f3f3f
```

No effect-direction or p-value was computed.

## SILGM failure identity

```text
stageDisposition = STAGE1-TECHNICAL-INVALID
fatal error = complete root ranking required
production helper blob = 9712e897540b54ff5fe3aa6acd997d286b09331d
independent helper blob = 0bd60c96e5abfce9d1c99b474709177d52509138
```

Independent static audit:

`STAGE_1_FAILURE_INDEPENDENT_AUDIT.md`

Audit disposition:

`INDEPENDENT-AUDIT-PASS / STAGE1-TECHNICAL-INVALID-CONFIRMED`

## GCLD Stage 1

```text
execution = NOT EXECUTED / workflow skipped
seed range 32313001..32313384 = UNREAD
artifact = NONE
```

## Stage 2

Post-Stage1 authorization decision:

`LGTGGC-STAGE2-NOT-AUTHORIZED`

```text
Stage 2 execution = 0
Stage 2 SFCDF seeds = UNREAD
Stage 2 SILGM seeds = UNREAD
Stage 2 GCLD seeds = UNREAD
```

No Stage 2 workflow run or result artifact exists.

## Protected evidence

```text
G3-11 depth-10 rerun = false
depth 11 access = false
G2-12 estimator scientific input = false
symmetry/canonicalization = false
formal p-values = none
formal generalization decisions = none
formal counterexample decisions = none
```

## Final central-document synchronization provenance

Central current-facing documentation was synchronized by technical-only Actions run `33853805427`, which completed successfully and performed no scientific computation.

Three earlier control-plane attempts failed before any job was created:

```text
33853619855 = failure / jobs 0
33853641204 = failure / jobs 0
33853781598 = failure / jobs 0
33853805427 = success / documentation sync only
```

The three failed attempts modified no current-facing document through Actions execution and accessed no scientific seed. The one-time synchronization workflow, helper script, and trigger were removed from the final active branch tree after the successful sync.

## Closure documents

- `STUDY_1_FINAL_REPORT.md`
- `STAGE_1_FAILURE_INDEPENDENT_AUDIT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `results/stage-1/STAGE_1_EXECUTION_RECORD.json`
- `../research-program-decisions/2026-09-04-post-g3-12-stage1-stage2-authorization-review.md`

Main integration remains outside this reproducibility record until explicit user authorization.
