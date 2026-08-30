# RESUME HERE

## 現在地

G2-09 `TMGC-STUDY1`はStage 0 technical closureまで完了。

- baseline: `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`
- branch: `research/g2-09-tactical-motif-generalization-counterexample`
- Stage 0: `STAGE0-TECHNICAL-PASS`
- Stage 1: `NOT-AUTHORIZED-PENDING-TOOLING-SMOKE-AND-SOURCE-FREEZE`
- Stage 2: `NOT-AUTHORIZED`

## Reserved scientific seeds

- Stage 1 `29110001..29114096`: `UNCONSUMED`
- Stage 2 `29210001..29218192`: `UNCONSUMED`

## Stage 0 evidence

- core: run `33285277593` — `CORE-SEMANTICS-AND-PROVENANCE-PASS`
- contract validator: run `33285599766` — pass
- source preflight accepted run: `33285761079` — `SOURCE-PREFLIGHT-PASS`
- source preflight invalid attempt: run `33285427882` — `TECHNICAL-EXECUTION-INVALID-NO-PREFLIGHT-RESULT`

## 次に行うこと

1. `preregistration/STAGE_1_2_BOUNDARY_CONTRACT.json`に従うStage 1 production source/measurement/evaluation toolingをmaterializeする。
2. G2-09-specific classifier helperを共有しないindependent verification toolingをmaterializeする。
3. technical-only smoke seedsでsource generation、root selection、legal moves、C03 exact classification、search instrumentation、boundary assignment、aggregationのexact verificationを行う。
4. tooling source hashesとcontract hashをfreezeする。
5. Stage 1 scientific seed blockが未消費であることを再確認する。
6. 以上がpassした場合のみStage 1 authorizationを発行する。
7. authorization/spec/source/artifact readinessを再検証した後にStage 1 scientific generationを開始する。

Stage 1 authorization前に`29110001..29114096`を使用しない。Stage 2 seedはStage 1 formal gate closureまで使用しない。
