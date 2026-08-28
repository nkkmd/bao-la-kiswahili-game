# RCPR-STUDY1 — Resume Here

Updated: 2026-08-29  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## 1. Repository state to verify first

At the 2026-08-29 restart audit:

```text
remote main = 37480777246aa306c6ca3d0679d936b5e0107071
research branch = research/g2-06-rich-critical-position-representation
branch head before this resume-document synchronization = efe44154c0fcfc99df492dc6680f59bf3a3d1f29
relation to main = ahead 17 / behind 0
G2-06 PR = none
```

Re-fetch remote `main` and the research branch before further scientific work. If `main` has moved, audit the delta before continuing; do not silently rebase or change the frozen baseline embedded in the Study/Stage specs.

## 2. Read order

Read in this order before implementing Stage 1:

1. `preregistration/STUDY_START_FREEZE.md`
2. `STUDY_1_PROTOCOL.md`
3. `DECISION_REGISTER.md`
4. `CURRENT_STATUS.md`
5. `FEATURE_DICTIONARY.md`
6. `preregistration/STAGE_0_TECHNICAL_SPEC.json`
7. `results/STAGE_0_TECHNICAL_RESULT.json`
8. `checkpoints/2026-08-28-stage0-technical-acceptance.md`
9. `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
10. `REPRODUCIBILITY_INDEX.md`
11. `RESEARCH_LOG.md`

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

## 4. Completed work

Stage 0 is complete and accepted:

```text
Decision = STAGE0-TECHNICAL-PASS
source commit = dca7a70e75fb1014b752f4549bd6d1164b1feecb
workflow run = 33179301221
workflow conclusion = success
artifact = 9688987798
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
Stage 0 result core SHA256 = d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac
```

All eight prospectively declared feature families passed technical eligibility. Production and independent implementations agreed exactly on the Stage 0 fixtures and all mandatory controls passed.

## 5. Current stop point

Stage 1 development design is prospectively frozen in:

`preregistration/STAGE_1_DEVELOPMENT_SPEC.json`

Its status is:

```text
prospective-frozen-pending-implementation-validation-and-authorization
```

No G2-06 Stage 1 scientific outcome has been generated. No Stage 1 authorization file exists yet. Stage 2 is not authorized.

Important frozen Stage 1 values:

```text
source games = 3072
seed block = 28610001..28613072
root quotas = Namua 300 / Mtaji 300
feature width = 310
replicates per exact root move = 64
D_range high-divergence boundary = >= 0.30
candidate family sets and model-selection rule = frozen in Stage 1 spec
readiness gates = frozen in Stage 1 spec
```

## 6. Exact next task

Proceed with **Stage 1 implementation preparation only**, without consuming the frozen development outcomes.

Required order:

1. create dedicated Stage 1 production runner/library wiring that implements the frozen source population, trajectory identity, outcome-blind root selection, pre-root feature materialization, continuation measurement, development model and readiness decision;
2. create a structurally independent verifier that independently replays the full corpus, reselects roots, recomputes all 310 features, remeasures all continuations and recomputes model development;
3. add contract/smoke/negative-control tests that do not consume the scientific Stage 1 seed block as an outcome-bearing run;
4. freeze exact source/blob identities and the Stage 1 spec content hash;
5. validate implementation agreement and fail-closed guards;
6. only after those pass, create and commit `authorizations/STAGE_1_EXECUTE.json`;
7. execute the fresh Stage 1 block exactly once.

Do **not** create the authorization merely because the spec exists. The authorization is contingent on the preceding implementation/source-hash/contract-smoke validation gates.

## 7. Prohibited restart shortcuts

Do not:

- read or reuse historical CPOB Stage 1 scientific payloads as G2-06 development evidence;
- change the frozen seed block after outcome generation begins;
- replace unavailable phase roots;
- relax root quotas or readiness gates after observing outcomes;
- add new feature families after Stage 1 outcomes are observed;
- alter the `D_range >= 0.30` boundary in response to G2-06 outcomes;
- use symmetry/canonicalization helpers for scientific identity;
- treat Stage 1 rows as Stage 2 formal evidence;
- execute Stage 2 before a new complete formal freeze and explicit authorization.

The correct restart point is therefore: **Stage 0 closed successfully; Stage 1 design frozen; implement and validate Stage 1 machinery next; no scientific development run yet.**
