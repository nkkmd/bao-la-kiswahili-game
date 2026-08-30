# 2026-08-30 — Stage 1 tooling smoke technical-invalid closure

Study: `TMGC-STUDY1`  
Stage: `TMGC-S1-DEVELOPMENT-2026-08-30-v1`

## Formal disposition

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
Study = TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## Triggering technical evidence

Stage 1 scientific authorizationを発行する前に、technical-only smokeをrun `33287035754`で実行した。

```text
source commit = 65b2e3dee0994e1520ad9a3470feff4f3c9d98ae
artifact id = 9724782927
artifact ZIP SHA-256 = 54c536eceb460d8734ba19e6e79bfc2e9e7c82838056338a4527e7d365e1d51c
syntax check = PASS
canonical smoke result JSON = NOT PRODUCED
```

runnerはsource generationとtechnical measurementを進めた後、independent boundary aggregationで停止した。

```text
file = tools/experiments/lib/tmgc-stage1-boundary-independent.js
line = 83
error = ReferenceError: topSetRate is not defined
```

local variable `topRate`を計算した一方、return objectで未定義の`topSetRate` identifierを参照した実装上の欠陥だった。

## Why this is technical-invalid, not scientific negative

- Stage 1 authorization fileは存在しなかった。
- reserved Stage 1 scientific seeds `29110001..29114096`は使用していない。
- reserved Stage 2 seeds `29210001..29218192`も使用していない。
- canonical smoke result JSONは生成されていない。
- generalization/counterexample rate、cell classification、formal testはscientific evidenceとして成立していない。

したがって`NOT-GENERALIZED`、`COUNTEREXAMPLE-BOUNDARY-VALIDATED`、`NON-ESTIMABLE`等の科学的labelへ読み替えない。

## Frozen no-rescue consequence

`STAGE_1_TOOLING_SMOKE_SPEC.json`では、smoke outcomeを見た後のcontract変更を禁止し、tooling failureを`STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`へ写像することを事前固定していた。

このため、同一Study内で変数名を修正してsmokeをrerunし、Stage 1 authorizationへ進む救済は行わない。

将来修正版を検証する場合は、新しいprospective Study/versionとしてtechnical-entry contractを新規固定し、fresh authorizationを用いる。
