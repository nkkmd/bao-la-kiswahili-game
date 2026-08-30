# UMSSR-STUDY1 — authorization管理

## 現在のauthorization状態

Study closure時点の状態は次である。

```text
Stage 0 = technical-only / STAGE0-TECHNICAL-PASS
Stage 1 = AUTHORIZED-AND-EXECUTED-ONCE
Stage 1 result = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1 scientific inferenceはaccepted consume-once executionについて有効であるが、これはStage 2 authorizationを意味しない。

## Stage 1 authorization

canonical authorization artifact:

- `STAGE_1_EXECUTION_AUTHORIZATION.json`

accepted authorization:

```text
source freeze commit = 10801fbc1529902bf3f4c0aa6e464c1dc39f1267
authorization commit = d6487403dba9fa1de8895b473e5e662d90b1f13b
seed block = 29310001..29314096
status before accepted execution = RESERVED_UNCONSUMED
consume-once = true
same-block rerun = false
Stage 2 authorized = false
```

accepted workflow run `33297178656`でStage 1 seed blockは`CONSUMED`となった。以後、同じblockのrerun、replacement、extensionは未承認である。

## pre-consumption rejected attempts

Stage 1 accepted runより前に2回のscientific workflow attemptが停止した。

```text
run 33296879050 = authorization binding mismatch / seeds not consumed
run 33296962144 = pre-consumption runner ReferenceError / seeds not consumed
```

どちらもconsume gate前で停止し、scientific dataを生成していない。runner修正後のsourceについてtechnical-only packaging preflight `33297055834`をPASSさせてから、final authorizationを発行した。

## Stage 2をauthorizeしない理由

Stage 2 contractはStage 1で凍結されたrepresentationをformal validationするためのものである。

Stage 1 accepted resultは:

```text
selectedRepresentation = null
eligible candidate K = 0
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
```

だったため、Stage 2 authorization prerequisiteを満たさない。

```text
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
```

Stage 2 authorization artifactは作成しない。

## no-rescue boundary

次を同じStudy内でauthorizationしない。

- Stage 1 threshold relaxation後のrerun
- K range変更後のrerun
- axis / feature replacement後のrerun
- Stage 1 seed extension
- Stage 1 populationのStage 2 evidenceへの転用
- Stage 2でのrefit / reclustering / restandardization
- outcome確認後のStage 2 prerequisite緩和
