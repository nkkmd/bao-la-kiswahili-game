# RCPR-STUDY1 — Stage 0 Candidate Feature Dictionary

Status: prospective Stage 0 technical dictionary  
Stage: `RCPR-S0-TECHNICAL-2026-08-28-v1`

This dictionary defines candidate **technical feature semantics**, not the final Stage 2 predictor. Stage 1 may retain only Stage-0-eligible families and must freeze the final representation before Stage 2 outcome generation.

## Global rules

- Scientific state identity is RAW-only: `pits,reserve,houseOwned,player,phase,winner,pending`.
- `turn` and `reason` are not identity fields and are not candidate predictor features in Stage 0.
- No seat swap, reflection, canonicalization, player exchange or symmetry reduction is used.
- Root must be nonterminal.
- All features are numeric scalars or explicit `null` for prospectively defined missingness.
- Variable-size graphs are summarized into deterministic fixed-schema statistics; graph node identity always uses RAW keys.
- Predictor inputs never contain continuation measurement records or future outcomes.

## A — `LOCAL_PIT_TOPOLOGY`

Leakage class: `A / PRE_ROOT_OBSERVABLE`.

Candidate scalars:

- all 32 pit seed counts at their literal RAW coordinates: `p{0,1}_{front,back}_pit{0..7}`;
- per literal row: seed sum, occupied count, adjacent occupied-pair count, reusable-pit count (`>=2`), maximum pit count and concentration;
- global board seed count, nonempty pit count and maximum pit count.

Coordinates are not player-normalized or mirrored.

## B — `CAPTURE_GRAPH`

Leakage class: `B / ROOT_DERIVED_OUTCOME_INDEPENDENT`.

Constructed by exhaustively applying each exact legal root move once, using only engine rule semantics before any decision-criticality continuation rollout.

Candidate scalars:

- legal capture-move count/fraction;
- immediate captured-seed and capture-event distributions;
- immediate-terminal root-move count;
- opponent capture-move availability in each one-ply successor;
- literal row/index origin counts and captured-seed totals for root capture moves.

No continuation rollout is read.

## B — `LEGAL_MOVE_GEOMETRY`

Leakage class: `B / ROOT_DERIVED_OUTCOME_INDEPENDENT`.

Candidate scalars summarize the exact `moveVariants` set:

- legal move count;
- counts by `type`, `row`, `index`, `direction`, `side`, `houseChoice`, and `houseTwo`;
- number of unique literal origin coordinates;
- unique exact move-key count;
- forced-single-move and all-capture indicators.

Exact move identity fields are `type,phase,row,index,direction,side,houseChoice,houseTwo`.

## B — `REPLY_GRAPH`

Leakage class: `B / ROOT_DERIVED_OUTCOME_INDEPENDENT`.

For every exact root move, construct the immediate successor and, if nonterminal, enumerate every exact opponent reply. Candidate scalars include:

- one-ply RAW-state count and duplicate/transposition count;
- total two-ply reply edges and unique two-ply RAW-state count;
- reply-count min/max/mean/standard deviation;
- forced-reply successor count;
- immediate-terminal successor count;
- reply move-type totals/fractions.

No depth beyond the exact opponent reply is part of this family.

## A — `RESERVE_HOUSE_RELATION`

Leakage class: `A / PRE_ROOT_OBSERVABLE`.

Candidate scalars include literal and root-actor-indexed reserve/house/nyumba relations:

- `reserve[0]`, `reserve[1]`, total and difference;
- `houseOwned[0]`, `houseOwned[1]`, house count;
- literal nyumba pit counts at front index `HOUSE`;
- root-actor/opponent reserve, house and nyumba values;
- reserve × house interactions;
- explicit root-player and phase indicator scalars.

Actor-indexed summaries are arithmetic lookups only; they do not transform RAW identity or board coordinates.

## B — `MOVE_SET_ENTROPY`

Leakage class: `B / ROOT_DERIVED_OUTCOME_INDEPENDENT`.

Base-2 Shannon entropy over the exact legal move set for prospectively fixed categorical projections:

- move type;
- direction;
- row;
- literal origin index;
- side;
- house choice;
- joint type×direction;
- literal row×index origin.

Missing categorical attributes are an explicit `none` category.

## C — `SEARCH_GAP_VECTOR`

Leakage class: `C / SEARCH_DERIVED_OUTCOME_INDEPENDENT`.

Stage 0 candidate search profile:

```text
searchSemantics = exact-full-window-root-candidates/phase2-value-semantics/v1
evaluationProfile = bao
depths = [1,2]
quiescenceDepth = 1
orderQuiescenceCaptures = false
root tie break = exact move-key lexical order
```

Candidate scalars per depth include:

- best and second-best score;
- best-second gap;
- top-set size;
- candidate score min/max/mean/standard deviation/spread;
- node, quiescence-node, cutoff and evaluation counters.

Depth-transition scalars include top-set overlap, disjointness, canonical-best change, best-score delta and sign reversal.

The search diagnostic's historical `AI.stateKey` output is not used as G2-06 scientific identity.

## A — `LOCAL_TEMPORAL_CONTEXT`

Leakage class: `A / PRE_ROOT_OBSERVABLE`.

Stage 0 maximum history window: four completed moves strictly preceding the root.

Input contract is an ordered list of exact `{state, move}` records from oldest to newest. Replaying every record must reconstruct the next record's RAW state and the final replay must reconstruct the root RAW state. Records after the root therefore cannot satisfy the contract.

For each lag 1..4 (lag 1 = immediate predecessor), candidate scalars include:

- availability indicator;
- predecessor player/phase indicators;
- literal reserves, houses, board/front seed totals and predecessor legal-move count;
- move type/direction/row/index indicators;
- captured-seed and relay-event counts of the completed pre-root move;
- whether that completed move crossed the Namua→Mtaji phase boundary.

Unavailable lags have `available = 0` and all other lag-specific values `null`.

Window aggregates include history depth, prior capture count, captured-seed total and prior phase-transition count.

## Forbidden family/input examples

Class `D / CONTINUATION_OR_FUTURE_OUTCOME_DERIVED` is never predictor eligible. Explicitly forbidden examples include:

```text
D_range
highDivergence label
continuation win/loss counts
continuation completion rate
future winner
post-root rollout state
post-root policy move
formal endpoint value
Stage 2 outcome
```

The Stage 0 implementation must fail closed when unexpected outcome-like fields are injected into root/history input objects.
