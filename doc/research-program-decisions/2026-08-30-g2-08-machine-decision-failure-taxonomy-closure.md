# G2-08 Machine Decision-Failure Taxonomy Study 1 — Program Closure Decision

Date: 2026-08-30
Status: ACTIVE PROGRAM CLOSURE RECORD
Program: Research Generation 2
Agenda label: `G2-08`
Study: `MDFT-STUDY1` — Machine Decision-Failure Taxonomy Study 1

## Decision

`G2-08` was instantiated as `MDFT-STUDY1` under a fresh prospective Research Generation 2 contract and is now closed.

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 1 seed block = CONSUMED
same-block rerun/repair/replacement/extension = NOT AUTHORIZED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = NON-ESTIMABLE
```

This is a valid Research Generation 2 closure outcome. Technical integrity succeeded, but the prospectively frozen development-population readiness contract did not.

## What happened

Fresh Stage 1 used 4,096 games and produced 4,068 unique historical trajectories. Outcome-blind selection produced 512 roots, split exactly Namua/Mtaji 256/256. Production and structurally independent implementations exactly matched source generation, root selection, selected-root identity, analysis rows and development core, and the mandatory full artifacts were preserved successfully.

```text
reference-consensus roots = 473
reference-disagreement events = 110
production/independent core SHA-256 = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
full shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

Two frozen global readiness gates failed:

```text
distinct opening prefixes = 2836 < 3000
LOW_CAPTURE selected share = 170/512 = 0.33203125 > 0.32
```

The frozen leaf-level promotion calculation returned true for F01/F02/F03/F05/F06/F10, but those observations are not rescued into a taxonomy because the global readiness prerequisite failed. F04/F07/F08 did not meet the promotion formula, while F09 had already been excluded prospectively because the frozen historical morphology classifier could not be exactly reconstructed from current preserved repository sources.

## Immutable consequences

- Stage 1 seeds `28910001..28914096` remain permanently consumed;
- the same block is not rerun, repaired, replaced or extended;
- opening-prefix and source-policy-share thresholds are not relaxed after outcome observation;
- selected roots are not post-hoc deleted or reweighted to pass readiness;
- F01/F02/F03/F05/F06/F10 remain development observations, not validated/frozen taxonomy targets;
- Stage 2 seeds `29010001..29018192` remain reserved and unconsumed;
- Stage 2 is not authorized or executed;
- prior Research Generation 1 and G2-01..G2-07 formal decisions remain unchanged;
- machine failure labels are not interpreted as human difficulty/confusion/deception/error probability.

## Program sequencing decision

G2-01 through G2-08 are now closed under their respective prospective contracts. The next unstarted machine-only agenda item is:

```text
G2-09 — Motif Generalization / Counterexample Study 1
Priority = P1
status = planned / new prospective independent study
```

This record does not authorize G2-09 scientific generation. G2-09 must start from a fresh repository-state audit, fresh Study identity/stage contract and fresh prospective evidence.

A future new decision-failure taxonomy study may use MDFT-STUDY1 only as historical design evidence. It must use a new prospective study/version, new population contract and fresh seeds rather than changing MDFT-STUDY1's readiness gates after the fact.

## Canonical G2-08 records

- `doc/machine-decision-failure-taxonomy/STUDY_1_OVERVIEW.md`
- `doc/machine-decision-failure-taxonomy/STUDY_1_FINAL_REPORT.md`
- `doc/machine-decision-failure-taxonomy/CURRENT_STATUS.md`
- `doc/machine-decision-failure-taxonomy/DECISION_REGISTER.md`
- `doc/machine-decision-failure-taxonomy/REPRODUCIBILITY_INDEX.md`
- `doc/machine-decision-failure-taxonomy/results/STAGE_1_DEVELOPMENT_RESULT.json`
- `doc/machine-decision-failure-taxonomy/results/STAGE_1_FINAL_EXACT_COMPARISON.json`
- `doc/machine-decision-failure-taxonomy/results/STAGE_1_ARTIFACT_MANIFEST.json`
- `doc/machine-decision-failure-taxonomy/checkpoints/2026-08-30-closure-audit.md`
- `doc/machine-decision-failure-taxonomy/checkpoints/2026-08-30-pre-main-integration-audit.md`
