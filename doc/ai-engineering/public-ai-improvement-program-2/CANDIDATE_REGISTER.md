# PBAI-P2 Candidate Register

Status: **FINAL / INITIAL INVENTORY EXHAUSTED / KEEP-AI-GEN2**  
Program: `PBAI-P2`  
Baseline: `AI-GEN2-BASELINE-2026-09-01-v1`  
Global gates: `PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1`  
Scientific evidence cutoff: `cd200b85c1eb24aa4419bd5a9573552f3682f00d`

## 1. Namespace / no-rescue rule

Repository-wide candidate namespace `PBAI-Cxxx`を継続する。PBAI-P1の`PBAI-C001`〜`PBAI-C005`はclosedのまま再利用しない。

PBAI-P2 initial inventory:

```text
PBAI-C006-v1
PBAI-C007-v1
PBAI-C008-v1
PBAI-C009-v1
```

Candidate outcome確認後にsame-version、threshold変更、seed追加、subgroup追加、negative-control再定義、mechanism微修正で救済しない。

## 2. Final inventory summary

| ID | Mechanism | G2 basis | Final status | Validation |
| --- | --- | --- | --- | --- |
| `PBAI-C006-v1` | strict RAW-safe search/cache/Worker identity | Tier A authoritative RAW identity | `WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED` | NOT AUTHORIZED |
| `PBAI-C007-v1` | depth-preserving same-key TT replacement | Tier A bounded exact transpositions | `NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION` | NOT AUTHORIZED |
| `PBAI-C008-v1` | root-best-flip-triggered two-move confirmation re-search | Tier B G2-02 bounded secondary descriptors | `DEVELOPMENT-BENEFIT-FAIL-HOLD / CLOSED` | NOT AUTHORIZED |
| `PBAI-C009-v1` | exact single-reply forcing extension | Tier B reply-width concept only | `TECHNICAL-INVALID-REJECT-OR-HOLD / CLOSED` | NOT AUTHORIZED |

Final authorization:

```text
AUTHORIZED-FOR-DEVELOPMENT = 0
validation authorized = false
release holdout authorized = false
public deployment authorized = false
AI-GEN3 promotion authorized = false
```

---

# PBAI-C006-v1 — Strict RAW-safe search/cache identity

## Evidence basis

```text
G2 authoritative RAW identity
= pits,reserve,houseOwned,player,phase,winner,pending

AI.stateKey at frozen baseline
= pits,player,phase,reserve,houseOwned,winner
```

Field mismatchだけでcurrent public correctness bugを断定せず、candidate code前にbaseline-only supportを要求した。

## Canonical support result

Canonical run `33485530125`:

```text
semantic unique RAW states = 389148
semanticCollisionWitnesses = 0
naturalReachableCollisionWitnesses = 0
workerStaleIdentityWitnesses = 0
localEvaluationCacheCollisionEvents = 0
localTranspositionCollisionEvents = 0
practicalWitnessCount = 0
```

```text
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT
implementation = NOT AUTHORIZED
```

この結果はauthoritative RAW identityの変更や、全Bao到達状態でのcollision不存在を意味しない。

---

# PBAI-C007-v1 — Depth-preserving same-key TT replacement

G2-05のbounded exact RAW graphでtranspositionが観測されたことだけをTier A engineering premiseとした。

Frozen support:

```text
source seeds = 43100001..43101024
selected roots = 256
PASS floor = shallower-over-deeper overwrite events >= 32 AND roots >= 16
```

Canonical run `33486314298`:

```text
sameKeyStoreEvents = 16512
incomingShallowerThanExistingEvents = 0
rootsWithIncomingShallowerEvent = 0
laterPotentialDepthBenefitHits = 0
baselineEquivalenceMismatches = 0
```

```text
PBAI-C007-v1 = NON-ESTIMABLE-HOLD
implementation = NOT AUTHORIZED
```

Support floor未達後にdepth、seed、profile、thresholdを追加して救済しない。

---

# PBAI-C008-v1 — Root-best-flip-triggered confirmation re-search

## Evidence basis

G2-02 `SRDR-STUDY1 = INCONCLUSIVE`を変更せず、事前指定secondary descriptorsに存在したbounded search-condition disagreementをTier B hypothesis形成にだけ使用した。Higher-resource searchをtrue best moveとは扱わない。

## Predevelopment support

Canonical run `33492849852`:

```text
source seeds = 1024
trajectory roots available = 870
eligible roots = 233
selected eligible roots = 128
technical failures = 0
deterministic core SHA-256 = 9010ffa1fbdfa33e854d1fafe3c652e2017a6b46f0902c7fe25de69e0b2411c9
```

```text
predevelopment = SUPPORT-PASS
```

## Frozen mechanism

```text
feature = pbaiC008RootFlipConfirmation
default = false
trigger = final nominal completed depth d>=3 AND best(d-1) != best(d)
confirmation candidates = exactly previous-depth best + final nominal-depth best
confirmation = full-window d+1 under existing deadline
both candidates must complete; otherwise nominal move retained
no extra wall-clock budget
no evaluator/quiescence/move-ordering/TT-key/TT-store/rule-engine/Worker change
```

## Development result

Canonical result: [`candidates/PBAI-C008-v1-development-result.json`](candidates/PBAI-C008-v1-development-result.json)

```text
eligible roots = 71
TopSet agreement delta = +0.2957746478873239             PASS
mean normalized rank-loss delta = -0.19413145539906107    PASS
severe-loss-rate excess = -0.09859154929577464           PASS
catastrophic new loss = 0                                PASS
median node ratio = 2.1004464285714284                   FAIL <= 1.60
p95 node ratio = 3.079245283018868                       FAIL <= 2.50
negative-control failures = 0                            PASS
technical failures = 0                                   PASS
```

```text
PBAI-C008-v1 = DEVELOPMENT-BENEFIT-FAIL-HOLD / CLOSED
validation contract freeze = NOT AUTHORIZED
```

Quality/safety signalがpositiveでもfrozen cost gateを結果後に緩和しない。

---

# PBAI-C009-v1 — Exact single-reply forcing extension

## Evidence basis

Tier B hypothesis-forming only。G2-07は`STAGE1-TECHNICAL-INVALID`であり、そのinvalid model、`F05_ALL`、`lambda=100`、production-only performanceを使用しない。

## Predevelopment support

Canonical run `33500775677`:

```text
source seeds = 1024
trajectory roots available = 864
eligible roots = 639
selected eligible roots = 128
single-reply cutoff occurrences = 2201
unique single-reply cutoff states = 1878
technical failures = 0
baseline equivalence mismatches = 0
```

```text
predevelopment = SUPPORT-PASS
```

## Frozen mechanism

```text
feature = pbaiC009SingleReplyExtension
default = false
trigger = nonterminal opponent-to-root-player node at nominal depth cutoff with exact legal move count == 1
extension = exactly +1 ply
maximum extensions per observed path = 1
same evaluator / quiescence / existing deadline
```

## Feature-off equivalence

Canonical run `33503615979`:

```text
selected roots = 32
conditions per root = 8
comparisons = 256
comparison mismatches = 0
candidate diagnostic presence = 0
disposition = FEATURE-OFF-EQUIVALENCE-PASS
deterministic core SHA-256 = c16c1a3a81a0c265d7f01f67da1b1106d098c421a3b313f221729f5b43cc462d
```

## Development result

Canonical result: [`candidates/PBAI-C009-v1-development-result.json`](candidates/PBAI-C009-v1-development-result.json)

```text
selected eligible roots = 128
negative controls = 64
TopSet agreement delta = +0.015625                       FAIL >= +0.03
mean normalized rank-loss delta = +0.003924851190476197  FAIL <= -0.01
severe-loss-rate excess = -0.015625                      PASS
catastrophic new loss = 0                                PASS
median node ratio = 1.0140845070422535                   PASS
p95 node ratio = 1.3620689655172413                      PASS
runtime trigger failures = 0                             PASS
max-extension-path failures = 0                          PASS
negative-control failures = 18                           FAIL = 0
technical failures = 0                                   PASS
```

Production / independent verifierはstrict RAW population、eligibility、D4 reference、row-level metrics、aggregate decision、deterministic coreまでexact一致した。

Frozen decision mappingに従い:

```text
PBAI-C009-v1 = TECHNICAL-INVALID-REJECT-OR-HOLD / CLOSED
validation contract freeze = NOT AUTHORIZED
```

Primary benefit gateも独立に未達であり、negative-controlだけを再設計してsame-version救済することも認めない。

---

## 3. Initial inventory addition rule / closure interpretation

PBAI-P2 initial inventory外candidate追加には、cutoff以前のG2 provenance、既存candidateとのmaterial distinction、outcome非依存の追加理由、full pre-outcome contract freeze、Research Generation 3 influence `ZERO`の再監査が必要だった。

Initial inventoryの全結果を確認した後に新candidateを発明するためのoutcome-independent追加理由はfreezeされていないため、PBAI-P2をC010等で延長しない。

## 4. Final state

```text
PBAI-C006-v1 = CLOSED
PBAI-C007-v1 = CLOSED
PBAI-C008-v1 = CLOSED
PBAI-C009-v1 = CLOSED
initial inventory remaining = 0
validation executions = 0
release holdout executions = 0
public deployments = 0
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
```
