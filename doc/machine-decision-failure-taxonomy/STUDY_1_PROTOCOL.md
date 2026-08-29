# MDFT-STUDY1 — Prospective Scientific Protocol

更新日: 2026-08-29  
状態: **STUDY-LEVEL PROTOCOL FROZEN AT INITIATION / STAGE-SPECIFIC EXECUTION NOT YET AUTHORIZED**

## 1. 研究識別

```text
Program label = G2-08
Study ID = MDFT-STUDY1
Formal title = Machine Decision-Failure Taxonomy Study 1
Baseline remote main = cb660e166460e0f19d4ba16d5283fa880d55757f
Branch = research/g2-08-machine-decision-failure-taxonomy
Stage 0 = MDFT-S0-TECHNICAL-2026-08-29-v1
Stage 1 = MDFT-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = MDFT-S2-FORMAL-2026-08-29-v1
```

## 2. Scientific question

単一のbad-move classを直接promotionせず、machine/search decision disagreementを再現可能なmechanistic failure modesへ分解し、fresh development evidenceで構築したtaxonomyをfresh held-out evidenceで再現できるかを検証する。

positive taxonomyを得ること自体を成功条件としない。zero-promotion、non-estimable、not-validated、technical-invalidはいずれも正常なclosure outcomeになり得る。

## 3. Immutable upstream boundaries

以下を変更・救済・再定義しない。

```text
G2-01 / PEOCR-STUDY1 = INCONCLUSIVE
G2-02 / SRDR-STUDY1 = INCONCLUSIVE
G2-03 / STSCV-STUDY1 = INCONCLUSIVE
validated transform set = []
G2-04 / REEOE-STUDY1 = INCONCLUSIVE
G2-04 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-05 / DRSSE-STUDY1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
G2-06 / RCPR-STUDY1 Stage 1 = STAGE1-TECHNICAL-INVALID
G2-06 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-07 / PCRPR-STUDY1 Stage 0 = STAGE0-TECHNICAL-PASS
G2-07 Stage 1 = STAGE1-TECHNICAL-INVALID
G2-07 Stage 1 seeds 28710001..28713072 = CONSUMED
G2-07 same-block rerun/repair/replacement/extension = NOT AUTHORIZED
G2-07 scientificInferenceAuthorized = false
G2-07 confirmatoryReuseAllowed = false
G2-07 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-07 Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
BMP-STUDY1 = 0 CONFIRMED / 4 NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C01/C02/C04 = NOT-CONFIRMED
```

`PCRPR-STUDY1`の`F05_ALL`、`lambda=100`、production OOF performanceはvalidated representation/modelとして使用しない。

## 4. Human-claim firewall

本Studyはmachine-onlyである。以下はformal claim対象外とする。

```text
human difficulty
human confusion
human deception
human error probability
psychological pressure
expert-perceived complexity
traditional Bao terminology equivalence
```

## 5. RAW state / move identity

State identity:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn` / `reason`はidentityから除外する。missing `pending`はscientific entry前にhard rejectする。

Move identityはexact `AI.moveKey`相当の全variant fieldを保持し、coarse moveへcollapseしない。Namua house-choice等のexact variantを別moveとして扱う。

Scientific orderingはexact move identityのlexical canonical orderとする。score tie toleranceは0。TopSetはexact maximum-score move集合、canonical bestはTopSet内lexical minimumとする。

## 6. Search-reference boundary

Higher-resource searchをgame-theoretic truthとみなさない。

Stage 1で使用するcore condition familyは、Stage 0 technical validation後にexact implementation identifier/hashをfreezeするが、概念上のgridは本protocolで次に固定する。

```text
D1_Q1
D2_Q1_BASE
D3_Q1_REFERENCE
D2_Q0
D2_Q2
B256_Q1_MAXD3
B1024_Q1_MAXD3
```

`REFERENCE-CONSENSUS`はD3_Q1_REFERENCEとB1024_Q1_MAXD3がcomplete depth条件を満たし、exact TopSetとcanonical bestが一致する場合のみ成立する。

`REFERENCE-DISAGREEMENT-EVENT`はREFERENCE-CONSENSUS rootにおいてD2_Q1_BASE canonical bestがreference TopSet外である場合とする。

D3/B1024不一致は`REFERENCE-AMBIGUOUS`でありfailureではない。mate-domainとordinary evaluator-domainを一つの数値severityへ混合しない。

## 7. Taxonomy form

Taxonomyはhierarchical multi-labelとする。mutually exclusive primary classを強制しない。

Parent family:

```text
SEARCH_DYNAMICS
REPLY_TACTICS
EVALUATOR_STRUCTURE
POST_ROOT_STRUCTURE
```

Leaf candidateは`FAILURE_MODE_DICTIONARY.md`のMDFT-F01..F10だけをStage 1 search spaceとする。Stage 1 outcome後のleaf追加、削除理由の後付け、閾値変更による救済は禁止する。

Stage 1ではsupport不足による非promotionは許容する。zero promoted leavesも許容する。

## 8. Leakage taxonomy

```text
A = PRE_ROOT_OBSERVABLE
B = BASE_SEARCH_DERIVED
C = REPLY_SEARCH_DERIVED
D = REFERENCE_SEARCH_DERIVED
E = FUTURE_CONTINUATION_DERIVED
F = TERMINAL_OR_GAME_OUTCOME_DERIVED
```

- Fはtaxonomy assignment、leaf promotion、threshold selectionに使用しない。
- Eは`MDFT-F10`だけが明示的なpost-root diagnosticとして使用可能で、pre-root predictorとは呼ばない。
- morphology contextを使う場合はhistorically frozen classifierを再fitせず、Stage 0でexact reproductionできた場合だけF09をeligibleにする。
- 本StudyではStage 1 learned classifierを用いない。rule-based assignmentのみとする。

## 9. Stage 0 — Technical / instrument validation

Stage 0はscientific outcomeを生成しない。

必須control:

1. positive control
2. negative control
3. deterministic replay control
4. exact move-identity control
5. RAW state reconstruction control
6. legal/reply ordering permutation control
7. leakage sentinel control
8. serialization / JSON-roundtrip control
9. independent implementation equality control
10. artifact sharding / transfer preflight

Stage 0ではtechnical fixturesのみを使用し、Stage 1/2 scientific seed blockを消費しない。

Principal variationを扱うleafは、search-consistent canonical line tracerを新規にprospectively technical validationできた場合だけeligibleとする。既存の非search-consistent nominal PVをmechanistic evidenceとして使用しない。

## 10. Stage 1 — Fresh development / taxonomy construction

Reservation:

```text
games = 4096
seeds = 28910001..28914096
status = RESERVED / UNCONSUMED
use = CONSUME-ONCE-DEVELOPMENT-ONLY
```

Scientific generationはStage 1 machine-readable spec、source hash freeze、independent verifier readiness、resource/artifact preflight、explicit authorizationが揃うまで禁止する。

Proposed source/population frameは既存G2 machine studiesと互換なfresh historically reachable RAW statesとし、最終generator parameters、root target、phase quota、support gates、promotion ruleは**Stage 0 outcomeのscientific target distributionを見ずに**Stage 1 specで固定する。

Stage 1 specは少なくとも以下をoutcome前に固定しなければならない。

```text
source generation conditions
root selection / phase assignment / no-replacement rule
trajectory/opening/RAW dedup rule
exact search semantic IDs
reference-consensus rule implementation
leaf assignment rule
leaf technical-eligibility rule
minimum support/diversity gates
zero-promotion handling
Stage 2 target-freeze procedure
serialization/hash contract
resource ceiling
artifact-preservation requirements
consume-once boundary
failure/decision mapping
```

Stage 1 dataはStage 2 formal evidenceへ再利用しない。

## 11. Stage 2 — Fresh held-out prospective validation

Reservation:

```text
games = 8192
seeds = 29010001..29018192
status = RESERVED / UNCONSUMED
use = FORMAL-ONLY
```

Stage 2は自動実行しない。以下をすべて満たした後にのみ別authorizationを作成する。

1. Stage 1 canonical result固定
2. frozen Stage 2 taxonomy / endpoints / criteria
3. Stage 1 trajectory/opening-prefix/RAW-state firewall
4. Stage 2 source freeze
5. independent verifier readiness
6. resource / artifact-preservation preflight
7. explicit authorization

Stage 2 outcome確認後のleaf追加・削除、class境界変更、threshold relaxation、feature substitution、classifier substitution、favorable subgroup限定、seed追加、replacement populationは禁止する。

## 12. Independent verification

ProductionのG2-08 scientific helperをそのままimportしてindependent verificationとしない。

Independent verifierは可能な限り次を別実装で再構築する。

```text
source generation
historical trajectory identity
RAW state reconstruction / key
root selection
exact move identity
search-condition candidate tables
reply-derived measurements
reference-consensus / disagreement event
failure-mode assignment
Stage 1 promotion
Stage 2 validation inputs
final decision inputs
```

authoritative `public/engine.js` / `public/ai.js` semanticsを共有する場合も、G2-08 production result assembly / classification / hash helperは共有しない。

Exact equalityを基本とする。浮動小数点値はcanonical IEEE-754 binary64 representationを保存し、classificationへ使う値のtoleranceを後付けしない。

## 13. Serialization / hashing

SRDR serialization incidentとRCPR floating-point incidentを新Studyの事前technical lessonとして取り込む。

```text
explicit null; undefined禁止
canonical row ordering
canonical key ordering
JSON roundtrip after assembly
persisted representationを対象にSHA-256
binary64-sensitive scalarはhex identityを併記
canonical move/reply ordering before accumulation
```

## 14. Artifact preservation

Scientific seed消費前にtechnical preflightで次を実測し、Stage-specific specへfreezeする。

```text
expected full artifact size
serialization time
compression ratio
upload time
production / independent wall-clock
peak RSS
workflow timeout ceiling
```

保存構造は原則として次を要求する。

```text
ESSENTIAL_CORE.json
FINAL_EXACT_COMPARISON.json
HASH_MANIFEST.json
full production shards
full independent shards
```

full artifactはsharded compressed representationとし、shard size ceilingはtechnical preflight後、scientific outcomeを見る前に固定する。

runner-local full comparisonをupload前に実行し、小さい`FINAL_EXACT_COMPARISON.json`を生成する。ただしrunner-local comparerがPASSしても、prospectively mandatoryとしたartifactの保存失敗を後から免除しない。

Artifact-transfer failure taxonomyとdecision mappingはStage 1 authorization前にmachine-readable specで固定する。

## 15. Consume-once rule

Scientific execution-start gateが成功した時点で該当seed blockは`CONSUMED`となる。その後のcompute、verification、serialization、artifact transfer failureを理由に`UNCONSUMED`へ戻さない。

same-block rerun、repair、replacement、extensionは事前に明示的に許可されていない限り禁止する。本Studyの初期contractでは許可しない。

## 16. Formal disposition taxonomy

Study-specificな最小tokenを次とする。

Stage 0:

```text
STAGE0-TECHNICAL-PASS
STAGE0-TECHNICAL-INVALID
```

Stage 1:

```text
STAGE1-DEVELOPMENT-PASS-AND-TAXONOMY-FROZEN
STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
STAGE1-DEVELOPMENT-BLOCKED-ZERO-PROMOTION
STAGE1-TECHNICAL-INVALID
RESOURCE-CENSORED
```

Stage 2 / Study:

```text
FORMALLY-VALIDATED
NOT-VALIDATED
INCONCLUSIVE
NON-ESTIMABLE
STAGE2-TECHNICAL-INVALID
RESOURCE-CENSORED
NOT-AUTHORIZED-NOT-EXECUTED
```

Technical failureとscientific negative resultを相互変換しない。

## 17. No-rescue rule

既存研究または本Studyのobserved evidenceを見た後にformal decisionをpositiveへ動かす目的で、seed、population、threshold、leaf、evaluator、search depth、reference condition、classifier、subgroup、verification requirementを変更しない。
