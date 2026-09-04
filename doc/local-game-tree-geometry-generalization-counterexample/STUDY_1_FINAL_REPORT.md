# LGTGGC-STUDY1 — Final Report

Date: 2026-09-04

## 1. Final decision

**`LGTGGC-STUDY1 = CLOSED / TECHNICAL-INVALID`**

Research Generation 3 program position: **G3-12 — Local Game-Tree Geometry Generalization / Counterexample Study 1**.

G3-12のformal generalization / counterexample boundaryは確立されなかった。Stage 0はtechnical readinessを確立し、Stage 1のSFCDF transfer developmentはPASSしたが、同じexactly-once Stage 1 execution中にSILGM transferがhard technical failureでfail closedした。GCLD transferはその後実行されず、Stage 2は`NOT AUTHORIZED`のまま未実行である。

このclosureはupstream geometry claimsへのnegative scientific resultではない。

## 2. Study question

本Studyは、G3-04、G3-07、G3-10でformal confirmationを得た9個のbounded local-game-tree geometry claimsについて、新しいsource policyとreachable-root familyへ移したときのgeneralization boundary / counterexample boundaryをfresh held-out evidenceで検証することを目的とした。

Formal targets:

```text
G3-04: C1, C6
G3-07: SC1×E3×G1, SC2×E3×G1, SC3×E3×G1
G3-10: C1, C2, C3, C5
```

G3-10 C4、G3-02/03/05/06/08/09 technical-invalid families、G3-07 non-confirmed/non-estimable candidatesはpositive targetに含めなかった。

G3-11 depth-10 exact resultはhistorical anchor / boundary referenceだけに限定し、rerunしなかった。depth 11とG2-12 estimator scientific inputも使用しなかった。

## 3. Prospective contract

Source main HEAD:

`5597ae696d9eb76d8395e114cdb4f83af1138a3d`

Research branch:

`research/g3-12-local-game-tree-geometry-generalization-counterexample`

Formal Study ID:

`LGTGGC-STUDY1`

Stages:

```text
Stage 0 active PASS version = LGTGGC-S0-TECHNICAL-2026-09-04-v3
Stage 1 = LGTGGC-S1-DEVELOPMENT-2026-09-04-v1
Stage 2 = LGTGGC-S2-FORMAL-2026-09-04-v1
```

## 4. Pre-fresh source-policy amendment

Original P2 `CAPTURE-FIRST`はauthoritative Bao legal-move semanticsによりP1 `UNIFORM-LEGAL`とobservationally non-identifiableであることがscientific access前に判明した。

そのためpre-fresh technical amendmentでactive policiesを:

```text
P1 = LGTGGC-P1-UNIFORM-LEGAL
P2 = LGTGGC-P2-MAX-CAPTURE
```

へversioned correctionした。

P2は現在合法な各moveのimmediate authoritative capture-event seed countをexactに評価し、最大countのmove poolから同じMulberry32 ruleで選ぶ。geometry、search result、game outcome、prior scientific resultをpolicy selectionへ使用しない。

Stage 0 V3は64 technical seedsすべてでP1/P2 trajectory distinguishabilityを確認し、production/independent replay exactを確立した。このamendmentはfresh scientific evidence前であり、scientific target、threshold、root family、seed blockを変更しなかった。

## 5. Stage 0

Stage 0 chronology:

```text
V1 = PRE-EXECUTION-TECHNICAL-INVALID / original P1-P2 non-identifiability / no execution
V2 = PRECOMPUTATION-TECHNICAL-INVALID / static syntax failure / technical seed access 0
V3 = STAGE0-PASS
```

Canonical V3:

```text
Actions run = 33843233392
artifact ID = 9925602227
technical core SHA-256 = 79a34669df5e5d80c179dbb40e2a8e6b8b3e58e05747ef0c1b21d7e493e8a834
```

Stage 0 PASS後にseparate post-Stage0 authorization reviewを行い、Stage 1だけをexactly one executionとしてauthorizeした。Stage 2はauthorizeしなかった。

## 6. Stage 1 execution integrity

Exactly-one fresh Stage 1 execution:

```text
Actions run = 33848876682
job = 100946889620
trigger commit = 013f3fd2f859ef1758674b6a53ac5a05cd14efc8
lease artifact = 9927555827
lease ZIP SHA-256 = 927759cb9f521a484479efec3a54df0db6f22f7262a936d2ee742d5a6a313231
result artifact = 9927866205
result ZIP SHA-256 = b93e5401c3191979b35252eaa2003df0e8511db2bbfc1325396d298557b75cdb
```

Authorization/source-binding verificationとdurable pre-computation lease uploadはfresh access前にPASSした。

Stage 1 scientific execution countは1回を消費した。同じevidenceのrerunはauthorizeされない。

## 7. SFCDF development result

SFCDF transferはdevelopment gateをPASSした。

```text
seed range = 32311001..32311384
scientific seeds read = 384
selected pairs = 40
selected roots = 80
defined roots = 80
production/independent exact = true
stage disposition = STAGE1-PASS
selection core SHA-256 = a49491bd973ba2ef8807b09e88b17ba929cd97869add1c8f49dc1521d017eff5
measurement core SHA-256 = 59667e24c250e74dc94746311ba23a448b0947fc40b3fe53e424cdf0054f3f3f
```

Cell support:

```text
P1 × RF1 eligible 65 / selected 10
P1 × RF2 eligible 45 / selected 10
P2 × RF1 eligible 35 / selected 10
P2 × RF2 eligible 14 / selected 10
```

Stage 1 contractに従い、C1/C6のpaired effect direction、effect magnitude、p-value、generalization/counterexample decisionは生成していない。

したがってSFCDF development PASSからG3-04 C1/C6のgeneralizationを主張してはならない。

## 8. SILGM technical failure

SILGM transferはfresh development execution中にfail closedした。

```text
seed range = 32312001..32312768
seed block = CONSUMED
stage disposition = STAGE1-TECHNICAL-INVALID
formal inference = false
p-values = false
```

Fatal error:

```text
Error: complete root ranking required
origin = tools/experiments/lib/silgm-production.js / conditionResult
```

Frozen G3-12 SILGM population allows:

```text
Namua LOW = rootLegalWidth < 4
Mtaji LOW = rootLegalWidth < 3
```

so width 1 is population contract上排除されていない。一方、inherited production/independent SILGM search helpersはestimable search resultについてroot candidate count >=2をhard requirementにしていた。

Stage 1 runnerは通常の`estimable:false`であればdevelopment `NON-ESTIMABLE`へ落とせる構造だったが、hard assertion exceptionがその経路より先に発生した。

このpopulation/helper compatibility gapはStage 0 fixturesで検出されなかった。

Specific failing seed/root/contrastはfresh seed replayせず、特定しない。fresh access後のhelper correction、eligibility変更、root replacement、seed extension、same-evidence rerunは行わない。

## 9. GCLD development result

SILGM step failure後にworkflowが停止したためGCLD transferは実行されなかった。

```text
Stage 1 GCLD seeds = 32313001..32313384
access = false / UNREAD
result = NONE
```

したがってG3-10 C1/C2/C3/C5 transfer readinessもG3-12 Stage 1では確立されていない。

## 10. Stage 2 authorization review

Post-Stage1 review:

**`LGTGGC-STAGE2-NOT-AUTHORIZED`**

理由:

1. SILGM Stage 1が`TECHNICAL-INVALID`である。
2. GCLD Stage 1 readinessが未実行・未確立である。
3. SILGM exception artifactにはselected identity manifestがなく、fresh replayなしにrequired identity-only Stage 2 exclusion firewallを完全構築できない。
4. Stage 1 same-evidence rerunは明示的に禁止されている。
5. SFCDFだけをStage 2へ進めるmodule-dropはfresh evidence後のformal claim-set変更となり、post-hoc rescueになる。

したがってStage 2 seed blocksはすべて未読のまま維持された。

```text
SFCDF Stage 2 32321001..32321768 = UNREAD
SILGM Stage 2 32322001..32323536 = UNREAD
GCLD Stage 2 32324001..32324768 = UNREAD
```

## 11. Independent audit

`STAGE_1_FAILURE_INDEPENDENT_AUDIT.md` はscientific recomputationなしで:

- immutable Actions run provenance
- lease/result artifact digests
- downloaded artifact file SHA-256
- runner control flow
- production helper hard precondition
- independent helper hard precondition
- Stage 1 population compatibility gap
- protected-evidence firewall

を監査し:

**`INDEPENDENT-AUDIT-PASS / STAGE1-TECHNICAL-INVALID-CONFIRMED`**

とした。

SFCDF artifact内のproduction/independent exactnessは保持するが、SILGM scientific measurement自体を再実行していない。

## 12. Scientific interpretation

Correct Study-level interpretation:

**G3-12のprospectively frozen capstone protocolはformal held-out Stage 2へ到達できず、bounded local-game-tree geometry claimsのgeneralization boundary / counterexample boundaryを確立できなかった。**

これは次のいずれも意味しない。

- upstream G3-04 claimsがgeneralizeしない
- upstream G3-07 claimsがgeneralizeしない
- upstream G3-10 claimsがgeneralizeしない
- counterexampleが存在する、または存在しない
- P1/P2のscientific superiority
- RF1/RF2のscientific superiority
- universal Bao geometry lawの成立または否定

Partial Stage 1 development measurementsをformal effect evidenceとして用いない。

## 13. Protected evidence and no-rescue closure

At closure:

```text
G3-11 protected depth-10 rerun = false
G3-11 same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT ACCESSED / NOT AUTHORIZED
G2-12 estimator scientific input = NOT USED / NOT AUTHORIZED
symmetry/canonicalization = NOT USED
Stage 2 fresh access = 0
```

For `LGTGGC-STUDY1`, permanently prohibited:

- same-evidence Stage 1 rerun
- SILGM seed replay after helper correction
- seed extension
- root replacement
- threshold change/relearning
- endpoint substitution
- source-policy replacement
- root-family replacement
- module dropping to rescue formal completion
- resource ceiling increase
- verification relaxation
- favorable subgroup rescue
- G3-10 C4 revival
- G3-11 depth-10 rerun
- depth 11 access
- G2-12 estimator scientific input

A future attempt requires a new prospective independent Study/version and separate authorization. It must not be represented as completion or repair of `LGTGGC-STUDY1`.

## 14. Final status

```text
G3-12 = LGTGGC-STUDY1
Lifecycle = CLOSED
Final decision = TECHNICAL-INVALID
Stage 0 = PASS
Stage 1 = TECHNICAL-INVALID
Stage 2 = NOT AUTHORIZED / NOT EXECUTED
Formal generalization decisions = NONE
Formal counterexample decisions = NONE
Main integration = NOT AUTHORIZED / NOT PERFORMED
```

The research branch remains separate from `main` pending explicit user instruction.
