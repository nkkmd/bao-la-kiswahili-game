# STSCV-STUDY1 — 現在の状態

更新日: 2026-08-28

## 状態

**STUDY COMPLETE / FORMAL DECISION `INCONCLUSIVE` / 3 CANDIDATES `NON-ESTIMABLE` / CANONICALIZATION `NON-ESTIMABLE` / NO TRANSFORM VALIDATED**

## 研究識別子

```text
Program = G2-03
Study ID = STSCV-STUDY1
Research Generation = Research Generation 2
Formal title = State Transformation Semantics / Canonicalization Validation Study 1
Baseline main = a8493d2a50e11f15d16ef8348f2442b262ca275d
Research branch = research/g2-03-state-transformation-semantics-canonicalization-validation
```

日本語題目:

**Baoにおける状態変換意味論とcanonicalizationの厳密検証 — rule-semantic validity, legal-move equivariance, successor binding, graph isomorphism, and prospective canonicalization authorization**

## 最終formal closure

```text
Study = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

これはtechnical / reproducibility上のnon-estimability closureであり、candidate transformを科学的に棄却した結果ではありません。

## Stage progression

```text
Stage 0 = STSCV-S0-TECHNICAL-2026-08-28-v1 — completed / technical
Stage 1 = STSCV-S1-DEVELOPMENT-2026-08-28-v1 — completed / development only
Stage 2 = STSCV-S2-FORMAL-2026-08-28-v1 — executed / fail-closed INCONCLUSIVE
```

Stage 1では72 fresh development rootsを使用しました。内訳はNamua 24 + Mtaji 24 + Mtaji-houseless 24です。

これらのidentityは、trajectory-seed、opening-prefix、RAW-stateの各levelでStage 2から事前に分離しました。

Stage 2ではseed `26032001..26032768`、各stratum 32 roots、depth 3、mismatch tolerance 0、frozen seed block外へのreplacementなし、outcome後のseed extensionなしを事前固定しました。

## Stage 2 prefreezeとauthorization

強化済みStage 2 prefreeze:

```text
workflow run = 33145713610
head = bb6df48ab46bd1379d9aedbadb97db995e961271
conclusion = success
scientific outcome existed = false
```

明示的authorization commit:

```text
c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

Stage 2 outcome生成前に、authorizationをfrozen spec、candidate contract、Stage 1 firewall、decision rule、RAW identity、source hash、production runner、independent verifierへbindingしました。

## Stage 2 formal workflow

```text
workflow = STSCV Stage 2 Formal
run = 33145860098
job = 98766622115
head = c7619ded9f682b499a02d023b40ac54ba4dc95ca
conclusion = failure
```

成功したstep:

```text
engine regression = PASS
frozen source reconstruction = PASS
fresh held-out production measurement = PASS
```

Productionは固定targetをexactに選択しました。

```text
Namua = 32
Mtaji = 32
Mtaji-houseless = 32
```

Production-only diagnosticではT01 / T02 / T03のcandidate mismatch countはすべて0でした。ただし、これはcandidate decisionではありません。

その後、mandatory independent verificationがformal-result assembly中に次のerrorで停止しました。

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

このため、workflow-produced canonical independent-verification artifact、independently verified formal-result artifact、SHA256SUMS、workflow artifact ZIPは生成・確定されませんでした。

別途、既に固定済みのglobal-failure ruleを適用したrepository-facing fail-closed closureを`results/STAGE_2_FORMAL_RESULT.json`へ記録しています。これは欠落したworkflow-produced independently verified resultの代替ではありません。

## 固定済みglobal ruleの適用

Stage 2 decision ruleでは、candidate mismatchを科学的に解釈する前にすべてのglobal gateをPASSすることを要求します。

```text
S2-G1 = PASS
S2-G2 = PASS
S2-G3 = PASS
S2-G4 = PASS
S2-G5 = NOT-ESTABLISHED
S2-G6 = PASS
all global gates PASS = false
```

したがって、事前固定したglobal-failure ruleにより次となります。

```text
study = INCONCLUSIVE
candidate = NON-ESTIMABLE
canonicalization = NON-ESTIMABLE
scientific mismatch interpretation = not authorized
```

## authoritative representation

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
```

scientific population identity、canonicalization、symmetry-reduced state countingに使用できるtransformは1件も承認されていません。

Production diagnosticではT01 / T02 / T03のいずれもstandard initial RAW stateを保存しないことも確認されました。また、independent standard-start reachability-closure proofは実装されていません。

## 変更しないupstream state

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE
SRDR primaryFormalCriterion = null
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE
SIP v1 = TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION
SIP corrected v2 = NOT-AUTHORIZED-NOT-EXECUTED
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

G2-03はこれらの判断を変更しません。

## no-rescue closure

Verifier defectはfresh held-out Stage 2 outcome生成後に判明しました。

verifier sourceを修復して同じStage 2 evidenceを再実行し、formal decisionを救済することはしません。

これらのhypothesisをformalに再検証する場合は、新しいprospective Studyまたは明示的に新しいversioned protocol、新しいauthorization、新しいformal evidenceが必要です。

## canonical closure documents

- `STUDY_1_FINAL_REPORT.md`
- `results/STAGE_2_FORMAL_RESULT.json`
- `results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json`
- `checkpoints/2026-08-28-stage2-fail-closed-closure.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`

## repository state

final documentationとCI auditの後、PR #69を通じて`main`へ統合済みです。

```text
Final research head = c6f2fa750ce2e30a5ce359b9f3c594145c8e5a38
Merge commit = 2b5f297e09330348fdb2c42472aed50340eb0180
Integrated branch = main
```

Post-merge integration provenanceは次に記録しています。

- `checkpoints/2026-08-28-main-integration.md`
- `results/MAIN_INTEGRATION_PROVENANCE.json`

Repository integrationはformal scientific closure、validated transform set、canonicalization boundary、no-rescue ruleを変更しません。
