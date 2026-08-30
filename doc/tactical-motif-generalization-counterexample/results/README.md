# 結果記録

## Study-levelの終端結果

```text
Study = TECHNICAL-INVALID
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Canonical result:

- `STUDY_1_FINAL_RESULT.json`

## Stage 0の状態

- `STAGE_0_CORE_TECHNICAL_RESULT.json` — technical core semantics / provenanceの記録
- `STAGE_0_TECHNICAL_CLOSURE_RESULT.json` — `STAGE0-TECHNICAL-PASS`

採用したStage 0 source preflightはrun `33285761079`で、`SOURCE-PREFLIGHT-PASS`。

## Stage 1の状態

- `STAGE_1_TECHNICAL_INVALID_RESULT.json` — Stage 1のcanonical terminal record

Stage 1 scientific authorization前のtooling smoke run `33287035754`でindependent boundary aggregatorが`ReferenceError`を発生させ、canonical smoke result JSONを生成できなかった。事前failure mappingに従いsame-study repairを行わず、Stage 1をtechnical-invalidで閉じた。

Stage 1 scientific populationは生成していないため、generalization/counterexample cell resultは存在しない。

## Stage 2の状態

`NOT-AUTHORIZED-NOT-EXECUTED`。Stage 2 formal resultは存在しない。

## seedの状態

```text
Stage 1 29110001..29114096 = RESERVED / UNCONSUMED
Stage 2 29210001..29218192 = RESERVED / UNCONSUMED
```
