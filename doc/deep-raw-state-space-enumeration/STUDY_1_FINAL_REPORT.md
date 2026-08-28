# Deep RAW State-Space Enumeration Study 1 — Final Report

Updated: 2026-08-28  
Program label: `G2-05`  
Study ID: `DRSSE-STUDY1`  
Research generation: **Research Generation 2**  
Formal decision: **`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

## 1. Research question

This prospective independent Study asked whether the complete legal forward state space from a prospectively frozen Bao root could be exactly and reproducibly enumerated through a prospectively fixed bounded depth, while separately accounting for authoritative RAW states, game-tree occurrences, branching, transpositions, and phase composition.

The Study did **not** ask for complete forward closure to terminal and did not estimate the total Bao state space or total game-tree complexity.

## 2. Immutable upstream boundaries

Nothing in this Study changes the formal decisions or interpretation boundaries of upstream work:

- `PEOCR-STUDY1 = INCONCLUSIVE`;
- `SRDR-STUDY1 = INCONCLUSIVE`, including `1040 < 1050` after its firewall;
- `STSCV-STUDY1 = INCONCLUSIVE`, T01/T02/T03 `NON-ESTIMABLE`, validated transform set `[]`, canonicalization not authorized;
- `REEOE-STUDY1 = INCONCLUSIVE`, including Stage 1 v2 complete closures `0/8` and Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`;
- G1 `SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`.

G2-05 is not a rescue, correction, reclassification, or extension-success label for any of those Studies.

## 3. Authoritative representation

Scientific state identity was RAW-only:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

Excluded identity fields:

```text
turn
reason
```

Missing `pending` was fail-closed. The represented-seed invariant was 64.

The upstream validated transform set was empty, therefore no symmetry reduction, canonicalization, seat swap, left/right quotient, orbit deduplication, or symmetry-reduced counting was used.

Exact move identity was bound by:

```text
type
phase
row
index
direction
side
houseChoice
houseTwo
```

Every materialized edge retained the binding:

```text
source RAW key -> exact move key -> successor RAW key
```

## 4. Prospective Stage structure

### Stage 0 — technical validation

`DRSSE-S0-TECHNICAL-2026-08-28-v1` validated RAW identity, deterministic enumeration, layer accounting, tree-occurrence propagation, transposition accounting, hashing, materialization, and independent verification.

The immutable G1 SSGTC depth-2 result was used only as a technical positive fixture. After two recorded technical blocks, the accepted run reproduced the fixture and all frozen corruption controls were detected.

```text
decision = STAGE0-TECHNICAL-PASS
run = 33155526103
job = 98797262242
artifact = 9679427896
artifact ZIP SHA256 = 7cd8dbb4e61acf113c0085b79bd298a7588994447750e0f7d4d8201e51c638c4
```

Stage 0 authorized no scientific inference.

### Stage 1 — fresh development/resource characterization

`DRSSE-S1-DEVELOPMENT-2026-08-28-v1` used a fresh deterministic seed block `28050001..28050064` and prospectively selected three Namua and three Mtaji development roots. All six roots completed independent depth-5 local enumeration and independent replay/re-enumeration.

```text
decision = STAGE1-DEVELOPMENT-PASS
run = 33155886879
job = 98798433942
artifact = 9679565765
artifact ZIP SHA256 = 47f83b614876a988495c8a68f8d63dda9bf9de105b967398178e6b4bc4fade04
complete depth-5 roots = 6/6
```

Stage 1 remained development-only. Its rows, roots, state counts, transposition observations, and artifacts were barred from formal Stage 2 evidence.

### Stage 2 — formal bounded enumeration

The formal domain had already been fixed before Stage 1 outcome inspection:

```text
root = fresh public/engine.js initialState()
root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
target depth = 9
required complete reachable layers = 0..9
required complete parent expansion layers = 0..8
```

The formal run was authorized exactly once against frozen source blobs and frozen resource ceilings.

## 5. Formal result

The production enumerator completed every frozen layer without resource or administrative stop. The independent verifier then validated all materialized rows and independently re-enumerated the complete depth-9 domain.

```text
targetComplete = true
lastCompleteDepth = 9
firstIncompleteDepth = null
stopReason = null
materialized verification = PASS
full independent exact recomputation = PASS
```

Therefore the formal decision is:

> **`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

## 6. Exact reachable-state and tree structure

| depth | unique RAW states | new RAW states | cumulative RAW states | tree occurrences | cumulative tree occurrences | tree / layer RAW | terminal |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 1 | 1 | 1 | 1 | 1 | 1.0000 | 0 |
| 1 | 4 | 4 | 5 | 4 | 5 | 1.0000 | 0 |
| 2 | 14 | 14 | 19 | 14 | 19 | 1.0000 | 0 |
| 3 | 38 | 38 | 57 | 38 | 57 | 1.0000 | 0 |
| 4 | 119 | 119 | 176 | 124 | 181 | 1.0420 | 0 |
| 5 | 384 | 384 | 560 | 405 | 586 | 1.0547 | 2 |
| 6 | 1,284 | 1,284 | 1,844 | 1,430 | 2,016 | 1.1137 | 3 |
| 7 | 4,706 | 4,706 | 6,550 | 5,655 | 7,671 | 1.2017 | 29 |
| 8 | 18,298 | 18,298 | 24,848 | 23,270 | 30,941 | 1.2717 | 63 |
| 9 | 78,009 | 78,009 | 102,857 | 105,704 | 136,645 | 1.3550 | 351 |

Within this frozen range, `newRawStateCount[d] == uniqueRawStateCount[d]` at every depth: no authoritative RAW state in the enumerated standard-root domain appeared at two different exact depth labels through depth 9. This is a bounded descriptive fact, not a global acyclicity claim.

Cumulative exact endpoints are:

```text
distinct RAW states through depth 9 = 102857
depth-labelled legal edges from parent depths 0..8 = 106773
unique RAW graph edges from parent depths 0..8 = 106773
tree node occurrences through depth 9 = 136645
tree edge occurrences from parent depths 0..8 = 136644
tree / cumulative RAW-state occurrence ratio = 1.328494900687362
```

## 7. Branching structure

| parent depth | RAW parents | legal edges | mean branching | median | terminal parents |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 1 | 4 | 4.0000 | 4 | 0 |
| 1 | 4 | 14 | 3.5000 | 4 | 0 |
| 2 | 14 | 38 | 2.7143 | 2 | 0 |
| 3 | 38 | 124 | 3.2632 | 4 | 0 |
| 4 | 119 | 388 | 3.2605 | 3 | 0 |
| 5 | 384 | 1,325 | 3.4505 | 3 | 2 |
| 6 | 1,284 | 4,895 | 3.8123 | 4 | 3 |
| 7 | 4,706 | 18,860 | 4.0076 | 4 | 29 |
| 8 | 18,298 | 81,125 | 4.4335 | 4 | 63 |

No nonterminal parent with zero legal moves was observed in the completely enumerated parent layers. Full branching histograms and edge-set hashes are preserved in the Stage 2 artifact/result.

## 8. Transposition structure

Transposition was defined only by exact RAW state identity. Duplicate arrivals first appeared at depth 4.

| child depth | duplicate arrivals | states with multiple predecessor RAW states |
| ---: | ---: | ---: |
| 0–3 | 0 | 0 |
| 4 | 5 | 5 |
| 5 | 4 | 1 |
| 6 | 41 | 22 |
| 7 | 189 | 171 |
| 8 | 562 | 473 |
| 9 | 3,116 | 2,658 |

At depth 9 the exact predecessor multiplicity histogram was:

```text
1 -> 75351 states
2 -> 2514
3 -> 61
4 -> 81
5 -> 2
```

and the exact arrival multiplicity histogram was:

```text
1 -> 75132 states
2 -> 2723
3 -> 71
4 -> 81
5 -> 2
```

The difference between graph-state count and game-tree occurrences therefore becomes materially visible by depth 9, but no extrapolation beyond the enumerated domain is authorized.

## 9. Phase composition

All nonterminal states in exact layers 0..9 were Namua states. No Mtaji nonterminal state occurred within the frozen depth-9 domain. Terminal states first appeared at depth 5 and numbered 351 at depth 9.

This does **not** imply that Mtaji is globally absent or unreachable; it states only that none occurred within nine plies of this prospectively frozen standard root.

## 10. Independent verification and exact identities

Canonical provenance:

```text
authorization/head SHA = 9199a3d25ea38978673f94bfcd4250aa3b5411fa
workflow run = 33156581843
workflow job = 98800676702
artifact = 9679860509
artifact ZIP SHA256 = cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e
```

Exact identities:

```text
cumulativeRawStateSetSha256 = 993c5056ca54521b7b124d8c5c97fa18d8ef04b860b5e4c6870df278d5944816
cumulativeGlobalRawGraphEdgeSetSha256 = da836a6a0b2e18c155f59de7617b4e72ab62955410ca7725a3f3525211f9a654
cumulativeDepthLabelledEdgeSetSha256 = 3453b457aee547c645be0ec3a3a5550656e9fcaa1917be13d5ac0bb0e7b69aed
productionResultCoreSha256 = b9e79571ab2492edf717569cb331f381e4dbff603684d2e932b8b57c2ffb322b
independentCoreSha256 = 02e4a1fa865af977cb10c1f288c42886b32453e56a40bc85cbb0dc9975b257d3
decisionCoreSha256 = c1756994ceea3ea9b605805ddd6387f359aeb14e14d894bfc8a1e8b26122fa3f
```

Production resource measurements were 24,848 parent expansions, 106,773 move evaluations, 22.9188 seconds elapsed, peak RSS 680,075,264 bytes, and approximately 84.25 MB final uncompressed artifact content. These are computational provenance, not scientific endpoints for extrapolation.

## 11. Relationship to G1 SSGTC

G2-05 independently reproduced the standard-root cumulative depth-8 values `24,848` RAW states and `30,941` tree occurrences as a prefix of the newly frozen depth-9 domain, then completed depth 9 with fresh formal enumeration and independent verification.

This does not revise the G1 decision. `SSGTC-STUDY1` remains exactly what it was: exact only within its own frozen depth-8 domain.

## 12. Relationship to G2-04

G2-04 asked for complete forward closure to terminal for prospectively selected restricted endgame domains before retrograde exact solution. G2-05 instead asked only for complete enumeration to a fixed bounded depth from a separately frozen root.

No G2-04 selected root or partial closure was reused. The G2-04 decision remains `INCONCLUSIVE`; G2-05 is not described as its rescue.

## 13. Boundary to G2-12

The observed depth-wise growth, branching and transposition statistics are exact descriptions of the enumerated domain only. This Study does not fit an asymptotic model or estimate:

- total Bao state-space size;
- total game-tree complexity;
- unbounded reachable states;
- full-game growth rate.

Those questions remain prospective future work, including the designated G2-12 estimation study.

## 14. Final conclusion

The frozen standard initial Bao RAW state was completely enumerated through depth 9 under authoritative RAW identity, with exact state, tree, branching, transposition, phase, and hash accounting and complete independent reproduction.

The correct scientific statement is therefore:

> **G2-05 / `DRSSE-STUDY1` = `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`.**

No stronger full-game, symmetry-reduced, game-theoretic, or engineering conclusion is authorized.
