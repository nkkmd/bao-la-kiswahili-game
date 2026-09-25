# G4-04 / GTTD-STUDY1 — 現在の状態

更新日: 2026-09-25  
Agenda: `Research Generation 4 / G4-04`  
Study: `GTTD-STUDY1`  
状態: **`PREREGISTERED / STAGE0 AUTHORIZED / NOT EXECUTED`**

## 現在地

```text
reviewed main HEAD = 1274c9cf408f0e044c39751599941a6f75e96a4c
research branch = research/g4-04-geometry-trajectory-transfer
authorization = G4-04-AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
Stage 0 = AUTHORIZED / NOT EXECUTED
Stage 1 = NOT AUTHORIZED / fresh seeds NOT READ
Stage 2 = NOT AUTHORIZED / fresh seeds NOT READ
formal scientific outcome = NONE
main integration = NOT AUTHORIZED
public AI change = false
```

## Transfer target

G3-10 `GCLD-STUDY1`のformal confirmed claimのみを対象とする。

```text
C1 ACTUAL-GREATER
C2 ACTUAL-GREATER
C3 ACTUAL-LESS
C5 ACTUAL-GREATER
```

C4はG3-10で`NOT-CONFIRMED`のためpositive transfer targetではない。

## Stage 0 contract

```text
Stage ID = GTTD-S0-TECHNICAL-2026-09-25-v1
evidence = TECHNICAL-FIXTURE
seed block = 44014001..44014064
scientific use = prohibited
fresh scientific seed access = false
```

主要確認事項:

- `CRCLGR-R1-EXACT-SQUASHED-L1` representation維持
- G3-10と同じ15 checkpoint schedule
- 32 endpoint-preserving controlのdeterministic一致
- C1/C2/C3/C5 exact production/independent一致
- G4-01 compatible P1/P2 source-policy generation
- RF1/RF2 anchor分類のtechnical determinism
- phase-composition manifestのoutcome-free生成
- source terminal / relay-limit / resource failureのfail-closed動作
- protected evidence guards

## Reserved fresh namespace

```text
Stage 1 candidate start = 40413001 / reservation only
Stage 2 candidate start = 40423001 / reservation only
```

end/count/assignment/formal domain/test/multiplicityは未固定であり、Stage 0結果がtechnical-onlyであることを確認した後、fresh scientific access前の別reviewで固定する。

## 次工程

1. Stage 0用production/independent technical runnerをsource-boundに実装する。
2. authorization/spec binding verifierを用意する。
3. Stage 0 technical validationを実行する。
4. Stage 0 artifactを独立検証する。
5. PASSの場合のみpost-Stage0 Stage 1 pre-access authorization reviewを行う。

Stage 0のPASSはStage 1を自動認可しない。

## 禁止事項

- Stage 1 / Stage 2 fresh seed access
- scientific effect direction / p-value生成
- G3-10 rerun/replay
- G3-12 scientific evidence reuse
- G3-11 depth-10 rerun
- G4-10 depth-11 access
- representation rescue change
- main integration
- public AI change
