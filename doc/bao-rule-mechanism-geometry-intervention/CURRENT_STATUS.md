# BRMGI-STUDY1 — Current Status

更新日: 2026-09-02

```text
Study = BRMGI-STUDY1
Program position = Research Generation 3 / G3-06
Program review = G3-06-AUTHORIZED
Study status = PROSPECTIVE-FROZEN / PRE-STAGE-0
review baseline remote main = 5525700937f0ada1aec39634012e8ad623e228c4
Study baseline remote main = b0cbd9f562bb803597acb313360c064dadd73299
research branch = research/g3-06-bao-rule-mechanism-geometry-intervention
Stage 0 = BRMGI-S0-TECHNICAL-2026-09-02-v1 / NOT YET EXECUTED
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

## Frozen event families

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

reserve exhaustionとNamua→Mtajiを独立causal effectへ分解しない。compound eventはnonexclusive labelで保持し、結果後のfavorable filteringを禁止する。

## Frozen endpoint universe

1. `BRMGI-M1-ROOT-LEGAL-WIDTH`
2. `BRMGI-M2-CUMULATIVE-TREE-OCCURRENCE`
3. `BRMGI-M3-GLOBAL-DISTINCT-RAW-STATES`
4. `BRMGI-M4-DUPLICATE-TRANSITION-FRACTION`
5. `BRMGI-M5-CUMULATIVE-TREE-RAW-RATIO`
6. `BRMGI-M6-UNIT-WIDTH-OCCUPANCY-FRACTION`

全metricはformal-eligible LGTGMIV primitiveまたはそのdeterministic exact integer/rational function。pre/post deltaとevent-control contrastはexact arithmeticで計算し、float toleranceやmagnitude thresholdを使用しない。

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

## Frozen Stage 1 promotion

Candidate universeはE1/E2/E3 × M1..M6の18組合せ。

Promotionには:

- technical global PASS
- production / independent exact PASS
- 8/8 comparable units
- nonzero exact contrasts >=6
- nonzero contrastの少なくとも2/3が同一sign

を要求する。dominant signをStage 2へfreezeする。promoted setが空ならStage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。

## Frozen Stage 2 rule

Promoted candidateだけをformal heldoutで評価する。

- 12/12 comparable units / promoted event family
- nonzero exact contrast >=10 / candidate
- exact two-sided sign test
- Stage 1 frozen direction一致
- Holm-Bonferroni over all promoted candidates
- family-wise alpha = `1/20`

Candidate labelは`CONFIRMED` / `NOT-CONFIRMED` / `NON-ESTIMABLE`。

## Resource / relay-limit boundary

G3-05のrelay-limit failureはtechnical risk情報にのみ使用する。

Required depth-5 reconstruction内でrelay-limitを検出した場合はStage全体を`TECHNICAL-INVALID`としてfail closedする。root replacement、seed extension、same-evidence repair rerunは行わない。

Per reconstruction ceiling:

```text
unique RAW <= 100000
unique transitions <= 750000
parent expansions <= 100000
legal move evaluations <= 750000
tree occurrences <= 1000000000
elapsed <= 180000 ms
peak RSS <= 4 GiB
artifact <= 32 MiB
```

## Upstream firewall

G3-03 diagnostic scientific fields、G3-04 C1/C6 values/directions、G3-05 partial telemetryをG3-06 selection/threshold/candidate inputへ使わない。

Identity-only upstream exclusion manifestは作成可能だがscientific outcome fieldは保持しない。

Stage 2はStage 1のsource seed、trajectory、first-16 prefix、RAW pre/post root、root pair、bound move、event window、same-root event/control pair identitiesを除外する。

## Next action

次に許可されているのは**technical-only Stage 0の実装・static audit・別authorization下のexactly-one technical execution**である。

Fresh Stage 1 scientific executionはまだ`NOT AUTHORIZED`。Stage 0 closure後に別のStage 1 authorization reviewを実施する。

Protected depth-10 holdoutは引き続き`SEALED / NOT GENERATED / NOT READ`。
