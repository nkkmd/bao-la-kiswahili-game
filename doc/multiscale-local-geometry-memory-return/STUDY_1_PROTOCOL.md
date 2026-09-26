# G4-07 / MLGMR-STUDY1 — Study Protocol

更新日: 2026-09-26  
Program: `Research Generation 4 / G4-07`  
Study ID: `MLGMR-STUDY1`  
状態: **`PROSPECTIVE / FROZEN BEFORE FRESH SCIENTIFIC EVIDENCE`**  
Research branch: `research/g4-07-multiscale-geometry-memory-return`

正式英語題目:

**Multiscale Local Geometry Memory / Return Study 1 — Prospective exact analysis of lagged sign persistence, bounded memory, reversal, and return in fresh continuous-representation Bao trajectories**

正式日本語題目:

**Bao局所ゲーム木幾何の多時間尺度memory・反転・回帰研究1 — fresh trajectory上の連続表現におけるlagged sign persistenceとbounded returnのprospective exact解析**

Authorization review: `G4-07-AUTHORIZATION-REVIEW-2026-09-26-V1`  
Authorization scope: **preregistration + Stage 0 technical-only**  
Fresh Stage 1 / Stage 2 access: **NOT AUTHORIZED**

## 1. 科学的な問い

fresh Bao trajectory上で、continuous local-geometry representationの各axisの変化方向は、4/8/16/32 ply相当の複数時間尺度で同方向へ持続するのか、反対方向へ反転するのか。また、反転後に元の方向へ戻る現象はbounded horizon内でどの程度観測されるか。

本Studyにおける`memory`は、**固定lag集合内の局所geometry change-sign dependence**を意味する。人間の記憶、戦略的意図、position value、best move、whole-game predictability、物理的減衰法則を意味しない。

G4-07はG3-08のrepair/reopen/rerunではない。G3-08のpartial scientific trajectory、Stage 1/2 scientific seed、effect directionを使用しない。

## 2. 上流scientific foundation

直接的な上流scientific foundationはG4-04 `GTTD-STUDY1`とする。

```text
G4-04 C1 directionality / path efficiency = GENERALIZATION-CONFIRMED P1/P2
G4-04 C2 persistence / lag-distance gradient = GENERALIZATION-CONFIRMED P1/P2
G4-04 C3 return fraction = GENERALIZATION-CONFIRMED P1/P2
G4-04 C5 first-order directional path dependence = GENERALIZATION-CONFIRMED P1/P2
G4-04 total = 8 / 8 GENERALIZATION-CONFIRMED
```

G4-02は`CLOSED / NO SCIENTIFIC DECISION`であり、corridor / tree-graph transferのpositive/negative evidenceを供給しない。G4-03 search-ranking resultは本Studyのmemory endpointへ流用しない。

## 3. Immutable representation boundary

```text
representation = CRCLGR-R1-EXACT-SQUASHED-L1
relative depth = 5
axes = CRCLGR-A1..A6
coordinate arithmetic = exact reduced rational
trajectory distance = equal-weight exact L1
validated transform set = []
authoritative RAW identity fields = pits,reserve,houseOwned,player,phase,winner,pending
```

representation、axis集合、relative depth、transform setをStudy内で変更しない。

## 4. Fresh source policy

G4-04でfresh transfer検証に成功した2 policyを用いる。

```text
P1 = LGTTCI-P1-UNIFORM-LEGAL
P2 = LGTTCI-P2-MIN-IMMEDIATE-CAPTURE
```

policy assignmentはfixed seed slot parityでoutcome-blindに行う。

RF1/RF2等のroot-family descriptorはtechnical/support descriptionに限定し、formal subgroup inferenceへ使用しない。

## 5. Longitudinal checkpoint contract

checkpoint gridを次に固定する。

```text
16,20,24,28,32,36,40,44,48,52,56,60,64,68,72
```

隣接checkpoint間隔は4 plyである。trajectoryはcheckpoint 72までnonterminalかつrequired replay/reconstructionがtechnical-validであることを要求する。

G4-04と同じcheckpoint gridを用いる理由は、fresh P1/P2上でdepth-5 continuous representationのtechnical/scientific feasibilityが既に確認されており、G3-08で失敗した48連続raw-ply root reconstructionを再現しないためである。

G4-04のtrajectory identityはfreshness firewallで除外するため、same-evidence replayではない。

## 6. Axis-level change process

axis `a ∈ A1..A6`、checkpoint index `j=0..13`について、隣接checkpointが同一phaseにある場合のみ、exact reduced-rational cross multiplicationで

```text
D_a(j) = sign(X_a(j+1) - X_a(j))
```

を

```text
UP / DOWN / ZERO
```

へ分類する。

隣接checkpointがNamua→Mtaji phase crossingを含む場合、その`D_a(j)`はprimary memory analysisでは`UNDEFINED-PHASE-CROSSING`とし、別のdescriptive context countへ送る。

float tolerance、epsilon、post-result rounding thresholdは使用しない。

## 7. Frozen multiscale lag family

lagはcheckpoint interval単位で次に固定する。

```text
K = {1,2,4,8} checkpoint intervals
ply-equivalent = {4,8,16,32}
```

lag `k`について`D_a(j)`と`D_a(j+k)`を比較する。

Primary comparable pairは次をすべて満たす。

1. 両change signがdefined
2. 両signがnonzero
3. checkpoint `j`から`j+k+1`までの全spanが同一phase
4. required coordinatesがexactly defined

分類:

```text
same sign = SAME
opposite sign = OPPOSITE
any ZERO = ZERO-EXCLUDED
phase crossing in span = PHASE-CROSSING-CENSORED
window shortage = WINDOW-CENSORED
```

## 8. Primary multiscale-memory endpoint family

Candidate identityは

```text
axis × lag = 6 × 4 = 24 slots
```

各trajectory、axis、lagについて次をexact integerで保持する。

```text
sameCount
oppositeCount
zeroExcludedCount
phaseCrossingCensoredCount
windowCensoredCount
comparableNonzero = sameCount + oppositeCount
balance = sameCount - oppositeCount
balanceSign = POSITIVE / NEGATIVE / ZERO
```

Interpretation:

```text
POSITIVE = SAME-dominant / persistence direction
NEGATIVE = OPPOSITE-dominant / reversal direction
ZERO = trajectory-level tie
```

Primary experimental unitはsource trajectory 1本である。lag pair、checkpoint、axis observationを独立sampleとして扱わない。

## 9. Bounded memory-length summary

Stage 2でformal confirmationされたaxis×lag resultから、axisごとにordered lag `[1,2,4,8]`の先頭から連続して`PERSISTENCE-CONFIRMED`となる最大lagを

```text
confirmedContiguousPersistenceLagMax
```

として機械的に導出する。

- lag 1が`PERSISTENCE-CONFIRMED`でなければ`NONE`
- lag 8がconfirmedでも32 plyを超えて外挿しない
- gap後のlong-lag confirmationをcontiguous memory lengthへ昇格しない

これは追加hypothesis testではなく、formal slot resultのbounded deterministic summaryである。

`half-life`という語は本Studyのprimary result tokenとして使用しない。

## 10. Reversal / return descriptive endpoint

各trajectory×axisのnonzero `D_a(j)` sequenceで、最初にsignが反転した位置を`FIRST-REVERSAL`とする。

反転前signを`originSign`、反転後signを`reversedSign`とし、反転後のcheckpoint-change sequenceについて次のbounded horizonを評価する。

```text
H = {1,2,4} change intervals
```

各horizonで:

```text
RETURN = originSignへ復帰
STAY-REVERSED = reversedSignが維持
ZERO-OR-PHASE-CENSORED = exact descriptive count / denominator除外
NO-WINDOW = censored
```

return endpointは本Study v1では**secondary descriptive endpoint**とし、formal p-valueやconfirmation labelを割り当てない。G4-04 C3のformal resultを事後的に再確認するためのsame-evidence testにはしない。

将来formal return testが必要なら、G4-07 v1の結果を見て追加するのではなく、別Study/authorizationでprospectiveに設計する。

## 11. Phase crossing / rule-event context

Namua→Mtaji crossingはprimary lag pairからcensorし、trajectory×axis×lagごとのcensor countを保存する。

capture、nyumba、reserve decrement等のrule-semantic eventはG4-08が専用Agendaであるため、G4-07ではcausal/event-specific formal testを行わない。

Stage 0でexisting engine semanticsからdeterministic event tagsをproduction/independentでexact一致させられる場合に限り、event-present span countをdescriptive artifactへ保存してよい。technical exactnessを満たさないevent tagはfresh access前に`DESCRIPTIVE-MODULE-DISABLED-TECHNICAL`として固定し、scientific endpointへ昇格しない。

## 12. Stage 0 — technical-only

Stage ID:

`MLGMR-S0-TECHNICAL-2026-09-26-v1`

fresh G4-07 scientific seedは読まない。technical/synthetic fixtureのみを使用する。

Mandatory controls:

1. Study/spec/baseline binding
2. fixed representation binding
3. exact reduced-rational coordinate/sign arithmetic
4. checkpoint grid construction
5. lag `{1,2,4,8}` eligibility
6. SAME / OPPOSITE / ZERO semantics
7. whole-span same-phase gate
8. PHASE-CROSSING-CENSORED semantics
9. trajectory-level balance aggregation
10. bounded contiguous persistence summary logic
11. FIRST-REVERSAL / RETURN descriptive logic
12. production / independent implementation separation
13. canonical JSON exact equality
14. identity firewall serialization/matching fixtures
15. technical resource measurement
16. Stage 1/2 seed read count = 0
17. G4-10 depth-11 access count = 0

Stage 0 PASSはStage 1を自動認可しない。

## 13. Stage 1 — development

Stage ID:

`MLGMR-S1-DEVELOPMENT-2026-09-26-v1`

**NOT AUTHORIZED**。

Reserved seed block:

```text
40713001..40713512 / 512 slots
P1/P2 = 256 slots each by fixed parity
```

Candidate targetは各policy 16 complete firewall-clean trajectories、fully eligible minimumは各policy 12、development measurementはfrozen orderのfirst 8 eligible / policyを第一候補として固定する。

Stage 1のscientific outputはeffect directionをblindする。

保存可能:

- candidate/support counts
- endpoint definedness
- comparable-nonzero support category
- production/independent exactness
- resource readiness
- identity/firewall outputs

保存禁止:

- SAME/OPPOSITE balance sign
- effect direction
- formal p-value
- formal confirmation label

### Stage 1 support-only promotion

24 primary slotsのうちStage 2候補へpromotionできるのは、effectを見ずに次を満たすslotだけとする。

```text
complete development trajectories = 16 / 16
policy support = >=6 / 8 measured trajectories per policy with comparableNonzero >=3
combined support = >=12 / 16 measured trajectories
production / independent exact agreement = true
mandatory integrity gates = PASS
```

promotionはsupport-onlyであり、SAME/OPPOSITEの方向を使用しない。

promotion 0ならStage 2は`NOT-AUTHORIZED-NOT-EXECUTED`で閉じる候補とする。

## 14. Stage 2 — formal heldout

Stage ID:

`MLGMR-S2-FORMAL-2026-09-26-v1`

**NOT AUTHORIZED**。

Reserved seed block:

```text
40723001..40724024 / 1024 slots
P1/P2 = 512 slots each by fixed parity
```

Candidate targetは各policy 48 complete firewall-clean trajectories、fully eligible minimumは各policy 40、formal measured populationはfrozen orderのfirst 32 eligible / policyとする。

Stage 2 formal familyはStage 1でsupport-only promotionされたaxis×lag slotsだけで構成する。

各promoted slotについてtrajectory-level `balanceSign`を用いる。

```text
nonzero trajectory balances = POSITIVE vs NEGATIVE
zero trajectory balance = formal nから除外
```

Formal support gate:

```text
measured trajectories = 64 / 64
support trajectories = >=48 / 64
per-policy support = >=20 / 32 each
nonzero trajectory balances = >=40
```

Estimable slotにはexact two-sided binomial sign testを行う。全estimable promoted slotsにHolm-Bonferroni、family alpha=`1/20`。

Formal labels:

```text
Holm PASS + POSITIVE majority = PERSISTENCE-CONFIRMED
Holm PASS + NEGATIVE majority = REVERSAL-CONFIRMED
estimable but Holm/majority criterion未達 = NOT-CONFIRMED
support gate未達 without technical failure = NON-ESTIMABLE
mandatory integrity/implementation failure = TECHNICAL-INVALID
```

formal family、support gate、multiplicityはStage 2 fresh access前のfinal authorizationで再検証するが、scientific outcomeを見て緩和・変更しない。

## 15. Identity firewall

Stage 1 fresh access前にidentity-only firewallをmaterializeする。

Exclusion対象:

- G3-10 Stage 1/2 scientific seed namespaces
- G3-10 auditable full trajectory / opening-prefix / checkpoint-root identities
- G3-08 Stage 1 scientific seed namespace `31810001..31810256`
- G3-08 Stage 2 protected namespace `31820001..31820384`
- G3-08 generated scientific trajectory/root identities where auditable
- G4-01 interrupted GCLD namespace
- G4-01 Stage 1R GCLD primary/reserve namespaces
- G4-04 Stage 1 seed namespace `40413001..40413512`
- G4-04 Stage 2 seed namespace `40423001..40424024`
- G4-04 full trajectory / opening-prefix / checkpoint-root identities

Stage 2はさらにG4-07 Stage 1のseed、full trajectory、opening-prefix、全checkpoint-root identityを除外する。

prior endpoint、effect direction、p-value、game outcomeはfirewall selectionへ含めない。

## 16. Production / independent verification

Productionとindependent implementationは、public engine APIおよびfrozen JSON contract以外のnew G4-07 aggregation implementationを共有しない。

別々に実装する対象:

- checkpoint-axis series extraction
- exact sign construction
- lag pair eligibility
- same/opposite aggregation
- phase-crossing censor
- contiguous persistence summary
- first-reversal/return summary
- support gate
- formal sign-test summary

Scientific equalityはsorted-key canonical JSON UTF-8 bytesのexact equalityとSHA-256で判定する。

## 17. Resource ceiling

G4-04の成功済みresource envelopeを上限設計の基礎とし、fresh access前のStage 0 measurementで厳しくできるが、fresh access後に緩和しない。

Per checkpoint reconstruction / implementation:

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

Combined production+independent per checkpoint root:

```text
elapsed <= 360000 ms
```

Stage ceilings:

```text
Stage 1 elapsed <= 10800000 ms
Stage 2 elapsed <= 16200000 ms
peak RSS <= 4 GiB
Stage 1 result artifact <= 256 MiB
Stage 2 result artifact <= 384 MiB
```

## 18. Execution integrity

長時間処理はGitHub Actionsを第一候補とする。

fresh Stageごとに:

```text
max scientific executions = 1
authorization and trigger = separated
durable pre-computation lease = required
source blob binding = required
single trigger path = required
concurrency guard = required
artifact-before-mirror = required
run ID / attempt / source SHA = recorded
artifact ID / SHA-256 = recorded
fresh seed read count = recorded
G4-10 depth-11 access count = 0 required
```

workflow失敗とscientific negative resultを混同しない。

## 19. Failure handling

- production/independent trajectory selection mismatch = `TECHNICAL-INVALID`
- production/independent axis/sign/lag summary mismatch = `TECHNICAL-INVALID`
- malformed/noncanonical artifact or source-binding failure = `TECHNICAL-INVALID`
- relay-limit within required selected trajectory reconstruction = `TECHNICAL-INVALID`
- fixed population/support不足 without technical error = `NON-ESTIMABLE`
- firewall conflict = candidate ineligible within frozen block
- seed block外extension = prohibited
- selected trajectory replacement after manifest = prohibited
- same-evidence repair rerun = prohibited

## 20. No-rescue boundary

最初のfresh Stage 1 seed generation/readの早い方でno-rescue boundaryをcrossする。以後、同Study/version内で次を変更しない。

- source policy
- checkpoint grid
- lag family
- axis family
- primary endpoint
- support gate
- seed block
- selection rule
- formal test
- multiplicity
- resource ceilingの緩和
- favorable phase/rule-event subgroup追加

## 21. Interpretation boundary

本Studyのformal conclusionは、frozen P1/P2 source-policy mixture、checkpoint 16..72、relative depth-5 continuous representation、lag 4/8/16/32 ply相当のbounded範囲に限定する。

次を意味しない。

- whole-Bao universal law
- 32 ply超のmemory
- physical exponential decay / half-life
- game-theoretic value
- best-move correctness
- AI strength / win rate
- human memory / difficulty
- causal rule mechanism
- public AI feature adoption

## 22. Protected evidence / integration

```text
G3-11 depth-10 rerun = PROHIBITED
G4-10 depth-11 access = PROHIBITED / NOT NEEDED
public AI change = NOT AUTHORIZED
main integration = NOT AUTHORIZED until explicit user instruction after closure
```

Stage 0完了後もfresh Stage 1は別authorization reviewを必要とする。
