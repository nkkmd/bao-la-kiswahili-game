# PBAI-C006-v1 Predevelopment Static Audit

Status: **STATIC AUDIT COMPLETE / DYNAMIC SUPPORT REQUIRED / IMPLEMENTATION NOT AUTHORIZED**  
Program: `PBAI-P2`  
Stage: `PBAI-P2-D` predevelopment  
Candidate: `PBAI-C006-v1`  
Audit date: 2026-09-01

## 1. Purpose

Candidate codeを作る前に、current frozen `AI-GEN2` baselineにおいてResearch Generation 2 authoritative RAW identityとpublic AI identity surfaceの差がどこへ伝播しているかをread-onlyで確認する。

この監査はcollision prevalence、decision defect、strength、performance outcomeを生成しない。

## 2. Source binding

```text
baseline = AI-GEN2-BASELINE-2026-09-01-v1
current main audited = 2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972
public/ai.js Git blob = 8d472be415fac17e47a8e5e667cea9672e7a9ef5
public/ai-worker.js Git blob = d774bf90abb26b3c0b780da75d9a070413bc3732
public/main.js Git blob = 133f5869633f6f54ed60d2fae7d371b218372a13
```

これらはPBAI-P1 exact baseline sourceとbyte-identicalであり、post-G2 / G3-derived public AI changeではない。

## 3. Identity comparison

Research Generation 2 authoritative RAW identity:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

Frozen public `AI.stateKey` static field set:

```text
pits
player
phase
reserve
houseOwned
winner
```

Static result:

```text
pending included in authoritative RAW identity = true
pending included in current AI.stateKey = false
field-set equality = false
```

この差だけでcurrent public AI defectを断定しない。

## 4. Public propagation surfaces

### 4.1 Evaluation cache

Hard / expert baselineではevaluation cacheが有効であり、cache identityはplayer prefix + `AI.stateKey(state)`を使用する。

したがって、authoritative RAW-distinct statesが同じ`AI.stateKey`へaliasするならevaluation cacheにもidentity aliasが伝播し得る。

Static auditで確定するのは**possibility surface**だけであり、engine-valid / reachable collisionやinvalid reuseは未測定である。

### 4.2 Transposition table

Default TT keyはmate-score normalization disabledのため:

```text
AI.stateKey(state) + "@" + ply
```

である。

`@ply`は異plyを分離するが、同plyで`pending`だけが異なるauthoritative RAW statesを分離しない。

Static auditでは、そのようなstate pairが実際のsame-search TT lifetime内に共存するかは未測定である。

### 4.3 Worker / main stale-result identity

Workerはrequest stateに対して`AI.stateKey`を`positionKey`として返し、main側はcurrent stateの`AI.stateKey`とrequest/result keyを比較してstale resultをrejectする。

したがって、strict RAW-distinct statesがbaseline `AI.stateKey`で同一なら、stale guardはその差を認識できない設計である。

ただし実際にpending-distinct state transitionがWorker request lifetime内に成立するかは未測定である。

## 5. What this audit does NOT establish

```text
actionable current correctness defect = NOT ESTABLISHED
engine-valid pending-distinct collision witness = NOT MEASURED
natural reachable collision = NOT MEASURED
same-search invalid TT reuse = NOT MEASURED
invalid evaluation-cache reuse = NOT MEASURED
Worker stale acceptance event = NOT MEASURED
decision/output change = NOT MEASURED
performance impact = NOT MEASURED
```

したがって:

```text
PBAI-C006-v1 implementation authorization = false
```

## 6. Frozen dynamic support question

次のbaseline-only support blockをcandidate codeなしで測定する。

```text
seeds = 43000001..43002048
max plies = 160
candidate code = 0
benefit benchmark = prohibited
```

prospectively frozen categories:

1. engine-valid semantic collision witness;
2. natural reachable collision witness;
3. same-search / evaluation-cache operational reuse witness;
4. Worker stale-identity witness。

PASS:

```text
semantic collision witnesses >= 1
AND practical witness >= 1
```

practical witnessはnatural reachable、search/cache operational、Worker stale-identityのいずれか1件以上。

Disposition:

```text
no engine-valid semantic witness
-> WITHDRAWN / NO-ACTIONABLE-IDENTITY-DEFECT

semantic witness >=1 but practical witness =0
-> NON-ESTIMABLE-PRACTICAL-SUPPORT / HOLD

semantic witness >=1 and practical witness >=1
-> SUPPORT-PASS
-> then and only then exact implementation contract may be frozen
```

## 7. Independence / evidence boundary

このcandidateはPBAI-P1 `PBAI-C003-v1` restricted exact-oracle lookupの再開ではない。P1 C003のstored-oracle mismatch、reachability未測定状態、seed block、tablebase mechanismを救済しない。

PBAI-C006のscientific premiseはResearch Generation 2 authoritative RAW identityのみであり、Research Generation 3のmeasurement、diagnostic、hypothesis、candidate mechanismは使用していない。

## 8. Static audit disposition

```text
static identity mismatch = CONFIRMED AS CODE FACT
practical correctness defect = NOT ESTABLISHED
next authorized action = baseline-only dynamic support measurement
candidate implementation = NOT AUTHORIZED
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
```
