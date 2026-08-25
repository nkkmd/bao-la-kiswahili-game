# ORISC-STUDY1 — Historical Protocol Draft

**Study ID:** `ORISC-STUDY1`  
**Status:** **HISTORICAL PREFREEZE DESIGN / SUPERSEDED BY FROZEN FORMAL CONTRACT**  
**Baseline main:** `e8f0a3c360d9e7c9f7f6882fb212a32921040912`

This path originally contained the prospective design target used before machine-readable freeze. It is no longer an authorization or current-status document.

The prefreeze draft is preserved in Git history. The authoritative completed-study contract and result are now:

- `preregistration/STAGE_1_FORMAL_SPEC.json` — final frozen Axis A specification;
- `preregistration/STAGE_1_AUTHORIZATION.json` — Axis-A-only authorization;
- `preregistration/STAGE_2_CANDIDATE_CONTRACT.json` — conditional Stage 2 contract frozen before Axis A outcome;
- `results/STAGE_1_FORMAL_RESULT.json` — canonical Axis A result;
- `results/STUDY_1_FINAL_RESULT.json` — Study-level closure;
- `STUDY_1_FINAL_REPORT.md` — scientific/technical final integration.

## Historical design principles retained in the frozen study

The draft established the following principles before outcome generation, and each was retained in the final formal design:

1. separate engine-semantic state, identity projection, serialized raw state, `stateKey`, workflow raw row, repository stored row, reconstructed state and display/reporting representation;
2. freeze raw identity as `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`, excluding `turn` and `reason`;
3. define represented seeds as `sum(pits)+sum(reserve)+sum(pending)` with required total 64 for the frozen ancestry;
4. require two independently implemented serializer / state-key / exact transition / closure tracks;
5. make `IDENTITY` the mandatory positive control before interpreting nontrivial transforms;
6. freeze Stage 2 candidates, applicability, population, roots, depth, controls and failure rules before Axis A outcome;
7. prohibit oracle-row rewriting, post-outcome identity changes, threshold relaxation, seed extension, favorable subgroup selection and verifier alignment;
8. require a separate Stage 2 authorization only if Axis A representation integrity and IDENTITY pass.

## Final outcome relative to the draft

The formal Axis A decision was:

```text
ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
```

The frozen raw 8-state / 7-edge graph reconstructed exactly in both implementations, but three immutable repository-facing terminal rows failed stored-row re-hash and raw-state binding; all three differed only in `pending`. `A-G12` production/independent equality passed, so the result was interpretable `NOT-CONFIRMED` rather than `NON-ESTIMABLE`.

The conditional symmetry stage therefore remained:

```text
Axis B = NOT-AUTHORIZED-NOT-EXECUTED
```

No nontrivial symmetry candidate received a formal pass/fail label, and no canonicalization or symmetry-reduced state counting was authorized.

For current study status, read `CURRENT_STATUS.md` rather than this historical draft.