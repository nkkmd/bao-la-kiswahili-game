# Seed Audit — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Status: **CLOSED FOR DECLARED RESEARCH-CORPUS SEED NAMESPACE / NEW BLOCKS FROZEN / GENERATION STILL NOT AUTHORIZED**

## Audit rule

The calibration study uses globally fresh numeric seeds for its declared scientific corpus/opening generator. The audit distinguishes:

1. declared research-corpus/opening seeds that identify reproducible sampled trajectories;
2. derived/internal RNG values (for example hash-derived continuation/MCTS seeds) that are not allocated as a contiguous scientific seed namespace;
3. symbolic seeds such as `mcts-s1` that are recorded but cannot numerically overlap the new integer blocks.

The non-overlap firewall applies strictly to category 1 and to any explicit numeric category-2 singleton found in tracked generator configuration. Derived hash values are provenance-bearing internal RNG state, not reusable corpus identifiers.

## Restored declared historical research seed usage

### Phase Transition Study 1

```text
pilot-v2                  20260721..20260820
E-010                      20261001..20261200
E-011                      20262001..20262400
E-017                      20263001..20264000
E-018                      20265001..20267000
E-019 D1                   20268001..20274500
E-019 D3                   20268001..20272500
E-019 V2                   20268001..20270000
E-020                      20275001..20279500
```

E-019 ranges are deliberately nested.

### Position Typology / Playing Style Study 1

```text
Stage 1 discovery base namespace starts at 20270001
Stage 2 Mtaji confirmation       20310001..20310192
Stage 5 style confirmation       20350001..20350192
```

### Namua→Mtaji Strategic Temporal Transition Study 1

```text
Stage 1 primary pilot       20271001..20271032
Stage 1 extension #1        20272001..20272384
Stage 1 final extension     20273001..20273768
Stage 2 formal              20280001..20284096
```

### Position Complexity / Difficulty Study 1

```text
Stage 1 exploratory         20400001..20400768
Stage 2 formal              20410001..20411024
```

### Tactical Motifs / Tesuji Study 1

```text
Stage 1 exploratory         21900001..21900768
Stage 2 formal              22000001..22003072
```

### Tactical Motif Human / Expert Validation Study 1

```text
Stage 1 machine stimulus    22100001..22101536
```

## Older first-player / benchmark / joseki namespace audit

The older first-player orchestration uses several forms rather than one contiguous block.

`run-first-player-research.js` contains:

```text
game-start 2-ply batches   20262001..20262004
game-start 4-ply batches   20264001..20264004
game-start 6-ply batches   20266001..20266004
game-start 8-ply batches   20268001..20268004
game-start 12-ply batches  20261201..20261204
```

Random-opening benchmark batches use the exact generator formula:

```text
seed = 20270000 + phaseOffset + openingPlies*1000 + batch*50
phaseOffset = 0 for Namua, 500000 for Mtaji
openingPlies in {4,8,12}
batch in {1,2,3,4}
```

Thus the largest numeric seed produced by this declared batch formula is below 20800000.

The first-player suite uses the exact formula:

```text
seed = 20260714 + batch*1009 + jobIndex*7919
conditionIndex = 0..10
batch = 1..4
jobIndex = conditionIndex*4 + (batch-1)
```

Its declared values range from `20261723` through `20605267` as a sparse set, not a continuous interval.

Paired-opening corpus generation uses a base such as `20260716` and derives candidate opening seeds as `base*100000 + attempt`. Those generated values are far outside the 22-million namespace and are retained as a separate historical generator family. Continuation RNG may also be hash-derived by `seedFrom`; those values are internal derived RNG identifiers rather than the declared opening-corpus seed namespace.

Joseki MCTS records also contain symbolic seeds such as `mcts-s1`, `mcts-s2`, `mcts-s3`; these cannot numerically overlap the integer blocks below.

## New-study namespace checks

Repository-index searches against current baseline `8672ba4fafb896124df0c4728d41f7c3a6ed5056` returned no existing tracked references for:

```text
222000
22200001
223000
```

The new blocks are also above all contiguous completed-study blocks restored above, including TMHV ending at `22101536`.

## Frozen allocation

```text
Stage 1 exploratory:
  games = 1024
  seeds = 22200001..22201024

Stage 2 reserved formal namespace:
  games reserved = 2048
  seeds = 22300001..22302048
```

Stage 2 reservation prevents later accidental reuse but does **not** authorize formal generation.

## Closure decision

For the declared reproducible scientific corpus/opening seed namespace:

```text
historical audit closed = true
Stage 1 numeric overlap found = false
Stage 2 numeric overlap found = false
new seed allocation frozen = true
scientific generation authorized = false
```

Any later discovery of a genuinely prior tracked scientific corpus using either frozen block is a pre-generation technical conflict requiring a versioned amendment. It may not be ignored after generation starts.
