# STIMULUS_AND_BLINDING_PLAN — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-16  
Status: **STAGE 0 DESIGN / NO HUMAN STIMULI GENERATED YET**

## 1. Fresh stimulus pool

Stage 1 will use a new non-overlapping machine corpus rather than Tactical Motifs Study 1 formal roots.

Reserved v1 population:

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

The corpus must be independently replay/search verified before stimulus selection.

## 2. C03 target eligibility

A target root must satisfy the frozen historical C03 definition without using human outcomes:

```text
phase = mtaji
precondition = reusablePits=0-2
at least one legal exact move matching:
  takata / row 1 / direction right / coarse-no-index
```

C03 structural consequence and machine search value are not allowed to determine whether a state enters the human target pool. They may be retained only as historical/diagnostic metadata where explicitly permitted.

## 3. Near-miss controls

Primary controls are selected prospectively from the same fresh pool and Mtaji context.

Prespecified classes:

- `P-ONLY`: low reusable-pit precondition holds but no canonical C03 matching move is available;
- `M-ONLY`: canonical C03 matching move is available but low reusable-pit precondition fails;
- `MORPH-NEAR`: row-1 takata/local morphology is similar but the frozen C03 rightward combination is not satisfied.

Controls are not assumed to be strategically bad. They are controls for C03 construct identity, not labels of poor play.

## 4. Matching variables

The following nuisance variables are fixed before human outcome data and will be audited in Stage 1:

- phase: exact Mtaji match;
- ply / game progress;
- legal move count;
- capture move count / forced-capture status;
- total seeds on board;
- front-row occupancy;
- nyumba seed count / house state where compatible;
- generation stratum;
- opening-prefix diversity.

`reusablePits` and exact C03 move availability are construct-defining quantities and are not blindly matched away when they define a near-miss class.

Stage 1 may set numeric calipers after inspecting only machine stimulus-pool distributions. Calipers must be frozen before any formal human response.

## 5. Primary task layout

Planned formal instrument: `12` paired-comparison blocks per participant.

Each block contains:

- one target pair: two C03-eligible positions from distinct trajectories/rule states/opening prefixes;
- one matched decoy pair: two near-miss control positions from a prespecified control class;
- randomized Pair A / Pair B assignment and randomized position order.

Neutral prompt concept:

> Which pair is better explained by the same reusable move-selection reason across the two positions?

Exact wording and translations will be frozen after non-scientific instrument validation.

## 6. Opening leakage firewall

Primary stimuli show board/rule state only. They do not show opening move history, seed, generator condition, candidate ID, search values, or Study 1 labels.

Position-only presentation is the formal default. A context-present condition, if ever scientifically desired, requires a separate prospectively frozen study/version and cannot be added after outcome inspection.

## 7. Task contamination firewall

Formal order:

1. primary pair discrimination;
2. individual move choice on different positions;
3. free-text explanation;
4. explicit label task.

No formal position is reused across primary and secondary tasks. Explicit `tesuji`/C03 terminology appears only after uncued tasks are complete.

## 8. Rendering requirements

The existing game UI already defines board orientation and pit labels, but the study requires a separate static renderer that:

- reconstructs exact frozen rule states;
- shows current player/phase/reserve only when prespecified;
- does not highlight legal moves before a response unless the formal instrument explicitly requires it;
- does not expose AI/search metadata;
- has deterministic rendering identity/hash;
- supports audit screenshots or deterministic DOM/state snapshots without participant data.

## 9. Negative-control candidates C01/C02/C04

They are not primary controls.

Fresh C01/C02/C04 examples may be included only as prespecified secondary calibration items if Stage 1 shows adequate estimability. Human results for those items do not change their historical machine labels and do not affect C03 primary decision.
