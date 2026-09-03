# GCLD-STUDY1 — Stage 2 pre-fresh-access technical abort

Date: 2026-09-04
Study: `GCLD-STUDY1`
Stage: `GCLD-S2-FORMAL-2026-09-03-v1`
Actions run: `33809894513`
Trigger commit: `0f443f152208ff95855791f51c6875782cb72086`
Authorization commit: `ca49e2adb90d1e0d05434baeca6bc7a11e106c1a`

## Observed execution boundary

The workflow was run number 1. Source-bound authorization verification passed. A durable pre-computation lease was materialized and uploaded before the formal-computation step.

The formal-computation process then terminated immediately in `firewall()` with:

```text
Error: G3-09 firewall not identity-only
```

The runner source order is prospectively fixed as:

```text
const started = Date.now(), fw = firewall();
let sp, si;
sp = P.selectCandidates(... stage2 fresh seed block ...);
```

The exception occurred inside `firewall()` before either production or independent `selectCandidates` was invoked. Consequently:

```text
Stage 2 fresh seed reads = 0
Stage 2 candidate trajectories generated = 0
Stage 2 scientific coordinates generated = 0
Stage 2 formal endpoint values generated = 0
Stage 2 formal inference generated = 0
scientific result artifact uploaded = no
```

The Actions run contains exactly one artifact, the pre-computation lease (`artifact ID 9914370441`, ZIP SHA-256 `2362aefa5d091c0f77c269fa74178b89e5c6b7a84a84ca7043ff9e65d0e5c9b3`). No Stage 2 scientific-result artifact exists.

## Cause

The Stage 2 runner introduced an additional metadata assertion requiring both historical G3-09 selection artifacts to contain an explicit top-level `scientificOutcomeFieldsRetained === false` marker. The G3-09 Stage 2 selection artifact predates that explicit marker. Its `identityRows` were intended only as an upstream identity firewall, but the new assertion rejected the legacy metadata shape before seed access.

This is a control-plane / technical compatibility defect. It is not a scientific result, null result, non-estimable result, or Stage 2 `TECHNICAL-INVALID` after fresh evidence access.

## Formal disposition of the attempt

**`PRE-FRESH-ACCESS-TECHNICAL-ABORT / SCIENTIFIC-EXECUTION-NOT-CONSUMED`**

`GCLD-STAGE2-AUTHORIZED` remains in force for exactly one first fresh scientific execution, provided that a new source-bound technical execution version is prospectively frozen before any fresh seed access.

## Permitted correction boundary

A successor technical execution version may:

- correct only the legacy G3-09 Stage 2 identity-firewall compatibility check;
- project only `identityRows` fields needed for root / trajectory / opening-prefix exclusion;
- retain the exact same Stage ID, seed block, candidate population, preflight rules, measured-population rule, endpoints, controls, tests, multiplicity rule, estimability gates and resource ceilings;
- use a new workflow identity with run-number ceiling 1;
- use a new machine authorization and a separate trigger commit.

It may not:

- read or reuse G3-09 Stage 2 partial scientific measurements;
- change scientific selection based on G3-09 failure location or partial outcomes;
- change any GCLD scientific contract;
- extend or replace Stage 2 seeds;
- access protected depth-10;
- rerun Actions run `33809894513`;
- integrate to `main`.

## Current boundary

```text
GCLD Stage 2 scientific executions = 0
GCLD Stage 2 fresh seed access = 0
GCLD Stage 2 status = AUTHORIZED / AWAITING FIRST FRESH EXECUTION
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```
