# Restricted Endgame Exact Oracle Expansion Study 1

Research Generation 2 `G2-04` / formal Study ID `REEOE-STUDY1`.

Status: **COMPLETED / formal decision `INCONCLUSIVE` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`**.

## Canonical documents

- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `RESEARCH_LOG.md`
- `REPRODUCIBILITY_INDEX.md`
- `preregistration/STUDY_START_CONTRACT.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
- `results/STAGE_0_TECHNICAL_RESULT.json`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json` — invalidated v1 lineage
- `preregistration/STAGE_1_DEVELOPMENT_AUTHORIZATION.json` — invalidated v1 lineage
- `preregistration/STAGE_1_DEVELOPMENT_V2_SPEC.json`
- `preregistration/STAGE_1_DEVELOPMENT_V2_AUTHORIZATION.json`
- `results/STAGE_1_DEVELOPMENT_V2_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`

## Representation rule

Authoritative RAW identity remained:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason` are excluded. Symmetry reduction, canonicalization, quotient graphs, and symmetry-reduced state counting were not used or authorized.

## Closure summary

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 v1 = TECHNICAL-INVALID-VERIFIER-NOT-EXECUTED
Stage 1 v2 = STAGE1-DEVELOPMENT-BLOCKED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal decision = INCONCLUSIVE
fresh exact oracle produced = false
```

Stage 1 v2 independently reconstructed 8 selected fresh roots, but none achieved complete forward closure under the prospectively frozen ceilings: four reached `STATE-LIMIT`, three `ADMIN-CUTOFF`, and one `MOVE-NONTERMINATION`. The frozen feasibility rule required at least three complete closures, so Stage 2 was not authorized.

No cap increase, domain shrinkage, root replacement, seed extension, partial-closure promotion, symmetry reduction, or other same-study rescue was performed.
