# DECISION_REGISTER — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-15

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

**Decision:** Exact move identity uses `AI.moveKey`, including Namua `houseChoice` and `houseTwo`. Where `E.moveVariants` exposes distinct house outcomes they must not be collapsed accidentally.

## TM-D010 — Actor-relative transition representation

**Decision:** Motif instrumentation expresses event positions and structural deltas relative to the root actor/opponent, enabling validated seat-invariant comparison without erasing local pit index/direction.

## TM-D011 — Engine events are authoritative; endpoint is derived

**Decision:** Capture/relay/sow consequences are read from `E.applyMove(...).events`. The engine has no dedicated `relayEndpoint` output. Any landing/endpoint quantity must be explicitly named as an event-derived measure and separately validated before scientific use.

## TM-D012 — Reuse Position Complexity search diagnostic only as instrumentation

**Decision:** `position-complexity-search-diagnostic.js` may supply exact D1/D2/D3 root candidate values and tie-aware top sets. This does not alter or re-test Position Complexity Study 1.

## TM-D013 — No fabricated principal variation

**Decision:** Existing exact-root tooling does not expose a search-consistent principal variation. A line obtained by independently re-searching successive states may not be called the original search PV. Stage 1 uses reply sets/response envelopes instead.

## TM-D014 — Historical trajectory is the recurrence/support unit

**Decision:** Repeated nearby states from one trajectory cannot inflate motif recurrence. Stage 1 support counts are trajectory-aware, with exact rule-state duplicates collapsed.

## TM-D015 — Outcome-independent root sampling

**Decision:** Stage 1 state selection is fixed before motif measurement and uses prospectively frozen deterministic hash ranking. No favorable replacement.

## TM-D016 — Opening-family concentration audit

**Decision:** Transferability claims require an audit showing support is not effectively one opening prefix/family repeated many times.

## TM-D017 — Analyze legal alternatives, not only chosen moves

**Decision:** Stage 1 characterizes all eligible root moveVariants so candidate discovery is not equivalent to collecting moves chosen by one AI policy.

## TM-D018 — Candidate examples are not fixed ontology

**Decision:** Example motif families are hypothesis-generating only. Stage 1 may find different families or none.

## TM-D019 — Human/expert claims deferred

**Decision:** Terms such as traditional tesuji, expert-known, beginner-important, or human-important require a separate expert/human validation study.

## TM-D020 — Candidate definition freeze before Stage 2

**Decision:** Structural precondition, move matching rule, downstream outcome, comparator, population, unit, duplicate handling, estimability gate, multiplicity, alpha, decision/failure/no-rescue rules, and fresh seeds must be frozen and committed before Stage 2 generation.

## TM-D021 — Negative closure is acceptable

**Decision:** No reproducible candidate, not-confirmed, insufficient estimability, or technical inconclusive are valid outcomes; production of a tesuji catalogue is not a success requirement.

## TM-D022 — Stage 1 v1 corpus size and seed block

**Decision:** Freeze Stage 1 v1 at 768 games using fresh seeds `21900001–21900768`, max ply 100, no early stop, no outcome-dependent extension, and no replacement sampling.

## TM-D023 — Six-stratum trajectory diversification

**Decision:** Assign games by `gameIndex modulo 6` to `B-D1`, `B-D2`, `B-D3`, `LS-D2`, `V2-D2`, and `LE-D2`, exactly 128 games each.

**Boundary:** These are trajectory-generation strata only. Reusing the condition names does not reopen earlier formal comparisons.

## TM-D024 — Randomized opening and explicit opening-family identity

**Decision:** The first 8 plies of every game use seeded uniform selection over exact `E.moveVariants`. The ordered exact 8-ply prefix is hashed as the opening-family identity.

**Promotion boundary:** A candidate requires at least 4 distinct opening prefixes and no single opening prefix above 50% support.

## TM-D025 — One outcome-independently selected root per unique trajectory

**Decision:** After identical historical trajectories are collapsed, each representative trajectory is hash-assigned to Namua or Mtaji and contributes at most one root chosen by frozen SHA-256 rank within that phase. Unavailable assigned phases receive no replacement.

## TM-D026 — All legal moveVariants and all-reply response envelope

**Decision:** Measure every exact legal moveVariant at each selected root. For each candidate move, enumerate all immediate opponent moveVariants and summarize the response envelope relative to the original root actor.

## TM-D027 — Prospective Stage 1 candidate grammar

**Decision:** Stage 1 candidate patterns have the frozen form `phase + 1–2 structural precondition tokens + one move-abstraction token + one consequence token`.

Two move abstraction levels are retained: `coarse-no-index` and `indexed`.

## TM-D028 — Outcome-independent within-trajectory candidate representative

**Decision:** If multiple exact moves from the same historical trajectory match the same candidate pattern, that trajectory contributes one vote using the lexicographically smallest exact `moveKey`.

## TM-D029 — Frozen candidate promotion gates and deterministic cap

**Decision:** A pattern can be promoted only for Stage 2 planning if it satisfies all prospectively frozen support, opening-diversity, generation-stratum diversity, and D3 value gates in the Stage 1 spec.

The promoted set is selected deterministically and capped at 8 total, 4 per phase, and 2 per exact move-abstraction token. Manual override is forbidden.

## TM-D030 — Two-step Stage 1 generation authorization

**Decision:** The Stage 1 spec alone cannot authorize scientific generation. A separate source-hash-bound authorization is required after scientific-contract and execution-tooling validation.

## TM-D031 — Generate → verify → select → measure → discover firewall

**Decision:** State selection is blocked until independent full replay/search verification passes. Measurement is blocked if selection readiness fails. Discovery is blocked if the frozen minimum move-record gate fails.

## TM-D032 — Stage 1 no-rescue rule

**Decision:** After scientific generation begins, seed extension, replacement sampling, threshold retuning, favorable subset selection, phase reassignment, depth selection, opening-threshold relaxation, failed-candidate renaming, and manual promotion are forbidden.

A scientifically motivated redesign requires a new prospective version and a fresh non-overlapping corpus.

## TM-D033 — Large scientific artifacts remain local

**Decision:** The 768-game corpus, per-state measurements, and large discovery output remain under `artifacts/local/tactical-motifs/stage1-exploratory-v1/`. GitHub Actions may validate tooling but must not generate the scientific corpus.

## TM-D034 — Full replay/search verification is mandatory before selection

**Decision:** The independent Stage 1 verifier must recompute each fixed-seed trajectory from the initial state, including randomized exact-moveVariant opening and every post-opening AI search decision/search statistic. `select` requires `passed=true` and `fullSearchRecomputation=true`.

## TM-D035 — Source-hash-bound Stage 1 generation authorization

**Decision:** After Stage 1 scientific-contract validation run `31770343371` and execution-tooling validation run `31770629848` both completed with `success`, issue `STAGE_1_EXPLORATORY_AUTHORIZATION.json` binding the frozen spec SHA-256, implementation commit `1f97881338b14b9a885bd124a1a68d436c1e0a43`, and exact SHA-256 mapping of all frozen scientific source files.

Authorization commit: `1079e2e02d4031f980f0ddc2213c50f6c8a6e678`.

**Boundary:** This authorizes only the frozen Stage 1 exploratory pipeline. Confirmatory inference, Stage 2 generation, and any `confirmed tesuji` claim remain unauthorized.

## TM-D036 — Stage 1 discovery result and compact candidate freeze

**Decision:** Treat the completed `discovery-result.json` as the authoritative local Stage 1 discovery artifact, anchored by SHA-256 `aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34`. Do not commit the 339,427,002-byte file. Freeze the eight promoted definitions and required audit metrics in `STAGE_1_CANDIDATE_FREEZE.json`.

**Audit:** The artifact contains 3,116,520 raw pattern instances, 323,676 unique pattern keys, 105,501 detailed candidates, and 218,175 low-support patterns. Independent streaming audit found 948 detailed candidates passing every frozen promotion gate and exactly reproduced the stored eight promoted candidate keys after reapplying the frozen ranking and caps.

**Boundary:** The eight definitions are exploratory Stage 2 planning candidates only.

## TM-D037 — Support-equivalent promoted definitions are not automatically independent phenomena

**Decision:** Record identical `supportIdentityHash` among promoted definitions as a support-equivalence audit observation. The Stage 1 machine output remains eight candidate definitions; no post-hoc merge, rename, or manual promotion is permitted.

Observed support-equivalent pairs:

- ranks 1–2
- ranks 3–4
- ranks 5–6
- ranks 7–8

**Stage 2 boundary:** Before any fresh Stage 2 data exist, prospectively freeze whether the eight definitions are tested separately, represented as four support-equivalent families, or modeled hierarchically. That choice may not be altered in response to Stage 2 outcomes.

## TM-D038 — Stage 2 remains blocked after Stage 1 completion

**Decision:** Completion of Stage 1 and presence of eight promoted definitions does not authorize Stage 2 generation.

Before Stage 2 generation, separately freeze candidate/family handling, exact matching, fresh eligible population and non-overlapping seeds, comparator, formal outcome, duplicate handling, estimability/sample-size rules, multiplicity/alpha, decision/failure rules, no-rescue rules, and an explicit Stage 2 generation authorization.

## TM-D039 — Four canonical Stage 2 formal candidates

**Decision:** Treat the four exact Stage 1 `supportIdentityHash` pairs as the Stage 2 family structure, while leaving all eight Stage 1 definitions immutable. Freeze one canonical formal definition per pair using the lowest Stage 1 promoted rank: ranks `1,3,5,7`.

Paired ranks `2,4,6,8` are diagnostic-only. They may not replace, merge with, rescue, or supersede the canonical definition after fresh-data inspection.

**Reason:** Avoid testing duplicate Stage 1 support realizations as eight nominally independent primary hypotheses while preventing outcome-driven post-hoc consolidation.

## TM-D040 — Stage 2 fresh population and candidate-specific root sampling

**Decision:** Freeze Stage 2 at 3,072 fresh games using seeds `22000001–22003072`, six generation strata ×512, first 8 plies seeded-uniform exact `E.moveVariants`, max ply100, no extension, and no replacement.

For each canonical candidate, root eligibility may use only the candidate phase, frozen canonical precondition, minimum legal-move eligibility, and availability of a matching exact legal move. Candidate consequence, D1/D2/D3 values, reply outcome, and game outcome are forbidden from eligibility.

Each eligible unique historical trajectory contributes at most one candidate-specific SHA-ranked root. Duplicate selected rule states collapse within candidate without replacement.

## TM-D041 — Deterministic formal candidate move and two co-primary endpoints

**Decision:** At a selected root, freeze the formal candidate move as the lexicographically smallest exact matching `AI.moveKey`; search value and consequence cannot affect move choice.

Two co-primary endpoints are frozen per candidate:

1. candidate move satisfies the frozen structural consequence;
2. candidate move belongs to the exact D3 top set among all legal root moves.

Each endpoint uses a one-sided exact-binomial test against `p=0.50` and also requires observed rate `>=0.60`. D3 at-or-above-median must be `>=0.60`; D3 unique-worst must be `<=0.15`.

## TM-D042 — Stage 2 transferability, multiplicity, and decision rules

**Decision:** A candidate is formally estimable only with at least 96 unique historical trajectories, 96 unique rule states, 48 opening prefixes, at least 4 generation strata, maximum one-prefix share `<=0.10`, and maximum one-stratum share `<=0.50`.

Exactly eight planned p-values (`4 candidates × 2 co-primary endpoints`) are adjusted using Holm-Bonferroni at FWER `0.05`. A non-estimable planned endpoint contributes `p=1.0` to the adjustment and cannot be dropped.

Formal decisions are `CONFIRMED`, `NOT-CONFIRMED`, `INCONCLUSIVE-NOT-ESTIMABLE`, or `TECHNICAL-INCONCLUSIVE`. Zero confirmed candidates is a valid outcome.

## TM-D043 — Pre-generation numerical hardening does not alter the scientific design

**Decision:** Before any Stage 2 scientific generation, treat potential floating-point underflow in naive exact-binomial tail evaluation as a technical validity issue requiring hardening, not as a reason to change any scientific threshold or endpoint.

Authorization was suspended before the scientific source change. The binomial calculation was replaced with log-combination, log-space recurrence, and log-sum-exp accumulation. Candidate definitions, population, seed block, endpoints, thresholds, multiplicity, and decision rules remained unchanged.

Hardened validation run `31785214590`, job `94719501008` passed all 9 tests with 0 formal games and 0 formal measurements.

## TM-D044 — Source-hash-bound Stage 2 formal authorization

**Decision:** Authorize Stage 2 formal generation only after hardened tooling validation and bind authorization to the exact candidate-definition SHA, spec SHA, Stage 1 candidate-freeze SHA, Stage 1 discovery-result SHA, and exact hardened scientific source-file SHA mapping.

Active authorization SHA-256:

`43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`

Active authorization-binding run `31785382236`, job `94720016585` = `success`.

**Boundary:** This authorizes only the fixed Stage 2 pipeline. Any authorization-bound scientific source change invalidates generation until a new pre-generation validation/authorization boundary is established.

## TM-D045 — Stage 2 generate → verify → select → measure → evaluate firewall

**Decision:** Stage 2 execution order is fixed as `generate → independent full replay/search verify → candidate-specific select → measure → formal evaluate`.

Candidate-specific selection requires `verification.json` with `passed=true` and `fullSearchRecomputation=true`. Formal evaluation requires measurement-integrity success. GitHub Actions must never generate the 3,072-game scientific corpus.

After Stage 2 scientific generation begins, seed extension, replacement, candidate substitution, paired-definition promotion, merge/split based on fresh outcomes, threshold/endpoint retuning, planned-test dropping, post-outcome depth selection, favorable subset selection, and failed-candidate renaming are forbidden.

## TM-D046 — Accept the Stage 2 formal result without rescue

**Decision:** Accept `stage2-formal-result.json` as the canonical local Stage 2 result, anchored by result-core SHA-256 `62719429fcca9de8b99309e2b8542a237184a91c29863db23d5aa8c0f4ad6748` and uploaded/local file SHA-256 `f13f5a87464a5c8b360695977edc5fca4348f438fbf20c4bd5be682ed80d4dd4`.

All four candidates were estimable and all eight preregistered co-primary tests remained in the Holm-Bonferroni family. The final formal decisions are:

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

No formal decision is changed by paired-definition diagnostics or post-hoc interpretation.

## TM-D047 — C03 is the sole confirmed machine-operational tactical motif

**Decision:** Authorize C03 as a **machine-reproducible transferable tactical motif under the frozen Bao engine/search operationalization**.

Frozen definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

Fresh formal evidence:

```text
n = 1272
structural success = 0.978774
D3 top-set rate = 0.736635
D3 at-or-above-median rate = 0.869497
D3 unique-worst rate = 0.070755
```

Both co-primary endpoints, both observed-rate requirements, all estimability gates, and both D3 consistency gates pass.

**Boundary:** This does not establish traditional/expert-recognized tesuji status, human importance, beginner importance, pedagogical value, causal strategic benefit outside the formal construct, or generalization beyond the frozen rules/engine/search instrument.

## TM-D048 — C01/C02/C04 are immutable negative formal results and Study 1 closes

**Decision:** Retain C01, C02, and C04 as `NOT-CONFIRMED` and close Tactical Motifs / Tesuji Study 1 as **CLOSED / COMPLETE**.

C01's structural recurrence is not sufficient to rescue its failed tactical-value co-primary endpoint. C02 and C04 are not rescued by their exploratory origin or paired diagnostic definitions.

Any replication, human/expert validation, pedagogical study, external-validity extension, or alternative formalization requires a new prospective independent study with a separately frozen contract and, where formal data are required, a fresh non-overlapping corpus.
