# G3-05 / BECT-STUDY1 — 最終報告

更新日: 2026-09-02

## 1. Formal decision

```text
Study = BECT-STUDY1
Program position = Research Generation 3 / G3-05
Study status = CLOSED / TECHNICAL-INVALID
Stage 0 v1 = BECT-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID
Stage 0 v2 = BECT-S0-TECHNICAL-2026-09-02-v2 / STAGE0-PASS
Stage 1 = BECT-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
Stage 2 = BECT-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31510001..31510240 / CONSUMED
Stage 2 seed = 31520001..31520384 / NOT CONSUMED
formal promoted candidate set = []
protected standard-root complete exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

BECT-STUDY1は、同一trajectory上のbounded RAW local game-tree geometryを時間方向に測定し、branch expansion / compression / persistence / reversal等を再現可能な局面transitionとしてprospectively検証するResearch Generation 3 / G3-05の独立研究として開始した。

Stage 0 v2はtechnical validationをPASSした。Stage 1はfresh development evidenceをexactly one authorized executionで生成したが、bounded enumeration中にfrozen engine semanticsの`relay-limit` technical errorが発生し、valid Stage 1 development summaryへ到達しなかった。

fresh scientific access後であるため、同一seed/evidenceをimplementation修正後に再実行して救済することはno-rescue ruleに反する。したがってformal decisionは **`CLOSED / TECHNICAL-INVALID`** とする。

## 2. Prospective scope

Representation contract:

```text
representation = RAW-ONLY
relative horizon = 5
validated transforms = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
primary experimental unit = source trajectory
analysis roots = plies 16..63 inclusive
```

Frozen level endpoints:

1. `BECT-M1-ROOT-LEGAL-WIDTH`
2. `BECT-M2-CUMULATIVE-TREE-OCCURRENCE`
3. `BECT-M3-GLOBAL-DISTINCT-RAW-STATES`
4. `BECT-M4-CUMULATIVE-TREE-RAW-RATIO`
5. `BECT-M5-DUPLICATE-TRANSITION-FRACTION`
6. `BECT-M6-UNIT-WIDTH-OCCUPANCY-FRACTION`
7. `BECT-M7-BRANCH-REOPENING-FRACTION`
8. `BECT-M8-BRANCH-EXTINCTION-FRACTION`

Adjacent deltas are exact rational. Event grammar uses exact sign only, with no magnitude threshold, and classifies onset / persistence / reversal / stall within phase-consistent windows.

Frozen Stage 1 population:

```text
seed block = 31510001..31510240
target trajectories = 10
analysis roots per trajectory = 48
target roots = 480
selection = seed-ascending first eligible trajectories
replacement = prohibited
```

## 3. Prospective clarifications and evidence firewall

Before fresh Stage 1 evidence, two implementation ambiguities were prospectively resolved without changing the scientific endpoint/test contract.

- M5 denominator = `sum uniqueTransitionCount[d], d=0..4`
- candidate coverage requires the metric to be defined at all 48 analysis roots of all 10 selected trajectories
- full trajectory / opening prefix / trajectory segment / adjacent-root-pair / event-window identities were deterministically fixed before fresh access

Upstream identity-only firewall:

```text
identity core SHA-256 = 5b8246baf0f0b13fdfbc40b55bf3298895e7f0da660ca6b1275880361c4b7417
RAW-root identities = 124
trajectory identities = 124
opening-prefix identities = 67
scientific outcome fields retained = false
G3-03 diagnostic scientific fields retained = false
G3-04 scientific outcome fields retained = false
```

G3-03のtechnical-invalid diagnostic valuesおよびG3-04のconfirmed direction/valueはBECT candidate selectionやendpoint definitionへ使用していない。

## 4. Stage 0 technical validation

Stage 0 v1はfixed technical pair 24->25がtechnical trajectoryに存在しなかったためtechnical-invalidとなり、rerunしていない。

Stage 0 v2はscientific contractを変更せずtechnical fixture root-selection ruleだけをversioned refreezeした。

```text
run = 33632094597
artifact ID = 9847240252
artifact ZIP SHA-256 = ac0b114f40e610b2353c03757a3e69839fcea4674a035a5935e795d82571292f
technical seed = 31500001 / prohibited from scientific use
measured root pair = 22 -> 23
deterministic technical core = f446b41b33910071cdef310bedd53e734e19d38dca7083b6efe9504a6bdbe716
result = STAGE0-PASS
```

Stage 0 v2ではtrajectory replay、adjacent successor binding、overlapping-window semantics、repeated RAW identityのtime-index semantics、production/independent reconstruction・eligible family・BECT level equality等をPASSした。

## 5. Stage 1 authorization and exactly-one execution

Fresh-free preparation:

```text
identity firewall materialization = 33634116550 / PASS
identity firewall exact mirror = 33634259594 / PASS
static audit = 33635090198 / PASS
tooling smoke v2 = 33635443176 / PASS
source validation = 33635524477 / PASS
durable lease-path smoke = 33635710262 / PASS
scientific workflow executions before authorization = 0
```

Authorization:

```text
authorized scientific content HEAD = 5ba3706193a06902650b82f1232d19bb2cee2c1e
authorization commit = 5cceaeeece7c6d7949815a47b7ef918bbae72e59
authorization nonce = BECT-S1-AUTH-2026-09-02-V1-01
maxScientificExecutions = 1
trigger commit = 75b29fd33215bd98652613975c5b0c900f065b9d
```

Execution:

```text
workflow run = 33636606641
lease job = 100268940443 / success
scientific job = 100268996072 / process exit 2 after canonical TECHNICAL-INVALID result
lease commit = bf1f8a5940bfb87f8c92d482728aa89ce398b749
authorized scientific executions = 1
actual scientific executions = 1
fresh access started = true
seed block consumed = true
no-rescue boundary crossed = true
```

Stage 1をrerunしていない。

## 6. Stage 1 observed technical result

Canonical Stage 1 result:

```text
stageDisposition = TECHNICAL-INVALID
technicalError = relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529
```

Telemetryにはfirst selected trajectoryの25 analysis roots、ply 16..40が保存された。

この25 rootsについては:

```text
production / independent scientificExact = true for all 25
frozen per-root resourcePass = true for all 25
maximum observed peak RSS = 233222144 bytes
Stage elapsed before abort = 298359.133611 ms
```

しかし、その後のbounded enumerationで`relay-limit` errorが発生したため、runnerはprospectively fail-closedした。10 trajectories全体のvalid development summary、candidate onset prevalence、trajectory balance、promotion gatesは完遂されていない。

したがってpartial telemetryからformal candidateをpromotionしない。

Formal promoted candidate set:

**`[]`**

## 7. Durable artifact and exact-byte mirror

Durable Actions artifact:

```text
artifact ID = 9849245665
artifact name = bect-stage1-development-result-33636606641
artifact size = 4081 bytes
ZIP SHA-256 = 0c99d05c1983a35996e283dee379e65848a8df98dda46989053ebd46873cfbcc
```

Canonical file SHA-256:

```text
scientific-result.json = a21ad5449dfa090e4ff2ed87ebc64a48b5fb0755eabd0dcfe375358bde7d0b96
telemetry.json = 0608c9f035a19c4908ba02d0b462e2e0f4ca08226df3ec1062d2086dbca7f2b4
execution-summary.json = b54f441cadac0252dc15deac07c90974bc28e18d26d2dd3934b3fb6707fb352f
```

Exact-byte mirror:

```text
mirror workflow run = 33637372364
mirror commit = ac2bd2ca101a9002c69131c2c39ebbfbb98368a1
scientific recomputation = false
```

artifactはscientific process exit後もdurably preservedされ、repository mirrorでは同じscientific computationを再実行していない。

## 8. Technical-invalid cause and interpretation

Observed failureは、depth-5 bounded RAW reconstructionを進めている途中でengine enumerationが`relay-limit` stateへ到達したことによる。

この結果からformalに言えるのは、prospectively frozen Stage 1 executionがそのtechnical conditionのためvalid complete development datasetを生成できなかったことである。

以下をformalに主張してはならない。

- branch expansion/compression transitionがBaoで一般的に存在する／存在しない
- persistenceまたはreversalが特定phaseで優勢である
- M1-M8のいずれかが時間方向に系統的変化する
- partial telemetryの局所方向がStage 1 population全体を代表する
- geometry transitionがsearch difficulty、best-move clarity、tactical forcing、strategic simplicity、人間難度、勝率を意味する
- depth 5の途中観測がより深いgame treeへ一般化する

25 rootsのpartial telemetryはtechnical provenanceとして保存するが、confirmatory/development evidenceとしてcandidate promotionへ使用しない。

## 9. No-rescue closure

Stage 1 seed block `31510001..31510240`はconsume済みで、no-rescue boundaryはactiveである。

禁止事項:

- same Stage 1 evidenceのrerun
- relay-limit handlingを修正した同一seed再評価
- seed extension / root replacement / favorable subset selection
- endpoint / event grammar / horizon / representation / resource ceiling / promotion gateの事後変更
- partial telemetryをformal promoted candidateへ格上げすること
- Stage 2を実行すること

このmethodological failureは、将来の**別のprospective independent study**でrelay-limit handling / reachable-domain contractを再設計する理由にはなり得るが、BECT-STUDY1自体の救済許可ではない。

## 10. Stage 2 and protected evidence

Stage 2 authorization prerequisiteであるvalid Stage 1 completionとnonempty frozen promoted candidate setを満たさない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = 31520001..31520384 / NOT CONSUMED
```

Standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

## 11. Final closure

```text
BECT-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
same-evidence rescue = PROHIBITED
main integration at scientific closure = NOT PERFORMED
```

BECT-STUDY1のtechnical-invalid resultはnegative/null scientific findingではない。これはprospectively frozen execution contractの下でformal scientific evaluationへ到達できなかったことを示すtechnical validity resultである。

<!-- BECT-POST-CLOSURE-INTEGRATION-ADDENDUM -->
## Post-closure repository lifecycle addendum

Scientific closure時点ではmain integrationは未実施だった。その後、明示的ユーザー指示を受けてresearch head `49f868103b186c8bc00a188afd185a620a797e55` のfast-forward統合が完了した。このrepository lifecycle更新はBECT-STUDY1のscientific result、technical-invalid disposition、formal promoted set、no-rescue boundaryを変更しない。
