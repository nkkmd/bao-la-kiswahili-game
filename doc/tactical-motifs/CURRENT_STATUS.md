# CURRENT_STATUS — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-14

## Current state

**ACTIVE — Stage 0 complete; Stage 1 v1 scientific contract and execution tooling frozen/validated; Stage 1 exploratory generation AUTHORIZED but NOT YET EXECUTED.**

Baseline `main` HEAD remains:

`08c70ba6ac980884d51562c207410db3521b8ae4`

Current branch:

`research/tactical-motif-discovery`

Key commits:

- Stage 0 initialization: `de4931fb20c218c0d4b3d13689cf79af400e89bd`
- Stage 0 validation record: `c3e14ea9bdf7c6a92ec57b0413af925e9c8e70d1`
- Stage 1 scientific-contract freeze: `62fbf68cf12a3539b46dcdcd4487a0a9ea7debba`
- Stage 1 execution-tooling implementation: `1f97881338b14b9a885bd124a1a68d436c1e0a43`
- Stage 1 generation authorization: `1079e2e02d4031f980f0ddc2213c50f6c8a6e678`

Validated Actions runs:

- Stage 0 technical validation `31768708597` = `success`
- Stage 1 scientific-contract validation `31770343371` = `success`
- Stage 1 execution-tooling validation `31770629848` = `success`

## Scientific authorization state

- Stage 0 technical inspection: **COMPLETE / VALIDATED**
- Stage 1 v1 spec: **FROZEN / VALIDATED**
- Stage 1 execution tooling: **IMPLEMENTED / VALIDATED**
- Stage 1 scientific corpus generation: **AUTHORIZED / NOT GENERATED**
- Stage 1 exploratory inference: **NOT STARTED**
- Stage 2 formal corpus generation: **NOT AUTHORIZED**
- `confirmed tesuji` claim: **NOT AUTHORIZED**
- human/expert/traditional tesuji claim: **OUT OF SCOPE for Study 1**

No Stage 1 scientific game, selected scientific state, motif measurement, or candidate result has been generated yet.

## Stage 1 v1 frozen design

Stage ID:

`TM-S1-EXPLORATORY-2026-08-14-v1`

Spec:

`doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_SPEC.json`

Frozen spec SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

Authorization:

`doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`

The authorization binds the exact validated scientific implementation commit and exact SHA-256 mapping of all frozen scientific source files. A scientific source change invalidates the binding and requires a new validation/authorization boundary before generation.

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

These are trajectory-diversification metadata only. They do not reopen prior formal search/evaluator comparisons.

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

Every selected root is measured over **all legal exact moveVariants**, not only an AI-selected move.

Frozen measurements include:

- actor/opponent structural transformation
- capture / relay / sow event morphology
- house/nyumba changes
- immediate reply set and forced/free status
- all-immediate-reply root-actor-relative response envelope
- exact D1/D2/D3 root candidate values under the frozen `bao` instrument
- D1 reply-search diagnostic

A search-consistent principal variation is unavailable and is not fabricated.

Candidate patterns are prospectively frozen as:

`phase + 1–2 structural preconditions + one move abstraction + one consequence token`

with `coarse-no-index` and `indexed` move abstractions. Candidate support is deduplicated to one vote per historical trajectory. Opening-prefix, generation-stratum, support, and D3-value promotion gates were frozen before generation.

Passing Stage 1 promotion gates means **candidate for Stage 2 planning only**, never `confirmed tesuji`.

## Execution firewall

Authorized scientific execution order is fixed:

1. `generate`
2. independent full replay/search `verify`
3. `select`
4. inspect selection readiness
5. `measure`
6. inspect measurement readiness
7. `discover`

Technical enforcement:

- all scientific phases require the hash-bound authorization file
- `select` additionally requires `verification.json` with `passed=true` and `fullSearchRecomputation=true`
- `measure` requires frozen selection-readiness gates to pass
- `discover` requires frozen measurement-readiness to pass
- GitHub Actions never generate the 768-game scientific corpus
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

Once Stage 1 scientific generation is executed, the frozen protocol forbids seed extension, replacement sampling, threshold retuning, phase reassignment, opening-threshold relaxation, favorable subset selection, post-outcome depth selection, failed-candidate renaming, and manual candidate promotion.

A redesign requires a new prospective version and fresh non-overlapping corpus.

## Next action

The next scientific action is to execute the already-authorized local Stage 1 pipeline beginning with the fixed 768-game `generate` phase, then independent full replay/search verification.

At this checkpoint **authorization exists but scientific generation has intentionally not been executed**.
