# SILGM Stage 1 authorization review

Date: 2026-09-03  
Study: `SILGM-STUDY1`  
Stage under review: `SILGM-S1-DEVELOPMENT-2026-09-03-v1`

Formal decision: **`STAGE1-AUTHORIZED`**

## Scope of authorization

This decision authorizes exactly one fresh Stage-1 development execution under the already frozen SILGM Study and Stage-1 contracts. It does not authorize Stage 2 and does not authorize any protected depth-10 access.

Authorized fresh seed range:

```text
31710001..31710256
```

Frozen target population:

```text
24 Namua + 24 Mtaji = 48 selected RAW roots
```

No seed extension, root replacement, post-result repair, same-evidence rerun, threshold relaxation, endpoint substitution, search-condition redesign, geometry substitution, verification relaxation, or resource-ceiling relaxation is authorized after the first Stage-1 seed access.

## Authorization basis

The authorization gates are satisfied prospectively and without Stage-1 scientific evidence:

1. G3-07 program authorization and `SILGM-STUDY1` contract remain unchanged.
2. `SILGM-S0-TECHNICAL-2026-09-03-v4` is `STAGE0-PASS` with canonical result SHA-256 `c33f3979f068879913123447c66ae2d81146724d87db2b5f72f021bbe36348c8` and deterministic core `fc44c69eb5c164143af821da872a1b2f9d842f1369e9dcd98a1cdd14b42ec076`.
3. The Stage-1 population-selection rules, phase/rank salts, 24+24 target, exact geometry/search endpoints, promotion rule, resource ceilings, and failure handling were frozen before fresh evidence.
4. The upstream firewall retains identity exclusions only. G3-06 failed-selection diagnostics, event/mechanism direction, and failed/partial selection provenance are not retained.
5. `SILGM-S1-PREAUTH-STATIC-2026-09-03-v1` passed and verified production/independent implementation separation, exact source binding, authorization-before-seed-access, and unarmed fail-closed behavior.
6. The preauthorization artifact records `freshStage1SeedAccess=false`, `freshStage2SeedAccess=false`, `protectedDepth10Access=false`, and `noRescueBoundaryCrossed=false`.
7. Stage-1 combined resource ceilings were fixed from technical-only Stage-0 evidence before fresh Stage-1 access.
8. A one-shot authorization/arming/trigger chain with durable pre-computation lease and artifact-before-mirror can be source-bound before scientific execution.

## Execution boundary

Authorization is not computation. Before fresh access, the machine-readable authorization artifact must bind the exact scientific tooling commit and Git blobs. The trigger commit must separately bind that authorization commit. The workflow must verify both bindings and must reject any rerun attempt other than the first workflow attempt.

The no-rescue boundary crosses at the first Stage-1 seed generation/read inside the authorized scientific runner. If Stage 1 becomes `TECHNICAL-INVALID` or `NON-ESTIMABLE`, the same Stage-1 evidence is not rerun or repaired.

## Protected evidence

```text
standard initial RAW-root exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ / NOT PEEKED
```

## Stage 2

Stage 2 remains **`NOT AUTHORIZED / NOT EXECUTED`**. A Stage-1 PASS does not by itself authorize Stage 2. A separate post-Stage-1 review is required, and Stage 2 can only proceed if the valid frozen promoted-candidate set is nonempty and all other prospective gates are satisfied.
