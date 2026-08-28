# DRSSE-STUDY1 — Protocol

## 1. Study identity

```text
Program = G2-05
Study ID = DRSSE-STUDY1
Research Generation = Research Generation 2
Formal title = Deep RAW State-Space Enumeration Study 1
Baseline main = c515c36a9b27a796dc7eae13fd1b2cec2b9d3ea6
Branch = research/g2-05-deep-raw-state-space-enumeration
```

The prospective authority is `preregistration/STUDY_START_FREEZE.md`.

## 2. Scientific target

The formal target is the standard engine initial RAW state through exact path depth 9. Every exact-depth layer `U_0..U_9` must be complete. All legal edges from exact-depth parent layers `0..8` must be exhaustively generated.

The formal claim is bounded only. No full-game state-space or asymptotic inference is authorized.

## 3. RAW identity

Identity fields:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

Excluded:

```text
turn,reason
```

`pending` is mandatory and no default repair is allowed. Seed conservation must equal 64 before and after every studied transition.

## 4. Move identity

Exact move key fields, in order:

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

Moves are sorted lexicographically by exact move key before expansion. States in a layer are sorted by RAW key before expansion. This ordering is deterministic and scientifically neutral.

## 5. Graph semantics

For each depth `d`:

- `uniqueRawStateCount[d] = |U_d|`;
- `newRawStateCount[d] = |U_d \ (U_0 ∪ ... ∪ U_{d-1})|`;
- `cumulativeRawStateCount[d] = |U_0 ∪ ... ∪ U_d|`;
- `legalEdgeCount[d]` is the number of exact move-labelled edges generated from unique RAW states in `U_d`;
- a depth-labelled edge identity is `(d, source RAW key, move key, successor RAW key)`;
- a global RAW graph edge identity omits `d` and is `(source RAW key, move key, successor RAW key)`.

A state may occur in multiple exact-depth layers. This is not canonicalization or duplication error.

## 6. Tree semantics

Tree occurrences are path occurrences and are not deduplicated. For each exact-depth state, the production enumerator propagates its exact path-occurrence multiplicity through every legal move. Counts are integer-exact and serialized as decimal strings when needed.

Endpoints include:

- `treeNodeOccurrences[d]`;
- cumulative tree node occurrences;
- tree edge occurrences from depth `d`;
- `treeNodeOccurrences[d] / uniqueRawStateCount[d]` when numerically representable;
- cumulative tree/RAW union occurrence ratio.

The production runner may use exact multiplicity dynamic programming rather than materializing every path, provided the independent verifier reruns the same frozen game domain independently and confirms all exact counts.

## 7. Branching endpoints

For each complete parent layer:

- legal move count per unique RAW state;
- mean and median legal branching;
- branching histogram;
- zero-legal-move nonterminal count;
- terminal parent count.

## 8. Transposition endpoints

For each complete child layer:

- arrival edge count;
- `duplicateArrivalCount = arrival edges - unique child states`;
- states with at least two distinct predecessor RAW states;
- distinct-predecessor multiplicity histogram;
- edge-arrival multiplicity histogram;
- layer tree/graph occurrence ratio.

Only authoritative RAW identity is used for transposition detection.

## 9. Phase endpoints

Each complete layer reports mutually exclusive composition:

```text
namuaNonterminal
mtajiNonterminal
terminal
```

These are secondary descriptive endpoints and are not promoted post hoc to primary endpoints.

## 10. Complete-layer exactness

Depth 0 is complete after validated root materialization. Layer `d+1` becomes complete only after every legal move of every state in complete layer `d` has been generated, successor-bound, validated, and retained under the frozen identity.

If a stop occurs during expansion of parent layer `d`:

```text
lastCompleteDepth = d
firstIncompleteDepth = d + 1
```

Statistics requiring the incomplete child layer or incomplete parent-edge set are marked censored/not exact.

## 11. Resource/stopping taxonomy

Frozen ceilings are defined in `STUDY_START_FREEZE.md` and repeated in the Stage 2 formal spec before authorization.

Stop classifications:

```text
UNIQUE_STATE_CAP -> RESOURCE-LIMIT
DEPTH_LABELLED_EDGE_CAP -> RESOURCE-LIMIT
PARENT_EXPANSION_CAP -> RESOURCE-LIMIT
MOVE_EVALUATION_CAP -> RESOURCE-LIMIT
TREE_OCCURRENCE_CAP -> RESOURCE-LIMIT
RSS_CAP -> RESOURCE-LIMIT
ARTIFACT_BYTE_CAP -> RESOURCE-LIMIT
WALL_CLOCK_CAP -> ADMIN-CUTOFF
```

The first applicable stop wins. No partial layer is promoted.

## 12. Stage 0 — `DRSSE-S0-TECHNICAL-2026-08-28-v1`

Technical-only objectives:

- RAW validator and fail-closed `pending` handling;
- deterministic exact-depth enumerator;
- source/move/successor binding;
- layer accounting;
- predecessor and transposition accounting;
- tree multiplicity accounting;
- deterministic serialization and hashes;
- resource counters and stop classification;
- separate-process independent verifier.

The immutable G1 SSGTC standard-root depth-2 result (19 states / 18 transitions and its hashes) may be used only as a positive technical fixture.

Required negative controls include missing `pending`, RAW-key corruption, missing successor, missing edge, depth misassignment, unique-state accounting corruption, tree-occurrence undercount, and predecessor-accounting corruption.

Stage 0 emits no scientific G2-05 evidence.

## 13. Stage 1 — `DRSSE-S1-DEVELOPMENT-2026-08-28-v1`

Fresh development seed block:

```text
28050001..28050064
```

Trajectory generation uses a frozen deterministic PRNG and sorted legal move list. Development roots are selected outcome-blind by seed order:

- first 3 distinct nonterminal Namua RAW states observed after exactly 12 plies;
- first 3 distinct nonterminal Mtaji RAW states observed at the first Mtaji position at or after ply 44;
- all roots must be distinct from the standard initial RAW key;
- duplicate root keys are skipped without replacement outside the reserved seed block.

Each selected root is locally completely enumerated through depth 5 under development caps:

```text
max distinct RAW states/root = 50000
max depth-labelled edges/root = 250000
max parent expansions/root = 50000
max move evaluations/root = 250000
max cumulative tree-node occurrences/root = 100000000
max RSS = 3221225472 bytes
max wall clock total = 600 seconds
max uncompressed artifact bytes = 268435456
```

Readiness requires exactly 3 Namua + 3 Mtaji roots, all six local domains complete through depth 5, zero representation/binding/hash mismatches, and complete independent verification. Stage 1 is development-only and never formal evidence.

Failure closes Stage 1 as `STAGE1-DEVELOPMENT-BLOCKED`; Stage 2 is then not authorized. The already frozen formal target/caps are not changed.

## 14. Stage 2 — `DRSSE-S2-FORMAL-2026-08-28-v1`

Stage 2 runs only after:

1. Stage 0 technical PASS;
2. Stage 1 readiness PASS;
3. formal spec with exact source/blob hashes is committed;
4. explicit authorization commit exists before outcome generation.

The formal runner may not read Stage 1 artifacts.

## 15. Independent verification

The Stage 2 verifier must not import the production representation/enumerator module. It must independently implement RAW serialization, RAW key generation, move normalization/keying, exact-depth expansion, tree multiplicity propagation, and aggregate/hash calculation.

It must verify:

- root RAW identity/hash;
- every materialized state row key;
- every edge source/move/successor binding;
- per-depth complete state sets;
- per-depth edge sets;
- per-depth and cumulative counts;
- tree occurrence counts;
- predecessor/transposition summaries;
- phase counts;
- layer/global hashes;
- resource-stop classification;
- result-core hash.

No formal exact decision exists until independent verification passes.

## 16. Formal decision rule

If all complete-layer, integrity, provenance, resource, and independent-verification gates pass through depth 9:

```text
EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

If technical integrity remains valid but a frozen resource/admin ceiling prevents complete depth-9 enumeration:

```text
NOT-EXACTLY-ENUMERATED
```

with technical stop classification `RESOURCE-LIMIT` or `ADMIN-CUTOFF`.

If formal scientific endpoints cannot be established because of a technical/integrity/verification defect after formal execution begins:

```text
NON-ESTIMABLE
```

with a separate technical classification such as `TECHNICAL-INVALID` or `VERIFICATION-FAILED`.

If Stage 2 is never authorized, the Study closes `INCONCLUSIVE` / `NOT-AUTHORIZED-NOT-EXECUTED`.

## 17. Interpretation boundary

Authorized only within completely enumerated, independently verified frozen layers. Not authorized:

- `Bao state space = X`;
- full-game game-tree complexity;
- extrapolated total state count;
- asymptotic growth model;
- symmetry-reduced/canonical state count;
- game-theoretic value claim;
- reinterpretation of G1 SSGTC or G2-04.
