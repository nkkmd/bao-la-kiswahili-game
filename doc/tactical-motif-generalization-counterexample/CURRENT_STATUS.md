# CURRENT STATUS

更新日: 2026-08-30

## Study

- G2: `G2-09`
- Study ID: `TMGC-STUDY1`
- branch: `research/g2-09-tactical-motif-generalization-counterexample`
- baseline `main`: `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`

## Formal stage state

- Stage 0 `TMGC-S0-TECHNICAL-2026-08-30-v1`: **`STAGE0-TECHNICAL-PASS`**
- Stage 1 `TMGC-S1-DEVELOPMENT-2026-08-30-v1`: `NOT-AUTHORIZED` — tooling smoke/source freeze待ち
- Stage 2 `TMGC-S2-FORMAL-2026-08-30-v1`: `NOT-AUTHORIZED`

## Scientific seed state

- Stage 1 reserved `29110001..29114096`: `UNCONSUMED`
- Stage 2 reserved `29210001..29218192`: `UNCONSUMED`

**G2-09 scientific evidence has not yet been generated.**

## Stage 0 closure evidence

### Core semantics / provenance

GitHub Actions run `33285277593`: `CORE-SEMANTICS-AND-PROVENANCE-PASS`。

- Research Generation 1 candidate/spec/authorizationと17 source-file SHA binding: exact pass
- RAW identity、legal moves、canonical C03 move、successor: production/independent exact pass
- primary structural consequence、paired diagnostic: exact pass
- D1/D2/D3 instrumentation: technical fixture上でexact pass
- direct Namua transport: `TECHNICALLY-INELIGIBLE-FOR-C03-EXACT`

### Contract validation

GitHub Actions run `33285599766`: `passed=true`。

seed range、8 strata、phase boundary、RAW identity、Stage1→2 firewall、prospective axes、multiplicity、no-rescue、decision vocabularyの内部整合性を確認した。

### Source / diversity / resource preflight

GitHub Actions run `33285761079`: **`SOURCE-PREFLIGHT-PASS`**。

- technical seeds: `8090001..8090128`
- 128 games / 8 strata × 16
- unique RAW trajectories: 126
- opening prefixes: 121
- selected unique C03-exact roots: 66
- selected-root opening prefixes: 64
- 8/8 source strata、4/4 source familiesを確認
- deterministic reruns 8/8 exact、全trajectory replay exact
- projected 256-game source shard: 384.62 s
- projected compact gzip: 647,088 bytes
- max RSS: 140,164 KB
- frozen checks: all pass

初回run `33285427882`はtechnical implementation defectで`TECHNICAL-EXECUTION-INVALID-NO-PREFLIGHT-RESULT`として保存し、gate/population/technical seedを変更せずexact rerunした。

## Upstream formal boundary

- `TM-S2-C03 = CONFIRMED` — immutable
- `TM-S2-C01/C02/C04 = NOT-CONFIRMED` — immutable
- human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)` — immutable
- RAW identity only; validated transform set empty
- G2-08 leaf-level development observations are not validated G2-09 inputs

## Prospective Stage 1/2 contract

`preregistration/STAGE_1_2_BOUNDARY_CONTRACT.json`はscientific seed消費前にfreeze済み。

次の安全な作業はStage 1 production/independent toolingのtechnical-only smoke、source hash freeze、Stage 1 authorizationである。Stage 1 authorization materialization前にreserved scientific seedを使用しない。
