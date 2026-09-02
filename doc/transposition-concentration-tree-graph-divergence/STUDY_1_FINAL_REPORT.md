# G3-03 / TCTGD-STUDY1 — 最終報告

更新日: 2026-09-02

## 1. Formal decision

```text
Study = TCTGD-STUDY1
Program position = Research Generation 3 / G3-03
Study status = CLOSED / TECHNICAL-INVALID
Stage 0 = TCTGD-S0-TECHNICAL-2026-09-02-v1 / STAGE0-PASS
Stage 1 = TCTGD-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
Stage 2 = TCTGD-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31310001..31310192 / CONSUMED
Stage 2 seed = 31320001..31320288 / NOT CONSUMED
formal promoted candidate set = []
protected standard-root complete exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

G3-03は、bounded RAW局所構造におけるtransposition concentration、reconvergence、multi-parent RAW state、tree/graph divergenceのphase差をprospectively検証する独立研究として開始した。

Stage 1ではfresh development evidenceをexactly one authorized executionで生成したが、frozen production / independent verification gateがimplementation-representation defectによりfailした。no-rescue boundaryをcrossした後であるため、同一evidenceの修正再実行、endpoint再定義、verification gateの事後変更は行わない。

したがってformal decisionは **`CLOSED / TECHNICAL-INVALID`** とする。

## 2. Prospective scope

Representation contract:

```text
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
```

Principal measurement families:

- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`

Auxiliary family:

- `LGTGMIV-F1-TREE-OCCURRENCE`

Frozen Stage 1 population:

- seed block `31310001..31310192`
- 12 paired trajectories
- 12 Namua roots at exact ply 24
- 12 first nonterminal Mtaji roots at ply >=44
- geometry-blind / endpoint-blind / outcome-blind seed-ascending selection

Frozen candidate endpoints:

1. `TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO`
2. `TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION`
3. `TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION`
4. `TCTGD-C4-RECONVERGENCE-ONSET-SCORE`
5. `TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION`

## 3. Pre-Stage-1 technical correction boundary

Stage 1 fresh evidence生成前に、branch-only `workflow_dispatch` がGitHub REST上でHTTP 404となるcontrol-plane limitationをnon-scientific tooling smokeで確認した。

fresh evidenceに触れず、旧prospective specを保存したままtechnical-execution-only v2 refreezeを行い、次を固定した。

- scientific execution triggerを専用path-filtered push triggerへ変更
- trigger commit以外のbranch advancementを許可しないpre-computation lease gate
- durable artifact upload before repository mirror
- upstream scientific outcomeを直接selectionへ渡さないidentity-only firewall manifest
- Stage 1 scientific content baseline `3b31c0e853b99d50e6e4cd924984342535c22547`

この変更ではseed、population、relative horizon、candidate endpoint、promotion gate、Stage 2 formal test、resource ceiling、claim boundaryを変更していない。

## 4. Stage 1 authorized execution

Authorization:

```text
authorization = STAGE1-AUTHORIZED
authorization nonce = TCTGD-S1-AUTH-2026-09-02-V2-01
maxScientificExecutions = 1
```

Execution:

```text
workflow run = 33592380079
lease job = 100128827626 / success
scientific job = 100128867042 / process exit 2 after writing canonical TECHNICAL-INVALID result
mirror job = 100129459563 / success
execution trigger commit = 18cdade48db8f19e3b49615041630948dafb4e61
lease commit = 2320d80424a48cbf72964d3910b90522c7936151
result mirror commit = ce94af693386699a5b0cc6292d3ac817af034f19
```

Durable Actions artifact:

```text
artifact ID = 9832258829
name = tctgd-stage1-development-result-33592380079
size = 27447 bytes
ZIP SHA-256 = cb03924420df2b280398f5493283dc47fae01bb4e22afdd18560d42b5bf1139b
```

Canonical files were durably uploaded before repository mirror and then materialized to the research branch. G3-02で生じた「fresh resultはrunner内に存在したがpush failure後にcanonical bytesが失われた」というfailure modeは再発していない。

## 5. Stage 1 observed result

Population and resource boundary:

```text
selectedPairCount = 12
selectedRootCount = 24
populationComplete = true
stageResourcePass = true
sourceIdentityExact = true
staticIndependence = true
pairComparisonExact = true
developmentExact = true
```

Production / independent canonical stage scientific core SHA-256:

```text
production = d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f
independent = d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f
```

Runnerがdiagnostically算出したpromotion相当の候補は次の4つだった。

| Candidate | Diagnostic direction |
|---|---|
| `TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO` | `NAMUA-GREATER` |
| `TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION` | `NAMUA-GREATER` |
| `TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION` | `NAMUA-GREATER` |
| `TCTGD-C4-RECONVERGENCE-ONSET-SCORE` | `MTAJI-GREATER` |

ただしこれらはformal promoted candidateではない。Stage 1 global integrity gateがfailしたため、formal promoted candidate setは **`[]`** とする。

## 6. Technical-invalid cause

Frozen runnerはroot-level agreementについて、production / independentの`pm.tctgd`と`im.tctgd`をNode.js `util.isDeepStrictEqual`で比較した。

Production endpoint implementationは通常のobject literalにendpoint mapを構築する。一方、independent implementationはendpoint mapを `Object.create(null)` で構築していた。

そのため、endpointのkey/value、exact rational arithmetic、canonical serializationは一致していても、JavaScript object prototypeが異なることでprototype-sensitive deep equalityはfalseとなる。

Observed verification state:

```text
allRootExact = false
stageScientificExact = false
root endpointExact = false across the Stage 1 roots
upstream reconstruction hashes = exact agreement
eligible LGTGMIV family hashes = exact agreement
pairComparisonExact = true
developmentExact = true
canonical production / independent stage scientific core SHA = identical
```

すなわち、今回のtechnical-invalidは**scientific endpoint value disagreementを示すものではなく、frozen verification representation contractのimplementation defect**である。

しかし、frozen protocolは`allRootExact`および`stageScientificExact`をmandatory integrity gateとしていた。fresh scientific seed access後にこの比較方法を変更すればsame-evidence rescueになるため、修正して再判定しない。

## 7. No-rescue closure

Stage 1 seed block `31310001..31310192`はconsume済みであり、no-rescue boundaryはactiveである。

禁止事項:

- same Stage 1 evidenceのrerun
- endpoint map prototypeを修正した同一seed再評価
- `isDeepStrictEqual`をcanonical equalityへ事後置換してStage 1を救済
- Stage 1 threshold / endpoint / population / seed / resource ceilingの変更
- diagnostic candidate setをformal promoted setとして扱うこと
- Stage 2を実行すること

Formal closure:

```text
Stage 1 = TECHNICAL-INVALID
Study = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## 8. Stage 2 and protected evidence

Stage 2 seed block `31320001..31320288`は未消費である。

Stage 2 authorization requirementであるvalid Stage 1 + nonempty frozen promoted setを満たさないため、Stage 2はauthorizeしない。

Standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

## 9. Scientific interpretation boundary

このclosureからformalに主張できるのは、G3-03 Stage 1がfrozen technical verification gateを通過しなかったことだけである。

Diagnostic bytesから、Bao一般について以下をformalに結論してはならない。

- NamuaがMtajiよりtree/graph divergenceが大きい
- NamuaがMtajiよりtransposition concentrationが大きい
- Mtajiのreconvergence onsetが系統的に遅い／早い
- transpositionがsearch difficulty、best-move clarity、戦略的単純性、勝率、forcing、人間難度を意味する
- depth 5の観測がより深いgame treeへ一般化する

C1–C4の方向は、technical-invalid runに付随するdiagnostic provenanceとして保存するのみで、confirmatory evidenceではない。

## 10. Future methodological lesson

将来の独立研究では、cross-implementation exact agreementを判定するとき、scientific identityをprototype-sensitive runtime object equalityに依存させず、prospectively fixed canonical scientific serializationまたは明示的schema projection同士で比較することが望ましい。

このmethodological lessonはTCTGD-STUDY1の再実行許可を意味しない。
