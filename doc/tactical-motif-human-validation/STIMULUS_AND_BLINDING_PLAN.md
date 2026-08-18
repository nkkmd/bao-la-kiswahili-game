# STIMULUS_AND_BLINDING_PLAN — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-18  
Status: **EXACT FORMAL MACHINE STIMULI FROZEN / NEVER PRESENTED TO HUMAN PARTICIPANTS**

## Final use state

Stage 1 completed the machine stimulus pipeline and deterministically froze the exact formal set. Study 1 then closed before scientific recruitment.

```text
exact formal positions frozen = 42
scientific recruitment started = false
human participants exposed to formal stimuli = 0
formal human responses = 0
```

The planned blinding/task-order rules below were therefore technically prepared but never exercised on human participants.

## 1. Fresh stimulus pool

Stage 1 used a new non-overlapping machine corpus rather than Tactical Motifs Study 1 formal roots.

Frozen v1 population:

```text
games = 1536
seeds = 22100001..22101536
strata = B-D1, B-D2, B-D3, LS-D2, V2-D2, LE-D2
256 games per stratum
opening = first 8 plies seeded-uniform exact E.moveVariants
maxPly = 100
extension = forbidden
replacement = forbidden
```

The corpus was independently replay/search verified before stimulus selection: `1536/1536`, full recomputation, mismatch count `0`.

## 2. C03 target eligibility

A target root satisfies the frozen historical C03 definition without human outcomes:

```text
phase = mtaji
precondition = reusablePits=0-2
at least one legal exact move matching:
  takata / row 1 / direction right / coarse-no-index
```

C03 structural consequence and machine search value do not determine entry into the human target pool.

Observed frozen target count: `687`.

## 3. Near-miss controls

Primary controls come from the same fresh pool and Mtaji context.

Frozen classes:

- `P_ONLY`: low reusable-pit precondition holds but no canonical C03 matching move is available;
- `M_ONLY`: canonical C03 matching move is available but low reusable-pit precondition fails;
- `MORPH_NEAR`: a Mtaji takata differs from C03 morphology in exactly one of row/direction while the exact C03 combination is absent and the C03 precondition fails.

Controls are not assumed to be strategically bad. They are controls for construct identity, not labels of poor play.

Observed counts:

```text
P_ONLY     = 277
M_ONLY     = 621
MORPH_NEAR = 987
```

## 4. Matching variables

The Stage 1 nuisance matching was frozen on:

- generation condition;
- ply bin;
- actor house-owned state;
- actor legal-move count;
- actor front-row occupancy;
- actor board-seed count.

Maximum accepted cost: `10`.

Controls may not reuse the same historical trajectory or opening prefix as their matched target, and control reuse is forbidden.

Observed matched counts:

```text
P_ONLY     = 277
M_ONLY     = 605
MORPH_NEAR = 672
```

The compact artifact audit independently found zero same-trajectory violations, zero same-opening-prefix violations, zero within-family control reuse, and zero cost violations above `10`.

## 5. Primary task layout — superseding the Stage 0 pair-vs-pair draft

The initial Stage 0 draft considered a four-position target-pair vs control-pair layout. That draft was superseded **before scientific human data** by `TMHV-D024` and the frozen Stage 1 machine-readable contract.

The frozen formal design is a **three-position discrimination block**:

```text
C03 target A
C03 target B
matched non-C03 control
```

A participant would select which two positions are better explained by the same reusable move-selection principle. The correct construct pair is target A + target B. There are three possible pairs, so random correctness is `1/3`.

Frozen formal instrument structure:

- 12 primary blocks;
- 4 blocks with `P_ONLY` control;
- 4 blocks with `M_ONLY` control;
- 4 blocks with `MORPH_NEAR` control.

The exact formal identities were generated only by `TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`.

## 6. Formal position recurrence firewall

The exact formal-freeze result contains, across all 36 primary positions:

- unique `ruleStateKey`;
- unique `historicalTrajectoryHash`;
- unique `openingPrefixHash`.

Target B was selected from unused C03 targets using the same Stage 1 nuisance cost relative to target A, with maximum accepted cost `10`.

Six secondary move-choice C03 target positions were selected separately, one per generation stratum. They do not reuse any primary rule state, trajectory, or opening prefix and do not reuse one another.

Total formal unique positions: `42`.

Private exact freeze SHA-256:

`2cd0794d838aa3a91c0b549f60c9763a8d75a66d6ecf16c490d46d681ab2fa22`

## 7. Opening leakage firewall

The intended primary stimuli show board/rule state only. They do not show opening move history, seed, generator condition, candidate ID, search values, ply, reusable-pit counts, or Study 1 labels.

Position-only presentation was the formal default. A context-present condition would require a separate prospective study/version.

## 8. Task contamination firewall

The intended formal order was:

1. primary three-position discrimination;
2. individual move choice on different positions;
3. free-text explanation;
4. explicit label task.

No formal position was to be reused across primary and secondary tasks. Explicit `tesuji`/C03 terminology would appear only after uncued tasks.

No human participant reached any of these tasks in Study 1.

## 9. Rendering requirements

The dedicated renderer:

- reconstructs exact frozen rule states;
- normalizes the actor to South using validated player swap only;
- does not reverse columns or directions;
- does not show opening history, ply, machine labels, legal-move highlights, search values, reusable-pit counts, or tesuji terminology;
- produces deterministic participant-facing SVG.

The compact artifact audit confirmed the participant-facing object is restricted to `stimulusId`, `phase`, `actor`, and `svg`, with all actors South and all positions Mtaji.

## 10. Public/private boundary

Exact selected formal board states and participant SVGs remain in the gitignored private local freeze artifact. Public Git records only:

- the deterministic selection rule;
- exact input artifact hashes;
- the private freeze SHA-256 commitment;
- aggregate audit metadata.

Because Study 1 closed at N=0, no participant exposure occurred. Keeping the exact identities private also preserves the option of a separately versioned future prospective study without unnecessary public pre-exposure.

## 11. Negative-control candidates C01/C02/C04

They were not primary controls.

No human calibration data for C01/C02/C04 were collected. Their historical machine labels remain unchanged.

## 12. Human-data closure

Stage 1 machine readiness, artifact audit, rendering audit, and exact formal-stimulus freezing never authorized human recruitment or responses.

Study 1 closed before those human-facing gates were completed or activated:

```text
scientific recruitment started = false
formal human responses = 0
humanExpertEvidence = INCONCLUSIVE-NOT-ESTIMABLE
humanExpertN = 0
```

A future expert-validation effort must be a new prospective study or an explicitly versioned prospective reopening established before new human responses.