# MDFT-STUDY1 — 現在の状態

更新日: 2026-08-30

## 研究識別

```text
Program = G2-08
Study ID = MDFT-STUDY1
Formal title = Machine Decision-Failure Taxonomy Study 1
Baseline remote main = cb660e166460e0f19d4ba16d5283fa880d55757f
Branch = research/g2-08-machine-decision-failure-taxonomy
Stage 0 = MDFT-S0-TECHNICAL-2026-08-29-v1
Stage 1 = MDFT-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = MDFT-S2-FORMAL-2026-08-29-v1
```

## 現在の正式状態

```text
Study = CLOSED
Study formal decision = NON-ESTIMABLE
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 1 run = 33277102013 / COMPLETED SUCCESS
Stage 1 seeds 28910001..28914096 = CONSUMED
same-block rerun / repair / replacement / extension = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## Stage 0 closure

Canonical Stage 0 disposition:

```text
STAGE0-TECHNICAL-PASS
```

Technical eligibility fixed before Stage 1 evidence:

```text
MDFT-F05 = TECHNICALLY-ELIGIBLE
MDFT-F09 = TECHNICALLY-INELIGIBLE
MDFT-F10 = TECHNICALLY-ELIGIBLE
```

F09 was excluded because the historically frozen morphology classifier could not be reconstructed exactly from currently preserved repository sources without refit or invention. This does not modify the historical Position Typology result.

## Stage 1 integrity

```text
specSha256 = 85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203
canonical technical preflight run = 33258188633 / PASS
scientific runner readiness run = 33277031634 / PASS
scientific run = 33277102013 / COMPLETED SUCCESS
execution HEAD = dfb9bf316dc767ae5920aba5a3308aa5f05d3acf
actions artifact = 9722157483
```

Production and structurally independent implementations matched exactly for source generation, root selection, selected-root identity, analysis rows and development core.

```text
production core SHA-256 = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
independent core SHA-256 = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
full production shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
full independent shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

Mandatory artifact preservation and frozen resource ceilings passed. Stage 1 is therefore not technical-invalid and not resource-censored.

## Stage 1 scientific readiness

Fresh Stage 1 population:

```text
games = 4096
unique trajectories = 4068
distinct opening prefixes = 2836
selected roots = 512
Namua = 256
Mtaji = 256
source-policy counts = 128 / 122 / 92 / 170
reference consensus roots = 473
reference disagreement events = 110
```

Two frozen global readiness checks failed:

```text
opening-prefix diversity: 2836 < 3000
maximum source-policy share: LOW_CAPTURE 170/512 = 0.33203125 > 0.32
```

Therefore:

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study = NON-ESTIMABLE
```

## Leaf-level development observations

The frozen promotion calculation returned `true` for:

```text
MDFT-F01
MDFT-F02
MDFT-F03
MDFT-F05
MDFT-F06
MDFT-F10
```

and `false` for `MDFT-F04`, `MDFT-F07`, `MDFT-F08`. `MDFT-F09` was already technically ineligible.

These values are development observations only. Because the global readiness gate failed, the six `true` calculations are **not** a frozen taxonomy and are **not** authorized Stage 2 targets.

## Stage 2

Preregistered consequence of Stage 1 blocked/non-estimable:

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
seeds 29010001..29018192 = RESERVED / UNCONSUMED
```

No Stage 2 source/spec/target relaxation or scientific execution is authorized in this Study 1.

## Immutable upstream boundaries

Research Generation 2 `G2-01..G2-07` and Research Generation 1 canonical decisions remain unchanged. In particular:

```text
STSCV validated transform set = []
RCPR Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR Stage 1 seeds = CONSUMED
PCRPR Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
BMP-STUDY1 = 0 CONFIRMED / 4 NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
```

PCRPR production-only `F05_ALL` / `lambda=100` / OOF metrics are not validated inputs to G2-08.

## RAW identity

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
```

## Closure artifacts

1. `STUDY_1_FINAL_REPORT.md`
2. `results/STAGE_1_DEVELOPMENT_RESULT.json`
3. `results/STAGE_1_FINAL_EXACT_COMPARISON.json`
4. `results/STAGE_1_ARTIFACT_MANIFEST.json`
5. `checkpoints/2026-08-30-stage1-development-blocked-non-estimable.md`

A future decision-failure taxonomy study must be a new prospective study/version with fresh population and seed contracts. This Study 1 is not reopened or rescued.
