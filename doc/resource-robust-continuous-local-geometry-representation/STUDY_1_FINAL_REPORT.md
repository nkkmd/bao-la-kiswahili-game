# RRCLGR-STUDY1 — Final Report

Updated: 2026-09-03

## 1. Study identity

**Study ID:** `RRCLGR-STUDY1`

**English title:** Resource-Robust Continuous Local-Geometry Representation Verification Study 1 — Prospective independent validation of an exact multiaxial bounded RAW local-game-tree geometry representation under deterministic pre-root reconstructibility eligibility in Bao

**日本語題目:** Baoにおけるresource-robust連続局所ゲーム木幾何表現のprospective独立検証 — deterministic pre-root reconstructibility eligibilityによりbounded RAW depth-5 exact multiaxial representationをfail-closedで確立するG3-10 prerequisite

Program position: Research Generation 3 / pre-G3-10 independent prerequisite.

Reviewed `main` baseline: `0bcd1695b6dbd044acf2eed91740d282c63dbb07`.

## 2. Scientific purpose

G3-09 `CLGR-STUDY1`はStage 2でtechnical-invalidとなり、continuous local-geometry representationのformal eligibilityを確立できなかった。G3-10はvalidated local-geometry coordinatesを必要とするため、そのままの開始はpost-G3-09 reviewで認められなかった。

RRCLGR-STUDY1はG3-09をrepairまたはrerunせず、fresh populationとfresh seed namespaceを用い、deterministic bounded-workload eligibilityをcoordinate生成前に分離する新しい独立prospective prerequisiteとして設計された。

## 3. Frozen representation contract

`RRCLGR-R1-EXACT-SQUASHED-L1`

Representationはformal-eligibleなLGTGMIV F1–F5 RAW depth-5 primitivesから固定した6 exact axesを用いた。全axisはintegerまたはreduced rationalで保持し、各非負値`q`をdata-independentに`q/(1+q)`へ変換した。

距離はequal-weight exact L1、neighborhoodはk=3 tie-inclusiveとした。observed-data normalization、phase-specific scaling、learned weight、PCA、clustering、feature dropping、outcome-dependent redesignは許可しなかった。

## 4. Resource-robust design

候補rootのscientific identity selectionとresource eligibilityを分離した。

1. fresh seed blockからgeometryを見ずにcandidate identity manifestを固定する。
2. coordinate生成前にproduction / independent bounded depth-5 preflightを全candidateへ適用する。
3. deterministic countersとrelay-limitのみでeligibilityを決める。
4. sufficient support gateを満たした場合だけ、既に固定されたeligible orderからmeasurement populationを確定する。
5. coordinate生成開始後のroot replacementを認めない。

wall-clockやRSSはcandidate選別には使わず、execution safety ceilingとしてのみ扱う設計とした。

## 5. Stage 0

`RRCLGR-S0-TECHNICAL-2026-09-03-v1`

Disposition: **`STAGE0-PASS`**

Stage 0ではsynthetic exact arithmetic、six-axis derivation、exact transform、exact L1、k=3 tie-inclusive neighborhood、root-order invariance、forced relay-limit fail-closed、deterministic preflight ceiling、production/independent implementation separationおよびreal Bao technical roots上のdepth-5 exact agreementを確認した。

Stage 0ではfresh scientific seedsおよびprotected depth-10へアクセスしていない。

## 6. Stage 1 authorization

Stage 0 pass後、別reviewにより`RRCLGR-STAGE1-AUTHORIZED`を固定した。

Stage 1:

`RRCLGR-S1-DEVELOPMENT-2026-09-03-v1`

Fresh seed namespace:

`32010001..32010256`

Exactly-one execution、durable pre-computation lease、source binding、artifact-before-mirror、same-evidence rerun prohibitionをauthorization artifactで固定した。

Stage 2、G3-10、protected depth-10はauthorization対象外のまま維持した。

## 7. Stage 1 execution

Trigger commit:

`00cbdb11c3310ea7a529c320ee03273c80dc8c7f`

GitHub Actions run:

`33759611989`

workflow control-plane自体はsuccessで終了した。authorization verification、source binding、durable lease upload、single scientific runner execution、canonical artifact uploadはすべて完了した。

しかしscientific runnerはfresh Stage 1 seed access後、candidate manifest完成前にfail-closedした。

Canonical result:

```text
stageDisposition = STAGE1-TECHNICAL-INVALID
freshScientificSeedAccess = true
candidateManifestComplete = false
scientificSummaryAuthorized = false
stage2Eligible = false
sameEvidenceRerunAuthorized = false
protectedDepth10Access = false
```

Canonical technical error:

```text
The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Array
```

## 8. Technical diagnosis

Frozen Stage 1 candidate-selection implementationは、candidate identity rowsのarrayに対する`candidateCoreSha256`を、inherited LGTGMIV `digest`を直接呼び出して計算しようとした。

LGTGMIV側でexportされる`digest`はcanonical object digest helperではなく、入力stringをそのまま`crypto.update`へ渡すlow-level SHA-256 functionである。そのためArrayを入力した時点でNode.jsの型エラーとなった。

正しいtechnical correctionは、arrayをcanonical serializationしてからdigestするか、object-aware digest helperを使用することである。しかしこのdefectはfresh Stage 1 seed access後に判明した。

したがって、implementationを修正して同じStage 1 evidenceをrerunすることはno-rescue contractに違反する。修正rerunは実施していない。

## 9. Scientific result boundary

Stage 1はcandidate manifest完成前に停止したため、次のscientific evidenceは成立していない。

- complete candidate population;
- complete preflight eligibility population;
- formal resource-support estimate;
- 48-root coordinate population;
- exact pairwise distance matrix;
- neighborhood structure;
- nondegeneracy gates;
- representation eligibility decision.

したがって本Studyのformal scientific conclusionはpositive / negative / nullではない。

**Formal representation eligibility = NOT ESTABLISHED.**

`STAGE1-TECHNICAL-INVALID`はrepresentationが不適格であることを意味しない。

## 10. Formal closure

```text
RRCLGR-STUDY1 = CLOSED / TECHNICAL-INVALID
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED / NOT-EXECUTED
formal continuous-representation eligibility = NOT ESTABLISHED
G3-10 = NOT AUTHORIZED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

Stage 1 seed namespace is consumed for this Study version. Stage 2 seed namespace remains unconsumed but belongs to the closed Study and is not a successor seed source.

## 11. Artifact integrity

Stage 1 Actions artifact:

- id: `9894879572`
- name: `rrclgr-stage1-result-33759611989`
- ZIP SHA-256: `7b8a44a9e4873731d813e68b51755be39495980588564da8d4a504afad3c9b78`

Canonical JSON:

- bytes: `523`
- SHA-256: `c9d3d3d3f987a88a90a27f6c0c118e15e584e778ad3234eafb5ab36130dcebd0`
- repository Git blob: `5a1c7949578dae70e1299b849ec4957030c0a85f`

The artifact was mirrored from exact downloaded bytes without scientific recomputation.

## 12. Downstream consequence

The prerequisite needed by historical G3-10 remains unsatisfied. G3-10 cannot be authorized from RRCLGR-STUDY1.

A further attempt is permissible only as a new prospective independent prerequisite Study/version with:

- fresh scientific seed namespace;
- no RRCLGR Stage 1 scientific evidence reuse;
- no RRCLGR seed reuse;
- no favorable root targeting based on RRCLGR fresh access;
- newly frozen source bindings and execution contract;
- pre-fresh technical coverage explicitly exercising candidate-core canonical serialization with structured arrays/objects;
- materially independent production / verifier implementations;
- no protected depth-10 access;
- fail-closed no-rescue behavior.

The RRCLGR implementation defect may be used only as technical design information for that new Study.
