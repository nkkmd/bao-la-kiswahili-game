# LGTTCI-STUDY1 — 再開位置

更新日: 2026-09-17  
状態: **`STAGE 1R PRE-EXECUTION READY / FINAL EXECUTION AUTHORIZATION ABSENT`**

## 現在地

```text
Study = LGTTCI-STUDY1
Program position = Research Generation 4 / G4-01
Research branch = research/g4-01-transfer-compatibility-instrument
Baseline main = 6433c726d038f710b9b5af3620f1a7d30db7bdc9
Stage 0 = STAGE0-PASS
Stage 1 = EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION
Stage 1R = STAGE1R-PRE-EXECUTION-READY / NOT-AUTHORIZED-NOT-EXECUTED
fresh 402... primary seed access = 0
paired 412... reserve seed access = 0
formal effect generation = 0
main integration = NOT AUTHORIZED
```

## 再開時の読む順序

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
2. [`checkpoints/2026-09-17-stage1-execution-interrupted.md`](checkpoints/2026-09-17-stage1-execution-interrupted.md)
3. [`prereg/STAGE_1R_RETEST_SPEC.json`](prereg/STAGE_1R_RETEST_SPEC.json)
4. [`authorizations/STAGE_1R_PRE_EXECUTION_BINDING.json`](authorizations/STAGE_1R_PRE_EXECUTION_BINDING.json)
5. [`checkpoints/2026-09-17-stage1r-pre-execution-ready.md`](checkpoints/2026-09-17-stage1r-pre-execution-ready.md)

## 次に行うこと

ユーザーが「再試験を開始してください」等、Stage 1R開始を明示した場合のみ次へ進む。

1. research branch上のexecution-bound file blob SHAが`STAGE_1R_PRE_EXECUTION_BINDING.json`と一致することを再確認する。
2. final authorization不存在とfresh `402...` / `412...` seed access 0を再確認する。
3. `STAGE_1R_EXECUTION_AUTHORIZATION.json`を新規作成する。
4. 永続artifact rootを使用し、SFCDF / SILGM / GCLDのsource acquisitionを開始する。
5. source acquisition中はslotごとのdurable journalとsealed artifactを保持する。
6. source acquisition完了後、22個のseed-free measurement taskを実行する。
7. measurementはfresh seedを再読しないため、インフラ中断時にcompleted source artifactから再開できる。
8. 22 task完了後にaggregate runnerでcompatibility decisionだけを生成する。

## 特に守ること

- final authorization前に`402...`または`412...` seedへアクセスしない。
- 旧`401...` seedを再利用しない。
- primary slotの再読をしない。
- 明示的source process errorをreserveで救済しない。
- reserveを科学的結果・support不足・root不足の救済へ使用しない。
- reserve-of-reserveを行わない。
- measurement taskはsealed source artifactだけから実行する。
- formal effect、p-value、generalization/counterexample decisionを生成しない。
- G3-11 depth 10、G3-12 protected evidence、G4-10 depth 11へアクセスしない。
- `main`へ進行中Studyを統合しない。

現在は、ユーザーの試験開始指示を待つ**直前checkpoint**である。
