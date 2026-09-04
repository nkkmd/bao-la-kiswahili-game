# UMSSR-STUDY1 — 現在の状態

更新日: 2026-08-30

## 研究識別

```text
Program = G2-10
Study ID = UMSSR-STUDY1
Formal title = Unified Multiaxial Strategic State Representation Study 1
Baseline remote main = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
Branch = research/g2-10-unified-multiaxial-strategic-state-representation
Stage 0 = UMSSR-S0-TECHNICAL-2026-08-30-v1
Stage 1 = UMSSR-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = UMSSR-S2-FORMAL-2026-08-30-v1
```

## 現在の正式状態

**STUDY CLOSED / STAGE 1 SCIENTIFIC DEVELOPMENT VALID / NO ELIGIBLE REPRESENTATION / STAGE 2 NOT AUTHORIZED**

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study formal decision = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 scientificInferenceAuthorized = true
validated strategic representation = false
selectedRepresentation = null
Stage 1 seeds 29310001..29314096 = CONSUMED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
validated transform set = []
canonicalization = false
symmetry reduction = false
```

Stage 1の判断はtechnical failureや`NON-ESTIMABLE`ではない。scientific readiness、production / independent exact verification、resource gateをすべて通過したうえで、事前固定した`K=2..6`の全候補がpromotion criterionを満たさなかったため、eligible representationを凍結しなかった。

## accepted Stage 1 execution （実行記録）

```text
source freeze commit = 10801fbc1529902bf3f4c0aa6e464c1dc39f1267
authorization commit = d6487403dba9fa1de8895b473e5e662d90b1f13b
workflow run = 33297178656
job = 99218754656
workflow conclusion = success
artifact id = 9727918107
artifact ZIP SHA-256 = 8f2f92d88ccb040f53bae28acb7124f230d51b00ff4466835adfda6260934e86
Stage 1 result file SHA-256 = 21fb4cd60dbaa6761b177ad54cda5dd33c942ba3994a953ce5486917f0e440fd
runner internal result SHA-256 = 985235180827db9d314b610baeb37cd2aec9427633ac518c270c938230060b9a
```

accepted runより前の2回のscientific workflow attemptはconsume gate前に停止し、scientific seedを消費していない。accepted runだけがStage 1 seed blockをconsume-onceで消費した。

## Stage 1 population / verification （Stageの記録）

```text
generated games = 4096
unique trajectories = 4068
distinct opening prefixes = 3711
selected roots = 512
selected distinct opening prefixes = 504
maximum single selected opening-prefix share = 0.005859375
active features = 40 / 40
scientific readiness = PASS
resource gate = PASS
production / independent full exact = true
```

8 phase/source-policy strataはすべて64 rootsだった。

production / independent compressed full shard SHA-256:

```text
66bf5fbeda877235d76628b108398a0c88741d677f8079951668b62ee3366595
```

## representation結果

凍結したpromotion criteria:

```text
minimum cluster support fraction >= 0.10
mean silhouette >= 0.05
five-fold assignment stability >= 0.80
candidate K = 2,3,4,5,6
```

結果:

```text
K=2 = ineligible / stability failure
K=3 = ineligible / support + stability failure
K=4 = ineligible / support failure
K=5 = ineligible / support failure
K=6 = ineligible / support + stability failure
eligible K count = 0
selectedRepresentation = null
```

K=4はmean silhouetteとstability自体は基準を満たしたが、minimum supportが`0.0078125`であり、事前閾値`0.10`を満たさなかった。結果後のthreshold relaxationは行わない。

## Stage 2 （Stageの記録）

Stage 2はStage 1で凍結したrepresentationだけをformal validationする契約だった。eligible representationが存在しないため、Stage 2 authorization prerequisiteを満たさない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds = RESERVED / UNCONSUMED
```

Stage 2 dataを使ったrefit、restandardization、reclustering、K変更、axis replacementは行わない。

## upstream / RAW境界

次は不変である。

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
```

- G2-06〜G2-09のtechnical-invalid / non-estimable outputをvalidated inputへ昇格していない。
- `TM-S2-C03 = CONFIRMED`はoriginal frozen scope内で不変であり、G2-10からgeneralization claimを生成していない。
- historical morphology classifierを救済していない。
- G2-05 bounded exact claimをfresh stateへ外挿していない。

## G2-11境界

`UMSSR-STUDY1`からG2-11へ渡せるvalidated / frozen regime representationはない。

```text
G2-11 candidate input from UMSSR-STUDY1 = NOT AUTHORIZED
```

G2-11で別representationが必要な場合は、新しいprospective Studyまたはversioned protocolを必要とする。

## repository状態

Study closure、Stage 1 result canonicalization、関連文書同期をresearch branch上で行う。`main`への統合は明示的な統合指示があるまで行わない。
