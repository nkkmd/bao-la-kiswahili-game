# REPRODUCIBILITY INDEX

## Source-of-truth baseline

G2-09開始時点のrepository contentはcommit `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`で固定する。

## Primary upstream documents

- `doc/tactical-motifs/STUDY_1_OVERVIEW.md`
- `doc/tactical-motifs/STUDY_1_FINAL_REPORT.md`
- `doc/tactical-motifs/CURRENT_STATUS.md`
- `doc/tactical-motifs/DECISION_REGISTER.md`
- `doc/tactical-motifs/REPRODUCIBILITY_INDEX.md`
- `doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json`
- `doc/tactical-motifs/preregistration/STAGE_2_FORMAL_SPEC.json`
- `doc/tactical-motifs/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json`

## First-generation Stage 2 source provenance

- generation source commit: `3082cd2132cdd572e43f5f78e8d662271a9ed492`
- measurement source commit: `e6f5e9528d523e7710a953020b1719abf60a26e8`
- evaluation source commit: `d41b061067ab2e5dbe65294d3860586d9d3c1454`

Authorization-bound source SHA-256 mappingはResearch Generation 1 `STAGE_2_FORMAL_AUTHORIZATION.json`を正本とする。

## G2-09 prospective freezes

- `preregistration/STUDY_CONTRACT.json`
- `preregistration/UPSTREAM_C03_FROZEN_REFERENCE.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `preregistration/STAGE_0_SOURCE_PREFLIGHT_SPEC.json`
- `preregistration/STAGE_1_2_BOUNDARY_CONTRACT.json`

## Stage 0 evidence

### Core technical

- workflow run: `33285277593`
- source commit: `123b24049f6d12dbe529c5aecc7fc2ee78852deb`
- result: `results/STAGE_0_CORE_TECHNICAL_RESULT.json`
- disposition: `CORE-SEMANTICS-AND-PROVENANCE-PASS`

### Contract validation

- workflow run: `33285599766`
- source commit: `59019e4fcefd02d231296cc87d9adcc0b9816f90`
- `passed=true`

### Source preflight

- invalid attempt: run `33285427882`, `TECHNICAL-EXECUTION-INVALID-NO-PREFLIGHT-RESULT`
- accepted run: `33285761079`
- source commit: `93396ec45619cf10a08726b5705b9a155bcb1c3b`
- artifact id: `9724412966`
- artifact ZIP SHA-256: `dd0e3cd14f127d89240e7f34a612dab73bf5ae805731dfa7eb925c3281dd71ae`
- disposition: `SOURCE-PREFLIGHT-PASS`

### Closure

- `results/STAGE_0_TECHNICAL_CLOSURE_RESULT.json`
- `checkpoints/2026-08-30-stage0-technical-closure.md`
- formal disposition: `STAGE0-TECHNICAL-PASS`

## Verification principle for Stage 1+

production pathとindependent pathがG2-09固有classification helperを共有しないことを必須とする。engine / AI implementationはinstrumentとして共通利用可能だが、C03 eligibility、candidate representative、structural consequence、boundary descriptors、decision aggregationのG2-09-specific reconstruction codeは共有しない。

離散量はexact equalityを要求する。search scoreは同一engine・同一frozen instrumentで整数値が返る限りexact equalityを要求する。将来floating quantityを導入する場合はscientific generation前にtoleranceをfreezeする。

## Scientific seed state at Stage 0 closure

- Stage 1 `29110001..29114096`: `UNCONSUMED`
- Stage 2 `29210001..29218192`: `UNCONSUMED`
