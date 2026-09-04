# G3-11 / FDEGHV-STUDY1 — Fresh Depth-10 Exact Geometry Holdout Validation Study 1

更新日: 2026-09-04

## 状態

```text
Study ID = FDEGHV-STUDY1
Program position = Research Generation 3 / G3-11
Program authorization = G3-11-AUTHORIZED
Lifecycle = STARTED / PRE-HOLDOUT-FREEZE
Stage 0 = FDEGHV-S0-TECHNICAL-2026-09-04-v1 / NOT YET EXECUTED
Stage 1 = FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1 / NOT AUTHORIZED / NOT EXECUTED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## 正式研究題目

**Fresh Depth-10 Exact Geometry Holdout Validation Study 1 — Independent deeper exact validation of third-generation local game-tree geometry using the sealed standard-initial-RAW-root depth-10 domain in Bao**

日本語正式題目:

**Bao standard root depth 10のfresh RAW exact enumerationによる局所ゲーム木幾何holdout検証 — sealed deeper exact domainによる第三世代geometry primitiveと事前固定continuation targetの独立検証**

## 研究上の役割

G3-11はResearch Generation 3開始時から保護してきたstandard initial RAW rootのcomplete exact depth-10 layer/domainを、初めてformal scientific evidenceとして開くための独立Studyである。

G3-04、G3-07、G3-10等の既存formal decisionを再判定するStudyではない。単一standard-root exact domainとconstruct-compatibleなRAW tree/graph/transposition primitive、およびdepth 0..9 historical exact referenceからoutcome前に固定した少数のcontinuation targetだけを扱う。

## Frozen scientific target

- E0: complete exact RAW domain through depth 10
- H1: `newRawStateCount[10] == uniqueRawStateCount[10]`
- H2: `treeNodeOccurrences[10] > uniqueRawStateCount[10]`
- H3: cumulative tree/RAW ratio through depth 10 > through depth 9, exact rational comparison
- H4: depth-10 duplicate arrivals > 0 and multi-predecessor RAW states > 0

## 核心境界

```text
RAW-only = true
validated transform set = []
symmetry reduction = false
canonicalization collapse = false
complete reachable layers = 0..10
complete parent expansion layers = 0..9
depth 11 access = prohibited
G2-12 estimator input = prohibited
exactly one protected scientific execution = required
full independent re-enumeration = required
partial formal rescue = prohibited
```

## 文書

- [Study protocol](STUDY_1_PROTOCOL.md)
- [Current status](CURRENT_STATUS.md)
- [Authorization review](../research-program-decisions/2026-09-04-post-g3-10-g3-11-authorization-review.md)
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_FORMAL_SPEC.json`

Historical `doc/research-generation-3/PROGRAM_PLAN.md`は変更しない。
