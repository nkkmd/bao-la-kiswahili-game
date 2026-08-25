# PBAI-P1 Research Generation 1 Evidence → Engineering Audit

Status: **PBAI-A COMPLETE / ENGINEERING AUDIT FROZEN**  
Audit date: 2026-08-26  
PBAI-P1 evidence cutoff anchor: `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
PBAI-A work-start remote `main`: `f50362a435a3c5cdd1d9b6dd8969b15dcf5e4dc8`  
Reference SHA supplied at work start: `f50362a435a3c5cdd1d9b6dd8969b15dcf5e4dc8` — **MATCH**

## 1. Purpose and immutable boundary

PBAI-A converts no scientific result into a production rule. It audits completed **Research Generation 1** results as engineering inputs while preserving every upstream formal label, threshold, classifier, endpoint, population and interpretation boundary.

The permitted flow is:

```text
completed Research Generation 1 result
        ↓
engineering implication / constraint / hypothesis
        ↓
PBAI candidate
        ↓
independent engineering benchmark and release gates
```

Engineering benchmark success does not retrospectively confirm a scientific hypothesis. Research Generation 2 outcomes are outside the PBAI-P1 evidence cutoff and are not imported by this audit.

No `public/` AI implementation file is changed by PBAI-A.

## 2. Canonical evidence-set eligibility

### 2.1 Included Research Generation 1 scientific evidence

The canonical PBAI-P1 Research Generation 1 evidence set consists of the 14 completed Study areas recorded in the first-generation closure sequence and in the Program seed map:

1. Phase Transition Study 1
2. Position Typology / Playing Style Study 1
3. Namua→Mtaji Strategic Temporal Transition Study 1
4. Position Complexity / Difficulty Study 1
5. Tactical Motifs / Tesuji Study 1
6. Tactical Motif Human / Expert Validation Study 1
7. Position Evaluation / Win-Rate Calibration Study 1
8. Blunder / Misvaluation Patterns Study 1
9. Critical Positions / Outcome Branching Study 1
10. Restricted Endgame / Winning Regions Study 1
11. Symmetry / Isomorphic Positions Study 1
12. Restricted Endgame Oracle Representation Integrity / Symmetry Confirmation Study 1 (`ORISC-STUDY1`)
13. State Space / Game Tree Complexity Study 1
14. Practical Comeback / Error-Inducing Move Study 1 (`PCEM-STUDY1`)

### 2.2 Earlier research / engineering context

The First Joseki Study, first-player advantage research, paired-opening work, and historical AI development predate the Research Generation 1 closure sequence used by this Program. They are therefore **context / benchmark / infrastructure inputs**, not silently reclassified as Research Generation 1 scientific evidence by PBAI-A.

Their reusable engineering contributions include paired openings, seat balancing, seeded self-play, historical benchmark controls and negative adoption history. If a later PBAI decision wishes to use a specific scientific finding from those earlier studies as candidate evidence, its eligibility must be recorded explicitly rather than inferred from this audit.

### 2.3 Excluded evidence

```text
Research Generation 2 scientific outcomes = EXCLUDED
post-cutoff scientific rescue/reinterpretation = EXCLUDED
candidate engineering results = not scientific evidence for upstream Studies
```

The current remote `main` is newer than the scientific cutoff only because PBAI-P1 establishment and AI naming documentation were added; this does not broaden the scientific evidence cutoff.

## 3. Engineering evidence-tier semantics

These tiers classify **engineering use**, not scientific evidence strength.

- **E1 — direct engineering candidate evidence:** a bounded positive/exact result can directly define a benchmark stratum, exact trigger surface, fixture or bounded candidate input. Production adoption still requires PBAI benchmarks.
- **E2 — engineering hypothesis evidence:** a reproducible phenomenon can motivate a new engineering-only mechanism, but the scientific classifier/candidate is not copied into production as a validated rule.
- **E3 — engineering constraint / prohibition:** negative, inconclusive, non-estimable or bounded results prohibit overclaiming or unsafe implementation shortcuts.
- **E4 — reusable infrastructure:** replay, identity, exact-move, seed, provenance, verification, continuation and bounded exact-analysis infrastructure reusable by engineering.

## 4. Study-by-study audit

### 4.1 Phase Transition Study 1

**Source of truth:** `doc/phase-transition/STUDY_1_FINAL_REPORT.md`, `STUDY_1_VOCABULARY.md`, `CURRENT_STATUS.md`.

- **Formal scientific status:** E-010 `not-confirmed`; E-011 `inconclusive`; E-017 `not-confirmed`; E-018/H16 `confirmed` only at fixed `hard / bao / depth2` with phase2 > legacy; E-019/H17 global `not-confirmed`; E-020/H18 `confirmed` only at fixed `hard / bao / depth3` with legacy > phase2.
- **Actual finding:** `capture-branch-expansion` is a reproducible, persistent, structurally interpretable phenotype within the observed forced-capture lifecycle, with explicit search-condition dependence. The favored search profile reverses between the tested depth-2 and depth-3 conditions.
- **Scientific boundary:** no universal Bao phase-transition law; no unrestricted depth/search generalization.
- **Engineering tier:** **E2 + E4**.
- **Engineering implication:** phase/forcing/capture-branch structure is credible hypothesis material for candidate-specific search allocation or diagnostics; the search-profile reversal is a reason to require depth/phase robustness tests.
- **Prohibited inference:** do not hard-code CBE as a universal strategic phase law or assume one search profile is globally superior.
- **Possible engineering use:** benchmark stratification; trigger-feature experiments; depth-conditioned regression cases.
- **Candidate link:** mainly `PBAI-C001`; secondarily constrains `PBAI-C004`.
- **Required benchmark:** Namua/Mtaji and forcing strata, fixed-depth D2/D3 comparisons, tactical regression, overall paired strength and local decision-loss checks.
- **Risk / regression mode:** overfitting to one phenotype; depth-specific reversal; extra search cost without strength gain.

### 4.2 Position Typology / Playing Style Study 1

**Source of truth:** `doc/position-typology/STUDY_1_FINAL_REPORT.md`, `STUDY_1_VOCABULARY.md`, `REPRODUCIBILITY_INDEX.md`, `CURRENT_STATUS.md`.

- **Formal scientific status:** bounded Mtaji two-type morphology confirmed; no promoted discrete Namua type; discrete playing-style typology unsupported; exact Stage-4 style geometry later `NOT-CONFIRMED`.
- **Actual finding:** frozen role-invariant representation supports `MTAJI-M1` and `MTAJI-M2` within the preregistered population. These labels describe morphology, not position quality.
- **Scientific boundary:** M1/M2 do not mean winning/losing, strong/weak, passive/aggressive or universal Bao types. Historical seat-oriented representations do not override later RAW-only downstream identity requirements.
- **Engineering tier:** **E1 for benchmark/feature stratification; E2 for any evaluation/search mechanism; E3 for unsupported axes; E4 for feature/replay tooling**.
- **Engineering implication:** M1/M2 may be used as frozen morphology strata or candidate-input features. A morphology-dependent bonus or search rule is a new engineering hypothesis, not a direct scientific conclusion.
- **Prohibited inference:** do not productionize exploratory Namua/style coordinates as validated classes; do not infer strength from M1/M2 labels.
- **Possible engineering use:** candidate-stratified benchmark; morphology-aware search/evaluation ablation.
- **Candidate link:** `PBAI-C001`.
- **Required benchmark:** M1/M2 stratified decision quality and strength, plus Namua/Mtaji aggregate non-inferiority and runtime.
- **Risk / regression mode:** morphology detector drift; local improvement masking opposite-stratum regression; semantic relabeling as strength.

### 4.3 Namua→Mtaji Strategic Temporal Transition Study 1

**Source of truth:** `doc/namua-mtaji-transition/STUDY_1_FINAL_REPORT.md`, `STAGE_2_FORMAL_RESULT.md`, `CURRENT_STATUS.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** primary formal decision `NOT-CONFIRMED`.
- **Actual finding:** under the frozen engine, first Mtaji timing is mechanically determined by reserve exhaustion (`firstMtajiPly = 44` for trajectories that reach it); the preregistered CBE→first-Mtaji morphology association was not confirmed.
- **Scientific boundary:** no causal null, no timing effect, no generalization beyond the frozen population/search condition.
- **Engineering tier:** **E3 + E4**, with limited **E2** for state-based rather than timing-based hypotheses.
- **Engineering implication:** do not spend candidate complexity on a pseudo-strategic first-Mtaji clock; prefer actual state morphology/search signals.
- **Prohibited inference:** do not resurrect `time-to-first-Mtaji` as a strategic AI trigger or reinterpret the small descriptive difference as positive evidence.
- **Possible engineering use:** deterministic phase-transition regression; timing-heuristic prohibition.
- **Candidate link:** constraint on `PBAI-C001`.
- **Required benchmark:** state-conditioned, not clock-conditioned, phase transition strata.
- **Risk / regression mode:** encoding a mechanically determined clock as if it carried strategic information.

### 4.4 Position Complexity / Difficulty Study 1

**Source of truth:** `doc/position-complexity/STUDY_1_FINAL_REPORT.md`, `STAGE_2_FORMAL_RESULT.md`, `CURRENT_STATUS.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** `PCX-H1 = INCONCLUSIVE`; `PCX-H2 = NOT-CONFIRMATORILY-EVALUATED`; overall `INCONCLUSIVE`.
- **Actual finding:** exact root candidates, TopSet, score gap, workload and adjacent-depth instability can be measured reproducibly; the preregistered inferential model did not satisfy its convergence gate.
- **Scientific boundary:** machine complexity/search instability is not human difficulty; there is no validated general-purpose difficulty classifier from Study 1.
- **Engineering tier:** **E2 + E3 + E4**.
- **Engineering implication:** use the validated measurement instruments to design a new engineering-only selective-deepening trigger, not to copy the failed/inconclusive scientific classifier.
- **Prohibited inference:** do not label a position human-difficult or deploy the Study 1 classifier as an adaptive-search truth rule.
- **Possible engineering use:** D2↔D3 disagreement, root-best changes, best-second gap and workload as development diagnostics.
- **Candidate link:** `PBAI-C004`.
- **Required benchmark:** fixed-depth decision-loss improvement, time-limited latency/timeout/depth, phase/opening strata, paired playing strength.
- **Risk / regression mode:** spending time on false-positive difficult states and losing depth elsewhere; circular trigger evaluation.

### 4.5 Tactical Motifs / Tesuji Study 1

**Source of truth:** `doc/tactical-motifs/STUDY_1_FINAL_REPORT.md`, `STAGE_2_FORMAL_RESULT.md`, `CURRENT_STATUS.md`, `DECISION_REGISTER.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** `TM-S2-C03 = CONFIRMED`; C01/C02/C04 `NOT-CONFIRMED`.
- **Actual finding:** C03 is a machine-reproducible transferable tactical motif under the frozen operationalization; fresh Stage 2 showed strong structural-success and D3-quality consistency.
- **Scientific boundary:** not a traditional/expert-recognized tesuji, human-difficulty result, forced win or universal optimal-move principle.
- **Engineering tier:** **E1 + E3 + E4**. A selective extension or move-ordering mechanism inspired by it is still an engineering hypothesis to test.
- **Engineering implication:** C03 can define an exact tactical stratum/fixture and a prospectively specified candidate trigger surface.
- **Prohibited inference:** no direct `C03 => forced best move` rule; do not convert C01/C02/C04 to production motifs.
- **Possible engineering use:** tactical regression stratum; isolated move-ordering or extension candidate.
- **Candidate link:** `PBAI-C002`.
- **Required benchmark:** exact C03 cases plus matched non-C03 controls, existing tactical suite, paired strength, runtime/node overhead and severe-loss frequency.
- **Risk / regression mode:** overspecialization; extension explosion; degrading non-C03 positions; semantic overclaim.

### 4.6 Tactical Motif Human / Expert Validation Study 1

**Source of truth:** `doc/tactical-motif-human-validation/STUDY_1_FINAL_REPORT.md`, `CURRENT_STATUS.md`, `STAGE_2A_RECRUITMENT_FEASIBILITY_RESULT.json`, `DECISION_REGISTER.md`.

- **Formal scientific status:** machine/instrument stage complete; human axis `INCONCLUSIVE-NOT-ESTIMABLE`, `N=0`.
- **Actual finding:** a reproducible 42-position human-validation instrument was frozen, but no scientific recruitment occurred because accessible eligible experts were zero.
- **Scientific boundary:** N=0 is not negative human evidence and cannot support any human-recognition/difficulty claim.
- **Engineering tier:** **E3 + E4**.
- **Engineering implication:** preserve machine-only wording in candidate/UI diagnostics; reuse fixture-selection methodology if useful.
- **Prohibited inference:** do not say C03 is expert-recognized, intuitive, deceptive or difficult for people.
- **Possible engineering use:** machine regression fixture design only.
- **Candidate link:** constraint on `PBAI-C002` and any public explanation.
- **Required benchmark:** machine endpoints only unless a separate human evidence program exists.
- **Risk / regression mode:** product language silently converting machine evidence into human claims.

### 4.7 Position Evaluation / Win-Rate Calibration Study 1

**Source of truth:** `doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`, `STAGE_2_FORMAL_RESULT.md`, `CURRENT_STATUS.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** overall `INCONCLUSIVE`.
- **Actual finding:** static `bao` evaluation is an actor-relative score, not a probability. The Stage-1 phase-stratified isotonic mapping was exploratory; Stage 2 was technically valid but failed preregistered estimability gates after the identity firewall.
- **Scientific boundary:** neither engine score nor Study-1 isotonic mapping is a validated Bao win probability, game-theoretic probability or human judgment probability.
- **Engineering tier:** **E3 + E4**.
- **Engineering implication:** sanitize score semantics and prevent probability-like labels/conversions unless separately validated.
- **Prohibited inference:** do not ship the isotonic mapping as `win%`; a stronger future AI would not retrospectively confirm Study 1.
- **Possible engineering use:** API/UI terminology audit, score normalization for internal numerical convenience only if explicitly non-probabilistic.
- **Candidate link:** `PBAI-C005`.
- **Required benchmark:** semantic/API regression, unchanged move decisions unless candidate explicitly changes decision logic, UI tests if displayed, no probability terminology.
- **Risk / regression mode:** users or downstream code interpreting heuristic score as calibrated probability; unintended decision changes during “sanitation”.

### 4.8 Blunder / Misvaluation Patterns Study 1

**Source of truth:** `doc/blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md`, `results/STAGE_2_FORMAL_RESULT.json`, `CURRENT_STATUS.md`, `DECISION_REGISTER.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** 0 `CONFIRMED`; 4 `NOT-CONFIRMED`.
- **Actual finding:** several structural/reply failure signatures, especially C01-C03, recurred strongly, but their common D3-inferior recurrence failed the frozen confirmation floor.
- **Scientific boundary:** the candidates are not confirmed machine blunder rules and the result is not a proof that their moves are game-theoretically sound.
- **Engineering tier:** **E2 + E3 + E4**.
- **Engineering implication:** recurrence signatures can seed new regression/error-mode hypotheses, but must be independently redefined and evaluated as engineering candidates.
- **Prohibited inference:** do not hard-code BMP C01-C04 as blunder detectors or use failed thresholds/subgroups as rescue.
- **Possible engineering use:** matched regression strata; candidate diagnostic logging.
- **Candidate link:** secondary input to `PBAI-C004`; not a standalone production rule.
- **Required benchmark:** severe decision-loss frequency, matched signature/non-signature controls, tactical regressions, overall strength.
- **Risk / regression mode:** false-positive avoidance rules that suppress strong moves; post-hoc scientific rescue by engineering.

### 4.9 Critical Positions / Outcome Branching Study 1

**Source of truth:** `doc/critical-positions-outcome-branching/STUDY_1_FINAL_REPORT.md`, `results/STAGE_1_EXPLORATORY_SUMMARY.json`, `CURRENT_STATUS.md`, `DECISION_REGISTER.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** Stage 1 exploratory complete; 139/600 high-divergence roots; 1,183 candidate audits; promoted candidates 0; Stage 2 not executed.
- **Actual finding:** large fixed-policy empirical continuation divergence exists in the fresh population, but the frozen simple structural grammar did not produce a promotable reusable class.
- **Scientific boundary:** continuation divergence is policy-conditioned empirical behavior, not game-theoretic winning probability or a validated critical-position classifier.
- **Engineering tier:** **E2 + E3 + E4**.
- **Engineering implication:** search budget may benefit from direct uncertainty/disagreement measurements, but a new engineering trigger must be prospectively specified.
- **Prohibited inference:** do not productionize the old one-to-two-token grammar or label high-divergence roots game-theoretic turning points.
- **Possible engineering use:** selective-deepening hypothesis; validation strata for decision sensitivity.
- **Candidate link:** `PBAI-C004`.
- **Required benchmark:** direct trigger precision/coverage, severe decision loss, phase/opening robustness, runtime opportunity cost, paired strength.
- **Risk / regression mode:** sparse trigger support; self-referential benchmark; over-allocation to policy-specific noise.

### 4.10 Restricted Endgame / Winning Regions Study 1

**Source of truth:** `doc/restricted-endgame-winning-regions/STUDY_1_FINAL_REPORT.md`, `results/STAGE_1_EXACT_RESULT.json`, `CURRENT_STATUS.md`, `DECISION_REGISTER.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`.
- **Actual finding:** one historically reachable Mtaji root and its complete forward closure were exactly solved: 8 raw states, 7 legal edges, 4 terminal, 3 WIN, 1 LOSS, 0 RECURRENT; the frozen root is Player-0 WIN with DTF 3 and a unique optimal move.
- **Scientific boundary:** exact only for this immutable 8-state domain; not a global Bao/Mtaji/endgame oracle.
- **Engineering tier:** **E1 + E3 + E4**.
- **Engineering implication:** exact lookup/fallback plumbing can be tested safely on a tiny proven domain and used as an exact regression fixture.
- **Prohibited inference:** no broad tablebase probe, no extrapolation outside exact keys, no replacement of heuristic evaluation globally.
- **Possible engineering use:** exact lookup architecture with strict key/domain membership and safe fallback.
- **Candidate link:** `PBAI-C003`.
- **Required benchmark:** exact 8-state hit correctness, zero false hits outside domain, transition/value/DTF consistency, lookup overhead, fallback equivalence.
- **Risk / regression mode:** key mismatch causing false oracle hits; negligible practical coverage; representation drift.

### 4.11 Symmetry / Isomorphic Positions Study 1

**Source of truth:** `doc/symmetry-isomorphic-positions/STUDY_1_FINAL_REPORT.md`, `results/STAGE_1_FORMAL_RESULT.json`, `CURRENT_STATUS.md`, `DECISION_REGISTER.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** 0 validated; 0 rejected; 5 `NON-ESTIMABLE`. Executed v1 was technically invalidated; corrected v2 was not authorized/executed.
- **Actual finding:** invalidated-v1 bounded diagnostics had zero mismatch for several candidates, but mandatory oracle identity control failed, so those observations are not candidate-decision evidence.
- **Scientific boundary:** validated nontrivial transformation set remains empty.
- **Engineering tier:** **E3 + E4**.
- **Engineering implication:** state/TT/tablebase identity must remain non-symmetry-reduced unless a future independent validation authorizes a transform.
- **Prohibited inference:** do not use reflection, seat swap or compound canonicalization because diagnostic mismatch happened to be zero.
- **Possible engineering use:** transformation-validation test methodology only.
- **Candidate link:** global constraint on all candidates, especially `PBAI-C003`.
- **Required benchmark:** RAW identity; no quotient/canonical key.
- **Risk / regression mode:** silent state collision or move-equivariance failure.

### 4.12 ORISC-STUDY1

**Source of truth:** `doc/oracle-representation-integrity-symmetry-confirmation/STUDY_1_FINAL_REPORT.md`, `results/`, `CURRENT_STATUS.md`, `DECISION_REGISTER.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** Axis A `ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED`; Axis B `NOT-AUTHORIZED-NOT-EXECUTED`.
- **Actual finding:** fresh production/independent reconstruction agrees on the 8-state/7-edge raw graph and 64-seed accounting, but three immutable repository-facing terminal rows fail stored-row re-hash and reconstructed raw-state binding because `pending` differs. The exact materialization cause remains `UNRESOLVED-PROVENANCE-GAP`.
- **Scientific boundary:** REWR exact solution remains unchanged; repository-facing rows are not validated as a raw reconstruction anchor; no nontrivial symmetry candidate was authorized.
- **Engineering tier:** **E3 + E4**.
- **Engineering implication:** any PBAI exact-state lookup must use a freshly verified RAW binding or an engineering-derived artifact with explicit provenance, not blindly trust the affected repository rows.
- **Prohibited inference:** do not “repair” the scientific result and call ORISC confirmed; do not infer a specific corruption mechanism without evidence.
- **Possible engineering use:** RAW serializer, seed-conservation guard, representation-binding test, artifact provenance check.
- **Candidate link:** hard constraint on `PBAI-C003`; identity constraint for all state-derived diagnostics.
- **Required benchmark:** exact RAW-key reproduction, `pending` sensitivity, 64-seed conservation, source/hash binding and false-hit tests.
- **Risk / regression mode:** using a display/materialized state row as authoritative identity and matching the wrong position.

### 4.13 State Space / Game Tree Complexity Study 1

**Source of truth:** `doc/state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md`, `results/STAGE_2_FORMAL_RESULT.json`, `CURRENT_STATUS.md`, `DECISION_REGISTER.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`, RAW-only.
- **Actual finding:** standard-root reachable RAW graph through depth 8 has 24,848 raw states and 25,648 transition occurrences from parent depths 0..7; non-deduplicated game tree has 30,941 node and 30,940 edge occurrences. Transpositions are directly present in this bounded domain.
- **Scientific boundary:** not a global state-space count, full game-tree estimate or validated symmetry-reduced count.
- **Engineering tier:** **E2 + E3 + E4**.
- **Engineering implication:** bounded evidence supports retaining/testing transposition-aware search and provides exact shallow expansion fixtures; it does not set a global cache-size formula.
- **Prohibited inference:** do not say `Bao state space = 24,848`; do not derive full-game memory/time claims from depth 8 alone.
- **Possible engineering use:** TT regression, exact shallow graph fixture, branching/transposition stress strata.
- **Candidate link:** infrastructure/constraint for search candidates, especially `PBAI-C004`.
- **Required benchmark:** cache correctness, node-count impact, fixed-depth move equivalence and memory limits on representative deeper states.
- **Risk / regression mode:** extrapolating a Namua-only shallow domain to later-game search behavior.

### 4.14 PCEM-STUDY1

**Source of truth:** `doc/practical-comeback-error-inducing-moves/STUDY_1_FINAL_REPORT.md`, `results/STAGE_1_EXPLORATORY_RESULT.json`, `results/STAGE_1_INDEPENDENT_VERIFICATION.json`, `CURRENT_STATUS.md`, `REPRODUCIBILITY_INDEX.md`.

- **Formal scientific status:** Stage 0 `TECHNICAL-PASS`; Stage 1 `EXPLORATORY-ONLY`; 55 audits; promoted candidates 0; Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`.
- **Actual finding:** reference-policy quality, bounded comeback under a frozen imperfect opponent, defense-set concentration, opponent-error dependence, reply pressure and optimality gap can be measured separately and independently reconstructed; no frozen candidate class met promotion support gates.
- **Scientific boundary:** no validated “winning try”, game-theoretic comeback move, human difficulty or human error-inducement detector.
- **Engineering tier:** **E2 + E3 + E4**.
- **Engineering implication:** opponent-policy sensitivity/reply structure may seed engineering robustness diagnostics or selective-search hypotheses, but PCEM-T1..T8 are not production rules.
- **Prohibited inference:** do not label machine reply pressure as human difficulty or use near-miss candidates after threshold relaxation.
- **Possible engineering use:** continuation-policy stress tests and opponent-policy robustness strata.
- **Candidate link:** secondary evidence for `PBAI-C004` and robustness gates.
- **Required benchmark:** reference decision loss, multiple opponent-policy stress conditions, phase strata, runtime and overall strength.
- **Risk / regression mode:** optimizing for one imperfect opponent policy rather than improving public AI quality generally.

## 5. Authoritative state identity for PBAI-P1

For research-derived state binding, tablebase keys, exact fixtures and diagnostics that claim Research Generation 1 RAW identity, the authoritative identity is:

```text
include:
pits
reserve
houseOwned
player
phase
winner
pending

exclude:
turn
reason
```

No symmetry reduction, seat swap, reflection or quotient identity is authorized.

### Current-public implementation observation

At PBAI-A work-start `main`, `public/ai.js` function `stateKey(state)` serializes pits, player, phase, reserve, house ownership and winner but does **not** include `pending`. Therefore:

```text
AI.stateKey != Research Generation 1 authoritative RAW identity contract
```

This audit does **not** conclude that current public search is incorrect: the runtime applicability and reachability of distinct nonterminal states differing only in `pending` must be assessed separately in PBAI-B/PBAI-C if relevant. The immediate engineering constraint is narrower and binding:

> `AI.stateKey` must not be silently reused as an authoritative Research Generation 1 RAW tablebase/research identity for `PBAI-C003` or similar features.

`public/diagnostics.js` does serialize `pending`, but currently supplies `[0,0]` when the field is absent; an engineering RAW-key path must instead follow the stricter relevant identity contract where required.

## 6. Reusable engineering infrastructure (E4)

PBAI-P1 may reuse, without changing upstream scientific artifacts:

- authoritative RAW-state serialization and 64-seed conservation guards;
- exact `moveVariants` legal-move identity;
- deterministic fixed-seed replay;
- paired openings and seat-balanced comparisons;
- source/commit/artifact hashes and provenance manifests;
- independent replay/search/measurement reconstruction patterns;
- cross-stage identity firewalls;
- exact root-candidate / TopSet / decision-gap diagnostics;
- bounded exact-oracle/retrograde fixtures;
- fixed continuation policies and common-random-number designs;
- development/validation/holdout separation conventions.

Engineering-derived fixtures must be versioned separately from immutable scientific source artifacts.

## 7. Candidate evidence trace after PBAI-A

PBAI-A establishes evidence readiness only. **No candidate is authorized for development.**

| Candidate | Evidence basis after audit | Audit disposition | Main required safeguards |
| --- | --- | --- | --- |
| `PBAI-C001` | bounded phase/search dependence + confirmed Mtaji morphology | `EVIDENCE-AUDIT-READY` | separate morphology stratification from unvalidated eval/search mechanism; state not clock; phase/stratum robustness |
| `PBAI-C002` | `TM-S2-C03` machine-confirmed motif | `EVIDENCE-AUDIT-READY` | exact trigger; matched controls; no forced-win/human claim; runtime/tactical regressions |
| `PBAI-C003` | exact 8-state restricted domain + ORISC RAW-binding constraint | `EVIDENCE-AUDIT-READY` | exact domain membership; dedicated RAW key including `pending`; verified artifact; safe fallback; zero false hits |
| `PBAI-C004` | reproducible search instability, continuation divergence and reply-pressure phenomena | `EVIDENCE-AUDIT-READY` | new engineering-only trigger; no difficulty/criticality classifier reuse; runtime opportunity-cost gate |
| `PBAI-C005` | calibration `INCONCLUSIVE` establishes semantic prohibition | `EVIDENCE-AUDIT-READY` | no probability mapping; prefer semantics-only change unless separately authorized; decision equivalence where applicable |

`EVIDENCE-AUDIT-READY` means only that the evidence basis and prohibited inferences are sufficiently specified for later candidate design. It is strictly weaker than `AUTHORIZED-FOR-DEVELOPMENT`.

## 8. Existing public AI / benchmark observations relevant to next phases

At PBAI-A completion:

- public lineage remains `AI-GEN2`;
- default public evaluation profile is `bao`; `bao-v2` remains experimental/diagnostic and is not an AI generation label;
- hard/expert public requests use `AIConfig.searchOptions`, which currently returns fixed base search settings rather than enabling the historical adaptive-search API;
- enhanced alpha-beta search includes iterative deepening, TT, PVS-style null-window search, killer ordering and quiescence; evaluation caching is active by default for hard/expert inside `analyzeMove`;
- Web Worker search and same-path fallback exist;
- paired-opening/seat-swapped benchmark infrastructure, tactical regressions, fixed-depth deterministic comparison and time-limited operational tests already exist;
- historic `bao-v2`, MCTS, adaptive-budget and weight-tuning variants were not adopted and are not reopened automatically by PBAI-A.

These observations are baseline-inspection inputs only. The exact public configuration is not frozen until PBAI-B.

## 9. PBAI-A completion gate

| Gate | Result |
| --- | --- |
| canonical Research Generation 1 Study list fixed | PASS — 14 Study core |
| earlier joseki/first-player context eligibility resolved | PASS — context/infrastructure only unless separately authorized |
| source-of-truth documents identified | PASS |
| each Study preserves formal scientific status/boundary | PASS |
| each Study assigned E1/E2/E3/E4 engineering use | PASS |
| prohibited inferences recorded | PASS |
| candidate families traced to evidence | PASS |
| authoritative RAW identity/restraints recorded | PASS |
| Research Generation 2 outcomes absent | PASS |
| public AI implementation changed during PBAI-A | **NO** |

Formal PBAI-A engineering decision:

```text
PBAI-A = COMPLETE
Research Generation 1 evidence cutoff = FROZEN at 2db7c4d65771066e914f32cbc4116fcc3e9e386a
candidate evidence readiness = PBAI-C001..PBAI-C005 EVIDENCE-AUDIT-READY
candidate development authorization = 0
public AI code changes = 0
AI-GEN2 exact baseline = NOT-FROZEN
AI-GEN3 = RESERVED / NOT-AUTHORIZED
Research Generation 2 evidence included = false
```

## 10. Next authorized phase

The next phase is **PBAI-B — AI-GEN2 Public Baseline Freeze**. PBAI-B must bind the exact public source/configuration, hashes and operational semantics before any candidate implementation. PBAI-C numeric non-regression/release thresholds remain to be frozen after/with the exact baseline and before candidate development authorization.
