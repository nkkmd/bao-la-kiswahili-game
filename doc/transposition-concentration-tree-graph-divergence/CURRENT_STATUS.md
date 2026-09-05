# TCTGD-STUDY1 — 現在の状態

Updated: 2026-09-02

```text
Study = TCTGD-STUDY1
Program position = Research Generation 3 / G3-03
Status = CLOSED / TECHNICAL-INVALID
Research branch = research/g3-03-transposition-tree-graph-divergence
baseline remote main = 6b1457294666267c5a75c8516001acd1ef7d2fcd
program review = G3-03-AUTHORIZED
post-G3-03 program review = COMPLETED / G3-04-AUTHORIZED / separate downstream Study; no G3-03 rescue
prospective Study/prereg freeze = COMPLETE
technical execution v2 refreeze = COMPLETE / PRE-FRESH / SCIENTIFIC CONTRACT UNCHANGED
Stage 0 = TCTGD-S0-TECHNICAL-2026-09-02-v1 / STAGE0-PASS
Stage 1 = TCTGD-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
Stage 2 = TCTGD-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 authorized scientific executions = 1
Stage 1 actual scientific executions = 1
Stage 1 seed = 31310001..31310192 / CONSUMED
Stage 2 seed = 31320001..31320288 / NOT CONSUMED
formal promoted candidate set = []
no-rescue boundary = CROSSED / ACTIVE
protected standard-root exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
next scientific action = none within TCTGD-STUDY1; Study remains closed. The separate post-G3-03 review later authorized G3-04, which subsequently closed independently.
```

## formal scientific scope （適用範囲と制限）

Principal measurement families:

- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`

Auxiliary denominator primitive:

- `LGTGMIV-F1-TREE-OCCURRENCE`

Boundary:

```text
representation = RAW-ONLY
relative horizon = 5
validated transform set = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
```

G3-02 branching / reply-width diagnostic outcomeはscientific inputとして使用していない。

## 固定済みendpoint

1. `TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO`
2. `TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION`
3. `TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION`
4. `TCTGD-C4-RECONVERGENCE-ONSET-SCORE`
5. `TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION`

すべてのratioとcomparisonにexact integer / rational arithmeticを使用した。

## 固定済みpopulation

Stage 1:

- seeds `31310001..31310192`
- target 12 paired trajectoryは12 Namua + 12 Mtajiである
- 実際に選択した12 paired trajectoryは24 rootである
- population complete = true

Stage 2:

- seeds `31320001..31320288`
- target 18 paired trajectoryは18 Namua + 18 Mtajiである
- unexecuted / unconsumed

各pairは、exact ply 24のNamuaとply 44以降の最初のnonterminal Mtajiを含むfresh source trajectory 1本で構成した。selectionはseed-ascending、geometry-blind、outcome-blindである。

## Stage 0の結果

GitHub Actions:

- run `33589334375`
- job `100119933850`
- conclusion `success`
- durable artifact `9831182022`
- artifact ZIP SHA-256 `efa3669c06a20b793d3f8feff80f71535fb582c0d1165fed38cf4dc0c3f78924`

Stage 0 deterministic core:

`e7e7831cf9503c94441a5dc9b30253485dc4b498e9b397408901186c914765d5`

synthetic semantic、exact-agreement、order-invariance、exact sign / Holm、static-independenceの全gateがPASSした。

## Stage 1前のtechnical execution refreeze

最初のnon-scientific tooling smokeにより、branch-onlyの`workflow_dispatch` targetをGitHub RESTでresolveできずHTTP 404となることを確認した。fresh scientific seedにはアクセスしていない。

Stage 1 authorization前に、prospective scientific contractを維持したまま、execution control planeをtechnical v2としてrefreezeした。

- path filterで限定したStage 1専用execution trigger
- 計算開始前に永続化するexecution lease
- authorization baselineの祖先関係とremote advancement allowlistのgate
- source blobの厳密なbinding
- repository mirror前のdurable artifact
- upstreamのidentityだけを含むfirewall manifest
- tooling / refreeze中にはStage 1 / Stage 2 seedへアクセスしない

Scientific-content baseline:

`3b31c0e853b99d50e6e4cd924984342535c22547`

## Stage 1の実行

Stage 1は別途exactly onceとしてauthorizeした。

```text
authorization = STAGE1-AUTHORIZED
authorization nonce = TCTGD-S1-AUTH-2026-09-02-V2-01
maxScientificExecutions = 1
actualScientificExecutions = 1
```

GitHub Actions:

```text
run = 33592380079
lease job = 100128827626 / success
scientific job = 100128867042 / exit 2 after canonical TECHNICAL-INVALID result
mirror job = 100129459563 / success
execution trigger commit = 18cdade48db8f19e3b49615041630948dafb4e61
lease commit = 2320d80424a48cbf72964d3910b90522c7936151
result mirror commit = ce94af693386699a5b0cc6292d3ac817af034f19
```

Durable artifact:

```text
artifact ID = 9832258829
name = tctgd-stage1-development-result-33592380079
size = 27447 bytes
ZIP SHA-256 = cb03924420df2b280398f5493283dc47fae01bb4e22afdd18560d42b5bf1139b
```

canonical Stage 1 result fileはActions artifactとresearch branchの両方にdurable保存している。

## Stage 1のverification result

Pass / agreement fields:

```text
populationComplete = true
stageResourcePass = true
sourceIdentityExact = true
staticIndependence = true
pairComparisonExact = true
developmentExact = true
```

FAILしたmandatory integrity field:

```text
allRootExact = false
stageScientificExact = false
stageDisposition = TECHNICAL-INVALID
```

ただし、production / independentのcanonical Stage scientific core SHA-256は一致した。

`d44393d6fe9902860d2b5fe3a5a3a3938f7165b40f46e694bd507cf231fcd62f`

## technical-invalidの原因

固定済みproduction endpoint implementationはendpoint mapを通常のJavaScript objectとして構築した。固定済みindependent implementationは同等のendpoint mapを`Object.create(null)`で構築した。

固定済みrunnerはprototype-sensitiveなNode.js `util.isDeepStrictEqual`でin-memory objectを比較した。そのため、exact endpoint key / value contentとcanonical serializationが一致していても、endpoint-map prototypeの相違だけでroot-level `endpointExact`がfalseになった。

このdefectが`allRootExact=false`と`stageScientificExact=false`へ伝播し、固定済みintegrity gateをFAILさせた。

defectはfresh Stage 1 evidenceの生成後に初めて特定された。object prototypeの修正、またはprototype-sensitive equalityからcanonical equalityへの置換はsame-evidence rescueになるため、TCTGD-STUDY1では禁止する。

## diagnostic candidateのprovenance

technical-invalid runは、次のpromotion-like diagnostic directionを生成した。

- `TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO` — `NAMUA-GREATER`
- `TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION` — `NAMUA-GREATER`
- `TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION` — `NAMUA-GREATER`
- `TCTGD-C4-RECONVERGENCE-ONSET-SCORE` — `MTAJI-GREATER`

これらはdiagnostic provenanceに限る。formal promoted candidate setは`[]`である。

## Stage 2の状態

`TCTGD-S2-FORMAL-2026-09-02-v1` remains:

**`NOT-AUTHORIZED-NOT-EXECUTED`**

Stage 2 seed `31320001..31320288`は未消費である。technical-invalidなStage 1からStage 2をauthorizeすることはできない。

## protected evidence （証拠の状態）

standard initial RAW-root complete exact depth-10 holdoutは、次の状態を維持する。

**`SEALED / NOT GENERATED / NOT READ`**

G3-03のactionからgeneration、read、peek、partial enumerationのいずれも行っていない。

## closure boundary （適用範囲と制限）

Formal closure:

```text
TCTGD-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

same-evidence rerunはauthorizeされていない。将来のStudyは、別個のprogram-level authorization reviewを経た、新しくprospectively definedなindependent Studyでなければならない。
