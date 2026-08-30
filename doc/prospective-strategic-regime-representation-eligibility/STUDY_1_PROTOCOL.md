# PSRRE-STUDY1 — 研究protocol

## 1. 研究識別情報

本StudyはResearch Generation 2のcore agenda labelを追加する研究ではない。`G2-10`と`G2-11`の間に置かれたdependency-resolution prerequisite Studyであり、`G2-10 / UMSSR-STUDY1`とは別の新規・prospective・独立研究である。

```text
Research Generation = Research Generation 2
Agenda label = none
Program position = dependency-resolution prerequisite between G2-10 and G2-11
Study ID = PSRRE-STUDY1
Formal title = Prospective Strategic-Regime Representation Eligibility Study 1
Baseline remote main = 3cad9527264c2ee7dfe49ec2258ab0d9d792ca9a
Research branch = research/pre-g2-11-strategic-regime-representation-eligibility
Study directory = doc/prospective-strategic-regime-representation-eligibility
```

日本語題目:

**Baoにおける戦略状態・regime表現の新規構築とprospective eligibility検証 — G2-11長期戦略遷移研究に先立つfresh evidenceベースの独立representation prerequisite**

Stage IDは次のとおり固定する。

```text
PSRRE-S0-TECHNICAL-2026-08-30-v1
PSRRE-S1-DEVELOPMENT-2026-08-30-v1
PSRRE-S2-FORMAL-2026-08-30-v1
```

## 2. 中心的な研究問い

中心課題は、**G2-11のlong-horizon transition解析へ入力候補として渡せる、再現可能かつheld-outでeligibleなstrategic-state / regime representationを、新しいprospective representation familyから構築できるか**である。

本StudyはG2-11のtransition outcomeを先に見てrepresentationを選ぶ研究ではない。representation eligibilityを先に独立検証し、PASSした場合にだけ、凍結成果物をG2-11 candidate inputとして提示できる。

## 3. G2-10との不変境界

`G2-10 / UMSSR-STUDY1`はclosed Studyとして扱う。少なくとも次は変更しない。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
selectedRepresentation = null
Study formal decision = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds 29310001..29314096 = CONSUMED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
G2-11 candidate input authorized = false
```

G2-10のsupport / silhouette / five-fold assignment-stability threshold、`K=2..6`、40-feature dictionary、population、endpoint、seed、formal decisionを結果確認後に変更しない。near-miss candidateのpromotion、G2-10 Stage 1 seedのrerun / replacement / extension、G2-10 Stage 2 seedの流用もしない。

## 4. upstream evidence eligibility

`UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`を本Study固有の正本とする。eligibility vocabularyは次を使用する。

```text
FORMALLY-ELIGIBLE
BOUNDED-EXACT-ELIGIBLE
TECHNICAL-REFERENCE-ONLY
DEVELOPMENT-CANDIDATE-ONLY
INELIGIBLE
```

既存Studyのformal statusはそのまま保持し、technical-invalid / non-estimable / inconclusive / not-authorized outputをvalidated inputへ昇格させない。

## 5. authoritative RAW identity

RAW state identityは次のfieldで固定する。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`はstate identityから除外する。

現時点のtransform authorizationは次のとおりである。

```text
validated transform set = []
canonicalization authorized = false
symmetry reduction authorized = false
```

したがってseat swap、reflection、canonicalization、symmetry quotient、transform-based deduplicationを本Studyへ暗黙に導入しない。

## 6. 新規observable familyの境界

本Studyでは、G2-10の40-feature dictionaryを新Studyの固定feature dictionaryとして再利用しない。代わりに、次の**concept-level candidate observable family**だけをStudy開始時点の候補集合として固定する。

- `RAW-STRUCTURAL`: material、pit occupancy、reserve、house ownership等のRAW state由来observable
- `LEGAL-ACTION-STRUCTURE`: legal move count、capture/non-capture構成、方向構成等
- `ONE-PLY-SUCCESSOR-STRUCTURE`: one-ply successor集合のRAW structural dispersion
- `SEARCH-RELIABILITY-RAW`: search条件間のbest-move / score / top-set等のraw stability observable。G2-02のformal classifierとしては扱わない
- `REPLY-PRESSURE-RAW`: opponent reply-set等をfresh定義するraw observable。G2-07の`F05_ALL`や`lambda=100` modelは使わない
- `TACTICAL-C03-ORIGINAL-SCOPE-ONLY`: Research Generation 1 `TM-S2-C03`の元scopeだけ。Stage 0でexact executable reconstructionできる場合に限る

G2-06 rich classifier、G2-07 reply-pressure model、G2-08 taxonomy leaf、G2-09 generalization boundaryをdirect inputとして使わない。

## 7. representation familyのprospective shortlist

scientific outcomeを見る前のtechnical qualification候補として、次の3 familyを固定する。

```text
RF-A-ROBUST-PCA-WARD
RF-B-ROBUST-PCA-PAM
RF-C-DIRECT-ROBUST-PAM
```

### RF-A

robust scaling後のlatent spaceに対してdeterministic PCAを構築し、Ward hierarchical partitionを行う。held-out assignmentはStage 1で凍結したrepresentative / centroid ruleへ従う。

### RF-B

robust scaling後のdeterministic PCA latent spaceに対し、deterministic PAM / k-medoidsを適用する。held-out assignmentはfrozen medoidへのdeterministic nearest assignmentとする。

### RF-C

PCAを使わず、robust-scaled observable space上でdeterministic PAM / k-medoidsを適用する。latent projection自体への依存を分離するための候補familyである。

このshortlistはG2-10のnear-miss結果に合わせてcandidateを救済するためのものではなく、fresh evidenceを見る前に、異なる幾何仮定とprototype semanticsを比較可能にするための新規contractである。

Stage 0では科学的fit、silhouette、support、stability、cluster解釈を見てfamilyを落としてはならない。Stage 0で除外できる理由は、technical nondeterminism、independent reconstruction failure、serialization failure、resource ceiling failureだけとする。Stage 0を通過したfamilyはすべてStage 1 prefreezeのeligible familyとして残す。

## 8. Stage 0 — technical / instrument feasibility

Stage ID: `PSRRE-S0-TECHNICAL-2026-08-30-v1`

Stage 0はnon-scientific technical stageである。hand-built fixtureまたはtechnical-only seedだけを使い、scientific populationやlong-horizon outcomeを観察しない。

必須確認項目は次のとおりである。

1. baseline remote main / source binding
2. G2-10 immutable closure binding
3. upstream eligibility binding
4. RAW identity production / independent exactness
5. transform authorization set=`[]`
6. scientific seed firewall
7. candidate observable familyのtechnical recomputation
8. robust scalingのdeterministic semantics
9. PCA sign / eigenvalue-tie / component orderingのdeterministic semantics
10. Ward merge tie-breaking / serialization
11. PAM initialization / swap / distance tie-breaking / medoid ordering
12. frozen assignment semantics
13. production / independent implementation separation
14. float canonicalization / serialization / hashing
15. zero-variance / missing / undefined handling
16. artifact completeness
17. runtime / memory / artifact-size ceiling
18. G2-11 reserved outcomeを一切見ていないこと

Stage 0 PASSはStage 1を自動authorizeしない。

## 9. Stage 1 — fresh development / representation selection

Stage ID: `PSRRE-S1-DEVELOPMENT-2026-08-30-v1`

Stage 1 scientific seed消費前に、別のmachine-readable prefreezeで少なくとも次を固定しなければならない。

- source commit / source hashes
- exact observable dictionary
- missing / undefined semantics
- scaling rule
- PCA ruleを使うfamilyのcomponent-selection rule
- familyごとのhyperparameter candidate set
- regime数またはpartition complexityのcandidate set / selection rule
- minimum support / coverage
- stability metricとthreshold
- development-only model-selection hierarchy
- phase / source-policy coverage gate
- trajectory / opening-prefix / RAW-state firewall
- independent recomputation rule
- resource ceilings
- Stage 1 disposition mapping
- Stage 2 promotion gate

Stage 1はfresh development evidenceだけを使う。Stage 1のpopulationをStage 2 formal evidenceへ再利用しない。

## 10. Stage 2 — fresh held-out formal eligibility validation

Stage ID: `PSRRE-S2-FORMAL-2026-08-30-v1`

Stage 2はStage 1から独立したfresh held-out populationを使用する。最低限、次のoverlapを0とする。

```text
seed overlap = 0
historical trajectory overlap = 0
opening-prefix overlap = 0
selected RAW-state overlap = 0
```

Stage 1でfreezeしたrepresentation、assignment rule、threshold、endpointだけを評価し、refit / reclustering / latent-space refit / threshold変更 / subgroup rescueをしない。

primary scientific endpointは、**held-out representation eligibility**とする。具体的なnumeric thresholdはStage 1 scientific seed消費前に固定し、結果後に変更しない。

## 11. G2-11と分離するoutcome

次のoutcomeをrepresentation selectionに使わない。

- transition matrix
- long-horizon regime persistence
- recurrence
- bottleneck / transient structure
- trajectory-family prevalence
- transition asymmetry
- long-horizon survival / hazard
- time-to-first-Mtaji
- acceleration / delay

これらはG2-11側へ残す。

## 12. independent verification

productionとindependent pathは、単純に同じStudy helperをimportして再実行する構造にしない。authoritative game engine / rule semanticsの共有は許すが、少なくとも次は別実装または別計算経路で再構築する。

- RAW key
- root / observation selection
- observable calculation
- robust scaling
- PCA semantics
- Ward / PAM fitting
- frozen assignment
- aggregate eligibility inputs
- final decision mapping
- canonical serialization / hashes

離散値はexact equalityを要求する。floating-pointはStage 0で固定するcanonical encoding / quantization ruleに従って比較する。

## 13. seed reservationとauthorization

新規seed blockを次のとおり予約する。

```text
Stage 0 technical-only = 29500001..29500064
Stage 1 scientific = 29510001..29514096
Stage 2 scientific = 29610001..29618192
```

Stage 1 / Stage 2 blockは現時点で`RESERVED_UNCONSUMED`であり、scientific useは未承認である。G2-10のreserved Stage 2 seeds `29410001..29418192`は使用しない。

## 14. decision vocabulary

Stage 0:

```text
STAGE0-TECHNICAL-PASS
STAGE0-TECHNICAL-INVALID
STAGE0-RESOURCE-CENSORED
```

Stage 1:

```text
STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN
STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
STAGE1-RESOURCE-CENSORED
```

Stage 2 / Study:

```text
ELIGIBLE-WITHIN-FROZEN-REPRESENTATION-DOMAIN
NOT-ELIGIBLE
NON-ESTIMABLE
TECHNICAL-INVALID
RESOURCE-CENSORED
NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1 seedを消費する前に、decision mappingをmachine-readable contractへbindingする。

## 15. no-rescue rule

結果を見た後に、同じStudy内で次を行わない。

- threshold relaxation
- candidate family追加
- hyperparameter range拡張
- favorable subgroup抽出
- alternate endpoint採用
- fresh seed extension / replacement
- manual override
- post-hoc cluster interpretationによるpromotion
- G2-10 contractへのretroactive変更

必要な場合は、新しいprospective Studyとして扱う。

## 16. interpretation boundary

machine-only evidenceからhuman-perceived strategic regime、human difficulty、human misconception、expert salience、human winning chances、game-theoretic truthを主張しない。

public Bao AIの棋力、benchmark、deployment qualityも本Studyのscientific endpointではない。
