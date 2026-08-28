# RCPR-STUDY1 — Current Status

Updated: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## Status

**STUDY ACTIVE / STAGE 0 TECHNICAL PASS / STAGE 1 SOURCE FREEZE PASS / STAGE 1 EXPLICITLY AUTHORIZED / STAGE 1 PRODUCTION EXECUTION IN PROGRESS / FRESH STAGE 1 BLOCK CONSUMED / STAGE 1 RESULT NOT YET AVAILABLE / STAGE 2 NOT AUTHORIZED**

Stage state:

```text
RCPR-S0-TECHNICAL-2026-08-28-v1 = COMPLETE / STAGE0-TECHNICAL-PASS
RCPR-S1-DEVELOPMENT-2026-08-28-v1 = AUTHORIZED / EXECUTION-IN-PROGRESS / SEED-BLOCK-CONSUMED / RESULT-PENDING
RCPR-S2-FORMAL-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
```

Repository and execution anchors:

```text
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
research branch = research/g2-06-rich-critical-position-representation
scientific source commit = a69ffce86cb278680ee676a2a9469aeb1d9ab1d4
source-freeze checkpoint commit = 4366e439c2838dd7f2f388e834ecc93aed7efcb6
authorization commit = a0d630df2ee5fbd943d306ab959ce509cbcc2330
Stage 1 workflow run = 33196954082
Stage 1 production job = 98936414477
G2-06 pull request = none
```

The Stage 1 production step `Execute fresh Stage 1 development population once` has started. Under the prospectively frozen execution contract, the fresh development block is therefore treated as permanently **consumed** for `RCPR-STUDY1`. No same-block repair or rerun is authorized even if a later technical or independent-verification failure occurs.

No Stage 1 development result is recorded yet in the repository at this status point. Stage 2 remains unauthorized.

## Frozen Study identity and scientific boundary

```text
Study ID = RCPR-STUDY1
Formal title = Rich Critical-Position Representation Study 1
Stage 0 = RCPR-S0-TECHNICAL-2026-08-28-v1
Stage 1 = RCPR-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = RCPR-S2-FORMAL-2026-08-28-v1
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
canonicalization = false
symmetry reduction = false
```

All Research Generation 1 and G2-01..G2-05 formal decisions remain immutable. Historical Critical Positions outcomes are prohibited as G2-06 training, tuning, threshold selection, validation, or formal evidence.

## Stage 0 accepted technical result

Stage 0 was accepted as **STAGE0-TECHNICAL-PASS**.

```text
source commit = dca7a70e75fb1014b752f4549bd6d1164b1feecb
workflow run = 33179301221
workflow conclusion = success
artifact = 9688987798
artifact ZIP SHA256 = 442b7ba7dcaeab244e3ed35def5fa2e4508f999fecd7fdb1ea28951a3ea5a269
fixtures = 6 (Namua 3 / Mtaji 3)
candidate feature families = 8
numeric scalar features = 310
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
production/independent exact representation agreement = true
RAW identity production/independent agreement = true
mandatory positive controls = PASS
mandatory negative controls = PASS
Stage 0 result core SHA256 = d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac
```

## Stage 1 frozen design and source contract

```text
Stage 1 spec SHA256 = 813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb
execution addendum SHA256 = e246f562735c72ccc29ea320021be7bb3cb0056f30cf063dca0e3d0366a89d64
fresh source games = 3072
fresh development seeds = 28610001..28613072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
selected roots target = 600 (Namua 300 / Mtaji 300)
representation width = 310 finite scalar features
candidate families = 8
criticality construct = fixed-policy exact-root-move continuation D_range
high-divergence boundary = D_range >= 0.30
replicates per exact root move = 64
continuation horizon = 200 post-root plies
model-development CV = 5-fold by historicalTrajectoryHash
Stage 1 rows reusable as Stage 2 evidence = false
```

Final implementation smoke passed in workflow `33195723195`; the exact source-freeze audit passed in workflow `33196797865`. The full frozen source-blob map is retained in `results/STAGE_1_SOURCE_FREEZE_AUDIT.json`.

Explicit authorization is retained in `authorizations/STAGE_1_EXECUTE.json` and binds the frozen spec, execution addendum, scientific source commit, exact source-blob map, consume-once seed block, and fail-closed failure contract.

## Current next gate

Do not alter scientific source files, seeds, feature families, model-selection rules, thresholds, continuation policy, or resource/failure semantics while Stage 1 is running.

The next valid state transition is determined solely by the already-running workflow:

- production success -> independent full-corpus replay/recomputation;
- production or independent failure after consumption -> `STAGE1-TECHNICAL-INVALID`, no same-block rerun, Stage 2 not authorized;
- complete production + independent verification -> record Stage 1 development result and apply the prospectively frozen readiness/target-formation rule before any Stage 2 freeze.

For restart, inspect workflow run `33196954082` and read the latest execution checkpoint before taking any further action.
