# Stage 1 — Fresh Stimulus / Instrument Development Protocol

Stage ID: `TMHV-S1-STIMULUS-2026-08-17-v1`

## Purpose

Stage 1 is machine-only infrastructure and stimulus development. It does **not** collect scientific human responses and does not authorize a human/expert tesuji claim.

The fixed population is 1,536 fresh games (`22100001..22101536`), six generation strata ×256, with the first eight plies selected uniformly from exact legal `E.moveVariants`. These seeds do not overlap either Tactical Motifs Study 1 seed block.

## Historical C03 binding

Stage 1 reads the immutable historical definition of `TM-S2-C03` from `doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json`. The expected historical candidate-definition SHA-256 is `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`.

No C03 redefinition is permitted.

## Pipeline

```text
freeze spec
→ validate tooling
→ source-hash authorization
→ generate fresh corpus locally
→ independent full replay/search verification
→ classify C03 targets / controls
→ deterministic outcome-blind matching
→ rendering/identity audit
→ Stage 2 preregistration
→ only then human data collection
```

GitHub Actions validates the contract and tooling only. It must not generate the 1,536-game scientific machine corpus.

## Stimulus classes

- `C03_TARGET`: frozen C03 precondition holds and an exact legal C03-matching move exists.
- `P_ONLY`: precondition holds but no C03-matching move exists.
- `M_ONLY`: precondition does not hold but a C03-matching move exists.
- `MORPH_NEAR`: precondition does not hold, no exact C03 move exists, but a Mtaji takata differs from C03 morphology in exactly one of row/direction.

Classes are determined before any human response exists.

## Recurrence protection

Identical historical trajectories are collapsed first. Within each stimulus class, a trajectory contributes at most one state selected by frozen SHA-256 rank. Duplicate rule states are then collapsed without replacement.

## Matching

Controls are matched to targets without reuse. A control cannot come from the same historical trajectory or the same opening prefix as its target. The frozen variables/cost are machine-state quantities only and never use D1/D2/D3 value or human outcomes.

## Primary task under development

The primary task candidate is a three-position blinded discrimination block: two independently sourced C03 target positions plus one matched non-C03 control. The participant selects the pair believed to share a reusable move principle. There are three possible pairs, so chance correctness is `1/3`.

Twelve formal blocks are planned, balanced four per control family. This remains Stage 1 instrument development and is not yet the final Stage 2 human preregistration.

## Rendering

The actor is normalized to South using only the validated player-swap transform. There is no column reversal and no direction reversal. Opening history, ply, machine labels, legal-move highlights, search values, reusable-pit counts, and tesuji terminology are hidden.

## Pilot firewall

Non-scientific dry runs may test layout/input/reconstruction. Dry-run responses are never formal observations, and dry-run participants cannot enter the primary formal cohort.

## Failure / stop conditions

Failure of a readiness gate is a valid Stage 1 result. The corpus is not extended, replaced, or selectively resampled to force a pass. A redesign requires a new prospective version before any human data.
