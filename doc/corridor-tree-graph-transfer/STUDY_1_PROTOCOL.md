# CTGTS-STUDY1 — Study 1 Protocol

更新日: 2026-09-18  
状態: **`PROSPECTIVE / FROZEN BEFORE FRESH SCIENTIFIC SEED ACCESS`**

## 1. Formal identity

```text
Program = Research Generation 4 / G4-02
Study ID = CTGTS-STUDY1
English title = Corridor / Tree-Graph Transfer Study 1 — Prospective claim-wise transfer and counterexample-boundary validation of G3-04 C1/C6 across fresh phase, root-family, and source-policy domains
Japanese title = Baoのcorridor・tree/graph phase structureの一般化可能範囲と反例領域 — G3-04 C1・C6をfresh phase、root family、source policyへ移すclaim別検証
baseline main = c5689d70cd017171e7738140ba9186a117f732f1
research branch = research/g4-02-corridor-tree-graph-transfer
authorization = G4-02-AUTHORIZED
```

## 2. Scientific question

中心課題:

> G3-04で限定的に確認されたunit-width occupancyとcumulative tree/RAW ratioのphase差は、G4-01でcompatibility確認済みのfresh source policy / root family domainへ移したとき、どのcellで同方向に成立し、どこで成立しないか。

G3-04のformal resultを再判定するStudyではない。

## 3. Claims

### C1

`CTGTS-C1-UNIT-WIDTH-OCCUPANCY-TRANSFER`

historical reference:

```text
SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION
G3-04 decision = CONFIRMED / MTAJI-GREATER
```

### C6

`CTGTS-C6-CUMULATIVE-TREE-RAW-RATIO-TRANSFER`

historical reference:

```text
SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO
G3-04 decision = CONFIRMED / NAMUA-GREATER
```

C1/C6は別endpoint・別estimability・別formal decisionとして扱う。

## 4. Representation

```text
representation = RAW-ONLY
state identity = pits,reserve,houseOwned,player,phase,winner,pending
validated transform set = []
relative local horizon = 5
symmetry/canonicalization scientific deduplication = NOT AUTHORIZED
```

tree occurrenceとunique RAW graph stateを混同しない。

## 5. Frozen transfer cells

seed mod 4でcellを一意に割り当てる。

```text
mod 4 = 1 -> P1 / RF1
mod 4 = 3 -> P1 / RF2
mod 4 = 0 -> P2 / RF1
mod 4 = 2 -> P2 / RF2
```

P1 = `LGTTCI-P1-UNIFORM-LEGAL`  
P2 = `LGTTCI-P2-MIN-IMMEDIATE-CAPTURE`

RF1:

- Namua = exact ply 20
- Mtaji = first nonterminal phase=mtaji at ply >=40

RF2:

- Namua = exact ply 28
- Mtaji = exact ply 52

各trajectoryは1 cellだけに属する。

## 6. Fresh seed block

```text
42021001..42021768
count = 768
192 assigned seeds per cell
seed extension = NOT AUTHORIZED
seed replacement = NOT AUTHORIZED
reserve seed = NONE
scientific seed access before freeze = 0
```

source generationはMulberry32を使用し、max source plyは80。

## 7. Freshness firewall

### G3-04

G3-04 Stage 1 / Stage 2を含むidentity-only firewallに対して次をexact exclusionする。

- source trajectory
- first-16 opening prefix
- RAW root
- historical seed namespace

### G4-01 compatibility

G4-01のSFCDF compatibility sourceに対して次を除外する。

- seed `40211001..40211384`
- trajectory Bloom positive
- RAW-root Bloom positive

G4-01 artifactではopening-prefix identityが保存されていないため、G4-02限定amendmentによりopening-prefix exact exclusionはmandatoryではない。代わりにG4-01のmeasurement digest・geometry value・effect-like outcomeをselection / threshold / inferenceへ一切利用しない。

### within-study

selected 96 pair内で

- duplicate full trajectory
- duplicate opening prefix
- duplicate RAW root

を認めない。

## 8. Stage 1 selection

全768 source recordを取得した後、C1/C6 endpointを計算せずcandidate selectionを行う。

pair eligibility:

1. frozen cell assignment
2. pair complete
3. freshness firewall PASS
4. within-study uniqueness PASS
5. bounded resource preflight PASS on both roots

selection key:

```text
SHA-256(
  "CTGTS-S1|cellId|seed|trajectorySha256|openingPrefixSha256|namuaRawSha256|mtajiRawSha256"
)
```

各cellでselection key昇順の最初の24 pairをformal populationとする。

24 pairに届かなければ`NON-ESTIMABLE`。追加seedは使わない。

## 9. Endpoints

G3-04の定義を変更しない。

C1:

- numerator = depth 0..5 unit-width state count合計
- denominator = depth 0..5でreply width > 0のunique RAW-state presence合計
- terminal width 0を除外
- denominator 0はundefined

C6:

- numerator = depth 0..5 tree node occurrence合計
- denominator = depth 0..5 global distinct RAW state数
- rootを双方に含む

integer / exact reduced rational、tolerance 0。

## 10. Estimability

claim × cellごとに:

```text
selected pairs = 24
defined coverage = 24/24
nonzero gate = nonzero >= 16
```

population/resource不足でintegrity failureがなければ`NON-ESTIMABLE`。

## 11. Inference

paired difference = `Mtaji - Namua`。

zeroを除いたexact two-sided sign testを使用する。

FWER:

```text
total = 1/20
C1 family = 1/40
C6 family = 1/40
```

各claim内4 cellのp値へHolm-Bonferroniを適用する。

rank別threshold:

```text
1 -> 1/160
2 -> 1/120
3 -> 1/80
4 -> 1/40
```

## 12. Formal decision mapping

claim別:

### GENERALIZES-WITHIN-FROZEN-DOMAIN

4 cellすべてestimableで、4 cellすべてがHolm PASSかつhistorical direction。

### COUNTEREXAMPLE-BOUNDARY-DETECTED

mandatory technical/population gateがvalidで、少なくとも1 cellがHolm PASSかつhistorical directionと反対。

### NOT-CONFIRMED

4 cellすべてestimable、significant opposite cellなし、しかし4 cellすべてのhistorical-direction confirmationには届かない。

### NON-ESTIMABLE

required cellのsupport / coverage / nonzero / resource gateが不足し、technical integrity failureではない。

### TECHNICAL-INVALID

provenance、freshness、production/independent一致、execution-count、protected evidence、post-freeze integrityのmandatory gateが失敗。

## 13. Stage structure

```text
CTGTS-S0-TECHNICAL-2026-09-18-v1
CTGTS-S1-FORMAL-SOURCE-2026-09-18-v1
CTGTS-S2-FORMAL-MEASUREMENT-2026-09-18-v1
```

Stage 0はfresh seedなし。

Stage 1だけがfresh seedを読む。Stage 2はrepositoryへdurable mirror済みのsealed populationだけを使う。

## 14. Execution integrity

Stage 1:

- GitHub Actions immutable artifact pipeline
- fresh read直前にdurable START artifact
- success直後にsource artifact
- automatic rerunなし
- STARTあり/sourceなし = `TECHNICAL-INVALID`
- STARTなしsource欠損だけは「未読」とみなし、事前固定した1回のcontinuationで同じseedを初回read可能
- completed sourceのrereadは禁止

Stage 2:

- 12 measurement tasks
- 8 pair / task
- 16 root / task
- fresh seed read 0
- sealed populationを変更しない

## 15. Durable evidence

Stage 1 closure前にrepositoryへ次をmirrorする。

- sealed 96-pair formal source population
- 768-seed identity / selection audit
- artifact/run/digest attestation

Stage 2はこのrepository mirrorだけから再現可能にする。

## 16. No-rescue

fresh access後は禁止:

- seed extension / replacement
- cell drop
- target pair数変更
- policy/root family変更
- freshness/preflight relaxation
- endpoint変更
- threshold / alpha / multiple-testing変更
- observed evidenceを理由とするresource ceiling増加
- favorable subgroup rescue

## 17. Interpretation boundary

formal claimはfrozen 4-cell、RAW-only relative depth 5に限定する。

以下へ拡張しない。

- whole-Bao universal law
- game-theoretic forcing
- optimal move inevitability
- best-move clarity
- search ease
- human difficulty
- value / win probability
- public AI engineering

G4-01 compatibility evidenceとのopening-prefix strict independenceが検証不能である点も限界として保持する。
