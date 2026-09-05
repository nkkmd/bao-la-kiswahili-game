# STSCV-STUDY1 — 研究ログ

## 2026-08-28 — Study-start repository audit （リポジトリ状態）

observed remote `main`:

```text
a8493d2a50e11f15d16ef8348f2442b262ca275d
```

これはhandoffで示されたpost-G2-02 integration / provenance anchorとexactに一致しました。

open PR auditは0件でした。

Residual G2 branch:

```text
research/g2-01-position-evaluation-empirical-outcome-calibration-replication: ahead 0 / behind 78
research/g2-01-stage1-implementation-backup: ahead 0 / behind 119
research/g2-02-search-reliability-decision-robustness: ahead 0 / behind 7
```

結論: active / unmergedなcompeting Research Generation 2 workはありませんでした。

## 2026-08-28 — required scientific-state reconstruction （日本語の要点）

Research Generation 2 agenda / governance、G2-01 / G2-02 closure document、SIP-STUDY1、ORISC-STUDY1、REWR-STUDY1、SSGTC-STUDY1、root README、RULES_BASELINEを読み、整合を確認しました。

記録したimmutable boundary:

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primaryFormalCriterion null
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
validated transform set = []
```

## 2026-08-28 — Study identity / Stage freeze （識別情報）

Formal Study identityをprospectiveに固定:

```text
Agenda = G2-03
Study ID = STSCV-STUDY1
Formal title = State Transformation Semantics / Canonicalization Validation Study 1
```

Stage IDを固定:

```text
STSCV-S0-TECHNICAL-2026-08-28-v1
STSCV-S1-DEVELOPMENT-2026-08-28-v1
STSCV-S2-FORMAL-2026-08-28-v1
```

この時点ではscientific outcomeは存在していませんでした。

## 2026-08-28 — representation design decision （表現）

Authoritative state identityはRAW-onlyを維持:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

G2-03で重要なdesign distinctionをprospectiveに固定しました。exact rule-semantic isomorphismが成立しても、fixed-start reachable-population canonicalizationが自動的に承認されるわけではありません。domain / reachability closureを別途示す必要があります。

## 2026-08-28 — Stage 0 technical validation （技術検証）

Stage 0ではcurrent engine representation / transformation semanticsを再構築し、productionとindependentのtechnical pathを分離しました。

technical instrument contract:

- authoritative RAW serialization
- Namua `moveVariants`を含むexact move identity
- transform / inverse handling
- legal-move-set comparison
- successor binding
- terminal / winner / pending semantics
- IDENTITY positive control
- deliberately broken LR negative control

Stage 0はnon-scientificでありcandidate decisionを生成していません。

## 2026-08-28 — Stage 1 prospective development freeze / execution （固定した条件）

candidate contract、population / selection rule、source hash、development roleを固定した後にのみStage 1を承認しました。

Fresh development population:

```text
Namua roots = 24
Mtaji roots = 24
Mtaji-houseless roots = 24
Total = 72
```

Canonical Stage 1 development workflow:

```text
workflow run = 33144060069
artifact ID = 9675082539
artifact ZIP SHA-256 = 86d7a8635ab9e06632f67e9039371aa053fbc224e71ee70576bb983d0abd6ca5
selectionSha256 = f1cfeed4b712885ca1dd0ec84ea537b5ec8177fe64f16c677971558b2e2ae7c5
measurementSha256 = bae92c61d3a9736130da6d80a3ea6a6a7597d8277cfe362b13127749b7b74bf8
formalCandidateDecisionsAuthorized = false
```

held-out formal Stageで検証するnon-identity candidateとして3件を保持しました。

```text
STSCV-T01-SEAT-SWAP-LOCAL
STSCV-T02-LR-MTAJI-HOUSELESS
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
```

72件すべてのStage 1 selected trajectory identity、opening-prefix identity、RAW-state identityをStage 2 firewall用にprospectiveにconsumedとしました。Stage 1 outcomeはformal validation evidenceではありません。

## 2026-08-28 — Stage 2 prospective freeze （固定した条件）

Stage 2 scientific outcomeが存在する前にformal contractを固定しました。

```text
seed block = 26032001..26032768
seed count = 768
target roots per stratum = 32
strata = Namua / Mtaji / Mtaji-houseless
local graph depth = 3
mismatch tolerance = 0
replacement outside seed block = false
seed extension after outcome = false
```

Formal global gateをS2-G1..S2-G6として固定しました。mandatory production / independent agreementはS2-G5です。

global failure ruleもprospectiveに固定しました。

```text
if any global gate does not PASS:
  Study = INCONCLUSIVE
  candidate = NON-ESTIMABLE
  canonicalization = NON-ESTIMABLE
  scientific mismatch interpretation = not authorized
```

## 2026-08-28 — authorization前のStage 2 firewall hardening

initial prefreeze auditでprovenance weaknessを発見しました。Stage 1 compact resultのstored `selectionSha256`をselected-root identityから再計算せず信用していました。

Stage 2 scientific outcomeはまだ存在していなかったため、rescueではなくprospective hardeningとして対応しました。production、independent、prefreeze pathを強化し、Stage 1 selection bindingを独立再構築しました。

Final hardened prefreeze:

```text
workflow run = 33145713610
job = 98766151957
head = bb6df48ab46bd1379d9aedbadb97db995e961271
conclusion = success
artifact ID = 9675658249
artifact ZIP SHA-256 = e2b6c07919875effade8f4d93b6f824d9e75522904243d079f504102ef746ae2
scientificOutcomeGenerated = false
```

older run `33145557654`はhardened prefreezeによりsupersededされました。

## 2026-08-28 — explicit Stage 2 authorization （承認状態）

Stage 2 formal scientific generationを次のcommitで明示的に承認しました。

```text
c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

authorizationはexact frozen spec、candidate contract、firewall、decision rule、Stage 1 result identity、RAW identity、production runner、independent verifier、source hash setへbindingしました。

authorization前にcandidate outcomeは確認しておらず、Stage 2 scientific outcomeも存在していませんでした。

## 2026-08-28 — fresh held-out Stage 2 production measurement （Stageの記録）

Authorized workflow:

```text
name = STSCV Stage 2 Formal
run = 33145860098
job = 98766622115
head = c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

engine regressionとfrozen source reconstructionがPASSし、その後fresh held-out production measurementが成功しました。

Productionはfrozen quotaをexactに選択しました。

```text
Namua = 32
Mtaji = 32
Mtaji-houseless = 32
```

workflow logへ出力されたproduction-only compact diagnostic:

```text
selectionSha256 = 4d81f8adebfe7b32bfba86adaaeb3f04a8ca6b451e09953612804734d303bb1c
measurementSha256 = 530ae49610dc7cc3af2713c0cf35c5d4e24d005f376d53e9da869b184b06b4fb
decisionInputSha256 = 58c8a2f6422135073bb4cbd5bac985bf1e72e5040b1c285ff5eca3a129523264
T01 mismatch = 0
T02 mismatch = 0
T03 mismatch = 0
bounded canonicalization source graph = 6317 states / 6341 edges
runtime guard hits = 0
max generated orbit size = 4
```

mandatory independent verification前に、これらをcandidate decisionとして解釈していません。

## 2026-08-28 — mandatory independent verifier failure （日本語の要点）

independent verification stepはformal-result assembly中に次のerrorで停止しました。

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

workflow consequence:

```text
independent verification / frozen decision rule = failure
canonical hashes = skipped
artifact upload = skipped
workflow conclusion = failure
```

complete canonical `STAGE_2_INDEPENDENT_VERIFICATION.json`、workflow-produced `STAGE_2_FORMAL_RESULT.json`、SHA256SUMS、workflow artifact ZIPはmaterializeされませんでした。

これはfresh outcome生成後のtechnical / reproducibility failureであり、scientific candidate mismatchではありません。

## 2026-08-28 — fail-closed formal decision （日本語の要点）

mandatory global gate S2-G5をcomplete canonical independent-verification resultとして成立確認できなかったため、pre-outcome frozen global-failure ruleを変更せず適用しました。

Final closure:

```text
STSCV-STUDY1 = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

Production-only zero-mismatch diagnosticを`VALIDATED-BOUNDED-ISOMORPHISM`へ昇格していません。technical verifier failureを`NOT-VALIDATED`へ変換することもしていません。

## 2026-08-28 — canonicalization boundaryを維持

Production-only diagnosticではbounded source graphのsemantic-domain canonicalization mismatchは0でしたが、mandatory independent verificationがcanonicalに完了していません。

別途、production diagnosticでは次を確認しました。

```text
T01 standard initial RAW preservation = false
T02 standard initial RAW preservation = false
T03 standard initial RAW preservation = false
independent standard-start reachability-closure proof implemented = false
```

したがってG2-03はscientific-population canonicalizationもsymmetry-reduced state countingも承認しません。

## 2026-08-28 — no-rescue closure （解釈上の境界）

verifier variable-name defectはfresh held-out Stage 2 production outcome生成後に判明しました。同じevidenceを使うrerunのために修復していません。

将来formalに再検討する場合は、新しいprospective Studyまたは明示的に新しいversioned protocol、fresh authorization、fresh formal evidenceが必要です。

SIP-STUDY1、ORISC-STUDY1、SSGTC-STUDY1、G2-01、G2-02は変更しません。

frozen scientific runner / verifierを変更せず、Stage 2 evidenceを再実行せずにrepository-facing fail-closed closure recordを追加しました。
