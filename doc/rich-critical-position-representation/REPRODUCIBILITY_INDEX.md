# RCPR-STUDY1 — Reproducibility Index

Updated: 2026-08-29  
Status: **ACTIVE / STAGE 0 TECHNICAL PASS / STAGE 1 SPEC FROZEN / STAGE 1 SCIENTIFIC EXECUTION NOT AUTHORIZED / NO G2-06 SCIENTIFIC OUTCOME**

## Study anchor

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
branch = research/g2-06-rich-critical-position-representation
resume-audit branch head before documentation synchronization = efe44154c0fcfc99df492dc6680f59bf3a3d1f29
Program = G2-06
Study ID = RCPR-STUDY1
Stage 0 = RCPR-S0-TECHNICAL-2026-08-28-v1
Stage 1 = RCPR-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = RCPR-S2-FORMAL-2026-08-28-v1
```

## Startup and restart repository audit

```text
expected main SHA = 37480777246aa306c6ca3d0679d936b5e0107071
actual remote main SHA at restart = 37480777246aa306c6ca3d0679d936b5e0107071
match = true
branch relation to main at restart = ahead 17 / behind 0
G2-06 PR count = 0
```

No rebase or baseline substitution is required for continuation.

## Prospective authority

- `preregistration/STUDY_START_FREEZE.md`
- `STUDY_1_PROTOCOL.md`
- `DECISION_REGISTER.md`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`

No G2-06 scientific outcomes existed when these prospective documents were created.

## Authoritative representation

```text
RAW identity include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
missing pending = invalid
validated transform set = []
symmetry reduction = false
canonicalization = false
candidate feature families = 8
Stage 0 scalar feature width = 310
feature schema SHA256 = 1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b
```

## Stage 0 technical execution provenance

```text
Stage 0 decision = STAGE0-TECHNICAL-PASS
source commit = dca7a70e75fb1014b752f4549bd6d1164b1feecb
workflow run = 33179301221
workflow conclusion = success
job = 98876051308
artifact = 9688987798
artifact name = rcpr-stage0-technical-v1
artifact ZIP SHA256 = 442b7ba7dcaeab244e3ed35def5fa2e4508f999fecd7fdb1ea28951a3ea5a269
artifact size = 62144 bytes
fixtures = 6
Namua fixtures = 3
Mtaji fixtures = 3
production/independent exact representation agreement = true
RAW identity production/independent agreement = true
mandatory positive controls = PASS
mandatory negative controls = PASS
Stage 0 result core SHA256 = d26401b6814b501589d1811f3f182ce731822f91bef2a203a5b874b285de05ac
```

Stage 0 generated no decision-criticality outcome and authorized no scientific inference.

## Stage 0 source identities

Known upstream Git blob identities at the verified baseline:

```text
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/ai.js = 8d472be415fac17e47a8e5e667cea9672e7a9ef5
public/ai-weights.js = 98969eb4c8e1403beedcf5c139a07166aa78175c
tools/experiments/lib/position-complexity-search-diagnostic.js = 72617e23ca143fac7bea35934815fd438d3e5be7
historical tools/experiments/lib/critical-positions-outcome-branching.js = d3568a7d195a32e56f68519d1813a1365dda603b
historical tools/experiments/lib/position-typology-features.js = 2ea6c226561f1b7e59926caa39c0ebee28cf6b65
historical tools/experiments/lib/tactical-motif-features.js = a8c668779a1cb9738b7066799a46f1fb484a1df4
G2-05 tools/experiments/lib/drsse-production.js = e8fc23799415f566850c817c22cf658216bb98be
```

The historical CPOB and position-typology/tactical modules are method fixtures only and are not authorized as scientific G2-06 feature/identity implementations.

## Historical evidence exclusion

Prohibited from RCPR Stage 1/2 development/formal rows:

```text
CPOB source seeds 22600001..22603072
CPOB selected roots = 600
CPOB high-divergence roots = 139
CPOB candidate audits = 1183
CPOB promoted candidates = 0
CPOB reserved unconsumed Stage 2 seeds 22700001..22706144
all CPOB Stage 1 measured/discovery payloads
```

The unconsumed historical Stage 2 seed block is intentionally not reassigned to RCPR.

## Stage 1 frozen development design

`preregistration/STAGE_1_DEVELOPMENT_SPEC.json` is committed with Git blob SHA:

```text
d86ec140aecbb8c74f0bc6add2b9c810796a055e
```

Its frozen status is:

```text
prospective-frozen-pending-implementation-validation-and-authorization
```

Key frozen values:

```text
source games = 3072
seed block = 28610001..28613072
seed use = CONSUME-ONCE-DEVELOPMENT-ONLY
target roots = 600
Namua quota = 300
Mtaji quota = 300
history window = 4 moves
feature width = 310
replicates per exact root move = 64
maximum post-root continuation plies = 200
high-divergence threshold = D_range >= 0.30
CV folds = 5
Stage 1 rows reusable as Stage 2 formal evidence = false
```

The Stage 1 spec by itself does not authorize scientific development generation.

## Stage 1 pre-execution provenance still required

Before any scientific Stage 1 run, the repository must freeze and validate at minimum:

```text
Stage 1 spec content SHA256
production Stage 1 source/blob hashes
independent verifier Stage 1 source/blob hashes
engine/AI/search dependency hashes used by Stage 1
contract/smoke validation result
negative-control result
production/independent implementation agreement on non-outcome-bearing fixtures
source-drift guard result
explicit authorization file = doc/rich-critical-position-representation/authorizations/STAGE_1_EXECUTE.json
```

Only after those gates pass may the fresh development seed block be consumed once.

## Stage 2 future provenance

Stage 2 remains `NOT-AUTHORIZED-NOT-EXECUTED`. Before Stage 2, a new complete formal freeze must record the Stage-1-selected representation/model parameters, exact formal endpoint and thresholds, fresh formal population/seed block, Stage 1 identity firewall, production and independent verifier hashes, workflow/artifact identities, fail-closed defect rules, and a separate explicit Stage 2 authorization.
