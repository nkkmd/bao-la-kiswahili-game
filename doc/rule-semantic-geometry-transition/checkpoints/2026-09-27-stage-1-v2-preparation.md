# G4-08 / BRSGT-STUDY1 — Stage 1 v2 pre-fresh preparation

Date: 2026-09-27

## Purpose

Prepare a version-isolated replacement for the technically invalid Stage 1 v1 without reusing v1 fresh evidence or changing the scientific question.

## Frozen v2 identity

- stage: `BRSGT-S1-DEVELOPMENT-2026-09-27-v2`
- evidence class: `FRESH-DEVELOPMENT`
- candidate fresh block: `40814001..40814512` / 512 slots
- v1 block `40813001..40813512`: permanently quarantined / no reuse
- Stage 2: not authorized
- G4-10 depth-11: not authorized
- public AI / main integration: not authorized

## Scientific contract retained from v1

The v2 design intentionally retains the v1 scientific contract:

- same two source policies;
- source horizon 72 plies;
- same E1-E4 event families;
- same M1-M6 metrics;
- RAW-only representation;
- relative depth 5;
- same candidate ordering and measurement target;
- same support thresholds;
- no effect-value or effect-sign retention;
- no formal inference in Stage 1.

The new version is for technical correctness and evidence isolation, not for changing the hypothesis after seeing v1 results. v1 produced no usable scientific result.

## Technical changes required by v1 invalidation

1. Use a new non-overlapping fresh seed block.
2. Add the entire v1 block to the identity firewall exclusion set.
3. Preserve the frozen v1 runner as source and pin its SHA-256.
4. Materialize the v2 runner by count-checked deterministic transformations only.
5. Correct all four undefined `freshScientificSeedReads` object shorthands to explicit `freshScientificSeedReads: freshSeedReads` mappings.
6. Add a pre-fresh catch-path self-test that intentionally throws before authorization/firewall/fresh-read logic and requires `STAGE_1_FAILURE.json` with fresh-read count 0.
7. Bind any later v2 authorization to the exact static-audited source HEAD and generated-runner SHA-256.
8. Permit only v2 authorization + v2 trigger after the audit freeze.

## Files prepared

- `prereg/STAGE_1_V2_DEVELOPMENT_SPEC.json`
- `prereg/UPSTREAM_IDENTITY_FIREWALL_V2.json`
- `tools/experiments/materialize-brsgt-stage1-v2-runner.js`
- `tools/experiments/verify-brsgt-stage1-v2-binding.js`
- `tools/experiments/audit-brsgt-stage1-v2-static.js`
- `.github/workflows/brsgt-stage1-v2-development.yml`
- `.github/workflows/brsgt-stage1-v2-preauth-static.yml`

## Authorization boundary

At this checkpoint:

- v2 fresh scientific access is **not authorized**;
- `STAGE_1_V2_AUTHORIZATION.json` must be absent;
- `STAGE_1_V2_TRIGGER.json` must be absent;
- only the static-audit trigger may be added next.

A successful static audit is necessary but not sufficient for scientific execution. A separate one-shot authorization is required afterward.
