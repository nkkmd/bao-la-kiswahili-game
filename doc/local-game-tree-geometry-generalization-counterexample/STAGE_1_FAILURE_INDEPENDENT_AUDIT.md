# LGTGGC-STUDY1 — Stage 1 Failure Independent Audit

Date: 2026-09-04

## Audit disposition

**`INDEPENDENT-AUDIT-PASS / STAGE1-TECHNICAL-INVALID-CONFIRMED`**

本auditはfresh scientific seedを再生成・再読せず、immutable Actions provenance、exact artifact hashes、frozen runner control flow、production/independent source code contractだけを監査した。

このauditはSILGM scientific measurementを再実行せず、effect sign、effect magnitude、p-value、generalization/counterexample decisionを生成しない。

## Immutable execution provenance

```text
Stage = LGTGGC-S1-DEVELOPMENT-2026-09-04-v1
Actions run = 33848876682
job = 100946889620
trigger = 013f3fd2f859ef1758674b6a53ac5a05cd14efc8
lease artifact ID = 9927555827
lease artifact ZIP SHA-256 = 927759cb9f521a484479efec3a54df0db6f22f7262a936d2ee742d5a6a313231
result artifact ID = 9927866205
result artifact ZIP SHA-256 = b93e5401c3191979b35252eaa2003df0e8511db2bbfc1325396d298557b75cdb
```

Downloaded immutable result artifact contained exactly:

```text
sfcdf.json SHA-256 = 2939007b9e95bc545ea29b048c9f7f35d230621252739cd3735ea1f0e3a63218
silgm.json SHA-256 = b0c9947f6cb16ba9c7d615ec6c5c1d28fefdd9579bb821abd273b1ff9b61148d
```

GCLD result fileは存在しない。workflow stepはSILGM failure後にskipされた。

## SFCDF verification

Artifactとjob logは一致して次を記録する。

```text
stageDisposition = STAGE1-PASS
scientificSeedsRead = 384
selectedPairs = 40
selectedRoots = 80
definedRoots = 80
productionIndependentExact = true
selectionCoreSha256 = a49491bd973ba2ef8807b09e88b17ba929cd97869add1c8f49dc1521d017eff5
measurementCoreSha256 = 59667e24c250e74dc94746311ba23a448b0947fc40b3fe53e424cdf0054f3f3f
formalInferencePerformed = false
pValuesComputed = false
effectDirectionSummarized = false
```

したがってSFCDF moduleのdevelopment readiness PASSはprovenanceとして保持できる。ただしformal effect inferenceではない。

## SILGM failure-path verification

Frozen runner control flowは:

1. Stage 1 SILGM seed range全体についてproduction/independent source candidateを構築する。
2. candidate identitiesのproduction/independent equalityを確認する。
3. frozen 16 cellsでselectionする。
4. selected rootごとにSC1/SC2/SC3の`conditionResult`を呼ぶ。
5. `estimable:false`ならそのslotをnon-estimableとして保持する設計である。

しかしproduction helper `silgm-production.js` はraw searchがestimableになった後に:

```text
result && result.candidates && result.candidates.length >= 2
```

をhard assertionとして要求する。

Independent helper `silgm-independent.js` も同じsemantic requirementを独立実装し:

```text
r.candidates.length >= 2
```

をhard assertionとして要求する。

一方、frozen G3-12 population contractは:

```text
Namua LOW = rootLegalWidth < 4
Mtaji LOW = rootLegalWidth < 3
```

であり、1 legal moveのrootをpopulation contract上は排除していない。

したがって、population contractが許すroot universeとinherited SILGM endpoint helperのhard preconditionの間にpre-fresh Stage 0で捕捉されなかったcompatibility gapが存在する。

Observed runtime error:

```text
Error: complete root ranking required
at silgm-production.js / conditionResult
```

はこのhard precondition pathで発生した。specific failing root/seed/contrastをfresh replayして特定することは本auditのscope外かつ禁止とした。

## Why this is TECHNICAL-INVALID rather than NON-ESTIMABLE

Stage 1 runnerはsearch conditionが通常のcontractに従い`estimable:false`を返した場合、`STAGE1-NON-ESTIMABLE`へfail symmetricallyできる。

今回はそのreturn pathより前にhard exceptionが発生し、frozen runner自身がauthoritative result artifactへ:

`STAGE1-TECHNICAL-INVALID`

を書いた。fresh access後にexceptionをnon-estimabilityへ再分類するためhelperやrunnerを変更することはpost-hoc repairになるため行わない。

## Evidence firewall audit

Confirmed:

```text
formal inference = NOT PERFORMED
p-values = NOT COMPUTED
Stage 2 seed access = false
G3-11 protected depth-10 rerun = false
depth 11 access = false
G2-12 estimator scientific input = false
```

Stage 2 identity firewallは完全 materializeできない。SILGM exception artifactにはselected identity manifestがなく、これを再取得するにはfresh Stage 1 seedsのreplayが必要になるためである。

## Independent conclusion

**Stage 1 technical-invalid disposition is independently supported by immutable provenance and static contract inspection without scientific recomputation.**

The audit does not authorize repair, rerun, Stage 2 execution, or scientific interpretation of partial development measurements.
