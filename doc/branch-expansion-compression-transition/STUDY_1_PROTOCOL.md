# BECT-STUDY1 — Study 1 Protocol

更新日: 2026-09-02  
状態: **PROSPECTIVE / FROZEN BEFORE FRESH SCIENTIFIC EVIDENCE**

## 1. Formal identity

```text
Program position = Research Generation 3 / G3-05
Study ID = BECT-STUDY1
English title = Branch Expansion and Compression Transition Study 1 — Prospective exact analysis of longitudinal bounded local game-tree geometry change, transition onset, persistence, reopening, and reversal along Bao trajectories
日本語題目 = Baoにおけるbranch expansion / compression転移のprospective exact解析 — 対局trajectory上のbounded局所ゲーム木幾何の変化、転移開始、持続、再開放、反転の再現可能な検証
baseline remote main = 127a9653933c623307c8423fddaf42166090f11b
research branch = research/g3-05-branch-expansion-compression-transition
```

Program authorizationは`G3-05-AUTHORIZED`。これはStudy definitionとtechnical-only Stage 0までを許可する。fresh Stage 1は別authorizationが必要である。

## 2. 中心科学課題

同一trajectory上のbounded local game-tree / RAW-graph geometryは、単なる静的level差だけでなく、再現可能な時間方向の変化、転移開始、持続、反転、branch reopening / extinctionを示すかを検証する。

本StudyはResearch Generation 1の「局面相転移点」、G3-04のNamua/Mtaji static phase difference、search/value/tactical transitionをground truthとしない。

## 3. Immutable measurement boundary

Authoritative scientific state identity:

`pits,reserve,houseOwned,player,phase,winner,pending`

Move identity:

`type,phase,row,index,direction,side,houseChoice,houseTwo`

```text
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
canonicalization / symmetry quotient = NOT AUTHORIZED
```

利用可能なmeasurement familyはLGTGMIVでformal eligibilityを得たF1-F5のみ。

## 4. Longitudinal level endpoints

各source trajectoryのply `t`をrootとするrelative depth-5 local reconstructionから、次のexact level series `L_m(t)`を作る。

1. `BECT-M1-ROOT-LEGAL-WIDTH` — root legal move count。
2. `BECT-M2-CUMULATIVE-TREE-OCCURRENCE` — depth 0..5のtree node occurrence総数。
3. `BECT-M3-GLOBAL-DISTINCT-RAW-STATES` — depth 0..5で到達するglobal distinct RAW states。
4. `BECT-M4-CUMULATIVE-TREE-RAW-RATIO` — M2 / M3のexact rational。
5. `BECT-M5-DUPLICATE-TRANSITION-FRACTION` — duplicate encounter / bounded transition occurrenceのexact rational。
6. `BECT-M6-UNIT-WIDTH-OCCUPANCY-FRACTION` — depth-labelled nonterminal RAW-state presenceのうちlegal reply width=1の割合。
7. `BECT-M7-BRANCH-REOPENING-FRACTION` — F5 branch reopening count / classified reply-width transitions。
8. `BECT-M8-BRANCH-EXTINCTION-FRACTION` — F5 branch extinction count / classified reply-width transitions。

M4/M6はG3-04のpositive resultをoutcomeとして継承するものではない。formal-eligible primitiveから新Studyのlongitudinal levelとしてprospectively再定義し、G3-04の観測値・方向をselectionへ読み込まない。M1-M8を対称的なcandidate universeとして固定する。

## 5. Exact delta and transition grammar

隣接plyのlevel差を

`D_m(t) = L_m(t+1) - L_m(t)`

としてexact reduced rationalで保持する。float toleranceは使用しない。

Primary signed classは`UP / DOWN / ZERO / UNDEFINED`。

- `onset-up`: `D(t)>0`かつ直前のdefined deltaが`<=0`
- `onset-down`: `D(t)<0`かつ直前のdefined deltaが`>=0`
- `persistence-up/down`: onsetの次のdefined deltaが同方向
- `reversal-after-up/down`: onsetの次のdefined deltaが逆方向
- `stall-after-onset`: onsetの次のdefined deltaが0
- `recovery`: nonzero deltaが反対符号へ切り返す挙動。persistenceとは別集計

Stage 1 grammarにはmagnitude thresholdを置かない。exact signだけを使う。fresh developmentを見た後のthreshold探索は禁止する。

## 6. Rule phaseとの分離

Primary transition inferenceでは、deltaまたは3-delta event window内のsource statesが複数rule phaseを含む場合、そのwindowを除外する。

したがってNamua→Mtaji境界そのものをgeometry eventのground truthにしない。geometry eventを独立構築した後にphase labelをcontextとして付与することはできるが、それはsecondary descriptive contextである。

## 7. Fresh trajectory population

Source policy:

```text
engine = public/engine.js
PRNG = Mulberry32
legal move order = canonical move identity key ascending
move selection = floor(u * legalMoveCount)
max source ply = 80
analysis roots = exact ply 16..63 inclusive
eligible trajectory = all 48 analysis roots are nonterminal
selection = seed ascending, first N eligible trajectories
```

このfixed-survival eligibility以外ではgeometry、endpoint、game outcomeをselectionへ用いない。

### Stage 1

```text
Stage ID = BECT-S1-DEVELOPMENT-2026-09-02-v1
seed = 31510001..31510240
target trajectories = 10
roots per eligible trajectory = 48
max roots = 480
```

### Stage 2

```text
Stage ID = BECT-S2-FORMAL-2026-09-02-v1
seed = 31520001..31520384
target trajectories = 16
roots per eligible trajectory = 48
max roots = 768
```

Stage 2はStage 1 completion後の別authorization reviewが必要。

## 8. Experimental unit and dependence

Primary experimental unitは**source trajectory**。

隣接root、adjacent-root pair、overlapping depth-5 local windows、event windowsを独立sampleとは扱わない。同一trajectory内の全onset/persistence/reversalをcandidate-specificに集約し、formal inferenceではtrajectoryごとに1つの`persistence count - reversal count` signへ縮約する。

## 9. Stage 1 promotion

Candidate identityは`metric ID + onset direction (UP/DOWN)`。

10 trajectoriesについて以下をすべて満たす場合だけpromotionする。

1. required level/event series coverageが10/10。
2. frozen directionのprimary-eligible onsetを1件以上持つtrajectoryが6/10以上。
3. `persistent - reversal` balanceがnonzeroのtrajectoryが6以上。
4. nonzero trajectory balanceの2/3以上がpositive。

promotionが0なら`NO-PROMOTED-CANDIDATE`としてStage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。

## 10. Stage 2 formal validation

Stage 1からfreezeされたcandidate identity/directionだけを検証する。

16 trajectoriesについて:

1. onset prevalence >=10/16。
2. nonzero trajectory balance >=10。
3. positive balanceがdominant sign。
4. nonzero trajectory-level balance符号に対するexact two-sided sign test。
5. frozen promoted set全体でHolm-Bonferroni、family-wise alpha=`1/20`。

candidate confirmationは全gate PASS時のみ。zero balancesはsign-test `n`から除外する。

## 11. Firewall

G3-01/LGTGMIV/G3-02/G3-03/G3-04のscientific outcomesをG3-05 root/threshold/event selectionへ利用しない。

特に:

- G3-03 diagnostic C1-C4 directions/valueはscientific input禁止。
- G3-04 C1/C6 values、favorable directions、Stage 1/2 result rowsはselection禁止。
- G3-04 C1/C6は背景動機として引用するだけ。

Stage 2はStage 1のRAW root、full source trajectory、first-16 move prefix、trajectory segment、adjacent-root-pair、event-window identitiesを除外する。

## 12. Canonical equality and independent implementation

Scientific equalityはdeterministic sorted-key canonical JSONのUTF-8 bytesに対するSHA-256 exact equality。

JavaScript object prototype、property insertion order、runtime metadataはscientific identityではない。`util.isDeepStrictEqual`等のprototype-sensitive equalityをmandatory scientific gateに使用しない。

Production / independent implementationはengine APIだけを共有し、新しいBECT longitudinal aggregation、event detector、candidate summaryを相互importしない。ProductionはLGTGMIV production、independentはLGTGMIV independentへ別々にbindingする。

## 13. Resource ceilings

Per root:

```text
unique RAW states <= 100000
unique transitions <= 750000
parent expansions <= 100000
legal move evaluations <= 750000
summed tree node occurrences <= 1000000000
elapsed <= 180000 ms
peak RSS <= 4 GiB
root artifact <= 64 MiB
```

Stage ceilings:

```text
Stage 1 elapsed <= 10800000 ms / artifact <= 256 MiB
Stage 2 elapsed <= 16200000 ms / artifact <= 384 MiB
```

ceiling failure後のseed extension/root replacementは禁止する。

## 14. Execution integrity

Fresh Stageごとに:

- max scientific executions = 1
- armingとcomputationを分離
- single trigger path
- concurrency guard
- durable pre-computation lease
- authorization baseline/source blob binding
- remote branch-advancement allowlist
- durable artifact upload before repository mirror
- exact-byte recovery only
- artifact recovery目的のscientific recomputation禁止
- Actions history / execution-count audit必須

## 15. No-rescue boundary

fresh scientific generationまたはreadの早い方でcrossする。以後、candidate、threshold、event grammar、endpoint、population、seed、root、horizon、representation、resource ceiling、test、favorable subgroupを変更しない。同seedのimplementation修正後rerunも禁止。

## 16. Stage 0

`BECT-S0-TECHNICAL-2026-09-02-v1`はfresh scientific evidenceを使わない。

Mandatory controls:

- deterministic trajectory replay
- adjacent-ply successor/root identity binding
- overlapping-window semantics
- repeated RAW root/subgraph handling
- exact delta arithmetic
- no-change / expansion / compression / reopening / extinction / persistence / reversal fixtures
- trajectory/order invariance
- canonical equality under object-prototype differences
- production/independent separation
- execution-integrity smoke
- protected depth-10 firewall

Stage 0 PASSはStage 1を自動authorizeしない。

## 17. Protected depth-10 holdout

standard initial RAW-root complete exact depth-10 holdoutは:

**`SEALED / NOT GENERATED / NOT READ`**

本Studyではgeneration、partial generation、read、peek、trial enumeration、resource peekを行わない。

Machine-readable正本は`prereg/STUDY_1_SPEC.json`。
