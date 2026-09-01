# Public Bao AI Improvement Program 2 (`PBAI-P2`)

**正式題目:** Generation-2 Evidence-Informed Public Bao AI Improvement Program 2  
**日本語表記:** 第二世代研究の確定済み成果のみを用いたPublic Bao AI品質向上プログラム — Research Generation 2 evidenceからの新規engineering hypothesis構築、prospective candidate評価、独立validation、protected release holdoutによるAI-GEN3採用可否判定  
**開始日:** 2026-09-01  
**Status:** **ACTIVE / C006 CLOSED / C007 NON-ESTIMABLE-HOLD / C008 SUPPORT-PASS + DEVELOPMENT-CONTRACT-FROZEN / NO CANDIDATE IMPLEMENTATION YET**

## 1. Program identityと目的

`PBAI-P2`は、完了済みResearch Generation 2の科学的正本と明示された不確実性・失敗境界だけをscientific/evidence inputとして、public Bao AIに実質的な改善をもたらす新しいengineering mechanismが存在するかをprospectively評価する独立AI Engineering Programである。

`PBAI-P1`の再開、救済、延長ではない。PBAI-P1のResearch Generation 1 scientific evidenceを新candidateのscientific premiseとして再利用しない。

正常な最終結果は次の両方を含む。

```text
ADOPT one or more candidates
KEEP-AI-GEN2
```

## 2. immutable scientific evidence cutoff

```text
G2 scientific evidence cutoff
= cd200b85c1eb24aa4419bd5a9573552f3682f00d

cutoff commit
= Record Research Generation 2 main integration checkpoint

immediate child
= c5e33524c32b9ce9994760bababa08a85b6570d8
= Add Research Generation 3 program plan
```

`cd200b85...`をResearch Generation 2-only / Research Generation 3-start boundaryとしてfreezeする。

## 3. Research Generation 3 hard firewall

```text
Research Generation 3 influence on PBAI-P2 = ZERO
```

Research Generation 3のscientific evidence、development observation、formal/diagnostic result、hypothesis、measurement、candidate mechanism、documentation-derived ideaをcandidate設計、selection、threshold、validation、interpretation、release decisionに使用しない。

current `main`はrepository operational stateとintegration baseの確認にのみ使用する。

Canonical firewall: [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md)

## 4. current repository stateとpublic lineage

Program開始時のremote `main`:

```text
2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972
```

C008 development contract freeze:

```text
fe962416a5d76fe8ab5d47def384dd386acc222d
```

current public lineage:

```text
AI-GEN2
```

`AI-GEN3`はformal `ADOPT`とactual public-default deploymentの双方が成立するまで使用しない。

## 5. PBAI-P2 Stage構成

| Stage ID | 役割 |
| --- | --- |
| `PBAI-P2-A` | Research Generation 2 evidence audit / tier classification / Research Generation 3 exclusion freeze |
| `PBAI-P2-B` | current public AI read-only audit / exact `AI-GEN2` baseline re-freeze |
| `PBAI-P2-C` | global correctness・decision-quality・performance・regression gates、fresh split、candidate inventoryのpre-outcome freeze |
| `PBAI-P2-D` | candidate-specific predevelopment support、exact candidate contract、development authorization |
| `PBAI-P2-E` | isolated development / development-only evaluation |
| `PBAI-P2-F` | fresh independent validation、candidate source/config hash freeze、holdout authorization gate |
| `PBAI-P2-G` | protected release holdout、final correctness / operational gate、`ADOPT` / `REJECT` / `HOLD` decision |
| `PBAI-P2-H` | actual public-default deployment、release register、必要条件成立時のみ`AI-GEN3` promotion |

## 6. frozen baseline / gates

```text
baselineId = AI-GEN2-BASELINE-2026-09-01-v1
globalGateSpecId = PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1
```

Program開始時のminimum AI baseline filesとpublic execution binding filesはPBAI-P1 baseline source `f4ae3b11901180cbe417b3e643e2b357d8045d2d`とGit blob identityが一致した。

詳細:

- [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
- [`baselines/AI-GEN2-BASELINE-2026-09-01-v1.json`](baselines/AI-GEN2-BASELINE-2026-09-01-v1.json)
- [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
- [`benchmark/PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1.json`](benchmark/PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1.json)

## 7. candidate namespaceとinitial inventory

```text
PBAI-C006-v1 = strict RAW-safe search/cache identity
PBAI-C007-v1 = depth-preserving same-key TT replacement
PBAI-C008-v1 = root-best-flip-triggered two-move confirmation re-search
PBAI-C009-v1 = exact single-reply forcing extension
```

PBAI-P1 candidateのsame-mechanism rescueは行わない。

Canonical inventory: [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md)

## 8. completed predevelopment support

### 8.1 `PBAI-C006-v1`

```text
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT
implementation = NOT AUTHORIZED
```

Frozen support universeで全指定collision categoryが0だった。

### 8.2 `PBAI-C007-v1`

```text
same-key TT store events = 16512
shallower-over-deeper overwrite events = 0
roots with such event = 0
PBAI-C007-v1 = NON-ESTIMABLE-HOLD
implementation = NOT AUTHORIZED
```

事前support floor `32 events / 16 roots`未達。

### 8.3 `PBAI-C008-v1`

Candidate codeを使わないfrozen baseline D2/D3 root-best flip support:

```text
workflow run = 33492849852
job = 99808142315
artifact = 9794730237
artifact ZIP SHA-256 = 4a56952f7bdf034f472661314d9de29a824a6342a63df1230969dbbfd6f2c6a3
deterministic core SHA-256 = 9010ffa1fbdfa33e854d1fafe3c652e2017a6b46f0902c7fe25de69e0b2411c9
source seeds = 1024
trajectory roots available = 870
eligible roots = 233
minimum eligible roots = 64
technical failures = 0
independent core equality = true
```

Decision:

```text
PBAI-C008-v1 predevelopment = SUPPORT-PASS
```

Support PASSはcandidateの棋力・decision quality benefitを意味しない。

## 9. C008 frozen development contract

Machine-readable正本:

- [`candidates/PBAI-C008-v1.json`](candidates/PBAI-C008-v1.json)

Exact mechanism:

```text
feature = pbaiC008RootFlipConfirmation
default = false
affected public source = public/ai.js only
trigger = final nominal completed depth d>=3 AND best(d-1) != best(d)
confirmation candidates = exactly previous-depth best + final nominal-depth best
confirmation = full-window d+1 under existing deadline
both candidates must complete; otherwise nominal move retained
no extra wall-clock budget
no evaluator/quiescence/move-ordering/TT-key/TT-store/rule-engine/Worker change
```

Development intended-benefit gates:

```text
D4 TopSet agreement delta >= +0.05
mean normalized rank-loss delta <= -0.02
severe-loss-rate excess <= 0
catastrophic new loss = 0
median fixed-depth node ratio <= 1.60
p95 fixed-depth node ratio <= 2.50
```

Development source is `42400001..42400512`; minimum eligible roots is `64`。Validation `425xxxxx` / release holdout `426xxxxx`は未承認。

## 10. current authorization boundary

```text
PBAI-P2-A = COMPLETE
PBAI-P2-B = COMPLETE
PBAI-P2-C = COMPLETE / PRE-OUTCOME FREEZE
PBAI-P2-D = C008 SUPPORT-PASS + DEVELOPMENT-CONTRACT-FROZEN
PBAI-P2-E = C008 DEVELOPMENT AUTHORIZED / NOT YET EXECUTED
candidate implementations = 0
predevelopment support outcomes = 3
candidate development outcomes = 0
validation executions = 0
protected release holdout executions = 0
public deployment changes = 0
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

次に許可されるのは、C008 exact contractに従うfeature-gated/default-off implementationと、その直後のfeature-off exact baseline equivalenceである。Development benefit executionはequivalence PASS後のみ許可する。
