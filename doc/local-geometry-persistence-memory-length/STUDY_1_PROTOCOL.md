# LGPML-STUDY1 — Study 1 Protocol

更新日: 2026-09-03  
状態: **PROSPECTIVE / FROZEN BEFORE FRESH SCIENTIFIC EVIDENCE**

## 1. Formal identity

```text
Program position = Research Generation 3 / G3-08
Program authorization = G3-08-AUTHORIZED
Study ID = LGPML-STUDY1
baseline remote main = 9f6abd3c9b146bb88c11dd04963052300e4cdc3b
research branch = research/g3-08-local-geometry-persistence-memory-length
English title = Local Geometry Persistence / Memory-Length Study 1 — Prospective exact analysis of lagged change-sign dependence, bounded persistence, reversal, first-exit, and return in RAW local game-tree geometry along Bao trajectories
日本語題目 = Bao局面における局所ゲーム木幾何の持続時間とmemory lengthのprospective exact解析 — trajectory上のRAW局所幾何変化におけるlagged change-sign dependence、持続・反転、first-exit・returnの再現可能な検証
```

Program authorizationはStudy definition、preregistration freeze、technical-only Stage 0までを許可する。fresh Stage 1はStage 0 PASS、fresh-free static audit、identity firewall materialization、別個のStage 1 authorizationが揃うまで禁止する。

## 2. Scientific question

同一Bao trajectory上で、formal-eligibleなbounded RAW local geometryのone-ply change directionは、数ply後にも同方向へ偏って残るのか、反対方向へ偏って反転するのか、そのdependenceはlagとgeometry familyによってどの程度まで持続するのかをprospectively検証する。

ここで`memory length`は**局所geometry featureのbounded temporal dependence**のみを意味し、人間の認知的memory、strategic regime、position value、best move、whole-game predictabilityを意味しない。

## 3. Immutable measurement boundary

```text
measurement foundation = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL
eligible families = F1,F2,F3,F4,F5
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
canonicalization / symmetry quotient = NOT AUTHORIZED
```

Tree occurrenceとunique RAW graph stateを別constructとして保持する。

## 4. Frozen geometry level panel

各analysis root `t`でrelative depth-5 exact reconstructionを行い、次の6 level `L_m(t)`をexact integer / reduced rationalとして保持する。

1. `LGPML-G1-ROOT-LEGAL-WIDTH` — root legal move count。
2. `LGPML-G2-CUMULATIVE-TREE-OCCURRENCE` — depth 0..5のtree node occurrences総数。
3. `LGPML-G3-CUMULATIVE-DISTINCT-RAW-STATES` — depth 0..5のglobal distinct RAW state count。
4. `LGPML-G4-CUMULATIVE-TREE-RAW-RATIO` — G2 / G3。
5. `LGPML-G5-DUPLICATE-TRANSITION-FRACTION` — parent depth 0..4のduplicateEncounterCount総数 / uniqueTransitionCount総数。
6. `LGPML-G6-UNIT-WIDTH-OCCUPANCY-FRACTION` — depth-labelled unique nonterminal RAW-state presenceのうちlegal reply width=1の割合。

このpanelはLGTGMIV F1-F5からprospectively固定した対称的measurement universeであり、G3-07 confirmed metric/thresholdやG3-05 technical-invalid directionを選択根拠にしない。

## 5. Exact one-ply change process

各metricについて、隣接analysis rootsが同一rule phaseにある場合のみ

`D_m(t) = sign(L_m(t+1) - L_m(t))`

をexact cross-multiplicationで`UP / DOWN / ZERO`に分類する。phaseをまたぐdeltaは`UNDEFINED-PHASE`としてprimary analysisから除外する。float toleranceは0、epsilon導入は禁止する。

## 6. Primary lagged dependence endpoint

Frozen lag set:

`K = {1,2,4,8}` plies。

lag `k`について`D_m(t)`と`D_m(t+k)`を比較する。両deltaがdefinedで、両者が同一rule phaseに属し、両signがnonzeroの場合のみprimary comparable pairとする。

- sign同一 = `SAME`
- sign反対 = `OPPOSITE`
- いずれかZERO = exact countとして保持するがprimary balanceから除外
- phase跨ぎ / window不足 = censored / ineligible

source trajectoryごと、metric×lagごとに:

```text
sameCount
oppositeCount
zeroExcludedCount
comparableNonzero = sameCount + oppositeCount
balance = sameCount - oppositeCount
balanceSign = POSITIVE / NEGATIVE / ZERO
phase-specific support counts = secondary support description
```

を保持する。Primary experimental unitはsource trajectoryであり、lag pairを独立sampleとは扱わない。

## 7. Secondary descriptive endpoints

次はformal promotion/test familyに含めず、exact descriptive artifactとしてのみ保存する。

1. maximal nonzero same-sign run length distribution。
2. first exit disposition: opposite-sign exit / zero exit / phase-window censoring。
3. observed opposite-sign exit後にoriginal signへ戻るかをhorizon `{1,2,4}`で数えるreturn fraction。
4. phase-specific run/return counts。

これらからcausal reset、strategic recurrence、phase transition、half-lifeを自動的に主張しない。

## 8. Fresh population

Source policy:

```text
engine = public/engine.js
PRNG = Mulberry32
legal move order = canonical move identity ascending
move selection = floor(u * legalMoveCount)
max source ply = 80
analysis roots = post-move plies 16..63 inclusive
roots per eligible trajectory = 48
eligible trajectory = all 48 analysis roots nonterminal; no relay-limit; both Namua and Mtaji supply at least 10 analysis roots
final selection = seed ascending among firewall-clean eligible trajectories
seed extension = prohibited
```

Selectionはgeometry level、delta sign、lag result、game outcome、G3-07 search resultを使用しない。

### Stage 1

```text
Stage ID = LGPML-S1-DEVELOPMENT-2026-09-03-v1
seed block = 31810001..31810256
target trajectories = 10
maximum measured roots = 480
```

### Stage 2

```text
Stage ID = LGPML-S2-FORMAL-2026-09-03-v1
seed block = 31820001..31820384
target trajectories = 16
maximum measured roots = 768
```

Technical namespace `31809001..31809008`はscientific use永久禁止。

## 9. Identity and firewall

full source trajectory identityはordered `{moveKey, afterRawSha256}` sequenceのcanonical SHA-256。opening prefixはfirst 16 canonical move keys。analysis segment identityはplies 16..63のordered `{ply,rootRawSha256,moveKey}`。各RAW root identityも保持する。

Stage 1前にprior RG3の利用可能なscientific trajectory / opening-prefix / RAW-root identitiesをoutcome fieldなしでunionしたupstream identity firewallをmaterializeする。technical-invalid Studyのscientific values/directionsは保持しない。

Stage 2はさらにStage 1の:

- full source trajectory
- first-16 opening prefix
- all analysis RAW roots
- analysis segment
- lag-window root identities

をidentity-onlyで除外する。

firewall hit時はそのtrajectoryをineligibleとして固定seed block内でseed ascending selectionを続ける。seed block外への延長は禁止する。

## 10. Stage 1 promotion

Candidate slot = `metricId × lag`、最大24 slots。

trajectory-level candidate supportは:

- complete 48-root level series
- comparable nonzero lag pairs >=4
- Namua comparable nonzero >=1
- Mtaji comparable nonzero >=1

Stage 1でslotをpromotion-eligibleとする条件:

1. complete population 10/10。
2. trajectory-level candidate support >=8/10。
3. nonzero trajectory balance >=6。
4. POSITIVEとNEGATIVEのdominant sideがnonzero balancesの2/3以上。
5. directionはPOSITIVEなら`SAME-DOMINANT`、NEGATIVEなら`OPPOSITE-DOMINANT`としてfreeze。
6. lag hierarchy: lag 2/4/8は、そのmetricの全preceding lagがpromotion-eligibleかつ同じfrozen directionである場合だけpromotionできる。

threshold fitting、metric差替え、孤立した長lagだけのpromotionは禁止する。

promotion 0ならStage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。

## 11. Stage 2 formal test

Stage 1でfreezeされたpromoted identityのみをfresh held-out Stage 2で検証する。

Candidate support gate:

```text
complete Stage 2 trajectories = 16/16
candidate-support trajectories >= 12
nonzero trajectory balances >= 10
```

Estimable candidateについて、nonzero trajectory balanceのPOSITIVE/NEGATIVE countに対する**exact two-sided sign test**を行う。zero balanceはnから除外する。candidate directionはStage 1でfreezeされた方向と一致することを要求する。

Multiplicityは全estimable promoted candidatesに対するHolm-Bonferroni、FWER=`1/20`。

Formal labels:

- `CONFIRMED`: support PASS + frozen direction majority + Holm PASS。
- `NOT-CONFIRMED`: estimableだがformal criterion未達。
- `NON-ESTIMABLE`: support gate未達。p-valueを割り当てない。

## 12. Bounded memory-length derivation

metricごとに、ordered lag set `[1,2,4,8]`の先頭から連続して`CONFIRMED`となった最大lagを`confirmedContiguousLagMax`として機械的に導出する。

lag 1がCONFIRMEDでない場合は`NONE`。lag 8の先への一般化はしない。これは追加のhypothesis testではなく、candidate-level resultsからのdeterministic bounded summaryである。

## 13. Production / independent verification

Productionは`lgtgmiv-stage1-production.js`、independentは`lgtgmiv-stage1-independent.js`へ別々にbindingする。

新規LGPMLのlevel derivation、delta construction、lag aggregation、run/return aggregation、candidate summary、formal testについてproduction/independentが互いをimportしてはならない。共有可能なのはpublic engine APIとfrozen JSON contractのみ。

Scientific equalityはsorted-key canonical JSON UTF-8 bytesのSHA-256 exact equality。prototype-sensitive runtime equalityをmandatory gateに使用しない。

## 14. Exact arithmetic

一次measurementはinteger / BigInt / reduced rational。fraction比較・subtraction・signはcross-multiplicationで行う。scientific float tolerance、post-result rounding threshold、epsilonは使用しない。

## 15. Resource ceilings

Per reconstruction / implementation:

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

Combined production+independent per selected root elapsed ceiling = `360000 ms`。

Stage ceilings:

```text
Stage 1 elapsed <= 10800000 ms / peak RSS <= 4 GiB / result artifact <= 256 MiB
Stage 2 elapsed <= 16200000 ms / peak RSS <= 4 GiB / result artifact <= 384 MiB
```

Stage 0 technical evidenceだけを見て、fresh前に新versionとしてceilingを厳しくすることは可能だが、fresh access後の緩和・延長は禁止する。

## 16. Failure handling

- production/independent trajectory selection mismatch = TECHNICAL-INVALID
- production/independent root measurement / lag summary mismatch = TECHNICAL-INVALID
- relay-limit within required replay/reconstruction = TECHNICAL-INVALID
- malformed/noncanonical artifact or source-binding failure = TECHNICAL-INVALID
- complete population/support/resource-only failure = NON-ESTIMABLE
- root/trajectory replacement outside frozen selection = prohibited
- same-evidence implementation repair rerun = prohibited

## 17. Execution integrity

Fresh Stageごとにmax scientific executions=1。authorizationとtriggerを分離し、durable pre-computation lease、source blob binding、single trigger path、concurrency guard、artifact-before-mirror、exact-byte recovery、execution-count auditを必須とする。

## 18. Stage 0

`LGPML-S0-TECHNICAL-2026-09-03-v1`はtechnical fixtureのみ。

Mandatory controls:

- Study/spec/seed namespace binding
- exact level derivation F1-F5
- exact rational subtraction/sign
- lag `{1,2,4,8}` SAME/OPPOSITE semantics
- ZERO exclusion semantics
- same-phase lag pair eligibility
- first-exit / return / censor semantics
- deterministic technical trajectory replay
- adjacent successor/root identity
- production/independent depth-5 reconstruction equality on technical roots
- canonical equality under prototype/property-order differences
- implementation separation
- technical resource measurement
- protected depth-10 firewall
- no Stage 1/2 seed access

Stage 0 PASSはStage 1を自動authorizeしない。

## 19. No-rescue and interpretation boundary

fresh Stage 1 generation/readの早い方でno-rescue boundaryがcrossする。以後lag、metric、population、seed、support gate、direction rule、formal test、multiplicity、resource ceilingを変更しない。

G3-08からstrategic regime、long-term plan、position value、win probability、best move、forcing line、human memory/difficulty、causal mechanism、whole-game predictabilityを主張しない。

G3-07、G3-05その他既存Studyのformal decisionは変更しない。

## 20. Protected evidence and integration

Standard initial RAW-root complete exact depth-10 holdoutは全Stageで`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`。

Study closure後もユーザーの明示的指示なしに`main`へ統合しない。
