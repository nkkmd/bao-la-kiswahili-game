# Checkpoint — Stage 5 Not-Confirmed / Stage 6 Cross-Study Bridge Start

Date: 2026-08-10

## Closed result

Stage 5 playing-style continuous independent confirmation is complete.

```text
preregistration = PTYP-S5-STYLE-CONTINUOUS-CONFIRM-2026-08-10-v1
resultHash = 6069ea45dc055dbd65a14a939ccaa427466d1e3f8852ed81f555dc7ebe16e97c
formalDecision = not-confirmed
```

Technical gates passed. G1/G3/G4 passed. G2/G5 failed.

No threshold, coordinate count, descriptor, preprocessing, seed block, or algorithm is changed after this result.

STYLE-C1..C4 remain discovery-derived exploratory trajectory descriptors and are not upgraded to confirmed styles.

## Position-level state retained

```text
MTAJI-M1 / MTAJI-M2 = formally confirmed bounded position morphologies
Namua N-ACT / N-CON = exploratory continuous state coordinates
old actor-oriented mtaji k=2 = relational-polarity coordinate, not type
```

## New phase

The next operational phase is named:

```text
Stage 6 — Study 1 cross-study bridge
```

This corresponds to the original Research Plan's later cross-study relation objective; the operational number is shifted because Stage 5 was used for playing-style independent confirmation.

Stage 6 is secondary / hypothesis-generation. It cannot alter:

- E-010 / E-011 / E-017 / E-018 / E-019 / E-020 decisions,
- the fixed Study 1 `capture-branch-expansion` classifier or vocabulary,
- sustained-forcing-window interpretation boundary,
- Stage 2 Mtaji confirmation,
- Stage 5 `not-confirmed`.

## First operation only

Before any scientific relation values are inspected, run a read-only inventory of the final Study 1 formal archives.

Tool:

```text
tools/experiments/inventory-position-typology-stage6-study1-archives.py
```

Runbook:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_RUNBOOK.md
```

The fixed archives are E-018, E-019 and E-020 as recorded in `doc/phase-transition/FORMAL_EXPORT_INDEX.md`.

The inventory verifies archive SHA-256 values and member paths without extraction or result-value inspection.

## Feasibility fact established from repository code

Study 1 observation rows do not contain the full pit array, but formal game JSON stores the complete move sequence. Exact board states can therefore be reconstructed deterministically from the initial state and archived moves without generating new games.

No board replay / relation analysis is executed at this checkpoint.

## Stop point

> Run the Stage 6 read-only archive inventory locally and return only `study1-archive-inventory.json`.
