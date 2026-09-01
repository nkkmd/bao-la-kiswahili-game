# PBAI-C006-v1 — predevelopment support closure

Date: 2026-09-01  
Program: `PBAI-P2`  
Stage: `PBAI-P2-D-PREDEVELOPMENT-SUPPORT`  
Candidate: `PBAI-C006-v1`  
Decision: **`WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT`**

## 1. 結果を見る前に固定していた判定規則

`PBAI-C006-v1`は、Research Generation 2で固定されたauthoritative RAW identityと現行`AI.stateKey`のfield差だけからpublic AIのbugを断定しないcandidateとして開始した。

candidate implementationより前に、baseline-onlyで次のsupport gateを固定していた。

```text
semantic collision witnesses >= 1
AND
practical witness >= 1
-> SUPPORT-PASS

semantic collision witnesses = 0
-> WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT
```

ここでpractical witnessはnatural reachable collision、同一bounded local search内のevaluation-cache key-domain collision、same-ply TT key-domain collision、同一自然trajectory内のWorker stale-identity collisionのいずれかである。

## 2. pre-outcome technical correction

最初のworkflow run `33485449584`は、測定開始前のseed-firewall静的検査で停止した。

原因は、seed literalを検出する正規表現がPRNG定数`4294967296`の数字列を誤って検出したことである。

このrunでは次の工程はすべて未実行だった。

```text
support materialization = NOT EXECUTED
independent recomputation = NOT EXECUTED
support outcome = NOT OBSERVED
```

したがって判定規則、population、seed block、measurement definitionを変更せず、数値境界を要求するようregexだけを修正した。これはoutcome観測前のtechnical correctionであり、結果後の救済ではない。

## 3. canonical support execution

修正後の最初のsuccessful support runをcanonical executionとする。

```text
workflow run = 33485530125
job = 99784603678
head SHA = 8df643d951f1789db0495853d274e79207a62bd5
artifact = 9791691699
artifact ZIP SHA256 = c10944e38b424faa96269d583667d11f07c3e36391296dcb3571a95d2a30ce37
production result SHA256 = 8b8529d0524ba946c2706f4dbe2161ffa57cdff8f60cab13b6c862ae66f59ee2
independent verification SHA256 = 4f076d2730f10e5f272701b3e5b4e2d24e52d6a4e63f69957a04986203bff9ef
deterministic core SHA256 = 021ca3e2bdf169a4856202b47e6b460f97ff59f8e63c6d2e1066accfcde0eff5
```

productionと独立実装はfull deterministic coreでexact一致した。

## 4. population

固定済みseed `43000001..43002048`の2,048 trajectoryをすべて処理した。

```text
completed trajectories = 2048
terminal trajectories = 2043
maximum observed ply = 160
natural state observations = 112995
natural unique RAW states = 98262
semantic successor observations = 439731
semantic unique RAW states = 389148
local search roots = 256 (Namua 128 / Mtaji 128)
local root digest = 5daccce0931bb2c57c745beb9b28b886331086c37c57d245ef14385e2cad359b
```

## 5. support result

全ての事前指定collision categoryが0だった。

```text
semanticCollisionWitnesses = 0
naturalReachableCollisionWitnesses = 0
workerStaleIdentityWitnesses = 0
localEvaluationCacheCollisionEvents = 0
localTranspositionCollisionEvents = 0
practicalWitnessCount = 0
```

独立実装は同じ0-count coreを再構成し、source hashも一致した。

## 6. 工学判断

事前固定したdecision mappingをそのまま適用する。

```text
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT
candidate implementation = NOT AUTHORIZED
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public AI change = 0
```

この判断は、現行`AI.stateKey`がauthoritative RAW identityとfield-levelで同一であるという意味ではない。`pending`が含まれないという静的差は残る。

一方、このcandidateの事前固定support universeでは、その差がengine-generated valid stateのkey collisionとして1件もmaterializeしなかったため、PBAI-C006-v1としてpublic AI変更を正当化する根拠は成立しなかった。

## 7. 解釈上の境界

次は主張しない。

- Baoの全到達状態でcollisionが永久に存在しないこと
- `pending`をauthoritative RAW identityから除外できること
- G2-05等のscientific identity contractを変更できること
- 研究用exact tablebaseに現行`AI.stateKey`を使用してよいこと

Engineering support failureはResearch Generation 2のformal boundaryを変更しない。

## 8. 次に許可される工程

`PBAI-C006-v1`がactionable practical identity defectを成立させなかったため、frozen inventory上の`PBAI-C007-v1` dependency blockは発動しない。

次に許可するのは、`PBAI-C007-v1`の**baseline-only predevelopment support measurement**である。

```text
candidate implementation = NOT AUTHORIZED
C007 support seeds = 43100001..43101024
protected validation / release holdout = NOT AUTHORIZED / NOT ACCESSED
Research Generation 3 influence = ZERO
```
