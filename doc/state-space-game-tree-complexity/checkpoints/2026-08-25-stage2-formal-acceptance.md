# SSGTC-STUDY1 — Stage 2 Formal Acceptance

Date: 2026-08-25

## Formal decision

```text
formalDecision = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
exactTargetComplete = true
estimationAuthorized = false
symmetryReductionUsed = false
canonicalizationUsed = false
```

Canonical workflow:

```text
run = 32805975114
job = 97676042161
head = cf0bb5709ea211e8c44839c1170b4c5698c65031
production = PASS
independent verification = PASS
artifact = 9548146194
artifact ZIP SHA-256 = 713e258847a98e9b01866bae248f0986708f8ef90df803157514c63469b52e15
```

The downloaded artifact ZIP was independently SHA-256 checked after download and matched GitHub's recorded digest.

## Frozen graph domain

The exact graph claim is limited to:

```text
root = fresh engine.initialState()
identity = pits,reserve,houseOwned,player,phase,winner,pending
parent depths fully expanded = 0..7
reachable minimum-BFS state depths enumerated = 0..8
symmetry/canonicalization = none
```

Exact result:

```text
reachable raw states through depth 8 = 24848
transition occurrences from parent depths 0..7 = 25648
duplicate encounters = 801
multi-parent states = 763
max indegree = 4
stateSetSha256 = 8215be574a04177710b479faffb70084920d79fd2449c56802d0584853c05ca9
transitionSetSha256 = f0e57235a6611b1b4f265b51807a1943420f130d87e16e2bc367a0e2347f892e
```

Depth-specific raw-state counts:

```text
0: 1
1: 4
2: 14
3: 38
4: 119
5: 384
6: 1284
7: 4706
8: 18298
```

All 24,848 states in this frozen domain are Namua states. This does **not** imply that Mtaji is absent from Bao or from deeper reachable state space; it only states that no Mtaji raw state occurs inside this exact depth-8 domain from the frozen root under the current engine semantics.

Terminal states inside the frozen raw-state set: 97 (`winner=0`: 31, `winner=1`: 66). These are bounded-domain structural counts, not evidence of first/second-player advantage.

## Frozen tree domain

Exact non-deduplicated game-tree result through path depth 8:

```text
node occurrences = 30941
edge occurrences = 30940
occurrenceSetSha256 = 194695a4ddc7908c7ba46da2bbe09b46858aebf3cac3baa4ceedd6a32edc3f08
```

Tree node occurrences by depth:

```text
0: 1
1: 4
2: 14
3: 38
4: 124
5: 405
6: 1430
7: 5655
8: 23270
```

The exact raw-state / tree-node ratio through depth 8 is `0.803076823632074`. This quantifies bounded transposition/convergence effects in this frozen domain; it is not a whole-game effective branching factor or global state-space compression estimate.

## Branching structure inside complete parent depths 0..7

```text
expanded nonterminal raw states = 6516
expanded terminal raw states = 34
arithmetic mean legal move-variant branching = 3.936157151626765
geometric mean positive branching = 3.4331822270441013
forced single-move proportion = 0.06476365868631062
capture-forced proportion = 0.8276550030693677
non-capture-choice proportion = 0.1723449969306323
mixed move-type proportion = 0
```

These are exact descriptive summaries of the frozen complete parent-depth domain only.

## Independent verification

The independent verifier:

- imported neither the production serializer nor production formal runner;
- imported no Stage 1 artifact code;
- used the independent raw serializer;
- revalidated every materialized raw-state key and 64-seed invariant;
- reconstructed BFS minimum depths and aggregate graph endpoints;
- reran the **entire frozen graph domain** from a fresh initial state;
- reran the **entire frozen tree domain** from a fresh initial state;
- reproduced graph state/transition counts, depth counts, state-set hash, transition-set hash, tree node/edge counts, tree depth counts, and occurrence-set hash exactly.

All production gates `S2-G1` through `S2-G10` passed.

## Artifact file hashes

```text
formal-graph-states.jsonl = 6150fe6a21837126930cc1733af6c2d53590be5b019679082bea282d21f3c349
formal-graph-transitions.jsonl = 0d403739ae8258f430b1ea8a6808ef5fbb317b7b78f9b29b5fa7829923c2f696
stage2-formal-summary.json = f85025fb475137b7d7e25218b996ec6bbddba04e915775cd4e70b4372c88ea4f
repository-facing-formal-summary.json = 3247de6de1b4f2c363bac8161f99aa0a5a51e457963fb91d2dfb8f87916b524e
production-verification.json = 9a734858efe19842a22b56058fd6a763145cc3b2c2289b347cb309dccf85414c
independent-verification.json = 2061957e5132c71cfe7cc325b2ca4c5141f804d1aaedecce7217fe1e506323d1
```

## Upstream / no-rescue boundary

This result does not alter Restricted Endgame Study 1, Symmetry Study 1, ORISC-STUDY1, or any other completed Bao study. It does not repair ORISC terminal rows and does not authorize any symmetry-reduced count.

Stage 1 exploratory data were not imported as formal evidence. Post-formal comparison shows the newly regenerated Stage 2 graph state/transition hashes coincide with the Stage 1 completed-domain hashes; this is a reproducibility observation only and is not needed for the Stage 2 formal decision.
