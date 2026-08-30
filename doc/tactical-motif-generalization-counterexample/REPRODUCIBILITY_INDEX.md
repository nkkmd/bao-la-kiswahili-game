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
- `doc/tactical-motifs/STAGE_2_EXECUTION_RUNBOOK.md`

## First-generation Stage 2 source provenance

- generation source commit: `3082cd2132cdd572e43f5f78e8d662271a9ed492`
- measurement source commit: `e6f5e9528d523e7710a953020b1719abf60a26e8`
- evaluation source commit: `d41b061067ab2e5dbe65294d3860586d9d3c1454`

Authorization-bound source SHA-256 mappingは`doc/tactical-motifs/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json`を正本とする。

## Relevant existing code subject to Stage 0 audit

- `tools/experiments/run-tactical-motif-stage2-formal.js`
- `tools/experiments/verify-tactical-motif-stage2-formal.js`
- `tools/experiments/evaluate-tactical-motif-stage2-formal.js`
- `tools/experiments/validate-tactical-motif-stage2-formal-spec.js`
- `tools/experiments/lib/tactical-motif-stage2-formal.js`
- `tools/experiments/lib/tactical-motif-stage2-corpus.js`
- `tools/experiments/lib/tactical-motif-features.js`
- `tools/experiments/lib/tactical-motif-discovery.js`
- `tools/experiments/lib/position-typology-features.js`
- `tools/experiments/lib/position-complexity-search-diagnostic.js`
- `public/engine.js`
- `public/ai.js`

この一覧はG2-09でそのままscientific implementationとして再利用することの承認ではない。Stage 0で依存関係、shared-helper risk、state/move/evaluator semanticsを監査し、G2-09専用production/independent implementationを分離する。

## G2 closure boundaries

- `doc/rich-critical-position-representation/`
- `doc/practical-comeback-reply-pressure-representation/`
- `doc/machine-decision-failure-taxonomy/`

## G2-09 prospective artifacts

- `preregistration/STUDY_CONTRACT.json`
- `preregistration/UPSTREAM_C03_FROZEN_REFERENCE.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- future Stage 1 spec: not yet authorized / not yet created as a scientific freeze
- future Stage 2 spec: not yet authorized / not yet created as a scientific freeze

## Verification principle

Stage 0以降、production pathとindependent pathがG2-09固有classification helperを共有しないことを必須監査項目とする。離散量はexact equality、浮動小数はStage 1前に固定したtoleranceまたはquantized equalityで照合する。
