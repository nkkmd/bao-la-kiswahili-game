# RRCLGR-STUDY1 — 最終報告

更新日: 2026-09-03

## 1. Study identity（研究識別情報）

**Study ID:** `RRCLGR-STUDY1`

**英語題目:** Resource-Robust Continuous Local-Geometry Representation Verification Study 1 — Prospective independent validation of an exact multiaxial bounded RAW local-game-tree geometry representation under deterministic pre-root reconstructibility eligibility in Bao

**日本語題目:** Baoにおけるresource-robust連続局所ゲーム木幾何表現のprospective独立検証 — deterministic pre-root reconstructibility eligibilityによりbounded RAW depth-5 exact multiaxial representationをfail-closedで確立するG3-10 prerequisite

program内の位置づけはResearch Generation 3 / pre-G3-10 independent prerequisiteである。

reviewした`main` baselineは`0bcd1695b6dbd044acf2eed91740d282c63dbb07`である。

## 2. 科学的目的

G3-09 `CLGR-STUDY1`はStage 2でtechnical-invalidとなり、continuous local-geometry representationのformal eligibilityを確立できなかった。G3-10はvalidated local-geometry coordinatesを必要とするため、そのままの開始はpost-G3-09 reviewで認められなかった。

RRCLGR-STUDY1はG3-09をrepairまたはrerunせず、fresh populationとfresh seed namespaceを用い、deterministic bounded-workload eligibilityをcoordinate生成前に分離する新しい独立prospective prerequisiteとして設計された。

## 3. 固定したrepresentation contract

`RRCLGR-R1-EXACT-SQUASHED-L1`

Representationはformal-eligibleなLGTGMIV F1–F5 RAW depth-5 primitivesから固定した6 exact axesを用いた。全axisはintegerまたはreduced rationalで保持し、各非負値`q`をdata-independentに`q/(1+q)`へ変換した。

距離はequal-weight exact L1、neighborhoodはk=3 tie-inclusiveとした。observed-data normalization、phase-specific scaling、learned weight、PCA、clustering、feature dropping、outcome-dependent redesignは許可しなかった。

## 4. resource-robust設計

候補rootのscientific identity selectionとresource eligibilityを分離した。

1. fresh seed blockからgeometryを見ずにcandidate identity manifestを固定する。
2. coordinate生成前にproduction / independent bounded depth-5 preflightを全candidateへ適用する。
3. deterministic countersとrelay-limitのみでeligibilityを決める。
4. sufficient support gateを満たした場合だけ、既に固定されたeligible orderからmeasurement populationを確定する。
5. coordinate生成開始後のroot replacementを認めない。

wall-clockやRSSはcandidate選別には使わず、execution safety ceilingとしてのみ扱う設計とした。

## 5. Stage 0の結果

`RRCLGR-S0-TECHNICAL-2026-09-03-v1`

最終状態は**`STAGE0-PASS`**である。

Stage 0ではsynthetic exact arithmetic、six-axis derivation、exact transform、exact L1、k=3 tie-inclusive neighborhood、root-order invariance、forced relay-limit fail-closed、deterministic preflight ceiling、production/independent implementation separationおよびreal Bao technical roots上のdepth-5 exact agreementを確認した。

Stage 0ではfresh scientific seedsおよびprotected depth-10へアクセスしていない。

## 6. Stage 1のauthorization

Stage 0 pass後、別reviewにより`RRCLGR-STAGE1-AUTHORIZED`を固定した。

Stage 1:

`RRCLGR-S1-DEVELOPMENT-2026-09-03-v1`

fresh seed namespace:

`32010001..32010256`

Exactly-one execution、durable pre-computation lease、source binding、artifact-before-mirror、same-evidence rerun prohibitionをauthorization artifactで固定した。

Stage 2、G3-10、protected depth-10はauthorization対象外のまま維持した。

## 7. Stage 1の実行

trigger commit:

`00cbdb11c3310ea7a529c320ee03273c80dc8c7f`

GitHub Actions run:

`33759611989`

workflow control-plane自体はsuccessで終了した。authorization verification、source binding、durable lease upload、single scientific runner execution、canonical artifact uploadはすべて完了した。

しかしscientific runnerはfresh Stage 1 seed access後、candidate manifest完成前にfail-closedした。

canonical result:

```text
stageDisposition = STAGE1-TECHNICAL-INVALID
freshScientificSeedAccess = true
candidateManifestComplete = false
scientificSummaryAuthorized = false
stage2Eligible = false
sameEvidenceRerunAuthorized = false
protectedDepth10Access = false
```

canonical technical error:

```text
The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Array
```

## 8. technical diagnosis（技術的原因）

Frozen Stage 1 candidate-selection implementationは、candidate identity rowsのarrayに対する`candidateCoreSha256`を、inherited LGTGMIV `digest`を直接呼び出して計算しようとした。

LGTGMIV側でexportされる`digest`はcanonical object digest helperではなく、入力stringをそのまま`crypto.update`へ渡すlow-level SHA-256 functionである。そのためArrayを入力した時点でNode.jsの型エラーとなった。

正しいtechnical correctionは、arrayをcanonical serializationしてからdigestするか、object-aware digest helperを使用することである。しかしこのdefectはfresh Stage 1 seed access後に判明した。

したがって、implementationを修正して同じStage 1 evidenceをrerunすることはno-rescue contractに違反する。修正rerunは実施していない。

## 9. scientific resultの境界

Stage 1はcandidate manifest完成前に停止したため、次のscientific evidenceは成立していない。

- complete candidate population
- complete preflight eligibility populationの確立
- formal resource-support estimate
- 48-root coordinate population
- exact pairwise distance matrixの確立
- neighborhood structure
- nondegeneracy gate
- representation eligibility decision

したがって本Studyのformal scientific conclusionはpositive / negative / nullではない。

**formal representation eligibilityは`NOT ESTABLISHED`である。**

`STAGE1-TECHNICAL-INVALID`はrepresentationが不適格であることを意味しない。

## 10. formal closure（正式な終了状態）

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

Stage 1 seed namespaceはこのStudy versionで消費済みである。Stage 2 seed namespaceは未消費だが、閉じたStudyに属しており、後続Studyのseed sourceではない。

## 11. artifact integrity（成果物の完全性）

Stage 1 Actions artifact:

- id: `9894879572`
- name: `rrclgr-stage1-result-33759611989`
- ZIP SHA-256: `7b8a44a9e4873731d813e68b51755be39495980588564da8d4a504afad3c9b78`

canonical JSON:

- bytes: `523`
- SHA-256: `c9d3d3d3f987a88a90a27f6c0c118e15e584e778ad3234eafb5ab36130dcebd0`
- repository Git blob: `5a1c7949578dae70e1299b849ec4957030c0a85f`

artifactはdownloadしたexact byteからmirrorし、scientific recomputationは行っていない。

## 12. 下流への帰結

historical G3-10が必要としたprerequisiteは、RRCLGRでは満たされなかった。RRCLGR-STUDY1の結果からG3-10をauthorizeすることはできない。

追加の試行は、次の条件を持つ新しいprospective independent prerequisite Study / versionとしてのみ許される。

- fresh scientific seed namespaceを使用する
- RRCLGR Stage 1 scientific evidenceを再利用しない
- RRCLGR seedを再利用しない
- RRCLGR fresh accessに基づいてfavorable rootをtargetにしない
- source bindingとexecution contractを新たに固定する
- structured array / objectを用いるcandidate-core canonical serializationを、fresh evidence前のtechnical coverageで明示的に実行する
- production / verifier implementationを実質的に独立させる
- protected depth-10へアクセスしない
- fail-closed no-rescue behaviorを維持する

RRCLGR implementation defectは、その新しいStudyのtechnical design informationとしてのみ使用できる。
