# STSCV-STUDY1 — 再現性索引

更新日: 2026-08-28  
状態: **STUDY COMPLETE / FORMAL `INCONCLUSIVE` / FAIL-CLOSED**

## Study anchor （基準点）

```text
Program = G2-03
Study ID = STSCV-STUDY1
Research Generation = Research Generation 2
Baseline main = a8493d2a50e11f15d16ef8348f2442b262ca275d
Branch = research/g2-03-state-transformation-semantics-canonicalization-validation
```

## authoritative identity （識別情報）

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
```

Study closure時点で、scientific population deduplication、canonicalization、symmetry-reduced countingに使用できるtransformは承認されていません。

## rule-engine binding （日本語の要点）

```text
public/engine.js Git blob at Study start = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/engine.js byte SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
```

Stage 0およびそれ以降のfreezeでは、technical / formal executionをacceptする前にsource identityを独立再計算しました。

## Stage identity （識別情報）

```text
Stage 0 = STSCV-S0-TECHNICAL-2026-08-28-v1
Stage 1 = STSCV-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = STSCV-S2-FORMAL-2026-08-28-v1
```

## control （対照条件）

```text
positive = STSCV-C00-IDENTITY
negative = STSCV-C01-LR-NO-DIRECTION-FLIP
```

## machine-readable preregistration （日本語の要点）

- `preregistration/STUDY_START_CONTRACT.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `preregistration/STAGE_1_CANDIDATE_CONTRACT.json`
- `preregistration/STAGE_1_SPEC.json`
- `preregistration/STAGE_1_AUTHORIZATION.json`
- `preregistration/STAGE_2_SPEC.json`
- `preregistration/STAGE_2_FIREWALL.json`
- `preregistration/STAGE_2_DECISION_RULE.json`
- `preregistration/STAGE_2_AUTHORIZATION.json`

## Stage 0 canonical record （記録）

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_0_WORKFLOW_PROVENANCE.json`

Stage 0はtechnical onlyであり、scientific candidate decisionを生成していません。

## Stage 1 development record （記録）

- `results/STAGE_1_PREFREEZE_MANIFEST.json`
- `results/STAGE_1_PREFREEZE_WORKFLOW_PROVENANCE.json`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`

Stage 1 canonical development summary:

```text
workflow run = 33144060069
artifact ID = 9675082539
artifact ZIP SHA-256 = 86d7a8635ab9e06632f67e9039371aa053fbc224e71ee70576bb983d0abd6ca5
selected roots = 72 = 24 Namua + 24 Mtaji + 24 Mtaji-houseless
selectionSha256 = f1cfeed4b712885ca1dd0ec84ea537b5ec8177fe64f16c677971558b2e2ae7c5
measurementSha256 = bae92c61d3a9736130da6d80a3ea6a6a7597d8277cfe362b13127749b7b74bf8
formal candidate decisions authorized = false
```

Stage 1で選択されたtrajectory seed、opening-prefix identity、RAW-state identityはすべてStage 2 firewallでconsumedとして扱いました。

## Stage 2 prefreeze （固定した条件）

Canonical prefreeze record:

- `results/STAGE_2_PREFREEZE_MANIFEST.json`
- `results/STAGE_2_PREFREEZE_WORKFLOW_PROVENANCE.json`

Final hardened prefreeze:

```text
workflow run = 33145713610
job = 98766151957
head = bb6df48ab46bd1379d9aedbadb97db995e961271
artifact ID = 9675658249
artifact ZIP SHA-256 = e2b6c07919875effade8f4d93b6f824d9e75522904243d079f504102ef746ae2
manifest file SHA-256 = ac01b17ec365b64390e37c53fca563d3e35f014be5533b512c504da25271489a
conclusion = success
scientificOutcomeGenerated = false
superseded older prefreeze run = 33145557654
```

hardened prefreezeではStage 2 outcome生成前に、firewall bindingのためStage 1 selected-root selection hashを独立再構築しました。

## Stage 2 frozen contract hash （固定した条件）

```text
specSha256 = 2afbef1faed32cf1a7fb71d8af924a01d721a6d8719057c68224732576a6f8f0
candidateContractSha256 = e2869430325e80afcbb076bb450a6b6227701200dd83c1cb120a99d9dc446afc
firewallSha256 = e82626b947706ae31d78675d2fab22e74524ec0c0830da61894e58425af0c1d1
decisionRuleSha256 = 97125b04dfa10c0e7c359a8b1e3a48b615d6d3422a16cd801e327486be035310
stage1ResultSha256 = 5f887b6d429a60a3a9cdc92b59fb626dbe626faa197c69436a0a865b7fb5e5c3
rawStateIdentitySha256 = b7bd7c07300e56273344392c9adcbaa649d2a72c4fad372494e219a41c0103f1
transformationDefinitionSha256 = e2869430325e80afcbb076bb450a6b6227701200dd83c1cb120a99d9dc446afc
combined production runner SHA-256 = faf4e81c146e0c6564599fe7c4e357cd3b9afb322149243de8086da2d69c3a7c
combined independent verifier SHA-256 = 13b555e6ab34fda1d58213b583e8250d593a9f061c62ac403273265896cbaf93
```

full per-source SHA-256 setは`results/STAGE_2_PREFREEZE_MANIFEST.json`と`preregistration/STAGE_2_AUTHORIZATION.json`に保存しています。

## Stage 2 explicit authorization （承認状態）

```text
authorization commit = c7619ded9f682b499a02d023b40ac54ba4dc95ca
candidate outcomes inspected before authorization = false
Stage 2 scientific outcome existed before authorization = false
```

Formal population:

```text
seed block = 26032001..26032768
seed count = 768
target roots per stratum = 32
local graph depth = 3
replacement outside frozen seed block = false
seed extension after outcome = false
```

## Stage 2 formal workflow provenance （記録）

Repository-facing provenance:

- `results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json`

Workflow:

```text
name = STSCV Stage 2 Formal
run = 33145860098
job = 98766622115
head = c7619ded9f682b499a02d023b40ac54ba4dc95ca
status = completed
conclusion = failure
```

Step outcome:

```text
engine regression = success
frozen source reconstruction = success
fresh held-out production measurement = success
independent verification and frozen decision rule = failure
canonical hashes = skipped
artifact upload = skipped
```

Failure:

```text
error = ReferenceError
message = standardStartReachablePopulationDedupDecision is not defined
class = POST-MEASUREMENT-INDEPENDENT-VERIFIER-RESULT-ASSEMBLY-IMPLEMENTATION-ERROR
```

artifact uploadがskipされたため、Stage 2 formal workflow artifact IDやartifact ZIP SHA-256は存在しません。

production result fileはfailed runner workspace内にのみ存在しました。そのcompact summaryはimmutable workflow logへ出力され、repository-facing formal closureにはnon-decisional provenanceとして記録されています。

## Production-only held-out diagnostic （日本語の要点）

workflow logの記録:

```text
selected roots = 32 Namua + 32 Mtaji + 32 Mtaji-houseless
selectionSha256 = 4d81f8adebfe7b32bfba86adaaeb3f04a8ca6b451e09953612804734d303bb1c
measurementSha256 = 530ae49610dc7cc3af2713c0cf35c5d4e24d005f376d53e9da869b184b06b4fb
decisionInputSha256 = 58c8a2f6422135073bb4cbd5bac985bf1e72e5040b1c285ff5eca3a129523264
T01 mismatch = 0
T02 mismatch = 0
T03 mismatch = 0
bounded graph = 6317 states / 6341 edges
runtime guard hits = 0
max orbit size = 4
```

これらはproduction diagnosticのみです。mandatory independent-verification gateがcanonical resultとして成立しなかったため、formal candidate decisionには使用できません。

## canonical formal closure （最終状態）

- `results/STAGE_2_FORMAL_RESULT.json`
- `STUDY_1_FINAL_REPORT.md`
- `checkpoints/2026-08-28-stage2-fail-closed-closure.md`

Terminal result:

```text
Study = INCONCLUSIVE
T01 = NON-ESTIMABLE
T02 = NON-ESTIMABLE
T03 = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

## failed scientific workflowでもclosureを再現できる理由

final decisionはproduction diagnosticからfavorable candidate resultを再構築したものではありません。

mandatory complete independent verificationが成立せずcanonical formal artifactがmaterializeされなかったという、外部から観測可能なworkflow factへ、既に固定済みの`globalFailureRule`を適用したものです。

したがってclosureは次に依存します。

1. immutable pre-outcome Stage 2 decision rule
2. explicit authorization commit
3. recorded workflow run / job conclusionとfailure location
4. complete canonical independent-verification / formal artifactが存在しないこと
5. outcome後のsource repairやsame-evidence rerunを行っていないこと

## Study-level canonical document （日本語の要点）

- `STUDY_1_PROTOCOL.md` — prospective protocol / unchanged historical contract
- `STUDY_1_OVERVIEW.md` — current-facing overview
- `STUDY_1_FINAL_REPORT.md` — scientific / technical final integration
- `CURRENT_STATUS.md` — terminal status
- `DECISION_REGISTER.md` — immutable decisions
- `RESEARCH_LOG.md` — chronology
- `REPRODUCIBILITY_INDEX.md` — 本索引

## upstream closure anchor （基準点）

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primaryFormalCriterion = null
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

これらはimmutable contextであり、G2-03によって変更されません。
