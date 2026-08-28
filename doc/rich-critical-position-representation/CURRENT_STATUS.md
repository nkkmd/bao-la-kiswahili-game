# RCPR-STUDY1 — Current Status

Updated: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## Status

**STUDY ACTIVE / STAGE 0 TECHNICAL PASS / STAGE 1 DEVELOPMENT SPEC PROSPECTIVELY FROZEN / STAGE 1 OUTCOME GENERATION NOT AUTHORIZED / NO G2-06 SCIENTIFIC OUTCOME GENERATED**

Stage state:

```text
RCPR-S0-TECHNICAL-2026-08-28-v1 = COMPLETE / STAGE0-TECHNICAL-PASS
RCPR-S1-DEVELOPMENT-2026-08-28-v1 = PROSPECTIVE-FROZEN / NOT-AUTHORIZED-NOT-EXECUTED
RCPR-S2-FORMAL-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
```

Repository anchor:

```text
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
resume-audit branch head before documentation synchronization = efe44154c0fcfc99df492dc6680f59bf3a3d1f29
research branch = research/g2-06-rich-critical-position-representation
branch relation to baseline main at resume audit = ahead 17 / behind 0
G2-06 pull request = none
```

The GitHub-connected workflow operates on remote repository state; no local checkout/worktree is participating in the current writes.

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

Stage 0 generated no decision-criticality outcome and authorized no scientific inference.

## Stage 1 prospective freeze

`preregistration/STAGE_1_DEVELOPMENT_SPEC.json` is committed and frozen with status:

```text
prospective-frozen-pending-implementation-validation-and-authorization
```

Key frozen development design includes:

```text
fresh source games = 3072
fresh development seeds = 28610001..28613072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
selected roots target = 600 (Namua 300 / Mtaji 300)
representation width = 310 finite scalar features
candidate families = 8
criticality construct = fixed-policy exact-root-move continuation D_range
high-divergence boundary = D_range >= 0.30
replicates per exact root move = 64
model-development CV = 5-fold by historicalTrajectoryHash
Stage 1 rows reusable as Stage 2 evidence = false
```

The spec alone does **not** authorize development outcome generation.

## Required next sequence

Before any Stage 1 scientific development outcome is generated:

1. implement the Stage 1 production pipeline and structurally independent verifier under the frozen spec;
2. implement contract/smoke/negative-control validation without consuming the fresh Stage 1 outcome block;
3. bind the exact Stage 1 spec hash and production/independent scientific source hashes;
4. pass the required implementation validation and source-drift checks;
5. commit the explicit authorization file `authorizations/STAGE_1_EXECUTE.json`;
6. only then execute the fresh Stage 1 development population `28610001..28613072` once.

Fail closed on any mismatch. Do not extend/replace seeds, relax readiness gates, change the feature family search space, alter the `D_range >= 0.30` boundary, inspect historical CPOB outcome payloads, or generate Stage 2 evidence.

For restart, read `RESUME_HERE.md` first.
