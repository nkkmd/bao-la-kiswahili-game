# 2026-09-25 — G4-05 / RLEMOF-STUDY1 post-Stage0 Stage 1 preparation review

Review ID: `G4-05-STAGE1-PREPARATION-REVIEW-2026-09-25-V1`  
Stage 0 canonical run: `36118292862 / attempt 1 / success`  
判定: **`PASS / STAGE1-PREPARATION-AUTHORIZED / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**

## Stage 0確認

Stage 0は9/9 technical gatesを通過し、fresh scientific seed/root readは0だった。production / independent exact path、recurrent SCC semantics、technical vocabulary separation、Actions artifact recoveryを確認した。

## Stage 1の役割

Stage 1はfresh game-theoretic valueを生成しない。目的は、fresh reachable late-game rootsについて、outcomeを見ずにstatic structureとcomplete-closure resource feasibilityだけをcharacterizeし、formal Stage 2を設計可能か判定することに限定する。

## G2-04との差分

G2-04は固定envelope `non-empty pits <=18 / legal moves <=2`、8 roots、100k states/rootでcomplete closure 0だった。これはG4-05のnegative evidenceではないが、resource-planning referenceとして、G4-05ではfresh evidence前により狭いnested feasibility tiersを固定する。

```text
T1: non-empty pits <=14 / exact legal moves <=1
T2: non-empty pits <=16 / exact legal moves <=1
T3: non-empty pits <=16 / exact legal moves <=2
```

T1から順に、最低6 eligible rootsを持つ最初のtierを機械的に選択する。tier choiceはroot availabilityだけを使い、closure result、retrograde value、winner、cycle interestを使用しない。どのtierも6 roots未満ならStage 1はfail-closedする。

## fresh block proposal

```text
seed block = 40513001..40513512 / 512 games
max ply = 320
maximum selected roots = 8
selection = seed asc, ply asc, RAW state key asc
```

このblockはG2/G3/G4既存namespaceと分離する。

## closure resource proposal

```text
states/root <= 200000
edges/root <= 800000
move microstates <= 1000000
minimum selected roots = 4
minimum independently verified complete closures = 3
```

Stage 1ではretrograde solverを呼ばず、WIN/LOSS/RECURRENT、DTF、optimal moveを生成しない。

## GitHub Actions

fresh Stage 1はGitHub Actionsを第一候補とする。120分のbounded development jobとしてproductionとindependent verificationを実行し、success/failureに関係なくartifactを保存する。

本レビューが許可するのはspec/code/workflowのfreezeまでである。source blob identityを固定した最終authorization fileを別commitで作成するまで、fresh seed generation/readは認可しない。

## 判定

**`PASS / STAGE1-PREPARATION-AUTHORIZED / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**
