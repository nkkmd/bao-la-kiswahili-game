# 対称性・同型局面の検証 — `SIP-STUDY1`

状態: **COMPLETED — formal decision `NON-ESTIMABLE`**
Study ID: `SIP-STUDY1`

> **closure経緯:** 実行済みのStage 1 v1 candidate-decision runは、IDENTITY positive controlによってexact-oracle reconstruction defectが判明したためtechnical invalidationとなりました。fresh zero-mismatch観測は再現可能なdiagnosticとしてのみ保持します。corrected v2は設計しましたが、承認も実行もしていません。したがってcanonical `NON-ESTIMABLE`は、candidateのvalidationやrejectionではなく、**有効なformal candidate-decision runを完了できなかったことによるStudy-level closure decision**です。


## 研究の問い

Bao の candidate state/player/move transformation が、単なる visual symmetry ではなく、state validity、exact legal-move set、transition、terminal/winner semantics を保存する **rule-semantic graph isomorphism** かを、prospectively frozen bounded domains 上で deterministic に検証した。

本Studyは新規 prospective independent study であり、完了済み研究の formal decision、threshold、classifier、endpoint、population、interpretation boundary を変更しない。

## 最終結果

```text
scientific outcomes = 5
VALIDATED-BOUNDED-ISOMORPHISM = 0
NOT-VALIDATED = 0
NON-ESTIMABLE = 5
```

Technically invalidated v1 executionのfresh historically reachable depth-3 bounded-local graphsでは、3 scientific candidates / 5 preregistered scopesのすべてでexact mismatchが0だった。このzero-mismatch observationはdiagnostic evidenceとしてのみ保持する。しかし、preregistered mandatory anchorであるRestricted Endgame Study 1のimmutable 8-state exact-oracle artifactをrule-semantic transform検証へ接続した際、IDENTITY positive controlを含めてstate-row identity integrityを満たせず、production / independent verifier agreement gate `G12` がFAILした。

v1はcandidate-decision runとしてtechnical invalidationされ、corrected v2は未承認・未実行のまま終了した。このためformal validationにもcandidate rejectionにも進まず、5 outcomesすべてをStudy-level `NON-ESTIMABLE`としてcloseした。

## oracle anchorに関する診断上の境界

Post-outcome read-only diagnosticでは、8 stateRows中3 terminal rowsでstored `stateKey`とstored `ruleState`のcanonical re-hashが一致せず、そのstored ruleStateは63 seedsを表現していた。Production / independent re-hashは相互に一致し、7 recomputed transitionsはすべてstored key set内に入った。

これは本Studyでのanchor利用上のlimitationであり、Restricted Endgame Study 1の`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` decision、8-state count、solution、hashを変更しない。

## 後続研究へ引き継ぐ境界

- validated transformation set: 空
- canonicalization: **not authorized**
- symmetry-groupに関する主張: **not authorized**
- symmetry-reduced state counting: **not authorized**
- State Space / Game Tree Complexity Studyをraw state identityで進めること: **authorized**
- T01 / T02 / T03をreductionに使うこと: **not authorized**

## 最初に読む文書

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け成果概要
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的・技術的最終統合
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — closure状態とfixed boundaries
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — prospective / closure decisions
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — hashes / workflow / artifact provenance
- [`results/STAGE_1_FORMAL_RESULT.json`](results/STAGE_1_FORMAL_RESULT.json) — canonical compact formal result
- [`results/STAGE_1_PRODUCTION_RESULT.json`](results/STAGE_1_PRODUCTION_RESULT.json) — production output
- [`results/STAGE_1_INDEPENDENT_VERIFICATION.json`](results/STAGE_1_INDEPENDENT_VERIFICATION.json) — independent verification
- [`preregistration/CANDIDATE_TRANSFORMS.json`](preregistration/CANDIDATE_TRANSFORMS.json) — frozen candidate semantics
- [`preregistration/STAGE_1_FORMAL_SPEC.json`](preregistration/STAGE_1_FORMAL_SPEC.json) — frozen formal contract
