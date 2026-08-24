# DECISION_REGISTER — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24

## D-001 — New independent Study

`REWR-STUDY1` is prospective and independent. It does not modify any prior Study formal decision, threshold, classifier, endpoint, population, or interpretation boundary.

## D-002 — Primary starts Mtaji-only

Primary candidate domains are Mtaji-only. Rationale: reserve dynamics and Namua nyumba decision branching are removed, `phase=mtaji` / `reserve=[0,0]` are stable under successors, and exact semantics are easier to audit.

## D-003 — Prefer both houses inactive

Primary Stage 0 roots use `houseOwned=[false,false]`. This property is forward-invariant in current Mtaji implementation because no Mtaji transition creates house ownership.

## D-004 — Reachability primary

Primary population uses historically reachable witness roots and their full forward closure. Rule-valid but reachability-unproven constructed states are not the primary population.

## D-005 — Closure by construction

Feature caps are root-selection benchmark filters only. The scientific domain is the complete forward closure. No legal edge may be dropped because a successor violates the root filter.

## D-006 — No symmetry reduction

Primary identity is direct/raw rule-state identity. `seatCanonicalKey`, player-swap, reflection, pit renumbering and other isomorphic reduction are forbidden in Study 1 primary state counting and solving.

## D-007 — `relay-limit` is not terminal ground truth

`MAX_RELAY=512` is an implementation safety guard according to `RULES_BASELINE.md`. A `reason="relay-limit"` result cannot seed retrograde WIN/LOSS.

## D-008 — Guard-free move semantics gate

Before a candidate domain is exact-eligible, every legal move in its closure must be independently shown to terminate under research-owned guard-free semantics. Otherwise the candidate is ineligible.

## D-009 — No automatic DRAW label

Current rules/engine expose no formal repetition draw. Fixed-point leftovers are `RECURRENT` / cycle-region states, not `DRAW`.

## D-010 — Absolute-winner terminal core

Terminal state is represented as `TERMINAL + absoluteWinner`. This avoids relying on post-terminal `state.player` semantics.

## D-011 — DTF metric

`DTF` = distance-to-forced-terminal in legal moves. `TERMINAL=0`; WIN minimizes; LOSS maximizes resistance; RECURRENT is null.

## D-012 — No outcome peeking in domain selection

Final Study 1 domain selection may use only technical feasibility quantities: closure state/edge counts, branching, move-termination status, deterministic reconstruction, runtime and memory. Exact WIN/LOSS/RECURRENT composition, DTF or optimal moves are forbidden inputs to domain selection.

## D-013 — Zero/negative result allowed

If no nontrivial exact-eligible domain passes frozen technical gates, Study 1 may close as infeasible/non-estimable. Post-outcome shrinking, cap retuning or symmetry-based rescue is forbidden.

## D-014 — V2 outcome-blind selection rule frozen

Across the 36 v2 technical profiles, deduplicate identical root sets and consider only complete closures. Select by:

1. largest state count;
2. largest edge count;
3. largest root count;
4. ascending root-set SHA-256 tie-break.

This rule is independent of game-theoretic outcome.

## D-015 — One-shot v3 expansion only

Before Stage 1, one technically motivated larger single-root closure could be tested at a larger resource cap. If it did not complete and independently verify, the already verified v2 domain became final and no further cap expansion was authorized.

The v3 candidate reached 423,733 states / 426,938 edges and then encountered `ADMIN-CUTOFF` at 1,000,000 move microsteps. Therefore final domain choice is the verified v2 fallback.

## D-016 — Frozen Stage 1 domain

Final Study 1 domain is `REWR-S1-DOMAIN-2026-08-24-v1`:

```text
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
```

No outcome-dependent replacement is allowed.

## D-017 — Independent algorithm requirement

Production and verifier must not share exact Mtaji legal-move generation, guard-free transition, state serialization, closure traversal, or retrograde algorithm. Reachability witness regeneration may share the frozen technical witness infrastructure.

## D-018 — Pre-generation correction permitted only before outcome

After authorization v1 but before any scientific solution was generated, a resource-limit field-name mismatch was found. Authorization v1 was revoked before runner execution. The two runner field references were corrected, source hashes were re-frozen and authorization v2 was issued. Domain, classification, DTF and endpoint were unchanged.

This event is frozen as a pre-generation technical correction and cannot justify later outcome-dependent changes.

## D-019 — Formal Study 1 decision

After authorization v2, production and independent solutions matched completely. Formal decision:

> **`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`**

The exact claim is limited to `REWR-S1-DOMAIN-2026-08-24-v1`.

## D-020 — Frozen root exact value

The frozen root is:

```text
Player 0 to move
WIN
absoluteWinner = 0
DTF = 3
unique optimal move = capture:mtaji:1:4:left:::false
```

This is exact only within the frozen complete forward closure.

## D-021 — No cycle generalization

`RECURRENT = 0` in the solved 8-state domain. This does not support the general claim that Bao, Mtaji, or Bao endgames contain no recurrent/cyclic regions.
