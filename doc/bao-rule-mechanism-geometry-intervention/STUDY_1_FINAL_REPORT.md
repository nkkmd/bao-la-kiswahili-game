# G3-06 / BRMGI-STUDY1 — 最終報告

更新日: 2026-09-03

## 1. formal decision（正式判断）

```text
Study = BRMGI-STUDY1
Program position = Research Generation 3 / G3-06
Study status = CLOSED / TECHNICAL-INVALID
Stage 0 v1 = BRMGI-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID / NO RERUN
Stage 0 v2 = BRMGI-S0-TECHNICAL-2026-09-03-v2 / STAGE0-PASS
Stage 1 = BRMGI-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
Stage 2 = BRMGI-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31610001..31610256 / CONSUMED
Stage 2 seed = 31620001..31620384 / NOT CONSUMED
formal promoted candidate set = []
no-rescue boundary = CROSSED / ACTIVE
protected standard-root complete exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

BRMGI-STUDY1は、capture、nyumba stop/use、reserve exhaustion / Namua→MtajiといったBao固有のrule-semantic eventに伴うbounded RAW local game-tree geometryのmove-conditioned / event-conditioned変化を、LGTGMIVのformal-eligible F1-F5 instrumentだけでprospectively検証する独立Studyとして開始した。

Technical Stage 0 v2はPASSしたが、fresh Stage 1のexactly-one authorized executionでproduction / structurally independent implementationのevent-unit selectionが一致せず、mandatory verification gateを満たさなかった。fresh evidenceアクセス後であるためselection実装を修正して同じseedを再実行することはno-rescue ruleに反する。

したがってStudyは **`CLOSED / TECHNICAL-INVALID`** として閉じる。これはrule eventとgeometryの関係に対するnegative/null scientific resultではない。

## 2. formal scientific scope （適用範囲と制限）

Representation contract:

```text
representation = RAW-ONLY
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
relative local horizon = 5
validated transform set = []
canonicalization / symmetry quotient = NOT AUTHORIZED
eligible measurement families = LGTGMIV F1,F2,F3,F4,F5
```

Formal event families:

1. `BRMGI-E1-CAPTURE-SOURCE-MOVE`
2. `BRMGI-E2-NYUMBA-USE-VS-STOP`
3. `BRMGI-E3-RESERVE-EXHAUSTION-NAMUA-TO-MTAJI`

`BRMGI-E0-NAMUA-RESERVE-DECREMENT-NONTRANSITION`はcontrol/descriptive-onlyとして固定した。

Formal endpoint universe:

1. `BRMGI-M1-ROOT-LEGAL-WIDTH`
2. `BRMGI-M2-CUMULATIVE-TREE-OCCURRENCE`
3. `BRMGI-M3-GLOBAL-DISTINCT-RAW-STATES`
4. `BRMGI-M4-DUPLICATE-TRANSITION-FRACTION`
5. `BRMGI-M5-CUMULATIVE-TREE-RAW-RATIO`
6. `BRMGI-M6-UNIT-WIDTH-OCCUPANCY-FRACTION`

Candidate universeはE1/E2/E3 × M1..M6の18候補。fresh evidence後のevent/metric追加やthreshold探索を認めない設計だった。

## 3. 解釈と因果主張の境界

Historical agenda titleの`Intervention`はgeneric causal claimをauthorizeしない。

現engineではcaptureはmandatoryであり、capture可能rootにlegal non-capture alternativeは存在しない。またNamuaのreserve decrementとNamua→Mtaji transitionはrule semantics上mechanically linkedしている。

したがって本Studyが仮にformal confirmationへ到達した場合でも、許可されるclaimは:

- move-conditioned structural change
- event-conditioned geometry difference
- bounded association

に限定していた。

以下は最初からauthorizeしていない。

- 一般的なcausal effect / causal rule mechanism
- long-horizon outcome effect
- game-theoretic forcing
- best-move clarity
- search ease / stability
- strategic value / win probabilityとの関係
- human difficulty
- relative depth 5を超える一般化

## 4. Stage 0のtechnical validation

### 4.1 v1 — `TECHNICAL-INVALID / NO RERUN`となった経緯

Stage 0 v1はexactly one authorized technical executionで開始したが、synthetic nyumba fixtureが34 seedsしか表現しておらず、LGTGMIVのRAW representation invariant `represented seed total == 64`を満たさなかった。

```text
workflow run = 33677691455
lease artifact = 9864980761
lease ZIP SHA-256 = e10c9e3882c277e98e130c28700518431b39b7a811a77c95d2dc906a5f074bd5
result = TECHNICAL-INVALID / NO RERUN
fresh scientific evidence = false
```

同じv1をrerunせず、fresh-freeでtechnical fixtureだけを修正した別version v2をprospectively refreezeした。

### 4.2 v2 — `STAGE0-PASS`となった結果

v2ではnyumba fixtureを64-seed invariantへ適合させ、科学contract・Stage 1/2 seed・event family・endpoint・population・formal ruleは変更していない。

Pre-execution static audit:

```text
run = 33677942576
audited head = f8e9eec83ee041d11f2c028259367fc5530ad462
artifact = 9865076199
ZIP SHA-256 = 3db1200db55181a96a2e74cfc6a1db4c3eceafb418159a4d1b42ee4134db3d76
```

Formal v2 execution:

```text
authorization commit = 5ab33517c43ec11135488823e84c6c6859643415
trigger commit = 9885e7fe470e82c58cf60cca91fdc4518499eb13
workflow run = 33678004793
job = 100407435042
result = STAGE0-PASS
```

Durable artifacts:

```text
lease artifact = 9865100897
lease ZIP SHA-256 = f5542580f85cf15c4d9250cb11c4df5daf98e1eaec766f89c25da5082e799a18
result artifact = 9865102178
result ZIP SHA-256 = 06015d340a3a0de4703af2755c1a265153fef08393dc43fcd38e1285fb1295ff
result file SHA-256 = 4089bc0acd8b719e23a21a2605b34281d13992c2cc75dfd9dc5474c8bb2eade3
deterministicCoreSha256 = 326d6fa89f1c53af2d33c0d0fddf5dfe15d197442921a5d02aa6254423ef5b63
```

T1-T10 technical gatesは全てPASS。production / independent technical geometry reconstruction SHA-256は双方:

`ed70d0b1ed44a77813150a66709660e075271126a852452fa534f41b39fab90a`

で完全一致した。

## 5. Stage 1前のclarificationとfreshness firewall

Fresh Stage 1前に、actual source trajectoryのmove universeとE2 nyumba variant enumerationを明確に分離した。

- actual trajectory = `engine.legalMoves`
- E2 stop/use arm enumerationだけ = `engine.moveVariants`
- E2 counterfactual armはsource trajectoryを分岐・変更しない
- E1/E3はactual source moveだけにbindする

Machine-readable clarification:

`prereg/STUDY_1_SPEC_CLARIFICATION_1.json`

Upstream identity firewallはscientific outcomeを保持せず、既存identity-only manifestに加えてG3-05 partial telemetryから`rootRawSha256`だけを抽出した。

```text
root RAW identities = 149
source trajectory identities = 124
opening-prefix identities = 67
G3-05 partial root identities retained = 25
scientificOutcomeFieldsRetained = false
g305PartialScientificFieldsRetained = false
identityCoreSha256 = a225b8c15d6da956dd1afbdc0a64c6d40b9c77add2e464d34f11dfc1278e2182
```

Firewall materialization:

```text
run = 33678555012
artifact = 9865308337
ZIP SHA-256 = 5f625d34f421da493fee1bcfc463687a26d9bd01d29a9bf838e3d1c6637f1ec7
firewall file SHA-256 = 7806b921b878cc3a54403cda360c06e148525f4d38b6af8007d4f5a9a3156c16
exact mirror commit = 6029679c7a218ca35bb1da343d86670285070d7a
```

## 6. Stage 1の準備とauthorization

Stage 1 production / independent source replay・event unit construction・measurement aggregationを別実装した。

Preauthorization static audit:

```text
run = 33679102557
audited scientific-content HEAD = d90ab9e00eda1d52535ae72e44806fcfc443f2a9
artifact = 9865516597
artifact ZIP SHA-256 = 60bc4216ce7673f678cac31c312f6ca1e25414cbb0d45bb870780c98ddb5a01a
result = PASS
```

このauditはunarmed runnerがauthorization不存在でseed access前にfail closedすること、production/independent分離、actual `engine.legalMoves`、E2 variant分離、identity firewall、resource/fail-closed gates、single trigger/concurrency/artifact pathを確認した。

Stage 1 scientific authorization:

```text
authorization commit = 1edc8886ffb0d2b65c7f4c1c8fb002be0abbe6e7
trigger commit = 61cb2ed31c26151edf19b9c1eb49f6b22b935898
authorization nonce = BRMGI-S1-AUTH-2026-09-03-V1-01
max scientific executions = 1
seed = 31610001..31610256
```

## 7. Stage 1のformal technical result

fresh Stage 1 executionは次の1回だけ行った。

```text
workflow run = 33679269612
job = 100411609044
authorized scientific executions = 1
actual scientific executions = 1
fresh Stage 1 seed access = true
Stage 1 seed consumed = true
no-rescue boundary = CROSSED / ACTIVE
```

Authorization chainと全source blob bindingはPASSし、fresh computation前にlease artifactを保存した。

```text
lease artifact = 9865580015
lease ZIP SHA-256 = 9308c696f221cfa760b288a725837b4566e82231ea955185bea1e6cf2a3bb082
```

Canonical result:

```text
stageDisposition = TECHNICAL-INVALID
technicalError = production/independent selection mismatch
relayLimitInsideBoundedReconstruction = false
formalPromotedCandidateSet = []
```

Failureはgeometry measurement前に発生した。

```text
unitTimings = []
productionResources = null
independentResources = null
stageElapsedMs = 943.954495
maxRssBytes = 103530496
stageElapsedPass = true
```

したがってfresh M1-M6 development summary、candidate direction、promotion gateをformalに評価できなかった。

## 8. durable Stage 1 result （Stageの記録）

```text
result artifact = 9865581198
artifact ZIP SHA-256 = 3f43ff832afaae5fc0a1d6756dcc9fa0101eb5a67befc7f3cdc2d1536bdb5d2a
scientific-result.json SHA-256 = a5a2f385699cd8bc629e1d1594005841778a82c7d1ca18bb7eb5bcfeb0d41452
telemetry.json SHA-256 = 141f4687528ce62fe60052c4c9ecff217a6a929a43190e4f5a507f8d4abc77f0
execution-summary.json SHA-256 = a3fdf314f12d6853e337f13b6c252eaebf27edb69c96dab53829b033ece5ca77
exact-byte mirror workflow = 33679517438
exact-byte mirror commit = b8f9fe0e2d5008be2d41b3b8271fa325144f82fc
scientific recomputation for recovery = false
```

## 9. no-rescueの帰結

Stage 1 seedはfresh accessによりconsume済みである。以下は禁止する。

- 同じStage 1 seed / evidenceを用いるrerun
- production/independent selectorを修正して同じpopulationを再評価
- seed extension
- event / root / controlのreplacement
- source move policy変更
- E1/E2/E3 definition変更
- endpoint M1-M6追加・置換
- favorable subgroup / event familyのselection
- promotion threshold/resource ceiling変更
- partial selection provenanceからscientific candidateをpromotion

Formal promoted candidate setは **`[]`**。

## 10. Stage 2の状態

Stage 2 authorization prerequisiteであるvalid Stage 1 completion + nonempty promoted candidate setを満たさない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed 31620001..31620384 = NOT CONSUMED
```

Stage 2を実行しない。

## 11. 科学的結論

BRMGI-STUDY1はrule-conditioned geometryのpositive/negative scientific conclusionへ到達していない。

Formalに言えるのは、prospectively frozen G3-06 designのStage 1がproduction / independent event-unit selection agreement gateでtechnical-invalidとなり、fresh development candidate evaluationを成立させられなかったことだけである。

このtechnical-invalid resultを、capture / nyumba / reserve / Namua→Mtajiのgeometry effectが「ない」というnullへ読み替えない。同様に、candidate selection mismatchの診断をG3-07以降のscientific outcomeへpromotionしない。

## 12. protected deeper evidence （証拠の状態）

standard initial RAW-root complete exact depth-10 holdoutは、次の状態を維持する。

**`SEALED / NOT GENERATED / NOT READ`**

本Studyはこのholdoutを生成・partial generation・read・peek・trial enumerate・resource estimateしていない。

## 13. closure（終了状態）

```text
BRMGI-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
same-evidence rescue = PROHIBITED
main integration at scientific closure = NOT PERFORMED
```

G3-06はunfinished研究ではない。次のG3-07を実施する場合はseparate post-G3-06 current-state authorization reviewを必要とする。G3-06のtechnical-invalid resultはsearch-instability / geometry mechanismのpositive/negative scientific prerequisiteとして扱わない。

<!-- BRMGI-POST-CLOSURE-INTEGRATION-ADDENDUM -->
## closure後のrepository lifecycle追記

Scientific closure時点ではmain integrationは未実施だった。その後、明示的ユーザー指示を受けてaudited head `f8eda131b81f0d6e3bc9f804ddfce875c9cd8d2b` のfast-forward統合が完了した。このrepository lifecycle更新はBRMGI-STUDY1のscientific result、technical-invalid disposition、formal promoted set、no-rescue boundaryを変更しない。
