# TMGC-STUDY1 — RESUME HERE

更新日: 2026-08-30

## 現在地

G2-09 / `TMGC-STUDY1`は完了しています。

```text
baseline main = bc1263b7076f0a3794da5fd0d4e07821b23e1db6
branch = research/g2-09-tactical-motif-generalization-counterexample
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = TECHNICAL-INVALID
Stage 1 seeds = RESERVED / UNCONSUMED
Stage 2 seeds = RESERVED / UNCONSUMED
```

## 最初に読む

1. `STUDY_1_OVERVIEW.md`
2. `STUDY_1_FINAL_REPORT.md`
3. `CURRENT_STATUS.md`
4. `DECISION_REGISTER.md`
5. `REPRODUCIBILITY_INDEX.md`
6. `results/STUDY_1_FINAL_RESULT.json`

## Terminal event

Stage 1 scientific authorization前のtechnical-only smoke run `33287035754`がindependent boundary aggregationの`ReferenceError`で失敗した。frozen smoke contractによりsame-study repairは認められていないため、Studyを`TECHNICAL-INVALID`で閉じた。

## 再開してはいけない作業

- このStudy 1で`topSetRate` bugを修正してsmokeを再実行する
- Stage 1 authorizationを後付けする
- reserved Stage 1 seedsをこのStudy 1で消費する
- Stage 2をauthorizeする
- partial smoke computationをgeneralization/counterexample evidenceとして解釈する

## 将来の正しい進め方

修正版を検証する場合は、新しいprospective Studyまたは明示的新versionとして開始し、今回の`TECHNICAL-INVALID`をimmutable upstreamとして保持する。新しいtechnical-entry contract、source hash freeze、authorization、fresh scientific seed contractを結果前に固定する。
