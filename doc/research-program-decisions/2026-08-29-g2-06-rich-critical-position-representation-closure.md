# G2-06 Rich Critical-Position Representation Study 1 — Program Closure Decision

Date: 2026-08-29  
Status: ACTIVE PROGRAM CLOSURE RECORD  
Program: Research Generation 2  
Agenda label: `G2-06`  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## Decision

`G2-06` was instantiated as `RCPR-STUDY1` under a fresh prospective Research Generation 2 contract and is now closed.

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 1 seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

The final Study-level closure is a technical-invalid Stage 1 closure. This is a valid Research Generation 2 closure outcome under the program rule that technical/inconclusive/non-estimable results are not rescued after outcome observation.

## What happened

The authorized Stage 1 production job completed successfully and all prospectively frozen production readiness gates were true. Production selected 600 roots, obtained 599 primary-estimable rows and 134 high-divergence rows, selected `RICH_ALL`, and produced overall OOF AUROC `0.7093403948001926`.

However, the mandatory independent verifier failed exact representation equality on four of 600 rows. Corpus replay, root reselection, continuation remeasurement, `D_range`, high-divergence labels, model-development recomputation and readiness recomputation otherwise matched.

The read-only postmortem localized the failure to `MOVE_SET_ENTROPY.indexEntropy`: production used `Map` insertion-order accumulation, while the independent implementation used object enumeration whose integer-like keys are ordered numerically. The resulting IEEE-754 addition-order differences were approximately `2.22e-16` to `4.44e-16`, causing exact feature-vector hashes to differ.

The frozen verifier required exact equality. Therefore the technical explanation does not permit post-hoc rounding/tolerance rescue.

## Immutable consequences

- scientific seed block `28610001..28613072` remains permanently consumed;
- the same block is not rerun, repaired, replaced or extended;
- production-only Stage 1 output is retained as provenance but is not promoted to an accepted scientific result;
- `scientificInferenceAuthorized = false`;
- `confirmatoryReuseAllowed = false`;
- `RCPR-S2-FORMAL-2026-08-28-v1` remains `NOT-AUTHORIZED-NOT-EXECUTED`;
- Research Generation 1 and G2-01..G2-05 formal decisions remain unchanged;
- historical Critical Positions evidence is not reintroduced as G2-06 evidence.

## Program sequencing decision

The Research Generation 2 program decision of 2026-08-26 explicitly treats `G2-01..G2-12` as agenda labels and avoids reopening closed studies as generic “Study 2” retries. Therefore the immediate program continuation is **not** a rerun or `RCPR-STUDY2` rescue.

The next planned independent agenda item is:

```text
G2-07 — Practical Comeback / Reply-Pressure Representation Study 1
Priority = P1
status = planned / new prospective independent study
```

A future new independent study could revisit deterministic rich critical-position representation after hardening the entropy/numeric-hash contract, but such a study would require a distinct prospective title/identity, fresh technical validation, fresh scientific evidence and fresh authorization. It is not the immediate continuation of `RCPR-STUDY1` and is not authorized by this record.

## Canonical G2-06 records

- `doc/rich-critical-position-representation/STUDY_1_OVERVIEW.md`
- `doc/rich-critical-position-representation/CURRENT_STATUS.md`
- `doc/rich-critical-position-representation/DECISION_REGISTER.md`
- `doc/rich-critical-position-representation/REPRODUCIBILITY_INDEX.md`
- `doc/rich-critical-position-representation/results/STAGE_1_DEVELOPMENT_RESULT.json`
- `doc/rich-critical-position-representation/results/STAGE_1_TECHNICAL_POSTMORTEM.json`
- `doc/rich-critical-position-representation/checkpoints/2026-08-29-stage1-technical-invalid-closure.md`

This program closure record does not itself authorize G2-07 scientific outcome generation. G2-07 must begin from a fresh repository-state audit and prospective contract.
