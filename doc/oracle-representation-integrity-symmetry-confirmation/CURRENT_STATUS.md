# CURRENT_STATUS — ORISC-STUDY1

Updated: 2026-08-25  
Status: **COMPLETED / AXIS A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED` / AXIS B `NOT-AUTHORIZED-NOT-EXECUTED`**

## Repository state

```text
repository = nkkmd/bao-la-kiswahili-game
baseline main HEAD at study start = e8f0a3c360d9e7c9f7f6882fb212a32921040912
study branch = research/oracle-representation-integrity-symmetry-confirmation
integration PR = #48
studyId = ORISC-STUDY1
```

Repository integration through PR `#48` was explicitly authorized by the user on 2026-08-25 after final documentation and CI review. The PR / `main` history is the authoritative record of the resulting merge state; the scientific closure recorded below does not depend on branch-lifecycle metadata.

## Immutable upstream scientific state

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

No REWR state/edge/value/DTF/optimal-move claim or formal decision is changed.

### SIP-STUDY1

```text
studyStatus = COMPLETED
formalDecision = NON-ESTIMABLE
validated = 0
rejected = 0
nonEstimable = 5
v1 = TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION
corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
```

No SIP candidate is rescued, validated, or rejected by ORISC-STUDY1.

## Stage 0A — complete

The original REWR scientific workflow artifact was recovered read-only. Original production and independent verification rows were exactly equal, all eight raw states represented 64 seeds, and the three terminal keys later implicated in repository-row reconstruction contained `pending=[1,0]` in both original workflow files.

The later repository-facing exact result contains `pending=[0,0]` for those same three rows. Stage 0A bounded the difference to `pending` only, with no outcome-field differences. The materialization mechanism remains:

```text
UNRESOLVED-PROVENANCE-GAP
```

Stage 0A generated no ORISC formal decision.

## Stage 0B — complete

Before Stage 1 outcome generation, the following were frozen:

- strict raw identity fields and serializer contract;
- 64-seed conservation rule including `pending`;
- production / independent implementation boundary;
- Stage 1 A-G1..A-G12 gates and decision rules;
- conditional Stage 2 candidate definitions, population, controls and stop rules.

Frozen Stage 2 candidate-contract identity:

```text
6509dc18553d968437d87f7522cacebb4b66f13f15469240075964b72f1c8796
```

Final Stage 1 spec identity:

```text
5a766ec900c1f76c5b832f2c76153b9426b3970316b31806d377c497d1e585e5
```

A pre-authorization spec revision only added the already-defined formal workflow byte hash. It changed no endpoint, population, identity field, gate, candidate, seed block, threshold or decision rule.

## Stage 1 — formal Axis A complete

Authorization:

```text
authorizationId = ORISC-S1-REPRESENTATION-INTEGRITY-AUTH-2026-08-25-v1
authorizationSha256 = b8bc9c65510c2f4ea0909e269af7945d7ae5d3d32b595224519b1549a275325e
```

Canonical authorized workflow:

```text
runId = 32753073798
jobId = 97514309075
artifactId = 9529771157
artifact ZIP SHA-256 = 13844208eeaaa4ae8eedc35724a0d71ed043f982cfaaa48cf1d692133d74d6e8
production resultSha256 = 03b112ba6dc1b79d65e4bfd3dbba603f0a20d0f3e16ab9d98a37e9bf50f6afe9
independent verification resultSha256 = 3501a65b4920e9ae44f55e2a46da370f750cbac01c1293398dc7b020cdae4bcf
```

Formal decision:

```text
ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
```

Gate summary:

```text
PASS = A-G1 A-G2 A-G3 A-G4 A-G5 A-G6 A-G7 A-G10 A-G12
FAIL = A-G8 A-G9 A-G11
```

Production and independent implementations both reconstructed the exact frozen 8-state / 7-edge raw graph, agreed on serialization and state keys, preserved 64 represented seeds, reproduced terminal captured/pending accounting, and found zero transition-successor mismatches.

Exactly three immutable repository-facing terminal rows failed both stored-row re-hash and raw-state binding:

```text
469b78a1f818f32d52f8da9c023b2b54378e34fccd2dde752a32581a12a016e6
75ca44183c7d5abd62c32342e31620b1d485b41d91f0e7ffcfb7dace9097c4ed
df0077b343b09d6f66d45159eead1be244479677b5fb75275b1ce76f5021db55
```

For all three:

```text
repository represented seeds = 63
reconstructed represented seeds = 64
identity-field difference = pending only
```

Because repository reconstruction was a mandatory part of `ORISC-C00-IDENTITY`, `A-G11=FAIL`. Because production and independent implementations agreed on all failure locations and gate classifications, `A-G12=PASS`; the result is therefore `NOT-CONFIRMED`, not `NON-ESTIMABLE`.

## Axis B — closed without execution

The conditional Stage 2 contract required all of:

```text
Stage 1 = ORACLE-REPRESENTATION-INTEGRITY-CONFIRMED
A-G11 IDENTITY = PASS
A-G12 production/independent equality = PASS
separate Stage 2 authorization = present and valid
```

The first two conditions failed. Therefore:

```text
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
nontrivial candidate formal decisions generated = 0
candidate validations = 0
candidate rejections = 0
candidate non-estimable decisions = 0
```

No Stage 2 authorization or result was created.

## Stage 3 / downstream contract

```text
validated symmetry transformation set = []
canonicalization = NOT AUTHORIZED
symmetry-group claim = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
raw state identity = authoritative downstream representation
State Space / Game Tree Complexity may proceed = RAW-ONLY
```

A future study must not interpret the ORISC result as evidence that the frozen nontrivial symmetry candidates are false. They were not formally evaluated.

## Post-closure execution lock

During final documentation audit, GitHub PR `pull_request.paths` semantics caused a documentation-only PR synchronization to trigger the already-consumed Stage 1 formal workflow once more. The duplicate run was:

```text
runId = 32797248144
jobId = 97650964412
artifactId = 9545248579
artifact ZIP SHA-256 = 1b339c75af3ee7a514a04c51902934c8b0930d792cfcc19f8c320cae181053e0
classification = POST-CLOSURE-AUTOMATIC-DUPLICATE / NON-CANONICAL / NO-NEW-SCIENTIFIC-EVIDENCE
```

It reproduced the already-canonical decision and exact scientific result identities:

```text
formalDecision = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
production resultSha256 = 03b112ba6dc1b79d65e4bfd3dbba603f0a20d0f3e16ab9d98a37e9bf50f6afe9
independent verification resultSha256 = 3501a65b4920e9ae44f55e2a46da370f750cbac01c1293398dc7b020cdae4bcf
A-G12 = PASS
IDENTITY = FAIL
Stage 2 authorized = false
```

This duplicate does not expand, replace, or re-estimate the evidence set. The canonical formal run remains `32753073798` / artifact `9529771157` only.

To enforce the closure firewall, all four ORISC GitHub Actions workflows were subsequently converted to closed-study archival stubs. They no longer auto-run on push or pull request and no longer execute ORISC scientific tooling. The executable formal workflow used by the canonical result remains preserved in Git history and is bound by the frozen pre-outcome workflow SHA-256 `0f5e5da13e84e9511a477a8fdfc01133e3a36cc08e908e16a31b71517e3b429f`.

Current workflow-file bytes are therefore intentionally post-closure archival state and are not expected to equal the frozen historical executable workflow hash.

## Canonical conclusion documents

- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `results/STAGE_1_FORMAL_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`
- `REPRODUCIBILITY_INDEX.md`
- `DECISION_REGISTER.md`

No further scientific outcome generation is authorized within ORISC-STUDY1.