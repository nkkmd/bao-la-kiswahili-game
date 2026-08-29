# RCPR-STUDY1 — Research Log

## 2026-08-28 — Startup audit and prospective freeze

- Verified remote `main` at `37480777246aa306c6ca3d0679d936b5e0107071`.
- Created `research/g2-06-rich-critical-position-representation` from the verified baseline.
- Prospectively froze `RCPR-STUDY1`, Stage IDs, RAW identity, no-canonicalization boundary, leakage classes, eight representation families, no-rescue behavior and independent-verification requirements.
- Historical Research Generation 1 Critical Positions evidence was excluded from G2-06 training/tuning/validation/formal evidence.

Scientific outcome generated: **none**.

## 2026-08-28 — Stage 0 source audit and technical acceptance

- Implemented dedicated RAW-only production/independent representation paths.
- Stage 0 source commit: `dca7a70e75fb1014b752f4549bd6d1164b1feecb`.
- Workflow `33179301221` completed successfully; artifact `9688987798` ZIP SHA256 `442b7ba7dcaeab244e3ed35def5fa2e4508f999fecd7fdb1ea28951a3ea5a269`.
- Six fixtures covered Namua/Mtaji, all eight families and 310 scalar features.
- Production/independent representation and RAW identity agreed exactly; positive and negative controls passed.
- Feature schema SHA256 frozen as `1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b`.
- Stage 0 result core SHA256 `d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac`.
- Decision: `STAGE0-TECHNICAL-PASS`.

Scientific outcome generated: **none**.

## 2026-08-28 — Stage 1 development design freeze

- Froze `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`.
- Fresh source games: 3072; scientific seed block `28610001..28613072`, `CONSUME-ONCE-DEVELOPMENT-ONLY`.
- Froze six generation strata, outcome-blind selection, 300/300 phase quotas, 310-feature representation, continuation instrument, `D_range >= 0.30`, candidate family sets, deterministic five-fold development procedure, operating-threshold rule and readiness gates.
- Froze independent full-corpus replay, root reselection, feature recomputation, continuation remeasurement, model-development recomputation and fail-closed technical decision.
- Stage 1 remained unauthorized by spec alone.

Scientific outcome generated: **none**.

## 2026-08-29 — Implementation validation and execution-contract freeze

- Final implementation smoke: workflow `33195723195`, job `98932225577`, success.
- Smoke artifact `9695647002`, ZIP SHA256 `9d87a3aba46e69952061aa3b30a628f41fe6525db69299634bf1386716273a11`.
- Resource preflight: workflow `33195349152`, job `98930953453`, success.
- Resource artifact `9695494212`, ZIP SHA256 `aec9f6c4c5bca8308ace21bfa47b17bc400e7215ecde8a69395b6183c560f4b1`.
- Froze separate 360-minute production/independent jobs, Node 6144 MB old-space, deterministic encodings and consume-once failure semantics.
- Scientific implementation/source contract frozen at `a69ffce86cb278680ee676a2a9469aeb1d9ab1d4`.
- Stage 1 spec SHA256 `813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb`.
- Execution addendum SHA256 `e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64`.

Scientific outcome generated: **none**. Fresh block consumed: **no**.

## 2026-08-29 — Exact source-freeze audit

- Source-freeze audit workflow `33196797865`, job `98935883477`, success.
- Artifact `9696075216`, ZIP SHA256 `fabb644c69d0f5efac48f3275a1e28a008a84832c7a7c4fd99a5f199038dbd7c`.
- Audit envelope SHA256 `03c466fa075d95ee0a8aba8ba863e7236a9a1997e8b566e6725b0ba378476a2d`.
- Verified baseline main, authorization absence at audit time, scientific-source ancestry, spec/addendum hashes and all 17 frozen source blobs.
- Source-freeze checkpoint closed at `4366e439c2838dd7f2f388e834ecc93aed7efcb6`.

Scientific outcome generated: **none**. Fresh block consumed: **no**.

## 2026-08-29 — Stage 1 explicit authorization and execution start

- Created authorization `RCPR-S1-EXECUTE-2026-08-29-v1` at commit `a0d630df2ee5fbd943d306ab959ce509cbcc2330`.
- Authorization retained `scientificInferenceAuthorized=false`, `confirmatoryReuseAllowed=false`, `stage2Authorized=false`.
- Push triggered workflow run `33196954082`.
- Production job `98936414477` crossed the execution-start boundary.
- Under the prospectively frozen contract the block `28610001..28613072` became permanently consumed.

```text
consumption state = CONSUMED
same-block rerun = NOT AUTHORIZED
replacement/extension = NOT AUTHORIZED
```

## 2026-08-29 — Stage 1 production completion

Production job `98936414477` completed `success`.

Production output:

```text
status = PASS-AWAITING-INDEPENDENT-VERIFICATION
generatedGames = 3072
selectedRoots = 600
primaryEstimable = 599
highDivergence = 134
lowDivergence = 465
selectedFamilySetId = RICH_ALL
overallAuc = 0.7093403948001926
phaseAuc.namua = 0.7356189599631845
phaseAuc.mtaji = 0.6657646992502396
balancedAccuracy = 0.6684641309581127
productionResultSha256 = bc2ece4cb2df6f3cc5625324661c56fcaa6476c9921265f08fa13f005373b66e
```

All production readiness gates were true.

Artifact:

```text
ID = 9704250489
name = rcpr-stage1-development-production-v1
size = 3168004 bytes
ZIP SHA256 = 00c210eb0fd9391c67e05b40daa3a85f66a1bc5ba2a460db40128f290e6d26d8
```

Interpretation at this point remained **production-only / awaiting independent verification**.

## 2026-08-29 — Independent verification failure

Independent job `99007180273` completed `failure` at `Independent full-corpus replay and recomputation` and still uploaded the verification artifact.

Verifier result:

```text
fullCorpusReplay = true
rootReselection = true
selectedRowCount = true
independentFeatureRecomputation = false
independentFullContinuationRemeasurement = true
independentModelDevelopmentRecomputation = true
readinessRecomputation = true
developmentCoreMatch = false
technicalPass = false
finalDecision = STAGE1-TECHNICAL-INVALID
verificationSha256 = 6ca0257e4d2064afa177937f881ec13a1843fd98bc133cc5c94522fdd4b44ee2
```

Verification artifact:

```text
ID = 9708956844
name = rcpr-stage1-development-verified-v1
size = 3191366 bytes
ZIP SHA256 = 1f1be58ec9dccd5aa35ad7a903333b5c8c912795edab7b31d4e2541119e8d0e5
```

The artifact included `execution-start.json`, `production-result.json`, and `independent-verification.json`. `execution-start.json` explicitly confirmed the scientific Stage 1 seed block was consumed.

Exactly four of 600 rows failed `featureVectorMatch`. All 600 rows were present; RAW state key, continuation measurement, `D_range`, and high-divergence label matched.

## 2026-08-29 — Technical postmortem

Read-only artifact/source analysis localized all four differences to `MOVE_SET_ENTROPY.indexEntropy`.

Cause:

- production `rcpr-production.js::entropy(values)` uses a `Map`, preserving insertion order;
- independent `rcpr-independent.js::shannon(values)` uses a plain object;
- JavaScript enumerates integer-like object keys in numeric order rather than encounter order;
- the same entropy terms are therefore added in a different order;
- IEEE-754 non-associativity produces exact differences of `2.220446049250313e-16` to `4.440892098500626e-16`.

No difference was observed in continuation remeasurement, `D_range`, high-divergence classification, model-development recomputation or readiness recomputation.

This technical explanation does **not** rescue Stage 1. The prospectively frozen verifier required exact feature-vector equality.

## 2026-08-29 — Stage 1 fail-closed closure

Final decision:

**`STAGE1-TECHNICAL-INVALID`**

Governance consequences:

```text
Stage 1 seed block = CONSUMED
same-block repair/rerun = PROHIBITED
post-hoc tolerance/rounding rescue = PROHIBITED
production-only result promotion = PROHIBITED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Permanent records:

- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `checkpoints/2026-08-29-stage1-technical-invalid-closure.md`

Any continuation of this research line must be a new prospective successor with deterministic entropy-order/numeric-hash semantics hardened before scientific authorization, adversarial technical fixtures, a new study/spec/source freeze, fresh scientific seed block and new explicit authorization. `RCPR-STUDY1` rows are not successor formal evidence.
