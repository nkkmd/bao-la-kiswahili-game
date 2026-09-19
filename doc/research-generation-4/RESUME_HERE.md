# Research Generation 4 — 再開位置

更新日: 2026-09-20  
状態: **`G4-02 CLOSED / NO SCIENTIFIC DECISION / DOCUMENTATION CLOSURE IN PROGRESS`**

## 再開時の読む順序

1. remote `main` HEADと`research/g4-02-sfcdft-study4-prereg` HEADを確認する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の現在状態を確認する。
3. [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)でG4-02最終状態を確認する。
4. [`../structural-forcing-corridor-tree-raw-transfer/results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json)を確認する。
5. [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md)でformal closureとno-rerun境界を確認する。
6. G4-02関連文書の整合性監査を継続する。
7. `main`統合はユーザーの明示指示があるまで行わない。

## 現在地

```text
current branch = research/g4-02-sfcdft-study4-prereg
Study 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 2 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 3 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
Study 3 Stage 2 = TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED
Study 4 Stage 0 = PASS
Study 4 Stage 1 = FORMAL-PREPARATION-ELIGIBLE
Study 4 Stage 2 = TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED
G4-02 scientific transfer decision = NONE
G4-02 = CLOSED / NO SCIENTIFIC DECISION
main integration = NOT AUTHORIZED / NOT PERFORMED
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

Formal measurement前のmandatory artifact stageで停止したため、C1/C6のeffect direction、p-value、Holm判定、generalization/counterexample decisionは存在しない。

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

canonical bundlerの `source identity mismatch` はこのtop-level identity auditでは再現しなかった。root causeは未確定であり、この監査をformal measurement救済やsame-evidence repairへ用いない。

## G4-02最終解釈

```text
G4-02 = CLOSED / NO SCIENTIFIC DECISION
scientific transfer decision = NONE
final formal Stage2 status = TECHNICAL-INVALID
successor study within G4-02 = NOT AUTHORIZED
```

これはC1/C6の一般化失敗やcounterexample検出を意味しない。凍結済みone-shot protocolで有効なformal transfer結果を取得できなかった、という終了状態である。

Study 4 Stage 1の`FORMAL-PREPARATION-ELIGIBLE`はcompatibility-only evidenceとして保持するが、Stage 2 formal conclusionへ昇格させない。

## 次に行う作業

1. `research-generation-4/README.md`、`RESEARCH_INDEX.md`、`FUTURE_RESEARCH_AGENDA.md`などのG4-02表記を最終状態へ更新する。
2. ルート`README.md`を含む人間向け入口文書で、G4-02の古い進行状態が残っていないか確認する。
3. repository-wide documentation consistency auditを行い、closure checkpointを固定する。
4. その時点で研究ブランチ上のG4-02作業を完了状態とする。
5. `main`統合はユーザーの明示指示がある場合のみ行う。

第四世代研究をその後継続する場合、G4-03/G4-04など次のAgendaは個別authorization reviewから開始する。G4-02をrepair/reopenしない。

## 禁止事項

- G4-02 Study 1〜4 scientific executionのrerun / repair / reopen
- closed scientific seedの救済目的の再読
- deterministic scientific failureのreserve救済
- frozen endpoint / direction / alpha / sample target / domain / resource ceilingの事後変更
- identity auditを根拠にしたStage 2 scientific rescue
- G3-12 repair/replay
- G4-10 depth11 access
- public AIへの自動反映
- ユーザーの明示指示なしの`main`統合
