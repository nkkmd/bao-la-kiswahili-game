# CURRENT_STATUS — ORISC-STUDY1

Updated: 2026-08-25  
Status: **STUDY INITIALIZED / STAGE 0A OPEN / FORMAL OUTCOME GENERATION BLOCKED**

## Repository state at study start

```text
repository = nkkmd/bao-la-kiswahili-game
main HEAD = e8f0a3c360d9e7c9f7f6882fb212a32921040912
open PRs at start = 0
study branch = research/oracle-representation-integrity-symmetry-confirmation
studyId = ORISC-STUDY1
```

The GitHub connector exposes the remote repository state, not a local checkout worktree. No local uncommitted worktree state is asserted here.

## Upstream scientific state restored

### REWR-STUDY1

```text
formalDecision = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
states = 8
edges = 7
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

No REWR formal claim is reopened.

### SIP-STUDY1

```text
studyStatus = COMPLETED
formalDecision = NON-ESTIMABLE
validated = 0
notValidated = 0
nonEstimable = 5
v1 = TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION
corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
```

No SIP candidate is validated, rejected, or rescued by this study.

## Stage 0A technical provenance recovery completed so far

The original REWR Stage 1 workflow artifact was recovered from:

```text
workflow run = 32702596730
artifact id = 9511074442
artifact digest = sha256:7da2a3f46745c18f4aa8896bc6a576b5d56b490b1461a4def3364183b047c023
workflow head = 85c6a85fada301fcba526142549945e25a659855
```

Recovered files include the original production exact result and independent verification.

For all eight states in both original raw files:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

The three terminal keys later identified by SIP as repository-row mismatches carry `pending=[1,0]` in both original production and independent workflow artifacts:

```text
469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
75ca44183c7d5abd62c32342e31620b1d485b41d91f0e7ffcfb7dace9097c4ed
df0077b343b09d6f66d45159eead1be244479677b5fb75275b1ce76f5021db55
```

The repository-facing `doc/restricted-endgame-winning-regions/results/STAGE_1_EXACT_RESULT.json` instead stores `pending=[0,0]` in those three rows.

The commit that introduced the repository-facing result is:

```text
eb6052679e94de62bacec0eebe13758c7e85638d
```

Its parent is `85c6a85fada301fcba526142549945e25a659855`. The commit adds/modifies documentation, checkpoints and the repository result; no result-materializer source file was introduced in that commit. This establishes a provenance gap between the verified workflow raw artifact and the repository-facing transcription/materialization step. It does not by itself establish the mechanism that caused the row differences.

This is **prior technical provenance**, not a Stage 1 scientific integrity decision.

## Current engine semantics re-audited

Current `public/engine.js` confirms:

```text
FRONT = 0
BACK = 1
HOUSE = 4
opposite front index = 7 - index
initial pending = [0,0]
```

`finishOnEmptyFront(state, player, captured, events)` adds the captured amount to `pending[player]` before setting `winner` and `reason="front-empty"`.

Primary raw identity in the existing exact tooling includes:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

and excludes `turn` / `reason` from the state key.

## Current authorization state

```text
Stage 0A technical provenance work = authorized
Stage 0B contract design = authorized
Stage 1 formal scientific outcome generation = NOT AUTHORIZED
Stage 2 symmetry scientific outcome generation = NOT AUTHORIZED
Stage 3 canonicalization decision = NOT AUTHORIZED
```

## Next required work

1. complete Stage 0A serializer/materialization provenance audit;
2. define synthetic terminal/pending fixtures independent of the oracle rows;
3. define production/independent code-separation rules;
4. perform repository-wide seed/source collision audit for any future fresh Stage 2 population;
5. freeze Stage 1 machine-readable spec and the conditional Stage 2 candidate contract before inspecting any new Stage 1 result;
6. create a separate Stage 1 authorization only after all frozen hashes pass validation.

No formal result artifact exists for `ORISC-STUDY1`.