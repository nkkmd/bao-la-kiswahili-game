# G4-08 / BRSGT-STUDY1 — Stage 1 v3 pre-fresh preparation

Date: 2026-09-27

## Purpose

Prepare a version-isolated Stage 1 v3 after v2 failed with the identified preflight limit-interface schema mismatch. v3 preserves the frozen scientific design and changes only the technical interface mapping needed to call the already-existing compatibility preflight correctly.

## Frozen v3 identity

- stage: `BRSGT-S1-DEVELOPMENT-2026-09-27-v3`
- evidence class: `FRESH-DEVELOPMENT`
- candidate fresh block: `40815001..40815512` / 512 slots
- v1 block `40813001..40813512`: quarantined / no reuse
- v2 block `40814001..40814512`: consumed / no reuse
- Stage 2: not authorized
- G4-10 depth-11: not authorized
- public AI / main integration: not authorized

## Scientific contract retained

v3 retains the v2 scientific contract without relaxation:

- same two source policies;
- same 72-ply source horizon;
- same E1-E4 event families;
- same M1-M6 metrics;
- RAW-only representation;
- relative depth 5;
- same candidate ordering and per-trajectory cap;
- same measurement targets and support thresholds;
- no effect-value or effect-sign retention;
- no formal inference in Stage 1;
- no Stage 2 or protected holdout access.

No usable v2 scientific result existed, so the v3 correction is not outcome-adaptive.

## Exact technical correction

The three inherited key mappings are changed from:

```text
globalDistinctRawStates       -> distinctRawStates
uniqueCanonicalTransitions    -> uniqueTransitions
legalMoveVariantsEnumerated   -> legalMoveEvaluations
```

`parentExpansions` and `treeNodeOccurrences` remain unchanged.

The required five-key contract is frozen in `STAGE_1_V3_DEVELOPMENT_SPEC.json`.

## Pre-fresh self-tests

v3 retains the v2 catch-path self-test and adds a preflight-contract self-test.

The generated runner, before any authorization/firewall/fresh-read path, can be executed in a technical-only mode that:

1. calls `rawLimits()` from the generated runner;
2. passes that exact object to production and independent `preflightContinuous()`;
3. uses `E.initialState()` and technical metadata seed `44015001`;
4. requires production/independent exact agreement;
5. requires the exact five limit keys;
6. requires fresh scientific reads = 0;
7. requires no-rescue boundary = false;
8. requires Stage 2/G4-10 reads = 0.

This specifically prevents recurrence of the v2 interface defect before a new scientific block is opened.

## Prepared files

- `prereg/STAGE_1_V3_DEVELOPMENT_SPEC.json`
- `prereg/UPSTREAM_IDENTITY_FIREWALL_V3.json`
- `tools/experiments/materialize-brsgt-stage1-v3-runner.js`
- `tools/experiments/verify-brsgt-stage1-v3-binding.js`
- `tools/experiments/audit-brsgt-stage1-v3-static.js`
- `.github/workflows/brsgt-stage1-v3-development.yml`
- `.github/workflows/brsgt-stage1-v3-preauth-static.yml`

## Authorization boundary

At this checkpoint:

- v3 scientific execution is not authorized;
- `STAGE_1_V3_AUTHORIZATION.json` must be absent;
- `STAGE_1_V3_TRIGGER.json` must be absent;
- only a static-audit trigger may be added next.

Static-audit PASS is necessary but not sufficient for scientific execution. A separate source-bound one-shot authorization remains mandatory.
