# MDFT-STUDY1 — Decision Register

更新日: 2026-08-29

## D01 — Study identity

```text
Program = G2-08
Study ID = MDFT-STUDY1
Formal title = Machine Decision-Failure Taxonomy Study 1
Baseline main = cb660e166460e0f19d4ba16d5283fa880d55757f
Branch = research/g2-08-machine-decision-failure-taxonomy
```

Status: **FROZEN**.

## D02 — Stage identity

```text
Stage 0 = MDFT-S0-TECHNICAL-2026-08-29-v1
Stage 1 = MDFT-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = MDFT-S2-FORMAL-2026-08-29-v1
```

Status: **FROZEN**.

## D03 — New independent study / no rescue

G2-01..G2-07、Research Generation 1、BMP-STUDY1、TM-STUDY1等のformal decision、threshold、classifier、endpoint、population、representation boundary、verification requirementを変更・救済しない。

Status: **FROZEN IMMUTABLE BOUNDARY**.

## D04 — G2-07 closure boundary

```text
PCRPR Stage 1 = STAGE1-TECHNICAL-INVALID
PCRPR Stage 1 seeds 28710001..28713072 = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
PCRPR Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
PCRPR Stage 2 seeds 28810001..28816144 = RESERVED / UNCONSUMED
```

Production/independent development-core stdout一致をmissing full independent artifactの代替verificationにしない。`F05_ALL`、`lambda=100`、production OOF metricsはvalidated inputにしない。

Status: **FROZEN IMMUTABLE BOUNDARY**.

## D05 — RAW identity

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

Status: **FROZEN**.

## D06 — Human-claim firewall

machine failure modeからhuman difficulty/confusion/deception/error probability/psychological pressure/expert complexity/traditional terminologyを推定しない。

Status: **FROZEN**.

## D07 — Reference is not truth

D3/high-budget等のhigher-resource searchはfrozen machine referenceでありgame-theoretic truthではない。

Status: **FROZEN**.

## D08 — Failure-event entry rule

D3_Q1 referenceとB1024_Q1_MAXD3がcomplete-depth条件を満たしてexact TopSet/canonical bestで一致したrootだけをREFERENCE-CONSENSUSとする。D2_Q1_BASE canonical bestがreference TopSet外ならREFERENCE-DISAGREEMENT-EVENT。reference間不一致はREFERENCE-AMBIGUOUSで、failure labelを強制しない。

Status: **FROZEN STUDY-LEVEL RULE; exact implementation hash pending Stage 0**.

## D09 — Multi-label taxonomy

Taxonomyはhierarchical multi-labelとし、mutually exclusive primary classを強制しない。co-occurrenceは結果として保存する。

Status: **FROZEN**.

## D10 — Candidate leaf search space

Stage 1で許可するcandidate leafは`MDFT-F01..MDFT-F10`のみ。Stage 1 outcome後のleaf追加は禁止する。

Status: **FROZEN SEARCH-SPACE BOUNDARY**.

## D11 — Learned classifier禁止

Study 1のStage 1 taxonomy assignmentはrule-basedとし、generic learned classifierを結果後に追加しない。

Status: **FROZEN**.

## D12 — Leakage taxonomy

```text
A = PRE_ROOT_OBSERVABLE
B = BASE_SEARCH_DERIVED
C = REPLY_SEARCH_DERIVED
D = REFERENCE_SEARCH_DERIVED
E = FUTURE_CONTINUATION_DERIVED
F = TERMINAL_OR_GAME_OUTCOME_DERIVED
```

Fはtaxonomy assignment/promotionに使用しない。Eを使うF10はpost-root diagnosticでありpre-root predictionではない。

Status: **FROZEN**.

## D13 — Stage 1 fresh block reservation

```text
games = 4096
seeds = 28910001..28914096
use = CONSUME-ONCE-DEVELOPMENT-ONLY
status = RESERVED / UNCONSUMED
```

Reservationはauthorizationではない。

Status: **FROZEN RESERVATION**.

## D14 — Stage 2 fresh block reservation

```text
games = 8192
seeds = 29010001..29018192
use = FORMAL-ONLY
status = RESERVED / UNCONSUMED
```

Reservationはauthorizationではない。

Status: **FROZEN RESERVATION**.

## D15 — Stage 0 contains no scientific inference

Stage 0はtechnical fixtures / controls / resource / artifact preflight専用。Stage 1/2 scientific seedは使用しない。

Status: **FROZEN**.

## D16 — Exact move / tie contract

Exact move variant identity、lexical canonical ordering、tie tolerance 0、exact TopSet、lexical canonical bestを採用する。

Status: **FROZEN**.

## D17 — PV / line-trace boundary

search-consistent canonical line tracerをStage 0でprospectively検証できない場合、F05をStage 1開始前にTECHNICALLY-INELIGIBLEとして固定する。既存nominal PVを代替利用しない。

Status: **FROZEN TECHNICAL ELIGIBILITY RULE**.

## D18 — Morphology boundary

historically frozen morphology classifierをrefitしない。Stage 0でexact reconstructionできない場合F09をTECHNICALLY-INELIGIBLEとして固定し、代替classifierを結果後に導入しない。

Status: **FROZEN TECHNICAL ELIGIBILITY RULE**.

## D19 — Long-horizon boundary

F10はfuture-continuation-derived class Eを必要とするpost-root diagnostic。resource preflightに通らなければStage 1開始前にTECHNICALLY-INELIGIBLEとし、Stage 1 outcome後にhorizonを縮小して救済しない。

Status: **FROZEN TECHNICAL ELIGIBILITY RULE**.

## D20 — Independent verifier

production G2-08 scientific helperをimportせず、source generation、selection、search tables、reply measurements、class assignment、promotion、formal inputを別実装で再構築する。

Status: **FROZEN REQUIREMENT**.

## D21 — Serialization lesson

JSON roundtrip後のpersisted representationをcanonical hash対象とし、undefinedを禁止、明示null、canonical ordering、binary64-sensitive identityを固定する。

Status: **FROZEN TECHNICAL REQUIREMENT**.

## D22 — Artifact preservation

full production/independent dataはtechnical preflight後にfreezeしたshard ceilingで分割し、ESSENTIAL_CORE、HASH_MANIFEST、runner-local FINAL_EXACT_COMPARISONも保存する。事前にmandatoryとしたartifact requirementをoutcome後に緩和しない。

Status: **FROZEN DESIGN REQUIREMENT; exact ceiling pending technical preflight**.

## D23 — Consume-once

execution-start gate成功後はseed blockを永久にCONSUMEDとする。後続technical/resource/artifact failureを理由にUNCONSUMEDへ戻さない。same-block rerun/repair/replacement/extensionは初期contractでは許可しない。

Status: **FROZEN**.

## D24 — Stage 2 automatic authorization禁止

Stage 1がpassしてもStage 2を自動実行しない。canonical Stage 1 result、Stage 2 target freeze、fresh-block確認、source freeze、verifier readiness、resource/artifact preflight、explicit authorizationを別途要求する。

Status: **FROZEN**.

## D25 — Technical vs scientific disposition

Technical failureをscientific negativeへ読み替えず、scientific nonvalidationをtechnical-invalidへも読み替えない。

Status: **FROZEN**.

## D26 — Current authorization state

```text
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 scientific generation = NOT AUTHORIZED
scientificInferenceAuthorized = false
```

Status: **CURRENT / FROZEN UNTIL EXPLICIT AUTHORIZATION RECORD**.
