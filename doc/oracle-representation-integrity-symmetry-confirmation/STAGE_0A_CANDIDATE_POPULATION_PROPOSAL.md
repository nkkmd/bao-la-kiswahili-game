# ORISC-STUDY1 — Stage 0A Candidate / Population Proposal

Status: **PRE-OUTCOME PROPOSAL / NOT YET FROZEN**  
Scientific outcome inspected in ORISC Stage 1: **NO**

## 1. Purpose

This document derives the conditional Stage 2 symmetry candidates and population from current Bao rule semantics before any ORISC Stage 1 formal representation-integrity outcome exists.

Prior `SIP-STUDY1` candidate names and its zero-mismatch diagnostics are known prior information. They are not used here as pass evidence, tuning data, or a reason to narrow a candidate after observing ORISC outcomes.

## 2. Semantic premises re-derived from current engine

Current code fixes:

```text
FRONT = 0
BACK = 1
HOUSE = 4
```

Pit arrays are player-local. Physical facing front pits satisfy:

```text
opponentIndex = 7 - localIndex
```

Sowing direction and entry side are player-local. Active nyumba remains fixed at local `HOUSE=4`, so a global local-coordinate left/right reflection maps index 4 to 3 and is not a plausible all-state symmetry while house semantics are active.

Raw identity includes:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

`turn` and textual `reason` are not part of the raw identity key.

## 3. Proposed controls

### `ORISC-C00-IDENTITY`

Role: mandatory positive control.

State map and move map are exact identity. It is applicable wherever the Stage 2 instrumentation is asked to evaluate another transformation. Any failure blocks interpretation of all nontrivial candidates.

### `ORISC-C01-LR-NO-DIRECTION-FLIP`

Role: frozen negative control.

On Mtaji houseless states it reverses pit index `i -> 7-i` but deliberately does **not** flip sow direction. Player identities are preserved.

This defect is selected from rule semantics: reflecting the local sowing ring without reflecting direction should generally break transition commutation. No mismatch count is targeted and the control will not be altered if it behaves unexpectedly.

## 4. Proposed scientific transformations

### `ORISC-T01-SEAT-SWAP-LOCAL`

State map:

```text
pits[0] <-> pits[1]
reserve[0] <-> reserve[1]
houseOwned[0] <-> houseOwned[1]
pending[0] <-> pending[1]
player 0 <-> 1
winner 0 <-> 1
phase unchanged
```

Because row/index/side/direction are player-local, the move map preserves:

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

If a diagnostic move object contains an explicit player field, that player field is swapped.

Applicability: valid Namua and Mtaji rule states.

Inverse expectation: involution.

Reachability interpretation: this transform does not preserve the repository's fixed raw initial state because `player=0` becomes `player=1`. Therefore it may support rule-semantic isomorphism and transformed-initial witness replay, but it does not automatically establish reachability from the fixed raw initial state.

### `ORISC-T02-LR-MTAJI-HOUSELESS`

Applicability predicate:

```text
phase = mtaji
reserve = [0,0]
houseOwned = [false,false]
```

Terminal states remain applicable when the predicate is otherwise satisfied; nonzero `pending` is permitted and must be preserved.

State map:

```text
for both players and both rows: pit index i -> 7-i
reserve unchanged
houseOwned unchanged
pending unchanged
player unchanged
winner unchanged
phase unchanged
```

Move map:

```text
index i -> 7-i
direction left <-> right
side left <-> right
row unchanged
type/phase/houseChoice/houseTwo unchanged
```

Inverse expectation: involution.

Rationale for restriction: with inactive houses and Mtaji reserve exhaustion, the fixed local `HOUSE=4` asymmetry is semantically inactive. This restriction is derived before ORISC Stage 1 outcome generation.

### `ORISC-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS`

Composition of the two independently specified maps above on the T02 applicability domain.

State map = T01 player-indexed swap followed by T02 local LR reflection.  
Move map = T01 local-preserving map followed by T02 index/direction/side reflection.

Inverse expectation: involution.

## 5. Proposed formal candidate decisions

Unlike `SIP-STUDY1`, the new study does **not** propose a separate redundant pooled T01 outcome.

Proposed candidate-level Stage 2 decisions:

```text
ORISC-O01-T01
  requires exact pass on fresh Namua stratum,
  fresh Mtaji stratum,
  and the valid reconstructed exact-oracle graph.

ORISC-O02-T02
  requires exact pass on fresh Mtaji-houseless stratum
  and the valid reconstructed exact-oracle graph.

ORISC-O03-T03
  requires exact pass on fresh Mtaji-houseless stratum
  and the valid reconstructed exact-oracle graph.
```

A candidate is validated only if **all** of its prospectively required scopes pass. A failure in one required scope is not rescued by another scope.

## 6. Proposed fresh Stage 2 population

Fresh reserved seed block:

```text
23110001..23110128
```

Repository search before this proposal found no use of `23100001`; the final freeze will hash-check the exact chosen block and perform a broader collision audit against research seed registries/documents.

Trajectory design:

```text
seeds                  = 128
maximum trajectory ply = 160
policy                  = deterministic seeded legal-move trajectory generator frozen in Stage 0B
runtime relay-limit hit = technical failure / non-estimability, never semantic mismatch
```

Fresh strata:

```text
namua
mtaji
mtaji-houseless
```

Root selection, independently chosen before ORISC Stage 1 outcomes:

```text
required roots per stratum = 12
local exact expansion depth = 4
```

For each seed, candidate root is:

- Namua: first nonterminal valid Namua state at `ply >= 8`;
- Mtaji: first nonterminal valid Mtaji state;
- Mtaji-houseless: first nonterminal Mtaji state with `reserve=[0,0]` and `houseOwned=[false,false]`.

Candidate roots are deduplicated by the new ORISC raw state key, sorted by ascending raw key, and the first 12 are selected per stratum.

No candidate transform, mismatch count, value, DTF, oracle result, or canonical orbit quantity may participate in root selection.

## 7. Shortage / technical failure rule

The proposed freeze rule is intentionally non-rescuing:

- if fewer than 12 unique roots exist in any required stratum, Stage 2 becomes `NON-ESTIMABLE` for candidates requiring that stratum;
- do not extend the seed block;
- do not lower required root count;
- do not replace the stratum;
- do not reduce depth after observing candidate behavior;
- a runtime guard hit in required expansion makes that scope `NON-ESTIMABLE` unless a pre-outcome technical Stage 0B audit rejects the design before any Stage 1 outcome exists.

## 8. Exact Stage 2 gates per required scope

Proposed gates:

```text
B-G1  source/candidate contract identity
B-G2  applicability and transformed-state validity
B-G3  state inverse/bijection
B-G4  exact move-set bijection using moveVariants where required
B-G5  move inverse/bijection
B-G6  exact transition commutation
B-G7  terminal equivalence
B-G8  winner equivariance
B-G9  graph-node/edge isomorphism on declared bounded scope
B-G10 reconstructed exact-oracle value/DTF/optimal-move preservation where required
B-G11 production/independent equality
```

All applicable gates require zero mismatch.

## 9. Proposed decision labels

```text
VALIDATED-BOUNDED-ISOMORPHISM
NOT-VALIDATED
NON-ESTIMABLE
```

`NOT-VALIDATED` requires an interpretable exact semantic mismatch with production/independent agreement. Implementation disagreement or incomplete verification is `NON-ESTIMABLE`.

## 10. Stage 3 boundary

Even if one or more candidates are validated, canonicalization is not automatic. Stage 3 must separately verify common-domain identity/inverse/composition/closure requirements and bind any canonicalization authorization to an exact domain and reachability interpretation.
