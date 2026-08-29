# STSCV-STUDY1 — 判断台帳

更新日: 2026-08-28

## D-001 — Study identity

`G2-03`をResearch Generation 2の新しい独立Studyとして開始しました。

```text
Formal title = State Transformation Semantics / Canonicalization Validation Study 1
Study ID = STSCV-STUDY1
Agenda label = G2-03
```

`G2-03`はAgenda上の順序labelであり、正式なStudy IDではありません。

## D-002 — Study開始時のrepository baseline

```text
prior expected main = a8493d2a50e11f15d16ef8348f2442b262ca275d
observed remote main = a8493d2a50e11f15d16ef8348f2442b262ca275d
match = true
open PRs = 0
research branch = research/g2-03-state-transformation-semantics-canonicalization-validation
```

残存するG2 branchはいずれも`main`よりbehindでahead commitは0であり、競合するactive research branchではありませんでした。

## D-003 — Research Generation 2内での位置づけ

`STSCV-STUDY1`はWave A / P0 `G2-03`です。pure-scienceのtransformation / representation validation Studyであり、AI Engineering outcomeはendpointの外部です。

## D-004 — G2-01 / G2-02の変更しないclosure

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE
SRDR primaryFormalCriterion = null
SRDR uniqueHistoricalTrajectoriesAfterStage1Firewall = 1040 < 1050
```

G2-03のidentity rule、新しいgeneration、transform、canonicalizationを用いて、これらのclosureを救済することはできません。

## D-005 — SIPの変更しないclosure

```text
SIP-STUDY1 validated = 0
SIP-STUDY1 rejected = 0
SIP-STUDY1 NON-ESTIMABLE = 5
v1 = TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION
corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
```

過去のzero-mismatch diagnosticはcontextとしてのみ扱います。

## D-006 — ORISCの変更しないclosure

```text
Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
validated transformation set = []
```

既存のrepository-facing terminal rowを、G2-03 gate repairとして書き換えることはしません。

## D-007 — authoritative RAW state identity

Formal input identityは次です。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`は除外します。`pending`が欠ける場合はfail closedとします。

G2-03で明示的なcanonicalization authorizationが成立するまでは、未検証transform equivalenceをpopulation identityまたはdeduplicationへ使用することを禁止します。

## D-008 — exact move identity

Formal move identityには次を含めます。

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

Namuaのexact legal-move-set evaluationには`moveVariants`が必要です。Engine `sameMove`はscientific identityを定義しません。

## D-009 — Study開始時に固定したStage identity

```text
STSCV-S0-TECHNICAL-2026-08-28-v1
STSCV-S1-DEVELOPMENT-2026-08-28-v1
STSCV-S2-FORMAL-2026-08-28-v1
```

Stage 0はtechnical only、Stage 1はdevelopment、Stage 2はheld-out formal validationです。

## D-010 — 結果を見る前に固定したcontrol

```text
positive = STSCV-C00-IDENTITY
negative = STSCV-C01-LR-NO-DIRECTION-FLIP
```

IDENTITY failureはinstrument / representation failureです。意図的に壊したLR controlはStage 0で検出されなければなりません。

Control自体はscientific findingではありません。

## D-011 — requested transform familyはStage 1前に分類する

Stage 0ではleft-right reflection、pit-index reversal、player swap、player swap + board rotation、row remapping、direction inversion、player-relative orientation transform、および必要なcompositionを検討します。

各transformはStage 1 outcomeを見る前に、unique scientific candidate、exact alias / composition、rule-semantic non-candidateのいずれかへ分類します。

candidate-specific scientific outcome確認後のcandidate definition repairは承認しません。

## D-012 — semantic isomorphismとcanonicalizationは別endpoint

transformがrule-semantic graphを保存していても、fixed-start reachable-population closure requirementを満たさない場合があります。

そのようなtransformはbounded semantic domain内で科学的にvalidateされ得ますが、fixed-start state-space quotient countingへの使用が自動的に承認されるわけではありません。

Canonicalizationには別のdomain / reachability authorization gateが必要です。

## D-013 — candidate exactness rule

適用対象となるformal transform gateではmismatch countをexactに0と要求します。

tolerance、approximate pass rate、favorable exclusion、outcome後のsubgroup restrictionは認めません。

## D-014 — candidate decision taxonomy

```text
VALIDATED-BOUNDED-ISOMORPHISM
NOT-VALIDATED
NON-ESTIMABLE
```

technical / reproducibility failureはscientific `NOT-VALIDATED`ではありません。

## D-015 — canonicalization authorization taxonomy

```text
AUTHORIZED-WITHIN-FROZEN-DOMAIN
NOT-AUTHORIZED
NON-ESTIMABLE
```

Authorizationには少なくとも1つのnon-identity validated transformに加え、exact orbit / domain / reachability gateとindependent-verification gateを必要とします。

## D-016 — population principle

Stage 1 / 2 formal inputは、NamuaとMtajiを含むfresh historically reachable RAW stateでなければなりません。

Selectionはtransform outcome / mismatch / search / outcome / favorable candidate behaviorを参照せず行います。

Stage 1 consumed identityはhistorical trajectory、opening prefix、RAW-stateの各levelでStage 2から分離します。

## D-017 — 過去のscientific rowは除外する

SIP、ORISC、REWR、SSGTC、G2-01、G2-02のscientific rowをG2-03 formal confirmation evidenceとして使用しません。

technical design、hypothesis generation、resource planningにのみ利用できます。

## D-018 — independent verifierは必須

Production pathとindependent pathは、可能な範囲で次を別々に再構築しなければなりません。

- RAW serialization
- transform / inverse
- exact legal movesとmove mapping
- successor
- terminal / winner semantics
- graph binding
- candidate mismatch count
- canonicalization check
- decision-input hash

## D-019 — Stage 2を自動承認しない

Stage 1 completionだけではStage 2を承認しません。

Stage 2にはheld-out outcome生成前に、別のprospective spec、source / hash freeze、firewall freeze、formal decision rule、explicit authorizationが必要です。

## D-020 — no-rescue rule

次の結果確認後変更は承認しません。

- candidate repair
- failed-state exclusion
- favorable phase restriction
- seed extension
- state replacement
- tolerance addition
- move-identity change
- threshold relaxation
- canonical representative change
- failed-gate exception
- subgroup rescue
- alternate primary

## D-021 — Study開始時のscientific generation lock

Study開始時点ではStage 1 / Stage 2 scientific outcome generationを承認しません。

次に実行可能なのは`STSCV-S0-TECHNICAL-2026-08-28-v1`に基づくStage 0 technical validationだけです。

## D-022 — Stage 1 development closure

Stage 1はfresh development evidenceとしてのみ完了しました。

```text
selected roots = 72
Namua = 24
Mtaji = 24
Mtaji-houseless = 24
formal candidate decisions authorized = false
```

Stage 1で選択されたtrajectory seed、opening-prefix identity、RAW-state identityは消費済みとし、Stage 2から事前に分離しました。

## D-023 — Stage 2 prospective freezeとauthorization

強化済みStage 2 prefreeze workflow `33145713610`は、Stage 2 scientific outcomeが存在する前にPASSしました。

prefreeze hardeningではstored hashを信用するだけでなく、Stage 1 selection bindingを独立再計算しました。

Stage 2を明示的に承認したのは次のcommitです。

```text
c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

固定formal population:

```text
seeds = 26032001..26032768
target roots per stratum = 32
strata = Namua / Mtaji / Mtaji-houseless
local graph depth = 3
replacement outside seed block = false
seed extension after outcome = false
```

## D-024 — 固定Stage 2 global-failure ruleがclosureを決める

`STAGE_2_DECISION_RULE.json`では、candidate mismatchにscientific decisionを与える前に6つのglobal gateをすべてPASSすることを要求します。

いずれかのglobal gateがFAIL、または成立確認できない場合は次です。

```text
study = INCONCLUSIVE
candidate = NON-ESTIMABLE
canonicalization = NON-ESTIMABLE
scientific mismatch interpretation authorized = false
```

このruleはStage 2 outcome生成前に固定され、workflow failure後も変更していません。

## D-025 — Stage 2 production measurementは完了したがmandatory independent verificationなしでは非決定的

Authorized workflow run `33145860098`はfresh production measurementを完了し、固定target quotaをexactに選択しました。

```text
Namua = 32
Mtaji = 32
Mtaji-houseless = 32
```

Production-only mismatch diagnosticは次でした。

```text
T01 = 0
T02 = 0
T03 = 0
```

これらはdiagnosticとしてのみ保持します。global independent-verification preconditionが成立していないため、`VALIDATED-BOUNDED-ISOMORPHISM` decisionではありません。

## D-026 — independent verifier failureはtechnical / reproducibility failureでありscientific mismatchではない

Mandatory independent verifierはformal-result assembly中に次のerrorで停止しました。

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

canonical independent verification result、formal result、canonical hash、workflow artifact ZIPはscientific workflowによって生成・確定されませんでした。

正式分類は次です。

```text
POST-MEASUREMENT-INDEPENDENT-VERIFIER-RESULT-ASSEMBLY-IMPLEMENTATION-ERROR
```

これはcandidate transformがrule semantics上mismatchした証拠とは解釈しません。

## D-027 — final candidate decision

S2-G5がcomplete canonical independent-verification resultとして成立しなかったため、固定済みglobal-failure ruleを適用します。

```text
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
validated transform set = []
```

failed global gateの下ではscientific mismatch interpretationが承認されないため、どのcandidateにも`NOT-VALIDATED`を付与しません。

## D-028 — final Study decision

```text
STSCV-STUDY1 = INCONCLUSIVE
```

これがStudy 1のterminal formal decisionです。

## D-029 — canonicalizationはnon-estimableかつ未承認

```text
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
scientific population identity may use canonicalization = false
symmetry-reduced state counting authorized = false
```

Production-only semantic-domain canonicalization diagnosticだけでは、mandatory independent verificationなしにendpointを承認できません。

さらに、production diagnosticではT01 / T02 / T03のいずれもstandard initial RAW stateを保存せず、independent standard-start reachability-closure proofも実装されていません。

## D-030 — Study 1内でverifierを結果確認後に修正・再実行しない

verifier variable-name defectが判明したのはfresh held-out Stage 2 production outcome生成後です。

固定済みno-rescue contractにより、Study 1内でverifier sourceを修正し、同じStage 2 evidenceを再実行してcandidate decisionを得ることは禁止します。

将来formal testを行う場合は、新しいprospective Studyまたは明示的に新しいversioned protocol、新しいauthorization、新しいevidenceが必要です。

## D-031 — closure後のdownstream state

STSCV-STUDY1は次を承認しません。

```text
canonicalization for scientific population identity
symmetry-reduced state counting
retrofit of symmetry reduction into SSGTC-STUDY1
retrospective repair/redecision of SIP-STUDY1 or ORISC-STUDY1
G2-01/G2-02 rescue
public AI engineering changes
```

G2-03のterminal closureはupstream Studyの判断を一切変更しません。
