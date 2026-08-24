# REPRODUCIBILITY_INDEX — ORISC-STUDY1

Updated: 2026-08-25  
Status: **INITIALIZED / PRIOR PROVENANCE RECOVERED / NO FORMAL ORISC RESULT**

## Study-start repository identity

```text
repository = nkkmd/bao-la-kiswahili-game
baseline main HEAD = e8f0a3c360d9e7c9f7f6882fb212a32921040912
study branch = research/oracle-representation-integrity-symmetry-confirmation
open PRs at start = 0
```

## Current rule-engine identity

```text
public/engine.js Git blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
```

The current engine exposes `FRONT=0`, `BACK=1`, `HOUSE=4`; facing opponent front index is `7-index`; terminal capture accounting adds the removed captured amount to `pending[player]` before winner assignment in `finishOnEmptyFront`.

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

Canonical repository result Git blob at study start:

```text
811eb78806813d236dc91c776e1e408d4feac22e
```

## Original REWR scientific run provenance

```text
workflow = Restricted endgame Stage 1 exact solution
runId = 32702596730
artifactId = 9511074442
artifact name = rewr-stage1-exact-solution
artifact ZIP SHA-256 = 7da2a3f46745c18f4aa8896bc6a576b5d56b490b1461a4def3364183b047c023
workflow head SHA = 85c6a85fada301fcba526142549945e25a659855
```

Recovered local file byte hashes from the downloaded artifact:

```text
stage1-exact-result.json
358? NO — see note below
```

The authoritative scientific identity is the embedded production `resultSha256`, not the ZIP member byte hash:

```text
production resultSha256 = e581236b94ca74f6e681a363c15e0c6f8ef6851dcadf4856b0637e277d8fd603
independent verification resultSha256 = 87ab7d7fa44820d1c6b524481da1f1faa377c38a1d2509d172044d35028dad52
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

Downloaded ZIP member byte hashes observed during Stage 0A recovery:

```text
stage1-exact-result.json = 3eacb46f2fe1720c7db8d15660f4e8c9e893a7c00c0ef035a2b2cefc759f15eb
stage1-exact-verification.json = efcfe394847c3cb06fa380c06e4374657b64254fa211b1258a153658749435d5
stage1-exact-console.json = 35862c94a1646602889a83712dde28281addbe712352d137f6743bdf454e9ed4
stage1-verification-console.json = c20542f64ae8a873285ae12e5062ef83923a8a561c326616955b9c287e326dde
```

## Original raw-state provenance finding

Both original production and independent workflow files contain exactly eight state rows. For every row:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

For the three terminal raw keys later identified by SIP's repository-row diagnostic:

```text
469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
75ca44183c7d5abd62c32342e31620b1d485b41d91f0e7ffcfb7dace9097c4ed
df0077b343b09d6f66d45159eead1be244479677b5fb75275b1ce76f5021db55
```

both original files contain:

```text
pending = [1,0]
represented seed total = 64
```

The repository-facing result stores `pending=[0,0]` in those rows.

## Repository result materialization provenance

The repository-facing exact result first appears in commit:

```text
eb6052679e94de62bacec0eebe13758c7e85638d
parent = 85c6a85fada301fcba526142549945e25a659855
message = Research: record verified Stage 1 bounded exact oracle
```

Changed paths in that commit are limited to Restricted Endgame documentation, checkpoint files and repository result files. No result-materializer source file was added in the same commit. This is a provenance gap to be resolved in Stage 0A; it is not yet a formal representation-integrity result.

## SIP prior diagnostic provenance

```text
studyId = SIP-STUDY1
formal closure = 0 validated / 0 rejected / 5 NON-ESTIMABLE
read-only diagnostic workflow run = 32728619101
stored-key mismatch rows = 3
production/independent recomputed-key disagreements = 0
seed totals observed in repository rows = 63,64
recomputed transitions = 7
successor escapes stored key set = 0
```

These are prior observations only.

## ORISC authorization identities

Not yet created:

```text
Stage 1 formal spec SHA = NONE
Stage 1 authorization SHA = NONE
Stage 1 formal result SHA = NONE
Stage 2 candidate contract SHA = NONE
Stage 2 formal spec SHA = NONE
Stage 2 authorization SHA = NONE
Stage 2 result SHA = NONE
```

No formal scientific outcome may be generated while these remain absent.