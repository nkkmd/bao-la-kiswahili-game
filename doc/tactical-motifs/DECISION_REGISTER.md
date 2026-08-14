# DECISION_REGISTER — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-14

## TM-D001 — New prospective independent study

**Decision:** This study is independent from all completed Bao studies. Their formal decisions, thresholds, classifiers, endpoints, populations, and interpretation boundaries are immutable.

**Reason:** Prevent retrospective rescue and cross-study outcome leakage.

## TM-D002 — Baseline source of truth

**Decision:** Study baseline is `main` commit `08c70ba6ac980884d51562c207410db3521b8ae4`, verified as current at study start.

## TM-D003 — Three-stage firewall

**Decision:** Use Stage 0 technical audit → Stage 1 prospective exploratory discovery → Stage 2 fresh prospective formal confirmation. Stage 1 never authorizes Stage 2 generation.

## TM-D004 — No scientific corpus during Stage 0

**Decision:** Stage 0 may inspect code, implement representation tooling, and run deterministic technical/smoke tests only. It may not generate a scientific discovery or confirmation corpus.

## TM-D005 — Tesuji is not AI-best-move

**Decision:** Search rank/value is one measurement axis only. `best move`, frequency, forcing, structural transformation, and transferability remain separate constructs.

## TM-D006 — Joseki / tesuji separation

**Decision:** A pattern requiring a particular opening prefix or opening-sequence identity is opening-level knowledge, not a position-transferrable tesuji under this Study 1 definition.

## TM-D007 — Identity semantics remain distinct

**Decision:** Preserve `historicalStateHash`, `ruleStateKey`, and `seatCanonicalKey` as distinct identities. Do not use board hash equality as a substitute for structural transferability.

## TM-D008 — Validated symmetry only

**Decision:** Seat exchange using the validated player-swap transform is allowed. Horizontal column reversal or direction reversal is not assumed as a valid canonicalization.

**Reason:** Existing symmetry tooling identifies seat-swap without column/direction reversal as the validated engine symmetry.

## TM-D009 — Exact moveVariant identity

**Decision:** Exact move identity uses `AI.moveKey`, including Namua `houseChoice` and `houseTwo`. Where `E.moveVariants` exposes distinct house outcomes they must not be collapsed accidentally.

## TM-D010 — Actor-relative transition representation

**Decision:** Motif instrumentation expresses event positions and structural deltas relative to the root actor/opponent, enabling validated seat-invariant comparison without erasing local pit index/direction.

## TM-D011 — Engine events are authoritative; endpoint is derived

**Decision:** Capture/relay/sow consequences are read from `E.applyMove(...).events`. The engine has no dedicated `relayEndpoint` output. Any landing/endpoint quantity must be explicitly named as an event-derived measure (for example `lastSowPosition`) and separately validated before scientific use.

## TM-D012 — Reuse Position Complexity search diagnostic only as instrumentation

**Decision:** `position-complexity-search-diagnostic.js` may supply exact D1/D2/D3 root candidate values and tie-aware top sets. This does not alter or re-test Position Complexity Study 1.

## TM-D013 — No fabricated principal variation

**Decision:** Existing exact-root tooling does not expose a search-consistent principal variation. A line obtained by independently re-searching successive states may not be called the original search PV. Stage 1 should use reply sets/response envelopes unless a dedicated PV tracer is implemented and tested before generation.

## TM-D014 — Historical trajectory is the recurrence/support unit

**Decision:** Repeated nearby states from one trajectory cannot inflate motif recurrence. Stage 1 support counts must be trajectory-aware, with exact rule-state duplicates collapsed.

## TM-D015 — Outcome-independent root sampling

**Decision:** Stage 1 state selection must be fixed before motif measurement and use deterministic hash ranking or another prospectively frozen outcome-independent rule. No favorable replacement.

## TM-D016 — Opening-family concentration audit

**Decision:** Transferability claims require an audit showing that support is not effectively one opening prefix/family repeated many times. The exact domination threshold must be frozen in the Stage 1 spec before generation.

## TM-D017 — Analyze legal alternatives, not only chosen moves

**Decision:** Stage 1 should characterize all eligible root moveVariants so candidate discovery is not equivalent to collecting moves chosen by one AI policy.

## TM-D018 — Candidate examples are not fixed ontology

**Decision:** The six example motif families in the study prompt are hypothesis-generating examples only. Stage 1 may find different families or none.

## TM-D019 — Human/expert claims deferred

**Decision:** Terms such as traditional tesuji, expert-known, beginner-important, or human-important require a separate expert/human validation study.

## TM-D020 — Candidate definition freeze before Stage 2

**Decision:** Structural precondition, move matching rule, downstream outcome, comparator, population, unit, duplicate handling, estimability gate, multiplicity, alpha, decision/failure/no-rescue rules, and fresh seeds must be frozen and committed before Stage 2 generation.

## TM-D021 — Negative closure is acceptable

**Decision:** No reproducible candidate, not-confirmed, insufficient estimability, or technical inconclusive are valid outcomes; production of a tesuji catalogue is not a success requirement.
