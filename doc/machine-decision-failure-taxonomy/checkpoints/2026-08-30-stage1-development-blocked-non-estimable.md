# G2-08 / MDFT-STUDY1 — Stage 1 development canonical closure

Date: 2026-08-30
Stage: `MDFT-S1-DEVELOPMENT-2026-08-29-v1`

## Canonical disposition

```text
STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
```

This is a scientific readiness failure, not a technical-invalid result.

## Execution integrity

Authorized consume-once scientific run:

```text
GitHub Actions run = 33277102013
execution HEAD = dfb9bf316dc767ae5920aba5a3308aa5f05d3acf
Stage 1 seeds = 28910001..28914096
seed status = CONSUMED
same-block rerun = NOT AUTHORIZED
repair = NOT AUTHORIZED
replacement = NOT AUTHORIZED
extension = NOT AUTHORIZED
```

Mandatory artifact preservation completed successfully. Production and structurally independent implementations agree exactly on source generation, root selection, selected-root identity, all analysis rows and development core.

```text
production core SHA-256 = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
independent core SHA-256 = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
full production shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
full independent shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

Therefore this Stage 1 run is not `STAGE1-TECHNICAL-INVALID` and not `RESOURCE-CENSORED`.

## Scientific population/readiness

Observed fresh source population:

```text
games = 4096
unique trajectories = 4068
distinct opening prefixes = 2836
selected roots = 512
Namua = 256
Mtaji = 256
source policy counts:
  UNIFORM = 128
  CAPTURE_FIRST = 122
  HIGH_CAPTURE = 92
  LOW_CAPTURE = 170
reference-consensus roots = 473
reference-disagreement events = 110
  Namua = 65
  Mtaji = 45
```

All frozen readiness checks passed except two:

1. distinct opening prefixes: `2836 < 3000` — FAIL
2. maximum single source-policy share: `170 / 512 = 0.33203125 > 0.32` — FAIL

No threshold relaxation, seed extension, root replacement, favorable subgroup selection or alternate source-policy weighting is authorized after observing this result.

## Candidate leaf calculations

Within the executed development population, the frozen promotion formula returned `promoted=true` for:

```text
MDFT-F01
MDFT-F02
MDFT-F03
MDFT-F05
MDFT-F06
MDFT-F10
```

and `promoted=false` for:

```text
MDFT-F04
MDFT-F07
MDFT-F08
```

`MDFT-F09` had already been prospectively excluded as technically ineligible.

These leaf-level calculations are retained as development observations only. Because the global Stage 1 readiness gate failed, the six `promoted=true` calculations do **not** constitute a frozen validated/development taxonomy and must not be promoted into Stage 2 targets within this Study 1.

## Stage 2 consequence

The preregistered rule states that when Stage 1 is blocked/non-estimable, Stage 2 remains:

```text
NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 2 reserved seeds remain:

```text
29010001..29018192
RESERVED / UNCONSUMED
```

No automatic or implicit Stage 2 authorization is created by this checkpoint.

## Interpretation boundary

This result does not show that the six observed mechanistic patterns are false, nor does it validate them. It shows that the prospectively required development-population readiness contract was not met, so Study 1 cannot freeze a taxonomy for held-out formal validation.

Prior studies remain unchanged, including BMP Study 1 `0 CONFIRMED / 4 NOT-CONFIRMED`, G2-07 `STAGE1-TECHNICAL-INVALID`, and all existing formal boundaries.
