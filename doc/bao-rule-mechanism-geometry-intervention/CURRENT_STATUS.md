# BRMGI-STUDY1 — Current Status

更新日: 2026-09-03

```text
Study = BRMGI-STUDY1
Program position = Research Generation 3 / G3-06
Program review = G3-06-AUTHORIZED
Study status = PROSPECTIVE-FROZEN / STAGE0-PASS / PRE-STAGE1-AUTHORIZATION
review baseline remote main = 5525700937f0ada1aec39634012e8ad623e228c4
Study baseline remote main = b0cbd9f562bb803597acb313360c064dadd73299
research branch = research/g3-06-bao-rule-mechanism-geometry-intervention
Stage 0 v1 = BRMGI-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID / NO RERUN
Stage 0 v2 = BRMGI-S0-TECHNICAL-2026-09-03-v2 / STAGE0-PASS
Stage 1 = BRMGI-S1-DEVELOPMENT-2026-09-02-v1 / NOT AUTHORIZED / NOT EXECUTED
Stage 2 = BRMGI-S2-FORMAL-2026-09-02-v1 / NOT AUTHORIZED / NOT EXECUTED
technical namespace = 31609001..31609008 / scientific use prohibited
Stage 1 seed = 31610001..31610256 / RESERVED / NOT CONSUMED
Stage 2 seed = 31620001..31620384 / RESERVED / NOT CONSUMED
fresh G3-06 scientific evidence generated = false
fresh G3-06 scientific evidence read = false
no-rescue boundary = NOT CROSSED
protected depth-10 = SEALED / NOT GENERATED / NOT READ
main integration = NOT PERFORMED
```

## Formal Study identity

English title:

**Bao Rule-Mechanism / Geometry Intervention Study 1 — Prospective move-conditioned exact analysis of bounded RAW local game-tree geometry change around capture, nyumba choice, reserve exhaustion, and Namua-to-Mtaji transition events**

正式日本語題目:

**Bao固有のrule-semantic eventに伴う局所ゲーム木幾何変化のprospective move-conditioned exact解析 — capture、nyumba選択、reserve枯渇／Namua→Mtaji移行を対象とするbounded RAW pre/post構造差の検証**

Historical agendaの`Intervention`はcausal claim authorizationを意味しない。本Studyのclaim classは`move-conditioned structural change`、`event-conditioned geometry difference`、`association`に限定する。

## Frozen instrument boundary

```text
representation = RAW-ONLY
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
relative local horizon = 5
validated transform set = []
canonicalization / symmetry quotient = NOT AUTHORIZED
eligible families = LGTGMIV F1,F2,F3,F4,F5
```

## Frozen event / source semantics

Formal candidate families:

1. `BRMGI-E1-CAPTURE-SOURCE-MOVE`
   - actual source capture move
   - capture is mandatory, so generic same-root capture/non-capture contrastは構成しない
   - controlはsame trajectory / same pre-phaseのnearest earlier primary-eligible non-capture actual move
2. `BRMGI-E2-NYUMBA-USE-VS-STOP`
   - same RAW root / same physical opening moveの`houseChoice=use` vs `stop`
   - useでmover nyumba ownershipを失い、stopで保持するcomparable rootのみ
3. `BRMGI-E3-RESERVE-EXHAUSTION-NAMUA-TO-MTAJI`
   - pre Namua / post Mtajiのlinked compound event
   - controlは直前のNamua→Namua reserve-decrement actual move

Control/descriptive only:

- `BRMGI-E0-NAMUA-RESERVE-DECREMENT-NONTRANSITION`

Source trajectoryはpreregisteredどおり`engine.legalMoves`をcanonical orderへ並べて選択する。`engine.moveVariants`はE2のsame-root stop/use armsを列挙するためだけに使用し、source trajectoryそのものの進行やE1/E3 actual-source bindingを変更しない。このpre-fresh clarificationは`prereg/STUDY_1_SPEC_CLARIFICATION_1.json`に固定した。

## Frozen endpoint universe

1. `BRMGI-M1-ROOT-LEGAL-WIDTH`
2. `BRMGI-M2-CUMULATIVE-TREE-OCCURRENCE`
3. `BRMGI-M3-GLOBAL-DISTINCT-RAW-STATES`
4. `BRMGI-M4-DUPLICATE-TRANSITION-FRACTION`
5. `BRMGI-M5-CUMULATIVE-TREE-RAW-RATIO`
6. `BRMGI-M6-UNIT-WIDTH-OCCUPANCY-FRACTION`

全metricはformal-eligible LGTGMIV primitiveまたはそのdeterministic exact integer/rational function。pre/post deltaとevent-control contrastはexact arithmeticで計算し、float toleranceやmagnitude thresholdを使用しない。

## Stage 0 technical history

### v1 — TECHNICAL-INVALID / NO RERUN

Exactly one authorized v1 execution `33677691455`は、synthetic nyumba fixtureが34 seedsしか表現していなかったため、LGTGMIVのfrozen RAW invariant `represented seed total == 64`でfail closedした。

```text
fresh Stage 1 seed access = false
fresh Stage 2 seed access = false
fresh scientific evidence = false
protected depth-10 access = false
```

v1はrerunしていない。

### v2 — STAGE0-PASS

fresh scientific evidence 0の状態で、科学contractを変更せずtechnical nyumba fixtureだけを64-seed invariantへ適合させた別version `BRMGI-S0-TECHNICAL-2026-09-03-v2`をprospectively refreezeした。

Pre-execution static audit:

```text
run = 33677942576
head = f8e9eec83ee041d11f2c028259367fc5530ad462
artifact = 9865076199
artifact ZIP SHA-256 = 3db1200db55181a96a2e74cfc6a1db4c3eceafb418159a4d1b42ee4134db3d76
result = PASS
```

Exactly-one technical execution:

```text
authorization commit = 5ab33517c43ec11135488823e84c6c6859643415
trigger commit = 9885e7fe470e82c58cf60cca91fdc4518499eb13
run = 33678004793
job = 100407435042
authorized executions = 1
actual executions = 1
Stage disposition = STAGE0-PASS
```

Durability:

```text
lease artifact = 9865100897
lease ZIP SHA-256 = f5542580f85cf15c4d9250cb11c4df5daf98e1eaec766f89c25da5082e799a18
result artifact = 9865102178
result ZIP SHA-256 = 06015d340a3a0de4703af2755c1a265153fef08393dc43fcd38e1285fb1295ff
result file SHA-256 = 4089bc0acd8b719e23a21a2605b34281d13992c2cc75dfd9dc5474c8bb2eade3
deterministicCoreSha256 = 326d6fa89f1c53af2d33c0d0fddf5dfe15d197442921a5d02aa6254423ef5b63
```

T1-T10はすべてPASS。production / independentのtechnical geometry reconstruction SHA-256は双方`ed70d0b1ed44a77813150a66709660e075271126a852452fa534f41b39fab90a`で完全一致した。

Result artifactは再計算せずexact contentとして`results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json`へmirror済み。

## Frozen fresh population

Source trajectory:

```text
PRNG = Mulberry32
source move set = engine.legalMoves
legal move order = canonical identity ascending
random index = floor(u * legalMoveCount)
max source ply = 80
event scan = plies 16..63 inclusive
selection = seed ascending
```

Stage 1:

```text
seed = 31610001..31610256
target = 8 comparable units / formal event family
max one unit / event family / trajectory
max distinct local reconstructions = 96
```

Stage 2:

```text
seed = 31620001..31620384
target = 12 comparable units / promoted event family
Stage 1 identity firewall = mandatory
max distinct local reconstructions = 144
```

seed block内でtargetへ到達しないevent familyはnon-estimable。seed extensionしない。

## Frozen Stage 1 promotion / Stage 2 formal rule

Candidate universeはE1/E2/E3 × M1..M6の18組合せ。

Stage 1 promotionにはtechnical global PASS、production / independent exact PASS、8/8 comparable units、nonzero exact contrasts >=6、nonzero contrastの少なくとも2/3が同一signを要求する。dominant signをStage 2へfreezeする。

Stage 2はpromoted candidateだけを評価し、12/12 comparable units、nonzero >=10、exact two-sided sign test、Stage 1 frozen direction、Holm-Bonferroni、family-wise alpha=`1/20`を用いる。

## Resource / relay-limit / firewall boundary

G3-05のrelay-limit failureはtechnical risk情報にのみ使用する。Required depth-5 reconstruction内でrelay-limitを検出した場合はStage全体を`TECHNICAL-INVALID`としてfail closedし、root replacement、seed extension、same-evidence repair rerunは行わない。

G3-03 diagnostic scientific fields、G3-04 C1/C6 values/directions、G3-05 partial telemetryをG3-06 selection/threshold/candidate inputへ使わない。Stage 2ではStage 1 source seed、trajectory、first-16 prefix、RAW pre/post roots、root pair、bound move、event window、same-root event/control pair identitiesを除外する。

## Next action

Stage 0は**`STAGE0-PASS via v2`**としてtechnical closure済み。

次の許可されたactionはfresh-freeな**post-Stage-0 Stage 1 authorization review**である。fresh Stage 1 scientific executionはそのreviewで明示的にauthorizeされるまで`NOT AUTHORIZED`。

Protected depth-10 holdoutは引き続き`SEALED / NOT GENERATED / NOT READ`。
