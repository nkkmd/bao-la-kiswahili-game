# Deep RAW State-Space Enumeration Study 1 — Overview

Program: **Research Generation 2 / G2-05**  
Study ID: `DRSSE-STUDY1`  
Status: **COMPLETE**  
Formal decision: **`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

## What was studied

G2-05 prospectively froze the standard Bao initial state as an authoritative RAW root and asked whether every legal forward state through depth 9 could be completely enumerated, with exact graph-state, game-tree occurrence, branching, transposition, and phase accounting.

This was bounded exact enumeration, not complete game solution or full-game size estimation.

## Representation

RAW state identity was exactly:

```text
pits, reserve, houseOwned, player, phase, winner, pending
```

`turn` and `reason` were excluded. Missing `pending` was invalid. The validated transform set remained `[]`; no symmetry reduction or canonicalization was used.

## Formal domain

```text
root = fresh standard engine initialState()
root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
target depth = 9
complete reachable layers = 0..9
complete parent expansions = 0..8
```

The root, depth, resource ceilings, endpoints, decision rule, representation and verifier requirement were frozen before formal outcome generation.

## Result

All frozen layers completed and the independent implementation reproduced the entire exact domain.

```text
cumulative distinct RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
lastCompleteDepth = 9
firstIncompleteDepth = null
stopReason = null
```

Depth 9 itself contained:

```text
unique RAW states = 78009
tree occurrences = 105704
duplicate arrivals = 3116
states with multiple predecessors = 2658
Namua nonterminal = 77658
Mtaji nonterminal = 0
terminal = 351
```

## Verification provenance

```text
formal authorization/head = 9199a3d25ea38978673f94bfcd4250aa3b5411fa
workflow run = 33156581843
workflow job = 98800676702
artifact = 9679860509
artifact ZIP SHA256 = cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e
production core = b9e79571ab2492edf717569cb331f381e4dbff603684d2e932b8b57c2ffb322b
independent core = 02e4a1fa865af977cb10c1f288c42886b32453e56a40bc85cbb0dc9975b257d3
```

## Interpretation boundary

The exact decision applies **only** to the frozen standard-root depth-9 RAW domain. It does not authorize a full Bao state-space count, total game-tree complexity estimate, asymptotic extrapolation, symmetry-reduced count, or game-theoretic solution.

G2-04 remains `INCONCLUSIVE`; its roots and partial closures were not reused. G1 `SSGTC-STUDY1` remains independently `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN` and is not revised by this Study.

See `STUDY_1_FINAL_REPORT.md` for the complete scientific report and `REPRODUCIBILITY_INDEX.md` for provenance and reproduction entry points.
