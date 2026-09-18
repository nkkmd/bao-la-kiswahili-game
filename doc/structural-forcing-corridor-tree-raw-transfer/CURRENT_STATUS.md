# SFCDFT-STUDY2 — 現在の状態

更新日: 2026-09-18  
Agenda: `Research Generation 4 / G4-02`  
Current Study ID: `SFCDFT-STUDY2`  
状態: **`STAGE 1 TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED / STAGE 2 NOT AUTHORIZED`**

## 現在地

G4-02の最初の正式Study `SFCDFT-STUDY1` は、Stage 1でshort source trajectoryがmandatory first-16 opening-prefix serializer invariantに到達したため `TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED` となった。

そのfailureをtechnical development informationとして用い、科学的C1/C6 contractを変えず、新しいStudy identity・fresh seed namespace・freshness firewallを持つ `SFCDFT-STUDY2` をprospectiveに開始した。Study 2ではsource serializationの処理順序をfresh access前に修正し、Stage 0 technical validationは `PASS` した。

Stage 1は別途pre-access binding / execution authorizationをfreezeした後、GitHub Actions run `35345143248`で384 primary slotsを一度だけ実行した。382件はsealed source artifactを生成したが、2件がproduction source replay中のdeterministic `relay-limit` exceptionで停止した。

frozen specでは `relay-limit` はnormal source statusではなく、deterministic source failureはpaired reserveの対象となるinfrastructure interruptionでもない。decision mappingのintegrity failure規則を適用し、Study 2 Stage 1を **`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`** で閉じた。

```text
Study 1 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 2 Stage 0 = PASS
Study 2 Stage 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED
Study 2 Stage 1 primary reads = 384 / 384
sealed source artifacts = 382 / AUDIT-EVIDENCE-ONLY
deterministic source failures = 2
paired reserve reads = 0
retry / rerun / repair / replay = 0
Stage 1 compatibility decision = NONE
Stage 2 authorization = false
Stage 2 seed reads = 0
Stage 2 outcome = NONE
Public AI change = false
main merge = false
```

## Stage 1 failure

canonical execution:

```text
execution head = 8c84f2cda1a62f812f030ef319341683a4d77e54
Actions run = 35345143248
final classification artifact = 10546781677
artifact digest = sha256:f11a502dcd9e9c273a6f41fb3e8f4ebfb7de12f028e60ad50b884e44cb0de0b6
```

failed primary slots:

```text
40411112 -> relay-limit at ply 225
40411312 -> relay-limit at ply 223
```

両方ともfrozen assignmentは `P2 / RF1 / SFCDFT2-D3-P2-RF1` だった。production replayの `state.reason !== "relay-limit"` guardで停止しており、当該slotのsealed `source.json` は生成されていない。

この一致はtechnical audit情報として記録するが、C1/C6 transferやD3 domainについて科学的結論を出さない。

## evidence disposition

### Stage 1 primary

`40411001..40411384`は384/384 read済みであり、**`CONSUMED-ONCE / QUARANTINED / NO-REUSE`**とする。

### Stage 1 paired reserve

`41411001..41411384`は0 readである。deterministic failureはreserve使用条件ではないためStudy 2の救済には使用しない。

### 382 sealed source artifacts

immutable audit evidenceとして保持するが、Study 2 Stage 1 compatibility decisionの生成には使用しない。

## Stage 2

`SFCDFT2-S2-FORMAL-HELDOUT-2026-09-18-v1`は**未認可・未アクセス**である。Stage 1が `TECHNICAL-INVALID / NO-DECISION` で閉じたため、本Study内でStage 2へ進まない。

## 次に同じ科学課題を検証する場合

`SFCDFT-STUDY2`をrepair/reopenしない。新しいprospective Studyとして、fresh seed access前に少なくとも次をfreezeする。

- 新しいStudy / Stage identity
- 新しいfresh seed namespace
- source replayにおける `relay-limit` のprospective semantics
- production / independent replayの一致条件
- candidate eligibilityとsource serializationの処理順序
- Study 1 / Study 2 evidence identityを除外するfreshness firewall
- no-rescue / no-rerun boundary

新規Studyのauthorization reviewを通すまでfresh scientific seedへアクセスしない。

## 正本

- [`STUDY_2_PROTOCOL.md`](STUDY_2_PROTOCOL.md) — Study 2 frozen prospective protocol
- [`prereg/STUDY_2_STAGE_1_COMPATIBILITY_SPEC.json`](prereg/STUDY_2_STAGE_1_COMPATIBILITY_SPEC.json) — frozen Stage 1 execution/decision contract
- [`checkpoints/2026-09-18-study2-stage1-technical-invalid-relay-limit.md`](checkpoints/2026-09-18-study2-stage1-technical-invalid-relay-limit.md) — Study 2 Stage 1 fail-closed closure
- [`results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json`](results/stage-1-study2/STUDY_2_STAGE_1_RESULT.json) — machine-readable canonical Study 2 Stage 1 result
- [`results/stage-1/STAGE_1_RESULT.json`](results/stage-1/STAGE_1_RESULT.json) — Study 1 Stage 1 historical closure
