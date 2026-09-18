# SFCDFT-STUDY2 — Study 2 Protocol

作成日: 2026-09-18  
状態: **`PROSPECTIVE / FROZEN-BEFORE-FRESH-SCIENTIFIC-SEED-ACCESS`**

## 1. 正式識別情報

```text
Program = Research Generation 4 / G4-02
Study ID = SFCDFT-STUDY2
English title = Structural Forcing-Corridor and Tree/RAW Phase-Structure Transfer Study 2 — Prospective remediation of source serialization with unchanged C1/C6 transfer hypotheses
Japanese title = Baoのstructural forcing corridor・tree/RAW phase structure移送研究2 — source serializationをprospectiveに修正しC1/C6移送仮説を不変で再検証する研究
research branch = research/g4-02-sfcdft-study2-prereg
authorization = AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
fresh scientific seed access at freeze = 0
```

Study 1 `SFCDFT-STUDY1`は`TECHNICAL-INVALID / NO-DECISION / FAIL-CLOSED`であり、repair/reopenしない。本Studyは新しいStudy identity・fresh seed namespace・fresh populationを持つ独立したprospective再検証である。

## 2. Study 1から変更しない科学的contract

次はStudy 1から変更しない。

- historical claim C1: `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`
- C1 frozen direction: `MTAJI-GREATER`
- historical claim C6: `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`
- C6 frozen direction: `NAMUA-GREATER`
- C1とC6は独立construct
- representation: `RAW-ONLY`
- state identity: `pits,reserve,houseOwned,player,phase,winner,pending`
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
- test: exact two-sided sign test
- multiplicity: fixed-eight Holm-Bonferroni
- scientific decision labels
- no-rescue/no-rerun philosophy
- protected evidence boundaries

Study 1のtechnical failureを見て、endpoint、方向、alpha、sample target、domain、resource ceiling、representationを変更しない。

## 3. frozen source policies / root families

### P1

`LGTTCI-P1-UNIFORM-LEGAL`

- canonical legal-move ordering
- all legal movesからMulberry32でuniform selection

### P2

`LGTTCI-P2-MIN-IMMEDIATE-CAPTURE`

- immediate capture countが最小のlegal-move pool
- pool内でMulberry32 uniform selection
- geometry、search evaluation、historical scientific outcomeを入力しない

### RF1

`LGTTCI-RF1-MID-ANCHOR`

- Namua: exact ply 20 / nonterminal / phase=namua
- Mtaji: first nonterminal phase=mtaji at ply >= 40

### RF2

`LGTTCI-RF2-OFFSET-ANCHOR`

- Namua: exact ply 28 / nonterminal / phase=namua
- Mtaji: exact ply 52 / nonterminal / phase=mtaji

### Domains

```text
SFCDFT2-D1-P1-RF1 = P1 × RF1
SFCDFT2-D2-P1-RF2 = P1 × RF2
SFCDFT2-D3-P2-RF1 = P2 × RF1
SFCDFT2-D4-P2-RF2 = P2 × RF2
```

## 4. Study 2で変更するtechnical contract

### 4.1 処理順序

source unitは次の順序で処理する。

1. policy assignment
2. root-family assignment
3. production / independent source replay
4. full trajectory identityの一致確認
5. assigned root-family anchor selection
6. candidate statusの判定
7. candidateである場合のみmandatory first-16 opening-prefix identityを要求
8. firewall / preflight / downstream measurement

Study 1のようにopening-prefix serializerをanchor eligibilityより先に実行しない。

### 4.2 candidate status

source recordは必ず次のいずれかを持つ。

`CANDIDATE-PAIR-COMPLETE`

- assigned Namua/Mtaji rootsが双方存在
- root contract valid
- `moveCount >= 16`
- first-16 opening prefix mandatory

`NO-CANDIDATE-ROOT-SHORTAGE`

- assigned root pairがcompleteでない
- scientific candidateではない
- endpoint計算対象ではない
- selection対象ではない
- reserve replacement理由にならない

`TECHNICAL-INVALID`

- production/independent mismatch
- pair completeなのにfirst-16 prefixを作れない
- RAW/move identity malformed
- authorization/provenance/blob binding failure
- protected evidence breach

### 4.3 short trajectory

`moveCount < 16`かつpair incompleteは正常なpopulation support不足として扱う。

```text
candidateStatus = NO-CANDIDATE-ROOT-SHORTAGE
openingPrefixAvailable = false
openingPrefixLength = moveCount
openingPrefixSha256 = null
```

このrecordはsource acquisition failureではない。

`moveCount >= 16`のno-candidate recordでは、freshness監査のためfirst-16 opening-prefix hashを保存してよい。ただしcandidateへ昇格させない。

pair completeのrecordではfirst-16 opening-prefixは必須であり、nullを許さない。

## 5. freshness firewall

### 5.1 G3-04 / historical scientific evidence

候補sourceについて次を除外する。

- seed
- full trajectory SHA-256
- first-16 opening-prefix SHA-256
- selected RAW-root SHA-256

### 5.2 G4-01 legacy compatibility

既存`RG4-MA-001-G4-02-LEGACY-COMPATIBILITY-FRESHNESS`を継承する。

禁止namespace:

```text
40111001..40111384
40211001..40211384
41211001..41211384
```

G4-01 Stage 1Rのfull trajectoryおよびRAW-root exact hash firewallを維持する。

### 5.3 SFCDFT-STUDY1

Study 1の次を全面的に除外する。

```text
40311001..40311384
41311001..41311384
40321001..40321768
41321001..41321768
```

さらにdurable firewall

`doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study1/`

から次をexact hashで除外する。

```text
source trajectories = 375
first-16 opening prefixes = 375
RAW roots = 660
identity core = 8836ce233aa330538defd7271d4e69389526fafb42f605b542eebf9996522430
```

Study 1 failed 9 slotsにはsealed identityがないため、seed range exclusionで保護する。

### 5.4 Study 2 Stage 1 vs Stage 2

Stage 2はStudy 2 Stage 1から次の4-way identityを除外する。

- seed
- full trajectory
- first-16 opening prefix
- selected RAW roots

short no-candidate trajectoryでopening prefixが存在しない場合は、seed + full trajectory identityを少なくとも除外する。

## 6. fresh seed blocks

### Stage 1

```text
primary = 40411001..40411384 / 384
paired infrastructure reserve = 41411001..41411384 / 384
max infrastructure replacements = 16
max fresh seed reads = 400
```

### Stage 2

```text
primary = 40421001..40421768 / 768
paired infrastructure reserve = 41421001..41421768 / 768
max infrastructure replacements = 24
max fresh seed reads = 792
```

本protocol freeze時点では全て`UNREAD`。

reserveはdurably journaled infrastructure interruption専用である。root shortage、short trajectory、firewall reject、preflight failure、endpoint undefined、effect、cell balance、decisionの救済には使わない。

## 7. Stage構成

```text
SFCDFT2-S0-TECHNICAL-2026-09-18-v1
SFCDFT2-S1-COMPATIBILITY-2026-09-18-v1
SFCDFT2-S2-FORMAL-HELDOUT-2026-09-18-v1
```

### Stage 0

fresh scientific seedを使わないtechnical fixture。

必須fixture:

1. `moveCount < 16` + incomplete pair → `NO-CANDIDATE-ROOT-SHORTAGE`
2. `moveCount >= 16` + incomplete pair → no-candidateとして正常保存
3. complete pair → first-16 prefix mandatory
4. production / independent source classification一致
5. Study 1 known trajectory collision reject
6. Study 1 known opening-prefix collision reject
7. Study 1 known RAW-root collision reject
8. malformed RAW / move identity fail-closed
9. scientific effect / p-value / generalization outputなし

Stage 0 PASSだけではStage 1 seed accessをauthorizeしない。

### Stage 1

Evidence class = `FRESH-COMPATIBILITY`。

各domain target = 8 compatible pairs。

許可する確認:

- source support
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

4 domainすべて8 compatible pairsを満たせば`FORMAL-PREPARATION-ELIGIBLE`。

support不足でintegrity failureがなければ`NON-ESTIMABLE`。mandatory integrity contract failureは`TECHNICAL-INVALID`。

### Stage 2

Evidence class = `FRESH-FORMAL-HELDOUT`。

4 domains × 2 claims = fixed 8 hypotheses。各domain 18 pairs。

Stage 2はStage 1結果だけでは自動authorizeしない。

## 8. candidate selection

Stageごとにsource population manifestを先に完成させる。

candidate pairに必要:

1. `candidateStatus = CANDIDATE-PAIR-COMPLETE`
2. RAW/move identity valid
3. all historical/current firewalls PASS
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
- integrity violationなし

`TECHNICAL-INVALID`

- mandatory identity/serializer/implementation/authorization/execution/provenance/artifact contract違反

Study-wideの単一positive verdictは作らず、8-cell decision vectorを正本とする。

## 12. production / independent verification

productionとindependentは別implementationとする。

独立に再構築:

- policy assignment / source replay
- root-family assignment / anchor selection
- candidate-status classification
- RAW / move identity
- trajectory / opening-prefix identity
- depth-5 local geometry
- C1/C6 arithmetic
- paired signs
- exact sign test
- fixed-eight Holm
- formal decision mapping

mandatory equality = sorted-key canonical scientific JSONのSHA-256 exact equality。tolerance 0。

## 13. resource ceilings

Study 1のprospective ceilingを変更しない。

per selected root:

```text
max distinct RAW states = 100000
max unique transitions = 750000
max parent expansions = 100000
max legal-move evaluations = 750000
max summed tree node occurrences = 1000000000
max elapsed = 180000 ms
max peak RSS = 4 GiB
max root artifact = 64 MiB
```

Stage 1 selected max = 32 pairs / 64 roots。Stage 2 = 72 pairs / 144 roots。

fresh access後のceiling増加禁止。

## 14. execution integrity

canonical heavy execution = `GITHUB-ACTIONS-SHARDED-IMMUTABLE-SOURCE-ARTIFACT-PIPELINE`。

要求:

1. stage-specific authorization commit / blob binding
2. single concurrency group
3. seed read前のdurable `SOURCE-START`
4. slotごとのimmutable source record
5. no-candidateも正常なsealed source recordとして保存
6. source generationとseed-free measurementを分離
7. fresh source populationのfull rerun禁止
8. seed-free measurement retryは同一sealed inputのみ
9. selected identity manifestをrepositoryへdurable保存
10. artifact uploadをsummary mirrorより先に行う

## 15. no-rescue / stopping

fresh access後は禁止:

- endpoint/direction変更
- alpha/multiplicity変更
- seed extension
- short trajectoryをreserveで置換
- root shortageをreserveで置換
- policy/root-family変更
- favorable subgroup rescue
- selected pair replacement
- resource ceiling増加
- representation/horizon変更
- symmetry導入
- same-evidence source rerun

Study 1 seed/artifactをscientific inputとして再利用しない。

## 16. authorization boundary

このprotocol freezeだけではStage 1 fresh seedへアクセスしない。

次に許可される工程:

- Study 2 source serializer production/independent実装
- Study 1/G4-01/G3 firewallsのvalidator実装
- Stage 0 technical fixtures
- Stage 1 Actions design / blob binding準備

Stage 0 PASS後、別のStage 1 pre-access authorizationが必要。

`main`統合はユーザーの明示指示があるまで行わない。
