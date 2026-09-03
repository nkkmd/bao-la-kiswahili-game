# BRMGI-STUDY1 — Current Status

更新日: 2026-09-03

```text
Study = BRMGI-STUDY1
Program position = Research Generation 3 / G3-06
Program review = G3-06-AUTHORIZED
Study status = CLOSED / TECHNICAL-INVALID
review baseline remote main = 5525700937f0ada1aec39634012e8ad623e228c4
Study baseline remote main = b0cbd9f562bb803597acb313360c064dadd73299
research branch = research/g3-06-bao-rule-mechanism-geometry-intervention
Stage 0 v1 = BRMGI-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID / NO RERUN
Stage 0 v2 = BRMGI-S0-TECHNICAL-2026-09-03-v2 / STAGE0-PASS
Stage 1 = BRMGI-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
Stage 1 authorized scientific executions = 1
Stage 1 actual scientific executions = 1
Stage 1 seed = 31610001..31610256 / CONSUMED
formal promoted candidate set = []
Stage 2 = BRMGI-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = 31620001..31620384 / NOT CONSUMED
fresh G3-06 scientific evidence = ACCESSED / TECHNICAL-INVALID BEFORE GEOMETRY MEASUREMENT
no-rescue boundary = CROSSED / ACTIVE
protected depth-10 = SEALED / NOT GENERATED / NOT READ
main integration = COMPLETE / fast-forward / force=false
```

## Formal Study identity

English title:

**Bao Rule-Mechanism / Geometry Intervention Study 1 — Prospective move-conditioned exact analysis of bounded RAW local game-tree geometry change around capture, nyumba choice, reserve exhaustion, and Namua-to-Mtaji transition events**

正式日本語題目:

**Bao固有のrule-semantic eventに伴う局所ゲーム木幾何変化のprospective move-conditioned exact解析 — capture、nyumba選択、reserve枯渇／Namua→Mtaji移行を対象とするbounded RAW pre/post構造差の検証**

Historical agendaの`Intervention`はcausal claim authorizationを意味しない。本Studyのclaim classは`move-conditioned structural change`、`event-conditioned geometry difference`、`association`に限定していた。

## Frozen instrument / event boundary

```text
representation = RAW-ONLY
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
relative local horizon = 5
validated transform set = []
canonicalization / symmetry quotient = NOT AUTHORIZED
eligible families = LGTGMIV F1,F2,F3,F4,F5
```

Formal event familiesはE1 capture source move、E2 nyumba use-vs-stop、E3 linked reserve-exhaustion/Namua→Mtaji。E0 nontransition reserve decrementはcontrol/descriptive-only。Formal endpoint universeはM1 root legal width、M2 cumulative tree occurrence、M3 global distinct RAW states、M4 duplicate-transition fraction、M5 cumulative tree/RAW ratio、M6 unit-width occupancy fractionだった。

Source trajectoryは`engine.legalMoves`をcanonical orderへ並べて選択し、`engine.moveVariants`はE2 same-root stop/use armsだけを列挙するというpre-fresh clarificationを固定した。

## Stage 0 history

### v1 — TECHNICAL-INVALID / NO RERUN

Run `33677691455`。34-seed synthetic nyumba fixtureがLGTGMIVの64-seed RAW invariantを満たさずfail closed。fresh scientific evidenceは0で、v1はrerunしていない。

### v2 — STAGE0-PASS

科学contractを変更せずtechnical nyumba fixtureだけを64 seedsへ修正した別version。

```text
static audit run = 33677942576
formal run = 33678004793
authorized executions = 1
actual executions = 1
result artifact = 9865102178
result ZIP SHA-256 = 06015d340a3a0de4703af2755c1a265153fef08393dc43fcd38e1285fb1295ff
result file SHA-256 = 4089bc0acd8b719e23a21a2605b34281d13992c2cc75dfd9dc5474c8bb2eade3
deterministicCoreSha256 = 326d6fa89f1c53af2d33c0d0fddf5dfe15d197442921a5d02aa6254423ef5b63
Stage disposition = STAGE0-PASS
```

T1-T10は全PASS。production / independent technical geometry reconstruction SHA-256は双方`ed70d0b1ed44a77813150a66709660e075271126a852452fa534f41b39fab90a`で一致した。

## Upstream identity firewall

Stage 1前にidentity-only firewallをmaterializeした。

```text
root RAW identities = 149
source trajectory identities = 124
opening-prefix identities = 67
G3-05 partial root identities retained = 25
scientificOutcomeFieldsRetained = false
g305PartialScientificFieldsRetained = false
identityCoreSha256 = a225b8c15d6da956dd1afbdc0a64c6d40b9c77add2e464d34f11dfc1278e2182
materialization run = 33678555012
artifact = 9865308337
exact mirror commit = 6029679c7a218ca35bb1da343d86670285070d7a
```

G3-03 diagnostic scientific fields、G3-04 C1/C6 values/directions、G3-05 partial geometry/resource valuesはselection inputへ保持していない。

## Stage 1 preparation and authorization

Preauthorization static audit:

```text
run = 33679102557
audited scientific-content HEAD = d90ab9e00eda1d52535ae72e44806fcfc443f2a9
artifact = 9865516597
result = PASS
```

unarmed runner fail-closed、production/independent分離、actual `engine.legalMoves`、E2 variant分離、firewall、resource/fail-closed gates、single trigger/concurrency/artifact pathをPASSした。

Scientific authorization:

```text
authorization commit = 1edc8886ffb0d2b65c7f4c1c8fb002be0abbe6e7
trigger commit = 61cb2ed31c26151edf19b9c1eb49f6b22b935898
authorization nonce = BRMGI-S1-AUTH-2026-09-03-V1-01
max scientific executions = 1
```

## Stage 1 formal disposition

Exactly one fresh Stage 1 execution `33679269612`はauthorization chainとsource blob bindingをPASSし、fresh computation前にdurable leaseを保存した。その後fresh seedへアクセスし、production / independent event-unit selection比較でfail closedした。

Canonical result:

```text
stageDisposition = TECHNICAL-INVALID
technicalError = production/independent selection mismatch
relayLimitInsideBoundedReconstruction = false
formalPromotedCandidateSet = []
```

Failureはgeometry measurement開始前である。

```text
unitTimings = []
productionResources = null
independentResources = null
stageElapsedMs = 943.954495
maxRssBytes = 103530496
stageElapsedPass = true
```

したがってM1-M6のfresh development summary、event-family direction、promotion decisionは成立していない。

Durable provenance:

```text
lease artifact = 9865580015
lease ZIP SHA-256 = 9308c696f221cfa760b288a725837b4566e82231ea955185bea1e6cf2a3bb082
result artifact = 9865581198
result ZIP SHA-256 = 3f43ff832afaae5fc0a1d6756dcc9fa0101eb5a67befc7f3cdc2d1536bdb5d2a
scientific-result.json SHA-256 = a5a2f385699cd8bc629e1d1594005841778a82c7d1ca18bb7eb5bcfeb0d41452
telemetry.json SHA-256 = 141f4687528ce62fe60052c4c9ecff217a6a929a43190e4f5a507f8d4abc77f0
execution-summary.json SHA-256 = a3fdf314f12d6853e337f13b6c252eaebf27edb69c96dab53829b033ece5ca77
exact-byte mirror workflow = 33679517438
exact-byte mirror commit = b8f9fe0e2d5008be2d41b3b8271fa325144f82fc
```

## No-rescue / scientific boundary

Stage 1 seed `31610001..31610256`はconsume済み。no-rescue boundaryはactiveである。selector修正後のsame-evidence rerun、seed extension、event/root/control replacement、event/endpoint/control redesign、threshold/resource変更、partial selection provenanceからのcandidate promotionを行わない。

今回のtechnical-invalid resultから、capture / nyumba / reserve exhaustion / Namua→Mtajiがbounded geometryを変える／変えないというpositive・negative・null conclusionは導かない。G3-04 C1/C6やG3-05をrule mechanismで説明したとも解釈しない。

## Stage 2 and protected evidence

Valid Stage 1 completion + nonempty promoted candidate setがないため:

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = 31620001..31620384 / NOT CONSUMED
```

Protected standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

## Main integration

2026-09-03、監査済みresearch branch `research/g3-06-bao-rule-mechanism-geometry-intervention` を、pre-integration `main` `b0cbd9f562bb803597acb313360c064dadd73299`からaudited head `f8eda131b81f0d6e3bc9f804ddfce875c9cd8d2b`へfast-forwardした。`force=false`で実施し、squash、rebase、history rewrite、scientific rerunは行っていない。

Canonical integration checkpoint:

- `../research-generation-3/checkpoints/2026-09-03-g3-06-main-integration-complete.md`

## Closure / next program action

BRMGI-STUDY1は **`CLOSED / TECHNICAL-INVALID`**。unfinished研究として扱わない。

Canonical closure records:

- `STUDY_1_FINAL_REPORT.md`
- `checkpoints/2026-09-03-stage-1-technical-invalid-study-closure.md`
- `../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md`
- `../research-generation-3/checkpoints/2026-09-03-g3-06-technical-invalid-closure.md`

**Historical closure-time downstream boundary:** G3-06 closure時点ではG3-07を自動authorizeせず、separate post-G3-06 current-state authorization reviewを必要とした。BRMGI selection diagnosticsをvalidated scientific inputとして継承しない。このreviewは後に完了し、G3-07も独立に実施・閉鎖された。

Main integration is **COMPLETE**. Current program-level next actionは`../research-generation-3/CURRENT_STATUS.md`を参照する。現在はG3-08までclosure済みで、G3-09はseparate post-G3-08 review前の`NOT AUTHORIZED`である。
