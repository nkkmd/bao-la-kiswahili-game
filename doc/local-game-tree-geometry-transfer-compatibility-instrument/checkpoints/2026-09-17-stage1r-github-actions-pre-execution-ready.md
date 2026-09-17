# LGTTCI-STUDY1 — Stage 1R GitHub Actions実行直前checkpoint

日付: 2026-09-17  
対象Stage: `LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`  
正式状態: **`STAGE1R-GITHUB-ACTIONS-PRE-EXECUTION-READY / NOT-AUTHORIZED-NOT-EXECUTED`**

## 結論

Stage 1Rの実行routeを、ChatGPTの一時的なローカル実行環境に依存する方式から、GitHub Actions上のimmutable artifact pipelineへ変更した。変更はfresh seed access開始前に行い、科学的contractには変更を加えていない。

現在、final execution authorizationは存在せず、fresh `402...` primary seedおよびpaired `412...` reserve seedへのアクセスは0である。したがって科学的証拠はまだ消費していない。

## execution route

正式execution route:

`GITHUB-ACTIONS-IMMUTABLE-ARTIFACT-PIPELINE`

主要な耐障害構造は次のとおりである。

1. fresh acquisitionはSFCDF 96 job、SILGM 192 job、GCLD 96 jobへ分割する。各jobは4 primary slotを順に処理する。
2. 各slotについてfresh read直前にimmutable START artifactをGitHubへuploadする。
3. source replayが成功したslotは、次slotへ進む前にimmutable source artifactをuploadする。
4. START artifactが存在しないslotだけは「seed未読」と証明できるためprimaryの安全な自動retryを1回許可する。
5. primary STARTが存在しsource/failure artifactがないslotだけをインフラ中断として扱い、事前対応済みpaired reserveへ移す。
6. 明示的source process failureではreserveを使わない。
7. reserve-of-reserveは禁止する。
8. 全block通算のinfrastructure replacement上限は48、fresh read上限は1584のまま維持する。
9. 1536 source artifactが揃った場合だけcanonical source bundleを生成する。
10. depth-5 preflight、search、continuous geometryはsource bundleだけを読む22個のseed-free measurement taskとして実行する。
11. measurement taskはfresh seedを読まないため、同一source bundle上で最大3回までインフラretryできる。
12. aggregationもfresh seedを読まず、compatibility decisionだけを生成する。

## GitHub Actions technical preflight

最新のtechnical-only preflight:

```text
workflow = LGTTCI Stage 1R pre-execution validation
run = 35223729501
job = 105209943719
validated HEAD = b2745214134766f34cad75c45ec2575e8d951bee
conclusion = success
```

次を確認した。

- JavaScript syntax PASS
- YAML parse PASS
- final execution authorization不存在
- Stage 1R fresh result不存在
- GitHub Actions execution design PASS
- primary matrix counts = 96 / 192 / 96
- seed-free measurement matrix count = 22
- technical fixture source smoke PASS

直前のpreflight failureはmatrix generatorが`GITHUB_OUTPUT`存在時にstdoutへJSONを出さないtechnical harness bugによるものであり、科学的seedへはアクセスしていない。修正後の上記runでPASSした。

## exact binding

GitHub Actions用pre-execution binding:

```text
path = doc/local-game-tree-geometry-transfer-compatibility-instrument/authorizations/STAGE_1R_GITHUB_ACTIONS_PRE_EXECUTION_BINDING.json
binding ID = LGTTCI-S1R-GHA-PREEXEC-BINDING-2026-09-17-v1
blob SHA = 50953f47a35cb4172e2ea7838c84a8e44af35fe1
status = BOUND-READY-AWAITING-FINAL-EXECUTION-AUTHORIZATION
```

このbindingはStage 1R spec、GitHub Actions execution amendment、fresh execution workflow、per-slot composite action、artifact classifier、source bundler、source/measurement/aggregate runner、production/independent wrapper、engine/AI source identityをexact blob SHAで固定する。

以前の`STAGE_1R_PRE_EXECUTION_BINDING.json`はローカル実行routeの歴史的記録として保持するが、Stage 1Rのfresh execution routeとしては使用しない。

## 応答終了への耐性

final authorization作成commitによってGitHub Actions workflowが起動した後は、ChatGPTの応答やローカル実行環境を維持する必要はない。fresh acquisition、artifact永続化、seed-free measurement、aggregationはGitHub Actions側で進行する。

したがって、試験開始後にChatGPTの応答を終了しても、GitHub Actions runnerが継続する限り試験pipelineは独立して進行する。個別runnerが失われた場合も、immutable START/source/failure artifactによりslot状態を判定し、事前固定したrecovery ruleだけを適用する。

## 現在の停止位置

`STAGE_1R_EXECUTION_AUTHORIZATION.json`はまだ作成していない。

次にユーザーがStage 1R再試験開始を明示した場合のみ、次を行う。

1. このbinding blob SHAとbinding対象filesの一致を再確認する。
2. final authorization不存在、fresh `402...` / `412...` access 0を再確認する。
3. `STAGE_1R_EXECUTION_AUTHORIZATION.json`を**一度だけ新規作成**する。
4. そのcommitを唯一のfresh GitHub Actions execution triggerとする。

full fresh workflowの再実行、workflow_dispatchによるfresh execution、final authorizationの作り直しは認めない。

## 変更していない科学的境界

- source policy変更なし
- root family変更なし
- RAW identity変更なし
- geometry contract変更なし
- search condition変更なし
- support gate変更なし
- primary `402...` namespace変更なし
- paired `412...` reserve namespace変更なし
- formal effect生成なし
- p-value生成なし
- generalization/counterexample decision生成なし
- 旧`401...` seed再利用なし
- G3-11 depth 10 rerunなし
- G3-12 protected evidence accessなし
- G4-10 depth 11 accessなし
- public AI変更なし
- `main`統合なし
