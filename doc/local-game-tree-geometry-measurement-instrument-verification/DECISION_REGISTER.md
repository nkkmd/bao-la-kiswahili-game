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

## D-014 — Stage 0 technical disposition

**Decision:** Accept `LGTGMIV-S0-TECHNICAL-2026-08-31-v1` as `STAGE0-PASS`.

The formal workflow result was committed at `044b39cd414f208226c989c17aeb61ae412d80a2` after run `33386868192`. Production and structurally independent implementations agreed exactly on the reconstruction core, every family core and the deterministic stage scientific core. Telemetry-mutation invariance, the legacy failure-mode control, static independence and protected-evidence firewall all passed.

This decision establishes technical instrument readiness only. It does not establish scientific eligibility for any family.

## D-015 — Stage 1 development authorization

**Decision:** Authorize `LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1` for one formal execution under the frozen preregistration after Stage 0 PASS.

The separate authorization artifact is `authorizations/2026-08-31-stage-1-development-authorization.md`. At authorization time Stage 1 and Stage 2 fresh seed consumption remains zero and the protected depth-10 holdout remains sealed/unread.

No scientific contract term is changed by this authorization. The no-rescue boundary activates upon first Stage 1 fresh scientific evidence generation/read.

## D-016 — Stage 1 formal disposition

**Decision:** Accept `LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1` as `STAGE1-PASS`.

- formal run: `33450205296`
- result commit: `52812f37197df74e90d1864720ad1b7e6f13d7fa`
- read-only audit run: `33450472967 / success`
- audit result commit: `c81b52d32b6c53dbb6eefb851663bfacbab05a6e`
- population: 16/16 unique RAW roots, 8 Namua + 8 Mtaji
- depth: 5
- consumed block: `31110001..31110128`
- global gate: PASS
- exact production/independent reconstruction agreement: 16/16
- promoted families: all five frozen LGTGMIV families

The Stage 1 evidence and instrument are now immutable under the no-rescue rule. No same-block formal rerun or repair is authorized.

## D-017 — Stage 2 formal authorization

**Decision:** Authorize `LGTGMIV-S2-FORMAL-2026-08-31-v1` for one formal execution under the already-frozen Stage 2 preregistration.

The prerequisites were prospectively satisfied by Stage 1 global PASS plus a non-empty promoted family set. The separate authorization artifact is `authorizations/2026-09-01-stage-2-formal-authorization.md`.

The authorized holdout is exactly `31120001..31120192`, 12 Namua + 12 Mtaji, depth 5. Tested families are exactly the Stage 1 promoted family set, which contains all five frozen families. G3-01 and Stage 1 RAW root/full trajectory/first-16 prefix identities are exclusion-only firewalls.

At authorization time the Stage 2 fresh block remained `NOT GENERATED / NOT READ` and the protected depth-10 holdout remained sealed/unread.

## D-018 — Stage 2 non-scientific tooling smoke

**Decision:** Accept the pre-holdout Stage 2 tooling smoke as PASS.

- workflow commit: `ff6810176b396de0a5265567888ba3cb9449b204`
- workflow run: `33451567682`
- job: `99682401722 / success`
- checkpoint: `checkpoints/2026-09-01-stage-2-tooling-smoke-pass.md`

The smoke used only committed Stage 1 identities plus synthetic controls. It verified dual-firewall binding and production/independent selector separation without reading or generating any Stage 2 fresh holdout evidence. Stage 2 remains not yet executed at this decision point.
