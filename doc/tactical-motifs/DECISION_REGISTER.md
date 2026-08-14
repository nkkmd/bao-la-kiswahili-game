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

## TM-D009 — Exact moveVariant identity

**Decision:** Exact move identity uses `AI.moveKey`, including Namua `houseChoice` and `houseTwo`. Distinct `E.moveVariants` outcomes must not be accidentally collapsed.

## TM-D010 — Actor-relative transition representation

**Decision:** Motif instrumentation expresses event positions and structural deltas relative to the root actor/opponent, enabling validated seat-invariant comparison without erasing local pit index/direction.

## TM-D011 — Engine events are authoritative; endpoint is derived

**Decision:** Capture/relay/sow consequences are read from `E.applyMove(...).events`. The engine has no dedicated `relayEndpoint`; any landing/endpoint quantity must be explicitly identified as derived.

## TM-D012 — Reuse Position Complexity search diagnostic only as instrumentation

**Decision:** `position-complexity-search-diagnostic.js` may supply exact D1/D2/D3 root candidate values and tie-aware top sets. This does not alter or re-test Position Complexity Study 1.

## TM-D013 — No fabricated principal variation

**Decision:** Existing exact-root tooling does not expose a search-consistent principal variation. Stage 1 uses reply sets/response envelopes rather than labeling an independently reconstructed line as the original search PV.

## TM-D014 — Historical trajectory is the recurrence/support unit

**Decision:** Repeated nearby states from one trajectory cannot inflate motif recurrence. Stage 1 support counts are trajectory-aware and selected exact rule-state duplicates are collapsed.

## TM-D015 — Outcome-independent root sampling

**Decision:** Stage 1 state selection is fixed before motif measurement and uses prospectively frozen hash assignment/ranking. No favorable replacement is allowed.

## TM-D016 — Opening-family concentration audit

**Decision:** Transferability requires explicit evidence that support is not dominated by one opening prefix/family.

## TM-D017 — Analyze legal alternatives, not only chosen moves

**Decision:** Stage 1 characterizes all eligible root moveVariants, not only the move selected by a generating AI policy.

## TM-D018 — Candidate examples are not fixed ontology

**Decision:** The six example motif families in the study prompt are hypothesis-generating examples only. Stage 1 may find different families or none.

## TM-D019 — Human/expert claims deferred

**Decision:** Traditional/expert-known/pedagogically-important tesuji claims require a separate human/expert validation study.

## TM-D020 — Candidate definition freeze before Stage 2

**Decision:** Candidate definition, matcher, population, comparator, endpoint, unit, duplicate handling, estimability, multiplicity, alpha, decision/failure/no-rescue rules, and fresh seeds must be frozen before Stage 2 generation.

## TM-D021 — Negative closure is acceptable

**Decision:** No reproducible candidate, not-confirmed, insufficient estimability, or technical inconclusive are valid outcomes; production of a tesuji catalogue is not a success requirement.

## TM-D022 — Stage 1 v1 corpus size and seed block

**Decision:** Freeze Stage 1 v1 at 768 games using fresh seeds `21900001–21900768`, max ply 100, no early stop, no outcome-dependent extension, and no replacement sampling.

## TM-D023 — Six-stratum trajectory diversification

**Decision:** Assign games by `gameIndex modulo 6` to `B-D1`, `B-D2`, `B-D3`, `LS-D2`, `V2-D2`, and `LE-D2`, exactly 128 games each.

**Boundary:** These are trajectory-generation strata only. Reusing condition names does not reopen earlier formal comparisons.

## TM-D024 — Randomized opening and explicit opening-family identity

**Decision:** The first 8 plies of every game use seeded uniform selection over exact `E.moveVariants`. The ordered exact 8-ply prefix is hashed as the opening-family identity.

**Promotion boundary:** A candidate requires at least 4 distinct opening prefixes and no single opening prefix above 50% of support.

## TM-D025 — One outcome-independently selected root per unique trajectory

**Decision:** After identical historical trajectories are collapsed, each representative trajectory is hash-assigned to Namua or Mtaji and contributes at most one root chosen by frozen SHA-256 rank within that phase. Unavailable assigned phases receive no replacement.

## TM-D026 — All legal moveVariants and all-reply response envelope

**Decision:** Measure every exact legal moveVariant at each selected root. For each candidate move, enumerate all immediate opponent moveVariants and summarize the response envelope relative to the original root actor.

## TM-D027 — Prospective Stage 1 candidate grammar

**Decision:** Stage 1 candidate patterns have the frozen form:

`phase + 1–2 structural precondition tokens + one move-abstraction token + one consequence token`

The phase token is mandatory and is not counted among the 1–2 additional structural preconditions. Move abstraction levels are `coarse-no-index` and `indexed`.

## TM-D028 — Outcome-independent within-trajectory candidate representative

**Decision:** If multiple exact moves from the same historical trajectory match the same candidate pattern, that trajectory contributes one vote using the lexicographically smallest exact `moveKey`, not the highest-valued move.

## TM-D029 — Frozen candidate promotion gates and deterministic cap

**Decision:** A pattern can be promoted only for Stage 2 planning if all prospectively frozen support, opening-diversity, generation-stratum diversity, and D3-value gates pass.

The promoted set is deterministic and capped at 8 total, 4 per phase, and 2 per move-abstraction key. Manual override is forbidden.

## TM-D030 — Two-step Stage 1 generation authorization

**Decision:** The Stage 1 spec alone cannot authorize scientific generation. Scientific generation requires successful contract validation plus successful runner/verifier validation, followed by a separate hash-bound authorization file.

## TM-D031 — Generate → verify → select → measure → discover firewall

**Decision:** State selection is blocked until independent full replay/search verification passes. Measurement is blocked if selection readiness fails. Discovery is blocked if the frozen minimum move-record gate fails.

## TM-D032 — Stage 1 no-rescue rule

**Decision:** After scientific generation begins, seed extension, replacement sampling, threshold retuning, favorable subset selection, phase reassignment, depth selection, opening-threshold relaxation, failed-candidate renaming, and manual promotion are forbidden.

A scientifically motivated redesign requires a new prospective Stage 1 version and a fresh non-overlapping corpus.

## TM-D033 — Large scientific artifacts remain local

**Decision:** The 768-game corpus and per-state measurements live only under `artifacts/local/tactical-motifs/stage1-exploratory-v1/`. GitHub Actions may validate tooling but must not generate the scientific corpus.

## TM-D034 — Full replay/search verification is mandatory before selection

**Decision:** The independent Stage 1 verifier must recompute each fixed-seed trajectory from the initial state, including the randomized exact-moveVariant opening and every post-opening AI search decision/search statistic. `select` requires `verification.json` with `passed=true` and `fullSearchRecomputation=true`.

**Reason:** A stored corpus is not scientifically selectable until its trajectory generation is independently reproduced under the frozen implementation.

## TM-D035 — Stage 1 generation authorization issued only after source-hash validation

**Decision:** Stage 1 exploratory scientific generation is authorized by `doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json` after:

- spec validation run `31770343371` = `success`;
- execution-tooling validation run `31770629848` = `success`;
- implementation commit fixed at `1f97881338b14b9a885bd124a1a68d436c1e0a43`;
- exact SHA-256 mapping of all frozen scientific source files captured from the successful CI.

Authorization commit: `1079e2e02d4031f980f0ddc2213c50f6c8a6e678`.

**Boundary:** This authorizes only the frozen Stage 1 exploratory pipeline. Confirmatory inference, Stage 2 generation, and `confirmed tesuji` claims remain unauthorized. At issuance, scientific games generated = 0.
