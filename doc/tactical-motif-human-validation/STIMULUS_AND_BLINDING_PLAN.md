# STIMULUS_AND_BLINDING_PLAN — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-17  
Status: **STAGE 1 MACHINE POOL READY / THREE-POSITION FORMAL FREEZE RULE VALIDATED / NO HUMAN DATA**

## 1. Fresh stimulus pool

Stage 1 uses a new non-overlapping machine corpus rather than Tactical Motifs Study 1 formal roots.

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

The Stage 1 nuisance matching is frozen on:

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

The current formal candidate is a **three-position discrimination block**:

```text
C03 target A
C03 target B
matched non-C03 control
```

The participant selects which two positions are better explained by the same reusable move-selection principle. The correct construct pair is target A + target B. There are three possible pairs, so random correctness is `1/3`.

Planned formal instrument:

- 12 primary blocks;
- 4 blocks with `P_ONLY` control;
- 4 blocks with `M_ONLY` control;
- 4 blocks with `MORPH_NEAR` control.

The exact formal identities are generated only by `TMHV-S1-FORMAL-STIMULUS-FREEZE-2026-08-17-v1`.

## 6. Formal position recurrence firewall

The exact formal-freeze rule requires, across all 36 primary positions:

- unique `ruleStateKey`;
- unique `historicalTrajectoryHash`;
- unique `openingPrefixHash`.

Target B is selected from unused C03 targets using the same Stage 1 nuisance cost relative to target A, with maximum accepted cost `10`.

Six secondary move-choice C03 target positions are selected separately, one per generation stratum. They may not reuse any primary rule state, trajectory, or opening prefix and may not reuse one another.

Expected total formal unique positions: `42`.

## 7. Opening leakage firewall

Primary stimuli show board/rule state only. They do not show opening move history, seed, generator condition, candidate ID, search values, ply, reusable-pit counts, or Study 1 labels.

Position-only presentation is the formal default. A context-present condition requires a separate prospective study/version.

## 8. Task contamination firewall

Formal order remains:

1. primary three-position discrimination;
2. individual move choice on different positions;
3. free-text explanation;
4. explicit label task.

No formal position is reused across primary and secondary tasks. Explicit `tesuji`/C03 terminology appears only after uncued tasks are complete.

## 9. Rendering requirements

The dedicated renderer:

- reconstructs exact frozen rule states;
- normalizes the actor to South using validated player swap only;
- does not reverse columns or directions;
- does not show opening history, ply, machine labels, legal-move highlights, search values, reusable-pit counts, or tesuji terminology;
- produces deterministic participant-facing SVG.

The compact artifact audit confirmed the participant-facing object is restricted to `stimulusId`, `phase`, `actor`, and `svg`, with all actors South and all positions Mtaji.

## 10. Pre-collection public/private boundary

Exact selected formal board states and participant SVGs are kept in the gitignored private local freeze artifact before collection. Public Git records only:

- the deterministic selection rule;
- exact input artifact hashes;
- the private freeze SHA-256 commitment after materialization;
- aggregate audit metadata.

This reduces avoidable participant pre-exposure while preserving a cryptographic preregistration commitment.

## 11. Negative-control candidates C01/C02/C04

They are not primary controls.

Fresh C01/C02/C04 examples may be included only as separately prespecified secondary calibration items. Human results for such items do not change their historical machine labels and do not affect C03 primary decision.

## 12. Human-data boundary

No scientific recruitment or human response collection is authorized by Stage 1 machine readiness, artifact audit, rendering audit, or exact formal-stimulus freezing. Stage 2 preregistration, ethics/consent/storage gates, and separate authorization remain mandatory.
