# Research Generation 4 — 再開位置

更新日: 2026-09-18  
状態: **`G4-01 COMPLETE / G4-02 AUTHORIZATION REVIEW = PREREQUISITE-REQUIRED / SCIENTIFIC EXECUTION NOT AUTHORIZED`**

## 再開時の読む順序

1. repositoryのremote `main` HEADを取得し、完全SHAを記録する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)を読み、G4-01完了状態と後続Agendaのauthorization境界を確認する。
3. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)を読み、Wave Aのdependency、証拠区分、no-rescue boundaryを確認する。
4. [`../local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md`](../local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md)を読み、G4-01のcanonical resultとclosureを確認する。
5. [`../local-game-tree-geometry-transfer-compatibility-instrument/results/stage-1r/STAGE_1R_COMPATIBILITY_RESULT.json`](../local-game-tree-geometry-transfer-compatibility-instrument/results/stage-1r/STAGE_1R_COMPATIBILITY_RESULT.json)を確認する。
6. [`../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md`](../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md)を読む。
7. [`checkpoints/2026-09-18-g4-01-repository-consistency-audit.md`](checkpoints/2026-09-18-g4-01-repository-consistency-audit.md)でmain統合前の文書整合性監査を確認する。
8. [`../DOCUMENTATION_LANGUAGE_POLICY.md`](../DOCUMENTATION_LANGUAGE_POLICY.md)と[`../JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](../JAPANESE_DOCUMENTATION_QUALITY_GATE.md)を読む。

## 現在地

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
repository-wide consistency audit = PASS
G4-02 = PREREQUISITE-REQUIRED / SCIENTIFIC EXECUTION NOT AUTHORIZED
G4-03 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-04 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
G4-01 main integration = AUTHORIZED BY USER / PR #151
```

## G4-01の確定結果

G4-01の正式Studyは`LGTTCI-STUDY1`。

```text
Stage 0 = STAGE0-PASS
old Stage 1 = EXECUTION-INTERRUPTED-FAIL-CLOSED-NO-DECISION
Stage 1R = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL
SFCDF = compatible
SILGM = compatible
GCLD = compatible
source coverage = 1536 / 1536
paired reserve use = 0
fresh workflow rerun = 0
seed-free measurements = 22 / 22 success
recovery run = 35265290422 / success
result deterministic core SHA256 = 0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61
```

`COMPATIBILITY-ELIGIBLE-ALL`はcompatibility/readiness判定であり、generalization、effect、counterexampleのformal resultではない。

## G4-02 authorization reviewの確定状態

2026-09-18のpost-G4-01 current-state reviewは**`PREREQUISITE-REQUIRED`**で閉じた。G4-01 SFCDF compatibilityはPASSしているが、RG4共通contractが要求するformal heldoutとcompatibility evidenceの`opening prefix` identity分離を、G4-01の保存source recordだけでは監査できない。

G4-01は`completedSourceRereadAuthorized = false`かつ`fullFreshWorkflowRerunAuthorized = false`である。旧seedを再読して不足identityを後付け生成しない。

正本: [`../research-program-decisions/2026-09-18-post-g4-01-g4-02-authorization-review.md`](../research-program-decisions/2026-09-18-post-g4-01-g4-02-authorization-review.md)

checkpoint: [`checkpoints/2026-09-18-g4-02-authorization-review-prerequisite-required.md`](checkpoints/2026-09-18-g4-02-authorization-review-prerequisite-required.md)

## 次に実施する判断

G4-02を進める場合、まず上記prerequisiteを解消し、その後に**post-G4-01 current-state G4-02 authorization reviewを再実施**する。G4-03/G4-04はそれぞれ未実施のauthorization reviewを先に行う。

reviewでは少なくとも次を判定する。

- G4-01 `COMPATIBILITY-ELIGIBLE-ALL`が当該Agendaのprerequisiteを満たすか
- どのG3 claim familyを移送対象とするか
- fresh evidence namespaceを既存のG3/G4 evidenceから独立して固定できるか
- formal claim、population、endpoint、selection rule、resource ceilingをprospectiveに固定できるか
- G4-01のcompatibility evidenceをscientific effectとして誤用していないか
- no-rescue / no-rerun / protected-evidence boundaryを維持できるか

`AUTHORIZED`の場合だけ正式Study ID、Stage、fresh seed block、execution contractを固定する。現在のG4-02は`PREREQUISITE-REQUIRED`なので、これらは未固定のまま保持する。

`NOT-AUTHORIZED`または`PREREQUISITE-REQUIRED`の場合はscientific seedへアクセスせず、理由をdecision recordへ残す。

## G4-01のmain統合

G4-01 research branchは研究完了状態にあり、repository-wide consistency auditも`PASS`している。2026-09-18にユーザーからPR #151による`main`統合の明示承認を受領した。

統合前に確認済みの項目:

- canonical result / provenance / attestationが一致している
- G4-01 closure decisionが存在する
- `CURRENT_STATUS.md`、Study README、Research Generation 4状態文書が整合している
- root README、`doc/RESEARCH_INDEX.md`、`doc/FUTURE_RESEARCH_AGENDA.md`をG4-01完了状態へ同期した
- repository-wide consistency auditが`PASS`
- PR #151を統合経路として明示承認した

repository-wide auditの記録は[`checkpoints/2026-09-18-g4-01-repository-consistency-audit.md`](checkpoints/2026-09-18-g4-01-repository-consistency-audit.md)を参照する。

## 禁止事項

- 旧G4-01 `401...` seed namespaceの再利用
- Stage 1R fresh workflowの再実行
- G3-12のrepair、reopen、Stage 1 replay
- G3-12 Stage 2 seedの流用
- G3-11 depth 10の再実行
- G4-10 authorization前のdepth 11 access
- `COMPATIBILITY-ELIGIBLE-ALL`をgeneralization/effect/counterexample resultとして扱うこと
- authorization review前のG4-02/G4-03/G4-04 scientific outcome生成
- G4-01のmain統合承認を後続Studyや公開AI変更の承認へ拡張すること
