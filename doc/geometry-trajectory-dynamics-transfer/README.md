# G4-04 / GTTD-STUDY1 — Geometry-Trajectory Dynamics Transfer

更新日: 2026-09-25  
Program: `Research Generation 4 / G4-04`  
Study: `GTTD-STUDY1`  
状態: **`COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED`**

## 目的

G3-10 `GCLD-STUDY1`でformal confirmationされた4 trajectory-level claimについて、fresh source-policy domainへprospectiveに移送できるかを検証した。

```text
C1 directionality / path efficiency = ACTUAL-GREATER
C2 persistence / lag-distance gradient = ACTUAL-LESS
C5 first-order directional path dependence = ACTUAL-GREATER
```

G3-10 C4 circulation/hysteresis-like claimは`NOT-CONFIRMED`であり、positive transfer targetには含めていない。

## representation

```text
representation = CRCLGR-R1-EXACT-SQUASHED-L1
relative depth = 5
coordinate arithmetic = exact reduced rational
distance = equal-weight exact L1
validated transform set = []
```

G4-04中にrepresentation変更やsymmetry canonicalizationを導入していない。

## Stage 0 / Stage 1

Stage 0 technical validationで15 checkpoints、32 endpoint-preserving controls、C1/C2/C3/C5 production/independent exactness、P1/P2 source generation、resource fail-closedを確認した。

Stage 1 developmentはGitHub Actions exactly onceで実施し、P1=15、P2=16 fully eligible trajectoryを確保、各policy first 8をdevelopment measurementとした。endpoint値、contrast符号、effect direction、p値は保存せず、formal inferenceも行っていない。

```text
Stage 1 canonical run = 36089520136 / attempt 1 / success
artifact ID = 10846181741
stage disposition = STAGE1-PASS
```

## Stage 2 formal

Stage 2はfresh access前にscientific contract、identity firewall、24-file preexecution binding、exact sign-test / fixed-8 Holm、GitHub Actions exactly-once authorizationを固定した。

```text
Stage 2 canonical run = 36095831961 / attempt 1 / success
trigger commit = 97d8b374d6bfe1b573b915cd52974db6f6115423
durable lease commit = fcd1f68f8c65b2f6c3359bd8b37e1c1b12261161
artifact ID = 10849029913
artifact SHA-256 = fe165e6c1735cb07e71ed49e2a1c4d3f7446e796ab63936d90c7e982edfc4bd7
STAGE_2_RESULT.json SHA-256 = 85b5cf71c63dc9baeaf78a2dab4e61f03826b6f593552d916c5f48dcacd31d76
seed block = 40423001..40424024 / 1024
seed reads = 369
last seed read = 40423593
formal measured trajectories = 64
production / independent exact = true
stage disposition = FORMAL-COMPLETE
```

## Formal result

```text
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
```

P1/P2それぞれでC1・C2・C3・C5がすべて`GENERALIZATION-CONFIRMED`となった。C1・C2・C5はpositive direction、C3はnegative directionでG3-10と一致した。

したがって、G3-10の4 confirmed directionは、本Studyのfresh P1/P2 source-policy domainsへ8/8 formal testsで同方向に移送された。

## 解釈上の境界

この結果はformal domainをP1/P2 full trajectoriesへ限定する。

- RF1/RF2はsupport descriptorのみで、root-family別formal subgroup inferenceは行っていない。
- 任意source policyやwhole-Bao state spaceへのuniversal generalizationではない。
- C4のpositive transferを示さない。
- game-theoretic value、best move correctness、AI strength、win rate、人間のdifficultyを検証していない。
- public AI変更を認可しない。

## one-shot / no-rescue 境界

- Stage 1 scientific execution = exactly once
- Stage 2 scientific execution = exactly once
- same-evidence rerun = prohibited
- seed extension = prohibited
- post-access repair-and-rerun = prohibited
- G3-11 depth-10 rerun = false
- G4-10 depth-11 access = false
- main integration = complete / PR #165

## 正本

- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STAGE_2_FORMAL_SPEC.json`](prereg/STAGE_2_FORMAL_SPEC.json)
- [`authorizations/STAGE_2_FINAL_AUTHORIZATION.json`](authorizations/STAGE_2_FINAL_AUTHORIZATION.json)
- [`results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json`](results/stage-2/STAGE_2_ARTIFACT_RECEIPT.json)
- [`results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json`](results/stage-2/STAGE_2_CANONICAL_RESULT_SUMMARY.json)
- [`../research-generation-4/checkpoints/2026-09-25-g4-04-main-integration.md`](../research-generation-4/checkpoints/2026-09-25-g4-04-main-integration.md)
- [`../research-program-decisions/2026-09-25-g4-04-geometry-trajectory-dynamics-transfer-study1-closure.md`](../research-program-decisions/2026-09-25-g4-04-geometry-trajectory-dynamics-transfer-study1-closure.md)

G4-04完了時点で次候補だったG4-05は、その後別Study `RLEMOF-STUDY1`として完了した。現在のResearch Generation 4の次候補はG4-06であり、個別authorization reviewを必要とする。最新状態は[`../research-generation-4/CURRENT_STATUS.md`](../research-generation-4/CURRENT_STATUS.md)を参照する。
