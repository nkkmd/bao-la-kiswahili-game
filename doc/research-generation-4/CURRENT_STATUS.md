# Research Generation 4 — 現在の状態

更新日: 2026-09-18  
Program: `Bao Fourth-Generation Research Program`  
状態: **`G4-01 COMPLETE / G4-02 SFCDFT-STUDY1 STAGE 1 = TECHNICAL-INVALID / NO-DECISION`**

## Program全体

第四世代のprospective program planは`main`へ統合済みである。G4-01 `LGTTCI-STUDY1`は`COMPLETE / COMPATIBILITY-ELIGIBLE-ALL`として完了し、ユーザー承認のもとPR #151で`main`へ統合済みである。

G4-02では、initial authorization reviewの`PREREQUISITE-REQUIRED`を受けてlegacy compatibility freshness prerequisiteを解消した。その後のauthorization review V2で`G4-02-AUTHORIZED`となり、正式Study `SFCDFT-STUDY1`をprospectiveにfreezeした。Stage 0は`PASS`したが、Stage 1 fresh compatibility executionはmandatory opening-prefix serializer integrity violationにより**`TECHNICAL-INVALID / NO-DECISION`**としてfail-closedで終了した。

```text
Research Generation 3 = CLOSED / INTEGRATED TO MAIN
Research Generation 4 plan = FROZEN / INTEGRATED TO MAIN
G4-01 = COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED
G4-02 Study = SFCDFT-STUDY1
G4-02 Stage 0 = PASS
G4-02 Stage 1 = TECHNICAL-INVALID / NO-DECISION
G4-02 Stage 1 compatibility decision = NONE
G4-02 Stage 2 = NOT AUTHORIZED / NOT ACCESSED
G4-03 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-04 = ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
Public AI change authorized by RG4 = false
Current G4-02 branch main integration = NOT AUTHORIZED / NOT PERFORMED
```

## G4-01の確定状態

G4-01の正式Studyは`LGTTCI-STUDY1`である。

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

## G4-02 authorizationの経緯

最初のpost-G4-01 authorization reviewでは、G4-01 Stage 1Rの保存source recordにopening-prefix identityが保持されていないことから`PREREQUISITE-REQUIRED`とした。

その後、G4-01の旧seedを再読・rerunせず、`RG4-MA-001-G4-02-LEGACY-COMPATIBILITY-FRESHNESS`とidentity-only firewallをprospectiveにmaterializeした。legacy limitationを明示したうえでV2 reviewを実施し、Study-definitionを`G4-02-AUTHORIZED`とした。

V2 authorizationはStudy definition / preregistration / Stage 0を許可したもので、Stage 1 fresh seed accessには別のpre-execution bindingとexecution authorizationを要求した。この境界を満たした後、Stage 1を一度だけ実行した。

正本:

- [`../research-program-decisions/2026-09-18-post-g4-01-g4-02-authorization-review.md`](../research-program-decisions/2026-09-18-post-g4-01-g4-02-authorization-review.md) — initial `PREREQUISITE-REQUIRED`
- [`../research-program-decisions/2026-09-18-g4-02-freshness-methodology-prerequisite-review.md`](../research-program-decisions/2026-09-18-g4-02-freshness-methodology-prerequisite-review.md) — prerequisite review
- [`../research-program-decisions/2026-09-18-post-prerequisite-g4-02-authorization-review-v2.md`](../research-program-decisions/2026-09-18-post-prerequisite-g4-02-authorization-review-v2.md) — `G4-02-AUTHORIZED`

## G4-02 `SFCDFT-STUDY1`

中心課題は、G3-04でformalに確認されたC1 `MTAJI-GREATER`とC6 `NAMUA-GREATER`が、G4-01でcompatibilityを確認したfresh source-policy × root-family domainへどこまで移送されるかを、claim別に検証することである。

### Stage 0

`SFCDFT-S0-TECHNICAL-2026-09-18-v1 = PASS`。

### Stage 1

Stage ID: `SFCDFT-S1-COMPATIBILITY-2026-09-18-v1`

GitHub Actions run `35311628238`でprimary 384 slotsを一度だけ開始した。

```text
primary START = 384
sealed source success = 375
deterministic source failure = 9
paired reserve START = 0
retry = 0
unresolved = 0
Stage 1 scientific decision = NONE
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

9件すべてのActions job logを監査し、short source trajectoryがmandatoryなfirst-16 opening prefixを構成できない同一のserializer invariantで停止したことを確認した。代表的な例外は`Error: at least 16 moves required for opening prefix`である。

frozen runnerはopening-prefix生成をanchor selectionより前に実行する。16手未満のtrajectoryはRF1 exact ply20 / RF2 exact ply28のNamua rootには到達できないが、fresh access後にこれを通常のroot shortageへ再分類することはしない。frozen protocolはmandatory serializer / identity / implementation / provenance contract違反を`TECHNICAL-INVALID`へ写像しているため、その事前規則を適用した。

したがってStage 1は**`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`**である。

実施していないもの:

- primary seed rerun
- failed slot repair/replay
- paired reserve置換
- 375 sealed sourceだけを用いたseed-free recovery
- Stage 1 compatibility decision生成
- effect direction / p-value / generalization / counterexample decision生成

375件のsealed source artifactsはimmutable audit evidenceとして保持するが、本Stageの科学的compatibility decisionには使用しない。

正本:

- [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md)
- [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md)
- [`../structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json)

### Stage 2

```text
SFCDFT-S2-FORMAL-HELDOUT-2026-09-18-v1 authorization = false
Stage 2 seed reads = 0
Stage 2 evidence access = 0
Stage 2 scientific outcome = none
```

Stage 1 failureを理由にStage 2を開かない。

## seed disposition

### G4-02 Stage 1 primary

```text
40311001..40311384
reads = 384 / 384
status = CONSUMED-ONCE / QUARANTINED / NO-REUSE
```

### G4-02 Stage 1 paired reserve

```text
41311001..41311384
reads = 0
status = UNREAD / NOT-USED
```

paired reserveは今回のtechnical-invalidを救済するために使用しない。別のprospective decisionなしに利用しない。

## Agenda別の現在状態

| Agenda | 役割 | 現在の状態 |
| --- | --- | --- |
| `G4-01` | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| `G4-02` | corridor / tree-graph transfer | `SFCDFT-STUDY1 STAGE 1 TECHNICAL-INVALID / NO-DECISION` |
| `G4-03` | width / search-ranking transfer | `ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED` |
| `G4-04` | geometry-trajectory transfer | `ELIGIBILITY-GATE-SATISFIED-BY-G4-01 / NOT-AUTHORIZED` |
| `G4-05` | exact microdomain oracle foundation | `CANDIDATE / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-06` | geometry / exact consequence bridge | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-07` | multiscale memory / return | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-08` | rule-semantic transition | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-09` | search reliability / exact agreement | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-10` | protected depth-11 exact topology | `PROTECTED / NOT-AUTHORIZED-NOT-ACCESSED` |
| `G4-P01` | canonicalization re-foundation | `INDEPENDENT / NON-BLOCKING / NOT-AUTHORIZED` |
| `G4-H01` | human / expert evidence | `DEFERRED / INDEPENDENT / NON-BLOCKING` |

## 保護された境界

```text
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE / NO RERUN
G3-12 Stage 1 = CLOSED / NO REPAIR OR REPLAY
G3-12 Stage 2 seeds = UNREAD / NOT REUSED BY RG4
G4-01 old 401... namespace = QUARANTINED / NO REUSE
G4-01 Stage 1R fresh workflow = EXECUTED ONCE / NO RERUN
G4-02 Stage 1 primary 40311001..40311384 = CONSUMED ONCE / QUARANTINED
G4-02 Stage 1 paired reserve 41311001..41311384 = UNREAD / NOT USED
G4-02 Stage 2 seeds = UNREAD / NOT ACCESSED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
validated transform set = []
authoritative state identity = RAW
```

## 次の一手

`SFCDFT-STUDY1`をrepair/reopenしない。同じG4-02科学課題を再検証する場合、今回のtechnical failureをdevelopment informationとして扱い、新しいprospective Study/Stage identity、新しいfresh seed namespace、short trajectoryを明示的に扱うserializer contract、prior G4-02 Stage 1 identityを除外するfreshness firewallを**fresh scientific seed access前**にfreezeし、改めてauthorization reviewを行う。

別案としてProgram agendaを次の未認可Studyへ進める場合も、各Agenda固有のauthorization reviewを先に行う。

現在のG4-02 research branchを`main`へ統合する承認はまだない。

## 文書上の正本

- [`README.md`](README.md) — 第四世代研究の入口
- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — frozen prospective program contract
- [`RESUME_HERE.md`](RESUME_HERE.md) — 現在の安全な再開位置
- [`../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](../structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md) — G4-02 current state
- [`../structural-forcing-corridor-tree-raw-transfer/STUDY_1_PROTOCOL.md`](../structural-forcing-corridor-tree-raw-transfer/STUDY_1_PROTOCOL.md) — frozen G4-02 protocol
- [`../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md`](../structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md) — Stage 1 fail-closed closure
- [`../structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json`](../structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json) — Stage 1 machine-readable result
