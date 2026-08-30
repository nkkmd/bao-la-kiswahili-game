# UMSSR-STUDY1 — 判断台帳

更新日: 2026-08-30

この台帳は、scientific evidence生成前に固定した判断と、その後に凍結済みdecision mappingを適用して得たclosure判断を区別して記録する。結果後にscientific contractを変更した項目はない。

## D-001 — Study identity

```text
Program = G2-10
Study ID = UMSSR-STUDY1
Formal title = Unified Multiaxial Strategic State Representation Study 1
```

## D-002 — baseline / branch

```text
baseline remote main = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
branch = research/g2-10-unified-multiaxial-strategic-state-representation
```

## D-003 — Stage IDs

```text
UMSSR-S0-TECHNICAL-2026-08-30-v1
UMSSR-S1-DEVELOPMENT-2026-08-30-v1
UMSSR-S2-FORMAL-2026-08-30-v1
```

## D-004 — upstream eligibility vocabulary

```text
FORMALLY-ELIGIBLE
BOUNDED-EXACT-ELIGIBLE
TECHNICAL-REFERENCE-ONLY
DEVELOPMENT-CANDIDATE-ONLY
INELIGIBLE
```

categoryの意味は`UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`を正本とし、G2-10 outcomeを見た後に変更しない。

## D-005 — G2-06〜G2-09 direct-use firewall

次をvalidated strategic axisとして直接使用しない。

- G2-06 rich representation / classifier
- G2-07 `F05_ALL` / `lambda=100` model
- G2-08 promoted taxonomy / classifier
- G2-09 generalization / counterexample boundary

同じ概念を使う場合はG2-10自身のfresh `DEVELOPMENT-CANDIDATE-ONLY` constructとして定義する。

## D-006 — G2-05 bounded exact boundary

`DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`はstandard initial RAW root depth 0..9だけ`BOUNDED-EXACT-ELIGIBLE`とし、fresh G2-10 stateへ外挿しない。

## D-007 — Research Generation 1 tactical boundary

`TM-S2-C03 = CONFIRMED`はoriginal frozen scope内で不変とする。G2-10でgeneralization labelへ拡張しない。

## D-008 — Research Generation 1 morphology boundary

historical formal claimは変更しない。exact executable reconstructionに必要な保存artifactがない場合、historical classifierをdirect executable inputとして使用しない。

## D-009 — RAW identity

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

## D-010 — seed reservation

開始時に次を予約した。

```text
Stage 0 technical-only = 29300001..29300064 / NON-SCIENTIFIC
Stage 1 scientific = 29310001..29314096 / RESERVED-UNCONSUMED
Stage 2 scientific = 29410001..29418192 / RESERVED-UNCONSUMED
```

G2-09未消費blockは再利用しない。

## D-011 — scientific authorization principle

Stage 0はtechnical-onlyとし、Stage 1 / Stage 2は明示的authorizationなしに実行しない。Stage 1 authorizationはsource/spec/feature/promotion/Stage 2 endpointのprospective freezeとtechnical preflightを必要条件とする。

## D-012 — primary representation

単一scalarへの早期圧縮を既定とせず、multiaxial vector / regime representationを優先する。

## D-013 — development / validation firewall

Stage 2を実行する場合、Stage 1とのoverlapは次をすべて0とする。

```text
seed overlap = 0
historical trajectory overlap = 0
opening-prefix overlap = 0
selected RAW-state overlap = 0
```

## D-014 — independent verification

source population、RAW identity、feature computation、representation assignment、aggregate statistics、final decision inputをproduction implementationとは可能な限り別実装で再構築する。同じhelperの再呼び出しだけをmandatory verificationの代用としない。

## D-015 — floating-point policy

lexical canonical aggregation order、IEEE-754 binary64、canonical serializationをscientific seed消費前に固定し、結果後のtolerance rescueを禁止する。

## D-016 — no-rescue rule

結果後にupstream eligibility、axis、feature、search condition、threshold、K、dimension、population、seed、subgroup、verification requirementを変更して同じStudyを救済しない。

## D-017 — negative / null / non-estimable acceptance

representation不成立、support不足、assignment instability、independent verifier failure、technical gate failure、resource failureを正式なterminal resultとして受け入れる。

## D-018 — G2-11 firewall

G2-10はstate representationの構築・検証に限定する。long-horizon transition / persistence / recurrenceをprimary endpointに混入させない。

## D-019 — documentation language

human-readable Markdownは日本語主体とし、canonical identifier、decision token、field名、hash、pathは原表記を維持する。

## D-020 — Stage 0 source/spec freeze

```text
source/spec freeze commit = 78de03fde8e286f65d1544ad585e9337dad240a0
scientific seed consumption before freeze = false
Stage 1 authorization at freeze = false
Stage 2 authorization at freeze = false
```

Status: **FROZEN TECHNICAL SOURCE BOUNDARY**.

## D-021 — Stage 0 canonical disposition

```text
Stage 0 = STAGE0-TECHNICAL-PASS
workflow run = 33295423785
artifact id = 9727254008
mandatory gates = 14 / 14 PASS
scientific seed use = 0
```

Stage 0 PASSをscientific conclusionやStage 1 automatic authorizationへ読み替えない。

## D-022 — Stage 0後のupstream executable eligibility

```text
G2-02 search result = TECHNICAL-REFERENCE-ONLY
fresh G2-10 search observable = DEVELOPMENT-CANDIDATE-ONLY
TM-S2-C03 = FORMALLY-ELIGIBLE / ORIGINAL-FROZEN-SCOPE-ONLY
historical morphology classifier = INELIGIBLE
fresh G2-10 morphology observable = DEVELOPMENT-CANDIDATE-ONLY
G2-05 depth-9 exact domain = BOUNDED-EXACT-ELIGIBLE / NO EXTRAPOLATION
```

## D-023 — numeric canonicalization technical result

Stage 0 production / independent実装は異なるobject insertion orderから同一canonical binary64表現を生成した。Stage 1でも同じnumeric policyを維持する。

## D-024 — Stage 0 closure時点のStage 1 / 2状態

Stage 0 closure時点では:

```text
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds = RESERVED / UNCONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds = RESERVED / UNCONSUMED
```

だった。これはhistorical stateであり、D-025以降にStage 1のprospective freezeとaccepted executionを記録する。

## D-025 — Stage 1 pre-scientific freeze

Stage 1 population、40-feature dictionary、scaling、deterministic K-means、candidate `K=2..6`、promotion criteria、Stage 2 validation contractをscientific outcome前に固定した。

```text
freeze commit = fbfa65e774fa6bd6a509fb0b3ee903a463a86f17
feature width = 40
dimensionality reduction = NONE-IN-STUDY1
minimum cluster support fraction = 0.10
minimum mean silhouette = 0.05
minimum five-fold assignment stability = 0.80
```

eligible candidateが0の場合の事前decision tokenは:

```text
STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
```

と固定した。

Status: **FROZEN SCIENTIFIC DEVELOPMENT CONTRACT**.

## D-026 — Stage 1 tooling smoke

初回technical-only tooling smoke `33296234733`はpure implementation defectで失敗した。scientific seed未使用かつscientific outcome未生成だったため、scientific contractを変更せず実装だけを修正した。

accepted smoke:

```text
repair commit = 622dfc79aee5915f520c75a23e4123caa74ea865
run = 33296341604
artifact id = 9727521248
disposition = STAGE1-TOOLING-SMOKE-PASS
```

Status: **TECHNICAL TOOLING PASS**.

## D-027 — scientific runner source freeze / repaired-source preflight

consume-once runnerをsource-freezeした後、pre-consumption pathに2件のtechnical defectを検出した。いずれもconsume gate前に停止しscientific seedを消費していない。

```text
run 33296879050 = authorization binding mismatch / scientificSeedsConsumed=false
run 33296962144 = ReferenceError before consumption / scientificSeedsConsumed=false
```

runnerのpre-consumption variable referenceだけを修正し、feature、population、K、threshold、Stage 2 endpointを変更しなかった。

```text
repaired source freeze commit = 10801fbc1529902bf3f4c0aa6e464c1dc39f1267
packaging preflight run = 33297055834
packaging preflight disposition = STAGE1-PACKAGING-PREFLIGHT-PASS
```

Status: **PRE-CONSUMPTION REPAIR / SCIENTIFIC CONTRACT UNCHANGED**.

## D-028 — final Stage 1 authorization

repaired-source preflight PASS後、source-freezeの直接の子commitでStage 1 consume-once authorizationを固定した。

```text
authorization commit = d6487403dba9fa1de8895b473e5e662d90b1f13b
Stage 1 seed block = 29310001..29314096
consumeOnce = true
sameBlockRerunAuthorized = false
Stage 2 authorized = false
```

Status: **STAGE 1 SCIENTIFIC EXECUTION AUTHORIZED ONCE**.

## D-029 — accepted Stage 1 scientific execution

```text
workflow run = 33297178656
job = 99218754656
conclusion = success
artifact id = 9727918107
artifact ZIP SHA-256 = 8f2f92d88ccb040f53bae28acb7124f230d51b00ff4466835adfda6260934e86
Stage 1 seeds = CONSUMED
```

scientific readiness、resource gate、production / independent exact verificationはすべてPASSした。

```text
fullExact = true
selected roots = 512
active features = 40 / 40
```

Status: **ACCEPTED SCIENTIFIC DEVELOPMENT EXECUTION**.

## D-030 — Stage 1 representation decision

凍結済みcandidate `K=2..6`はすべて`eligible=false`だった。

```text
K=2 = stability failure
K=3 = support + stability failure
K=4 = support failure
K=5 = support failure
K=6 = support + stability failure
eligible candidate count = 0
selectedRepresentation = null
```

したがって、結果前に固定したdecision mappingをそのまま適用する。

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
```

K=4はsilhouetteとstabilityを満たしたがminimum supportが0.0078125であり、threshold 0.10を満たさなかった。結果後にthresholdを緩和して採用しない。

Status: **FROZEN SCIENTIFIC NEGATIVE DEVELOPMENT RESULT**.

## D-031 — Stage 2 authorization decision

Stage 2はStage 1で凍結されたrepresentationだけをformal validationする契約である。Stage 1でeligible representationを得られなかったためauthorization prerequisiteを満たさない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
```

Stage 2でrefit、restandardization、reclustering、axis / feature replacement、K変更を行わない。

Status: **FINAL STAGE 2 AUTHORIZATION CLOSURE**.

## D-032 — Study closure / G2-11 boundary

Stage 1 development dispositionとStudy-level formal decisionを、凍結protocol §13のそれぞれのvocabularyに従って分離する。

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = NOT-AUTHORIZED-NOT-EXECUTED
validated strategic representation = false
G2-11 candidate input from UMSSR-STUDY1 = NOT AUTHORIZED
```

これはBaoにstrategic regimeが存在しないことを意味しない。凍結したG2-10 Study 1 contractの範囲でStage 2へ昇格可能なrepresentationを得られなかったことを意味する。

同じStudy内でthreshold relaxation、K range変更、PCA等の追加method、favorable subgroup、Stage 1 rerun / extension、Stage 2 post-hoc authorizationによる救済を行わない。別representationを検証する場合は新しいprospective Studyまたは明示的versioned protocolを必要とする。

Status: **STUDY CLOSED**.


## D-033 — final documentation taxonomy normalization

最終文書監査で、closure文書の一部がStage 1 disposition `STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`をStudy-level formal decisionとしても記載していたことを検出した。凍結protocol §13はStage 1 vocabularyと`Stage 2 / Study` vocabularyを分離しているため、Study-level tokenだけを次へ正規化する。

```text
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = NOT-AUTHORIZED-NOT-EXECUTED
```

これはscientific resultの再判定ではない。accepted Stage 1 artifact、seed consumption、feature、K候補、threshold、promotion rule、Stage 2 non-authorization、G2-11 boundaryは一切変更していない。

Status: **DOCUMENTATION-TAXONOMY-NORMALIZED / SCIENTIFIC-RESULT-UNCHANGED**.
