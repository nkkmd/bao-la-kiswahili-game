# Results

## Study-level terminal result

```text
Study = TECHNICAL-INVALID
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Canonical result:

- `STUDY_1_FINAL_RESULT.json`

## Stage 0

- `STAGE_0_CORE_TECHNICAL_RESULT.json` — technical core semantics/provenance
- `STAGE_0_TECHNICAL_CLOSURE_RESULT.json` — `STAGE0-TECHNICAL-PASS`

Accepted Stage 0 source preflight: run `33285761079`, `SOURCE-PREFLIGHT-PASS`。

## Stage 1

- `STAGE_1_TECHNICAL_INVALID_RESULT.json` — canonical Stage 1 terminal record

Stage 1 scientific authorization前のtooling smoke run `33287035754`でindependent boundary aggregatorが`ReferenceError`を発生させ、canonical smoke result JSONを生成できなかった。事前failure mappingに従いsame-study repairを行わず、Stage 1をtechnical-invalidで閉じた。

Stage 1 scientific populationは生成していないため、generalization/counterexample cell resultは存在しない。

## Stage 2

`NOT-AUTHORIZED-NOT-EXECUTED`。Stage 2 formal resultは存在しない。

## Seed state

```text
Stage 1 29110001..29114096 = RESERVED / UNCONSUMED
Stage 2 29210001..29218192 = RESERVED / UNCONSUMED
```
