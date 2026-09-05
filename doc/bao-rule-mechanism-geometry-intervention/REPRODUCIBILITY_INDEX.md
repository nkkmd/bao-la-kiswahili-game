# BRMGI-STUDY1 — 再現性索引

更新日: 2026-09-03

## baseline（開始時点）

```text
repository = nkkmd/bao-la-kiswahili-game
review baseline remote main = 5525700937f0ada1aec39634012e8ad623e228c4
post-authorization Study baseline main = b0cbd9f562bb803597acb313360c064dadd73299
research branch = research/g3-06-bao-rule-mechanism-geometry-intervention
Study ID = BRMGI-STUDY1
```

## 最初のprogram authorization（historical）

- `../research-program-decisions/2026-09-02-post-g3-05-g3-06-authorization-review.md`
- `../research-generation-3/checkpoints/2026-09-02-post-g3-05-g3-06-authorization-review.md`
- decision: `G3-06-AUTHORIZED`
- authorization scopeはprospective Study definitionとtechnical-only Stage 0に限った
- 最初のreview時点のfresh Stage 1は`NOT AUTHORIZED`だった。その後、Stage 0 PASSとpreauthorization tooling auditを経て、Stage 1を別途exactly onceとしてauthorizeした

## 結果を見る前に固定したcontract

Canonical human-readable documents:

- `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`

Machine-readable preregistration:

- `prereg/STUDY_1_SPEC.json`

最初のmachine preregistration commit:

`9ab2f7bb79c446df1431175686383271f341edd3`

Initial protocol commit:

`02d8b8605c913f42c145badd30aafd5fbb1f9538`

Current-status initial commit:

`49071dc27f1c337aa42d3dd1b84bc0a0a17cb683`

Decision-register initial commit:

`c4d9a2b18ff06aedfbb1f591a7bb3e44782e6bfe`

Overview initial commit:

`0f4a174c8cd971c8376c09966d4834fea5b1afc7`

README initial commit:

`503f46dd82f00cea1555cac704ae1c16f17211b5`

これらはすべて、G3-06 fresh scientific evidenceを生成またはreadする前にcommitした。

## representation / rule binding （概要）

```text
rule runtime source = public/engine.js
human-readable rule baseline = doc/RULES_BASELINE.md
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
relative horizon = 5
validated transforms = []
canonicalization = NOT AUTHORIZED
```

## eligible instrument （概要）

formal measurement sourceはLGTGMIV F1〜F5に限る。

Canonical upstream records:

- `../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md`
- `../local-game-tree-geometry-measurement-instrument-verification/CURRENT_STATUS.md`

Formal status:

`LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL`

## 固定済みevent / endpoint contract

Formal event families:

- `BRMGI-E1-CAPTURE-SOURCE-MOVE`
- `BRMGI-E2-NYUMBA-USE-VS-STOP`
- `BRMGI-E3-RESERVE-EXHAUSTION-NAMUA-TO-MTAJI`

Control/descriptive-only event:

- `BRMGI-E0-NAMUA-RESERVE-DECREMENT-NONTRANSITION`

Formal metric universe:

- `BRMGI-M1-ROOT-LEGAL-WIDTH`
- `BRMGI-M2-CUMULATIVE-TREE-OCCURRENCE`
- `BRMGI-M3-GLOBAL-DISTINCT-RAW-STATES`
- `BRMGI-M4-DUPLICATE-TRANSITION-FRACTION`
- `BRMGI-M5-CUMULATIVE-TREE-RAW-RATIO`
- `BRMGI-M6-UNIT-WIDTH-OCCUPANCY-FRACTION`

freeze時点のcandidate universeは`3 × 6 = 18`件のevent / metric combinationである。

## Stage ID （Stageの記録）

```text
BRMGI-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID / NO RERUN
BRMGI-S0-TECHNICAL-2026-09-03-v2 / STAGE0-PASS
BRMGI-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
BRMGI-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
```

## seed namespace （概要）

```text
technical-only = 31609001..31609008 / scientific use prohibited
Stage 1 = 31610001..31610256 / CONSUMED / CLOSED TO SAME-EVIDENCE REUSE
Stage 2 = 31620001..31620384 / NOT CONSUMED / NOT-AUTHORIZED-NOT-EXECUTED
```

freeze前のrepository searchにより、Stage 1 / Stage 2 namespaceが未使用であることを確認した。`31600001..31600256`は独立したpublic-AI engineering trackですでに使用されていたため、その範囲を再利用せず、G3-06 technical-only seedを意図的に`31609001..31609008`へ移した。

## freshness firewall （証拠分離規則）

upstream identity-only exclusionは、Stage 1 scientific authorization前に次からmaterializeした。

- LGTGMIV-STUDY1
- EBRWS-STUDY1
- TCTGD-STUDY1
- SFCDF-STUDY1
- BECT-STUDY1

outcome fieldは保持していない。final identity-only manifestはroot RAW identity 149件、source trajectory identity 124件、opening-prefix identity 67件である。G3-05からは25件の`rootRawSha256` identityだけを保持し、partial scientific fieldは保持していない。`identityCoreSha256 = a225b8c15d6da956dd1afbdc0a64c6d40b9c77add2e464d34f11dfc1278e2182`である。

G3-03 diagnostic value / direction、G3-04 candidate value / direction、G3-05 partial telemetryはscientific selection inputではない。

Stage 2では、Stage 1 source seed、full trajectory、first-16 prefix、RAW pre / post root、root pair、bound move、event-window、same-root event / control pair identityを除外しなければならない。

## 実際のStage 0 / Stage 1 provenance

Stage 0 v1:

```text
run = 33677691455
disposition = TECHNICAL-INVALID / NO RERUN
fresh scientific evidence = false
```

Stage 0 v2:

```text
static audit run = 33677942576 / PASS
execution run = 33678004793 / STAGE0-PASS
result artifact = 9865102178
result ZIP SHA-256 = 06015d340a3a0de4703af2755c1a265153fef08393dc43fcd38e1285fb1295ff
result file SHA-256 = 4089bc0acd8b719e23a21a2605b34281d13992c2cc75dfd9dc5474c8bb2eade3
```

Upstream firewall:

```text
materialization run = 33678555012
artifact = 9865308337
ZIP SHA-256 = 5f625d34f421da493fee1bcfc463687a26d9bd01d29a9bf838e3d1c6637f1ec7
exact mirror commit = 6029679c7a218ca35bb1da343d86670285070d7a
```

Stage 1:

```text
preauthorization static audit run = 33679102557 / PASS
authorization commit = 1edc8886ffb0d2b65c7f4c1c8fb002be0abbe6e7
trigger commit = 61cb2ed31c26151edf19b9c1eb49f6b22b935898
scientific run = 33679269612
job = 100411609044
authorized executions = 1
actual executions = 1
stageDisposition = TECHNICAL-INVALID
technicalError = production/independent selection mismatch
result artifact = 9865581198
result ZIP SHA-256 = 3f43ff832afaae5fc0a1d6756dcc9fa0101eb5a67befc7f3cdc2d1536bdb5d2a
scientific-result SHA-256 = a5a2f385699cd8bc629e1d1594005841778a82c7d1ca18bb7eb5bcfeb0d41452
telemetry SHA-256 = 141f4687528ce62fe60052c4c9ecff217a6a929a43190e4f5a507f8d4abc77f0
execution-summary SHA-256 = a3fdf314f12d6853e337f13b6c252eaebf27edb69c96dab53829b033ece5ca77
exact-byte mirror commit = b8f9fe0e2d5008be2d41b3b8271fa325144f82fc
```

## protected evidence （証拠の状態）

```text
standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ
```

別途明示的なauthorizationがない限り、BRMGI actionからこのholdoutをgenerate、partially generate、read、peek、trial-enumerate、resource-estimateしてはならない。

## execution-integrity contract （実行記録）

固定済みprospective execution-integrity contractは、すべてのfresh scientific Stageに次を要求する。

```text
max authorized scientific executions = 1
arming separated from computation
single trigger path
concurrency guard
durable pre-computation lease
source blob binding
remote advancement allowlist
artifact-before-mirror
exact-byte recovery only
scientific recomputation for recovery prohibited
execution-count audit mandatory
```

## relay-limitの境界

BECT-STUDY1のrelay-limit partial telemetryは、BRMGI scientific evidenceとしてreadまたはreuseしていない。

technical failure classだけをdesign informationとして引き継ぐ。

- source / direct selected moveのrelay-limitは、geometry測定前に固定済みtechnical ineligibilityとして扱う
- 必須depth-5 reconstruction内のrelay-limitは、Stageを`TECHNICAL-INVALID`としてfail closedする
- root replacement / seed extension / repair後のsame-evidence rerunは行わない

## 現在のprotected state

```text
fresh Stage 1 authorized executions = 1
fresh Stage 1 actual executions = 1
fresh Stage 2 executions = 0
Stage 1 seed consumed = true
Stage 2 seed consumed = false
no-rescue boundary crossed = true
formal promoted candidate set = []
Study = CLOSED / TECHNICAL-INVALID
protected depth-10 accessed = false
main integration = NOT PERFORMED
```
