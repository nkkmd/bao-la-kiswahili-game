# DECISION_REGISTER — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24

## D-001 — New independent Study

`REWR-STUDY1` is prospective and independent. It does not modify any prior Study formal decision, threshold, classifier, endpoint, population, or interpretation boundary.

## D-002 — Primary starts Mtaji-only

Primary candidate domains are Mtaji-only. Rationale: reserve dynamics and Namua nyumba decision branching are removed, `phase=mtaji` / `reserve=[0,0]` are stable under successors, and exact semantics are easier to audit.

## D-003 — Prefer both houses inactive

Primary Stage 0 roots should have `houseOwned=[false,false]`. This property is forward-invariant in current Mtaji implementation because no Mtaji transition creates house ownership.

## D-004 — Reachability primary

Primary population uses historically reachable witness roots and their full forward closure. Rule-valid but reachability-unproven constructed states are not the primary population.

## D-005 — Closure by construction

Feature caps are root-selection benchmark filters only. The scientific domain is the complete forward closure. No legal edge may be dropped because a successor violates the root filter.

## D-006 — No symmetry reduction

Primary identity is direct/raw rule-state identity. `seatCanonicalKey`, player-swap, reflection, pit renumbering and other isomorphic reduction are forbidden in Study 1 primary state counting and solving.

## D-007 — `relay-limit` is not terminal ground truth

`MAX_RELAY=512` is an implementation safety guard according to `RULES_BASELINE.md`. A `reason="relay-limit"` result cannot seed retrograde WIN/LOSS.

## D-008 — Guard-free move semantics gate

Before a candidate domain is exact-eligible, every legal move in its closure must be independently shown to terminate under research-owned guard-free semantics, or the Study must establish a normative rule for the observed nontermination before Stage 1 freeze. Otherwise the candidate is ineligible.

## D-009 — No automatic DRAW label

Current rules/engine expose no formal repetition draw. Fixed-point leftovers are `RECURRENT` / cycle-region states, not `DRAW`.

## D-010 — Absolute-winner retrograde core

Retrograde propagation tracks absolute winner identity. This avoids relying on terminal `state.player`, which the runtime engine may leave as the mover when a move ends the game.

## D-011 — Provisional distance metric

Stage 1 is expected to freeze `DTF` (distance-to-forced-terminal) in legal moves: winner minimizes terminal distance; losing player maximizes resistance; recurrent states have null distance.

## D-012 — No outcome peeking in domain selection

Final Study 1 domain selection may use only technical feasibility quantities: closure state/edge counts, branching, move-termination status, deterministic reconstruction, runtime and memory. Exact WIN/LOSS/RECURRENT composition, DTF or optimal moves are forbidden inputs to domain selection.

## D-013 — Zero/negative result allowed

If no nontrivial exact-eligible domain passes the frozen technical gates, Study 1 may close as infeasible/non-estimable. Post-outcome shrinking, cap retuning or symmetry-based rescue is forbidden.
