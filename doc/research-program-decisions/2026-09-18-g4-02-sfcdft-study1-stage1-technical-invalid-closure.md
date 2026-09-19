# 2026-09-18 — G4-02 SFCDFT-STUDY1 Stage 1 technical-invalid closure

## 正式判定

**`SFCDFT-STUDY1 / STAGE 1 = TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`**

G4-02 `SFCDFT-STUDY1`のStage 1 compatibility executionは、frozen protocolでmandatoryとしたfirst-16 opening-prefix serializer integrity conditionを満たせないprimary slotが発生したため、科学的compatibility判定を生成せず閉じる。

この判定はC1/C6の一般化、反例、effect direction、effect sizeに関するnegative scientific resultではない。

## 実行識別情報

```text
Agenda = Research Generation 4 / G4-02
Study ID = SFCDFT-STUDY1
Stage ID = SFCDFT-S1-COMPATIBILITY-2026-09-18-v1
Evidence class = FRESH-COMPATIBILITY
Execution branch = research/g4-02-sfcdft-study1
Execution head = 900884f687f6bc227106c7faa13bcce397574cc6
GitHub Actions run ID = 35311628238
Final classification artifact ID = 10534310212
Final classification artifact digest = sha256:f4fd8df7034343e0ff24823fe3fa29f24a73806d2a0aa4ded35ca412741ec517
```

## 実行結果

```text
primary START = 384
sealed source success = 375
deterministic source failure = 9
paired reserve START = 0
retry = 0
unresolved = 0
fatal = true
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

9件すべてのActions job logを監査し、同じshort-opening-prefix conditionで停止したことを確認した。代表的な例外は次である。

```text
Error: at least 16 moves required for opening prefix
```

## fail-closed判断

frozen implementationはsource replay後、assigned root-family anchor selectionより先にfirst-16 opening-prefix identityを生成する。したがって16手未満で終了したtrajectoryは、root candidate eligibilityを記録する前にmandatory serializer invariantで停止する。

16手未満のtrajectoryがRF1 exact ply20 / RF2 exact ply28のNamua rootを提供できないこと自体は明らかである。しかし、fresh execution後にこの事実を用いてfailureを通常のroot shortageへ再分類しない。

frozen protocolではmandatory identity / serializer / production-independent agreement / authorization / provenance contractの違反を`TECHNICAL-INVALID`へ写像している。そのため、事後的なsemantics変更やcandidate rejectionへの読み替えより、事前に固定したdecision mappingを優先する。

## recoveryを行わない

次は実施しない。

- primary `40311001..40311384`の再読・再実行
- failed 9 slotsのrepair replay
- paired reserve `41311001..41311384`による置換
- 375 sealed sourcesだけを用いるseed-free recovery
- opening-prefix semanticsの事後変更
- 同一Stage IDのreopen
- Stage 1 failureを理由とするStage 2 access

375 sealed sourcesはimmutable audit evidenceとして保持するが、本Stageのcompatibility decision生成には使用しない。

## seed disposition

```text
Stage 1 primary = 40311001..40311384
reads = 384 / 384
status = CONSUMED-ONCE / QUARANTINED / NO-REUSE

Stage 1 paired reserve = 41311001..41311384
reads = 0
status = UNREAD / NOT-USED / REQUIRES-NEW-PROSPECTIVE-DECISION
```

## 科学的output

```text
Stage 1 compatibility decision = NONE
Stage 2 preparation eligibility = NONE
effect direction = NONE
p-value = NONE
generalization decision = NONE
counterexample decision = NONE
```

したがって、G3-04 C1 `MTAJI-GREATER`およびC6 `NAMUA-GREATER`のfresh-domain transferについて、`SFCDFT-STUDY1`からpositive/negativeいずれのscientific updateも行わない。

## Stage 2

```text
Stage ID = SFCDFT-S2-FORMAL-HELDOUT-2026-09-18-v1
authorization = false
seed reads = 0
evidence access = 0
scientific outcome = none
```

Stage 2は開かない。

## G4-02を再検証する場合

`SFCDFT-STUDY1`はrepair/reopenしない。今回のfailureをtechnical development informationとして利用して再検証する場合は、scientific seed access前に少なくとも次を新たにprospective freezeする。

1. 新しいStudy / Stage identity
2. 新しいfresh seed namespace
3. short trajectoryを明示的に定義したopening-prefix / serializer contract
4. candidate eligibilityとidentity serializationの処理順序
5. prior `40311001..40311384` populationを除外するfreshness firewall
6. no-rescue / no-rerun rule
7. 新しいauthorization review

## 保護された境界

```text
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE / NO RERUN
G3-12 Stage 1 = CLOSED / NO REPAIR OR REPLAY
G3-12 Stage 2 seeds = UNREAD / NOT REUSED BY RG4
G4-01 old 401... namespace = QUARANTINED / NO REUSE
G4-01 Stage 1R = EXECUTED ONCE / NO RERUN
G4-02 Stage 2 = NOT AUTHORIZED / NOT ACCESSED
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
validated transform set = []
authoritative scientific state identity = RAW
Public AI change = false
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## 正本

- `doc/structural-forcing-corridor-tree-raw-transfer/STUDY_1_PROTOCOL.md`
- `doc/structural-forcing-corridor-tree-raw-transfer/checkpoints/2026-09-18-stage1-technical-invalid-short-opening-prefix.md`
- `doc/structural-forcing-corridor-tree-raw-transfer/results/stage-1/STAGE_1_RESULT.json`
- `doc/structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`

本decisionはfrozen protocolのfail-closed ruleを適用してStage 1を閉じるものであり、過去のprotocol・authorization文書を事後変更しない。
