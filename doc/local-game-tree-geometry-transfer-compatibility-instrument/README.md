# LGTTCI-STUDY1 — 入口

更新日: 2026-09-17  
Program position: `Research Generation 4 / G4-01`  
状態: **`STAGE 1R GITHUB ACTIONS PRE-EXECUTION READY / FINAL EXECUTION AUTHORIZATION ABSENT`**

正式Study ID:

`LGTTCI-STUDY1`

英語正式題目:

**Local Game-Tree Geometry Transfer Compatibility Instrument Study 1 — Prospective validation of root contracts, helper preconditions, measurement agreement, and resource readiness for fresh-domain claim transfer**

日本語作業名:

**Bao局所ゲーム木幾何claim移送Compatibility Instrument研究1 — fresh domain移送に必要なroot contract、helper precondition、測定一致、resource readinessのprospective検証**

## このStudyが調べること

Research Generation 3でformal-completeとなったG3-04、G3-07、G3-10由来のclaim familyを将来のfresh domainへ移す前に、科学的effectを見ずに次を検証する。

- root contractを再現可能に判定できるか
- source policyをproduction/independentで同一にreplayできるか
- RAW局所幾何をrelative depth 5でexact一致して測定できるか
- SILGM系search helperのhard preconditionをroot selection前に検出できるか
- root legal width 1をhard failureではなくclean `NON-ESTIMABLE`として扱えるか
- continuous geometryを必要とするfamilyでproduction/independentの境界を維持できるか
- resource ceiling内で後続Studyのcompatibility populationを評価できるか

このStudyではformal effect direction、p-value、generalization/counterexample decisionを生成しない。

## Stage 0

Stage 0 `LGTTCI-S0-TECHNICAL-2026-09-17-v1`は`STAGE0-PASS`で完了した。G3-12で問題になったroot legal width 1のhelper precondition gapを、scientific populationへ進む前に検出・遮断できることをnegative control込みで確認した。

## 旧Stage 1の中断

旧Stage 1 `LGTTCI-S1-COMPATIBILITY-2026-09-17-v1`はfresh compatibility seedへのアクセス開始後、ローカル長時間processの実行環境が失われ、監査可能な最終artifactを残せなかった。

このため正式状態を`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`とし、旧`401...` seed namespaceを全体quarantineした。旧Stage 1を同じseedで再実行しない。

詳細は[`checkpoints/2026-09-17-stage1-execution-interrupted.md`](checkpoints/2026-09-17-stage1-execution-interrupted.md)を参照する。

## Stage 1R再試験

再試験は新しいStage IDで固定した。

`LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`

科学的contractのsource policy、root family、RAW identity、search condition、support gateは旧Stage 1から変更していない。変更したのはfresh evidence namespaceと、fresh access開始前に固定したexecution architectureだけである。

primary fresh namespace:

```text
SFCDF = 40211001..40211384
SILGM = 40212001..40212768
GCLD  = 40213001..40213384
```

各primaryには`primary + 1000000`のpaired reserveを事前対応させている。reserveは科学的結果やsupport不足を改善する救済には使用できない。

## GitHub Actions耐障害設計

Stage 1Rの正式execution routeは次である。

`GITHUB-ACTIONS-IMMUTABLE-ARTIFACT-PIPELINE`

前回のようにChatGPTの一時的ローカルruntimeへ長時間processを保持しない。

- fresh primary acquisitionをSFCDF 96 job、SILGM 192 job、GCLD 96 jobへ分割する。
- 各jobは4 slotを扱うが、各slotのfresh read直前にimmutable START artifactをGitHubへ保存する。
- source replay成功時は、そのslotのimmutable source artifactを次slotへ進む前に保存する。
- START artifactがないslotだけはseed未読と証明できるため、primary retryを1回だけ許可する。
- primary STARTあり・source/failureなしの場合だけ、インフラ中断としてpaired reserveへ移す。
- controlled source failureではreserveを使わない。
- reserve-of-reserveは禁止する。
- fresh read上限は1584、paired reserve使用上限は48である。
- 1536 source artifactの完全coverageを確認した場合だけcanonical source bundleを生成する。
- depth-5 preflight、search、continuous geometryは22個のseed-free measurement taskへ分離する。
- measurementはsource bundleだけを入力とするため、fresh seedを再読せずインフラretryできる。
- aggregationもfresh seedを読まない。
- GitHub Actions artifactは90日retentionで保持する。

final authorization作成commit後はGitHub Actions側でexecutionが独立して継続する。そのため、試験開始後にChatGPTの応答を終了しても、一時的なChatGPT runtime消失によって研究process全体が失われる設計ではない。

execution route変更のprospective記録は[`prereg/STAGE_1R_GITHUB_ACTIONS_EXECUTION_AMENDMENT_V1.json`](prereg/STAGE_1R_GITHUB_ACTIONS_EXECUTION_AMENDMENT_V1.json)に固定している。

## pre-execution readiness

最新technical-only preflight:

```text
workflow = LGTTCI Stage 1R pre-execution validation
run = 35223729501
job = 105209943719
validated HEAD = b2745214134766f34cad75c45ec2575e8d951bee
conclusion = success
```

GitHub Actions用のexact bindingは次である。

```text
path = authorizations/STAGE_1R_GITHUB_ACTIONS_PRE_EXECUTION_BINDING.json
binding ID = LGTTCI-S1R-GHA-PREEXEC-BINDING-2026-09-17-v1
blob SHA = 50953f47a35cb4172e2ea7838c84a8e44af35fe1
status = BOUND-READY-AWAITING-FINAL-EXECUTION-AUTHORIZATION
```

以前の`authorizations/STAGE_1R_PRE_EXECUTION_BINDING.json`はローカルexecution routeの歴史的記録として保持するが、fresh executionには使用しない。

詳細は[`checkpoints/2026-09-17-stage1r-github-actions-pre-execution-ready.md`](checkpoints/2026-09-17-stage1r-github-actions-pre-execution-ready.md)を参照する。

現在、**`STAGE_1R_EXECUTION_AUTHORIZATION.json`は存在せず、fresh `402...` / `412...` seedへのアクセスは0である。**

## 次の工程

ユーザーが再試験開始を明示した場合のみ、GitHub Actions bindingを再確認し、final execution authorizationを一度だけ新規作成する。そのcommitを唯一のfresh execution triggerとする。

full fresh workflowの再実行、workflow_dispatchによるfresh execution、結果を見た後のseed/root/support rule変更は認めない。

`main`への統合はまだ認めない。
