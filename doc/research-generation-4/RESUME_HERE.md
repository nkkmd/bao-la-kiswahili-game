# Research Generation 4 — 再開位置

更新日: 2026-09-18  
状態: **`G4-01 COMPLETE / G4-02 SFCDFT-STUDY2 STAGE 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`**

## 再開時の読む順序

1. remote `main` HEADと`research/g4-02-sfcdft-study2-prereg` HEADを取得し、完全SHAを記録する。
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)でRG4全体の現在状態を確認する。
3. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md)でWave A dependency、evidence class、no-rescue boundaryを確認する。
4. [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)でG4-02 current stateを確認する。
5. [`../structural-forcing-corridor-tree-raw-transfer/STUDY_2_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_2_PROTOCOL.md)でStudy 2 frozen prospective contractを確認する。
6. [`../structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_2_STAGE_1_COMPATIBILITY_SPEC.json`](../structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_2_STAGE_1_COMPATIBILITY_SPEC.json)でfrozen Stage 1 execution/decision contractを確認する。
7. [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-study2-stage1-technical-invalid-relay-limit.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-study2-stage1-technical-invalid-relay-limit.md)を読む。
8. [`../structural-forcing-corridor-tree-raw-transfer/results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json)でmachine-readable closureを確認する。
9. Study 1の過去closureが必要なら[`../structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json)を確認する。
10. [`../DOCUMENTATION_LANGUAGE_POLICY.md`](../DOCUMENTATION_LANGUAGE_POLICY.md)と[`../JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](../JAPANESE_DOCUMENTATION_QUALITY_GATE.md)を読む。

## 現在地

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 Study 1 = STAGE 1 TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 current Study = SFCDFT-STUDY2
G4-02 Study 2 Stage 0 = PASS
G4-02 Study 2 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
G4-02 Study 2 Stage 1 primary reads = 384 / 384
G4-02 Study 2 Stage 1 sealed sources = 382 / AUDIT-EVIDENCE-ONLY
G4-02 Study 2 Stage 1 deterministic failures = 2
G4-02 Study 2 Stage 1 paired reserve reads = 0
G4-02 scientific compatibility/generalization/counterexample decision = NONE
G4-02 Study 2 Stage 2 = NOT AUTHORIZED / NOT ACCESSED / seed reads 0
G4-03 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-04 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
Current branch main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Study 2 Stage 1の確定closure

canonical one-shot execution:

```text
execution branch = research/g4-02-sfcdft-study2-prereg
execution head = 8c84f2cda1a62f812f030ef319341683a4d77e54
GitHub Actions run = 35345143248
final classification artifact = 10546781677
artifact digest = sha256:f11a502dcd9e9c273a6f41fb3e8f4ebfb7de12f028e60ad50b884e44cb0de0b6
```

result:

```text
primary START = 384
sealed source success = 382
deterministic source failure = 2
paired reserve START = 0
retry = 0
unresolved = 0
fatal = true
```

failed slots:

```text
40411112 -> P2 / RF1 / SFCDFT2-D3-P2-RF1 -> relay-limit at ply 225
40411312 -> P2 / RF1 / SFCDFT2-D3-P2-RF1 -> relay-limit at ply 223
```

両方ともproduction source replayのfrozen `relay-limit` guardで停止した。これはinfrastructure interruptionではないためpaired reserveは使用しない。fresh execution後に`relay-limit`をnormal support statusへ再定義せず、frozen integrity mappingに従ってStage 1を `TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED` で閉じた。

382 sealed sourcesだけからcompatibility decisionを生成しない。failed-slot repair/replay、workflow rerun、reserve substitutionを行わない。

## seed boundary

```text
Study 1 primary 40311001..40311384
reads = 384 / 384
status = QUARANTINED / NO-REUSE

Study 2 primary 40411001..40411384
reads = 384 / 384
status = CONSUMED-ONCE / QUARANTINED / NO-REUSE

Study 2 paired reserve 41411001..41411384
reads = 0
status = UNREAD / NOT-USED / NOT-ELIGIBLE-FOR-STUDY2-RECOVERY

Study 2 Stage 2 seeds
reads = 0
status = UNREAD / NOT-ACCESSED
```

## 次に進む場合

### G4-02を再検証する場合

`SFCDFT-STUDY2`をrepair/reopenしない。今回のfailureをtechnical development informationとして扱い、fresh scientific seed access前に次を新しくprospective freezeする。

- 新しいStudy / Stage identity
- 新しいfresh seed namespace
- `relay-limit` のsource-replay semantics
- production / independent replay双方の一致条件
- candidate eligibilityとsource serializationの処理順序
- Study 1 / Study 2 populationとidentityを除外するfreshness firewall
- no-rescue / no-rerun boundary

そのうえで新しいauthorization reviewを行う。authorization前にはfresh seedを読まない。

### 別Agendaへ進む場合

G4-03/G4-04等はG4-01によりeligibility gateを満たしているだけでexecution authorizationではない。Agenda固有のauthorization reviewを先に行う。

## 禁止事項

- Study 2 Stage 1 primary `40411001..40411384`の再読・再実行・再利用
- `40411112` / `40411312`のrepair replay
- paired reserveによるStudy 2 failureの救済
- canonical Stage 1 workflowのrerun
- 382 sealed sourcesからのStage 1 compatibility decision生成
- `relay-limit` semanticsを事後変更して`SFCDFT-STUDY2`をreopenすること
- Study 2 Stage 2 access
- Study 1のrepair / reopen / seed再利用
- G3-12のrepair / reopen / Stage 1 replay
- G3-12 Stage 2 seedの流用
- G3-11 depth 10の再実行
- G4-10 authorization前のdepth 11 access
- current G4-02 branchの`main`統合（ユーザーの明示承認前）
- 公開AIへの研究結果の自動反映

## main統合境界

G4-01はユーザー承認によりPR #151で統合済みである。

現在の`research/g4-02-sfcdft-study2-prereg`については`main`統合承認を受けていない。**明示指示があるまで統合しない。**
