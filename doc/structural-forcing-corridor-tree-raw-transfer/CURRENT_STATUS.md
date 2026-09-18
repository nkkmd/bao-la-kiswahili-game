# SFCDFT-STUDY1 — 現在の状態

更新日: 2026-09-18  
Agenda: `Research Generation 4 / G4-02`  
Study ID: `SFCDFT-STUDY1`  
状態: **`STAGE 1 TECHNICAL-INVALID / NO-DECISION / STAGE 2 NOT AUTHORIZED`**

## 現在地

G4-02はprerequisite解消後のauthorization review V2で`G4-02-AUTHORIZED`となり、prospective protocolをfreezeした。Stage 0 technical fixtureは`PASS`し、その後に別のpre-access binding / authorizationを通してStage 1 fresh compatibility populationを一度だけ実行した。

Stage 1は384 primary slotsを開始し、375件のsealed source artifactを保存した。一方、9 primary slotsではsource trajectoryがmandatoryなfirst-16 opening prefixを構成できず、frozen serializer invariantによりdeterministic failureとなった。

frozen protocolではmandatory serializer / identity / implementation / provenance contract違反を`TECHNICAL-INVALID`へ写像する。このため、9件をfresh execution後に通常のroot shortageへ読み替えたり、375件だけを使ってcompatibility decisionを生成したりせず、Stage 1をfail-closedで閉じた。

```text
Stage 0 = PASS
Stage 1 = TECHNICAL-INVALID / NO-DECISION
Stage 1 primary reads = 384 / 384
sealed source artifacts = 375 / AUDIT-EVIDENCE-ONLY
deterministic failures = 9
paired reserve reads = 0
rerun / repair / replay = 0
seed-free recovery = NOT EXECUTED
Stage 1 compatibility decision = NONE
Stage 2 authorization = false
Stage 2 seed reads = 0
Stage 2 outcome = NONE
Public AI change = false
main merge = false
```

## Stage 1 failure

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

Actions job logの監査では、9件すべてが同じshort-opening-prefix条件で停止した。代表的な例外は`Error: at least 16 moves required for opening prefix`である。

runnerはopening-prefix生成をanchor selectionより前に実行するため、failed slotsについて`pairComplete`を含むsealed source payloadは存在しない。16手未満のtrajectoryはRF1 exact ply20 / RF2 exact ply28のNamua rootへ到達できないが、その事実をfresh access後のreclassificationに使用しない。

## evidence disposition

### Stage 1 primary

`40311001..40311384`は384/384 read済みであり、**`CONSUMED-ONCE / QUARANTINED / NO-REUSE`**とする。

### Stage 1 paired reserve

`41311001..41311384`は0 readである。今回のtechnical-invalidの救済には使用しない。別のprospective decisionなしに利用しない。

### 375 sealed source artifacts

immutable audit evidenceとして保持するが、SFCDFT-STUDY1 Stage 1 compatibility decisionの科学的入力としては使用しない。

## Stage 2

`SFCDFT-S2-FORMAL-HELDOUT-2026-09-18-v1`は**未認可・未アクセス**である。Stage 1が`TECHNICAL-INVALID / NO-DECISION`で閉じたため、本Study内でStage 2へ進まない。

## 次に同じ科学課題を検証する場合

今回のfailureをtechnical development informationとして利用すること自体は可能だが、同じStageをrepair/reopenしない。再検証する場合は、少なくとも次をfresh seed access前に新しくprospective freezeする。

- 新しいStudy / Stage identity
- 新しいfresh seed namespace
- short trajectoryを明示的に扱うserializer / opening-prefix contract
- candidate eligibilityとserializerの処理順序
- no-rescue / no-rerun boundary
- prior G4-02 Stage 1 identityを含むfreshness firewall

新規Studyのauthorization reviewを経るまでfresh scientific seedへアクセスしない。

## 正本

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md) — frozen prospective protocol
- [`checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md`](checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md) — Stage 1 fail-closed closure
- [`results/stage-1/STAGE_1_RESULT.json`](results/stage-1/STAGE_1_RESULT.json) — machine-readable canonical Stage 1 result
- [`../research-program-decisions/2026-09-18-post-prerequisite-g4-02-authorization-review-v2.md`](../research-program-decisions/2026-09-18-post-prerequisite-g4-02-authorization-review-v2.md) — G4-02 Study-definition authorization
