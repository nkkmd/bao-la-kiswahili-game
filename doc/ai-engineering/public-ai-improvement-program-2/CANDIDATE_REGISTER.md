# PBAI-P2 Candidate Register

Status: **INITIAL INVENTORY FROZEN / C006-C007 CLOSED / C008 SUPPORT-PASS + DEVELOPMENT-CONTRACT-FROZEN**  
Program: `PBAI-P2`  
Baseline: `AI-GEN2-BASELINE-2026-09-01-v1`  
Global gates: `PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1`  
Scientific evidence cutoff: `cd200b85c1eb24aa4419bd5a9573552f3682f00d`

## 1. namespace / no-rescue rule

Repository-wide candidate namespace `PBAI-Cxxx`を継続する。

PBAI-P1で`PBAI-C001`〜`PBAI-C005`はclosedであり、same-version、threshold変更、seed追加、subgroup追加、mechanism微修正による救済を行わない。

PBAI-P2 initial inventory:

```text
PBAI-C006-v1
PBAI-C007-v1
PBAI-C008-v1
PBAI-C009-v1
```

## 2. inventory summary

| ID | Mechanism | G2 basis | Current status | Key distinction |
| --- | --- | --- | --- | --- |
| `PBAI-C006-v1` | strict RAW-safe search/cache/Worker identity | Tier A: authoritative RAW identity | `WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED` | frozen support universeでactionable collision supportなし |
| `PBAI-C007-v1` | depth-preserving same-key TT replacement | Tier A: bounded exact transpositions | `NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION` | frozen supportでshallower-over-deeper overwrite 0 |
| `PBAI-C008-v1` | root-best-flip-triggered two-move confirmation re-search | Tier B: G2-02 bounded search-condition descriptors | `SUPPORT-PASS / DEVELOPMENT-CONTRACT-FROZEN / AUTHORIZED-FOR-DEVELOPMENT` | selective confirmation search; development benefit未測定 |
| `PBAI-C009-v1` | exact single-reply forcing extension | Tier B: reply-width concept only | `PROPOSED / NOT AUTHORIZED` | exact legal-reply-count trigger; G2-07 invalid modelは不使用 |

Current authorization:

```text
C006 implementation = false
C007 implementation = false
C008 implementation = authorized after frozen contract / not yet materialized
C009 implementation = false
validation authorized = false
release holdout authorized = false
public deployment authorized = false
```

---

# PBAI-C006-v1 — Strict RAW-safe search/cache identity

## Evidence basis

Tier A direct constraint:

```text
G2 authoritative RAW identity
= pits,reserve,houseOwned,player,phase,winner,pending

current AI.stateKey
= pits,player,phase,reserve,houseOwned,winner
```

field mismatchだけでcurrent public correctness bugやpractical collisionを断定しない。

## Canonical support result

Canonical run `33485530125`。production / independent deterministic core exact一致。

```text
semantic unique RAW states = 389148
semanticCollisionWitnesses = 0
naturalReachableCollisionWitnesses = 0
workerStaleIdentityWitnesses = 0
localEvaluationCacheCollisionEvents = 0
localTranspositionCollisionEvents = 0
practicalWitnessCount = 0
```

Decision:

```text
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT
candidate implementation = NOT AUTHORIZED
```

この結果は`pending`をauthoritative RAW identityから除外できることや、全Bao到達状態でcollisionが存在しないことを意味しない。

---

# PBAI-C007-v1 — Depth-preserving same-key TT replacement

## Evidence basis

Tier A。G2-05 bounded depth-9 RAW graphではexact transpositionが観測された。これはbounded domain内でTT reuse opportunityを検討する根拠だが、Bao全体のtransposition rateやspeedupを意味しない。

## Frozen support / result

```text
source seeds = 43100001..43101024
target roots = 256
PASS floor = incoming shallower-over-deeper events >=32 AND roots >=16
```

Canonical run `33486314298`:

```text
selected roots = 256 (Namua 128 / Mtaji 128)
sameKeyStoreEvents = 16512
incomingShallowerThanExistingEvents = 0
rootsWithIncomingShallowerEvent = 0
laterPotentialDepthBenefitHits = 0
baselineEquivalenceMismatches = 0
```

Decision:

```text
PBAI-C007-v1 = NON-ESTIMABLE-HOLD
candidate implementation = NOT AUTHORIZED
```

同じC007-v1へ結果後にseed、depth、search profile、thresholdを追加して救済しない。

---

# PBAI-C008-v1 — Root-best-flip-triggered confirmation re-search

## Evidence basis

Tier B only。

`SRDR-STUDY1 = INCONCLUSIVE`でprimary formal criterionは`null`。G2-02の事前指定secondary descriptorsに存在するbounded search-condition disagreementをengineering hypothesis形成にのみ使用する。

**禁止:** higher-resource searchをtrue best moveとみなすこと、search instabilityが科学的にconfirmedされたと扱うこと、人間のdifficultyへ読み替えること。

## Canonical predevelopment support

Frozen contract:

```text
source seeds = 43200001..43201024
minimum eligible roots = 64
measurement = frozen baseline D2/D3 deterministic root-best flip
candidate code = prohibited
candidate benefit metrics = prohibited
validation / release holdout = prohibited
```

Canonical run:

```text
workflow run = 33492849852
job = 99808142315
artifact = 9794730237
artifact ZIP SHA-256 = 4a56952f7bdf034f472661314d9de29a824a6342a63df1230969dbbfd6f2c6a3
deterministic core SHA-256 = 9010ffa1fbdfa33e854d1fafe3c652e2017a6b46f0902c7fe25de69e0b2411c9
source seeds = 1024
trajectory roots available = 870
technical failures = 0
eligible roots = 233
eligible Namua = 177
eligible Mtaji = 56
selected eligible roots = 128
independent core equality = true
```

Decision:

```text
PBAI-C008-v1 predevelopment = SUPPORT-PASS
```

Support PASSはcandidate benefitを意味しない。development populationへ進むためのsupport sufficiencyだけを成立させる。

## Frozen exact development contract

Machine-readable正本:

```text
candidates/PBAI-C008-v1.json
contract freeze commit = fe962416a5d76fe8ab5d47def384dd386acc222d
```

Exact mechanism:

```text
feature = pbaiC008RootFlipConfirmation
default = false
affected public code = public/ai.js only
eligible = enhanced alpha-beta iterative deepening / hard or expert
trigger = final nominal completed depth d>=3 AND best(d-1) != best(d)
confirmation candidates = exactly previous-depth best and final nominal-depth best
confirmation depth = d+1 root plies
window = full window
same evaluator / same quiescence / same existing deadline
both candidates must complete
if incomplete or timeout = retain nominal completed-depth move
score tie = retain final nominal-depth move
no added time budget
no move-ordering change
no TT key/store-policy change
no rule-engine or Worker source change
```

Feature-off contract:

```text
feature false must reproduce frozen baseline
selected move key exact equality required
all pre-existing stats fields/values exact equality required
stats.pbaiC008 must be absent
exception/timeout behavior exact equality required
```

## Frozen development population / gate

Development source:

```text
42400001..42400512
runtime-eligible target maximum = 128
development minimum estimable = 64
support roots 432xxxxx are not reused as development outcomes
validation 425xxxxx = NOT AUTHORIZED
release holdout 426xxxxx = NOT AUTHORIZED
```

Intended-benefit conjunction:

```text
D4 TopSet agreement delta >= +0.05
mean normalized rank-loss delta <= -0.02
severe-loss-rate excess <= 0
catastrophic new loss = 0
median fixed-depth node ratio <= 1.60
p95 fixed-depth node ratio <= 2.50
```

Negative controls require trigger count 0 and exact feature-on/off equality on the frozen counter set。

## Current C008 authorization

```text
exact contract = FROZEN
implementation = AUTHORIZED
feature default = MUST REMAIN OFF
feature-off equivalence = REQUIRED BEFORE BENEFIT EXECUTION
development benefit execution = AUTHORIZED ONLY AFTER IMPLEMENTATION + EQUIVALENCE PASS
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
public deployment = NOT AUTHORIZED
AI-GEN3 promotion = NOT AUTHORIZED
```

Post-outcome trigger、confirmation semantics、population、thresholdのretuningは禁止する。

---

# PBAI-C009-v1 — Exact single-reply forcing extension

## Evidence basis

Tier B hypothesis-forming only。G2-07は`STAGE1-TECHNICAL-INVALID`であり、`F05_ALL`、`lambda=100`、production performance、reply-pressure modelを使用しない。

## Frozen initial family

```text
candidate feature = pbaiC009SingleReplyExtension
feature default = off
trigger = nonterminal opponent-to-move node with exact legal move count == 1 at nominal depth cutoff
extension = exactly +1 ply
maximum extensions per root-to-leaf path = 1
same evaluator / same quiescence / same wall-clock deadline
```

Predevelopment support:

```text
source seeds = 43300001..43301024
target eligible roots = 128
minimum eligible roots = 64
candidate code = prohibited
```

C009はC008のformal development dispositionが確定する前に実装しない。

---

## 3. inventory addition rule

PBAI-P2 initial inventory外のcandidate追加には、cutoff以前のG2 provenance、既存candidateとのmaterial distinction、outcome非依存の追加理由、full pre-outcome contract freeze、Research Generation 3 influence `ZERO`の再監査を必要とする。

## 4. current authorization state

```text
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED
PBAI-C007-v1 = NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
PBAI-C008-v1 = SUPPORT-PASS / DEVELOPMENT-CONTRACT-FROZEN / AUTHORIZED-FOR-DEVELOPMENT
PBAI-C009-v1 = PROPOSED / implementation not authorized
AUTHORIZED-FOR-DEVELOPMENT count = 1
candidate implementations materialized = 0
predevelopment support outcomes = 3
candidate development outcomes = 0
validation executions = 0
release holdout executions = 0
public deployments = 0
```
