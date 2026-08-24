# SEED_AUDIT — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-24  
Status: **STUDY 1 CLOSED / STAGE 1 CONSUMED / STAGE 2 RESERVED AND UNCONSUMED**

## 1. Audit principle

Distinguish:

1. declared scientific source-game/opening seed blocks;
2. derived/internal RNG values used inside a game or continuation replicate;
3. technical fixture-only RNG values;
4. incidental numeric values in artifacts.

Fresh scientific source-game blocks must not overlap category 1.

## 2. Restored recent scientific blocks

Canonical recent tracked blocks include:

```text
Position Complexity Stage 1       20400001..20400768
Position Complexity Stage 2       20410001..20411024
Tactical Motifs Stage 1           21900001..21900768
Tactical Motifs Stage 2           22000001..22003072
TM Human Validation machine       22100001..22101536
Calibration Stage 1               22200001..22201024
Calibration Stage 2               22300001..22302048
BMP Stage 1                       22400001..22402048
BMP Stage 2                       22500001..22504096
CPOB Stage 1                      22600001..22603072
```

Older Phase Transition, Position Typology, Namua→Mtaji, first-player and joseki blocks remain historical/consumed and are not reallocated.

## 3. CPOB Stage 1

```text
block = 22600001..22603072
capacity = 3072 source games
status = CONSUMED EXACTLY ONCE
```

Frozen source generation used all 3072 seeds. No extension, replacement generation or candidate-specific reseeding occurred.

```text
games generated = 3072
seedStart = 22600001
seedEnd = 22603072
```

The block must not be reused.

## 4. CPOB Stage 2 reservation

```text
reserved = 22700001..22706144
capacity = 6144 source games
authorization issued = false
games generated = 0
seeds consumed = false
```

The block was originally reserved prospectively as an attrition allowance for a possible Stage 2 formal confirmation.

Stage 1 deterministic discovery produced:

```text
promotedCandidateCount = 0
```

Therefore no exact Stage 1 candidate mapping existed for Stage 2 freeze, and Stage 2 generation was never authorized or executed.

This reservation remains an explicit historical declaration. It must not be silently reused by another study. A future independent study must perform a new seed-namespace audit and explicitly decide its own fresh block.

## 5. Continuation replicate RNG

Stage 1 continuation RNG was nested inside selected roots and deterministically derived from the frozen stage salt, root identity and replicate index.

Each legal root move received a separately initialized RNG using the same derived seed at replicate index `r`.

These values:

- do not count as independent source-game seeds;
- do not increase root-level N;
- do not alter the Stage 1 source-game namespace;
- remain reproducibly derivable from the frozen implementation.

## 6. No-rescue seed closure

The following were not performed:

```text
Stage 1 seed extension = false
replacement generation = false
candidate-specific reseeding = false
favorable seed subset selection = false
Stage 2 generation = false
```

Do not move a future study into `22700001..22706144` merely because the block is unconsumed. The existing reservation must first be addressed explicitly in a new prospective seed audit.
