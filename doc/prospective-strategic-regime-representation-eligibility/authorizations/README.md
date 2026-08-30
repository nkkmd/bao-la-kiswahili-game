# PSRRE-STUDY1 — authorization ledger

## 現在のauthorization state

Studyはclosedである。現在の正式状態は次のとおり。

```text
PSRRE-S0-TECHNICAL-2026-08-30-v1 technical execution = AUTHORIZED / EXECUTED / STAGE0-TECHNICAL-PASS
PSRRE-S0-TECHNICAL-2026-08-30-v1 scientific inference = NOT AUTHORIZED
PSRRE-S1-DEVELOPMENT-2026-08-30-v1 scientific execution = AUTHORIZED / EXECUTED / CONSUMED
PSRRE-S1-DEVELOPMENT-2026-08-30-v1 disposition = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
PSRRE-S2-FORMAL-2026-08-30-v1 scientific execution = NOT AUTHORIZED / NOT EXECUTED
G2-11 scientific execution = NOT AUTHORIZED
```

Stage 1はrepresentationをfreezeしなかったため、Stage 2 authorization prerequisiteは成立していない。

## Study-start時点のhistorical state

Study-start時点ではscientific executionを一切authorizeしていなかった。

```text
Stage 0 technical execution authorized = false
Stage 1 scientific execution authorized = false
Stage 2 scientific execution authorized = false
G2-11 scientific execution authorized = false
```

このhistorical start stateは[`../prereg/STUDY_1_INITIAL_CONTRACT.json`](../prereg/STUDY_1_INITIAL_CONTRACT.json)に保存している。

## Stage 0 technical authorization

Stage 0はsource/hash freeze後にtechnical-onlyでauthorizeした。

```text
source freeze commit = 724e05ef6a730593aab2f9165a0d02216e372c6d
authorization commit = 2c1dea4f7f5c98497333d9ec325931e9091ba0df
workflow run = 33304155488
job = 99237601518
artifact = 9729904359
disposition = STAGE0-TECHNICAL-PASS
```

Authorization artifact:

- [`STAGE_0_TECHNICAL_EXECUTE.json`](STAGE_0_TECHNICAL_EXECUTE.json)

Stage 0はscientific performance、scientific seed、G2-11 outcomeを使用していない。

## Stage 1 tooling smoke authorization

Stage 1 scientific evidenceを生成する前にtechnical-only tooling smokeを別途authorizeした。

- [`STAGE_1_TOOLING_SMOKE_EXECUTE.json`](STAGE_1_TOOLING_SMOKE_EXECUTE.json)

Tooling smokeは`TOOLING-SMOKE-PASS`であり、scientific seedは使用していない。

## Stage 1 scientific authorization

Stage 1はfeature dictionary、family/K、threshold、population、Stage 2 held-out contract、resource/consume-once ruleを先にfreezeし、packaging preflightをPASSした後に別commitでauthorizeした。

```text
source freeze commit = 41124069f89f0706cf943e18688c96a8c2db35d7
authorization commit = 085c5df24baff44bb644c00eda91d6212caf5708
workflow run = 33308337738
job = 99248759871
artifact = 9731444105
seed block = 29510001..29514096
seed status = CONSUMED
same-block rerun = NOT AUTHORIZED
```

Authorization artifact:

- [`STAGE_1_EXECUTION_AUTHORIZATION.json`](STAGE_1_EXECUTION_AUTHORIZATION.json)

Scientific runはtechnical/resource/exact-verificationをPASSしたが、minimum nonzero-MAD feature readiness gate `15 < 20`により:

```text
STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
```

で閉じた。

## Stage 2 scientific authorization

Stage 2はauthorizeしていない。

Prospective requirementはStage 1が`STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN`となり、frozen representation artifactを生成することだった。本Studyはこの条件を満たしていない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
seeds 29610001..29618192 = RESERVED_UNCONSUMED
```

Stage 2のpost-hoc authorization、Stage 1 threshold relaxation、same-block rerunによるprerequisite rescueは行わない。

## G2-11 authorization

本Studyは`NON-ESTIMABLE`でclosedし、frozen representationを生成していない。

```text
G2-11 candidate input authorized = false
G2-11 scientific execution authorized = false
```

G2-11を今後開始する場合は、本Studyのunvalidated representationを流用せず、current repository stateを監査した新しいprospective contractと独自authorizationを必要とする。
