# STAGE_0_TRANSFORM_DESIGN — Symmetry / Isomorphic Positions Study 1

Status: **candidate semantics frozen before formal reachable-corpus outcomes**

## 1. Coordinate reconstruction

Current engine constants:

```text
FRONT = 0
BACK = 1
HOUSE = 4
```

For both numeric players, pit index is local left-to-right from that player's own viewpoint. Therefore a physical facing pair is `(player,index)` versus `(1-player,7-index)`.

Sowing-ring order is defined in the same local row/index coordinates for either player. Player number itself does not alter ring traversal.

## 2. State fields

Formal state transform covers:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

`turn` and `reason` are preserved for transition diagnostics but excluded from raw rule-state key, matching the upstream exact-oracle identity convention.

## 3. Exact move fields

Formal `Φ` maps exact move variants:

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

`houseChoice` is preserved as a semantic choice label. `houseTwo` is preserved. A player field, if present in diagnostic move objects, follows `π` but is not part of the canonical exact move key above.

## 4. Scientific transforms

### SIP-T01-SEAT-SWAP-LOCAL

```text
π: 0 <-> 1
pits[0] <-> pits[1]
reserve[0] <-> reserve[1]
houseOwned[0] <-> houseOwned[1]
pending[0] <-> pending[1]
player -> π(player)
winner -> π(winner)
row/index/direction/side unchanged
phase unchanged
```

This is the engine-coordinate representation of exchanging seats / physical 180-degree board rotation. It is prospectively evaluated in Namua, Mtaji and pooled-both scopes.

### SIP-T02-LR-MTAJI-HOUSELESS

Applicability is frozen as:

```text
phase = mtaji
reserve = [0,0]
houseOwned = [false,false]
```

Mapping:

```text
π = identity
index i -> 7-i for every row/player
direction left <-> right
side left <-> right
row unchanged
player/winner/reserve/pending unchanged
```

The house-inactive scope is based on static semantics before outcomes: active nyumba is fixed at local index 4, while `7-4=3`.

### SIP-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS

Composition of T01 and T02 on the same prospectively fixed house-inactive Mtaji domain.

## 5. Controls

### SIP-C00-IDENTITY

Positive implementation control only; never a scientific symmetry finding.

### SIP-C01-LR-NO-DIRECTION-FLIP

Negative control: reverse pit index without the required left/right move-orientation flip. It is intentionally incomplete and is not a scientific candidate.

A FRONT/BACK row-role swap may also be used as a technical negative fixture because current capture/nyumba semantics privilege FRONT.

## 6. Static pre-formal non-candidates

These are excluded before formal outcome generation:

- global/all-phase pure LR reflection: fixed active `HOUSE=4` would map to 3;
- global player-swap + LR visual transform: same active-house obstruction;
- FRONT/BACK row exchange: capture and nyumba roles are not row-equivariant;
- direction flip alone: lacks matching pit-coordinate transform.

This exclusion is code/rule-semantic reasoning, not rescue after observed failures.

## 7. Answers A–L

### A. Can left/right reflection alone be a current-engine rule-semantic transform?

Not as an all-Bao transform under active-house semantics: `i -> 7-i` moves `HOUSE=4` to 3. A prospectively restricted house-inactive Mtaji LR transform remains a scientific candidate.

### B. What must accompany player swap?

In engine-local coordinates, seat swap exchanges player-indexed state and applies `π` to current player/winner; row, pit index, side and direction remain unchanged. Adding an index/direction reversal is a different transform, not part of basic seat swap.

### C. Same transform set in Namua and Mtaji?

No blanket assumption. T01 is predeclared for both phases and evaluated phase-stratified plus pooled. T02/T03 are predeclared only for Mtaji with both houses inactive.

### D. How map nyumba / reserve / pending / winner?

Under seat swap, all player-indexed arrays are exchanged and winner follows `π`; phase is unchanged. Under LR alone, those arrays and winner remain unchanged. Active-house states are outside T02/T03 applicability.

### E. How map exact move identity?

Use `moveVariants()` and the exact key `type:phase:row:index:direction:side:houseChoice:houseTwo`. T01 preserves row/index/direction/side; T02 reverses index and swaps left/right direction/side; T03 composes both. Exact mapped key sets must equal exactly.

### F. Which candidates preserve historical reachability by witness transformation?

No non-identity candidate currently earns an unconditional claim of reachability from the fixed raw standard initial state. T01 maps the standard initial board to a seat-relabeled initial state with the opposite numeric player to move, so it can support transformed-initial witness replay but not fixed-start reachability. T02/T03 do not apply along the full Namua prefix of a standard witness.

### G. How use the 8-state exact oracle?

Keep the raw oracle immutable, build `T(G)` for each applicable transform, verify state/edge bijection and commutation, then independently retrograde solve `T(G)` and compare player-to-move value, absolute winner under `π`, DTF, optimal move set under `Φ`, and recurrent SCC structure.

### H. How freeze fresh formal domain outcome-blind?

Use a fresh disjoint seed block, replayable witness trajectories, deduplicate by direct raw state key, stratify by predeclared phase/structural applicability, sort by raw key, and select fixed counts/depth chosen only from Stage 0 runtime/memory/state/edge/guard measurements.

### I. Full graph vs bounded local graph claim?

The prior oracle is a complete forward closure and can support complete-graph claims only for that frozen domain. Fresh Study 1 graphs are depth-bounded local expansions and may support only bounded-local graph isomorphism claims.

### J. Canonicalization in Study 1?

Yes, but only as a conditional downstream artifact after candidate validation. It must not participate in primary validation or upstream oracle identity.

### K. Collect group evidence?

Conditionally yes. If transforms validate on one common frozen domain, verify identity, inverse, composition and closure exactly. Otherwise use only `validated transformation set` language.

### L. Canonicalization contract for State Space Study?

Provide transform IDs/hashes, applicability predicate, inverse, player/move mapping, reachability-preservation status, orbit construction, canonical representative rule, and raw↔canonical provenance. Do not provide a whole-Bao symmetry-reduced state count in this Study.
