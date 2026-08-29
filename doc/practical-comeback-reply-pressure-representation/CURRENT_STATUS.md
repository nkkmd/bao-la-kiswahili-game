# PCRPR-STUDY1 — Current Status

Updated: 2026-08-29

## Study identity

```text
Program = G2-07
Study ID = PCRPR-STUDY1
Formal title = Practical Comeback / Reply-Pressure Representation Study 1
Baseline remote main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
Branch = research/g2-07-practical-comeback-reply-pressure-representation
Stage 0 = PCRPR-S0-TECHNICAL-2026-08-29-v1
Stage 1 = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = PCRPR-S2-FORMAL-2026-08-29-v1
```

## Current state

**STAGE 0 TECHNICAL PASS / STAGE 1 AUTHORIZED AND CONSUMED / CANONICAL PRODUCTION + REQUIRED INDEPENDENT REPLAY IN PROGRESS / STAGE 2 NOT AUTHORIZED**

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 authorization = AUTHORIZED
Stage 1 consume-once gate = SUCCESS
Stage 1 seeds 28710001..28713072 = CONSUMED
Stage 1 same-block rerun/repair/replacement/extension = NOT AUTHORIZED
Stage 1 final development decision = PENDING CANONICAL PRODUCTION + INDEPENDENT EXACT VERIFICATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## Stage 0 canonical technical result

```text
source commit = 19c70ba60c8b43858b01a01c5a448311660269c4
workflow run = 33238931893 / success
artifact = 9710763348
artifact ZIP SHA256 = 408c778171973903f0f7a55ed9b468cea37a4f41e94dbfd677a682c4dadcd59b
production mandatory gates = 18 / 18 PASS
independent gates = 9 / 9 PASS
technical rows = 9
scalar features per row = 80
exact cross-implementation equality = PASS
```

## Stage 1 preauthorization validation

All required preauthorization gates passed before scientific seed consumption:

```text
production implementation smoke = PASS / run 33240901637
resource preflight = PASS / run 33240989191
independent exact smoke = PASS / run 33241110983
source-freeze audit = PASS / run 33241372471
source-freeze commit = eb48ecae8d5ae171175f7cc9f00c9bcc77b2c237
spec SHA256 = 15aff7a35c7875c16a815ae0323b3726714b36941ce53ce4788f8947700b2f2c
computation contract SHA256 = 7f6d2c9a928392c557f31f35cd0e912ba8396055c9535872b698f8085bc282e9
feature dictionary SHA256 = 892624860ac22c722ad9877b8c93ba6c32536da98692fc6735cd86e43886ca4f
```

Resource preflight used technical-only seeds and did not inspect Stage 1 target prevalence. Its conservative projection remained within the prospectively frozen resource ceiling.

The independent smoke reproduced source corpus, root selection, row identity, all 80-feature representations, reduced continuation outcomes, development-model core and final fit exactly without importing PCRPR production feature/model helpers.

## Stage 1 authorization and consume-once execution

Explicit authorization:

- `authorizations/STAGE_1_EXECUTE.json`
- authorization commit `64f0352e7d8b26432e2a68c408e403859c3e71bf`
- canonical workflow run `33241465899`

Consume-once gate:

```text
gate job = 99071430645 / success
execution-start artifact = 9711478864
artifact ZIP SHA256 = cf80f4b24ef9cf8996bcaa09ea4569c2030daa9640eacc0a9e864f76a35fc120
authorization SHA256 = 2040525664bb8601073b26e01afb6f8688cc2d5f4a7c3e9504cc745dfbbbca71
Stage 1 block = CONSUMED
```

The gate completed the exact source/hash/auth validation and wrote `execution-start.json` before either scientific generation job began. From this point onward, failure of production, independent replay, resource execution, artifact transfer, or exact comparison does not restore the seed block.

Current canonical jobs:

```text
production job = 99071451933 / IN PROGRESS
independent replay job = 99071451969 / IN PROGRESS
final exact comparison = pending both jobs
```

The independent replay is a required verifier replay within the same canonical workflow, not a replacement or extension.

## Frozen Stage 1 scientific design

```text
source games = 3072
fresh seeds = 28710001..28713072
selected root target = 400 / Namua 200 / Mtaji 200
root occurrence selected before D3 disadvantage screen
D3 reference disadvantage = bestScore < 0
rows = all exact root moves from selected disadvantaged roots
actor continuation = canonical D2 best
strong opponent = canonical D2 best / 1 deterministic replicate
medium opponent = seeded D1 top3 / 16 replicates
weak opponent = seeded uniform exact reply / 8 replicates
maximum post-root horizon = 96 plies
primary development target = medium bounded-win rate - strong bounded-win indicator
development model = deterministic grouped ridge regression
CV = 5-fold by historicalTrajectoryHash
```

All continuation targets are leakage class D and prohibited from predictor features.

## Immutable boundaries

`PCEM-STUDY1` remains closed with zero promoted candidates and Stage 2 not executed. `RCPR-STUDY1` remains `STAGE1-TECHNICAL-INVALID`; its consumed block cannot be repaired or re-adjudicated by PCRPR.

Machine reply pressure does not establish human difficulty, deception, human error probability, psychological pressure or expert-perceived complexity.

RAW identity remains:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn` and `reason` are excluded; no symmetry/canonicalization is authorized.

## Next permitted action

Do not alter scientific source, specification, thresholds, model, target, tolerance, or continuation policy. Observe the already-running canonical production and independent replay to completion, then apply the already-frozen exact comparer. No same-block rerun is permitted.
