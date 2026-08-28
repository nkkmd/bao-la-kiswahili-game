# RCPR-STUDY1 — Resume Here

Updated: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## 1. Current authoritative restart point

Stage 1 is no longer in preauthorization preparation. It has been explicitly authorized and its single consume-once scientific production run has started.

```text
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
research branch = research/g2-06-rich-critical-position-representation
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
source-freeze checkpoint commit = 4366e439c2838dd7f2f388e834ecc93aed7efcb6
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
Stage 1 workflow run = 33196954082
production job = 98936414477
Stage 1 seed block = CONSUMED
Stage 1 result = PENDING
Stage 2 = NOT AUTHORIZED
```

Before any further action, inspect workflow run `33196954082`. Do not dispatch, rerun, modify, or replace the Stage 1 scientific execution while that run is active or after it has failed under the consume-once contract.

## 2. Read order

Read in this order:

1. `CURRENT_STATUS.md`
2. `checkpoints/2026-08-29-stage1-authorization-and-consumption.md`
3. `checkpoints/2026-08-29-stage1-implementation-validation-and-source-freeze.md`
4. `results/STAGE_1_SOURCE_FREEZE_AUDIT.json`
5. `authorizations/STAGE_1_EXECUTE.json`
6. `preregistration/STAGE_1_EXECUTION_ADDENDUM.json`
7. `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
8. `STUDY_1_PROTOCOL.md`
9. `DECISION_REGISTER.md`
10. `REPRODUCIBILITY_INDEX.md`
11. `RESEARCH_LOG.md`
12. `preregistration/STUDY_START_FREEZE.md`
13. `checkpoints/2026-08-28-stage0-technical-acceptance.md`

## 3. Frozen identity and boundary

```text
Study ID = RCPR-STUDY1
Stage 0 = RCPR-S0-TECHNICAL-2026-08-28-v1
Stage 1 = RCPR-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = RCPR-S2-FORMAL-2026-08-28-v1
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
canonicalization = false
symmetry reduction = false
```

Research Generation 1 Critical Positions evidence and all G2-01..G2-05 outcomes remain immutable upstream evidence. They may not be used to rescue, tune, train, select, validate, or redefine the G2-06 scientific target.

## 4. Completed pre-execution gates

Stage 0 is complete and accepted:

```text
Decision = STAGE0-TECHNICAL-PASS
source commit = dca7a70e75fb1014b752f4549bd6d1164b1feecb
workflow run = 33179301221
artifact = 9688987798
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
Stage 0 result core SHA256 = d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac
```

Stage 1 implementation validation and source freeze are also complete:

```text
final implementation smoke run = 33195723195 / SUCCESS
source-freeze audit run = 33196797865 / SUCCESS
Stage 1 spec SHA256 = 813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb
execution addendum SHA256 = e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
```

The complete frozen source-blob map is in `results/STAGE_1_SOURCE_FREEZE_AUDIT.json`.

## 5. Stage 1 scientific execution

Explicit authorization is committed at:

```text
doc/rich-critical-position-representation/authorizations/STAGE_1_EXECUTE.json
```

Authorization ID:

```text
RCPR-S1-EXECUTE-2026-08-29-v1
```

The Stage 1 workflow was triggered by authorization commit `a0d630df2ee5fbd943d306ab959ce509cbcc2330`.

Frozen scientific population:

```text
source games = 3072
seed block = 28610001..28613072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
root quotas = Namua 300 / Mtaji 300
feature width = 310
replicates per exact root move = 64
continuation horizon = 200 post-root plies
D_range high-divergence boundary = >= 0.30
```

The production step has started. Under the frozen execution addendum, this means the seed block is treated as permanently **CONSUMED** for `RCPR-STUDY1`. No same-block repair, replacement, extension, or rerun is authorized.

## 6. Exact next action

Perform **read-only inspection** of workflow run `33196954082`.

Valid transitions are:

1. production succeeds -> allow the already-defined independent-verification job to execute automatically;
2. production or independent verification fails after consumption -> record `STAGE1-TECHNICAL-INVALID`, do not rerun the same block, Stage 2 remains unauthorized;
3. production and independent verification both succeed -> archive exact artifacts/hashes, record the Stage 1 development result, and apply the prospectively frozen readiness/target-formation rule;
4. only if Stage 1 forms an authorized formal target may a new Stage 2 transition/formal freeze be designed and prospectively committed.

Do not make any scientific design change while interpreting the Stage 1 result.

## 7. Prohibited restart shortcuts

Do not:

- dispatch or rerun Stage 1 again;
- replace or extend `28610001..28613072`;
- edit the frozen scientific source files after outcome inspection;
- read or reuse historical CPOB Stage 1 scientific payloads as G2-06 evidence;
- relax root quotas or readiness gates;
- add feature families or substitute the model after observing Stage 1 outcomes;
- alter the `D_range >= 0.30` boundary;
- use symmetry/canonicalization helpers for scientific identity;
- treat Stage 1 development rows as Stage 2 formal evidence;
- authorize Stage 2 before a complete prospective Stage 2 freeze.

The correct restart instruction is: **inspect Stage 1 workflow run `33196954082`; the scientific seed block is consumed; make no design changes; record the terminal production/verification state exactly.**
