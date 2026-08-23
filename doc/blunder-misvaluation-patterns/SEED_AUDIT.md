# SEED_AUDIT — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-23  
Status: **FRESH NAMESPACE AUDITED AND CONSUMED — STUDY 1 CLOSED**

## 1. Audit principle

Distinguish:

1. declared reproducible research-corpus/opening seeds;
2. derived/internal RNG values;
3. symbolic/non-numeric seeds.

The new contiguous scientific namespace must not overlap any tracked category-1 block or explicit conflicting numeric declaration.

## 2. Restored recent research blocks

Relevant recent canonical blocks include:

```text
Position Complexity Stage 1       20400001..20400768
Position Complexity Stage 2       20410001..20411024
Tactical Motifs Stage 1           21900001..21900768
Tactical Motifs Stage 2           22000001..22003072
TM Human Validation machine       22100001..22101536
Calibration Stage 1               22200001..22201024
Calibration Stage 2               22300001..22302048
```

Older Phase Transition, Position Typology, Namua→Mtaji, first-player and joseki seed families remain historical/consumed and are not reallocated.

## 3. Repository search at baseline

At baseline:

```text
b1cc7047504b73c5a848e866f795c26a64250d13
```

repository search for the proposed `224000...` / `225000...` namespace found no tracked declaration conflict.

This is a pre-generation audit finding, not a guarantee against a later-discovered hidden/untracked historical artifact. No conflicting tracked declaration was discovered before either authorized generation.

## 4. Reserved and consumed blocks

The prospective reservation was:

```text
Stage 1 exploratory capacity:
  22400001..22402048
  capacity = 2048 seeds

Stage 2 formal capacity:
  22500001..22504096
  capacity = 4096 seeds
```

Final usage:

```text
Stage 1 authorized/consumed = 22400001..22402048 = 2048 / 2048
Stage 2 authorized/consumed = 22500001..22504096 = 4096 / 4096
seed extension = false
replacement sampling = false
candidate-specific reseeding = false
```

Both reserved blocks are now historical/consumed and must not be reallocated as fresh evidence for another study.

## 5. Reservation, authorization and closure

The original reservation did not itself authorize scientific generation. Each stage subsequently received a separate source-hash-bound authorization before its corpus was generated.

Final state:

```text
namespace audit = PASS
Stage 1 generation = AUTHORIZED THEN COMPLETE
Stage 2 generation = AUTHORIZED THEN COMPLETE
Stage 1 / Stage 2 seed blocks = CONSUMED
Study 1 = CLOSED
```

The Stage 2 authorization was bound to exactly `22500001..22504096`; all 4096 games were generated and independently verified. No additional seed was added after formal outcomes were known.

## 6. No-rescue seed rule

The following were forbidden and were not performed:

- extending into another or unused namespace because support or significance was unfavorable;
- replacing excluded trajectories with later seeds;
- reseeding failed candidates;
- creating favorable candidate-specific seed subsets;
- moving Stage 2 into Stage 1 reserved capacity or vice versa.

Any future redesign or replication requires a newly audited fresh block and a new prospective authorization. The completed Stage 2 formal decision cannot be changed by extending these consumed namespaces.