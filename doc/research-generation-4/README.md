# Research Generation 4 — 入口

更新日: 2026-09-18  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 SFCDFT-STUDY1 STAGE 1 = TECHNICAL-INVALID / NO-DECISION`**

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
G4-02 Study = SFCDFT-STUDY1
G4-02 Stage 0 = PASS
G4-02 Stage 1 = TECHNICAL-INVALID / NO-DECISION
G4-02 Stage 2 = NOT AUTHORIZED / NOT ACCESSED
G4-03 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
G4-04 = ELIGIBILITY GATE SATISFIED / NOT AUTHORIZED
Depth 11 = NOT AUTHORIZED / NOT ACCESSED
Public AI change authorized = false
Current G4-02 branch main integration = NOT AUTHORIZED / NOT PERFORMED
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

詳細は[`../local-game-tree-geometry-transfer-compatibility-instrument/README.md`](../local-game-tree-geometry-transfer-compatibility-instrument/README.md)を参照する。

## G4-02の現在地

G4-02のinitial authorization reviewは、G4-01 Stage 1R保存sourceにopening-prefix identityが残っていないため`PREREQUISITE-REQUIRED`となった。その後、旧G4-01 seedの再読・rerunを行わず、legacy limitationを明示するProgram-level methodology amendmentとidentity-only firewallをmaterializeした。

prerequisite解消後のauthorization review V2で`G4-02-AUTHORIZED`となり、正式Study `SFCDFT-STUDY1`をprospectiveにfreezeした。ただしV2 authorizationはStudy definition / preregistration / Stage 0までであり、Stage 1 fresh seed accessは別のpre-execution bindingとexecution authorizationを通過した後に一度だけ実施した。

Stage 0は`PASS`。Stage 1ではprimary 384 slotsを開始し、375件のsealed source artifactを保存したが、9 primary slotsがmandatoryなfirst-16 opening-prefix serializer invariantを満たせずdeterministic failureとなった。

```text
Stage 1 primary reads = 384 / 384
sealed source success = 375
short-opening-prefix deterministic failures = 9
paired reserve reads = 0
primary rerun / repair / replay = 0
seed-free recovery = NOT EXECUTED
Stage 1 compatibility decision = NONE
Stage 1 status = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Stage 2 seed reads = 0
```

16手未満のtrajectoryはRF1 exact ply20 / RF2 exact ply28のNamua rootへ到達できないが、fresh access後に9件を通常のroot shortageへ読み替えない。frozen protocolはmandatory serializer / identity / implementation / provenance contract違反を`TECHNICAL-INVALID`へ写像するため、その事前規則を適用した。

375件のsealed sourceはimmutable audit evidenceとして保持するが、本Stageのcompatibility decision生成には使用しない。`SFCDFT-STUDY1`をrepair/reopenせず、Stage 2も開かない。

詳細:

- [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)
- [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md)
- [`../structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json)

## 研究構成

| Wave | Agenda | 目的 | 現在状態 |
| --- | --- | --- | --- |
| A | `G4-01` | claim移送用compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| A | `G4-02` | G3-04由来corridor / tree-graph transfer | `SFCDFT-STUDY1 STAGE 1 TECHNICAL-INVALID / NO-DECISION` |
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
3. [`RESUME_HERE.md`](RESUME_HERE.md) — 次の安全な再開手順
4. [`../local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md`](../local-game-tree-geometry-transfer-compatibility-instrument/CURRENT_STATUS.md) — G4-01の正式結果
5. [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md) — G4-02の正式状態
6. [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md) — G4-02 Stage 1 closure
7. [`../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md`](../research-program-decisions/2026-09-18-g4-01-local-game-tree-geometry-transfer-compatibility-study1-closure.md) — G4-01 closure
8. [`../research-program-decisions/2026-09-18-post-prerequisite-g4-02-authorization-review-v2.md`](../research-program-decisions/2026-09-18-post-prerequisite-g4-02-authorization-review-v2.md) — G4-02 Study-definition authorization

## 次に許可される作業

`SFCDFT-STUDY1`はStage 1 `TECHNICAL-INVALID / NO-DECISION`で閉じ、同Studyをrepair/reopenしない。

G4-02の科学課題を再検証する場合は、今回のfailureをtechnical development informationとして扱い、新しいStudy / Stage identity、新しいfresh seed namespace、short trajectoryを明示的に扱うserializer contract、prior G4-02 Stage 1 identityを除外するfreshness firewallをfresh seed access前にfreezeし、改めてauthorization reviewを行う。

別のWave A Agendaへ進む場合、G4-03/G4-04はいずれもeligibility gateを満たしているだけであり、個別authorization reviewが必要である。

G4-01は2026-09-18にユーザーの明示承認を受けPR #151で`main`へ統合済みである。現在のG4-02 research branchの`main`統合承認は受けていないため、明示指示があるまで統合しない。

## 解釈上の境界

- `COMPATIBILITY-ELIGIBLE-ALL`はcompatibility/readinessであり、generalizationやeffectの確認ではない。
- G4-02 Stage 1 `TECHNICAL-INVALID`は、C1/C6の一般化または反例についてのnegative scientific evidenceではない。
- 375件のsealed sourceはaudit evidenceであり、Stage 1 scientific decisionの代替ではない。
- 局所幾何の移送可能性はwhole-Bao universal lawと同義ではない。
- exact microdomainのvalueは、その限定domain外の勝率や最適性を示さない。
- engine scoreはvalidated Bao win probabilityではない。
- search stabilityは正しさ、人間の容易さ、悪手の不存在を意味しない。
- machine-only evidenceはhuman difficultyやhuman errorの証拠ではない。
- 研究結果は公開AIの採用判断と分離する。
