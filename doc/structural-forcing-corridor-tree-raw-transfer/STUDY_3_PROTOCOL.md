# SFCDFT-STUDY3 — Study 3 Protocol

作成日: 2026-09-19  
状態: **`PROSPECTIVE / FROZEN-BEFORE-FRESH-SCIENTIFIC-SEED-ACCESS`**

## 1. 正式識別情報

```text
Program = Research Generation 4 / G4-02
Study ID = SFCDFT-STUDY3
English title = Structural Forcing-Corridor and Tree/RAW Phase-Structure Transfer Study 3 — Anchor-bounded source replay with engine-guard censoring and unchanged C1/C6 transfer hypotheses
Japanese title = Baoのstructural forcing corridor・tree/RAW phase structure移送研究3 — anchor到達時停止とengine-guard censoringをprospectiveに導入しC1/C6移送仮説を不変で再検証する研究
research branch = research/g4-02-sfcdft-study3-prereg
baseline main HEAD = c5689d70cd017171e7738140ba9186a117f732f1
parent Study 2 closure HEAD = 06515c5f8c3462e1265b40be74283f3a4deb933d
authorization = AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
fresh scientific seed access at freeze = 0
```

`SFCDFT-STUDY1`と`SFCDFT-STUDY2`はいずれも`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`であり、repair/reopenしない。本Studyは新しいStudy identity・fresh seed namespace・fresh populationを持つ独立したprospective再検証である。

## 2. 変更しない科学的contract

次はStudy 2から変更しない。

- C1: `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`
- C1 frozen direction: `MTAJI-GREATER`
- C6: `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`
- C6 frozen direction: `NAMUA-GREATER`
- C1とC6は独立construct
- representation: `RAW-ONLY`
- authoritative state identity: `pits,reserve,houseOwned,player,phase,winner,pending`
- validated transform set: `[]`
- symmetry/canonicalization quotient: not authorized
- local horizon: relative depth 5
- exact integer / reduced rational arithmetic
- source policies P1/P2
- root families RF1/RF2
- 4 source-policy × root-family domains
- Stage 1 target: 8 compatible pairs / domain
- Stage 2 target: 18 selected pairs / domain
- formal family: C1/C6 × 4 domains = fixed 8 hypotheses
- family-wise alpha: `1/20`
- exact two-sided sign test
- fixed-eight Holm-Bonferroni
- scientific decision labels
- resource ceilings
- no-rescue / no-rerun philosophy
- protected evidence boundaries

Study 1/2のtechnical failureを見てendpoint、方向、alpha、sample target、domain、resource ceiling、representationを変更しない。

## 3. source policy / root family / domain

### P1

`LGTTCI-P1-UNIFORM-LEGAL`

- canonical legal-move ordering
- all legal movesからMulberry32 uniform selection

### P2

`LGTTCI-P2-MIN-IMMEDIATE-CAPTURE`

- immediate capture countが最小のlegal-move pool
- pool内でMulberry32 uniform selection
- geometry、search evaluation、historical scientific outcomeを入力しない

### RF1

`LGTTCI-RF1-MID-ANCHOR`

- Namua: exact ply 20 / nonterminal / phase=`namua`
- Mtaji: first nonterminal phase=`mtaji` at ply >= 40

### RF2

`LGTTCI-RF2-OFFSET-ANCHOR`

- Namua: exact ply 28 / nonterminal / phase=`namua`
- Mtaji: exact ply 52 / nonterminal / phase=`mtaji`

### Domains

```text
SFCDFT3-D1-P1-RF1 = P1 × RF1
SFCDFT3-D2-P1-RF2 = P1 × RF2
SFCDFT3-D3-P2-RF1 = P2 × RF1
SFCDFT3-D4-P2-RF2 = P2 × RF2
```

## 4. Study 3で変更するtechnical contract

### 4.1 anchor-bounded source replay

source replayは、assigned root pairを決定するために必要な範囲だけを生成する。

1. policy / root-family assignment
2. production / independentによる逐次source replay
3. 各ply後にassigned anchor contractを評価
4. Namua/Mtaji pairが双方揃った最初の時点で即停止
5. candidate完成後のcontinuationは生成しない
6. candidate完成前にnatural terminalならsupport shortageとして停止
7. candidate完成前にengine `relay-limit`ならengine-guard censoringとして停止
8. candidate完成前にmax source ply 240へ到達した場合はsupport shortageとして停止
9. source decision-prefix identityをproduction / independentでexact比較
10. candidateである場合のみfirst-16 opening-prefix identityをmandatoryとする

candidate完成後の局面はC1/C6 pair選定に不要であり、post-anchor continuationを科学的source identityへ混ぜない。

### 4.2 engine `relay-limit`

`public/engine.js`の`relay-limit`は`MAX_RELAY=512`による実装上の安全ガードであり、Baoの自然なterminal ruleではない。

Study 3ではcandidate完成前にこれへ到達したsourceを次で記録する。

```text
candidateStatus = NO-CANDIDATE-ENGINE-GUARD-CENSORING
scientificTerminal = false
engineGuard = relay-limit
pairComplete = false
endpointMeasurementEligible = false
reserveReplacementEligible = false
```

`state.winner`が設定されていても、relay-limit由来winnerを科学的勝敗・phase結果として利用しない。

### 4.3 candidate status

正常なsource recordは次のいずれかを持つ。

`CANDIDATE-PAIR-COMPLETE`

- assigned Namua/Mtaji rootsが双方存在
- anchor完成時にreplay停止
- `moveCount >= 16`
- first-16 opening prefix mandatory

`NO-CANDIDATE-ROOT-SHORTAGE`

- natural terminalまたはmax source plyまでにpair completeでない
- scientific candidateではない
- endpoint計算・selection対象外
- reserve replacement理由にならない

`NO-CANDIDATE-ENGINE-GUARD-CENSORING`

- pair complete前に`relay-limit`
- engine guardとしてcensor
- Bao terminal evidenceではない
- endpoint計算・selection対象外
- reserve replacement理由にならない

`TECHNICAL-INVALID`

- production/independent mismatch
- pair completeなのにfirst-16 prefixを作れない
- RAW/move identity malformed
- authorization/provenance/blob binding failure
- protected evidence breach

### 4.4 source trajectory identity

Study 3の`sourceTrajectorySha256`は**source decision-prefix trajectory**を表す。開始局面から、次の最初の停止点までのmove-key列をhashする。

- candidate pair完成
- natural terminal
- engine guard censoring
- max source ply 240

Study 1/2の「最大plyまでのfull trajectory」と意味が異なるため、旧trajectory hashとの単純な非一致だけでprefix independenceを主張しない。

## 5. freshness firewall

### 5.1 historical / G4-01 / Study 1

既存のG3-04 historical firewall、G4-01 legacy compatibility firewall、Study 1 durable firewallを継承する。

Study 1禁止namespace:

```text
40311001..40311384
41311001..41311384
40321001..40321768
41321001..41321768
```

### 5.2 Study 2

Study 2の全scientific namespaceを除外する。

```text
40411001..40411384
41411001..41411384
40421001..40421768
41421001..41421768
```

さらに、Study 2 run `35345143248`の382 sealed source artifactsからseed-freeにmaterializeするdurable firewallをStage 1 pre-access prerequisiteとする。

予定path:

`doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study2/`

除外対象:

- Study 2 `sourceTrajectorySha256` exact collision
- first-16 opening-prefix SHA-256 exact collision
- Namua/Mtaji RAW-root SHA-256 exact collision

Study 2 failed slots `40411112` / `40411312`はsealed source identityがないためseed namespace exclusionで保護する。

Study 2 firewallがmaterialize・検証されるまでStage 1 fresh accessをauthorizeしない。

### 5.3 Study 3 Stage 1 vs Stage 2

Study 2より厳密に、同じdecision-prefix semanticsで4-way separationを行う。

- seed
- source decision-prefix trajectory
- first-16 opening prefix
- selected RAW roots

## 6. fresh seed blocks

### Stage 1

```text
primary = 40511001..40511384 / 384
paired infrastructure reserve = 41511001..41511384 / 384
max infrastructure replacements = 16
max fresh seed reads = 400
```

### Stage 2

```text
primary = 40521001..40521768 / 768
paired infrastructure reserve = 41521001..41521768 / 768
max infrastructure replacements = 24
max fresh seed reads = 792
```

### Stage 0 technical fixture

```text
49031001..49031256 / NON-SCIENTIFIC
```

本protocol freeze時点ではStage 1/2 scientific seedは全て`UNREAD`。

reserveはdurably journaled infrastructure interruption専用である。root shortage、engine-guard censoring、short trajectory、firewall reject、preflight failure、endpoint undefined、effect、cell balance、decisionの救済には使わない。

## 7. Stage構成

```text
SFCDFT3-S0-TECHNICAL-2026-09-19-v1
SFCDFT3-S1-COMPATIBILITY-2026-09-19-v1
SFCDFT3-S2-FORMAL-HELDOUT-2026-09-19-v1
```

### Stage 0

Evidence class = `TECHNICAL-FIXTURE`。fresh scientific seedを使わない。

必須fixture:

1. complete pair → pair完成直後にreplay停止
2. pair完成後の追加moveが0
3. short/natural terminal + incomplete pair → `NO-CANDIDATE-ROOT-SHORTAGE`
4. max-ply + incomplete pair → `NO-CANDIDATE-ROOT-SHORTAGE`
5. relay-limit before pair complete → `NO-CANDIDATE-ENGINE-GUARD-CENSORING`
6. relay-limit winnerをscientific terminalとして出力しない
7. complete pair → first-16 prefix mandatory
8. production / independent decision-prefix canonical equality
9. Study 1 known identity collision reject
10. Study 2 known identity collision reject（firewall materialization後）
11. malformed identity fail-closed
12. scientific effect / p-value / generalization outputなし

Stage 0 PASSだけではStage 1 seed accessをauthorizeしない。

### Stage 1

Evidence class = `FRESH-COMPATIBILITY`。

各domain target = 8 compatible pairs。

許可する確認:

- source support / censoring counts
- root contract
- firewall
- resource preflight
- endpoint definedness
- C1/C6 production/independent canonical digest equality

禁止output:

- paired effect direction
- human-readable endpoint magnitude
- p-value
- generalization/counterexample decision

4 domainすべて8 compatible pairsを満たしmandatory exactnessも満たせば`FORMAL-PREPARATION-ELIGIBLE`。

support不足・engine-guard censoring・resource不足でintegrity failureがなければ`NON-ESTIMABLE`。mandatory integrity contract failureは`TECHNICAL-INVALID`。

### Stage 2

Evidence class = `FRESH-FORMAL-HELDOUT`。

4 domains × 2 claims = fixed 8 hypotheses。各domain 18 pairs。

Stage 2はStage 1結果だけでは自動authorizeしない。

## 8. candidate selection

Stageごとにsource population manifestを先に完成させる。

candidate pairに必要:

1. `candidateStatus = CANDIDATE-PAIR-COMPLETE`
2. RAW/move identity valid
3. all firewalls PASS
4. frozen preflight resource gate PASS

selection key:

`SHA-256(stageId|domainId|slotSeed|effectiveSeed|sourceTrajectorySha256|openingPrefixSha256|namuaRawSha256|mtajiRawSha256)`

各domain内でhex ascending。

Stage 2ではformal endpoint計算開始後のreplacement禁止。

## 9. C1 / C6 endpoints

### C1

`SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`

- numerator: depth 0..5 `unitWidthStateCount` sum
- denominator: depth 0..5 reply width > 0のdepth-labelled unique RAW-state presence sum
- terminal width 0をdenominatorから除外
- denominator 0 = undefined
- frozen upstream direction = `MTAJI-GREATER`

### C6

`SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`

- numerator: depth 0..5 tree node occurrence sum
- denominator: depth 0..5 global distinct RAW states
- rootを双方に含む
- denominator 0 = undefined
- frozen upstream direction = `NAMUA-GREATER`

C1/C6をpoolしない。

## 10. Stage 2 inference

paired difference = `Mtaji - Namua` exact rational。

各hypothesis:

- selected pairs = 18
- definedness requirement = 18/18
- zero differencesはsign-test nから除外
- minimum nonzero = 12
- test = exact two-sided binomial sign test under p=1/2

fixed multiplicity family:

```text
C1 × D1
C1 × D2
C1 × D3
C1 × D4
C6 × D1
C6 × D2
C6 × D3
C6 × D4
```

family-wise alpha = `1/20`。Holm-Bonferroniを8 slots固定で適用する。NON-ESTIMABLE slotを削除してfamily sizeを縮小しない。

## 11. formal decision labels

`GENERALIZES-WITHIN-FROZEN-DOMAIN`

- estimable
- Holm-adjusted rejection PASS
- observed direction = frozen upstream direction

`COUNTEREXAMPLE-BOUNDARY-DETECTED`

- estimable
- Holm-adjusted rejection PASS
- observed direction = frozen upstream directionの反対

`NOT-CONFIRMED`

- estimableだがadjusted testでいずれの方向もformal確立しない

`NON-ESTIMABLE`

- frozen support/definedness/minimum-nonzero/resource gate不足
- engine-guard censoringによるsupport不足を含む
- integrity violationなし

`TECHNICAL-INVALID`

- mandatory identity/serializer/implementation/authorization/execution/provenance/artifact contract違反

Study-wideの単一positive verdictは作らず、8-cell decision vectorを正本とする。

## 12. production / independent verification

productionとindependentは別implementationとし、独立に再構築する。

- policy assignment
- anchor-bounded source replay
- root-family assignment / anchor selection
- candidate / censoring status classification
- RAW / move identity
- decision-prefix / opening-prefix identity
- depth-5 local geometry
- C1/C6 arithmetic
- paired signs
- exact sign test
- fixed-eight Holm
- formal decision mapping

mandatory equality = sorted-key canonical scientific JSONのSHA-256 exact equality。tolerance 0。

## 13. resource ceilings

Study 1/2のprospective ceilingを変更しない。

per selected root:

```text
max distinct RAW states = 100000
max unique transitions = 750000
max parent expansions = 100000
max legal-move evaluations = 750000
max summed tree occurrences = 1000000000
max elapsed = 180000 ms
max peak RSS = 4294967296 bytes
max root artifact = 67108864 bytes
```

Stage 1 max selected pairs = 32 / selected roots = 64。post-fresh increaseは禁止する。

## 14. no-rescue / no-rerun

fresh access後に次を行わない。

- full population rerun
- deterministic scientific failureのpaired reserve置換
- seed extension
- reserve-of-reserve
- threshold / endpoint / domain / sample target変更
- failed sourceのrepair replay
- favorable subgroup rescue
- Study 1/2 seed reread
- Stage 1 evidenceからStage 2を自動authorize

## 15. protected evidence

次は本Studyで利用しない。

- G3-11 depth10 rerun
- G3-12 Stage1 replay / repair
- G3-12 Stage2 seed
- G4-01 scientific seed replay
- Study 1/2 scientific seed replay
- G4-10 depth11
- public AI変更

## 16. authorization boundary

```text
Study 3 preregistration = AUTHORIZED
Study 3 Stage 0 technical validation = AUTHORIZED
Study 2 identity firewall materialization = AUTHORIZED / SEED-FREE ONLY
Study 3 Stage 1 fresh access = NOT AUTHORIZED
Study 3 Stage 2 fresh access = NOT AUTHORIZED
main integration = NOT AUTHORIZED
```

Stage 1をauthorizeするには、Study 2 durable firewall、Stage 0 PASS、実行blob binding、one-shot workflow、fresh seed access 0を確認する別のpre-access reviewが必要である。
