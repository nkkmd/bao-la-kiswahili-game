# State Space / Game Tree Complexity Study 1

**Study ID:** `SSGTC-STUDY1`  
**Working title:** State Space / Game Tree Complexity Study 1  
**Status:** PROSPECTIVE / IN PROGRESS  
**Scientific inference:** NOT AUTHORIZED  
**Representation:** RAW-ONLY

## Purpose

This independent prospective study asks whether Bao reachable-state growth, branching structure, transpositions, trajectory structure, and bounded game-tree expansion can be quantified reproducibly using authoritative raw rule-state identity while keeping exact, bounded-exact, observed, estimated, tree-node, and trajectory claims separate.

It does not reopen, rescue, reclassify, or amend any completed Bao study.

## Study-start baseline

- remote `main` SHA: `9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901`
- study branch: `research/state-space-game-tree-complexity`
- study ID: `SSGTC-STUDY1`

## Representation firewall

Authoritative raw-state identity includes exactly:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

and excludes:

```text
turn
reason
```

`pending` is mandatory. Missing `pending` is a hard representation error and MUST NOT be repaired by silently supplying `[0,0]`.

Every accepted raw state must satisfy:

```text
sum(pits) + sum(reserve) + sum(pending) = 64
```

No symmetry, seat-swap, reflection, compound transformation, canonicalization, or quotient reduction is authorized in Study 1.

## Stages

1. **Stage 0 — technical representation / enumeration validation.** No scientific conclusion is authorized.
2. **Stage 1 — exploratory growth characterization.** Fresh study-owned corpus; scientific inference remains unauthorized.
3. **Stage 2 — prospective formal quantification, if authorized.** Fresh population/domain and a separately frozen formal specification are required before any formal outcome is observed.

Stage 2 is not yet authorized.

## Core documents

- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `RESEARCH_LOG.md`
- `REPRODUCIBILITY_INDEX.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `preregistration/STUDY_START_FIREWALL.md`
- `preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md`
- `preregistration/STAGE_1_EXPLORATORY_DESIGN.md`
- `preregistration/STAGE_2_PROSPECTIVE_FIREWALL.md`

No merge to `main` and no auto-merge are authorized without explicit post-completion instruction.