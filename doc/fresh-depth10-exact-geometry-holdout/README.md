# G3-11 / FDEGHV-STUDY1 — Fresh Depth-10 Exact Geometry Holdout Validation Study 1

更新日: 2026-09-04

## 状態

```text
Study ID = FDEGHV-STUDY1
Program position = Research Generation 3 / G3-11
Program authorization = G3-11-AUTHORIZED
Lifecycle = CLOSED / FORMAL-COMPLETE
Stage 0 = FDEGHV-S0-TECHNICAL-2026-09-04-v1 / STAGE0-PASS
Stage 1 = FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1 / FORMAL-COMPLETE / 1 authorized / 1 actual
formal domain decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
H1..H4 = DEEPER-CONFIRMED / DEEPER-CONFIRMED / DEEPER-CONFIRMED / DEEPER-CONFIRMED
protected depth-10 = OPENED / CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G2-12 estimator scientific input = NOT USED / NOT AUTHORIZED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## 正式研究題目

**Fresh Depth-10 Exact Geometry Holdout Validation Study 1 — Independent deeper exact validation of third-generation local game-tree geometry using the sealed standard-initial-RAW-root depth-10 domain in Bao**

日本語正式題目:

**Bao standard root depth 10のfresh RAW exact enumerationによる局所ゲーム木幾何holdout検証 — sealed deeper exact domainによる第三世代geometry primitiveと事前固定continuation targetの独立検証**

## 結論

standard initial RAW rootからdepth 10までをRAW-onlyで完全列挙し、production materializationとmaterially separate independent full re-enumerationがexactに一致した。frozen resource gatesもすべてPASSしたため、Study-level formal decisionは`EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN`である。

4つのprospectively frozen continuation targetはすべて`DEEPER-CONFIRMED`となった。

- H1: depth-10 new RAW states = unique RAW states = **348,270**
- H2: depth-10 tree-node occurrences **494,456** > unique RAW states **348,270**
- H3: cumulative tree/RAW inflation exact cross-product **64,913,155,557 > 61,644,248,915**
- H4: depth-10 duplicate arrivals **11,725**、multiple-predecessor states **10,383**

Cumulative through depth 10は**451,127 distinct RAW states / 466,768 depth-labelled legal edges / 631,101 tree-node occurrences**である。

## Interpretation boundary

本Studyはstandard initial RAW rootのcomplete exact depth-10 domainだけを対象とする。Bao全状態空間・全ゲーム木、depth 11以深、symmetry-reduced count、causal mechanism、human difficulty、game-theoretic valueを確立しない。またG3-04、G3-07、G3-10等の既存formal decisionを再判定しない。

protected depth-10 evidenceは1回のauthorized executionでconsume済みであり、same-Study rerun、cap increase、target change、subset/root rescue、symmetry/canonicalization rescue、G2-12 estimator導入、depth-11 extensionはいずれも認めない。

## 文書

- [Study protocol](STUDY_1_PROTOCOL.md)
- [Final report](STUDY_1_FINAL_REPORT.md)
- [Current status](CURRENT_STATUS.md)
- [Decision register](DECISION_REGISTER.md)
- [Reproducibility index](REPRODUCIBILITY_INDEX.md)
- [Authorization review](../research-program-decisions/2026-09-04-post-g3-10-g3-11-authorization-review.md)
- [Formal closure decision](../research-program-decisions/2026-09-04-g3-11-formal-complete-closure.md)
- [Formal result](results/stage-1/STAGE_1_FORMAL_RESULT.json)
- [Artifact manifest](results/stage-1/ARTIFACT_MANIFEST.json)

Historical `doc/research-generation-3/PROGRAM_PLAN.md`は変更しない。科学的closureと`main` integrationは別gateであり、main統合は未承認・未実施である。
