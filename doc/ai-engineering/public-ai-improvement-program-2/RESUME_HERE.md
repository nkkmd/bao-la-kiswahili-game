# PBAI-P2 — 再開位置

更新日: 2026-09-01  
Program: `PBAI-P2`

## 1. 最初に読む順序

再開時はResearch Generation 3のscientific/development内容をcandidate設計へ取り込まず、次の順序で確認する。

1. [`EVIDENCE_FIREWALL.md`](EVIDENCE_FIREWALL.md)
2. [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
3. [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
4. [`GENERATION_2_EVIDENCE_AUDIT.md`](GENERATION_2_EVIDENCE_AUDIT.md)
5. [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
6. [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
7. [`CANDIDATE_REGISTER.md`](CANDIDATE_REGISTER.md)
8. [`candidates/PBAI-C008-v1-predevelopment-support-result.json`](candidates/PBAI-C008-v1-predevelopment-support-result.json)
9. [`candidates/PBAI-C008-v1.json`](candidates/PBAI-C008-v1.json)
10. [`checkpoints/2026-09-01-c008-predevelopment-support-pass.md`](checkpoints/2026-09-01-c008-predevelopment-support-pass.md)
11. C006/C007 canonical closure artifacts as historical context

Machine-readable program freeze:

- `baselines/AI-GEN2-BASELINE-2026-09-01-v1.json`
- `benchmark/PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1.json`
- `candidates/PBAI-P2-INITIAL-CANDIDATE-INVENTORY-2026-09-01-v1.json`

## 2. 固定済みidentity

```text
Program ID = PBAI-P2
formal title = Generation-2 Evidence-Informed Public Bao AI Improvement Program 2
scientific evidence cutoff = cd200b85c1eb24aa4419bd5a9573552f3682f00d
initial remote main = 2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972
baseline = AI-GEN2-BASELINE-2026-09-01-v1
global gates = PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1
current public lineage = AI-GEN2
next lineage reserved = AI-GEN3
C008 contract freeze commit = fe962416a5d76fe8ab5d47def384dd386acc222d
```

## 3. 絶対に維持するfirewall

```text
Research Generation 3 influence on PBAI-P2 = ZERO
```

G3のscientific evidence、development observation、result、diagnostic、hypothesis、measurement、candidate mechanism、documentation-derived ideaをPBAI-P2へ使用しない。

## 4. 現在のengineering状態

```text
PBAI-P2-A = COMPLETE
PBAI-P2-B = COMPLETE
PBAI-P2-C = COMPLETE
PBAI-P2-D = C006 CLOSED / C007 CLOSED-HOLD / C008 SUPPORT-PASS + CONTRACT-FROZEN
PBAI-P2-E = C008 DEVELOPMENT AUTHORIZED / NOT YET EXECUTED
candidate implementation count = 0
predevelopment support outcome count = 3
candidate development outcome count = 0
validation count = 0
release holdout count = 0
public deployment count = 0
```

## 5. C006 / C007 closure

```text
PBAI-C006-v1 = WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT
PBAI-C007-v1 = NON-ESTIMABLE-HOLD
```

両candidateともimplementation未実施。same-version追加supportによる救済は禁止。

## 6. C008 canonical support

```text
canonical run = 33492849852
job = 99808142315
artifact = 9794730237
artifact ZIP SHA-256 = 4a56952f7bdf034f472661314d9de29a824a6342a63df1230969dbbfd6f2c6a3
deterministic core SHA-256 = 9010ffa1fbdfa33e854d1fafe3c652e2017a6b46f0902c7fe25de69e0b2411c9
source seeds = 1024
trajectory roots available = 870
eligible roots = 233
minimum eligible roots = 64
technical failures = 0
independent exact core equality = true
PBAI-C008-v1 predevelopment = SUPPORT-PASS
```

Support PASSはcandidate improvementを意味しない。

## 7. C008 frozen implementation contract

```text
feature = pbaiC008RootFlipConfirmation
default = false
affected public source = public/ai.js only
trigger = final nominal completed depth d>=3 AND best(d-1) != best(d)
confirmation candidates = exactly previous-depth best + final nominal-depth best
confirmation = full-window d+1 under existing deadline
both candidates must complete; otherwise nominal move retained
no time-budget increase
no evaluator/quiescence/move-ordering/TT-key/TT-store/rule-engine/Worker change
```

Development gates:

```text
D4 TopSet agreement delta >= +0.05
mean normalized rank-loss delta <= -0.02
severe-loss-rate excess <= 0
catastrophic new loss = 0
median node ratio <= 1.60
p95 node ratio <= 2.50
```

## 8. 次に実行してよい工程

1. C008 isolated development branchをcontract freeze後のcurrent P2 branchから作る。
2. `public/ai.js`だけにfeature-gated / default-off implementationを入れる。
3. development outcomeを見る前にfeature-off exact baseline equivalenceを実行する。
4. equivalence PASSの場合のみ`42400001..42400512`を使うdevelopment-only evaluationを実行する。

Feature-off equivalence:

```text
selected move key = exact baseline equality
all pre-existing stats fields/values = exact equality
stats.pbaiC008 = absent when feature off
exception/timeout behavior = exact equality
```

## 9. まだ禁止されること

- G3 evidence利用;
- C008 feature default ON;
- C008 contractのpost-support変更;
- validation seeds `425xxxxx` access;
- release holdout seeds `426xxxxx` access;
- C009 implementation;
- public deployment;
- AI-GEN3 promotion。

## 10. 正常な最終結果

PBAI-P2はAI-GEN3を必ず作るProgramではない。`ADOPT`だけでなく`KEEP-AI-GEN2`も正常なclosure outcomeである。
