# PBAI-P2 — 現在の状態

更新日: 2026-09-01  
Program: `PBAI-P2`  
正式題目: `Generation-2 Evidence-Informed Public Bao AI Improvement Program 2`

## 1. 現在の正式状態

```text
Program = ACTIVE
PBAI-P2-A = COMPLETE
PBAI-P2-B = COMPLETE
PBAI-P2-C = COMPLETE / PRE-OUTCOME FREEZE
PBAI-P2-D = C006 CLOSED / C007 CLOSED-HOLD / C008 SUPPORT-PASS + DEVELOPMENT-CONTRACT-FROZEN
PBAI-P2-E = C008 DEVELOPMENT AUTHORIZED / NOT YET EXECUTED
candidate implementations = 0
candidate predevelopment support outcomes = 3
candidate development outcomes = 0
validation executions = 0
release holdout executions = 0
public deployments = 0
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

## 2. repository state

Program開始時のremote `main`:

```text
2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972
```

Program initialization / predevelopment branch:

```text
engineering/pbai-p2-program-initialization
```

C008 development contract freeze commit:

```text
fe962416a5d76fe8ab5d47def384dd386acc222d
```

Scientific evidence cutoff:

```text
cd200b85c1eb24aa4419bd5a9573552f3682f00d
```

cutoffはG2 main integration checkpointであり、immediate childがResearch Generation 3 program-plan commitであることを確認済みである。

## 3. evidence firewall

```text
Research Generation 2 scientific evidence <= cd200b85... = INCLUDED
Research Generation 1 scientific evidence as P2 candidate premise = EXCLUDED
Research Generation 3 influence = ZERO
```

G3のscientific content、measurement、diagnostic、hypothesis、candidate mechanismはPBAI-P2のdecisionへ使用しない。

## 4. baseline / global gates

```text
baselineId = AI-GEN2-BASELINE-2026-09-01-v1
gateSpecId = PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1
```

current public AIの8 bound assetsはPBAI-P1 exact baseline source `f4ae3b11901180cbe417b3e643e2b357d8045d2d`とGit blob identityが一致している。

Fresh split:

- strength: `421xxxxx` development / `422xxxxx` validation / `423xxxxx` holdout;
- decision roots: `424xxxxx` / `425xxxxx` / `426xxxxx`;
- operational roots: `427xxxxx` / `428xxxxx` / `429xxxxx`;
- candidate-specific baseline-only support: `430xxxxx`以降。

validation / release holdoutは未開封であり、現時点では実行未承認。

## 5. candidate inventory / current disposition

```text
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED
PBAI-C007-v1 = NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
PBAI-C008-v1 = SUPPORT-PASS / DEVELOPMENT-CONTRACT-FROZEN / AUTHORIZED-FOR-DEVELOPMENT
PBAI-C009-v1 = PROPOSED / NOT AUTHORIZED
```

```text
AUTHORIZED-FOR-DEVELOPMENT count = 1
candidate implementations currently materialized = 0
```

## 6. C006 closure

Frozen support block:

```text
seeds = 43000001..43002048
semantic unique RAW states = 389148
semantic collision witnesses = 0
natural reachable collision witnesses = 0
Worker stale-identity witnesses = 0
local evaluation-cache collision events = 0
local TT collision events = 0
```

Decision:

```text
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT
implementation = NOT AUTHORIZED
```

`AI.stateKey`とauthoritative RAW identityのfield-level差は残るが、frozen support universeではactionable collision defectがmaterializeしなかった。

## 7. C007 closure

Frozen support block:

```text
seeds = 43100001..43101024
selected roots = 256 (Namua 128 / Mtaji 128)
same-key TT store events = 16512
incoming shallower than existing deeper entry events = 0
roots with such event = 0
later potential depth-benefit hits = 0
baseline equivalence mismatches = 0
```

事前support floor `32 events / 16 roots`に対して`0 / 0`だったため:

```text
PBAI-C007-v1 = NON-ESTIMABLE-HOLD
implementation = NOT AUTHORIZED
```

同じC007-v1へ結果後にseed、depth、search profile、thresholdを追加して救済しない。

## 8. C008 canonical predevelopment support

Frozen support contract:

```text
support seeds = 43200001..43201024
minimum eligible roots = 64
candidate code = prohibited
benefit metrics = prohibited
validation / release holdout = prohibited
```

Canonical run:

```text
workflow run = 33492849852
job = 99808142315
artifact = 9794730237
artifact ZIP SHA-256 = 4a56952f7bdf034f472661314d9de29a824a6342a63df1230969dbbfd6f2c6a3
deterministic core SHA-256 = 9010ffa1fbdfa33e854d1fafe3c652e2017a6b46f0902c7fe25de69e0b2411c9
```

Observed support:

```text
source seeds = 1024
trajectory roots available = 870
technical failures = 0
root-best-flip eligible roots = 233
  Namua = 177
  Mtaji = 56
selected eligible roots = 128
production / independent deterministic core equality = true
```

Decision:

```text
PBAI-C008-v1 predevelopment = SUPPORT-PASS
```

これはC008のdecision-quality improvementを示す結果ではない。baseline D2/D3 root-best flip signalがdevelopment評価に必要な最低supportを満たしたことだけを意味する。

## 9. C008 exact development contract

Candidate source変更前に、commit `fe962416...`で次をfreezeした。

```text
candidate feature = pbaiC008RootFlipConfirmation
default = false
affected public source = public/ai.js only
eligible search = enhanced alpha-beta iterative deepening / hard or expert
trigger = final nominal completed depth d>=3 and best(d-1) != best(d)
confirmation candidates = exactly previous-depth best + nominal final-depth best
confirmation = full-window depth-plus-one comparison under existing deadline
both candidates must complete; otherwise nominal move is retained
no extra wall-clock budget
no evaluation/quiescence/TT-key/TT-store/move-ordering/rule-engine/worker change
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

Development source block:

```text
42400001..42400512
eligible development roots minimum = 64
```

C008 implementationはこのcontract freeze後に許可される。ただしfeature defaultは`false`のまま、実装後のfeature-off exact equivalence PASSがdevelopment benefit executionの前提である。

## 10. protected boundary

現時点で禁止される操作:

- scientific evidence cutoff変更;
- Research Generation 3 evidence利用;
- C006/C007 implementation;
- C008 mechanism/trigger/thresholdのpost-support再設計;
- C009 implementation;
- C008 feature defaultをpublicで有効化すること;
- validation set `425xxxxx`実行;
- protected release holdout `426xxxxx`開封;
- candidate結果を見た後のthreshold relaxation;
- closed candidateへのsame-version救済;
- PBAI-P1 candidate救済;
- public deployment;
- AI-GEN3 promotion。

## 11. 次の安全な作業

1. C008 contract freeze後のcentral documentation / CI consistencyを確認する。
2. `fe962416...`以降からisolated C008 development branchを作成する。
3. `public/ai.js`だけにexact C008 mechanismをfeature-gated / default-offで実装する。
4. implementation後、candidate benefitを測る前にfeature-off exact baseline equivalenceを検証する。
5. equivalence PASSの場合だけ、`42400001..42400512`のdevelopment-only populationを開き、frozen intended-benefit gateを評価する。

validation / release holdoutはdevelopment PASS後に別contractをfreezeするまで実行しない。
