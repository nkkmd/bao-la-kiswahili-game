# G3-07 / SILGM-STUDY1 — 最終報告

更新日: 2026-09-03

## 1. formal status（正式状態）

```text
Study = SILGM-STUDY1
Program position = Research Generation 3 / G3-07
Study status = CLOSED / FORMAL-COMPLETE
Stage 0 = SILGM-S0-TECHNICAL-2026-09-03-v4 / STAGE0-PASS
Stage 1 = SILGM-S1-DEVELOPMENT-2026-09-03-v1 / STAGE1-PASS
Stage 2 = SILGM-S2-FORMAL-2026-09-03-v1 / STAGE2-PASS
Stage 1 seed = 31710001..31710256 / CONSUMED
Stage 2 seed = 31720001..31720384 / CONSUMED
protected standard-root complete exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT PERFORMED
```

`CLOSED / FORMAL-COMPLETE`はrepository lifecycle statusであり、新しいscientific omnibus labelではない。本Studyのformal inferenceは、Stage 1でprospectively promotionされた8 candidateそれぞれに対する`CONFIRMED` / `NOT-CONFIRMED` / `NON-ESTIMABLE`である。

Formal candidate count:

```text
promoted at Stage 1 = 8
estimable at Stage 2 = 7
CONFIRMED = 3
NOT-CONFIRMED = 4
NON-ESTIMABLE = 1
```

## 2. 研究題目

**Search Instability / Local Geometry Mechanism Study 1 — Prospective exact association analysis of bounded RAW local game-tree geometry with best-move, TopSet, ranking, score-gap, and principal-variation changes under deterministic search-condition perturbations in Bao**

日本語正式題目:

**Baoにおける探索不安定性と局所ゲーム木幾何のprospective exact関連解析 — bounded RAW branching・reconvergence・reply compressionとbest-move・TopSet・ranking・score-gap・PV変動の決定論的search-condition間集中関係の検証**

題目中の`Mechanism`は歴史的program labelであり、causal mechanismを意味しない。本Studyが許可したのはbounded association / concentration / structural relationの検証である。

## 3. 科学的scope

本Studyは、LGTGMIVでformal eligibilityが確認されたrelative depth 5のRAW local geometryと、決定論的search-condition perturbation間の探索出力変化との関連をprospectively検証した。

Representation contract:

```text
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
```

Geometry candidates:

1. `SILGM-G1-ROOT-LEGAL-WIDTH`
2. `SILGM-G2-CUMULATIVE-TREE-OCCURRENCE`
3. `SILGM-G3-DUPLICATE-TRANSITION-FRACTION`
4. `SILGM-G4-CUMULATIVE-TREE-RAW-RATIO`
5. `SILGM-G5-UNIT-WIDTH-OCCUPANCY-FRACTION`

Search-change endpoints:

1. `SILGM-E1-CANONICAL-BEST-CHANGE`
2. `SILGM-E2-TOPSET-CHANGE`
3. `SILGM-E3-RANKING-PREORDER-CHANGE`
4. `SILGM-E4-BEST-SECOND-GAP-CHANGE`
5. `SILGM-E5-PV-PREFIX2-CHANGE`

Search contrastsはすべてpeer contrastであり、右側条件をtruth/referenceとは扱わない。

- `SILGM-SC1-DEPTH`: `D2_Q1` vs `D3_Q1`
- `SILGM-SC2-NODE-BUDGET`: `B256_Q1_MAXD3` vs `B1024_Q1_MAXD3`
- `SILGM-SC3-QUIESCENCE`: `D2_Q0` vs `D2_Q2`

## 4. Stage 0のtechnical validation

Stage 0 v1/v2はtechnical fixture expectation / fixture availabilityの問題で`TECHNICAL-INVALID`、v3はscientific computation前のverifier self-referenceで`PRECOMPUTATION-TECHNICAL-INVALID`となった。いずれもfresh scientific evidenceは生成しておらず、同一versionをrerunしていない。

Fresh-free versioned correction後のv4はPASSした。

```text
trigger commit = 422acd162877daceacac4189e0edcef266480c2d
workflow run = 33709314157
job = 100505215270
lease artifact = 9876354259
lease ZIP SHA-256 = 2a06fcfdcb56f92e84538dc27815e5cfe39a3f0f2ad8bc67532ee888c040ccbb
result artifact = 9876361267
result ZIP SHA-256 = 2da957aa86e149a55783246280adccbe4e3e5b458db6cec4eeda63f589326975
canonical result SHA-256 = c33f3979f068879913123447c66ae2d81146724d87db2b5f72f021bbe36348c8
deterministic technical core = fc44c69eb5c164143af821da872a1b2f9d842f1369e9dcd98a1cdd14b42ec076
Stage disposition = STAGE0-PASS
```

Stage 0は技術的実現可能性のみを検証し、G3-07 scientific associationのpositive/negative/null evidenceを生成していない。

## 5. Stage 1 developmentの結果

Frozen population:

```text
seed block = 31710001..31710256
target = Namua 24 + Mtaji 24 = 48 roots
max source ply = 80
minimum selectable ply = 16
minimum legal moves = 2
one selected root per source trajectory
phase assignment = stage-specific SHA-256 parity
root selection = stage-specific minimum SHA-256 rank
selection = geometry-blind / search-blind / outcome-blind
seed extension = prohibited
```

Fresh-free preauthorization audit後、Stage 1を別途authorizeし、exactly one fresh executionを行った。

```text
trigger commit = 487a8a760f47862a24d2dd22abc1c20276221a6e
authorization commit = bb6e1ebe7cd3b1ff4c0b391c0a716617a0d9faa2
tooling commit = 11d7b29234f5eddfd30fa85821efaf4ac1e4ce15
workflow run = 33714665861
job = 100521197935
lease artifact = 9878071217
lease ZIP SHA-256 = 1266666a9c3583a38def48d5df8734e0dcc8a1cf0a0e7e53435d75e850db7888
result artifact = 9878178694
result ZIP SHA-256 = e6908832c5617cc3a015996d2ea59cee1ba247a6078b64cd408d85697d1fdc03
canonical scientific-result SHA-256 = 20209db1b87bdf3e87f48f1968014154d6f2862820eabea40be645cd1f924470
selected roots = Namua 24 + Mtaji 24 = 48
selection exact = true
selection core = 06a230341ea10fd20b60739061067240dd5696f155b2a25e3004619ffb27903c
measurement core = 713c11f110f04f8bb82fd8dbde0873c4114728615383dcd701f0d10be7b60288
development core = 3017dbf4cf10736a8c9a5b923e0422a3e46867f06dd7a74c4545f684166567b7
scientific core = e347099b3506f323351066ccc589942101fa48b1d8e0293dbf8a614f0063f74a
Stage disposition = STAGE1-PASS
```

Stage 1は15 contrast×endpoint slotのうち8 candidateをpromotionした。promotionはformal confirmationではなく、Stage 2へ持ち込むprospectively frozen hypothesis identityの選択である。

## 6. Stage 2 firewallとformal input

Stage 2はStage 1のmeasurement rowsやnon-promoted candidate detailsをselection inputとして再利用しなかった。formal inputには次のみを持ち込んだ。

- Stage 1でpromotionされた8 candidateのcontrast / endpoint / metric / phase-specific threshold / direction
- Stage 1 selected root identity 48件のidentity-only exclusion manifest

Stage 1 identity exclusion manifestは次のとおりである。

```text
path = prereg/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json
Git blob = 3c9c67def9925df85b14287ef4fd931f099dca2a
identity rows = 48
scientific outcome fields retained = false
```

Stage 2 formal input:

```text
path = prereg/STAGE_2_FORMAL_INPUT.json
Git blob = 70c7d841cf71183e6733565bf36a76e4a62047d4
formal input core SHA-256 = 6c796df950f05df2b193ab0a5d2a6f74dfa179745a9953d337f72a745cc5d0b0
promoted candidates = 8
Stage 1 identity exclusions = 48
Stage 2 fresh seed access during materialization = false
```

最初のinput-materialization v1はrepository上のStage 1 gzip transport encoding不整合でfresh-freeにfail closedした。Stage 2 seed accessは0であった。v2はidentity-only manifestとcompact Stage 1 summaryからformal inputを再構成しPASSした。

```text
v2 workflow run = 33716060972
v2 artifact ID = 9878546389
v2 artifact ZIP SHA-256 = 26bb6355a589fe4d47efc6a2a111dc112f35cc95e114e1145f5f7fea8a578b97
```

## 7. Stage 2のauthorizationと実行

Stage 2 preauthorization static auditの記録:

```text
workflow run = 33716437350
artifact ID = 9878673914
artifact ZIP SHA-256 = 2fbcbf0cf2b3241e918a4f3fb31314b5f397cc246075b845a2942dddaed6782b
audit result SHA-256 = 318e709fa1e05579c422a9111da3ca925d32824819bcad72a30ee321123ec0bd
audit = STAGE2-PREAUTH-STATIC-AUDIT-PASS
promoted candidates checked = 8
Stage 1 identity exclusions checked = 48
Stage 2 seed access = false
protected depth-10 access = false
```

このPASS後に別途formal authorization reviewを実施し、`STAGE2-AUTHORIZED`を固定した。

```text
authorization review commit = 49a5bf7aa33e69c20ed79cf64a0d18eca628426a
scientific tooling commit = ba35c4ad817795158424f577c51c1e689b1d29d8
machine authorization commit = db439ed6ba74184b5f522c32116259ecbf76a005
execution trigger commit = 872da6b0507b91845516ca54da0da8058844d893
authorization nonce = SILGM-S2-AUTH-2026-09-03-V1-01
```

formal scientific executionは次の1回だけ行った。

```text
workflow run = 33716884975
job = 100527827048
lease artifact = 9878826404
lease ZIP SHA-256 = 28a365ea1736d4924131f51b507547ffeea25c1396c35031cffaae145fea578c
result artifact = 9879091983
result ZIP SHA-256 = 5ada1dcb0ceab7d89ea0bfc78410a14c3875ba03a01e31a243950706349de70a
canonical scientific-result SHA-256 = 05a87f0562a1e2e4ed8043107bd3212d2a223548b817d6922057668fb8cc49f9
canonical scientific-result bytes = 733559
selection SHA-256 = c78f561bb6fdeadad50c968313073f8d0b6cc87c94e1e961c28e43ab7389bd89
measurement core = 525efb5fff335bf22b0cf1a6f52e2944958055449bc80457af03c0e385c7ead5
formal core = 91d02434fbe6ba19784e4ef0d0c4099d54821a969b8ada8ac23d883d6712deda
scientific core = 2355969853b4e4d7faea063cee828f9713f94c38d8e0fed68386638717184849
Stage disposition = STAGE2-PASS
```

Population:

```text
seed block = 31720001..31720384
target = Namua 36 + Mtaji 36 = 72 roots
selected = Namua 36 + Mtaji 36 = 72 roots
selection production/independent exact = true
seed extension = none
```

Resource gatesもPASSした。

```text
elapsedMs = 757726.688248
peakRssBytes = 359571456
max observed per-root combined elapsedMs = 109569.391294
result bytes = 733559
```

## 8. formal test（正式検定）

Stage 2ではStage 1でfrozenされたphase-specific thresholdを変更せず、各candidate・各phaseでgeometryを`HIGH` / `LOW`へ分類した。

- `HIGH`: metric > frozen threshold
- `LOW`: metric < frozen threshold
- equality: formal testから除外

Candidate support gate:

```text
HIGH >= 10 per phase
LOW >= 10 per phase
changed >= 6 per phase
unchanged >= 6 per phase
```

Estimable candidateは、phase別marginを固定したhypergeometric distributionをexact rationalで構成し、Namua/MtajiのPMFをconvolutionした。Stage 1でfrozenされたdirectionのone-sided tailを使用した。

Multiplicityはestimable 7 candidateに対するHolm-Bonferroni、FWER=`1/20`である。

## 9. formal result（正式な結果）

| # | Contrast | Endpoint | Geometry | Frozen direction | Formal label | Exact p | Holm rank / threshold |
|---|---|---|---|---|---|---|---|
| 1 | depth | ranking preorder change | G1 root legal width | HIGHER-IN-HIGH | **CONFIRMED** | `78185629/18730440540` | `3 / 1/100` |
| 2 | depth | PV prefix2 change | G2 cumulative tree occurrence | LOWER-IN-HIGH | NOT-CONFIRMED | `17101731932531/18919177209000` | `7 / 1/20` |
| 3 | node budget | ranking preorder change | G1 root legal width | HIGHER-IN-HIGH | **CONFIRMED** | `467/107003475` | `1 / 1/140` |
| 4 | node budget | best-second gap change | G2 cumulative tree occurrence | HIGHER-IN-HIGH | NON-ESTIMABLE | — | — |
| 5 | quiescence | canonical-best change | G2 cumulative tree occurrence | HIGHER-IN-HIGH | NOT-CONFIRMED | `11944153/644331280` | `4 / 1/80` |
| 6 | quiescence | TopSet change | G2 cumulative tree occurrence | HIGHER-IN-HIGH | NOT-CONFIRMED | `11944153/644331280` | `5 / 1/60` |
| 7 | quiescence | ranking preorder change | G1 root legal width | HIGHER-IN-HIGH | **CONFIRMED** | `96013549/4043768323725` | `2 / 1/120` |
| 8 | quiescence | PV prefix2 change | G1 root legal width | HIGHER-IN-HIGH | NOT-CONFIRMED | `9283557/59446375` | `6 / 1/40` |

### 9.1 `CONFIRMED` — depth × ranking preorder × root legal widthの結果

Candidate:

`SILGM-SC1-DEPTH | SILGM-E3-RANKING-PREORDER-CHANGE | SILGM-G1-ROOT-LEGAL-WIDTH | HIGHER-IN-HIGH`

Frozen G1 thresholds:

```text
Namua = 4
Mtaji = 3
```

Support:

```text
Namua: HIGH=20, LOW=11, equal=5, changed HIGH=16, changed LOW=4
Mtaji: HIGH=13, LOW=14, equal=9, changed HIGH=8, changed LOW=4
```

Formal result:

```text
exact p = 78185629/18730440540
Holm rank = 3
Holm threshold = 1/100
Holm = PASS
label = CONFIRMED
```

したがって、frozen formal populationでは、G1 root legal widthがphase-specific thresholdより高い局面に、`D2_Q1`と`D3_Q1`の間のranking preorder changeがformalに集中した。

### 9.2 `CONFIRMED` — node budget × ranking preorder × root legal widthの結果

Candidate:

`SILGM-SC2-NODE-BUDGET | SILGM-E3-RANKING-PREORDER-CHANGE | SILGM-G1-ROOT-LEGAL-WIDTH | HIGHER-IN-HIGH`

Support:

```text
Namua: HIGH=20, LOW=11, equal=5, changed HIGH=15, changed LOW=1
Mtaji: HIGH=13, LOW=14, equal=9, changed HIGH=6, changed LOW=0
```

Formal result:

```text
exact p = 467/107003475
Holm rank = 1
Holm threshold = 1/140
Holm = PASS
label = CONFIRMED
```

したがって、frozen formal populationでは、G1 root legal widthがphase-specific thresholdより高い局面に、`B256_Q1_MAXD3`と`B1024_Q1_MAXD3`の間のranking preorder changeがformalに集中した。

### 9.3 `CONFIRMED` — quiescence × ranking preorder × root legal widthの結果

Candidate:

`SILGM-SC3-QUIESCENCE | SILGM-E3-RANKING-PREORDER-CHANGE | SILGM-G1-ROOT-LEGAL-WIDTH | HIGHER-IN-HIGH`

Support:

```text
Namua: HIGH=20, LOW=11, equal=5, changed HIGH=17, changed LOW=3
Mtaji: HIGH=13, LOW=14, equal=9, changed HIGH=9, changed LOW=2
```

Formal result:

```text
exact p = 96013549/4043768323725
Holm rank = 2
Holm threshold = 1/120
Holm = PASS
label = CONFIRMED
```

したがって、frozen formal populationでは、G1 root legal widthがphase-specific thresholdより高い局面に、`D2_Q0`と`D2_Q2`の間のranking preorder changeがformalに集中した。

## 10. `NOT-CONFIRMED`となったcandidate

4 candidateはestimableであったがHolm familywise criterionを満たさず`NOT-CONFIRMED`となった。

特にquiescenceのE1 canonical-best changeとE2 TopSet changeは、それぞれunadjusted exact p=`11944153/644331280`であったが、Holm stepを通過していない。したがって、本Studyではこれらをformal confirmationとして扱わない。

Depth × E5、quiescence × E5も`NOT-CONFIRMED`である。これらをpost-hocに別threshold・別metric・別directionで救済しない。

## 11. `NON-ESTIMABLE`となったcandidate

`SILGM-SC2-NODE-BUDGET | SILGM-E4-BEST-SECOND-GAP-CHANGE | SILGM-G2-CUMULATIVE-TREE-OCCURRENCE | HIGHER-IN-HIGH`

はMtaji stratumで:

```text
HIGH = 14
LOW = 22
changed = 5
unchanged = 31
```

となり、frozen `changed >= 6` gateを満たさなかった。このためformal p-valueは計算せず`NON-ESTIMABLE`とした。

観測されたcount patternを理由にgateを緩和したりseedを追加したりしない。

## 12. 全結果を合わせた解釈

3件のCONFIRMED candidateはすべて、同じgeometry descriptor `G1 root legal width` と同じsearch endpoint `E3 ranking preorder change` の組合せであり、depth・node-budget・quiescenceという3種類のpeer perturbationそれぞれで`HIGHER-IN-HIGH`方向が確認された。

これは、少なくともprospectively fixed Stage 2 populationと本Studyのsearch contract内では、**rootで利用可能な合法手数が多い局面ほど、search-conditionを変更したときにroot move rankingのpairwise preorderが変化しやすい領域へ集中する**というbounded structural associationと整合する。

ただし、3 contrastを事後的に一つの新しいomnibus endpointへ統合したわけではない。formal recordはあくまで3つのcandidate-level confirmationである。

また、G2 cumulative tree occurrenceについてStage 1からformalに持ち込まれた複数candidateは、formal confirmationに至らなかったか、1件はnon-estimableであった。これはG2が一般に無関係であることを証明するものではなく、本Studyのfrozen hypothesesがformal criteriaを満たさなかったという結論に限定される。

## 13. 解釈上の境界

本Studyからformalに主張できるのは、prospectively fixed Stage 2 population、RAW-only relative depth-5 geometry、frozen search-condition contrastsにおけるcandidate-level associationである。

以下はformal conclusionではない。

- root legal widthがsearch instabilityを因果的に発生させる
- legal move数が多い局面ほどgame-theoretically難しい
- ranking preorder changeが探索失敗や悪手を意味する
- depth 3 / budget 1024 / q2がdepth 2 / budget 256 / q0より正しい
- canonical-best changeやTopSet changeが存在しない
- NOT-CONFIRMED candidateにassociationが一切存在しない
- NON-ESTIMABLE candidateがnullである
- G1がBaoの戦略的複雑性の完全な尺度である
- G2がsearch stabilityと無関係である
- confirmed associationがhuman difficultyを予測する
- confirmed associationがposition value / win probabilityを示す
- Namua→Mtaji transitionが確認されたassociationを因果的に生む
- relative depth 5のgeometry patternがdeeper exact game treeでも維持される
- standard initial RAW-root complete exact depth-10 holdoutについて何らかの結論が得られた

## 14. protected deeper holdoutの状態

standard initial RAW-root complete exact depth-10 holdoutは、次の状態を維持する。

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

本Studyはこのholdoutを生成・read・partial generate・resource probeしていない。

## 15. no-rescue / execution integrityの確認

```text
Stage 1 = 1 authorized / 1 actual scientific execution
Stage 2 = 1 authorized / 1 actual scientific execution
same-evidence scientific reruns after fresh access = 0
Stage 1 seed extension = 0
Stage 2 seed extension = 0
```

両scientific stageは、stage-specific authorization、durable pre-computation lease、frozen source binding、production/independent separation、artifact-before-mirror、no automatic rerunを用いた。

Stage 2ではfirst fresh generation/read時点でno-rescue boundaryをcrossしており、その後candidate、threshold、direction、support gate、formal test、multiplicity ruleを変更していない。

## 16. closure（終了状態）

G3-07 / SILGM-STUDY1のscientific executionは完了した。

最終的なrepository lifecycle status:

**`CLOSED / FORMAL-COMPLETE`**

Formal inferential record:

- **depth × E3 ranking preorder × G1 root legal widthは`CONFIRMED / HIGHER-IN-HIGH`**
- **node-budget × E3 ranking preorder × G1 root legal widthは`CONFIRMED / HIGHER-IN-HIGH`**
- **quiescence × E3 ranking preorder × G1 root legal widthは`CONFIRMED / HIGHER-IN-HIGH`**
- 4 candidates = NOT-CONFIRMED
- 1 candidate = NON-ESTIMABLE

今後このStudy自体のseed追加、rerun、candidate救済、threshold変更、direction変更、endpoint再定義は行わない。追加検証が必要な場合は、新しいprospective Study/versionとして独立にauthorizeする。

本closure作成時点ではresearch branch上の研究完了記録であり、**その時点ではmainへの統合を意味しなかった**。その後、ユーザーの明示的指示を受け、2026-09-03にresearch branch tip `7f14538aa0ec3edd2045649025715219ffea17ec` を`main`へfast-forward統合した。これはrepository lifecycleの後続更新であり、G3-07のscientific result、formal labels、threshold、seed、claim boundaryを変更しない。
