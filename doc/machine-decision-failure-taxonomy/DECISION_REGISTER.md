# MDFT-STUDY1 — Decision Register

更新日: 2026-08-30

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

Status: **FROZEN; Stage 0 exact search semantics validated and Stage 1 implementation hash still to be source-frozen**.

## D09 — Multi-label taxonomy

Taxonomyはhierarchical multi-labelとし、mutually exclusive primary classを強制しない。co-occurrenceは結果として保存する。

Status: **FROZEN**.

## D10 — Candidate leaf search space

Stage 1で許可するcandidate leafは初期search space `MDFT-F01..MDFT-F10`のみ。Stage 1 outcome後のleaf追加は禁止する。Stage 0 technical eligibility ruleによるoutcome-blind exclusionはD27-D29に従う。

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

Stage 0 technical sharding successfully used a 131072-byte compressed-part ceiling. Stage 1のexact scientific shard ceilingとworkflow timeoutはStage 1 source freeze前に別途固定する。

Status: **FROZEN DESIGN REQUIREMENT; Stage 0 transfer path validated**.

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

## D27 — Stage 0 canonical disposition

Canonical Stage 0 technical result:

```text
Stage = MDFT-S0-TECHNICAL-2026-08-29-v1
Disposition = STAGE0-TECHNICAL-PASS
Core run = 33256737040
Determinism replay run = 33256767045
Core SHA-256 = f5052e9c18b118a194c4a43c8964e789a2a81083ad72ebf259b18c699ed5d6f1
F10 run = 33256932295
```

Stage 0 uses no Stage 1/2 scientific seed and authorizes no scientific inference.

Status: **FROZEN CANONICAL TECHNICAL RESULT**.

## D28 — F05 / F09 / F10 technical eligibility

Before Stage 1 scientific evidence inspection:

```text
MDFT-F05 = TECHNICALLY-ELIGIBLE
MDFT-F09 = TECHNICALLY-INELIGIBLE
MDFT-F10 = TECHNICALLY-ELIGIBLE
```

F09 reason:

```text
FROZEN_HISTORICAL_CLASSIFIER_NOT_EXACTLY_RECONSTRUCTIBLE_FROM_CURRENT_PRESERVED_REPOSITORY_SOURCES
```

F09 replacement/refit is not authorized and the historical Position Typology result remains unchanged.

Status: **FROZEN PRE-SCIENTIFIC ELIGIBILITY BINDING**.

## D29 — Stage 1 eligible leaf set

Stage 1 may assign/promote only:

```text
MDFT-F01
MDFT-F02
MDFT-F03
MDFT-F04
MDFT-F05
MDFT-F06
MDFT-F07
MDFT-F08
MDFT-F10
```

`MDFT-F09` is excluded. No replacement leaf is permitted.

Status: **FROZEN BEFORE STAGE 1 CONSUMPTION**.

## D30 — Stage 0 resource/artifact evidence is planning-only

Observed Stage 0 core/F10 runtime, RSS, compression, artifact transfer and projection values may be used to set prospective Stage 1 engineering ceilings. They are not scientific target-distribution evidence and may not be used to tune taxonomy promotion toward a desired result.

Status: **FROZEN INTERPRETATION BOUNDARY**.

## D31 — Stage 1 source/spec/preflight freeze

Before scientific consumption, Stage 1 spec SHA-256 `85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203`, source blobs, runner/workflow, resource ceilings and artifact contract were frozen. Canonical technical preflight run `33258188633` and runner-readiness run `33277031634` both passed without reporting target distribution.

Status: **FROZEN PRE-CONSUMPTION CONTRACT**.

## D32 — Stage 1 authorization and consumption

Explicit authorization triggered only run `33277102013` at execution HEAD `dfb9bf316dc767ae5920aba5a3308aa5f05d3acf`. Its execution-start gate passed at `2026-08-29T21:50:53.337Z`.

```text
Stage 1 seeds 28910001..28914096 = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
```

This supersedes the earlier current-state entries in D13/D26 without altering their historical meaning at reservation time.

Status: **FROZEN CONSUME-ONCE BOUNDARY**.

## D33 — Stage 1 technical integrity

Run `33277102013` completed successfully. Production and independent implementations exactly matched source generation, root selection, selected-root identity, all analysis rows and development core. Mandatory full artifacts were preserved.

```text
production core = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
independent core = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
production full shard = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
independent full shard = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

Status: **TECHNICAL-INTEGRITY-PASS**.

## D34 — Stage 1 global readiness failure

Two prospectively frozen global readiness gates failed:

```text
distinct opening prefixes = 2836 < 3000
maximum single source-policy share = LOW_CAPTURE 170/512 = 0.33203125 > 0.32
```

No threshold relaxation, root deletion, subgrouping, seed extension or replacement is authorized.

Status: **STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE**.

## D35 — Leaf-level promotion calculations are not taxonomy promotion

The frozen formula returned `promoted=true` for F01/F02/F03/F05/F06/F10 and `false` for F04/F07/F08. F09 was prospectively technically ineligible.

Because D34 failed globally, none of the six `true` calculations becomes a frozen taxonomy leaf or Stage 2 formal target in this Study 1. They remain development observations only.

Status: **FROZEN INTERPRETATION BOUNDARY / NO RESCUE**.

## D36 — Study closure and Stage 2

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
Study = NON-ESTIMABLE
```

A future taxonomy attempt must be a new prospective study/version with fresh population and seed contracts.

Status: **FROZEN STUDY CLOSURE**.
