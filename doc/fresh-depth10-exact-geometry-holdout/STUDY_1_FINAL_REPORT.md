# FDEGHV-STUDY1 — Study 1最終報告

更新日: 2026-09-04

## 1. 結論

Research Generation 3 `G3-11` / `FDEGHV-STUDY1`は、standard initial Bao RAW rootを対象とするfresh complete exact depth-10 holdoutを、prospectively固定したRAW-only contract、resource ceiling、exactly-one execution rule、mandatory independent full re-enumerationの下で完了した。

Study-level formal dispositionは次のとおりである。

**`CLOSED / FORMAL-COMPLETE / EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`**

4つのprospectively frozen continuation targetはすべて`DEEPER-CONFIRMED`となった。

```text
H1 exact-depth novelty continuation = DEEPER-CONFIRMED
H2 layer tree/RAW divergence continuation = DEEPER-CONFIRMED
H3 cumulative tree/RAW inflation continuation = DEEPER-CONFIRMED
H4 transposition persistence = DEEPER-CONFIRMED
```

これは、standard initial RAW rootからの**complete exact depth 10という凍結済み単一domain**におけるexact resultである。Bao全状態空間・全ゲーム木の推定、depth 11への一般化、causal mechanism、human difficulty、game-theoretic value、G3-04/G3-07/G3-10の既存formal decisionの再判定を意味しない。

scientific closure時点では、`main` integrationを別操作として`NOT AUTHORIZED / NOT PERFORMED`に保った。その後、明示的なユーザー指示に基づく統合が完了している。現在のrepository状態は`CURRENT_STATUS.md`を正本とする。

## 2. 結果を見る前に固定したcontract

Formal Stageは`FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1`である。

凍結したdomain:

```text
root = standard initial RAW state
root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
reachable layers = complete depth 0..10
parent expansion layers = complete depth 0..9
representation = RAW-only
identity fields = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
symmetry reduction = false
canonicalization collapse = false
depth 11 = prohibited
G2-12 estimator scientific input = prohibited
```

formal targetは次のとおりである。

- E0 — depth 10までのcomplete exact RAW domain
- H1 — `newRawStateCount[10] == uniqueRawStateCount[10]`
- H2 — `treeNodeOccurrences[10] > uniqueRawStateCount[10]`
- H3 — `treeThrough10 * rawThrough9 > treeThrough9 * rawThrough10`
- H4 — `duplicateArrivalCount[10] > 0 AND statesWithMultiplePredecessors[10] > 0`

固定済みtarget domainそのものを完全列挙したため、p-valueを用いるsampling inferenceは導入していない。

## 3. authorizationとprotected evidenceの開封

post-G3-10 current-state reviewはprotected depth-10 outcomeを開く前に`G3-11-AUTHORIZED`を固定した。その後、Stage 0 technical controls、pre-access documentation sync、source freeze、resource ceiling、Stage 1 authorization、durable pre-computation leaseを順にmaterializeした。

Stage 1 authorizationは次を固定した。

```text
scientific executions authorized = 1
maximum scientific executions = 1
protected depth-10 access = authorized
same-evidence rerun = false
depth 11 = false
G2-12 estimator scientific input = false
subset rescue = false
post-outcome target change = false
post-outcome resource-ceiling change = false
```

Stage 1 Actions run `33837413663`はrun number 1で`success`となった。protected depth-10はこのauthorized executionで初めて開かれ、以後は「sealed」ではなく**consumed exactly once / no-rerun**として扱う。

## 4. exact domainの結果

complete enumerationはdepth 10まで完了し、`stopReason = null`であった。

主要なexact totals:

| 項目 | exact value |
| --- | ---: |
| depth-10 unique RAW states | 348,270 |
| depth-10 new RAW states | 348,270 |
| depth-10 tree-node occurrences | 494,456 |
| depth-10 arrival edges | 359,995 |
| depth-10 duplicate arrivals | 11,725 |
| depth-10 states with multiple predecessors | 10,383 |
| cumulative distinct RAW states through depth 10 | 451,127 |
| cumulative depth-labelled legal edges through parent depth 9 | 466,768 |
| cumulative unique RAW graph edges through parent depth 9 | 466,768 |
| cumulative tree-node occurrences through depth 10 | 631,101 |
| cumulative tree-edge occurrences through parent depth 9 | 631,100 |
| cumulative tree/RAW state ratio | 1.3989430914132828 |

Exact cumulative identities:

```text
cumulative RAW state-set SHA-256 = 7cff40d1c55876555bd3dc07cb0836bc209ed83554847ab297a51e3fb95748f7
cumulative global RAW graph-edge-set SHA-256 = f8ecc7f399994407c13dc76aedec013ee6d38d728cf2cd6f6ed7421980db42c1
cumulative depth-labelled edge-set SHA-256 = f96a0750891c255f87fbb5692a7caae4afad23acaa24034a8bda3a18395b63f4
```

## 5. formal targetの判断

### H1 — exact-depth noveltyの継続

```text
348270 == 348270
```

判断: **`DEEPER-CONFIRMED`**

depth 10で到達した348,270 RAW statesは、すべてdepth 0..9 cumulative setに対してnewであった。この結果はこのstandard-root depth-10 layerに限定される。

### H2 — layer tree / RAW divergenceの継続

```text
494456 > 348270
```

判断: **`DEEPER-CONFIRMED`**

同一depth layerでtree occurrenceがunique RAW state countを上回り、tree representationとRAW state graph representationの乖離がdepth 10でも継続した。

### H3 — cumulative tree / RAW inflationの継続

Floating-point toleranceではなく、凍結済みexact integer cross-productで比較した。

```text
left  = 64913155557
right = 61644248915
left > right
```

判断: **`DEEPER-CONFIRMED`**

したがってcumulative tree/RAW ratioはdepth 9までよりdepth 10までで増加した。

### H4 — transpositionの持続

```text
duplicateArrivalCount[10] = 11725 > 0
statesWithMultiplePredecessors[10] = 10383 > 0
```

判断: **`DEEPER-CONFIRMED`**

depth 10でもduplicate arrivalとmulti-predecessor RAW stateの双方が存在した。

## 6. independent verification（独立検証）

Formal exact classificationの条件として、production materializationを読むだけの検査に加え、materially separate independent implementationによるfull exact depth-10 re-enumerationを必須とした。

結果:

```text
materialized verification = PASS
verified reachable layers = 11
verified parent layers = 10
full independent exact re-enumeration = PERFORMED / PASS
production result core SHA-256 = 13f42d92549b9f796ef963aad3883f72bf63e27908cee2245d1dd4b8b73e4876
independent core SHA-256 = 2e913c8458037db33de0083981bf4442316bb28d7bf7dc4d05419b8e4a0057d5
canonical scientific-result-core SHA-256 = 5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9
```

Independent verificationはstate set、source-move-successor edge relation、tree occurrence propagation、branching distribution、duplicate arrival / predecessor multiplicity、per-layer/cumulative hashes、H1–H4の再計算を対象とした。

## 7. resource gateとintegrity gate

凍結済みresource ceilingはoutcomeを見る前に固定し、結果後に変更していない。

productionのfinal gate:

```text
PASS
artifact bytes = 369298531
elapsed = 108.530371328 s
peak RSS = 2269167616 bytes
```

independent implementationのfinal gate:

```text
PASS
parent-state expansions = 102857
move evaluations = 466768
elapsed = 117.592820799 s
peak RSS = 2460262400 bytes
```

最終artifact gateの判定:

```text
PASS
artifact bytes = 369321905
maximum = 1073741824
manifest included = true
```

resource ceiling crossing、partial promotion、post-outcome cap increaseは発生していない。

## 8. Stage 0のtechnical record

Stage 0のtechnical scientific-free controls自体は`STAGE0-PASS`である。最初のActions workflow全体は、PASS artifact upload後のcurrent-facing documentation syncが古いexact-string assumptionに依存して失敗したため`failure`となったが、これはdepth-10 scientific evidenceの生成・readより前のcontrol-plane defectであった。

Stage 0 scientific/technical executionは再実行せず、既存PASS artifactを正本として保持した。

```text
Stage 0 Actions run = 33834641015
Stage 0 artifact ID = 9922855242
Stage 0 artifact digest = sha256:cb67ae1e768c725a6d4474c02fec9c51993a3fc4a11650c714ef83294e10e632
Stage 0 result SHA-256 = cbe1a078568a4d1162c9703dc089c1f9413cb0c2f34dd4f0b2925550ef3e1ea9
protected depth-10 access during Stage 0 = false
```

## 9. 解釈上の境界

本Studyがformalに確立したのは、standard initial RAW rootからdepth 10までの凍結exact domainにおけるRAW game-tree/game-graph geometry primitiveと、H1–H4のprospective continuation checksである。

本Studyは次を確立しない。

- Bao全状態空間のサイズ
- Bao全ゲーム木のサイズ
- depth 11以深で同じ関係が必ず続くこと
- symmetry reduction / canonicalizationを適用した状態空間の結果
- strategic regime representation
- G3-10 trajectory-level chronology/path-dependence claimの再判定
- G3-07 search-condition associationの再判定
- G3-04 phase contrastの再判定
- 因果mechanism、人間にとっての難しさ、game-theoretic value

特にG2-12 estimatorはscientific input、expected count、target、resource tuningのいずれにも使用していない。

## 10. closureとno-rescue boundary

protected depth-10 evidenceは1回のauthorized executionでconsume済みであり、同Study/versionでは再実行しない。

```text
same-evidence rerun = NOT AUTHORIZED
resource ceiling increase = NOT AUTHORIZED
target change = NOT AUTHORIZED
subset rescue = NOT AUTHORIZED
root replacement = NOT AUTHORIZED
symmetry/canonicalization rescue = NOT AUTHORIZED
G2-12 estimator use = NOT AUTHORIZED
depth 11 extension = NOT AUTHORIZED
upstream formal decision revision = NOT AUTHORIZED
```

Depth 11を扱う場合は、G3-11の延長ではなく、別のfresh prospective Studyとして新たにauthorization reviewとfreezeを必要とする。

Historical `doc/research-generation-3/PROGRAM_PLAN.md`は変更しない。

## 11. canonical record（正本となる記録）

- `README.md`
- `CURRENT_STATUS.md`
- `STUDY_1_PROTOCOL.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_1_FORMAL_SPEC.json`
- `authorizations/STAGE_1_EXECUTE.json`
- `results/stage-1/STAGE_1_FORMAL_RESULT.json`
- `results/stage-1/STAGE_1_PRODUCTION_SUMMARY.json`
- `results/stage-1/result-core.json`
- `results/stage-1/ARTIFACT_MANIFEST.json`
- `../research-program-decisions/2026-09-04-g3-11-formal-complete-closure.md`

Scientific closureとrepository integrationは別操作である。**main integrationは`COMPLETE / FAST-FORWARD / source tip 03d1b5bf28ed45aaa9480f0a7c5efc6d394fcbae / previous main e537199a959c0808cbef6cf8aaeb1caab91e3702 / force=false`**である。
