# LGTTCI-STUDY1 — 現在の状態

更新日: 2026-09-17

## 正式状態

```text
Program position = Research Generation 4 / G4-01
Study = LGTTCI-STUDY1
Study authorization = G4-01-AUTHORIZED
Research branch = research/g4-01-transfer-compatibility-instrument
Baseline main = 6433c726d038f710b9b5af3620f1a7d30db7bdc9
Stage 0 = LGTTCI-S0-TECHNICAL-2026-09-17-v1 / STAGE0-PASS
Stage 1 = LGTTCI-S1-COMPATIBILITY-2026-09-17-v1 / EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION
Stage 1R = LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1 / STAGE1R-GITHUB-ACTIONS-PRE-EXECUTION-READY / NOT-AUTHORIZED-NOT-EXECUTED
execution route = GITHUB-ACTIONS-IMMUTABLE-ARTIFACT-PIPELINE
old 401... compatibility namespace = QUARANTINED / NO REUSE
fresh 402... primary seed access = 0
paired 412... reserve seed access = 0
formal scientific effects generated = 0
G3-12 evidence reused = false
G3-11 depth 10 rerun = false
G4-10 depth 11 access = false
public AI change authorized = false
main integration authorized = false
```

## Stage 0

`LGTTCI-S0-TECHNICAL-2026-09-17-v1`は正式に`STAGE0-PASS`となった。G3-12で見逃されたroot legal width 1のhelper precondition gapを、scientific populationへ進む前に検出・遮断できることをnegative control込みで確認済みである。

## 旧Stage 1の扱い

旧Stage 1はfresh seedへのアクセス開始後にローカル長時間processの実行環境が失われ、監査可能な最終result artifactを残せなかった。そのため`EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION`として閉じた。

旧`401...` seed blockは正確な最終read境界を証明できないため全体をquarantineし、再試験でも後続研究でも再利用しない。途中観測やpartial telemetryも科学的結果へ使用しない。

## Stage 1R再試験

再試験は新しいStage ID `LGTTCI-S1R-COMPATIBILITY-RETEST-2026-09-17-v1`として固定した。科学的contractのsource policy、root family、RAW identity、search condition、support gateは旧Stage 1から変更していない。

新しいfresh evidenceは次で固定している。

```text
Primary:
  SFCDF = 40211001..40211384
  SILGM = 40212001..40212768
  GCLD  = 40213001..40213384

Paired reserve:
  reserveSeed = primarySeed + 1000000
  SFCDF = 41211001..41211384
  SILGM = 41212001..41212768
  GCLD  = 41213001..41213384
```

reserveは結果やsupport不足による救済には使えない。primaryのfresh read開始がGitHub Actions上のimmutable START artifactで確認でき、source artifactまたはcontrolled failure artifactが残っていない純粋なインフラ中断だけがpaired reserveの対象となる。明示的source process failureではreserve禁止、reserve-of-reserveも禁止する。

## GitHub Actions耐障害execution contract

Stage 1Rの正式execution routeは`GITHUB-ACTIONS-IMMUTABLE-ARTIFACT-PIPELINE`である。

- primary acquisitionはSFCDF 96 job、SILGM 192 job、GCLD 96 jobへ分割する。
- 1 jobは4 slotを順に処理するが、各slotのfresh read直前にSTART artifact、成功直後にsource artifactをGitHubへ永続化してから次slotへ進む。
- START artifactがないslotだけはseed未読と判定できるため、primaryの安全な自動retryを1回許可する。
- STARTあり・source/failureなしの場合だけpaired reserveを使用できる。
- 全block通算fresh read上限は1584、infrastructure replacement上限は48である。
- 1536 source artifactの完全coverageを確認できた場合だけcanonical source bundleを生成する。
- depth-5 preflight、search、continuous geometryはsource bundleだけを読む22個のseed-free measurement taskへ分離する。
- measurement taskはfresh seedを読まないため、同一source bundle上でインフラretryできる。
- aggregationもfresh seedを読まない。

final authorization作成commit後はGitHub Actionsが独立して実行を継続するため、ChatGPTの応答や一時的ローカルruntimeを維持する必要はない。

## pre-execution検証

GitHub Actionsのtechnical-only workflow `LGTTCI Stage 1R pre-execution validation`は、最新run `35223729501` / job `105209943719`でsuccessした。

確認済み項目:

- JavaScript syntax
- YAML parse
- final execution authorization不存在
- Stage 1R result不存在
- GitHub Actions execution design
- primary matrix counts `96 / 192 / 96`
- seed-free measurement task count `22`
- technical fixture source smoke

GitHub Actions execution amendmentはfresh seed access 0の状態で固定した。

pre-execution binding:

```text
path = authorizations/STAGE_1R_GITHUB_ACTIONS_PRE_EXECUTION_BINDING.json
binding ID = LGTTCI-S1R-GHA-PREEXEC-BINDING-2026-09-17-v1
blob SHA = 50953f47a35cb4172e2ea7838c84a8e44af35fe1
status = BOUND-READY-AWAITING-FINAL-EXECUTION-AUTHORIZATION
```

以前の`STAGE_1R_PRE_EXECUTION_BINDING.json`はローカルrouteの歴史的記録として保持するが、fresh executionには使用しない。

詳細は[`checkpoints/2026-09-17-stage1r-github-actions-pre-execution-ready.md`](checkpoints/2026-09-17-stage1r-github-actions-pre-execution-ready.md)を参照する。

## 現在の停止位置

Stage 1Rは**GitHub Actionsによる試験開始直前**で停止している。

`STAGE_1R_EXECUTION_AUTHORIZATION.json`は存在せず、fresh `402...` / `412...` seed accessは0である。

次に進むのは、ユーザーが再試験開始を明示した場合だけである。その際はGitHub Actions用bindingを再確認し、final execution authorizationを一度だけ新規作成する。そのcommitが唯一のfresh execution triggerとなる。

full fresh workflowの再実行、workflow_dispatchによるfresh execution、科学的結果に応じたseed/root/support rule変更は認めない。
