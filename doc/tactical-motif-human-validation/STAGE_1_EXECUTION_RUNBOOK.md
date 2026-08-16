# Stage 1 Execution Runbook — Tactical Motif Human Validation

## Preconditions

Checkout `research/tactical-motif-human-validation` at the exact authorized commit with a clean worktree.

## Contract/tooling checks

```sh
node tools/experiments/validate-tactical-motif-human-validation-stage1-spec.js
node test/tactical-motif-human-validation-stage1.test.js
node tools/experiments/run-tactical-motif-human-validation-stage1.js --phase status
```

`status` is non-generative.

## Authorization

Generation remains blocked until `doc/tactical-motif-human-validation/preregistration/STAGE_1_STIMULUS_AUTHORIZATION.json` exists and its source hashes match the current tree.

## Generate locally

```sh
node tools/experiments/run-tactical-motif-human-validation-stage1.js --phase generate
```

Default output: `artifacts/local/tactical-motif-human-validation/stage1-stimulus-v1/`.

Do not commit the `games/` directory.

## Independent verification

```sh
node tools/experiments/verify-tactical-motif-human-validation-stage1.js
```

Selection is blocked unless `verification.json` records `passed=true` and `fullSearchRecomputation=true`.

## Build target/control pool

```sh
node tools/experiments/run-tactical-motif-human-validation-stage1.js --phase select
```

Expected compact artifacts: `manifest.json`, `verification.json`, `stimulus-pool-audit.json`, `stimulus-pool.json`.

Do not change seed count, thresholds, class definitions, or matching merely to force a readiness pass.

## Human-data firewall

This runbook never authorizes recruitment or formal human response collection.
