# SFCDFT-STUDY1 — Study 1 Protocol

作成日: 2026-09-18  
状態: **`PROSPECTIVE / FROZEN-BEFORE-FRESH-SCIENTIFIC-SEED-ACCESS`**

## 1. 正式識別情報

```text
Program = Research Generation 4 / G4-02
Study ID = SFCDFT-STUDY1
English title = Structural Forcing-Corridor and Tree/RAW Phase-Structure Transfer Study 1 — Prospective claim-specific validation of G3-04 C1 and C6 across fresh source-policy × root-family domains
Japanese title = Baoのstructural forcing corridor・tree/RAW phase structure移送研究1 — G3-04 C1・C6をfresh source policy × root family domainで検証するprospective claim別研究
baseline remote main = c5689d70cd017171e7738140ba9186a117f732f1
research branch = research/g4-02-sfcdft-study1
authorization = G4-02-AUTHORIZED
fresh scientific seed access at freeze = 0
```

本StudyはG3-04 `SFCDF-STUDY1`を再実行・拡張するものではない。G3-04でformalに確認された2 claimを、G4-01でcompatibilityを確認済みの別source-policy / root-family domainへ移送したときの成立範囲と反例境界を、新しいfresh populationで検証する。

## 2. 中心科学課題

> `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`の`MTAJI-GREATER`と、`SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`の`NAMUA-GREATER`は、G4-01でSFCDF-compatibleと確認された2 source policy × 2 root familyから成る4つのfresh domainのどこで同方向に成立し、どこで反対方向のformal counterexampleまたはnonconfirmationを示すか。

C1とC6は独立constructとして扱う。片方の結果を見て、他方のpopulation、seed、threshold、resource ceiling、selection、decision ruleを変更しない。

## 3. immutable historical claims

### C1

`SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`

- source Study: `SFCDF-STUDY1`
- historical decision: `CONFIRMED`
- frozen historical direction: `MTAJI-GREATER`
- construct: bounded structural corridor descriptor

endpoint:

- numerator: depth 0..5の`unitWidthStateCount`合計
- denominator: depth 0..5のreply width > 0であるdepth-labelled unique RAW-state presence合計
- terminal width 0はdenominatorから除外
- denominator 0はundefined

### C6

`SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`

- source Study: `SFCDF-STUDY1`
- historical decision: `CONFIRMED`
- frozen historical direction: `NAMUA-GREATER`
- construct: bounded tree-occurrence / RAW-graph inflation descriptor

endpoint:

- numerator: depth 0..5のtree node occurrence合計
- denominator: depth 0..5のglobal distinct RAW state数
- rootは双方に含む
- denominator 0はundefined

C6単独でtransposition、funnel、game-theoretic forcingを証明しない。

## 4. representationとhorizon

```text
representation = RAW-ONLY
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
validated transform set = []
symmetry/canonicalization quotient = NOT AUTHORIZED
relative local horizon = depth 5
scientific arithmetic = exact integer / reduced rational only
floating-point scientific threshold = none
```

tree occurrenceとunique RAW graph stateは別constructである。

## 5. frozen transfer domains

G4-01でSFCDF compatibilityを通過したpolicy/root contractをinstrument definitionとして継承する。G4-01 evidence自体はG4-02 scientific evidenceへ混合しない。

### Source policy

`LGTTCI-P1-UNIFORM-LEGAL`

- canonical legal-move ordering
- 全合法手からuniform PRNG selection

`LGTTCI-P2-MIN-IMMEDIATE-CAPTURE`

- 各合法手のimmediate capture countをrule-semantic simulationで計算
- minimum immediate-capture countのpoolを作る
- tie poolからuniform PRNG selection
- geometry、search evaluation、historical scientific outcomeをpolicyへ入力しない

### Root family

`LGTTCI-RF1-MID-ANCHOR`

- Namua: exact ply 20、nonterminal、phase=namua
- Mtaji: first nonterminal phase=mtaji at ply >=40

`LGTTCI-RF2-OFFSET-ANCHOR`

- Namua: exact ply 28、nonterminal、phase=namua
- Mtaji: exact ply 52、nonterminal、phase=mtaji

### Formal domain IDs

```text
SFCDFT-D1-P1-RF1 = P1 × RF1
SFCDFT-D2-P1-RF2 = P1 × RF2
SFCDFT-D3-P2-RF1 = P2 × RF1
SFCDFT-D4-P2-RF2 = P2 × RF2
```

各domainのexperimental unitは、1 source trajectoryから得るpaired Namua/Mtaji RAW roots 1組である。raw plyを独立標本として扱わない。

## 6. Stage構成

```text
SFCDFT-S0-TECHNICAL-2026-09-18-v1
SFCDFT-S1-COMPATIBILITY-2026-09-18-v1
SFCDFT-S2-FORMAL-HELDOUT-2026-09-18-v1
```

### Stage 0

`TECHNICAL-FIXTURE`のみ。fresh scientific seedへアクセスしない。

検証対象:

- policy replayのproduction / independent一致
- root-family selection
- RAW/move canonical identity
- first-16 opening-prefix hash
- legacy firewall membership
- depth-5 C1/C6 exact computation
- canonical scientific JSON hash
- exact sign-test / Holm fixture
- resource cutoff / technical-invalid fixture

### Stage 1

Evidence class = `FRESH-COMPATIBILITY`

目的はG4-02固有の4 domainでsource support、endpoint definedness、resource envelope、production / independent exactness、firewallを確認することだけである。

**禁止出力:**

- paired effect direction
- effect magnitudeのhuman-readable value
- p-value
- generalization decision
- counterexample decision

root-level C1/C6値をproduction / independentで計算してよいが、保存するscientific compatibility recordはdefinednessとcanonical digestに限定し、pair差・方向・p値を生成しない。

各domain target = 8 compatible pairs。

### Stage 2

Evidence class = `FRESH-FORMAL-HELDOUT`

4 domain × 2 claim = 8 frozen formal hypothesesを評価する。Stage 1 outcomeをselection、threshold、resource ceiling、seed、formal directionへ使用しない。

各domain target = 18 selected pairs。

## 7. source generationとassignment

PRNG = Mulberry32。legal orderingはcanonical move identity ascending。

Policy assignment:

```text
odd primary slot seed -> LGTTCI-P1-UNIFORM-LEGAL
even primary slot seed -> LGTTCI-P2-MIN-IMMEDIATE-CAPTURE
```

Root-family assignment:

```text
first byte of SHA-256(stageId + "|RF|" + primarySlotSeed) mod 2
0 -> LGTTCI-RF1-MID-ANCHOR
1 -> LGTTCI-RF2-OFFSET-ANCHOR
```

assignmentにはgeometry、endpoint、outcomeを使用しない。

source trajectory max ply = 240。

candidate pairはassigned root familyのNamua/Mtaji rootsが両方存在し、nonterminalかつphase/root contractを満たす必要がある。

## 8. candidate selection

Stageごとにfresh seed block全体からcandidate manifestを先に完成させる。

候補は次を満たす必要がある。

1. assigned root pairがcomplete
2. RAW identityとmove identityがvalid
3. G3-04 upstream 4-way identity firewallに抵触しない
4. G4-01 legacy firewallに抵触しない
5. 当該Stageより前に生成されたG4-02 evidenceと4-way identityで重複しない
6. frozen per-root preflight resource gateを満たす

selection key:

`SHA-256(stageId|domainId|slotSeed|effectiveSeed|sourceTrajectorySha256|openingPrefixSha256|namuaRawSha256|mtajiRawSha256)`

各domain内でselection key昇順とする。

Stage 1はcompatibility targetを満たすまでcandidateをscanできる。endpoint definednessはcompatibility gateとして使用できるが、値・方向は保存しない。

Stage 2はsource/firewall/preflight条件だけで最初の18 pairsをfreezeする。formal endpoint計算開始後、undefined、zero、effect direction、measurement valueを理由としたreplacementは禁止する。

## 9. freshness firewall

### G3-04等のscientific evidence

identity-only firewallにより次の4-way exclusionを行う。

- seed
- full source trajectory SHA-256
- first-16 opening-prefix SHA-256
- selected RAW root SHA-256

scientific outcome値をsource selectionへloadしない。

### G4-01 legacy compatibility evidence

`RG4-MA-001-G4-02-LEGACY-COMPATIBILITY-FRESHNESS`に従う。

禁止seed namespace:

```text
40111001..40111384
40211001..40211384
41211001..41211384
```

Stage 1Rに対してfull trajectory 384件とcomplete-anchor RAW root 1198件をexact full-hash equalityで除外する。opening-prefix disjointnessは`NOT-AUDITABLE / NOT-ASSERTED`。

### G4-02 Stage 1 vs Stage 2

Stage 2はStage 1から次をすべて除外する。

- seed
- full source trajectory SHA-256
- first-16 opening-prefix SHA-256
- selected RAW root SHA-256

## 10. fresh seed blocks

### Stage 1 compatibility

```text
primary = 40311001..40311384 / 384 slots
paired infrastructure reserve = 41311001..41311384 / 384 slots
max infrastructure replacements = 16
max fresh seed reads = 400
```

### Stage 2 formal heldout

```text
primary = 40321001..40321768 / 768 slots
paired infrastructure reserve = 41321001..41321768 / 768 slots
max infrastructure replacements = 24
max fresh seed reads = 792
```

reserve seed = primary slot seed + 1,000,000。

reserve使用は、durable journalに`SOURCE-START`があるが`SOURCE-COMMIT`がなく、prior processがseedへアクセスしていないと証明できないinfrastructure interruptionに限る。

reserveをroot shortage、firewall reject、preflight failure、endpoint undefined、effect、cell balance、formal decisionの救済に使用しない。reserve-of-reserveはない。

## 11. Stage 1 compatibility gate

各domainで8 pairsについて次を満たせばcompatible。

- pair root contract valid
- firewall PASS
- preflight PASS
- C1 production/independent canonical digest一致
- C6 production/independent canonical digest一致
- C1/C6 definednessを記録
- scientific value/direction/p-valueをhuman-facing resultへ出さない

4 domainすべてcompatibleならStage 2 preparation eligibility = `FORMAL-PREPARATION-ELIGIBLE`。

不足がintegrity failureなしで生じた場合はStage 1 = `NON-ESTIMABLE`。identity/implementation/provenance contract failureは`TECHNICAL-INVALID`。

Stage 1 PASSはStage 2 seed accessを自動authorizeしない。

## 12. Stage 2 formal inference

各hypothesisは1 endpoint × 1 domain。

paired difference = `Mtaji - Namua` exact rational。

各hypothesis:

- target selected pairs = 18
- endpoint definedness requirement = 18/18
- zero differencesはsign-test nから除外し、zero countを報告
- minimum nonzero = 12
- test = exact two-sided binomial sign test under p=1/2
- observed direction = positive count > negative countなら`MTAJI-GREATER`、逆なら`NAMUA-GREATER`、同数なら`ZERO-DIRECTION`

Multiplicity familyは次の8 tests全体で固定する。

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

family-wise alpha = `1/20`。Holm-Bonferroniを8枠固定で適用する。`NON-ESTIMABLE` hypothesisはmultiplicity familyから消去せず、rejection不能なplaceholderとして扱い、残りtestのmultiplicity負担を事後に軽くしない。

C1とC6をpoolしたeffect estimateは作らない。domain間もpoolしない。

## 13. formal decision mapping

各endpoint × domainについて次のいずれか1つを出す。

`GENERALIZES-WITHIN-FROZEN-DOMAIN`

- estimable
- Holm-adjusted rejection PASS
- observed direction = frozen upstream direction

`COUNTEREXAMPLE-BOUNDARY-DETECTED`

- estimable
- Holm-adjusted rejection PASS
- observed direction = frozen upstream directionの反対

`NOT-CONFIRMED`

- estimableだがadjusted significanceで同方向または反対方向をformalに確立しない

`NON-ESTIMABLE`

- 18/18 definedness、minimum nonzero、population support、prospectively allowed resource gateのいずれかを満たさない
- integrity violationはない

`TECHNICAL-INVALID`

- mandatory identity、serializer、production/independent、authorization、execution-count、provenance、durable artifact等のintegrity contractに違反

Studyは8-cell decision vectorをcanonical resultとし、positive cellsだけを使った単一のStudy-wide「generalized」判定を作らない。

## 14. production / independent verification

productionとindependentは別implementationとする。independent側はproduction aggregation/helperをimportしない。

双方が独立に再構築するもの:

- source replay
- policy assignment / execution
- root-family assignment / selection
- RAW / move canonical identity
- full trajectory hash / opening-prefix hash
- depth-5 RAW local geometry
- C1/C6 exact endpoint arithmetic
- paired differences / signs
- exact binomial sign-test
- Holm ordering / decision mapping

mandatory scientific equality = sorted-key canonical scientific JSON contentのSHA-256 equality。tolerance = 0。

## 15. resource ceilings

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

Stage 0:

```text
max elapsed = 900000 ms
max peak RSS = 2 GiB
max artifact = 128 MiB
```

Stage 1:

```text
selected pairs = max 32
selected roots = max 64
canonical scientific compatibility artifacts = max 512 MiB
```

Stage 2:

```text
selected pairs = 72
selected roots = 144
canonical formal artifacts = max 1.5 GiB
```

fresh access後のresource ceiling増加は禁止する。

## 16. execution integrity

heavy fresh executionはChatGPT sessionの一時runtimeをcanonical execution環境にしない。

prospective route:

`GITHUB-ACTIONS-SHARDED-IMMUTABLE-SOURCE-ARTIFACT-PIPELINE`

要求:

1. Stage-specific one-shot manual trigger
2. authorization commit SHA / source blob binding
3. single concurrency group
4. seed read前のdurable `SOURCE-START`
5. source unit成功時のatomic `SOURCE-COMMIT`
6. primary slotごとのimmutable source artifact
7. source generationとheavy seed-free measurementを分離
8. source artifactを再生成せずdownstream verification可能
9. artifact uploadをrepository summary mirrorより先に行う
10. source executionはStage versionあたり最大1 fresh population acquisition
11. fresh source full-workflow rerun禁止
12. seed-free measurement retryはexact same sealed inputに限定し、source replayを伴わない
13. selected source identity manifestをartifact retentionに依存せずrepositoryへdurableに残す

## 17. stopping / no-rescue

即時停止またはfail-closed対象:

- source/blob binding mismatch
- unauthorized seed read
- duplicate primary/reserve read
- max fresh seed read超過
- RAW/move identity mismatch
- nonterminal zero-legal-move anomaly
- production/independent canonical scientific mismatch
- artifact integrity mismatch
- protected evidence access
- post-freeze contract mutation

fresh access後に禁止:

- endpoint変更
- historical direction変更
- threshold/minimum-nonzero緩和
- alpha/multiplicity変更
- seed追加・置換
- root-family/source-policy変更
- selected pair replacement
- favorable subgroup rescue
- resource ceiling増加
- representation/horizon変更
- symmetry導入
- same-evidence source rerun

## 18. protected evidence

```text
G3-11 depth 10 = historical read-only / no rerun
G3-12 Stage 1 = no repair/replay
G3-12 Stage 2 seeds = unread / not reused
G4-01 old/Stage1R seeds = firewall/quarantine only / no replay
G4-10 depth 11 = not authorized / not accessed
public AI = unchanged
```

## 19. interpretation boundary

本Studyのpositive resultは、指定されたfresh domain内のRAW relative-depth-5 phase contrastに限定する。

次を意味しない。

- whole-Bao universal law
- optimal-play forcing
- forced win
- game-theoretic value
- tactical inevitability
- human difficulty / clarity
- search correctness
- public AI strength
- causal mechanism

G4-01 Stage 1Rとのopening-prefix levelの完全独立は主張しない。

## 20. freeze後に許可される次工程

このprotocol/spec freezeだけではStage 1 fresh seedへアクセスしない。

次に許可される工程は、Stage 0 technical fixtureの実装・validationと、Stage 1 pre-access authorization reviewである。

`main`統合はユーザーの明示指示があるまで禁止する。
