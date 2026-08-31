# Decision Register — LGTGMIV-STUDY1

## D-001 — Independent Study identity

**Decision:** Freeze `LGTGMIV-STUDY1` as a new post-G3-01 / pre-G3-02 prerequisite Study.

**Boundary:** It is not G3-01 Study 2, corrected rerun, repair, rescue or same-evidence replication.

## D-002 — Source baseline and branch

- source baseline: `a53aabd26f78ac408445aff2d18ace3b21b827d7`
- branch: `research/pre-g3-02-local-game-tree-geometry-measurement-instrument-verification`

## D-003 — RAW-only identity

Scientific state identity is RAW-only: `pits,reserve,houseOwned,player,phase,winner,pending`. Validated transform set is empty.

## D-004 — Stage IDs

- `LGTGMIV-S0-TECHNICAL-2026-08-31-v1`
- `LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1`
- `LGTGMIV-S2-FORMAL-2026-08-31-v1`

Only Stage 0 is authorized at Study start.

## D-005 — Fresh evidence blocks

- Stage 1: `31110001..31110128`, 8 Namua + 8 Mtaji, depth 5
- Stage 2: `31120001..31120192`, 12 Namua + 12 Mtaji, depth 5

G3-01 block `31010001..31010096` is prohibited.

## D-006 — Canonical core / telemetry separation

Execution-dependent telemetry is excluded from every scientific canonical digest. Resource telemetry is maintained separately and may only drive estimability/resource gates.

## D-007 — Candidate family set

The only candidate family IDs are `LGTGMIV-F1` through `LGTGMIV-F5` as fully defined in `STUDY_1_PROTOCOL.md`. G3-01 family eligibility is not inherited.

## D-008 — Independent implementation rule

Production and independent implementations may share the authoritative engine API only. They may not share new LGTGMIV state/move canonicalization, enumerator, metric, family projection, set/edge hash, root hash or stage hash implementation.

## D-009 — Stage progression

Stage 1 requires documented Stage 0 PASS and a separate authorization artifact. Stage 2 requires all Stage 1 global gates PASS, a non-empty promoted family set and a separate authorization artifact.

## D-010 — No-rescue

After fresh Stage 1 evidence generation/read begins, same-Study rescue through seed reuse, verifier repair, threshold/field/family/root/seed/population/horizon/resource/gate/taxonomy changes is prohibited.

A single technical refreeze is possible only during Stage 0 before any scientific seed/evidence access, under the narrow conditions in the protocol and with a new Stage 0 ID/version.

## D-011 — Protected holdout

Protected standard-root exact depth-10 evidence remains `SEALED / NOT GENERATED / NOT READ` throughout this Study.

## D-012 — Formal decision taxonomy

Closure must use one of:

- `FORMAL-ELIGIBLE-ALL`
- `FORMAL-ELIGIBLE-PARTIAL`
- `NO-FORMAL-ELIGIBLE-FAMILY`
- `NON-ESTIMABLE`
- `INCONCLUSIVE`
- `TECHNICAL-INVALID`

A non-authorized downstream stage is recorded as `NOT-AUTHORIZED-NOT-EXECUTED`.

## D-013 — Downstream boundary

Successful prerequisite closure does not automatically start G3-02. G3-02..G3-08 remain blocked until separate Research Generation 3 authorization review.
