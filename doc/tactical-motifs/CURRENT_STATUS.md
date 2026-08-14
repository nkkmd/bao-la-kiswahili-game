# CURRENT_STATUS — Tactical Motifs / Tesuji Study 1

Updated: 2026-08-14

## Current state

**ACTIVE — Stage 0 complete; Stage 1 v1 prospective exploratory specification, representation, and candidate grammar frozen; pre-generation technical validation pending. Scientific corpus runner/verifier are the next gate.**

Baseline `main` HEAD:

`08c70ba6ac980884d51562c207410db3521b8ae4`

Current branch:

`research/tactical-motif-discovery`

Stage 0 initialization commit:

`de4931fb20c218c0d4b3d13689cf79af400e89bd`

Stage 0 validation-record commit:

`c3e14ea9bdf7c6a92ec57b0413af925e9c8e70d1`

Stage 0 GitHub Actions run `31768708597` = `success`.

## Scientific authorization state

- Stage 0 technical inspection: **COMPLETE / VALIDATED**
- Stage 1 v1 spec: **FROZEN**
- Stage 1 v1 pre-generation technical validation: **PENDING**
- Stage 1 scientific corpus generation: **NOT YET AUTHORIZED**
- Stage 1 exploratory inference: **NOT STARTED**
- Stage 2 formal corpus generation: **NOT AUTHORIZED**
- Any `confirmed tesuji` claim: **NOT AUTHORIZED**
- Human/expert/traditional tesuji claim: **OUT OF SCOPE for Study 1**

No scientific corpus has been generated for this study.

## Stage 1 v1 frozen design

Stage ID:

`TM-S1-EXPLORATORY-2026-08-14-v1`

Spec:

`doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_SPEC.json`

Frozen spec SHA-256:

`f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`

Scientific population:

- 768 games
- fresh seeds `21900001–21900768`
- 6 prospectively fixed generation strata × 128 games
- 8 seeded-uniform opening plies from exact `moveVariants`
- max ply 100
- no early stop
- no outcome-dependent extension
- no replacement for unavailable trajectories or duplicate selected rule states

The six generation strata are `B-D1`, `B-D2`, `B-D3`, `LS-D2`, `V2-D2`, and `LE-D2`.
They are used only to diversify trajectory generation; prior research comparisons are not reopened.

## Stage 1 identity / sampling firewall

- recurrence/support unit = unique `historicalTrajectoryHash`
- identical historical trajectories collapse before state selection
- each representative trajectory is hash-assigned to Namua or Mtaji
- exactly one eligible root is selected from the assigned phase by frozen SHA-256 rank
- root must have at least two `E.moveVariants`
- unavailable assigned phase receives no replacement
- selected duplicate `ruleStateKey` roots collapse globally without replacement
- opening-prefix family is separately hashed and audited

## Stage 1 measurement

Every selected root is measured over **all legal moveVariants**, not only an AI-selected best move.

The frozen representation/tooling contract records:

- move-local actor/opponent structural transformation
- capture / relay / sow event morphology
- house/nyumba changes
- immediate reply set and forced/free status
- all-immediate-reply structural response envelope
- exact D1/D2/D3 root candidate values using the frozen `bao` instrument
- D1 reply-search diagnostic

A search-consistent principal variation is still not available and is not fabricated.

## Prospective candidate mining

Candidate patterns are frozen as:

`phase + 1–2 structural preconditions + one move abstraction + one consequence token`

Two move abstraction levels are retained:

- `coarse-no-index`
- `indexed`

Support is deduplicated to one vote per historical trajectory.
Opening-prefix and generation-stratum concentration gates prevent one opening/policy family from
masquerading as transferability.

Passing Stage 1 promotion gates means **candidate for Stage 2 planning only**.

## Pre-generation authorization firewall

The frozen spec alone cannot start scientific generation.

Before `generate` can run:

1. the frozen Stage 1 spec/representation/candidate grammar must pass dedicated technical validation;
2. a scientific corpus runner and independent verifier must be implemented and separately validated against this frozen contract;
3. only then may a separate `doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json` be committed;
4. that authorization must bind the exact spec SHA and validated scientific implementation hashes.

No authorization file exists at this checkpoint.

## Future scientific execution order

Once runner/verifier implementation is validated and separately authorized, the frozen order is:

1. generate
2. independently verify full replay/search
3. select
4. inspect readiness gates
5. measure
6. inspect measurement readiness
7. discover

Selection is blocked until verification passes.
Measurement is blocked if selection readiness fails.
Discovery is blocked if measurement readiness fails.

## Immutable prior-study boundaries

### Phase Transition Study 1

`capture-branch-expansion` remains a bounded strategic-transition phenotype, not a universal Bao
law and not a confirmed tesuji. Prior formal decisions remain immutable.

### Position Typology / Playing Style Study 1

MTAJI-M1/MTAJI-M2 remain bounded confirmed morphology. Namua has no confirmed discrete type.
N-ACT/N-CON remain exploratory continuous coordinates. STYLE-C1..C4 remains `not-confirmed`.

### Namua→Mtaji Transition Study 1

Formal decision remains `NOT-CONFIRMED`. Current-engine first-Mtaji timing remains deterministic at
ply 44 for games reaching Mtaji. Timing/survival/hazard endpoints are not reused.

### Position Complexity / Difficulty Study 1

Study remains closed with PCX-H1=`INCONCLUSIVE`,
PCX-H2=`NOT-CONFIRMATORILY-EVALUATED`, overall=`INCONCLUSIVE`.
Exact-root search tooling is reused only as an instrument.

### Joseki Study 1

Opening-sequence knowledge remains distinct from position-transferrable tesuji.
Opening-prefix concentration is explicitly audited in Stage 1.

## Current explicit technical bounds

- validated canonical symmetry is seat exchange only
- horizontal reflection is not assumed
- `relayEndpoint` is not engine-native; landing measures remain explicitly derived
- current exact-root diagnostic does not expose a search-consistent PV
- AI/search value is one axis only, not a tesuji definition

## Next gate

Run and inspect the dedicated Stage 1 pre-generation technical validation.

If this validation succeeds, the next gate is implementation and independent technical validation of the corpus runner/verifier against the frozen contract. Authorization remains forbidden until that later gate also passes.

Scientific corpus generation remains blocked.
