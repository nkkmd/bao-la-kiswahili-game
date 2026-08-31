# Local Game-Tree Geometry Measurement Instrument Verification

## Status

`LGTGMIV-STUDY1` is an active, new, prospective, independent Research Generation 3 prerequisite Study positioned after G3-01 and before any G3-02 authorization.

Formal title:

**Local Game-Tree Geometry Measurement Instrument Verification Study 1**

日本語題目:

**Baoにおける局所ゲーム木幾何測定instrumentのprospective再構築と独立検証 — deterministic scientific core、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立**

Research branch:

`research/pre-g3-02-local-game-tree-geometry-measurement-instrument-verification`

Study-start source baseline:

`a53aabd26f78ac408445aff2d18ace3b21b827d7`

## Why this Study exists

G3-01 (`LGTGMF-STUDY1`) reconstructed its fresh bounded local trees/graphs exactly at root/family level in production and independent implementations, but its frozen stage-manifest contract incorrectly allowed implementation-dependent runtime/resource observations into the canonical stage digest. The resulting stage digest mismatch made G3-01 permanently `TECHNICAL-INVALID` after evidence read.

This Study does not repair or rescue that result. It uses the failure mode only as design information and starts under a new identity, new prospective contract and new fresh evidence firewall.

## Immutable upstream boundary

G3-01 remains:

- `CLOSED / TECHNICAL-INVALID`
- formal eligible measurement families: `[]`
- Stage 2: `NOT-AUTHORIZED-NOT-EXECUTED`
- consumed Stage 1 seeds: `31010001..31010096`

Research Generation 2 remains closed. Scientific state identity remains RAW-only with fields `pits,reserve,houseOwned,player,phase,winner,pending`; validated transform set remains empty.

## Stage plan

1. `LGTGMIV-S0-TECHNICAL-2026-08-31-v1` — technical instrument validation; no scientific seeds.
2. `LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1` — fresh development, seeds `31110001..31110128`, 8 Namua + 8 Mtaji roots, depth 5; not yet authorized at Study start.
3. `LGTGMIV-S2-FORMAL-2026-08-31-v1` — fresh formal holdout, seeds `31120001..31120192`, 12 Namua + 12 Mtaji roots, depth 5; not authorized at Study start.

The standard initial RAW-root exact depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.

## Documents

- `STUDY_1_OVERVIEW.md` — purpose and claim boundary
- `STUDY_1_PROTOCOL.md` — frozen scientific/technical contract
- `CURRENT_STATUS.md` — current execution state
- `DECISION_REGISTER.md` — immutable decisions and later stage dispositions
- `REPRODUCIBILITY_INDEX.md` — specs, code, workflows, outputs and hashes
- `STUDY_1_FINAL_REPORT.md` — intentionally remains a no-result placeholder until closure
- `preregistration/` — machine-readable frozen contracts
- `checkpoints/` — prospective and execution checkpoints
- `authorizations/` — explicit stage progression authorizations
- `results/` — only generated stage results
