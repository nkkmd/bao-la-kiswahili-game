# 2026-09-18 — G4-02 SFCDFT-STUDY2 prerequisite review

## 判定

**`PREREQUISITE-IN-PROGRESS / NO-FRESH-SCIENTIFIC-SEED-ACCESS`**

G4-02 `SFCDFT-STUDY1` は Stage 1 で `TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED` として閉じた。原因は、source trajectory が16手未満で終了した場合でも、anchor candidate eligibilityより先にmandatory first-16 opening-prefix serializerを実行する実装順序にあった。

本reviewは同じStageをrepair/reopenするものではない。G3-04 C1/C6の同じ科学課題を新しいprospective Studyで再検証できるかを、fresh scientific seed access前に評価する。

## immutable predecessor state

```text
predecessor Study = SFCDFT-STUDY1
predecessor Stage 1 = TECHNICAL-INVALID / NO-DECISION
primary reads = 384 / 384 / CONSUMED-ONCE
sealed source artifacts = 375 / AUDIT-EVIDENCE-ONLY
deterministic source failures = 9
paired reserve reads = 0
Stage 2 authorization = false
Stage 2 seed reads = 0
scientific effect output = none
```

Study 1 primary `40311001..40311384` は再読・再実行・repair replayしない。

## technical remediation contract

新Studyではsource replay後の処理順序を次に固定する。

1. production / independent source replayをexact比較する
2. assigned root-family anchor selectionをproduction / independentで実行しexact比較する
3. `pairComplete=false` のsourceは**noncandidate source**としてsealed記録する
4. noncandidate sourceにはfirst-16 opening-prefixをmandatoryとしない
5. `pairComplete=true` のsourceだけfirst-16 opening-prefixをproduction / independentで生成しexact比較する
6. complete pairなのにmove count <16、またはprefix生成不一致なら`TECHNICAL-INVALID`
7. candidate selection keyへ入るsourceは必ず`pairComplete=true`かつopening-prefix identityを持つ

RF1はNamua exact ply20、RF2はNamua exact ply28を要求するため、`pairComplete=true`で16手未満となることはroot contract上あり得ない。したがって、この変更はcandidate definitionを緩和せず、candidateになる前の短命trajectoryを通常のpopulation support不足として表現可能にするtechnical serialization修正である。

## noncandidate sealed record

short trajectoryを含む`pairComplete=false` sourceについて最低限次をdurableに残す。

```text
slotSeed
effectiveSeed
policyId
rootFamilyId
domainId
sourceTrajectorySha256
moveCount
terminal
pairComplete=false
openingPrefixStatus=NOT-APPLICABLE-NONCANDIDATE
openingPrefixLength=null
openingPrefixSha256=null
namua / mtaji = available anchor only or null
```

scientific endpoint値、pair差、effect direction、p-valueは保存しない。

## Study 1 freshness prerequisite

Study 2でfresh populationを開く前に、Study 1の既存Actions artifactsのみからidentity-only firewallをmaterializeする。

必須 exclusion:

- predecessor primary seed全384件
- predecessor sealed sourceのfull source trajectory SHA-256
- predecessor sealed sourceで記録済みのfirst-16 opening-prefix SHA-256
- predecessor sealed sourceで記録済みのRAW root SHA-256

9 failed sourceはsealed source payloadを持たないため、seed全体を禁止することで再利用を防ぐ。旧seedのreplayによるidentity復元は禁止する。

artifact-only recoveryはscientific outcomeを読まず、endpoint valueを保持せず、seed replayを行わない。

## scientific contract inheritance

新Studyで変更してよいのは次だけとする。

- Study / Stage IDs
- fresh seed namespaces
- predecessor Study 1 identity firewallの追加
- source serializerのcandidate-eligibility-first処理順序
- noncandidate sourceのopening-prefix `NOT-APPLICABLE` semantics
- 上記を検証するStage 0 fixture

次はStudy 1 frozen protocolから変更しない。

- C1/C6 endpoint definition
- historical frozen directions
- 2 source policies
- 2 root families
- 4 formal domains
- relative depth 5 / RAW-only representation
- Stage 1 target 8 compatible pairs/domain
- Stage 2 target 18 pairs/domain
- exact sign test
- fixed 8-slot Holm family / alpha=1/20
- decision labels
- resource ceilings
- production / independent separation
- no-rescue / no-rerun principles
- interpretation boundary

## authorization gates

Study 2を`AUTHORIZED-FOR-PREREG-AND-STAGE0`へ進めるには次をすべて満たす。

1. Study 1 technical-invalid closureがimmutableに存在する
2. Study 1 identity-only firewallがartifact-onlyでmaterializeされる
3. firewall manifestとlist digestが検証可能である
4. short-trajectory remediation contractがproduction / independent双方で実装可能である
5. Stage 0で0, 15, 16+ moves相当のsynthetic fixtureを検証できる
6. complete-pair sourceだけprefix mandatoryとなることをfixtureで検証できる
7. 新fresh seed namespaceがpre-accessでfreezeされ、旧G4-02 populationと重複しない
8. Study 2 authorizationがseed accessより前に別途発行される

現時点では2–8が未完了または進行中のため、fresh scientific seed accessは認可しない。

## 現在許可する作業

- immutable artifactからのidentity-only firewall recovery
- Study 2 protocol/specのdraft
- technical serializer実装
- synthetic Stage 0 fixture
- authorization review更新

禁止:

- 新fresh scientific seed read
- Study 1 seed replay
- Study 1 reserve利用
- Stage 2 access
- scientific effect generation
- main統合
- public AI変更
