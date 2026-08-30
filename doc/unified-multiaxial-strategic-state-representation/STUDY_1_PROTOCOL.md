# UMSSR-STUDY1 — 研究protocol

## 1. 識別情報

```text
Research Generation = Research Generation 2
Program = G2-10
Study ID = UMSSR-STUDY1
Formal title = Unified Multiaxial Strategic State Representation Study 1
Baseline remote main = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
Research branch = research/g2-10-unified-multiaxial-strategic-state-representation
```

日本語題目:

**Baoにおける多軸戦略状態表現の統合的構築とprospective検証 — search reliability, structural state, reply pressure, decision-failure evidence, tactical structure等のevidence-eligible axesを用いた再現可能なstrategic-state / regime representationの構築**

Stage IDs:

```text
UMSSR-S0-TECHNICAL-2026-08-30-v1
UMSSR-S1-DEVELOPMENT-2026-08-30-v1
UMSSR-S2-FORMAL-2026-08-30-v1
```

## 2. upstream evidence eligibility

`UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`をscientific evidence生成前の正本とする。

eligibility vocabulary:

```text
FORMALLY-ELIGIBLE
BOUNDED-EXACT-ELIGIBLE
TECHNICAL-REFERENCE-ONLY
DEVELOPMENT-CANDIDATE-ONLY
INELIGIBLE
```

G2-10 outcomeを見た後にcategoryを変更しない。

## 3. authoritative RAW identity

G2-10のstate identityは次とする。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

除外:

```text
turn,reason
```

validated transform set:

```text
[]
```

したがってcanonicalization、symmetry reduction、quotient graph、symmetry-based deduplicationは使用しない。

## 4. scientific instrumentのfreeze

Stage 1 scientific seed消費前に、少なくとも次をmachine-readable specへ固定する。

- engine source commit / source hash
- evaluator source / weights / score semantics
- search profiles、depth、node budget、quiescence等
- legal move identity / move serialization
- RAW-state serialization / hash
- source policies
- root selection contract
- candidate axis family set
- feature dictionary
- missing / undefined semantics
- scaling / transformation
- quantization / floating-point comparison rule
- dimensionality reduction候補と選択規則
- clustering / regime discovery候補と選択規則
- cluster / dimension数の候補範囲と選択規則
- stability metric
- Stage 1 readiness gate
- representation promotion rule
- Stage 2 endpoint / threshold / decision mapping

## 5. seed reservation

scientific seedをtechnical testから分離する。

```text
Stage 0 technical-only seeds = 29300001..29300064
use = NON-SCIENTIFIC-TECHNICAL-ONLY

Stage 1 scientific seeds = 29310001..29314096
count = 4096
status = RESERVED / UNCONSUMED

Stage 2 scientific seeds = 29410001..29418192
count = 8192
status = RESERVED / UNCONSUMED
```

G2-09の未消費seed `29110001..29114096` / `29210001..29218192`を再利用しない。

scientific authorization前のtechnical smokeでStage 1 / Stage 2 blockを消費してはならない。

## 6. Stage 0 — technical / eligibility / feasibility

Stage ID: `UMSSR-S0-TECHNICAL-2026-08-30-v1`

Stage 0はtechnical-onlyでありscientific conclusionを生成しない。

必須確認:

1. upstream evidence eligibility audit
2. canonical source binding
3. engine / evaluator / search semantics reconstruction
4. RAW identity serialization / hash exactness
5. validated transform set=`[]`の確認
6. candidate axis inventoryの実装可能性
7. G1 `TM-S2-C03` exact reconstruction可否
8. G1 morphology classifierのcanonical executable reconstruction可否
9. G2-06/07/08 outputをvalidated inputとして参照していないこと
10. deterministic floating-point accumulation order
11. quantization / serialization / hash stability
12. production / independent implementation分離
13. fresh source generation実装可能性
14. trajectory / opening-prefix / RAW identity firewall実装可能性
15. runtime / memory / artifact size / workflow timeoutのresource estimate
16. mandatory artifact completeness / transfer policy
17. technical smoke failure mapping

Stage 0でscientific seedは消費しない。

## 7. Stage 1 — representation development

Stage ID: `UMSSR-S1-DEVELOPMENT-2026-08-30-v1`

Stage 1はfresh development populationだけを使用する。

Stage 1 scientific authorization前に、source、selection、axis、feature、transformation、candidate model family、hyperparameter search space、promotion rule、readiness gateを凍結する。

許可されるdevelopment:

- candidate axis generation
- candidate feature construction
- deterministic scaling / transformation
- preregistered dimensionality reduction候補の比較
- preregistered clustering / regime discovery候補の比較
- assignment stability analysis
- support / degeneracy analysis
- representation selection

禁止:

- outcomeを見た後のaxis追加・削除
- favorable subgroupだけのpromotion
- favorable search depthへのprimary差し替え
- cluster数 / dimension数のpost hoc変更
- threshold relaxation
- same-block replacement / extension
- Stage 1 populationをStage 2 formal evidenceへ再利用

Stage 1がtechnical-invalid、resource-censored、non-estimable、promotion failureとなった場合、Stage 2を自動的にauthorizeしない。

## 8. Stage 1 → Stage 2 promotion

Stage 2 authorizationには、最低でも次のglobal gateをすべて要求する。numeric thresholdはStage 1 seed消費前のmachine-readable specで固定する。

- full source generation completeness
- population diversity / support
- independent source reconstruction
- exact RAW identity agreement
- feature recomputation agreement
- deterministic representation fitting / selection reproducibility
- non-degenerate representation
- minimum regime support
- preregistered assignment stability
- artifact completeness
- resource ceiling compliance

global gateが1件でもFAILした場合、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`とする。

## 9. Stage 2 — formal validation

Stage ID: `UMSSR-S2-FORMAL-2026-08-30-v1`

Stage 2はStage 1から独立したfresh populationを使用する。

firewall:

```text
seed overlap = 0
historical trajectory overlap = 0
opening-prefix overlap = 0
selected RAW-state overlap = 0
```

Stage 1で凍結したrepresentationだけを評価し、refit、reclustering、axis replacement、threshold adjustmentを行わない。

## 10. Stage 2 endpoint階層

### mandatory technical gates

- source population identity
- RAW identity
- feature computation
- representation assignment
- aggregate statistics
- final decision inputs

productionとindependent implementationがpreregistered equality ruleを満たすことを必須とする。

### primary scientific endpoint

**held-out representation support and assignment robustness**。

Stage 1でfreezeしたregime / state-family representationがfresh Stage 2 populationで十分なsupportを持ち、かつprospectively指定したbounded search-condition / representation perturbationに対して事前閾値以上のassignment robustnessを持つかを評価する。

### key secondary

- within-regime coherence
- frozen observable axes上のbetween-regime separation
- phase / source family / search-conditionを跨ぐcross-condition robustness

### descriptive

- phase別support
- source policy別support
- axis distribution
- regime size distribution
- missing / undefined pattern

key secondary / descriptiveだけでprimary failureを救済しない。

## 11. independent verification policy

formal Stageでは、同じhelperの再呼び出しだけをindependent verificationとしない。

可能な限り別実装で次を再構築する。

- source generation / replay
- root selection
- RAW key
- legal moves
- feature computation
- scaling / quantization
- frozen representation assignment
- aggregate endpoint
- final decision mapping

離散量はexact equalityを要求する。浮動小数はStage 0で固定したdeterministic computationとquantization後のcanonical representationを比較対象とし、pre-quantized raw floatだけをhash equalityの唯一条件としない。

## 12. technical smoke policy

technical smokeはStage 0 technical-only seedまたはhand-built fixtureだけを使用する。

scientific runnerのsyntax、source binding、artifact transfer、independent comparer、resource ceilingはscientific authorization前にtechnical smokeする。

technical smokeでscientific seed blockを消費しない。

## 13. decision vocabulary

### Stage 0

```text
STAGE0-TECHNICAL-PASS
STAGE0-TECHNICAL-INVALID
STAGE0-RESOURCE-CENSORED
```

### Stage 1

```text
STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN
STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
STAGE1-RESOURCE-CENSORED
```

### Stage 2 / Study

```text
VALIDATED-WITHIN-FROZEN-REPRESENTATION-DOMAIN
NOT-VALIDATED
NON-ESTIMABLE
TECHNICAL-INVALID
RESOURCE-CENSORED
NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1 seed消費前に、Stage 1 readinessとStage 2 primary thresholdをmachine-readable specへ固定した後、このvocabularyへdecision mappingをbindingする。

## 14. no-rescue rule

G2-10 outcomeを見た後、次を変更して同じStudyを救済しない。

- upstream eligibility
- axis family
- feature definition
- scaling / quantization
- search condition
- dimension / cluster candidate space
- model selection rule
- stability threshold
- support threshold
- primary endpoint
- population / seed block
- subgroup
- independent verification requirement

修正がscientific interpretationに影響する場合は、同じevidenceを再利用せず、新しいprospective Study / versionを必要とする。

## 15. G2-11 boundary

G2-10はstate representationに限定する。transition matrix、long-horizon persistence、recurrence、bottleneck、trajectory family、transition asymmetry、time-to-first-Mtaji、survival、hazard、acceleration、delayをprimary scientific endpointにしない。

## 16. human / game-theoretic boundary

G2-10はhuman difficulty、human error probability、deception、expert terminology、game-theoretic truthをmachine-only evidenceから推定しない。higher-resource searchを真値とみなさない。
