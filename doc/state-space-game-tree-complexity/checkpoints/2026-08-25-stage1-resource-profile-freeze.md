# SSGTC-STUDY1 — Stage 1 Exploratory Resource Profile Freeze

Date: 2026-08-25
Status: frozen before any Stage 1 exploratory outcome generation

## Authorization boundary

Stage 0 has passed. This checkpoint authorizes one Stage 1 exploratory execution under the numeric caps below.

```text
scientificInference = NOT-AUTHORIZED
exploratoryCharacterization = AUTHORIZED
formalReuseInStage2 = PROHIBITED
symmetryReduction = PROHIBITED
canonicalization = PROHIBITED
estimation = NOT-AUTHORIZED
```

Stage 1 will regenerate its own corpus under namespace `SSGTC-S1-EXPLORATORY-2026-08-25-v1`. No Stage 0 artifact row is reused as a Stage 1 observation. The logical Bao initial state may be regenerated from `engine.initialState()` because it is the target anchor, but its Stage 1 row/key is generated fresh inside the Stage 1 corpus.

## Frozen graph-expansion caps

Deduplicated raw-state BFS:

```text
root = fresh engine.initialState()
maxGraphDepth = 12
maxUniqueRawStates = 100000
maxGeneratedEdges = 500000
maxFrontierStates = 50000
```

A raw state is deduplicated only by authoritative SSGTC raw identity:
`pits,reserve,houseOwned,player,phase,winner,pending`.

## Frozen game-tree caps

Non-deduplicated occurrence expansion:

```text
root = independently regenerated engine.initialState()
maxTreeDepth = 8
maxTreeNodeOccurrences = 250000
maxTreeEdgeOccurrences = 250000
```

Tree occurrence identity is path/occurrence identity and must never be substituted for raw-state identity.

## Frozen global resource caps

```text
maxWallClockSeconds = 600
maxResidentSetBytes = 4294967296
maxUncompressedArtifactBytes = 134217728
```

The run stops at the first applicable cap. These caps are not targets and may not be raised after Stage 1 scientific-pattern inspection.

## Layer-completion rule

For graph BFS, a depth is `fullyExpanded` only if every state in that depth's frontier has had its complete legal move-variant set generated and all resulting transition occurrences recorded before any cap stops the run.

If a cap is reached while expanding depth `d`, then:

```text
lastFullyExpandedDepth <= d-1
partialExpansionDepth = d
```

States already discovered in depth `d+1` are observed/censored only. They must not be used as a bounded-exact complete depth layer.

For the tree mode, the same rule applies to occurrence layers.

## Mandatory recorded quantities

The production run must record, separately for graph and tree where applicable:

- cap reached and stop reason;
- last fully expanded depth;
- partial expansion depth, if any;
- raw unique states by minimum BFS depth;
- cumulative unique-state growth;
- phase and terminal counts;
- legal move-variant count distribution for fully expanded graph states;
- arithmetic mean branching for fully expanded nonterminal states;
- forced single-move proportion;
- capture-forced versus non-capture-choice classification under engine legality semantics;
- generated edge occurrences;
- duplicate raw-state encounters;
- unique/raw-generated ratio;
- in-degree and multi-parent structure;
- maximum frontier;
- tree node/edge occurrences by depth;
- wall clock, CPU usage if available, peak observed RSS, and artifact bytes.

No estimator or confidence interval is authorized in Stage 1.

## Integrity gates

Stage 1 is technically acceptable only if all of the following hold:

1. every admitted state passes explicit raw shape validation before engine entry;
2. missing `pending` is never repaired and is hard-rejected;
3. every admitted pre/post transition state conserves 64 represented seeds;
4. production and independent serializers produce the same key for every materialized raw state;
5. transition replay binds to the emitted child key for all materialized graph transitions;
6. duplicate counts are independently recomputed from emitted records;
7. BFS reachability/minimum-depth structure is independently reconstructed from emitted transitions;
8. aggregate state/edge/depth/branching/transposition statistics are independently recomputed from materialized raw records wherever possible;
9. raw artifact and reporting projection remain distinct;
10. post-write re-open/re-hash/semantic checks pass;
11. no symmetry transform or canonicalization is called;
12. the separate verifier does not import the production serializer or production expansion module.

An unresolved failure blocks Stage 2 promotion.

## Stage 2 feasibility rule frozen before Stage 1 outcomes

Stage 2 design may begin only if Stage 1 has at least **4 fully expanded graph depths beyond the root** and at least **4 fully expanded tree depths beyond the root**, with all integrity gates passing.

If either mode fails this minimum because of resources, representation, replay, materialization, or independent verification, Stage 2 remains not authorized in this Study 1. No cap increase or alternative favorable subset is permitted as a rescue.

Passing this feasibility rule does not authorize Stage 2 execution; it only permits a separate prospective Stage 2 specification to be written and frozen.
