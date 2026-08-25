# SSGTC-STUDY1 — Current Status

Updated: 2026-08-25

```text
studyStatus = COMPLETED
currentStage = STUDY-1-CLOSURE
formalDecision = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
representation = RAW-ONLY
symmetryReductionUsed = false
canonicalizationUsed = false
estimationAuthorized = false
stage0 = SSGTC-STAGE0-PASS (TECHNICAL-ONLY)
stage1 = EXPLORATORY-ONLY / TECHNICAL-ACCEPTANCE-PASS
stage2 = FORMAL-STAGE-COMPLETE
mergeToMain = NOT-YET-PERFORMED
```

## Baseline

```text
remoteMainAtStudyStart = 9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901
studyBranch = research/state-space-game-tree-complexity
studyId = SSGTC-STUDY1
```

## Formal result

The prospectively frozen Stage 2 domain was the standard engine initial state, complete raw-state reachability through depth 8 with all parent states at depths 0..7 expanded, and a separate non-deduplicated game tree through depth 8.

```text
reachableRawStatesThroughDepth8 = 24848
graphTransitionOccurrencesParentDepth0Through7 = 25648
duplicateEncounters = 801
multiParentStates = 763
maxIndegree = 4

gameTreeNodeOccurrencesThroughDepth8 = 30941
gameTreeEdgeOccurrencesThroughDepth8 = 30940
rawStateToTreeNodeRatioThroughDepth8 = 0.803076823632074
```

Exact set identities:

```text
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
treeOccurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

Canonical formal provenance:

```text
workflowRunId = 32805975114
workflowJobId = 97676042161
artifactId = 9548146194
artifactZipSha256 = 713e258847a98e9b01866bae248f0986708f8ef90df803157514c63469b52e15
independentVerification = PASS
```

## Frozen upstream boundaries

Restricted Endgame / Winning Regions Study 1 remains `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` for its frozen 8-state / 7-edge domain only.

Symmetry / Isomorphic Positions Study 1 remains 0 validated / 0 rejected / 5 `NON-ESTIMABLE`; corrected v2 remains not authorized and not executed.

ORISC-STUDY1 remains Axis A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED` and Axis B `NOT-AUTHORIZED-NOT-EXECUTED`. The validated symmetry transformation set remains empty.

## Representation boundary

Authoritative identity remains:

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
pending = mandatory
sum(pits)+sum(reserve)+sum(pending) = 64
```

No symmetry reduction, canonicalization, or estimator was used.

## Interpretation boundary

Authorized:

- exact claim for the frozen depth-8 RAW-ONLY domain;
- exact bounded graph/tree counts and hashes reported in the canonical result;
- descriptive branching/transposition summaries for the completely expanded bounded domain.

Not authorized:

- `Bao state space = 24848`;
- exact full-game state-space or game-tree claim;
- extrapolation of the depth-8 ratio/growth law to the full game;
- symmetry-reduced counting or canonicalization;
- a full-game state-space estimator;
- reinterpretation or rescue of upstream studies.

## Integration state

Study work and study-level documentation are complete subject to final repository-wide documentation/CI audit. PR #49 must remain unmerged until that audit passes and the user explicitly authorizes integration. Auto-merge remains prohibited.