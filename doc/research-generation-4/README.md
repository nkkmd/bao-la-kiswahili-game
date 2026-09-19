# Research Generation 4 — 入口

更新日: 2026-09-20  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 CLOSED WITHOUT SCIENTIFIC DECISION / MAIN INTEGRATED`**

## このProgramが調べること

第四世代研究は、Research Generation 3で測定可能になったbounded RAW local game-tree geometryについて、次の三点を中心に検証する。

1. 別のphase、root family、source policy、rule contextへどこまで移送できるか。
2. 完全解析可能な限定domainで、exact game-theoretic consequenceとどのように関係するか。
3. 時間的持続、rule-semantic event、search reliabilityとどのように結びつくか。

第三世代のclosed Studyをrepairまたは再判定するProgramではない。各研究は新しいStudy ID、fresh evidence、事前登録、独立検証、結果確認後の救済的変更を禁止する規則を用いる。

## 現在の状態

```text
Program plan = FROZEN / INTEGRATED TO MAIN
Planning PR = #103
Planning merge commit = 692bcb40f52c097ca89bf7fea842b6f77fbdf19e
Core agenda = G4-01..G4-10
Independent tracks = G4-P01, G4-H01
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 = CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED
G4-02 integration PR = #154
G4-02 merge commit = 8131fc5ebadf9c855159b5e43b18fbc0bc95e1bd
G4-03 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-04 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-05 = CANDIDATE / NOT AUTHORIZED
G4-06..G4-09 = DEPENDENCY-GATED / NOT AUTHORIZED
G4-10 depth 11 = PROTECTED / NOT AUTHORIZED / NOT ACCESSED
G4-P01 = INDEPENDENT / NOT AUTHORIZED
G4-H01 = DEFERRED
Public AI change authorized = false
```

## G4-01の到達点

G4-01は`LGTTCI-STUDY1`として実施し、claim-transfer compatibility instrumentをscientific effectから分離して検証した。

Stage 0は`STAGE0-PASS`。旧Stage 1は実行環境消失のためfail-closedで終了し、旧`401...` namespaceをquarantineした。Stage 1Rは新しい`402...` primary namespaceでfresh acquisitionを一度だけ実行し、1536/1536 source evidenceを取得した。

元workflowのdownstream technical failure後はfresh seedを再読せず、immutable source artifactだけを使うdownstream-only recoveryを実施し、22/22 measurement taskとaggregateがsuccessした。

最終結果:

```text
SFCDF = compatible
SILGM = compatible
GCLD = compatible
G4-01 decision = COMPATIBILITY-ELIGIBLE-ALL
result deterministic core SHA256 = 0bf8da597bec47eb774b467be1c49bfc6f2aa43850151a44eaf2598ccb220a61
```

これは後続研究を設計できるcompatibility/readiness結果であり、G3由来claimのfresh-domain一般化、effect direction、counterexample成立を示すものではない。

詳細は[`../local-game-tree-geometry-transfer-compatibility-instrument/README.md`](../local-game-tree-geometry-transfer-compatibility-instrument/README.md)を参照する。

## G4-02 — corridor / tree-graph transfer

G4-02は、G3-04で限定的にformal確認された次の2 claimをfresh source-policy × root-family domainへ移せる範囲と反例境界を検証するために実施した。

```text
C1 = SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION / frozen direction MTAJI-GREATER
C6 = SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO / frozen direction NAMUA-GREATER
representation = RAW-ONLY
relative depth = 5
four domains = P1/P2 × RF1/RF2
Stage 2 family = 4 domains × 2 claims = fixed 8 hypotheses
```

scientific contractを結果後に変更せず、Study 1〜4をprospectiveに分離して進めた。

### Study 1

Stage 0はPASS。Stage 1でprimary 384 slotsを開始したが、9件がmandatory first-16 opening-prefix serializer invariantを満たさなかった。frozen decision mappingに従い`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`で閉じ、repair/reopenしなかった。

### Study 2

short trajectoryの技術条件をprospectiveに修正して開始したが、Stage 1 canonical executionでdeterministic relay-limit failureが発生した。事前規則に従い`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`で閉じ、reserve救済やrerunを行わなかった。

### Study 3

scientific contractを変更せず、source replayをassigned anchor pair完成時に即停止するanchor-bounded designへ変更した。

Stage 0はPASS、Stage 1は32/32 selected pairsと8/8 measurement tasksを満たし`FORMAL-PREPARATION-ELIGIBLE`となった。

Stage 2 canonical run `35427427920` はclassify-finalまで成功したがmandatory `bundle-source`工程で停止した。formal measurementは開始されず、`TECHNICAL-INVALID / NO SCIENTIFIC DECISION / CLOSED / NO RERUN`で閉じた。

### Study 4

Study 3のscientific contractを維持し、fresh scientific access前のartifact pipeline end-to-end validationを追加した独立prospective successorとして実施した。

Stage 0:

```text
run = 35435952961
status = PASS / TECHNICAL PIPELINE VALIDATED
fresh scientific seed reads = 0
```

Stage 1:

```text
run = 35441719931
execution SHA = b84b53a3369490cafad2b428feddee20323f3e82
primary sources = 384 / 384
retry = 0
paired reserve = 0
candidate pair complete = 297
root shortage = 87
selected pairs = 32 / 32
measurement tasks = 8 / 8 success
final decision = FORMAL-PREPARATION-ELIGIBLE
```

Stage 1ではeffect magnitude、direction、p-value、generalization/counterexample decisionを生成していない。

Stage 2 canonical one-shot execution:

```text
run = 35450625402
execution SHA = 0acd54a23fd8e1f1226c307fe948c251d64f336d
attempt = 1
primary source acquisition = 768 / 768 completed
retry = 0
paired reserve = 0
deterministic failure = 0
classify-final = success / ready=true
bundle-source = failure
recovered error = source identity mismatch
formal measurement = NOT STARTED
formal aggregate = NOT STARTED
8-cell decision vector = NOT GENERATED
```

canonical sealed source artifactを対象とするidentity-only audit `35452797563` は、fresh seed再読なしで768件を検査し、top-level `studyId` mismatch 0、`stageId` mismatch 0、duplicate slot 0で成功した。bundle時のmismatchはこの監査では再現しなかったが、root causeは未確定であり、same-evidence repairやformal measurement救済には使用していない。

frozen protocolに従いStudy 4 Stage 2を`TECHNICAL-INVALID / NO SCIENTIFIC DECISION / FAIL-CLOSED`で閉じた。

## G4-02の最終結論境界

G4-02のformal Stage 2 hypothesis testは完了していない。そのため、次の科学的labelはいずれも割り当てていない。

```text
GENERALIZES-WITHIN-FROZEN-DOMAIN
COUNTEREXAMPLE-BOUNDARY-DETECTED
NOT-CONFIRMED
NON-ESTIMABLE
```

正式状態は次のとおりである。

```text
G4-02 = CLOSED / NO SCIENTIFIC DECISION
scientific transfer decision = NONE
final formal Stage2 status = TECHNICAL-INVALID
successor study within G4-02 = NOT AUTHORIZED
```

これはC1/C6が一般化しない、counterexampleが存在する、effectがない、というnegative scientific evidenceではない。G4-02で固定したone-shot条件下では、有効なformal transfer判定まで到達できなかったことを意味する。

将来同じ科学的問いを扱う場合は、G4-02をrepair/reopenせず、別Agendaまたは新しいprospective Studyとしてauthorizationから開始する。

詳細:

- [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)
- [`../structural-forcing-corridor-tree-raw-transfer/STUDY_4_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_4_PROTOCOL.md)
- [`../structural-forcing-corridor-tree-raw-transfer/results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-2-study4/STUDY_4_STAGE_2_RESULT.json)
- [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md)
- [`checkpoints/2026-09-20-g4-02-main-integration-complete.md`](checkpoints/2026-09-20-g4-02-main-integration-complete.md)

## 研究構成

| Wave | Agenda | 目的 | 現在状態 |
| --- | --- | --- | --- |
| A | `G4-01` | claim移送用compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| A | `G4-02` | G3-04由来corridor / tree-graph transfer | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| A | `G4-03` | G3-07由来width / search-ranking transfer | `ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED` |
| A | `G4-04` | G3-10由来geometry-trajectory transfer | `ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED` |
| B | `G4-05..G4-06` | fresh exact microdomainと局所幾何からgame-theoretic consequenceへの限定的bridge | `NOT AUTHORIZED` |
| C | `G4-07..G4-09` | 多時間尺度memory、rule-semantic transition、search reliability | `NOT AUTHORIZED` |
| D | `G4-10` | 保護されたfresh depth-11 exact reachability topology | `PROTECTED / NOT AUTHORIZED` |
| 独立 | `G4-P01` | state transformation / canonicalizationの再基礎化 | `NOT AUTHORIZED` |
| 独立 | `G4-H01` | qualified participantを必要とするhuman / expert研究 | `DEFERRED` |

## 最初に読む文書

1. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在のProgram状態とauthorization境界
2. [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract
3. [`RESUME_HERE.md`](RESUME_HERE.md) — 安全な再開手順
4. [`../local-game-tree-geometry-transfer-compatibility-instrument/README.md`](../local-game-tree-geometry-transfer-compatibility-instrument/README.md) — G4-01の正式結果
5. [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md) — G4-02の正式状態
6. [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-20-study4-stage2-technical-invalid.md) — G4-02最終Study closure
7. [`checkpoints/2026-09-20-g4-02-main-integration-complete.md`](checkpoints/2026-09-20-g4-02-main-integration-complete.md) — G4-02 main統合記録

## 次に許可される作業

G4-02について追加のscientific executionは行わない。G4-02 closureに伴う文書整合性監査と`main`統合は完了済みであり、追加のclosure作業を前提にしない。

Research Generation 4を継続する場合は、G4-03またはG4-04など次のAgendaについて個別authorization reviewが必要である。G4-01のeligibility gateを満たしていることだけではfresh scientific executionは承認されない。

G4-10 depth11は引き続きprotectedであり、明示authorizationなしにアクセスしない。

## 解釈上の境界

- `COMPATIBILITY-ELIGIBLE-ALL`や`FORMAL-PREPARATION-ELIGIBLE`はgeneralizationやeffect確認ではない。
- G4-02の`TECHNICAL-INVALID`はC1/C6の一般化失敗やcounterexampleの科学的証拠ではない。
- identity-only auditはtechnical provenance監査であり、formal measurementの代替ではない。
- 局所幾何の移送可能性はwhole-Bao universal lawと同義ではない。
- exact microdomainのvalueは、その限定domain外の勝率や最適性を示さない。
- engine scoreはvalidated Bao win probabilityではない。
- search stabilityは正しさ、人間の容易さ、悪手の不存在を意味しない。
- machine-only evidenceはhuman difficultyやhuman errorの証拠ではない。
- 研究結果は公開AIの採用判断と分離する。