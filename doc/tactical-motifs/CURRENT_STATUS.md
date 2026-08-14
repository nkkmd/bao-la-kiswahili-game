# CURRENT_STATUS — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-14

## Current state

**ACTIVE — Stage 0 complete; Stage 1 v1 contract/tooling frozen and validated; the 768-game corpus is generated and fully replay/search verified; deterministic selection and measurement are complete; every frozen readiness gate has passed; exploratory candidate discovery is now authorized.**

Baseline `main` HEAD remains:

`08c70ba6ac980884d51562c207410db3521b8ae4`

Current branch:

`research/tactical-motif-discovery`

Key commits:

- Stage 0 initialization: `de4931fb20c218c0d4b3d13689cf79af400e89bd`
- Stage 0 validation record: `c3e14ea9bdf7c6a92ec57b0413af925e9c8e70d1`
- Stage 1 scientific-contract freeze: `62fbf68cf12a3539b46dcd4487a0a9ea7debba`
- Stage 1 execution-tooling implementation: `1f97881338b14b9a885bd124a1a68d436c1e0a43`
- Stage 1 generation authorization: `1079e2e02d4031f980f0ddc2213c50f6c8a6e678`
- Stage 1 stable-runtime execution runbook/recovery checkpoint: `6694714194eee2f536e90b4411566d9126e162ae`
- Stage 1 full-verification checkpoint: `831d441d426a9e0cb308a41d54c77a6074c4c490`
- Stage 1 selection-readiness checkpoint: `40990b1489f956d52486553bb5e39d974e47dd75`

Validated Actions runs:

- Stage 0 technical validation `31768708597` = `success`
- Stage 1 scientific-contract validation `31770343371` = `success`
- Stage 1 execution-tooling validation `31770629848` = `success`

## Scientific authorization state

- Stage 0 technical inspection: **COMPLETE / VALIDATED**
- Stage 1 v1 spec: **FROZEN / VALIDATED**
- Stage 1 execution tooling: **IMPLEMENTED / VALIDATED**
- Stage 1 scientific corpus generation: **COMPLETE**
- Stage 1 independent full replay/search verification: **PASSED**
- Stage 1 deterministic state selection: **COMPLETE**
- Stage 1 selection readiness: **PASSED**
- Stage 1 all-move exact measurement: **COMPLETE**
- Stage 1 measurement readiness: **PASSED**
- Stage 1 exploratory candidate discovery: **AUTHORIZED / NOT YET EXECUTED**
- Stage 2 formal corpus generation: **NOT AUTHORIZED**
- `confirmed tesuji` claim: **NOT AUTHORIZED**
- human/expert/traditional tesuji claim: **OUT OF SCOPE for Study 1**

No discovery candidate result or Stage 2 materialization has yet been generated.

## Stage 1 corpus generation / verification milestone

The fixed Stage 1 corpus was generated in a clean stable runtime from source commit:

`6694714194eee2f536e90b4411566d9126e162ae`

Manifest facts:

- Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`
- spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- authorization SHA-256: `9df06af5c330a529c7d4b33fbd3fa885a084fd1797d425a20d4ce620b6328f9a`
- generated games: 768
- seeds: `21900001–21900768`
- six generation strata: 128 games each
- unique historical trajectories: 741
- duplicate historical trajectory groups: 27
- largest duplicate group: 2
- distinct opening prefixes: 681
- manifest summary hash: `7d11bae51a21b77ed91eb7ffe4098d6be3e7035a0480689616a72bd76b3eb96c`
- source tree dirty: false

Independent verification facts:

- `passed = true`
- `fullSearchRecomputation = true`
- games verified: 768
- unique historical trajectories: 741
- distinct opening prefixes: 681
- verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`
- source tree dirty: false
- manifest and verifier scientific source SHA-256 mappings match exactly

This crossed only the preregistered technical gate from `verify` to `select`; it was not a motif result.

## Stage 1 deterministic selection / readiness milestone

Selection was executed only after the verified-corpus firewall passed.

Selection facts:

- generated games represented: 768
- unique historical trajectories entering trajectory-level selection: 741
- unavailable assigned phase: 25
  - Mtaji-assigned: 23
  - Namua-assigned: 2
- selected before rule-state collapse: 716
- duplicate selected rule states collapsed: 1
- selected unique rule states: 715
- replacement performed: `false`
- selected Namua states: 370
- selected Mtaji states: 345
- distinct selected opening prefixes: 659
- selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`

Selected counts by generation stratum:

- `B-D1`: 114
- `B-D2`: 115
- `B-D3`: 122
- `LS-D2`: 122
- `V2-D2`: 121
- `LE-D2`: 121

Frozen readiness gates and observed values:

- unique historical trajectories: 741 ≥ 550 — **PASS**
- selected unique rule states: 715 ≥ 450 — **PASS**
- Namua selected states: 370 ≥ 180 — **PASS**
- Mtaji selected states: 345 ≥ 180 — **PASS**
- distinct opening prefixes: 659 ≥ 32 — **PASS**
- minimum selected in any generation stratum: 114 ≥ 40 — **PASS**

`selection-audit.json` therefore has `passed=true`.

The 25 unavailable assigned-phase cases and one duplicate-rule-state collapse were handled exactly by the frozen no-replacement rules. No replacement sampling, phase reassignment, threshold relaxation, or favorable subset selection occurred.

This crossed the preregistered gate from `select` to `measure`. It was still not a motif finding.

## Stage 1 measurement / readiness milestone

Measurement was executed against exactly the 715 frozen selected unique rule states.

Measurement manifest facts:

- stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`
- spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- selection hash: `06d0004c71a7f72fee1d80f6c9048c95b053625d6a210ff32c9af839cd5db01a`
- completed measurements: 715
- measured exact move records: 3148
- frozen minimum measured move records: 1800
- measurement readiness passed: `true`
- measurement hash: `c4b8dc55caa21a6143c09c42e1686a9610208080ce467fee92ec044cf9e5ae4c`
- measurement source commit: `40990b1489f956d52486553bb5e39d974e47dd75`
- source tree dirty: `false`
- scientific source SHA-256 mapping: exact match to the frozen authorization-bound mapping

The frozen discovery-readiness gate is therefore satisfied:

- measured exact move records: 3148 ≥ 1800 — **PASS**

This crosses the preregistered gate from `measure` to `discover`. It does not itself identify, rank, promote, or confirm any tactical motif.

## Stage 1 v1 frozen design

Stage ID:

`TM-S1-EXPLORATORY-2026-08-14-v1`

Spec:

`doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_SPEC.json`

Frozen spec SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

Authorization:

`doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`

Scientific population:

- 768 games
- fresh seeds `21900001–21900768`
- six fixed generation strata × 128 games
- first 8 plies = seeded-uniform exact `E.moveVariants`
- max ply 100
- no early stop
- no outcome-dependent extension
- no replacement for unavailable trajectories or duplicate selected rule states

Generation strata:

- `B-D1`
- `B-D2`
- `B-D3`
- `LS-D2`
- `V2-D2`
- `LE-D2`

These remain trajectory-diversification metadata only and do not reopen prior formal search/evaluator comparisons.

## Stage 1 pseudoreplication / leakage firewall

- recurrence/support unit = unique `historicalTrajectoryHash`
- identical historical trajectories collapse before root selection
- one hash-assigned-phase root per representative trajectory
- root must have at least two exact moveVariants
- unavailable assigned phase = no replacement
- selected duplicate `ruleStateKey` roots collapse globally without replacement
- opening-prefix identity is separately hashed and concentration-gated
- Stage 1 seeds/states are forbidden from Stage 2 confirmation reuse

## Stage 1 measurement / discovery contract

Every selected root was measured over **all legal exact moveVariants**, not only an AI-selected move.

Frozen measurements include:

- actor/opponent structural transformation
- capture / relay / sow event morphology
- house/nyumba changes
- immediate reply set and forced/free status
- all-immediate-reply root-actor-relative response envelope
- exact D1/D2/D3 root candidate values under the frozen `bao` instrument
- D1 reply-search diagnostic

A search-consistent principal variation is unavailable and is not fabricated.

Candidate patterns remain prospectively frozen as:

`phase + 1–2 structural preconditions + one move abstraction + one consequence token`

with `coarse-no-index` and `indexed` move abstractions. Candidate support is deduplicated to one vote per historical trajectory. Opening-prefix, generation-stratum, support, and D3-value promotion gates were frozen before generation.

Passing Stage 1 promotion gates means **candidate for Stage 2 planning only**, never `confirmed tesuji`.

## Execution firewall

Authorized scientific execution order is fixed:

1. `generate` — **COMPLETE**
2. independent full replay/search `verify` — **PASSED**
3. `select` — **COMPLETE**
4. inspect selection readiness — **PASSED**
5. `measure` — **COMPLETE**
6. inspect measurement readiness — **PASSED**
7. `discover` — **NEXT / AUTHORIZED**

Technical enforcement:

- all scientific phases require the hash-bound authorization file
- `measure` required selection readiness to pass — satisfied
- `discover` requires at least 1800 measured exact move records — satisfied with 3148
- GitHub Actions never generate the scientific corpus or measurements
- large artifacts remain under `artifacts/local/tactical-motifs/stage1-exploratory-v1/`

## Immutable prior-study boundaries

### Phase Transition Study 1

`capture-branch-expansion` remains a bounded strategic-transition phenotype, not a universal Bao law and not a confirmed tesuji. Prior formal decisions remain immutable.

### Position Typology / Playing Style Study 1

MTAJI-M1/MTAJI-M2 remain bounded confirmed morphology. Namua has no confirmed discrete type. N-ACT/N-CON remain exploratory continuous coordinates. STYLE-C1..C4 remains `not-confirmed`.

### Namua→Mtaji Transition Study 1

Formal decision remains `NOT-CONFIRMED`. Current-engine first-Mtaji timing remains deterministic at ply 44 for games reaching Mtaji. Timing/survival/hazard endpoints are not reused.

### Position Complexity / Difficulty Study 1

Study remains closed with PCX-H1=`INCONCLUSIVE`, PCX-H2=`NOT-CONFIRMATORILY-EVALUATED`, overall=`INCONCLUSIVE`. Exact-root search tooling is reused only as measurement instrumentation.

### Joseki Study 1

Opening-sequence knowledge remains distinct from position-transferrable tesuji. Opening-prefix concentration is explicitly audited.

## No-rescue boundary

Scientific generation has occurred. Therefore the frozen protocol forbids seed extension, replacement sampling, threshold retuning, phase reassignment, opening-threshold relaxation, favorable subset selection, post-outcome depth selection, failed-candidate renaming, and manual candidate promotion.

A redesign requires a new prospective version and fresh non-overlapping corpus.

## Next action

Execute the frozen Stage 1 `discover` phase against the completed 3148 exact move measurements. After it completes, inspect `discovery-result.json` under the prospectively frozen candidate grammar, transferability gates, D3-value gates, deterministic ranking, and candidate caps. Any promoted item remains an **exploratory Stage 2 planning candidate only**.
