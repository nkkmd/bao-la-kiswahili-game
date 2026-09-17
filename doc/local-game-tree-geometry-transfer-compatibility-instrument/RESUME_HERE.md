# LGTTCI-STUDY1 — 再開位置

更新日: 2026-09-17  
状態: **`STAGE 1R GITHUB ACTIONS PRE-EXECUTION READY / FINAL EXECUTION AUTHORIZATION ABSENT`**

## 現在地

```text
Study = LGTTCI-STUDY1
Program position = Research Generation 4 / G4-01
Research branch = research/g4-01-transfer-compatibility-instrument
Baseline main = 6433c726d038f710b9b5af3620f1a7d30db7bdc9
Stage 0 = STAGE0-PASS
Stage 1 = EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION
Stage 1R = STAGE1R-GITHUB-ACTIONS-PRE-EXECUTION-READY / NOT-AUTHORIZED-NOT-EXECUTED
execution route = GITHUB-ACTIONS-IMMUTABLE-ARTIFACT-PIPELINE
fresh 402... primary seed access = 0
paired 412... reserve seed access = 0
formal effect generation = 0
main integration = NOT AUTHORIZED
```

## 再開時の読む順序

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
2. [`checkpoints/2026-09-17-stage1-execution-interrupted.md`](checkpoints/2026-09-17-stage1-execution-interrupted.md)
3. [`prereg/STAGE_1R_RETEST_SPEC.json`](prereg/STAGE_1R_RETEST_SPEC.json)
4. [`prereg/STAGE_1R_GITHUB_ACTIONS_EXECUTION_AMENDMENT_V1.json`](prereg/STAGE_1R_GITHUB_ACTIONS_EXECUTION_AMENDMENT_V1.json)
5. [`authorizations/STAGE_1R_GITHUB_ACTIONS_PRE_EXECUTION_BINDING.json`](authorizations/STAGE_1R_GITHUB_ACTIONS_PRE_EXECUTION_BINDING.json)
6. [`checkpoints/2026-09-17-stage1r-github-actions-pre-execution-ready.md`](checkpoints/2026-09-17-stage1r-github-actions-pre-execution-ready.md)

以前の[`authorizations/STAGE_1R_PRE_EXECUTION_BINDING.json`](authorizations/STAGE_1R_PRE_EXECUTION_BINDING.json)はローカルexecution routeの歴史的記録であり、fresh Stage 1R executionには使用しない。

## 次に行うこと

ユーザーが「再試験を開始してください」等、Stage 1R開始を明示した場合のみ次へ進む。

1. `STAGE_1R_GITHUB_ACTIONS_PRE_EXECUTION_BINDING.json`のblob SHA `50953f47a35cb4172e2ea7838c84a8e44af35fe1`とbinding対象filesを再確認する。
2. final authorization不存在とfresh `402...` / `412...` seed access 0を再確認する。
3. `STAGE_1R_EXECUTION_AUTHORIZATION.json`を**一度だけ新規作成**する。
4. このauthorization作成commitを唯一のfresh GitHub Actions execution triggerとする。
5. GitHub Actions側でprimary acquisition → artifact classification → 必要な場合だけsafe primary retry / paired reserve → complete source bundle → 22 seed-free measurement task → aggregateを実行する。
6. ChatGPTの応答はauthorization commit後に終了してよい。executionはGitHub Actions側で独立して継続する。
7. 後続応答ではGitHub Actions runとfinal artifactを取得し、exact resultを監査する。
8. 結果監査後にcanonical result/checkpointをresearch branchへ保存する。`main`統合は別途明示指示を待つ。

## GitHub Actions executionの固定事項

- primary matrix: SFCDF `96` job、SILGM `192` job、GCLD `96` job
- 各primary job: 4 slot。ただし各slotごとにSTART/source/failure artifactを独立永続化
- START artifactなし: seed未読としてprimary retryを1回だけ許可
- primary STARTあり・source/failureなし: paired reserve候補
- controlled source failure: reserve禁止
- reserve-of-reserve: 禁止
- paired reserve上限: `48`
- fresh read上限: `1584`
- source complete coverage: `1536`
- seed-free measurement tasks: `22`
- measurement: source bundleだけを入力とし、インフラretryを最大3回まで許可
- final aggregation: fresh seed accessなし
- artifact retention: 90日
- full fresh workflow rerun: 禁止
- workflow_dispatchによるfresh execution: 禁止

## 特に守ること

- final authorization前に`402...`または`412...` seedへアクセスしない。
- 旧`401...` seedを再利用しない。
- GitHub Actions binding対象のexecution-critical fileをauthorization後に変更しない。
- scientific result、support不足、root不足、preflight不適格を理由にreserveを使わない。
- formal effect、p-value、generalization/counterexample decisionを生成しない。
- G3-11 depth 10、G3-12 protected evidence、G4-10 depth 11へアクセスしない。
- `main`へ進行中Studyを統合しない。

現在は、ユーザーの試験開始指示を待つ**GitHub Actions実行直前checkpoint**である。
