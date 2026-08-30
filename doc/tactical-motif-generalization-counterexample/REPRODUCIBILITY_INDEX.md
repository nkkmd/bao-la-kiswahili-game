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
- `doc/tactical-motifs/STAGE_2_EXECUTION_RUNBOOK.md`

## Relevant existing code subject to Stage 0 audit

- `tools/experiments/tactical-motif-stage2.js`
- `tools/experiments/tactical-motif-stage2-validate.js`
- `tools/experiments/tactical-motif-stage2-independent-evaluator.js`
- `tools/experiments/tactical-motif-independent-stage2.js`
- `tools/experiments/tactical-motif-library.js`
- `tools/experiments/tactical-motif-evaluator.js`

この一覧はG2-09でそのまま再利用することの承認ではない。Stage 0で依存関係、shared-helper risk、state/move/evaluator semanticsを監査し、必要ならG2-09専用production/independent implementationを分離する。

## G2 closure boundaries

- `doc/rich-critical-position-representation/`
- `doc/practical-comeback-reply-pressure-representation/`
- `doc/machine-decision-failure-taxonomy/`

## G2-09 prospective artifacts

- `preregistration/STUDY_CONTRACT.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- future Stage 1 spec: not yet authorized / not yet created as a scientific freeze
- future Stage 2 spec: not yet authorized / not yet created as a scientific freeze

## Verification principle

Stage 0以降、production pathとindependent pathがG2-09固有classification helperを共有しないことを必須監査項目とする。離散量はexact equality、浮動小数はStage 1前に固定したtoleranceまたはquantized equalityで照合する。
