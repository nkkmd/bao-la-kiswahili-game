# BRMGI-STUDY1 — Study 1 Protocol

更新日: 2026-09-02  
状態: **PROSPECTIVE / FROZEN BEFORE FRESH SCIENTIFIC EVIDENCE**

## 1. Formal identity

```text
Program position = Research Generation 3 / G3-06
Study ID = BRMGI-STUDY1
English title = Bao Rule-Mechanism / Geometry Intervention Study 1 — Prospective move-conditioned exact analysis of bounded RAW local game-tree geometry change around capture, nyumba choice, reserve exhaustion, and Namua-to-Mtaji transition events
日本語題目 = Bao固有のrule-semantic eventに伴う局所ゲーム木幾何変化のprospective move-conditioned exact解析 — capture、nyumba選択、reserve枯渇／Namua→Mtaji移行を対象とするbounded RAW pre/post構造差の検証
review baseline main = 5525700937f0ada1aec39634012e8ad623e228c4
Study baseline main = b0cbd9f562bb803597acb313360c064dadd73299
research branch = research/g3-06-bao-rule-mechanism-geometry-intervention
```

Program authorizationは`G3-06-AUTHORIZED`。これは新しいStudy definitionとtechnical-only Stage 0までを許可する。**fresh Stage 1 scientific executionは未承認**であり、Stage 0 PASS後に別authorizationが必要である。

Historical agendaの`Geometry Intervention`という語は、一般的なcausal interventionを意味しない。本Studyがprospectively authorizeするscientific constructは、原則として**move-conditioned structural change / event-conditioned geometry difference / association**である。

## 2. 中心科学課題

authoritative RAW pre-root `s`、合法手`m`、その手を最後まで適用したcomplete post-root `s'`を一意にbindし、両局面のrelative depth-5 bounded local geometryをformal-eligible LGTGMIV instrumentでexact reconstructionする。

そのうえで、capture、nyumbaのstop/use選択、reserve枯渇に伴うNamua→Mtaji移行というprospectively fixed rule-semantic eventの周囲で、geometryのpre/post changeが対応するcontrol move/windowと系統的に異なるかを検証する。

G3-05でbranch expansion/compression transitionが確認されたことは前提にしない。G3-05のpartial telemetry、transition direction、event grammarをvalidated scientific inputとして利用しない。

## 3. Immutable representation / instrument boundary

Authoritative scientific state identity:

`pits,reserve,houseOwned,player,phase,winner,pending`

Canonical move identity:

`type,phase,row,index,direction,side,houseChoice,houseTwo`

```text
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
canonicalization / symmetry quotient = NOT AUTHORIZED
```

使用できるgeometry familyはLGTGMIVでformal eligibilityを得た次のF1-F5のみ。

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

新しい未検証geometry primitiveをformal endpointへ追加しない。

## 4. Stage structure

1. `BRMGI-S0-TECHNICAL-2026-09-02-v1` — technical fixture only。fresh scientific seedを使わない。
2. `BRMGI-S1-DEVELOPMENT-2026-09-02-v1` — fresh development。**現時点ではNOT AUTHORIZED**。
3. `BRMGI-S2-FORMAL-2026-09-02-v1` — fresh formal heldout。valid Stage 1 completion、nonempty promoted set、別authorizationが必要。

Reserved namespaces:

```text
technical-only = 31609001..31609008 / scientific use prohibited
Stage 1 = 31610001..31610256 / NOT CONSUMED
Stage 2 = 31620001..31620384 / NOT CONSUMED
```

G3-05 Stage 1 `31510001..31510240`を再利用しない。G3-05の未使用Stage 2 `31520001..31520384`も転用しない。

## 5. Pre-root / move / post-root semantics

1 scientific move unitは次で構成する。

```text
pre-root s
canonical legal move m
post-root s' = engine.applyMove(s,m).state
```

`post-root`は途中event snapshotではなく、relay、捕獲、nyumba処理、`finishTurn`、player switch、Namua→Mtaji transitionを含む**complete move後のRAW state**である。

Primary unitはpre/postともnonterminalでなければならない。direct move applicationが`relay-limit`へ到達する場合、そのmove unitはprimary scientific unitにしない。`relay-limit`はBaoの通常rule outcomeとして扱わずtechnical sentinelとする。

## 6. Prospective rule-event family

### E1 — `BRMGI-E1-CAPTURE-SOURCE-MOVE`

actual source moveが`move.type == "capture"`であるmove event。

現engineではcaptureがmandatoryであり、capture可能rootの合法手集合にgeneric non-capture alternativeは存在しない。このため同一rootのcapture / non-capture causal contrastは構成しない。

Controlは、同一source trajectory内でeventより前にある**nearest earlier primary-eligible non-capture actual source move**とする。ただし:

- event pre-rootと同じpre-phase
- `eventScanPlyStart`より前へ遡らない
- phase boundaryを跨がない
- geometryを見てcontrolを選ばない

各trajectoryではearliest comparable capture eventだけを採用する。

### E2 — `BRMGI-E2-NYUMBA-USE-VS-STOP`

Namua capture rootで、同一physical opening moveについて`engine.moveVariants`が`houseChoice=stop`と`houseChoice=use`を提供し、両者のcomplete post RAW stateが異なり、`use`ではmoverの`houseOwned`が`true -> false`、`stop`では`true`を保持する場合を対象とする。

```text
event arm = houseChoice=use
control arm = houseChoice=stop
pre-root = exactly identical
physical opening move = exactly identical except houseChoice
```

同一root内に複数のqualifying physical moveがある場合はcanonical physical-move identity最小のものを採用し、geometry結果による選択は行わない。各trajectoryではearliest comparable rootだけを採用する。

この比較はroot-level confoundingを強く抑えるが、それだけで一般的causal Bao mechanism claimをauthorizeしない。

### E3 — `BRMGI-E3-RESERVE-EXHAUSTION-NAMUA-TO-MTAJI`

actual source moveについて:

```text
pre.phase = namua
post.phase = mtaji
```

となるlinked compound event。

現engineは両者のreserveが0になった時点でMtajiへ移行するため、最終reserve depletionとNamua→Mtaji transitionを本Studyで独立した2つのcausal mechanismへ分解しない。

Controlは**直前のactual source move**のみとし、以下をすべて要求する。

- control pre.phase = namua
- control post.phase = namua
- control mover reserve decrement = exactly 1
- control/eventともprimary-eligible

各trajectoryの最初のcomparable Namua→Mtaji transitionだけを用いる。

### E0 — `BRMGI-E0-NAMUA-RESERVE-DECREMENT-NONTRANSITION`

pre/postともNamuaで、mover reserveがexactly 1減るmove。E3 controlとdescriptive contextにのみ使用する。

Generic Namua reserve decrementはphase-linkedであり、同一rootのdecrement / no-decrement contrastを持たないため、独立formal candidate familyにはしない。

## 7. Compound-event handling

event labelsはmutually exclusiveにしない。captureとphase transition等が同一moveで重なればfull label vectorを保存する。

- compound eventを結果後に除外しない
- reserve exhaustionとNamua→Mtajiを分離した独立formal effectとして扱わない
- compound subtypeはdescriptiveに報告可能
- Stage 1 outcome後にfavorable subtypeだけをformal subgroupとして追加しない

## 8. Formal geometry endpoints

pre-rootとpost-rootそれぞれで次の6 metricを測定する。

1. `BRMGI-M1-ROOT-LEGAL-WIDTH` — root legal move count。
2. `BRMGI-M2-CUMULATIVE-TREE-OCCURRENCE` — depth 0..5 tree node occurrence総数。
3. `BRMGI-M3-GLOBAL-DISTINCT-RAW-STATES` — depth 0..5 global distinct RAW-state数。
4. `BRMGI-M4-DUPLICATE-TRANSITION-FRACTION` — duplicate encounter / bounded transition occurrenceのexact rational。denominatorは`sum uniqueTransitionCount[d], d=0..4`。
5. `BRMGI-M5-CUMULATIVE-TREE-RAW-RATIO` — M2 / M3のexact rational。
6. `BRMGI-M6-UNIT-WIDTH-OCCUPANCY-FRACTION` — legal reply width=1のdepth-labelled nonterminal unique RAW-state presence / 全depth-labelled nonterminal unique RAW-state presenceのexact rational。

M1-M6を対称的なcandidate universeとして固定し、G3-04 C1/C6の既知方向から選別しない。

## 9. Exact pre/post arithmetic

各metric `m`について:

`D_m(s,m) = G_m(post) - G_m(pre)`

をexact integerまたはreduced rationalで保存する。

Event/control candidateは:

`C_m = D_m(event) - D_m(control)`

とする。

E2はpre-rootが共通なので、数学的にはpost-useとpost-stopの差へ縮約するが、実装上は同じgeneral pre/post contractからexactly計算する。

float tolerance、scientific decision用rounding、post hoc magnitude thresholdは用いない。denominatorが定義不能なら、そのmetric/unitはnon-comparableでありimputationしない。

## 10. Source trajectory policy

```text
engine = public/engine.js
PRNG = Mulberry32
source moves = engine.legalMoves
legal move order = canonical move identity ascending
selection = floor(u * legalMoveCount)
max source ply = 80
event scan = plies 16..63 inclusive
source seeds = ascending
```

source trajectoryがply 63までに`relay-limit`へ到達した場合、geometry measurement前のtechnical source exclusionとする。そのtrajectoryからevent unitを採用しない。

source trajectoryの勝敗やgeometry値はevent unit selectionへ使用しない。

## 11. Experimental unit / dependence

Primary clusterは**source trajectory**。

各formal event familyについて1 trajectoryから最大1 unitのみ採用する。root、move、pre/post reconstruction、same-root variantsを独立sampleとして数えない。

同一trajectoryが異なるevent familyへ1 unitずつ寄与することは許容する。candidate-level formal inferenceではevent/metricごとにtrajectoryあたり1つのexact contrast signへ縮約する。Holm-Bonferroniはpromoted candidate全体へ適用し、任意依存下でもFWERを制御する。

## 12. Stage 1 fresh development population

```text
seed = 31610001..31610256
formal event families = E1,E2,E3
target comparable units = 8 per event family
max one unit / event family / trajectory
selection = seed ascending, earliest comparable event under frozen rule
max distinct depth-5 local reconstructions = 96
```

block内で8 unitへ到達しなければ、そのevent familyは`STAGE1-NON-ESTIMABLE`としseed extensionしない。

Stage 1 candidate universeは、E1/E2/E3 × M1..M6の全18組合せ。fresh access後のevent/metric追加は禁止。

## 13. Stage 1 promotion gate

candidate identityは:

`event ID + metric ID + frozen sign direction`

以下をすべて満たす場合のみStage 2へpromotionする。

1. Stage technical global gate PASS。
2. production / independent canonical scientific equality PASS。
3. 8/8 comparable selected units。
4. exact nonzero event-minus-control contrasts >= 6。
5. nonzero contrastsの少なくとも2/3が同一符号。

そのdominant signをStage 2のfrozen directionとする。magnitude thresholdは置かない。

promoted candidateが0ならStage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。

## 14. Stage 2 formal heldout

Stage 1でpromotionされたcandidate/event familyだけを、fresh `31620001..31620384`から測定する。

```text
target comparable units = 12 per promoted event family
Stage 1 identity firewall = mandatory
max distinct depth-5 local reconstructions = 144
seed extension = prohibited
```

Event familyごとに12 unitへ到達しなければ、そのfamilyのpromoted candidatesは`NON-ESTIMABLE`。

candidate-level estimabilityはさらにexact nonzero contrast >=10を要求する。

Formal test:

- nonzero trajectory-level contrast signへのexact two-sided sign test
- dominant signがStage 1 frozen directionと一致
- promoted candidate全体でHolm-Bonferroni
- family-wise alpha = `1/20`

Formal label:

- **`CONFIRMED`**: technical/estimability gate PASS、frozen direction一致、Holm criterion PASS。
- **`NOT-CONFIRMED`**: estimableだがdirectionまたはmultiplicity-aware testを満たさない。
- **`NON-ESTIMABLE`**: population/definition/nonzero等のfrozen estimability gateを満たさないがglobal technical-invalidではない。

technical failureをscientific nullへ読み替えない。

## 15. Fresh-evidence firewall

Upstreamから利用できるのはidentity-only exclusion manifestであり、scientific outcome値は保持しない。

対象:

- LGTGMIV-STUDY1
- EBRWS-STUDY1
- TCTGD-STUDY1
- SFCDF-STUDY1
- BECT-STUDY1

特に:

- G3-03 diagnostic values/directions = prohibited
- G3-04 C1/C6 values/directions = scientific selection input prohibited
- G3-05 partial telemetry = prohibited

Stage 2はStage 1の少なくとも次を除外する。

- source seed
- full trajectory identity
- first-16 opening-prefix identity
- RAW pre-root identity
- RAW post-root identity
- pre/post root-pair identity
- pre-root-bound canonical move identity
- source ply / event-window identity
- same-root event/control pair identity

## 16. Resource ceilings

Per local reconstruction:

```text
unique RAW states <= 100000
unique transitions <= 750000
parent expansions <= 100000
legal move evaluations <= 750000
summed tree node occurrences <= 1000000000
elapsed <= 180000 ms
peak RSS <= 4 GiB
artifact <= 32 MiB
```

Stage ceilings:

```text
Stage 1 elapsed <= 7200000 ms / artifact <= 256 MiB / distinct reconstructions <= 96
Stage 2 elapsed <= 10800000 ms / artifact <= 384 MiB / distinct reconstructions <= 144
```

RAW-identity cacheは許可するが、cache keyは`RAW identity + horizon + implementation family`。symmetry/canonical quotientは使用しない。

## 17. Relay-limit / technical failure rule

G3-05の`relay-limit`はtechnical risk情報としてのみ利用する。

- source replay上のrelay-limit: frozen source ruleによりtrajectoryをtechnical-ineligibleとする
- selected direct event/control moveのrelay-limit: geometry前にprimary-ineligible
- **required depth-5 bounded reconstruction内部でrelay-limitを検出した場合: fresh Stage全体を`TECHNICAL-INVALID`としてfail closed**

後者ではroot replacement、seed extension、resource ceiling変更、same-evidence repair rerunを行わない。

## 18. Production / independent implementation

productionとindependentはengine rule APIを共有してよいが、新しいBRMGI event classification、control selection、pre/post aggregation、candidate summaryを相互importしない。

production geometryはLGTGMIV production family、independent geometryはLGTGMIV independent familyへ別々にbindする。

scientific equalityはdeterministic sorted-key canonical JSON → UTF-8 → SHA-256のexact一致とする。JavaScript prototype-sensitive equalityはscientific gateにしない。

## 19. Execution integrity

Fresh Stageごとに:

```text
max scientific executions = 1
arming != computation
single trigger path
concurrency guard
durable pre-computation lease
source blob binding
remote advancement allowlist
artifact upload before repository mirror
exact-byte recovery only
scientific recomputation for recovery = prohibited
execution-count audit = mandatory
```

## 20. No-rescue boundary

first fresh scientific generation/readの早い方でcrossする。

以後、同seed repair rerun、seed extension、scientific technical failure後のunit replacement、event family追加、compound-event favorable filtering、endpoint追加/代替、threshold relaxation、control redesign、favorable subgroup、horizon/representation/resource ceiling/formal test変更を禁止する。

## 21. Stage 0 mandatory technical validation

`BRMGI-S0-TECHNICAL-2026-09-02-v1`はfresh scientific evidenceを使用しない。

必須control:

- deterministic source replay / canonical move order
- pre-root / move / complete post-root binding
- mandatory-capture identifiability fixture
- Namua reserve decrement + reserve exhaustion / phase transition fixture
- nyumba stop/use same-physical-move fixture
- compound-event nonexclusive label fixture
- event-specific control selection invariance
- exact integer/rational delta/contrast arithmetic
- undefined denominator behavior
- production / independent separation
- canonical equality
- RAW cache identity / no symmetry
- relay-limit fail-closed sentinel
- resource accounting
- single trigger / durable lease / artifact-before-mirror control plane
- protected depth-10 firewall

Stage 0 PASSはStage 1を自動authorizeしない。

## 22. Interpretation boundary

本Studyがformalに支持できる可能性があるのは、frozen populationとrelative depth 5における**rule-event-conditioned / move-conditioned local geometry difference**である。

以下はauthorizeしない。

- generic causal effect / causal mechanism
- long-horizon outcome effect
- game-theoretic forcing
- optimal move / best-move clarity
- search ease / search stability
- strategic value / win probability
- human difficulty
- depth >5への自動一般化
- public Bao AI engineering outcomeをscientific endpointにすること

## 23. Protected depth-10 holdout

standard initial RAW-root complete exact depth-10 holdoutは引き続き:

**`SEALED / NOT GENERATED / NOT READ`**

本Studyではgeneration、partial generation、read、peek、trial enumeration、resource-estimate目的の事前探索を行わない。

Machine-readable正本は`prereg/STUDY_1_SPEC.json`。
