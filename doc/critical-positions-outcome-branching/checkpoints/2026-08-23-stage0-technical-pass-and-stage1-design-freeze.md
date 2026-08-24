# Checkpoint — Stage 0 technical PASS and Stage 1 prospective design freeze

Date: 2026-08-23

## State entering checkpoint

This checkpoint occurs before any Stage 1 scientific source-game or continuation-outcome generation.

```text
scientific Stage 0 corpus = none
Stage 1 seeds consumed = 0
Stage 2 seeds consumed = 0
scientific continuation outcomes inspected = false
```

## Stage 0 technical result

GitHub Actions run `32624898086`, job `97158580192` passed:

- prerequisite exact-root search diagnostic tests;
- prerequisite structural/reply-envelope tests;
- exact `E.moveVariants` / `AI.moveKey` intervention tests;
- Namua house-choice variant separation;
- paired derived-seed semantics;
- P1/P2/P3 supplied-RNG determinism;
- terminal and administrative-unfinished encoding;
- Namua→Mtaji phase-change fixture;
- technical continuation replay;
- independent technical continuation replay;
- P1 cap/replicate audit;
- independent replay of all 64 cap-audit records.

Deterministic core hashes:

```text
smoke = 75aaa30a9f8154873bf9391c27b4720886fce17ec7402b68800c03b2cbe276cd
cap audit = 0530faca878fa71b86f6b55b355cd0b70f67b5f8c32e287b82ce10dd8bb77678
```

Wall-clock timing is excluded from these hashes.

## Pre-scientific measurement freeze

The following are now frozen before Stage 1 outcomes:

```text
primary construct = fixed-policy empirical continuation divergence
root actor = state.player
root moves = all exact E.moveVariants / AI.moveKey variants
continuation policy = P1_NORMAL_TOP3
replicates per root move = 64
max post-root continuation plies = 200
unfinished = ADMINISTRATIVE_UNFINISHED, not draw
primary estimability = every move 64/64 terminal
move win rate = root-actor wins / 64
D_range = max move win rate - min move win rate
Stage 1 high-divergence threshold = 0.30
```

P2 exact D2 remains a secondary search-value axis, not the post-root continuation policy. P3 remains technical comparator only.

## Stage 1 prospective design freeze

`preregistration/STAGE_1_EXPLORATORY_SPEC.json` freezes:

- 3,072 fresh source games at `22600001..22603072`;
- six generation strata ×512;
- 8-ply seeded-uniform exact-move opening;
- trajectory-aware outcome-blind root selection;
- 300 Namua + 300 Mtaji root quota;
- strict no-replacement handling;
- all-move 64-replicate P1 continuation measurement;
- D2/D3 search and structural branch secondary axes;
- root-only structural candidate grammar;
- deterministic support/diversity/promotion gates and cap;
- full independent corpus and continuation remeasurement before discovery;
- zero scientific extension/rescue.

## Authorization boundary

This checkpoint and the Stage 1 spec **do not authorize scientific generation**.

The next permissible work is contract validation and Stage 1 runner/verifier implementation using fixtures or generation-disabled smoke modes. An authorization file may be issued only after those technical gates pass and exact scientific source hashes are bound.
