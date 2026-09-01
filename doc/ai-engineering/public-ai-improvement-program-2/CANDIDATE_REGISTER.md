# PBAI-P2 Candidate Register

Status: **INITIAL INVENTORY FROZEN / C006-C007 PREDEVELOPMENT CLOSED / NO IMPLEMENTATION**  
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

Status vocabulary:

```text
PROPOSED
PREDEVELOPMENT-AUDIT
NON-ESTIMABLE
AUTHORIZED-FOR-DEVELOPMENT
DEVELOPMENT-ONLY
VALIDATION-READY
RELEASE-CANDIDATE
ADOPTED
REJECTED
HOLD
WITHDRAWN
TECHNICAL-INVALID
```

## 2. inventory summary

| ID | Mechanism | G2 basis | Current status | Key distinction |
| --- | --- | --- | --- | --- |
| `PBAI-C006-v1` | strict RAW-safe search/cache/Worker identity | Tier A: authoritative RAW identity | `WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED` | correctness identity mechanism; no actionable collision support in frozen universe |
| `PBAI-C007-v1` | depth-preserving same-key TT replacement | Tier A: bounded exact transpositions | `NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION` | TT store policy only; frozen support found 0 shallower-over-deeper overwrite events |
| `PBAI-C008-v1` | root-best-flip-triggered two-move confirmation re-search | Tier B: G2-02 bounded search-condition descriptors | `PROPOSED / PREDEVELOPMENT SUPPORT NEXT` | selective confirmation search; not legacy routing, root ordering, or dormant stableBestDepths toggle |
| `PBAI-C009-v1` | exact single-reply forcing extension | Tier B: reply-width concept only | `PROPOSED` | exact legal-reply-count trigger; no G2-07 model/weights/thresholds |

Current authorization:

```text
C006 implementation = false
C007 implementation = false
C008 implementation = false
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

pending included = false
```

Current baseline statically uses`AI.stateKey` in evaluation-cache identity、transposition identityのbase key、Worker/main stale-result position identity。

**Prohibited inference:** field mismatch alone does not prove a current public correctness bug or practical collision.

## Engineering hypothesis

Engine-valid states that differ only in authoritative `pending` semantics can alias under the baseline AI key. If such aliasing reaches an actual search/cache/Worker identity decision, a strict RAW key may prevent invalid reuse/stale acceptance without material performance regression.

## Frozen predevelopment support contract

```text
source seeds = 43000001..43002048
max game plies = 160
candidate code = prohibited during support measurement
```

Support PASSには最低限:

```text
engine-valid semantic collision witnesses >= 1
AND
(
  natural reachable collision witnesses >= 1
  OR search/cache operational witnesses >= 1
  OR Worker stale-identity witnesses >= 1
)
```

engine-valid witnessを構成できない場合は`WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT`とすることを結果前に固定した。

## Canonical support result

Canonical run `33485530125`、production / independent deterministic core exact一致。

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
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
```

この結果は`pending`をauthoritative RAW identityから除外できることや、全Bao到達状態でcollisionが存在しないことを意味しない。

---

# PBAI-C007-v1 — Depth-preserving same-key TT replacement

## Evidence basis

Tier A:

G2-05 bounded depth-9 RAW graphではexact transpositionが観測され、duplicate arrivalはdepth 4から出現した。これはbounded domain内でTT reuse opportunityを検討する直接根拠である。

**Prohibited inference:** Bao全体のtransposition rate、必然的speedup、whole-game graph structureを推論しない。

## Engineering hypothesis

同一TT keyへ複数回storeする際、既存のよりdeepなentryをshallower resultで上書きしないことが、semantic resultを変えずにcache usefulnessを維持し、search workを削減する可能性がある。

## Frozen mechanism family

```text
candidate feature = pbaiC007DepthPreservingTtStore
feature default = off
same-key store only
if existing.depth > incoming.depth => retain existing entry
otherwise => baseline store behavior
capacity = unchanged 50000
new-key capacity eviction = baseline unchanged
TT key = unchanged within this candidate
mate-score normalization = unchanged false
move ordering = unchanged
search budget = unchanged
evaluator = unchanged
```

C007はhistorical `normalizeTtMateScores` experimentの再評価ではない。PBAI-C004 root orderingの再評価でもない。

## Dependency gate

C006がpractical invalid identity reuseをformal engineering supportとして成立させた場合、unsafe baseline keyのままC007 implementationへ進まないというdependencyを結果前に固定した。

C006は`WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT`で閉じたため、このstop条件は発動しなかった。

## Frozen predevelopment support

```text
source seeds = 43100001..43101024
target roots = 256 / Namua-Mtaji balanced
candidate code = prohibited
measurement = baseline TT instrumentation only
```

PASS:

```text
incoming shallower than existing events >= 32
AND roots with >=1 such event >= 16
```

未達なら`NON-ESTIMABLE-HOLD`。

## Canonical support result

Canonical run `33486314298`、production / independent selected-root identityとmeasurement core exact一致。

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
validation = NOT AUTHORIZED
release holdout = NOT AUTHORIZED
```

同じC007-v1へ結果後にseed、depth、search profile、thresholdを追加して救済しない。0-event resultをfrozen support universe外へ一般化しない。

---

# PBAI-C008-v1 — Root-best-flip-triggered confirmation re-search

## Evidence basis

Tier B only:

`SRDR-STUDY1 = INCONCLUSIVE`でprimary formal criterionは`null`。事前指定secondary descriptorsではD2/D3等のsearch-conditionによるcanonical-best disagreementがbounded machine descriptorとして観測された。

**Prohibited inference:** G2-02がsearch instabilityをformal confirmationした、higher-resource searchがtrue best moveである、人間が難しい、とは扱わない。

## Engineering hypothesis

Nominal iterative-deepeningで直近2 depthのroot bestが入れ替わった場合に限り、その2手だけを次depthでfull-window確認することで、全root moveを無条件に追加探索するより小さい追加costでD4 engineering referenceへのagreementを改善できる可能性がある。

## Exact mechanism family

```text
candidate feature = pbaiC008RootFlipConfirmation
feature default = off
trigger = completed depth d>=3 AND bestMove(d-1) != bestMove(d)
confirmation candidates = exactly previous best + current best
confirmation depth = d+1
window = full window
same evaluator / same quiescence
public time-limited mode = existing deadline only; no added wall-clock budget
if both confirmation searches do not complete = return baseline nominal completed-depth move
no legacy routing
no TT-root-first ordering change
no stableBestDepths early-stop toggle
```

## Predevelopment support

```text
source seeds = 43200001..43201024
target eligible roots = 128
minimum eligible roots = 64
phase balance = Namua/Mtaji target
measurement = baseline D2/D3 root-best flip only
candidate code = prohibited
```

`<64`なら`NON-ESTIMABLE-HOLD`。

## Intended benefit

Frozen eligible development rootsで:

```text
D4 TopSet agreement delta >= +0.05
AND mean normalized rank-loss delta <= -0.02
AND severe-loss-rate excess <= 0
AND catastrophic new loss = 0
```

追加search costはglobal operational gateに加え、eligible fixed-depth rootsで:

```text
median node ratio <= 1.60
p95 node ratio <= 2.50
```

を要求する。

**Current state:** predevelopment supportのみが次に許可される。implementation、benefit benchmark、validation、release holdoutは未承認。

---

# PBAI-C009-v1 — Exact single-reply forcing extension

## Evidence basis

Tier B hypothesis-forming only:

G2-07は`STAGE1-TECHNICAL-INVALID`であり、selected model、`F05_ALL`、`lambda=100`、production performanceを使用しない。ただしreply-set widthというmachine-operational conceptから、新しいexact legal-reply-count mechanismを発想することは許可する。

**Prohibited inference:** reply pressure representation validated、人間に難しい/誤らせる、punishment model validated、とは扱わない。

## Engineering hypothesis

探索cutoff近傍でopponentにexactly one legal replyしかないbranchは、追加1 plyを探索してもbranch explosionを起こしにくく、forced continuationを静的評価前に解消することでdecision qualityを改善できる可能性がある。

## Exact mechanism family

```text
candidate feature = pbaiC009SingleReplyExtension
feature default = off
trigger = nonterminal opponent-to-move node with exact legal move count == 1 at nominal depth cutoff
extension = exactly +1 ply
maximum extensions per root-to-leaf path = 1
same evaluator / same quiescence
same wall-clock deadline
no reply-pressure score/model
no defense-maintaining fraction threshold
no opponent-policy model
```

## Predevelopment support

```text
source seeds = 43300001..43301024
target eligible roots = 128
minimum eligible roots = 64
candidate code = prohibited
measurement = baseline exact legal-reply topology only
```

`<64`なら`NON-ESTIMABLE-HOLD`。

## Intended benefit

Eligible development rootsで:

```text
D4 TopSet agreement delta >= +0.03
AND mean normalized rank-loss delta <= -0.01
AND severe-loss-rate excess <= 0
AND catastrophic new loss = 0
median fixed-depth node ratio <= 1.25
p95 fixed-depth node ratio <= 1.75
```

Global gatesも全て満たす必要がある。

---

## 3. inventory addition rule

PBAI-P2 initial inventory外のcandidate追加は自動禁止ではないが、結果を見て都合のよいmechanismを追加することを防ぐ。

追加には:

1. PBAI-P2 cutoff以前のResearch Generation 2 evidence provenance;
2. existing candidateとmaterially distinctなmechanism;
3. 追加理由が既存candidate outcomeに依存しないこと;
4. exact ID / support / mechanism / development / validation / holdout / gatesのpre-outcome freeze;
5. Research Generation 3 influence `ZERO`の再監査;

を必要とする。

## 4. current authorization state

```text
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED
PBAI-C007-v1 = NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
PBAI-C008-v1 = PREDEVELOPMENT SUPPORT NEXT / implementation not authorized
PBAI-C009-v1 = PROPOSED / implementation not authorized
AUTHORIZED-FOR-DEVELOPMENT count = 0
candidate implementations = 0
predevelopment support outcomes = 2
candidate development outcomes = 0
validation executions = 0
release holdout executions = 0
public deployments = 0
```
