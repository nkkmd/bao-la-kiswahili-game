# SFCDFT-STUDY2 — Stage 1 technical-invalid closure

作成日: 2026-09-18  
Stage: `SFCDFT2-S1-COMPATIBILITY-2026-09-18-v1`  
状態: **`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`**

## 1. 結論

G4-02 `SFCDFT-STUDY2` の Stage 1 fresh compatibility execution は、384 primary slotsを一度だけ開始した結果、382件のsealed source artifactを保存し、2件がfrozen source replay中のdeterministic `relay-limit` exceptionで停止した。

frozen Stage 1 specで正常なsource statusとして定義されているのは `CANDIDATE-PAIR-COMPLETE` と `NO-CANDIDATE-ROOT-SHORTAGE` である。`relay-limit` は正常statusとして定義されておらず、production replay実装も `state.reason === "relay-limit"` を例外として停止する。したがって、本件はsupport shortageではなくsource-replay integrity failureとして扱い、frozen decision mappingに従って **`TECHNICAL-INVALID / NO-DECISION`** でfail-closedとする。

382件のみからcompatibility decisionを作らない。failed slotsをrepair/replayしない。paired reserveによる置換を行わない。workflowを再実行しない。Stage 2へ進まない。

## 2. canonical execution provenance

```text
Study ID = SFCDFT-STUDY2
Stage ID = SFCDFT2-S1-COMPATIBILITY-2026-09-18-v1
execution branch = research/g4-02-sfcdft-study2-prereg
execution head = 8c84f2cda1a62f812f030ef319341683a4d77e54
GitHub Actions run ID = 35345143248
final classification artifact ID = 10546781677
final classification artifact digest = sha256:f11a502dcd9e9c273a6f41fb3e8f4ebfb7de12f028e60ad50b884e44cb0de0b6
```

final classification artifactは次を記録する。

```text
primary START = 384
sealed source success = 382
deterministic source failure = 2
paired reserve START = 0
retry = 0
unresolved = 0
fatal = true
```

## 3. deterministic failure監査

failed primary slotsは2件である。

| slot | frozen assignment | observed failure | job | failure artifact |
| --- | --- | --- | --- | --- |
| `40411112` | `P2 / RF1 / SFCDFT2-D3-P2-RF1` | `relay-limit` at ply 225 | `105599954154` | `10546344753` |
| `40411312` | `P2 / RF1 / SFCDFT2-D3-P2-RF1` | `relay-limit` at ply 223 | `105599960287` | `10547080576` |

Actions job logの例外はそれぞれ次のとおりである。

```text
Error: relay-limit seed=40411112 ply=225
Error: relay-limit seed=40411312 ply=223
```

両方とも `tools/experiments/lib/lgttci-compatibility-production.js` のproduction replayにある次のfrozen guardで停止した。

```text
need(state.reason !== "relay-limit", `relay-limit seed=${seed} ply=${ply}`);
```

source-unitはproduction replayを先に評価するため、当該2 slotではproduction replay exceptionの時点で停止し、production/independent exact equality、anchor selection、opening-prefix classification、sealed `source.json`生成には到達していない。

これはrunner interruption、network failure、artifact upload failure等のinfrastructure interruptionではない。そのため、paired reserve使用条件には該当しない。

## 4. Study 2のprospective contractとの対応

Study 2はStudy 1のshort-opening-prefix failureを受け、candidate eligibilityより後にopening-prefix requirementを適用できるようsource serializationをprospectiveに修正した。この修正自体はStage 0で検証済みであり、今回のfailureはStudy 1と同じfailureではない。

一方、Stage 1 specはsource acquisitionについて次をfreezeしている。

- normal source statusは `CANDIDATE-PAIR-COMPLETE` / `NO-CANDIDATE-ROOT-SHORTAGE`
- deterministic source outcomeをinfrastructure interruptionとして扱わない
- paired reserveはproven infrastructure interruptionにのみ使用可能
- full fresh workflow rerunは禁止
- integrity / authorization / exactness failureは `TECHNICAL-INVALID`

`relay-limit` exceptionをfresh execution後に新しいnormal statusへ読み替えるとexecution semanticsの事後変更になるため、本Studyでは行わない。

## 5. evidence disposition

### Stage 1 primary

```text
40411001..40411384
reads = 384 / 384
status = CONSUMED-ONCE / QUARANTINED / NO-REUSE
```

このpopulationをStudy 2の再実行や後続Studyのfresh populationとして再利用しない。

### Stage 1 paired reserve

```text
41411001..41411384
reads = 0
status = UNREAD / NOT-USED / NOT-ELIGIBLE-FOR-STUDY2-RECOVERY
```

今回の2 deterministic failuresを救済するためにreserveを使用しない。

### 382 sealed source artifacts

immutable audit evidenceとして保持する。ただし、Study 2 Stage 1のcompatibility decisionを生成する科学的入力として使用しない。

```text
sealed source artifacts = 382
scientific disposition = AUDIT-EVIDENCE-ONLY
Stage 1 compatibility decision generated = false
Stage 2 preparation eligibility generated = false
effect direction / p-value = NONE
generalization / counterexample decision = NONE
```

## 6. 禁止するrepair

本closure後、少なくとも次を禁止する。

- `40411001..40411384`の再読・再実行・再利用
- `40411112` / `40411312`のrepair replay
- `41411001..41411384`による今回failureの置換
- workflow全体のrerun
- 382 sealed sourcesのみからのcompatibility decision生成
- `relay-limit` semanticsを変更して同じStudy / Stage IDをreopenすること
- Stage 1 failureを理由とするStage 2 seed access

## 7. 次のprospective Studyへの技術情報

同じG4-02科学課題を再検証する場合、今回の2 failureは**technical development information**として利用できる。ただしStudy 2をrepairしない。

fresh scientific seedへアクセスする前に、新しいStudy identityとfresh seed namespaceを用意し、少なくとも次をprospectiveにfreezeする必要がある。

- source replayにおける `relay-limit` の意味論
- `relay-limit` をnormal population statusとして扱うか、別のprospective source-generation contractで回避するか
- production / independent replay双方での一致条件
- candidate eligibilityとの処理順序
- prior Study 1 / Study 2 population・trajectory・opening-prefix・RAW rootを除外するfreshness firewall
- no-rescue / no-rerun boundary

今回2件がいずれも `P2 / RF1 / SFCDFT2-D3-P2-RF1` に割り当てられていたことは記録するが、2件しかなく、かつsource replay failureであるため、domainの科学的性質やC1/C6 transferについて推論しない。

## 8. Stage 2境界

```text
SFCDFT2-S2-FORMAL-HELDOUT-2026-09-18-v1 authorization = false
Stage 2 seed reads = 0
Stage 2 evidence access = 0
Stage 2 scientific outcome = none
```

Stage 2は開かない。

## 9. closure decision

```text
Study 2 Stage 1 status = TECHNICAL-INVALID
Study 2 Stage 1 scientific decision = NO-DECISION
closure = FAIL-CLOSED
recovery = NOT AUTHORIZED / NOT EXECUTED
Stage 2 = NOT AUTHORIZED / NOT ACCESSED
G4-02 scientific claim update = NONE
Public AI change = false
main merge = false
```

本記録はStudy 2を救済するための事後変更ではなく、frozen protocolのfail-closed ruleを適用してexecution boundaryを確定するためのclosure recordである。
