# Research Generation 4 — 再開位置

更新日: 2026-09-18  
状態: **`G4-01 COMPLETE / G4-02 SFCDFT-STUDY1 STAGE 1 = TECHNICAL-INVALID / NO-DECISION`**

## 再開時の読む順序

1. remote `main` HEADと`research/g4-02-sfcdft-study1` HEADを取得し、完全SHAを記録する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の現在状態を確認する。
3. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)でWave Aのdependency、evidence class、no-rescue boundaryを確認する。
4. [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)でG4-02 current stateを確認する。
5. [`../structural-forcing-corridor-tree-raw-transfer/STUDY_1_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_1_PROTOCOL.md)でfrozen prospective contractを確認する。
6. [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md)を読む。
7. [`../structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json)でmachine-readable closureを確認する。
8. [`../research-program-decisions/2026-09-18-post-prerequisite-g4-02-authorization-review-v2.md`](../research-program-decisions/2026-09-18-post-prerequisite-g4-02-authorization-review-v2.md)でStudy-definition authorization境界を確認する。
9. [`../DOCUMENTATION_LANGUAGE_POLICY.md`](../DOCUMENTATION_LANGUAGE_POLICY.md)と[`../JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](../JAPANESE_DOCUMENTATION_QUALITY_GATE.md)を読む。

## 現在地

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 Study = SFCDFT-STUDY1
G4-02 Stage 0 = PASS
G4-02 Stage 1 = TECHNICAL-INVALID / NO-DECISION
G4-02 Stage 1 primary reads = 384 / 384
G4-02 Stage 1 sealed sources = 375 / AUDIT-EVIDENCE-ONLY
G4-02 Stage 1 deterministic failures = 9
G4-02 Stage 1 paired reserve reads = 0
G4-02 Stage 2 = NOT AUTHORIZED / NOT ACCESSED / seed reads 0
G4-03 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-04 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
Current branch main integration = NOT AUTHORIZED / NOT PERFORMED
```

## G4-02の確定経緯

initial G4-02 authorization reviewは`PREREQUISITE-REQUIRED`だった。G4-01 Stage 1Rのlegacy source recordにopening-prefix identityがなく、G4-01 seed reread / rerunも禁止されていたためである。

その後、legacy limitationを明示するProgram-level methodology amendmentとidentity-only firewallを旧seed再読なしでmaterializeした。authorization review V2は`G4-02-AUTHORIZED`となり、Study-definition / preregistration / Stage 0を許可した。

正式Study:

```text
Study ID = SFCDFT-STUDY1
Stage 0 = SFCDFT-S0-TECHNICAL-2026-09-18-v1
Stage 1 = SFCDFT-S1-COMPATIBILITY-2026-09-18-v1
Stage 2 = SFCDFT-S2-FORMAL-HELDOUT-2026-09-18-v1
```

Stage 0は`PASS`。その後、Stage 1専用のpre-execution bindingとexecution authorizationをfreezeし、fresh compatibility populationを一度だけ実行した。

## Stage 1の確定closure

GitHub Actions run `35311628238`:

```text
primary START = 384
sealed source success = 375
deterministic source failure = 9
paired reserve START = 0
retry = 0
unresolved = 0
```

failed primary slots:

```text
40311019
40311131
40311191
40311195
40311223
40311263
40311301
40311365
40311381
```

9件すべてのjob logを監査し、short source trajectoryがmandatoryなfirst-16 opening-prefix serializer invariantを満たせず停止したことを確認した。

重要な実装順序:

```text
source replay
-> first-16 opening prefix
-> anchor selection
-> source payload serialization
```

そのためfailed slotsでは`pairComplete`を含むsource payloadが生成されていない。16手未満のtrajectoryはRF1 exact ply20 / RF2 exact ply28のNamua rootに到達できないが、fresh execution後にfailure semanticsを通常のroot shortageへ変更しない。

frozen protocolはmandatory serializer integrity violationを`TECHNICAL-INVALID`へ写像している。よって正式closureは次である。

```text
Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
compatibility decision = NONE
seed-free recovery = NOT EXECUTED
primary rerun = 0
failed-slot repair/replay = 0
paired reserve use = 0
effect direction / p-value = NONE
generalization / counterexample decision = NONE
```

375 sealed source artifactsはaudit evidenceとして保持するが、本Stageのcompatibility decision生成には使用しない。

## seed boundary

```text
Stage 1 primary 40311001..40311384
reads = 384 / 384
status = CONSUMED-ONCE / QUARANTINED / NO-REUSE

Stage 1 paired reserve 41311001..41311384
reads = 0
status = UNREAD / NOT-USED

Stage 2 seeds
reads = 0
status = UNREAD / NOT-ACCESSED
```

paired reserveは今回のtechnical-invalid救済には使用しない。別のprospective decisionなしに利用しない。

## 次に進む場合

### G4-02を再検証する場合

`SFCDFT-STUDY1`をrepair/reopenしない。今回のfailureをtechnical development informationとして扱い、次をfresh scientific seed access前に新しくfreezeする。

- 新しいStudy / Stage identity
- 新しいfresh seed namespace
- short trajectoryを明示的に扱うopening-prefix / serializer contract
- candidate eligibilityとserializer処理順序
- prior `40311001..40311384` populationを除外するfreshness firewall
- no-rescue / no-rerun boundary

そのうえで新しいauthorization reviewを行う。

### 別Agendaへ進む場合

G4-03/G4-04等はG4-01によりeligibility gateを満たしているだけで、execution authorizationではない。Agenda固有のauthorization reviewを先に行う。

## 禁止事項

- G4-02 Stage 1 primary `40311001..40311384`の再読・再実行・再利用
- 9 failed slotsのrepair replay
- paired reserveによる今回failureの救済
- 375 sealed sourcesからのStage 1 compatibility decision生成
- `SFCDFT-STUDY1`のserializer semanticsを事後変更してreopenすること
- Stage 1 failureを理由とするStage 2 access
- G3-12のrepair / reopen / Stage 1 replay
- G3-12 Stage 2 seedの流用
- G3-11 depth 10の再実行
- G4-10 authorization前のdepth 11 access
- current G4-02 branchの`main`統合（ユーザーの明示承認前）
- 公開AIへの研究結果の自動反映

## main統合境界

G4-01はユーザー承認によりPR #151で統合済みである。

現在の`research/g4-02-sfcdft-study1`については`main`統合承認を受けていない。**明示指示があるまで統合しない。**
