# PBAI-C007-v1 — predevelopment support closure

Date: 2026-09-01  
Program: `PBAI-P2`  
Stage: `PBAI-P2-D-PREDEVELOPMENT-SUPPORT`  
Candidate: `PBAI-C007-v1`  
Decision: **`NON-ESTIMABLE-HOLD`**

## 1. 結果を見る前に固定していた判定規則

`PBAI-C007-v1`は、Research Generation 2のbounded exact RAW graphでtranspositionが直接観測されたことをTier Aの発想根拠としつつ、current public AIで「よりdeepなTT entryがshallower entryで上書きされる」こと自体は事前に仮定しないcandidateとして開始した。

candidate implementationより前に、baseline-onlyで次のsupport gateを固定した。

```text
incoming shallower than existing TT-entry events >= 32
AND
roots with >=1 such event >= 16
-> SUPPORT-PASS

otherwise
-> NON-ESTIMABLE-HOLD
```

baseline behavior、TT key、entry、capacity、search budgetは変更せず、store operationを観測するだけとした。

## 2. C006 dependency

先行`PBAI-C006-v1`は`WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT`で閉じられた。

したがって、C007-v1の事前固定dependency rule上、unsafe baseline identityを理由とする実行禁止条件は発動しなかった。ただしC006の結果をC007 mechanismやthresholdの変更には使用していない。

## 3. canonical support execution

最初のsuccessful support runをcanonical executionとする。

```text
workflow run = 33486314298
job = 99787096250
head SHA = e8c045cc011c89c5a9494e8d741b830dc95470f6
artifact = 9792321617
artifact ZIP SHA256 = 93563438bbf1d1633b536733e2b1828d97ac7e5f988d4032602822d97876c991
production result SHA256 = d10c09096a36ed7f221faee66935c3575648e6752ff62b0d04eb061de6a92f10
independent verification SHA256 = 83c878ffe90526639687938a1635cff4df5683695aa7f5e62c1d0f40a682c19a
deterministic core SHA256 = ca7c037646a9d8a9a01189287b64a0b3a2c9e294cf8e8e74325963affa41b7b6
```

productionと独立実装はselected-root identityとmeasurement coreでexact一致した。

## 4. population

固定済みseed `43100001..43101024`の1,024 trajectoryから、結果・評価値・candidate outcomeを見ずにphase-balanced rootを選択した。

```text
trajectory candidates: Namua = 512 / Mtaji = 359
selected roots = 256
selected Namua = 128
selected Mtaji = 128
root digest = 037023bb43029a71ffe805bc7ceed4d990c2445aa3c789dec006ad6066f3b303
```

baseline searchはfrozen hard/enhanced/bao profile、fixed depth 5、quiescence depth 1、TT capacity 50,000、`normalizeTtMateScores=false`である。

## 5. support result

TTへのsame-key store自体は多数観測されたが、candidate premiseとなるshallower-over-deeper overwriteは1件も観測されなかった。

```text
sameKeyStoreEvents = 16512
incomingShallowerThanExistingEvents = 0
rootsWithIncomingShallowerEvent = 0
laterPotentialDepthBenefitHits = 0
baselineEquivalenceMismatches = 0
```

観測用instrumentとunmodified baseline AIは、事前指定したmove、completed depth、root score、node/cache/evaluation統計で不一致0だった。

独立verifierはproduction runnerおよびproduction instrumented AI instanceを再利用せず、同じroot setとmeasurement coreを再構成した。

## 6. 工学判断

事前固定したdecision mappingをそのまま適用する。

```text
PBAI-C007-v1 = NON-ESTIMABLE-HOLD
candidate implementation = NOT AUTHORIZED
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public AI change = 0
```

support floor `32 events / 16 roots`に対して実測は`0 / 0`であり、depth-preserving replacementを実装してdevelopment benchmarkへ進める実用supportが形成されなかった。

## 7. 解釈上の境界

次は主張しない。

- current public AIでshallower-over-deeper overwriteが全探索条件で絶対に発生しないこと
- Bao全体のtransposition structureが薄いこと
- deeper-entry retentionが一般に無価値であること
- G2-05のbounded exact transposition resultが否定されたこと

今回の0-event resultは、frozen C007 support universeとfrozen baseline search profileに限定される。

同じC007-v1へ結果後にseed、depth、search profile、thresholdを追加して救済しない。別条件を将来検討する場合は、PBAI-P2 inventory addition ruleを満たす新しいcandidate/versionとしてprospectively扱う。

## 8. 次に許可される工程

`PBAI-C007-v1` implementationには進まない。

initial inventoryで結果前に固定済みの次candidate、`PBAI-C008-v1`について、**baseline-only predevelopment support measurement**だけを次に許可する。

```text
C008 support seeds = 43200001..43201024
candidate code = prohibited
validation / release holdout = NOT AUTHORIZED / NOT ACCESSED
Research Generation 3 influence = ZERO
```
