# SFCDFT-STUDY4 — Study 4 Protocol

作成日: 2026-09-19  
状態: **`PROSPECTIVE / FROZEN-BEFORE-FRESH-SCIENTIFIC-SEED-ACCESS`**

## 1. 正式識別情報

```text
Program = Research Generation 4 / G4-02
Study ID = SFCDFT-STUDY4
English title = Structural Forcing-Corridor and Tree/RAW Phase-Structure Transfer Study 4 — End-to-end artifact-pipeline validated prospective replication
Japanese title = Baoのstructural forcing corridor・tree/RAW phase structure移送研究4 — artifact pipelineのend-to-end事前検証を導入した独立prospective再検証
research branch = research/g4-02-sfcdft-study4-prereg
baseline main HEAD = c5689d70cd017171e7738140ba9186a117f732f1
parent Study 3 closure HEAD = 91e83b0757c02cd11e2a5f463407a342a91ce3ce
authorization = AUTHORIZED-FOR-PREREGISTRATION-AND-STAGE0-ONLY
fresh scientific seed access at freeze = 0
```

Study 4 は Study 3 の rerun / repair ではない。新しい Study identity、新しい fresh scientific namespace、新しい authorization boundary を持つ独立 prospective successor study である。

## 2. 科学的 contract — Study 3 から変更しない

- C1: `SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`
- C1 frozen direction: `MTAJI-GREATER`
- C6: `SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO`
- C6 frozen direction: `NAMUA-GREATER`
- C1 / C6 は独立 construct
- representation: `RAW-ONLY`
- authoritative state identity: `pits,reserve,houseOwned,player,phase,winner,pending`
- validated transform set: `[]`
- symmetry/canonicalization quotient: not authorized
- local horizon: relative depth 5
- exact integer / reduced rational arithmetic
- source policies P1 / P2
- root families RF1 / RF2
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
- protected-evidence boundaries

Study 3 の technical failure を理由に endpoint、方向、alpha、sample target、domain、resource ceiling、representation を変更しない。

## 3. Source policy / root family / domain

### P1

`LGTTCI-P1-UNIFORM-LEGAL`

canonical legal-move ordering上の全legal movesからMulberry32 uniform selection。

### P2

`LGTTCI-P2-MIN-IMMEDIATE-CAPTURE`

immediate capture countが最小のlegal-move poolを作り、pool内でMulberry32 uniform selection。geometry、search evaluation、historical scientific outcomeを入力しない。

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
SFCDFT4-D1-P1-RF1 = P1 × RF1
SFCDFT4-D2-P1-RF2 = P1 × RF2
SFCDFT4-D3-P2-RF1 = P2 × RF1
SFCDFT4-D4-P2-RF2 = P2 × RF2
```

## 4. Source replay contract

Study 3 の anchor-bounded decision-prefix semantics を変更しない。

1. policy / root-family assignment
2. production / independent による逐次 source replay
3. 各 ply 後に assigned anchor contract を評価
4. Namua/Mtaji pair が双方揃った最初の時点で即停止
5. candidate 完成後の continuation は生成しない
6. candidate 完成前の natural terminal / max source ply 240 は root shortage
7. candidate 完成前の engine `relay-limit` は engine-guard censoring
8. candidate は first-16 opening prefix mandatory
9. production / independent source decision-prefix identity exact equality mandatory

normal candidate statuses:

```text
CANDIDATE-PAIR-COMPLETE
NO-CANDIDATE-ROOT-SHORTAGE
NO-CANDIDATE-ENGINE-GUARD-CENSORING
```

mandatory identity / provenance / serializer / implementation / artifact-contract violation は `TECHNICAL-INVALID`。

## 5. Study 4 の technical remediation

Study 4 で新たに導入する substantive technical change は、fresh scientific access より前の **end-to-end artifact-pipeline validation** だけである。

Stage 0 では non-scientific synthetic fixture を使い、production path と同じ構造で次を通す。

```text
synthetic source fixture generation
-> source classification
-> frozen selection representation
-> source bundle construction
-> artifact upload
-> artifact retrieval
-> digest / manifest verification
-> measurement input parse
-> production / independent dry-run exact agreement
-> aggregate schema validation
```

Stage 0 では Study 4 scientific seed namespaceを読まない。

### 5.1 bundle contract

synthetic bundle は少なくとも次を持つ。

- schema version
- Study / Stage identity
- fixture-only marker
- source-selection manifest
- canonical selected-pair representation
- source artifact identity list
- canonical JSON digest
- producer implementation binding
- consumer schema version

upload 後に retrieval し、retrieved bytes / canonical content / manifest digest の整合性を確認する。

### 5.2 negative fixtures

少なくとも次を fail-closed で検証する。

- bundle missing
- malformed JSON
- schema version mismatch
- missing selected-pair entry
- duplicate pair identity
- digest mismatch
- manifest/content mismatch
- wrong Study / Stage identity
- scientific-seed marker contamination

## 6. Freshness firewall

### 6.1 seed namespace exclusion

Study 1–3 の scientific namespaceをすべて禁止する。

```text
Study 1: 40311001..40311384 / 41311001..41311384 / 40321001..40321768 / 41321001..41321768
Study 2: 40411001..40411384 / 41411001..41411384 / 40421001..40421768 / 41421001..41421768
Study 3: 40511001..40511384 / 41511001..41511384 / 40521001..40521768 / 41521001..41521768
```

### 6.2 Study 3 durable identity firewall

Study 4 Stage 1 authorization 前に、Study 3 の既存 immutable artifacts から seed-free に materialize 可能な identity を durable firewall 化する。

対象:

- source decision-prefix trajectory SHA-256
- first-16 opening-prefix SHA-256
- available Namua/Mtaji RAW-root SHA-256

Study 3 scientific seed の再読、source regeneration、same-evidence repair は禁止する。Stage 2 source-bundle failureのため完全な identity materialization ができない場合でも、Study 3 seed namespace exclusionは必須であり、欠落を都合よく再生成してはならない。

## 7. Fresh seed blocks

### Stage 1

```text
primary = 40611001..40611384 / 384
paired infrastructure reserve = 41611001..41611384 / 384
max infrastructure replacements = 16
max fresh seed reads = 400
```

### Stage 2

```text
primary = 40621001..40621768 / 768
paired infrastructure reserve = 41621001..41621768 / 768
max infrastructure replacements = 24
max fresh seed reads = 792
```

### Stage 0 technical fixture

```text
49041001..49041256 / NON-SCIENTIFIC
```

本protocol freeze時点では Stage 1 / Stage 2 scientific seed は全て `UNREAD`。

reserve は durably journaled infrastructure interruption 専用である。root shortage、engine-guard censoring、firewall reject、preflight failure、endpoint undefined、effect、cell balance、decision の救済には使わない。

## 8. Stage 構成

```text
SFCDFT4-S0-E2E-TECHNICAL-2026-09-19-v1
SFCDFT4-S1-COMPATIBILITY-2026-09-19-v1
SFCDFT4-S2-FORMAL-HELDOUT-2026-09-19-v1
```

### Stage 0

Evidence class = `TECHNICAL-FIXTURE-E2E`。

必須 fixtures / gates:

1. deterministic synthetic source fixture generation
2. deterministic source classification
3. deterministic frozen selection representation
4. production-equivalent source bundle construction success
5. artifact upload success
6. artifact retrieval success
7. retrieved bundle digest / manifest exact match
8. measurement consumer parses retrieved bundle without repair
9. production / independent dry-run exact scientific-structure digest equality
10. aggregate consumer accepts fixed 8-cell schema
11. malformed / missing / mismatched bundle fail-closed
12. fresh scientific seed reads = 0
13. endpoint magnitude / direction / p-value / formal decision output = 0

Stage 0 PASSだけではStage 1 seed accessをauthorizeしない。

### Stage 1

Evidence class = `FRESH-COMPATIBILITY`。各domain target = 8 compatible pairs。

確認可能:

- source support / censoring counts
- root contract
- freshness firewall
- resource preflight
- endpoint definedness
- C1/C6 production/independent canonical digest equality

禁止 output:

- paired effect direction
- human-readable endpoint magnitude
- p-value
- generalization/counterexample decision

Stage 1 は別個の pre-access authorization review が通るまで fresh access 不可。

### Stage 2

Evidence class = `FRESH-FORMAL-HELDOUT`。4 domains × 2 claims = fixed 8 hypotheses、各domain 18 pairs。

Stage 2 は Stage 1 result だけでは自動 authorize しない。

## 9. Candidate selection

Stageごとに source population manifest を先に完成させる。

candidate pair requirements:

1. `candidateStatus = CANDIDATE-PAIR-COMPLETE`
2. RAW/move identity valid
3. all firewalls PASS
4. frozen preflight resource gate PASS

selection key:

`SHA-256(stageId|domainId|slotSeed|effectiveSeed|sourceTrajectorySha256|openingPrefixSha256|namuaRawSha256|mtajiRawSha256)`

各domain内でhex ascending。Stage 2では formal endpoint計算開始後の replacement禁止。

## 10. C1 / C6 endpoints

### C1

`SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION`

- numerator: depth 0..5 `unitWidthStateCount` sum
- denominator: depth 0..5 reply width > 0 の depth-labelled unique RAW-state presence sum
- terminal width 0 は denominator から除外
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

## 11. Stage 2 inference

paired difference = `Mtaji - Namua` exact rational。

各hypothesis:

- selected pairs = 18
- definedness requirement = 18/18
- zero differences は sign-test n から除外
- minimum nonzero = 12
- exact two-sided binomial sign test under p=1/2

fixed family:

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

family-wise alpha = `1/20`。Holm-Bonferroni は8 slots固定。

## 12. Formal decision labels

`GENERALIZES-WITHIN-FROZEN-DOMAIN`

- estimable
- Holm-adjusted rejection PASS
- observed direction = frozen upstream direction

`COUNTEREXAMPLE-BOUNDARY-DETECTED`

- estimable
- Holm-adjusted rejection PASS
- observed direction = frozen upstream directionの反対

`NOT-CONFIRMED`

- estimableだがadjusted testでformal directionを確立しない

`NON-ESTIMABLE`

- frozen support / definedness / minimum-nonzero / resource gate不足
- integrity violationなし

`TECHNICAL-INVALID`

- mandatory identity / serializer / implementation / authorization / execution / provenance / artifact contract違反

Study-wide単一positive verdictは作らず8-cell vectorを正本とする。

## 13. Resource ceilings

Study 3から変更しない。

```text
max distinct RAW = 100000
max unique transitions = 750000
max parent expansions = 100000
max legal move evaluations = 750000
max summed tree occurrences = 1000000000
max elapsed = 180000 ms
max peak RSS = 4294967296 bytes
max root artifact = 67108864 bytes
Stage 1 max selected pairs = 32
Stage 1 max roots = 64
```

## 14. No-rescue / no-rerun

fresh access後は次を禁止する。

- full population rerun
- deterministic scientific failure reserve replacement
- seed extension
- reserve-of-reserve
- threshold / endpoint / domain / sample target changes
- failed source repair replay
- favorable subgroup rescue
- Study 1/2/3 scientific seed reread
- Study 3 Stage 2 repair / rerun
- automatic Stage 2 authorization based on Stage 1 evidence

## 15. 現在の authorization boundary

本freeze時点で認可済み:

- preregistration
- Stage 0 non-scientific implementation / execution
- synthetic fixture only
- seed-free firewall preparation

未認可:

- Stage 1 fresh scientific access
- Stage 2 fresh scientific access
- scientific effect / direction / p-value / formal decision
- main integration
- public AI change

Stage 0 実装・実行後、結果を別途 formal review し、Stage 1 pre-access authorization を新たに判断する。