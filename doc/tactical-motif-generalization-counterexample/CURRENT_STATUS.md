# CURRENT STATUS

更新日: 2026-08-30

## Study

- G2: `G2-09`
- Study ID: `TMGC-STUDY1`
- branch: `research/g2-09-tactical-motif-generalization-counterexample`
- baseline `main`: `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`

## 現在のauthorization

- Stage 0 `TMGC-S0-TECHNICAL-2026-08-30-v1`: `AUTHORIZED-TECHNICAL-ONLY`
- Stage 1 `TMGC-S1-DEVELOPMENT-2026-08-30-v1`: `NOT-AUTHORIZED`
- Stage 2 `TMGC-S2-FORMAL-2026-08-30-v1`: `NOT-AUTHORIZED`

## Scientific seed state

- Stage 1 reserved `29110001..29114096`: `UNCONSUMED`
- Stage 2 reserved `29210001..29218192`: `UNCONSUMED`

**G2-09 scientific evidence has not been generated.**

## Stage 0 progress

### Core semantics / provenance

`CORE-SEMANTICS-AND-PROVENANCE-PASS`

GitHub Actions run `33285277593`で次を確認した。

- Research Generation 1のcandidate/spec/authorizationと17 source-file SHA binding: exact pass
- RAW identity、legal moves、canonical C03 move、successor: production/independent exact pass
- primary structural consequence、paired diagnostic: exact pass
- D1/D2/D3 reference instrumentation: technical fixture上でexact pass
- direct Namua transport: `TECHNICALLY-INELIGIBLE`

Stage 0のformal terminal dispositionはまだ`PENDING`。

### Source / diversity / resource preflight

`STAGE_0_SOURCE_PREFLIGHT_SPEC.json`を結果前にfreeze済み。technical seeds `8090001..8090128`を使用するsource-only preflightを実行中/判定待ちであり、motif consequenceまたはtactical-value outcomeは計算しない。

## Upstream formal boundary

- `TM-S2-C03 = CONFIRMED` — immutable
- `TM-S2-C01/C02/C04 = NOT-CONFIRMED` — immutable
- human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)` — immutable
- RAW identity only; validated transform set empty
- G2-08 leaf-level development observations are not validated G2-09 inputs

## Prospective Stage 1/2 contract

`STAGE_1_2_BOUNDARY_CONTRACT.json`をscientific seed消費前にfreeze済み。ただしStage 1 authorizationはStage 0 terminal passまで発行しない。
