# G4-04 / GTTD-STUDY1 — 現在の状態

更新日: 2026-09-25  
Agenda: `Research Generation 4 / G4-04`  
Study: `GTTD-STUDY1`  
状態: **`COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED`**

## 現在地

```text
reviewed main HEAD = 1274c9cf408f0e044c39751599941a6f75e96a4c
research branch = research/g4-04-geometry-trajectory-transfer
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-PASS / exactly once
Stage 2 = FORMAL-COMPLETE / exactly once
formal scientific outcome = 8 / 8 GENERALIZATION-CONFIRMED
same-evidence rerun = NOT AUTHORIZED
main integration = NOT AUTHORIZED
public AI change = false
```

## Transfer target

G3-10 `GCLD-STUDY1`のformal confirmed claimのみを対象とした。

```text
C1 directionality / path efficiency = ACTUAL-GREATER
C2 persistence / lag-distance gradient = ACTUAL-GREATER
C3 return fraction = ACTUAL-LESS
C5 first-order directional path dependence = ACTUAL-GREATER
```

C4はG3-10で`NOT-CONFIRMED`のためpositive transfer targetではない。

## Stage 1

```text
canonical run = 36089520136 / attempt 1 / success
artifact ID = 10846181741
artifact SHA-256 = fa14e0c56d7d7f7088684eb715b1bf26b307cb22459741dfe4a7629cf40b3183
stage disposition = STAGE1-PASS
fresh seed reads = 134
P1 fully eligible = 15 / measured = 8
P2 fully eligible = 16 / measured = 8
C1/C2/C3/C5 defined = 8/8 for both policies
production / independent exact = true
formal inference = false
```

Stage 1はblinded development evidenceであり、endpoint値、contrast符号、effect direction、p値を保存していない。

## Stage 2 canonical execution

```text
Stage ID = GTTD-S2-FORMAL-2026-09-25-v1
authorization = GTTD-STUDY1-STAGE2-AUTHORIZED-GITHUB-ACTIONS-ONCE
canonical run = 36095831961 / attempt 1 / success
trigger commit = 97d8b374d6bfe1b573b915cd52974db6f6115423
durable lease commit = fcd1f68f8c65b2f6c3359bd8b37e1c1b12261161
artifact ID = 10849029913
artifact SHA-256 = fe165e6c1735cb07e71ed49e2a1c4d3f7446e796ab63936d90c7e982edfc4bd7
STAGE_2_RESULT.json SHA-256 = 85b5cf71c63dc9baeaf78a2dab4e61f03826b6f593552d916c5f48dcacd31d76
seed block = 40423001..40424024 / fixed 1024
actual seed reads = 369
last seed read = 40423593
P1 candidates = 48 / fully eligible = 47 / measured = 32
P2 candidates = 48 / fully eligible = 46 / measured = 32
formal measured population = 64
production / independent exact = true
stage disposition = FORMAL-COMPLETE
```

## Formal result

fixed 8-test Holm-Bonferroni family、family alpha exact `1/20`。

```text
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
```

Claim別:

- C1: P1 / P2とも`GENERALIZATION-CONFIRMED`
- C2: P1 / P2とも`GENERALIZATION-CONFIRMED`
- C3: P1 / P2とも`GENERALIZATION-CONFIRMED`、median directionはNEGATIVE
- C5: P1 / P2とも`GENERALIZATION-CONFIRMED`

G3-10のC1・C2・C3・C5 directionは、本Studyでprospectiveに固定したfresh P1/P2 source-policy domainsへ8/8で同方向に移送された。

## 解釈境界

RF1/RF2はsupport descriptorとしてのみ扱い、root-family別formal subgroup inferenceは行っていない。

この結果は以下を意味しない。

- whole-Bao universal law
- 任意source policyへの普遍的一般化
- game-theoretic value / best move correctness
- AI strength / win rateの改善
- human difficulty
- public AI変更の認可

## Integrity

```text
scientific executions = 1 / 1
same-evidence rerun = prohibited
seed extension = prohibited
trajectory replacement after manifest = prohibited
post-access repair-and-rerun = prohibited
G3-11 depth-10 rerun = false
G4-10 depth-11 access = false
public AI change = false
main integration = false
```

## 次工程

G4-04は追加実行せずclosure状態を維持する。

Research Generation 4を継続する場合、次のcore candidateはprogram plan上の`G4-05` exact microdomain oracle foundation。ただし自動authorizationではなく、独立したauthorization reviewから開始する。

G4-04の`main`統合はユーザーの明示指示まで行わない。

## 正本

- [`results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json`](results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json)
- [`results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`../research-program-decisions/2026-09-25-g4-04-geometry-trajectory-dynamics-transfer-study1-closure.md`](../research-program-decisions/2026-09-25-g4-04-geometry-trajectory-dynamics-transfer-study1-closure.md)
