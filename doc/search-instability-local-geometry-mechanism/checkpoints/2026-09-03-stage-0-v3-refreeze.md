# SILGM Stage 0 v3 — Fresh-free technical refreeze

Date: 2026-09-03  
Status: **`SILGM-S0-TECHNICAL-2026-09-03-v3 / AUTHORIZED FOR NEW TECHNICAL EXECUTION / NOT YET EXECUTED`**

## Basis

Stage 0 v2 is permanently `STAGE0-TECHNICAL-INVALID / NO RERUN` because fixed technical-only seed `31709002` did not produce the frozen Mtaji fixture target within 80 plies.

The v2 failure occurred before any real technical geometry/search measurement and before any fresh scientific evidence. Therefore:

```text
fresh G3-07 scientific evidence = NOT GENERATED / NOT READ
Stage 1 seed access = false
Stage 2 seed access = false
no-rescue boundary = NOT CROSSED
protected depth-10 access = false
```

## v3 technical correction frozen before computation

The v3 Namua technical fixture remains fixed at seed `31709001` with the same target.

The v3 Mtaji technical fixture is selected deterministically as follows:

1. candidate technical-only seeds are `31709002..31709008` inclusive;
2. inspect them in ascending seed order only;
3. for each seed, replay the same canonical-order seeded-random technical trajectory for at most 80 plies;
4. eligible target remains the first nonterminal Mtaji state at or after ply 44 with at least two legal move variants;
5. select the first seed that supplies the target;
6. if no seed in the frozen technical block supplies it, v3 is `STAGE0-TECHNICAL-INVALID`; no extension or replacement outside the block is allowed.

All attempted technical seed identities and the selected seed must be recorded. This selection uses only technical fixture availability and may not inspect any G3-07 scientific geometry/search endpoint.

v3 also retains the two already-frozen v2 technical corrections:

- synthetic G5 hand-derived expectation is `7/17`;
- deterministic-core checks are snapshotted before telemetry/resource-only T14 bookkeeping.

## Scientific contract unchanged

v3 does not change Study identity, RAW/move identity, LGTGMIV F1-F5 relative-depth-5 boundary, G1..G5 geometry metrics, six search conditions, three peer contrasts, E1..E5 search endpoints, Stage 1/2 seed namespaces/populations, development promotion rule, formal test, Holm FWER, identity firewall, resource ceilings, interpretation boundary, no-rescue rule, protected depth-10 firewall, or main-integration policy.

Maximum authorized v3 technical executions: `1`.

A v3 PASS still does not authorize Stage 1. A separate fresh-free Stage 1 authorization review remains mandatory.
