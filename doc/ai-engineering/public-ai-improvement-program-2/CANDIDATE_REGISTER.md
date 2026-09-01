# PBAI-P2 Candidate Register

Status: **INITIAL INVENTORY FROZEN / NO IMPLEMENTATION / NO OUTCOME**  
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

| ID | Mechanism | G2 basis | Initial status | Key distinction |
| --- | --- | --- | --- | --- |
| `PBAI-C006-v1` | strict RAW-safe search/cache/Worker identity | Tier A: authoritative RAW identity | `PREDEVELOPMENT-AUDIT` | correctness identity mechanism; not an exact-oracle lookup candidate and not P1 C003 rescue |
| `PBAI-C007-v1` | depth-preserving same-key TT replacement | Tier A: bounded exact transpositions | `PROPOSED / DEPENDENCY-GATED` | TT store policy only; not mate-score normalization, root ordering, or C004 rescue |
| `PBAI-C008-v1` | root-best-flip-triggered two-move confirmation re-search | Tier B: G2-02 bounded search-condition descriptors | `PROPOSED` | selective confirmation search; not legacy routing, root ordering, or dormant stableBestDepths toggle |
| `PBAI-C009-v1` | exact single-reply forcing extension | Tier B: reply-width concept only | `PROPOSED` | exact legal-reply-count trigger; no G2-07 model/weights/thresholds |

All four:

```text
implementation authorized now = false
validation authorized now = false
release holdout authorized now = false
public deployment authorized now = false
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

## Prospective exact mechanism family

Implementation authorizationが後で成立した場合のみ、feature-gated strict identityを追加する。

```text
candidate feature = pbaiC006StrictRawIdentity
feature default before adoption = off
strict identity fields = pits,reserve,houseOwned,player,phase,winner,pending
canonicalization / symmetry = none
rule engine changes = none
evaluator changes = none
search depth/time budget changes = none
move ordering changes = none
```

Backward-compatibleなlegacy `AI.stateKey` APIを無条件に置換するのではなく、TT / evaluation cache / Worker stale-result guardが同一のstrict identity contractを選択できる専用identity surfaceを作る。exact code surfaceはsupport PASS後の`PBAI-P2-D` contractでfreezeする。

## Baseline-only predevelopment support block

```text
source seeds = 43000001..43002048
max game plies = 160
selection = consequence-blind / RAW-key aware
candidate code = prohibited during support measurement
```

Support measurementは次を別々に記録する。

1. **semantic collision witness** — engine-valid distinct authoritative RAW states with identical baseline AI key;
2. **natural reachable collision witness** — frozen source trajectories内でdistinct RAW statesがbaseline keyへaliasするか;
3. **search/cache operational witness** — single search invocationまたはevaluation-cache useでdistinct RAW stateへのsame-key reuse opportunityが発生するか;
4. **Worker stale-identity witness** — strict RAW-distinct state pairをbaseline Worker position keyが区別できないか。

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

engine-valid witnessを構成できない場合は`NON-ESTIMABLE / HOLD`ではなくstatic premise自体が成立しないため`WITHDRAWN / NO-ACTIONABLE-IDENTITY-DEFECT`とする。semantic witnessは成立するがpractical surface witnessが0の場合は`NON-ESTIMABLE-PRACTICAL-SUPPORT / HOLD`とする。

Support PASS前にimplementation、decision-quality benefit metric、validationを実行しない。

## Intended benefit / gates

C006はcorrectness-first candidateであり、adoptionには次を要求する。

```text
invalid strict-RAW alias reuse demonstrated in baseline support surface >= 1
candidate invalid reuse on frozen regression/support fixtures = 0
feature-off exact baseline equivalence = PASS
feature-on legal move/state/terminal preservation = PASS
global decision-quality non-regression = PASS
global strength non-inferiority = PASS
global operational gate = PASS
```

「collisionを1件見つけた」だけでAI-GEN3へ昇格しない。

---

# PBAI-C007-v1 — Depth-preserving same-key TT replacement

## Evidence basis

Tier A:

G2-05 bounded depth-9 RAW graphではexact transpositionが観測され、duplicate arrivalはdepth 4から出現した。これはbounded domain内でTT reuse opportunityを検討する直接根拠である。

**Prohibited inference:** Bao全体のtransposition rate、必然的speedup、whole-game graph structureを推論しない。

## Engineering hypothesis

同一TT keyへ複数回storeする際、既存のよりdeepなentryをshallower resultで上書きしないことが、semantic resultを変えずにcache usefulnessを維持し、search workを削減する可能性がある。

## Exact mechanism family

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

C006がpractical invalid identity reuseをformal engineering supportとして成立させた場合、unsafe baseline keyのままC007 implementationへ進まない。

```text
C006 actionable practical identity defect established
-> C007-v1 development NOT-AUTHORIZED
-> strict identityを組み込む場合はcombined/new candidate identityが必要
```

C006がpractical support非成立でHOLD/WITHDRAWNとなった場合も、C007は既知のidentity boundaryを明記したまま独立support gateを通す。

## Predevelopment support

```text
source seeds = 43100001..43101024
target roots = 256 / Namua-Mtaji balanced target
candidate code = prohibited
measurement = baseline TT instrumentation only
```

Count:

- same-key TT stores;
- incoming shallower than existing stores;
- overwritten deeper-entry events;
- later hits that would have benefited from retained depth。

PASS:

```text
overwritten deeper-entry events >= 32
AND roots with >=1 such event >= 16
```

未達なら`NON-ESTIMABLE / HOLD`。

## Intended benefit

Development target rootsで:

```text
median nodes(candidate/baseline) <= 0.95
fraction roots nodes(candidate) <= nodes(baseline) >= 0.60
selected move mismatch versus baseline D3 caused solely by candidate = allowed only if global D4 quality gates pass
catastrophic new loss = 0
```

Global gates remain conjunctive。

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

`<64`なら`NON-ESTIMABLE / HOLD`。

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

`<64`なら`NON-ESTIMABLE / HOLD`。

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
3.追加理由が既存candidate outcomeに依存しないこと;
4. exact ID / support / mechanism / development / validation / holdout / gatesのpre-outcome freeze;
5. Research Generation 3 influence `ZERO`の再監査;

を必要とする。

## 4. frozen authorization state

```text
PBAI-C006-v1 = PREDEVELOPMENT-AUDIT / implementation not authorized
PBAI-C007-v1 = PROPOSED / dependency-gated / implementation not authorized
PBAI-C008-v1 = PROPOSED / implementation not authorized
PBAI-C009-v1 = PROPOSED / implementation not authorized
AUTHORIZED-FOR-DEVELOPMENT count = 0
candidate implementations = 0
candidate benchmark outcomes = 0
validation executions = 0
release holdout executions = 0
```
