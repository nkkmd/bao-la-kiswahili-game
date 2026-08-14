# STAGE_0_TECHNICAL_AUDIT — Tactical Motifs / Tesuji Study 1

Date: 2026-08-14
Baseline: `08c70ba6ac980884d51562c207410db3521b8ae4`

## 1. Audit purpose

Determine what the current Bao engine / AI / research tooling can measure reproducibly **before** defining or generating a scientific tactical-motif corpus.

Stage 0 performs no motif discovery and authorizes no scientific inference.

## 2. State identity

### historicalStateHash — AVAILABLE

`tools/experiments/lib/phase-transition-features.js` hashes a canonical historical state containing pits, reserve, house ownership, player, phase, winner, reason, turn, and pending.

Use: historical-state and trajectory identity where history bookkeeping must remain distinguishable.

### ruleStateKey — AVAILABLE

`position-typology-features.js` defines a rule state containing pits, reserve, house ownership, player, phase, winner, and pending while deliberately omitting `turn` and `reason`.

Use: exact rule-state duplicate collapse. Two historically different observations may share one rule state.

### seatCanonicalKey — AVAILABLE / BOUNDED

The same module compares direct rule-state identity with a validated seat-swapped representation. This canonicalizes South/North seat exchange only.

### AI.stateKey — AVAILABLE BUT NOT INTERCHANGEABLE

`public/ai.js` has an internal search/transposition state key. Its field coverage is not identical to `ruleStateKey` (notably it is a search key, not the study identity contract). It must not replace research identity keys.

## 3. Symmetry / canonicalization

`tools/symmetry/transform-candidates.js` defines candidate transforms. The validated `mirrorState` / `mirrorMove` is candidate D: player swap without column reversal or direction reversal because pit coordinates are local to each player's viewpoint.

**Stage 0 decision:** actor-relative motif signatures may canonicalize seat identity only. Do not assume left/right or pit-index reflection equivalence.

## 4. Move and moveVariant identity

### Legal move set — AVAILABLE

`E.legalMoves(state)` returns physical/legal moves under engine rules.

### moveVariants — AVAILABLE AND REQUIRED

`E.moveVariants(state)` expands Namua capture house choice (`houseChoice: stop/use`) only when the two choices produce distinct resulting states.

### Exact move key — AVAILABLE

`AI.moveKey(move)` includes type, phase, row, index, direction, side, houseChoice, and houseTwo. This is suitable for exact moveVariant identity.

**Caution:** some internal AI evaluation metrics call `E.legalMoves` rather than `E.moveVariants`. New study instrumentation should use `moveVariants` whenever measuring the actual decision set.

## 5. Move-local transformation

### Engine event stream — AVAILABLE

`E.applyMove(state, move)` returns `{state, events}`. Event kinds include:

- `reserve`
- `lift`
- `sow`
- `capture`
- `relay`
- `phase`
- `turn`
- `win`
- `limit`

Capture events expose captured count/site; relay events expose relay position/count; sow events expose positions; every event includes a state snapshot.

### Structural features — AVAILABLE

`position-typology-features.js` already measures for actor/opponent:

- reserve
- house ownership / nyumba seeds
- board/front/back seeds
- occupied pits and front/back occupancy
- reusable pits
- front connections
- legal move count
- capture move count / forced capture
- max capturable seeds
- capture/relay/chain event morphology across current legal moves
- max pit size
- pit-seed variance and concentration

These can be measured before and after a candidate move to form a state-transformation vector.

### Directly derivable in new Stage 0 helper

`tactical-motif-features.js` adds:

- actor/opponent feature deltas
- house ownership delta
- captured seeds / capture, relay, sow, chain event counts
- actor-relative normalized event locations
- `lastSowPosition` and `lastRelayPosition` as clearly named event-derived measures
- immediate reply-set size and forced/free status

### relay endpoint — NOT ENGINE-NATIVE

The engine does not return a dedicated field named `relayEndpoint`. The final sow location can be derived from the event stream, but it must retain an explicit derived name and semantics. If Stage 1 requires a stronger endpoint definition (for example final landing pit before turn completion), that definition must be frozen and tested before generation.

## 6. Multi-ply consequence

### Opponent reply set — AVAILABLE

After applying a candidate move, `E.moveVariants(afterState)` provides the exact immediate reply set. `reply count == 1` can operationalize an immediate forced reply; larger sets are free/non-unique replies.

### Exact D1/D2/D3 candidate values — AVAILABLE

`position-complexity-search-diagnostic.js` performs deterministic fixed-depth full-window root candidate analysis using phase2 value semantics and named evaluator profiles. Existing tests verify agreement with the production phase2 search root score through tested depths and preserve all legal root moveVariants.

Available outputs include:

- every root move and score
- score class / mate-domain separation
- tie-aware top set
- canonical lexical best within ties
- best-second gap
- depth trace and top-set overlap/change

This is suitable as a measurement instrument, not as a reopened Position Complexity endpoint.

### Search-consistent principal variation — NOT AVAILABLE

The current diagnostic returns root candidate values but not the child sequence selected inside the exact minimax search. Re-searching each successor independently can produce a defensible new response policy, but it is not the original search PV.

**Stage 0 decision:** Stage 1 should use response sets and response-envelope summaries unless a dedicated PV tracer is separately implemented, tested against minimax values, and frozen before corpus generation.

## 7. Actor orientation

`playerFeatures(state, player)` safely constructs player-relative views. New transition events normalize player-indexed positions as `actor` / `opponent`, while preserving local row/index/direction.

This representation is expected to be invariant under the validated seat swap and is covered by the new Stage 0 test.

## 8. Trajectory identity and pseudoreplication controls

`run-position-complexity-stage1-exploratory.js` provides a reusable architecture:

- move record with before/after historical and rule-state identities
- `historicalTrajectoryHash` from the ordered historical-state sequence
- `ruleTrajectoryHash` from the ordered rule-state sequence
- representative collapse of duplicate historical trajectories
- deterministic hash-based state selection
- exact rule-state duplicate collapse
- no favorable replacement

This architecture is scientifically reusable after removing Position Complexity-specific endpoints.

## 9. Joseki tooling reusable components

`joseki-common.js` contributes deterministic move-sequence hashing, provenance, state features, and symmetry transition audits. Its opening-tree interpretation is not imported into tesuji definitions.

## 10. Stage 0 implementation added

### `tools/experiments/lib/tactical-motif-features.js`

Technical-only helper for:

- exact moveVariant validation
- actor-relative immediate structural transformation
- event summaries
- reply-set measurement
- exact-root/reply diagnostics through the already tested search diagnostic

It introduces no candidate taxonomy and contains no scientific threshold.

### `test/tactical-motif-stage0.test.js`

Technical test checks:

- non-mutation
- exact moveVariant key use
- reply-set cardinality from `moveVariants`
- state identity availability
- actor-relative signature invariance under validated seat swap
- deterministic exact D1/D2 root diagnostics
- immediate reply diagnostic

## 11. Stage 1 design recommendation

The safest exploratory design is **trajectory-diverse, outcome-independent root sampling + all-legal-move transformation analysis + response-envelope characterization**.

Do not pre-filter to AI best moves. Do not promote motifs by minimum p-value. Keep separate dimensions for recurrence, forcing, value, structural consequence, and transferability.

Before generation, freeze a machine-readable Stage 1 spec including seed block/game count/generator strata, selection hash salts, max one root per phase per unique historical trajectory (unless a different fixed cap is prospectively justified), exact rule-state dedup, opening-family concentration audit, search semantics, candidate promotion gates, and no-rescue rules.

## 12. Stage 0 conclusion

**Technically feasible with bounded additions.** The current engine/tooling is sufficient to begin a prospectively designed Stage 1 without changing Bao rules or prior formal endpoints.

The critical bounds are:

1. only seat symmetry is validated;
2. relay endpoint must be explicitly derived/defined;
3. search-consistent PV is not currently available;
4. transferability must be demonstrated through independent trajectories and non-identical rule states, not board-hash frequency;
5. all Stage 1 thresholds and sampling rules must be frozen before scientific corpus generation.
