# REPRODUCIBILITY_INDEX — ORISC-STUDY1

Updated: 2026-08-25  
Status: **COMPLETED / AXIS A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED` / AXIS B NOT EXECUTED**

## Study-start repository identity

```text
repository = nkkmd/bao-la-kiswahili-game
baseline main HEAD = e8f0a3c360d9e7c9f7f6882fb212a32921040912
study branch = research/oracle-representation-integrity-symmetry-confirmation
draft PR = #48
open PRs at study start = 0
```

## Current rule-engine identity bound by the formal spec

```text
public/engine.js Git blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/engine.js byte SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
```

The engine exposes `FRONT=0`, `BACK=1`, `HOUSE=4`; facing opponent front index is `7-index`. Terminal capture accounting places a removed captured quantity in `pending[player]` before winner assignment on the relevant terminal path.

## Immutable REWR identities

```text
studyId = REWR-STUDY1
domainId = REWR-S1-DOMAIN-2026-08-24-v1
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Repository-facing REWR exact-result identity at ORISC study start:

```text
Git blob = 811eb78806813d236dc91c776e1e408d4feac22e
byte SHA-256 = e8ddff92818f6192cbfdaec3cac6fed79114df377582b11bf0374cb11fd81e0d
```

## Original REWR scientific workflow provenance

```text
workflow = Restricted endgame Stage 1 exact solution
runId = 32702596730
artifactId = 9511074442
artifact name = rewr-stage1-exact-solution
artifact ZIP SHA-256 = 7da2a3f46745c18f4aa8896bc6a576b5d56b490b1461a4def3364183b047c023
workflow head SHA = 85c6a85fada301fcba526142549945e25a659855
```

Embedded scientific identities:

```text
production resultSha256 = e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
independent verification resultSha256 = 87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Recovered ZIP member byte hashes:

```text
stage1-exact-result.json = 3eacb46f2fe1720c7db8d15660f4e8c9e893a7c00c0ef035a2b2cefc759f15eb
stage1-exact-verification.json = efcfe394847c3cb06fa380c06e4374657b64254fa211b1258a153658749435d5
stage1-exact-console.json = 35862c94a1646602889a83712dde28281addbe712352d137f6743bdf454e9ed4
stage1-verification-console.json = c20542f64ae8a873285ae12e5062ef83923a8a561c326616955b9c287e326dde
```

Both original production and independent workflow files contain exactly eight state rows. All eight satisfy:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

The three later-affected terminal keys contain `pending=[1,0]` in both original files.

## Repository-facing materialization provenance

The repository-facing result first appears in commit:

```text
eb6052679e94de62bacec0eebe13758c7e85638d
parent = 85c6a85fada301fcba526142549945e25a659855
```

No artifact-to-repository materializer implementation was added in that commit. The exact mechanism producing the three changed `pending` values remains:

```text
UNRESOLVED-PROVENANCE-GAP
```

This does not modify REWR-STUDY1.

## Stage 0A technical audit

Canonical technical-only CI used for the Stage 0A audit record:

```text
runId = 32751644956
jobId = 97509741453
artifactId = 9529232934
artifact name = orisc-stage0a-technical-audit
artifact ZIP SHA-256 = ceeeeb7190a17784708d8e20f7d7d5a71910add8417b1effb2c561864b5d41af
audit JSON SHA-256 = 290aec0eab51226695a1f4d0246cd40b5366a6ffa2ec107646f6cdb7b7fb1914
```

Observed technical provenance:

```text
original production rows = 8
original independent rows = 8
original production/independent full-row equality = true
original represented seed totals = {64}
repository represented seed totals = {63,64}
repository stored-key mismatch rows = 3
repository/original row-difference count = 3
identity-field differences = pending only
outcome-field differences = 0
```

No formal ORISC Axis A result was generated in Stage 0A.

## Pre-outcome Stage 2 candidate contract

The conditional Stage 2 contract was frozen before Axis A outcome generation:

```text
candidateContractSha256 = 6509dc18553d968437d87f7522cacebb4b66f13f15469240075964b72f1c8796
controls = ORISC-C00-IDENTITY / ORISC-C01-LR-NO-DIRECTION-FLIP
scientific candidates = ORISC-T01 / ORISC-T02 / ORISC-T03
fresh seeds = 23110001..23110128
maximum trajectory ply = 160
roots per stratum = 12
local expansion depth = 4
strata = namua / mtaji / mtaji-houseless
```

No Stage 1 result existed when this contract was frozen.

## Stage 0B technical prefreeze

Final workflow-bound prefreeze evidence:

```text
stageId = ORISC-STAGE0B-PREFREEZE-2026-08-25-v2
runId = 32752858110
jobId = 97513606755
artifactId = 9529690660
artifact ZIP SHA-256 = 6305da6b61c1eaa296ca65696c51f81a0e2eb62072dc5aa1bae4e7c9555e06ec
result JSON SHA-256 = ce37364ad472903bc6449ff402b527e2a5a193a28f2196c3ec2b2ebc1756d581
```

Both independent tracks reproduced the same immutable raw graph and all represented seed totals were 64. Repository-facing semantic gates A-G8/A-G9/A-G11 were intentionally not evaluated in prefreeze.

## Stage 1 frozen formal contract

A first spec freeze was never authorized and produced no scientific outcome. It was superseded before authorization solely to bind the already-defined formal workflow by byte SHA-256.

```text
priorSpecSha256 = 7ebc1cfc5e7b6e503fb8351d7748002809a3cdf2cd4c38ad7b8fb235fdc1d2be
priorSpecAuthorized = false
scientificOutcomeGeneratedUnderPriorSpec = false
```

Final frozen identities:

```text
stageId = ORISC-S1-REPRESENTATION-INTEGRITY-2026-08-25-v1
specSha256 = 5a766ec900c1f76c5b832f2c76153b9426b3970316b31806d377c497d1e585e5
formal workflow SHA-256 = 0f5e5da13e84e9511a477a8fdfc01133e3a36cc08e908e16a31b71517e3b429f
candidateContractSha256 = 6509dc18553d968437d87f7522cacebb4b66f13f15469240075964b72f1c8796
```

Final spec freeze validation:

```text
runId = 32752984778
artifactId = 9529734028
artifact ZIP SHA-256 = 38def67acb004b76cd014f3f419dee73022fb77812896520f824c2d9fc0cc50c
validation JSON SHA-256 = 059e0eef5ada46b89c1e0589fc5032d4503b7d4aaad894337a66d7cb4383881c
sourceChecksPassed = true
scientificOutcomeGenerated = false
```

## Stage 1 authorization

```text
authorizationId = ORISC-S1-REPRESENTATION-INTEGRITY-AUTH-2026-08-25-v1
authorizationSha256 = b8bc9c65510c2f4ea0909e269af7945d7ae5d3d32b595224519b1549a275325e
stage2ExecutionAuthorized = false
upstreamOracleMutationAuthorized = false
```

The authorization permitted only the frozen Axis A Stage 1 endpoint.

## Formal Stage 1 workflow

```text
runId = 32753073798
jobId = 97514309075
artifactId = 9529771157
artifact name = orisc-stage1-formal
artifact ZIP SHA-256 = 13844208eeaaa4ae8eedc35724a0d71ed043f982cfaaa48cf1d692133d74d6e8
```

Production and independent result identities:

```text
production resultSha256 = 03b112ba6dc1b79d65e4bfd3dbba603f0a20d0f3e16ab9d98a37e9bf50f6afe9
independent verification resultSha256 = 3501a65b4920e9ae44f55e2a46da370f750cbac01c1293398dc7b020cdae4bcf
production file SHA-256 = 37677f98a735f937e43261e94bc51b9baad5051b16d7b458f5e261bc8bc7528a
independent verification file SHA-256 = b0066c929915aec0bef9d1c276d1a479ee65503ed07beda789e938b5e4ead517
```

Formal gate result:

```text
PASS = A-G1 A-G2 A-G3 A-G4 A-G5 A-G6 A-G7 A-G10 A-G12
FAIL = A-G8 A-G9 A-G11
formalDecision = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
```

Canonical repository Axis A result:

```text
results/STAGE_1_FORMAL_RESULT.json
Git blob = af6aa43fd47de9bcf70101c6aa1cc88cae5b028e
```

Study-level closure:

```text
results/STUDY_1_FINAL_RESULT.json
Git blob = d87a5a2b722e96cb0b4a81b354ff8d8a80f38942
studyStatus = COMPLETED
Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
```

## Axis B / Stage 2 reproducibility state

The candidate contract exists because it was frozen before Axis A outcome, but the following intentionally do not exist:

```text
Stage 2 formal authorization = NONE
Stage 2 production result = NONE
Stage 2 independent verification = NONE
Stage 2 candidate decisions = NONE
```

This is the required result of the frozen authorization gate, not missing experimental work.

## Final downstream boundary

```text
validated symmetry transformation set = []
canonicalization authorized = false
symmetry-group claim authorized = false
symmetry-reduced state counting authorized = false
raw state identity authoritative = true
State Space / Game Tree Complexity may proceed = RAW-ONLY
```

No further scientific outcome generation is authorized within ORISC-STUDY1.