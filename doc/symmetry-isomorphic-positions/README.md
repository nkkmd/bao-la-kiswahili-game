# Symmetry / Isomorphic Positions Study 1

Status: **COMPLETED — formal decision `NON-ESTIMABLE`**  
Study ID: `SIP-STUDY1`

## Research question

Bao の candidate state/player/move transformation が、単なる visual symmetry ではなく、state validity、exact legal-move set、transition、terminal/winner semantics を保存する **rule-semantic graph isomorphism** かを、prospectively frozen bounded domains 上で deterministic に検証した。

本Studyは新規 prospective independent study であり、完了済み研究の formal decision、threshold、classifier、endpoint、population、interpretation boundary を変更しない。

## Final result

```text
scientific outcomes = 5
VALIDATED-BOUNDED-ISOMORPHISM = 0
NOT-VALIDATED = 0
NON-ESTIMABLE = 5
```

Fresh historically reachable depth-3 bounded-local graphsでは、3 scientific candidates / 5 formal outcomesのすべてでexact mismatchが0だった。しかし、preregistered mandatory anchorであるRestricted Endgame Study 1のimmutable 8-state exact-oracle artifactをrule-semantic transform検証へ接続した際、IDENTITY positive controlを含めてstate-row identity integrityを満たせず、production / independent verifier agreement gate `G12` がFAILした。

このためfresh zero-mismatch evidenceは保持するが、formal validationへ昇格しない。candidate rejectionにも読み替えず、5 outcomesすべてを`NON-ESTIMABLE`としてStudy 1をcloseした。

## Oracle-anchor diagnostic boundary

Post-outcome read-only diagnosticでは、8 stateRows中3 terminal rowsでstored `stateKey`とstored `ruleState`のcanonical re-hashが一致せず、そのstored ruleStateは63 seedsを表現していた。Production / independent re-hashは相互に一致し、7 recomputed transitionsはすべてstored key set内に入った。

これは本Studyでのanchor利用上のlimitationであり、Restricted Endgame Study 1の`EXACT-SOLVED-WITHIN-FROZEN-DOMAIN` decision、8-state count、solution、hashを変更しない。

## Downstream contract

- validated transformation set: empty
- canonicalization: **not authorized**
- symmetry-group claim: **not authorized**
- symmetry-reduced state counting: **not authorized**
- State Space / Game Tree Complexity Studyをraw state identityで進めること: **authorized**
- T01/T02/T03をreductionに使うこと: **not authorized**

## Entry points

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
