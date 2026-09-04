# 局所ゲーム木幾何の一般化範囲と反例領域 — `LGTGGC-STUDY1`

## 現在の状態

```text
Program position = Research Generation 3 / G3-12
Program authorization = G3-12-AUTHORIZED
Study ID = LGTGGC-STUDY1
Study lifecycle = CLOSED / TECHNICAL-INVALID
Stage 0 active = LGTGGC-S0-TECHNICAL-2026-09-04-v3 / STAGE0-PASS
Stage 1 = LGTGGC-S1-DEVELOPMENT-2026-09-04-v1 / EXECUTED EXACTLY ONCE / TECHNICAL-INVALID
Stage 2 = LGTGGC-S2-FORMAL-2026-09-04-v1 / NOT AUTHORIZED / NOT EXECUTED
Formal generalization decisions = NONE
Formal counterexample decisions = NONE
source main = 5597ae696d9eb76d8395e114cdb4f83af1138a3d
research branch = research/g3-12-local-game-tree-geometry-generalization-counterexample
main integration = COMPLETE / FAST-FORWARD / source tip 146a515671838606034efd9d4c3120e9b4c597f2 / previous main 5597ae696d9eb76d8395e114cdb4f83af1138a3d / force=false
```

## 研究目的

G3-04、G3-07、G3-10でformal confirmationを得たbounded local-game-tree geometry claimを、新しいsource policyとreachable-root familyへprospectively移し、同じ方向に再現するdomain、再現しないdomain、反対方向のcounterexampleが成立するdomainをfresh evidenceで確定することを目的とした。

G3-12はupstream negative / null / technical-invalid resultを救済するStudyではない。

## 上流研究から引き継いだ正式対象

- G3-04: C1 `MTAJI-GREATER`、C6 `NAMUA-GREATER`
- G3-07: SC1 / SC2 / SC3の`G1 ROOT-LEGAL-WIDTH × E3 RANKING-PREORDER-CHANGE = HIGHER-IN-HIGH`
- G3-10: C1 `ACTUAL-GREATER`、C2 `ACTUAL-GREATER`、C3 `ACTUAL-LESS`、C5 `ACTUAL-GREATER`

G3-10 C4、G3-02/03/05/06/08/09 technical-invalid family、G3-07 non-confirmed/non-estimable familyはpositive targetではない。

G3-11 `FDEGHV-STUDY1`はsingle standard-root depth-10 historical exact anchor / boundary referenceに限定し、generalization targetにしない。

## 実際に使用した転移条件

Pre-fresh technical amendment後のsource policies:

```text
P1 = LGTGGC-P1-UNIFORM-LEGAL
P2 = LGTGGC-P2-MAX-CAPTURE
```

Reachable-root families:

```text
RF1 = EARLY-ANCHOR
RF2 = LATE-ANCHOR
```

Historical base protocol/specに残る`P2-CAPTURE-FIRST`はpre-Stage0 provenanceであり、authoritative legal-move semanticsとのnon-identifiabilityがscientific access前に判明したためactive execution contractではない。

## 実行結果の要約

### Stage 0の結果

```text
V3 Actions run = 33843233392
stage disposition = STAGE0-PASS
technical core SHA-256 = 79a34669df5e5d80c179dbb40e2a8e6b8b3e58e05747ef0c1b21d7e493e8a834
```

### Stage 1の結果

1回限りの実行として承認したActions run:

`33848876682`

SFCDF:

```text
STAGE1-PASS
384 seeds read
40 pairs / 80 roots
80 defined roots
production/independent exact
formal inference = false
```

SILGM:

```text
STAGE1-TECHNICAL-INVALID
fatal error = complete root ranking required
formal inference = false
```

固定済みのLOW populationはlegal-width-1 rootを許容していましたが、SILGMから継承したproduction / independent helperは、順位づけ可能なroot candidateが最低2件あることを必須としていました。この互換性の欠落はStage 0 fixtureでは検出できませんでした。すでにfresh evidenceへアクセスしていたため、helperを修正せず、同じ証拠のreplayも行っていません。

GCLD:

```text
NOT EXECUTED / Stage 1 seed block UNREAD
```

### Stage 2の結果

**`LGTGGC-STAGE2-NOT-AUTHORIZED`**

Stage 2 seed blockは未読のままです。generalization / counterexampleに関するformal inferenceは行っていません。

## 最終結果の読み方

**`LGTGGC-STUDY1 = CLOSED / TECHNICAL-INVALID`**

結果を見る前に固定したcapstone executionはformal held-out Stage 2へ到達できませんでした。したがってG3-12は、generalization、non-generalization、counterexample domainのformal boundaryを確立していません。

SFCDFのStage 1 PASSはdevelopment readiness evidenceに限られ、formalなG3-04 transfer resultへ昇格しません。上流のG3-04・G3-07・G3-10の判断も変更しません。

## 保護された境界

```text
G3-11 depth-10 = CONSUMED EXACTLY ONCE / HISTORICAL READ-ONLY RESULT ONLY
G3-11 same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G2-12 estimator scientific input = NOT AUTHORIZED / NOT USED
validated transform set = []
Stage 2 fresh access = 0
```

## 正本となる文書

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`PROSPECTIVE_TECHNICAL_AMENDMENT_V2.md`](PROSPECTIVE_TECHNICAL_AMENDMENT_V2.md)
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`STAGE_1_FAILURE_INDEPENDENT_AUDIT.md`](STAGE_1_FAILURE_INDEPENDENT_AUDIT.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`results/stage-1/STAGE_1_EXECUTION_RECORD.json`](results/stage-1/STAGE_1_EXECUTION_RECORD.json)
- [`../research-program-decisions/2026-09-04-post-g3-11-g3-12-authorization-review.md`](../research-program-decisions/2026-09-04-post-g3-11-g3-12-authorization-review.md)
- [`../research-program-decisions/2026-09-04-post-g3-12-stage0-stage1-authorization-review.md`](../research-program-decisions/2026-09-04-post-g3-12-stage0-stage1-authorization-review.md)
- [`../research-program-decisions/2026-09-04-post-g3-12-stage1-stage2-authorization-review.md`](../research-program-decisions/2026-09-04-post-g3-12-stage1-stage2-authorization-review.md)

過去の計画を記録する`doc/research-generation-3/PROGRAM_PLAN.md`は、結果に合わせて遡及的に変更していません。
