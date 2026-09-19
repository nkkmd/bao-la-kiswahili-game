# Research Generation 4 — 再開位置

更新日: 2026-09-20  
状態: **`G4-02 CLOSED / NO SCIENTIFIC DECISION / DOCUMENTATION CLOSURE COMPLETE / MAIN INTEGRATED`**

## 再開時の読む順序

1. remote `main` HEADを確認する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の現在状態を確認する。
3. [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)でG4-02最終状態を確認する。
4. [`../structural-forcing-corridor-tree-raw-transfer/results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json)を確認する。
5. [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md)でformal closureとno-rerun境界を確認する。
6. [`checkpoints/2026-09-20-g4-02-closed-no-scientific-decision.md`](checkpoints/2026-09-20-g4-02-closed-no-scientific-decision.md)でAgenda全体のclosureを確認する。
7. [`checkpoints/2026-09-20-g4-02-main-integration-complete.md`](checkpoints/2026-09-20-g4-02-main-integration-complete.md)で`main`統合記録を確認する。

## 現在地

```text
Study 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 3 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
Study 3 Stage 2 = TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED
Study 4 Stage 0 = PASS
Study 4 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
Study 4 Stage 2 = TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED
G4-02 scientific transfer decision = NONE
G4-02 = CLOSED / NO SCIENTIFIC DECISION
documentation closure = COMPLETE
main integration = COMPLETE / PR #154 / merge commit 8131fc5ebadf9c855159b5e43b18fbc0bc95e1bd
public AI change = false
```

## Study 4 Stage 2確定値

```text
canonical run = 35450625402
run attempt = 1
workflow conclusion = FAILURE
execution head = 0acd54a23fd8e1f1226c307fe948c251d64f336d
primary source acquisition = 768 / 768 completed
retry = 0
paired reserve = 0
deterministic failures = 0
classify-final = success / ready=true
bundle-source = failure
bundle-source job = 105919448021
recovered error = source identity mismatch
formal measurement = NOT STARTED
formal aggregate = NOT STARTED
8-cell decision vector = NOT GENERATED
```

formal measurement前のmandatory artifact stageで停止したため、C1/C6のeffect direction、p-value、Holm判定、generalization/counterexample decisionは存在しない。

## Identity-only post-failure audit

canonical runのsealed source artifactsだけを対象に、fresh seedを再読しないidentity-only auditを実施した。

```text
audit run = 35452797563
execution head = 9a2abaa3b45e2eaac532ea9c7c1ba284e22d4688
conclusion = SUCCESS
source artifacts inspected = 768
top-level studyId mismatch = 0
top-level stageId mismatch = 0
duplicate slot = 0
fresh scientific seed reads = 0
scientific endpoint reads = 0
effect computation = false
```

```text
audit artifact ID = 10587421372
audit artifact digest = sha256:dae4371a2b06d3c6085a502b310b5af55dc0c439ec2d91268d2f7fbc219e2af8
```

canonical bundlerの`source identity mismatch`はこのtop-level identity auditでは再現しなかった。root causeは未確定であり、この監査をformal measurement救済やsame-evidence repairへ用いない。

## G4-02最終解釈

```text
G4-02 = CLOSED / NO SCIENTIFIC DECISION
scientific transfer decision = NONE
final formal Stage2 status = TECHNICAL-INVALID
successor Study within G4-02 = NOT AUTHORIZED
```

これはC1/C6の一般化失敗やcounterexample検出を意味しない。凍結済みone-shot protocolで有効なformal transfer結果を取得できなかった、という終了状態である。

Study 4 Stage 1の`FORMAL-PREPARATION-ELIGIBLE`はcompatibility-only evidenceとして保持するが、Stage 2 formal conclusionへ昇格させない。

## Documentation closure

G4-02の最終状態は、ルート`README.md`、研究索引、将来アジェンダ、RG4入口文書、RG4 current status、G4-02 current status、machine-readable Stage 2 result、Study 4 Stage 2 checkpoint、Agenda closure checkpointへ反映済みである。

`PROGRAM_PLAN.md`などのprospectively frozen文書は事後結果に合わせて改変しない。履歴文書に残る当時の`NOT AUTHORIZED`や進行中表記は、その時点の記録として保持し、live-state文書とは区別する。

repository-wide closure documentation auditは専用GitHub Actions workflowで検証済みである。監査のtechnical fixはscientific executionではなく、fresh scientific seedへのアクセスを伴わない。

G4-02はPR #154で`main`へ統合済みであり、統合記録は[`checkpoints/2026-09-20-g4-02-main-integration-complete.md`](checkpoints/2026-09-20-g4-02-main-integration-complete.md)を正本とする。

## 次にRG4を進める場合

G4-02について追加のscientific executionは行わない。第四世代研究を継続する場合は、G4-03またはG4-04など次のAgendaについて**個別のauthorization review**から開始する。

G4-01のeligibility gateだけでfresh scientific executionが自動承認されることはない。G4-02をrepair/reopenせず、G4-02で閉じたscientific executionやseedを救済目的で再利用しない。

## 禁止事項

- G4-02 Study 1〜4 scientific executionのrerun / repair / reopen
- closed scientific seedの救済目的の再読
- deterministic scientific failureのreserve救済
- frozen endpoint / direction / alpha / sample target / domain / resource ceilingの事後変更
- identity auditを根拠にしたStage 2 scientific rescue
- G3-12 repair/replay
- G4-10 depth11 access
- public AIへの自動反映