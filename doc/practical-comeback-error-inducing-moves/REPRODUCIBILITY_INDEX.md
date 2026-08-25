# PCEM-STUDY1 — Reproducibility Index

Updated: 2026-08-25

## Study baseline

```text
studyId = PCEM-STUDY1
remoteMainHead = 587472b7e1a3f6e390cdfea6ed0d8e0971d5711d
branch = research/practical-comeback-error-inducing-moves
```

## Required upstream scientific records

- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/RESEARCH_INDEX.md`
- `doc/critical-positions-outcome-branching/STUDY_1_FINAL_REPORT.md`
- `doc/blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md`
- `doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`
- `doc/position-complexity/STUDY_1_OVERVIEW.md`
- `doc/tactical-motifs/STUDY_1_OVERVIEW.md`
- `doc/restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md`
- `doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`
- `doc/oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md`
- `doc/state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md`
- `doc/state-space-game-tree-complexity/CURRENT_STATUS.md`

## Study-owned protocol records

- `preregistration/STUDY_START_FIREWALL.md`
- `protocol/CONSTRUCT_MEASUREMENT_DEPENDENCIES.md`
- `preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md`
- `preregistration/STAGE_1_DESIGN_SKELETON.md`
- `preregistration/STAGE_2_FORMAL_SKELETON.md`

## Planned code/artifact separation

Production-side generators/measurers will live under `tools/experiments/` using the repository's existing research-tool convention.

The independent verifier must not import the production serializer, candidate classifier, formal runner, or aggregation implementation when an independent implementation is feasible.

At minimum the verifier must independently recompute:

```text
raw-state identity
seed conservation
legal root moves
root move application
first-reply legal set
continuation terminal/cutoff outcome
root/move/replicate binding
aggregate counts
artifact hashes
```

## Fresh evidence firewall

Stage 1 and Stage 2 must record and compare at least:

```text
historicalTrajectoryHash
openingPrefixHash where applicable
raw rule-state identity hash
seed block
root identity
move identity
continuation replicate seed
```

Formal candidate derivation rows and formal confirmation rows must be disjoint.

## Artifact status

No scientific measurement artifact exists yet. Any technical-only Stage 0 artifact must carry `scientificInferenceAuthorized = false` and must not be used as Stage 1/2 scientific evidence.
