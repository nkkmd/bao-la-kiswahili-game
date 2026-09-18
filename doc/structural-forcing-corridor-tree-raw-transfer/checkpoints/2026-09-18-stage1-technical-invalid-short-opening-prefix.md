# SFCDFT-STUDY1 — Stage 1 technical-invalid closure

作成日: 2026-09-18  
Stage: `SFCDFT-S1-COMPATIBILITY-2026-09-18-v1`  
状態: **`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`**

## 1. 結論

G4-02 `SFCDFT-STUDY1` の Stage 1 compatibility execution は、frozen protocol が mandatory integrity contract として要求した first-16 opening-prefix serializer を満たせない primary slot が発生したため、**`TECHNICAL-INVALID / NO-DECISION`** として閉じる。

本closureでは、保存済み375件を用いたseed-free recovery、failed slotの再実行、paired reserveによる置換、source replay、serializer semanticsの事後変更を行わない。

Stage 1 compatibility decisionは生成しない。Stage 2 preparation eligibilityも生成しない。

## 2. 実行provenance

```text
Study ID = SFCDFT-STUDY1
Stage ID = SFCDFT-S1-COMPATIBILITY-2026-09-18-v1
execution branch = research/g4-02-sfcdft-study1
execution head = 900884f687f6bc227106c7faa13bcce397574cc6
GitHub Actions run ID = 35311628238
final classification artifact ID = 10534310212
final classification artifact digest = sha256:f4fd8df7034343e0ff24823fe3fa29f24a73806d2a0aa4ded35ca412741ec517
```

final classification:

```text
primary START = 384
sealed source success = 375
deterministic source failure = 9
paired reserve START = 0
retry = 0
unresolved = 0
fatal = true
```

## 3. deterministic failure監査

failed primary slotsは次の9件である。

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

9件すべてをActions job logで監査した。いずれも同じopening-prefix invariantに到達し、source trajectoryがmandatoryな16手のopening prefixを構成できない条件で停止している。代表的な実装例外は次である。

```text
Error: at least 16 moves required for opening prefix
```

これはrunner interruption、artifact upload failure、network failure等のinfrastructure interruptionではない。paired reserveを使用できる条件には該当しない。

## 4. frozen implementationとの対応

frozen source-unit runnerは次の順序で処理する。

1. policy / root-family / domain assignment
2. production / independent source replay
3. production / independent first-16 opening-prefix生成とexact equality
4. assigned root-family anchor selection
5. source payload serialization

したがって、16手未満のtrajectoryはanchor selectionより前にserializer invariantで停止し、当該slotについて`pairComplete`を含むsealed `source.json`は生成されない。

一方、frozen root contractの最も早いNamua rootはRF1のexact ply 20であり、RF2ではexact ply 28である。そのため16手未満で終了したtrajectoryがcomplete root pairを供給できないこと自体は明らかである。

しかし、この事実を fresh seed access後に用いて「serializer failureではなく通常のroot shortageだった」と再分類することはしない。frozen protocolはmandatory `serializer` / identity / implementation / provenance contract違反を`TECHNICAL-INVALID`へ写像しているため、その事前規則を優先する。

## 5. seed-free recoveryを採用しない理由

375件のsealed source artifactだけを読み、9件をcandidate rejectionとして扱えば、追加fresh seedを読まずにcompatibility targetを満たせる可能性はある。

ただし、それを実施するには、fresh execution後に次のexecution semanticsを変更する必要がある。

- first-16 opening-prefix生成をcandidate eligibilityより前にmandatoryとしたfrozen処理順序
- mandatory serializer violationのdecision mapping
- failure slotに対するcandidate classification

これは結果値を直接見ない変更であっても、fresh populationを観測した後のrepairに相当する。prospective / no-rescue境界を維持するため採用しない。

## 6. evidence disposition

### primary namespace

```text
40311001..40311384
reads = 384 / 384
status = CONSUMED-ONCE / QUARANTINED / NO-REUSE
```

このprimary namespaceを同一Studyまたは後続Studyで再利用しない。

### paired reserve namespace

```text
41311001..41311384
reads = 0
status = UNREAD / NOT-USED
```

reserveは今回使用していない。今回のtechnical-invalidを救済するためには使用せず、将来の利用可否は別のprospective study decisionなしに決めない。

### sealed source artifacts

375件のsealed source artifactsはimmutable audit evidenceとして保持する。ただし、本Stage 1のcompatibility decisionを生成する科学的入力としては使用しない。

```text
sealed source artifacts = 375
scientific disposition = AUDIT-EVIDENCE-ONLY
Stage 1 compatibility decision generated = false
paired effect direction generated = false
p-value generated = false
generalization decision generated = false
counterexample decision generated = false
```

## 7. 禁止するrepair

本closure後、少なくとも次を禁止する。

- Stage 1 primary seedの再読・再実行
- 9 failed primary slotsのrepair replay
- paired reserveによるfailed slot置換
- reserve-of-reserve
- 375 sealed sourceからのStage 1 compatibility decision生成
- opening-prefix semanticsを変更して同じStage IDを再開すること
- Stage 1 failureを理由とするStage 2 seed access

同じ研究課題を再度検証する場合は、今回のfailureを開発情報として扱い、**新しいprospective Study/Stage identity、fresh seed namespace、修正済みserializer contractをscientific seed access前にfreezeする**必要がある。

## 8. Stage 2境界

```text
SFCDFT-S2-FORMAL-HELDOUT-2026-09-18-v1 authorization = false
Stage 2 seed reads = 0
Stage 2 evidence access = 0
Stage 2 scientific outcome = none
```

Stage 2は開かない。

## 9. 保護された境界

このclosureにより次は変化しない。

```text
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE / NO RERUN
G3-12 Stage 1 = CLOSED / NO REPAIR OR REPLAY
G3-12 Stage 2 seeds = UNREAD / NOT REUSED BY RG4
G4-10 depth 11 = NOT AUTHORIZED / NOT ACCESSED
validated transform set = []
authoritative state identity = RAW
Public AI change = false
main merge = false
```

## 10. closure decision

```text
Stage 1 status = TECHNICAL-INVALID
Stage 1 scientific decision = NO-DECISION
Stage 1 recovery = NOT AUTHORIZED / NOT EXECUTED
Stage 2 = NOT AUTHORIZED / NOT ACCESSED
Study scientific claim update = NONE
```

この記録は、失敗後にStudyを救済するためではなく、frozen protocolのfail-closed ruleをそのまま適用してexecution boundaryを確定するためのclosure recordである。
