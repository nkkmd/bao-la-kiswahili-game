# G2-03 第1研究 最終報告 — 状態変換意味論とcanonicalizationの検証

更新日: 2026-08-28

## 1. 研究識別子

```text
Program label = G2-03
Study ID = STSCV-STUDY1
Research Generation = Research Generation 2
Formal title = State Transformation Semantics / Canonicalization Validation Study 1
Baseline main = a8493d2a50e11f15d16ef8348f2442b262ca275d
Research branch = research/g2-03-state-transformation-semantics-canonicalization-validation
```

日本語題目:

**Baoにおける状態変換意味論とcanonicalizationの厳密検証 — rule-semantic validity, legal-move equivariance, successor binding, graph isomorphism, and prospective canonicalization authorization**

## 2. 最終判断

```text
Study-level formal decision = INCONCLUSIVE
STSCV-T01-SEAT-SWAP-LOCAL = NON-ESTIMABLE
STSCV-T02-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start reachable-population deduplication = NON-ESTIMABLE
validated transform set = []
```

本Studyは、結果を見る前に固定したStage 2 global-failure ruleに従って終了しました。

これは3つのcandidate transformを科学的に棄却した結果ではありません。

## 3. 研究上の問い

本Studyでは、representation contractを研究開始時から明示したうえで、candidate state transformationを**exact rule-semantic bounded graph isomorphism**として検証できるかを調べました。

さらに、transformがvalidであった場合に、semantic graph equivalenceとfixed-start reachable-population identityを混同することなくcanonicalizationへ利用できるかを、別endpointとして検討しました。

Formal gateでは、次の完全一致・完全保存を要求しました。

- authoritative RAW state semantics
- exact legal-move-set bijection
- Namua variantを含むexact move identity
- successor commutation
- terminal / winner / pending semantics
- inverse / bijection property
- bounded graph binding
- control
- firewall integrity
- frozen source identity
- mandatory independent verification

## 4. authoritative identity

本Studyでは、scientific identityとして次のRAW identityを維持しました。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn`と`reason`は除外しました。

formal authorization前に、symmetry transformやcanonicalizationをscientific populationのdeduplicationへ使用していません。

## 5. upstream研究との境界

本Studyは、次を含む既存結果を変更・救済していません。

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

特に、G2-03はrepository-facing oracle rowをretrospectiveに修復しておらず、過去のzero-mismatch diagnosticをvalid candidate decisionへ読み替えてもいません。

## 6. Stage 0 — technical reconstruction

Stage 0はtechnical onlyです。

現在のengine representationとtransformation semanticsを再構築し、production pathとindependent pathを別実装しました。IDENTITY positive controlを検証し、意図的に壊したleft-right controlを検出できることを確認しました。

また、scientific development evidenceを見る前に、要求されたtransform familyを有限なcandidate contractへ整理しました。

Stage 0ではscientific candidate decisionを生成していません。

## 7. Stage 1 — development evidence

Stage 1はfresh historically reachable RAW stateを用いたdevelopment-only Stageです。

選択rootは次です。

```text
Namua roots = 24
Mtaji roots = 24
Mtaji-houseless roots = 24
Total = 72
```

これらのStage 1 identityは、その後Stage 2 firewallでtrajectory-seed、opening-prefix、RAW-stateの各levelから除外しました。Stage 1 evidenceをStage 2 formal confirmation evidenceとして再利用していません。

Stage 1 candidate contractでは、次の3つのnon-identity candidateを維持しました。

```text
STSCV-T01-SEAT-SWAP-LOCAL
STSCV-T02-LR-MTAJI-HOUSELESS
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
```

Stage 1のcandidate outcomeはいずれもformal validationではありません。

## 8. Stage 2 — formal条件の事前固定

Stage 2のscientific outcomeが存在する前に、次を固定しました。

```text
Stage = STSCV-S2-FORMAL-2026-08-28-v1
fresh seed block = 26032001..26032768
seed count = 768
target roots per stratum = 32
strata = Namua / Mtaji / Mtaji-houseless
local graph depth = 3
replacement outside frozen seed block = false
seed extension after outcome = false
mismatch tolerance = 0
```

Stage 2 prefreeze workflow run `33145713610`は、prospective firewall hardening後にPASSしました。このhardeningではstored selection hashを信用するだけでなく、Stage 1 selection bindingを独立再計算しました。

hardening時点ではStage 2 scientific outcomeは存在していませんでした。

明示的なStage 2 authorizationは次のcommitで固定しました。

```text
c7619ded9f682b499a02d023b40ac54ba4dc95ca
```

authorizationは、exact frozen spec、candidate contract、firewall、decision rule、RAW identity、production runner、independent verifier、source hashへbindingしました。

## 9. 固定したStage 2 decision rule

Formal decision ruleでは、次の6つのglobal gateをすべてPASSすることを要求しました。

```text
S2-G1 population / firewall / uniqueness
S2-G2 runtime relay-limit integrity
S2-G3 IDENTITY exact zero mismatch
S2-G4 negative-control interpretable mismatch
S2-G5 exact production / independent agreement
S2-G6 frozen contract/source/hash agreement
```

いずれかのglobal gateがFAIL、または成立確認できなかった場合は、事前固定ruleにより次とします。

```text
study = INCONCLUSIVE
candidate = NON-ESTIMABLE
canonicalization = NON-ESTIMABLE
scientific mismatch interpretation = not authorized
```

すべてのglobal gateをPASSした場合に限り、candidate mismatch 0なら`VALIDATED-BOUNDED-ISOMORPHISM`、1件以上なら`NOT-VALIDATED`を判断できる設計でした。

## 10. Stage 2実行

Authorized formal workflowは次です。

```text
workflow = STSCV Stage 2 Formal
run = 33145860098
job = 98766622115
head = c7619ded9f682b499a02d023b40ac54ba4dc95ca
conclusion = failure
```

次のstepまでは成功しました。

```text
engine regression = PASS
frozen production/independent source reconstruction = PASS
fresh held-out production measurement = PASS
```

Production measurementは固定quotaどおりに選択しました。

```text
Namua = 32
Mtaji = 32
Mtaji-houseless = 32
Total = 96
```

Production側のhashは次です。

```text
selectionSha256 = 4d81f8adebfe7b32bfba86adaaeb3f04a8ca6b451e09953612804734d303bb1c
measurementSha256 = 530ae49610dc7cc3af2713c0cf35c5d4e24d005f376d53e9da869b184b06b4fb
decisionInputSha256 = 58c8a2f6422135073bb4cbd5bac985bf1e72e5040b1c285ff5eca3a129523264
```

Production-only candidate mismatch diagnosticは次でした。

```text
T01 = 0
T02 = 0
T03 = 0
```

ただし、mandatory independent-verification gateがcanonical artifactとして完了していないため、これらのzero-mismatch値は**formal validationではありません**。

## 11. independent verifierのfailure

Independent verifierはproduction measurement後に実行されましたが、formal-result assembly中に次のerrorで停止しました。

```text
ReferenceError: standardStartReachablePopulationDedupDecision is not defined
```

fresh held-out scientific outcomeがすでに生成された後に、frozen verifier source内で発生したfailureです。

そのためformal workflowでは次を生成・確定できませんでした。

```text
STAGE_2_INDEPENDENT_VERIFICATION.json
STAGE_2_FORMAL_RESULT.json
SHA256SUMS.txt
workflow artifact ZIP
```

後続のcanonical-hash stepとartifact-upload stepもskipされました。

これはtechnical / reproducibility failureとして分類し、candidate semantic mismatchとは扱いません。verifier sourceを修復して同じStage 2 evidenceを再実行する救済も行っていません。

## 12. fail-closed ruleの適用

Mandatory global gate S2-G5がcomplete canonical verification resultとして成立しなかったため、

```text
all global gates PASS = false
scientific mismatch interpretation authorized = false
```

となります。

したがって、固定済みglobal-failure ruleによりStudy closureは次です。

```text
Study = INCONCLUSIVE
T01 = NON-ESTIMABLE
T02 = NON-ESTIMABLE
T03 = NON-ESTIMABLE
semantic-domain canonicalization = NON-ESTIMABLE
standard-start population dedup = NON-ESTIMABLE
```

failed global verification gateの下ではscientific mismatch decision自体が承認されないため、どのcandidateも`NOT-VALIDATED`にはしません。

## 13. canonicalization boundary

Production-only diagnosticで評価したbounded source graphは次です。

```text
states = 6317
edges = 6341
runtime guard hits = 0
max generated orbit size = 4
```

Production側ではsemantic-domain canonicalization diagnosticがmismatch 0でした。しかしmandatory independent verificationがcanonicalに完了していないため、formal authorizationにはなりません。

さらにfixed-start boundaryは別問題です。Production diagnosticでは、3つのnon-identity candidateはいずれもstandard initial RAW stateを保存しませんでした。

```text
T01 initial RAW preservation = false
T02 initial RAW preservation = false
T03 initial RAW preservation = false
```

Independent standard-start reachability-closure proofも実装されていません。

したがって、本Studyはscientific-population canonicalizationもsymmetry-reduced state countingも承認しません。

## 14. 本Studyが確立したこと・していないこと

本Studyでは、strict Stage 1 identity firewallの下で、prospective representation-first transformation-validation pipelineがfresh held-out production measurementまで到達できることを確認しました。

一方、mandatory independent formal closureはtechnicalに失敗したため、formal candidate decisionはnon-estimableのままです。

本結果は、3つのtransformがfalseであることを意味しません。同時に、production-only zero-mismatch diagnosticがあってもformalにvalidであるとは確立していません。

次は承認しません。

- scientific population identityへのcanonicalization
- symmetry-reduced state counting
- SSGTC-STUDY1へのsymmetry reductionのretrofit
- SIP-STUDY1 / ORISC-STUDY1のrepairまたはreinterpretation
- G2-01 / G2-02の変更
- public AI engineering change

## 15. no-rescue closure

fresh Stage 2 production outcomeが存在した後にverifier variable-name defectが判明しました。

固定済みno-rescue ruleにより、Study 1ではverifierを修正して同じformal evidenceを再実行し、candidate decisionを得ることはしません。

これらのtransformation hypothesisを将来再検証する場合は、新しいprospective Study IDまたは明示的に新しいversioned protocol、新しいauthorization、新しいformal evidenceが必要です。

終了済みG2-03の結果は`INCONCLUSIVE`、3 candidateすべて`NON-ESTIMABLE`のままです。

## 16. canonical records

- `results/STAGE_2_FORMAL_RESULT.json` — repository-facing fail-closed formal closure
- `results/STAGE_2_FORMAL_WORKFLOW_PROVENANCE.json` — failed workflow provenance
- `preregistration/STAGE_2_DECISION_RULE.json` — frozen decision rule
- `preregistration/STAGE_2_AUTHORIZATION.json` — explicit pre-outcome authorization
- `results/STAGE_2_PREFREEZE_MANIFEST.json` — source / firewall freeze
- `REPRODUCIBILITY_INDEX.md` — reproducibility / provenance index
- `CURRENT_STATUS.md` — terminal Study status
- `DECISION_REGISTER.md` — immutable Study decisions

## 17. 最終結論

**STSCV-STUDY1はformal decision `INCONCLUSIVE`で完了しています。**

3つのheld-out transformation candidateは**`NON-ESTIMABLE`**であり、rejectもvalidateもされていません。

Canonicalizationとsymmetry-reduced scientific population identityは引き続き**not authorized**です。production-only zero-mismatch diagnosticはbounded non-decisional evidenceとして保持し、failed mandatory independent-verification gateの救済には使用しません。
