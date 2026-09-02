# SFCDF-STUDY1 — Reproducibility Index

Updated: 2026-09-02

## Baseline

```text
repository = nkkmd/bao-la-kiswahili-game
baseline remote main = 49549e09fc7d8f1e76abe147fc8efcba967a8822
research branch = research/g3-04-structural-forcing-corridor-decision-funnel
Study ID = SFCDF-STUDY1
```

## Canonical preregistration

- `prereg/STUDY_1_SPEC.json`
- `STUDY_1_PROTOCOL.md`

Corrected prereg blob after pre-fixture syntax-only correction:

`3742a0b9ddbcf9c7b3534d22adb0e06d859410bf`

The correction changed JSON syntax only and did not change the frozen scientific contract.

## Rule / upstream source bindings

```text
public/engine.js
blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c

tools/experiments/lib/lgtgmiv-stage1-production.js
blob = a4664f01535d6abbf6f83821befbb2fafd55cde6

tools/experiments/lib/lgtgmiv-stage1-independent.js
blob = 0c7239ac7acf146e9aee63dae66194681b8631d6
```

## G3-04 source bindings

```text
tools/experiments/lib/sfcdf-production.js
blob = b6fca5d533ff4fdf906e64509185b480c6dc5818

tools/experiments/lib/sfcdf-independent.js
blob = 3bbc16d41c56f2eb00d7169ace2359f0fa9b9b53

tools/experiments/run-sfcdf-stage0-technical.js
blob = d36b5a28ee55321faaa177a2a9e2c03a5f1724fd
```

## Scientific representation

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
validated transforms = []
relative horizon = 5
```

## Canonical equality

G3-04 cross-implementation scientific equality:

```text
canonical sorted-key JSON scientific content
→ UTF-8 bytes
→ SHA-256
→ exact digest equality
```

JavaScript object prototypeはscientific identityへ含めない。prototype-sensitive deep object equalityはformal gateに使用しない。

Stage 0 synthetic fixture explicitly verified canonical equality across an ordinary-object / null-prototype representation difference.

## Frozen fresh namespaces

```text
Stage 1 = 31410001..31410192 / NOT CONSUMED
Stage 2 = 31420001..31420288 / NOT CONSUMED
```

## Protected evidence

```text
standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ
```

## Stage 0

Stage ID:

`SFCDF-S0-TECHNICAL-2026-09-02-v1`

v1 execution:

```text
run = 33616688284
disposition = PRE-FIXTURE-TECHNICAL-ABORT
synthetic fixture execution = false
fresh scientific seed access = false
```

v2 authorization:

```text
authorizations/STAGE_0_TECHNICAL_AUTHORIZATION_V2.json
blob = ccd8ef9f8b28799fe5ee666d2d2c7396ddf0efad
maxAdditionalTechnicalExecutions = 1
```

v2 execution:

```text
run = 33620251552
head = 3d9be40db559666e7e7c62fd69d98fa8c7d74419
conclusion = success
artifact ID = 9842597981
artifact name = sfcdf-stage0-technical-v2
artifact ZIP SHA-256 = 028ad7e5034cc4954003b081ca6f0c7ac2bc44a97db0f397fe78ea65f21b7021
deterministic technical core = 14e7640dcd302c402c21a5acbe44bcbf004956670f467763faf7c301e545a295
stage disposition = STAGE0-PASS
```

Canonical repository mirror:

- `results/stage-0/STAGE_0_TECHNICAL_RESULT.json`
- `results/stage-0/STAGE_0_TECHNICAL_PROVENANCE_V2.txt`
- `checkpoints/2026-09-02-stage-0-v2-technical-pass.md`

## Stage 1 / Stage 2

Stage 1 and Stage 2 scientific runner/workflow hashes are intentionally not yet frozen.

Before Stage 1 authorization they must be implemented and non-scientifically smoked. The tooling smoke must exercise the actual scientific trigger/lease/result-durability/canonical-equality path while preventing all Stage 1/2 seed access.

Their implementation must not change the already frozen scientific endpoints, population, seed blocks, formal gates, representation, relative horizon, or interpretation boundary.
