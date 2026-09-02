# BECT-STUDY1 — Stage 1 preauthorization tooling checkpoint

Date: 2026-09-02

## Decision

**`BECT-STAGE1-AUTHORIZATION-ELIGIBLE / SCIENTIFIC-EXECUTION-NOT-YET-AUTHORIZED`**

All required fresh-free preparation gates have passed. This checkpoint does not itself authorize Stage 1 seed access or scientific execution.

## Stage 0 prerequisite

```text
BECT-S0-TECHNICAL-2026-09-02-v2 = STAGE0-PASS
run = 33632094597
artifact = 9847240252
```

Stage 0 v1 remains immutable `TECHNICAL-INVALID / no rerun`.

## Identity-only firewall

Materialization:

```text
workflow run = 33634116550
job = 100260542549
artifact ID = 9848023294
artifact ZIP SHA-256 = da16c9103f80de82051b229239491535604f20b903e427d5b4898c7126d1418b
identity file SHA-256 = 771297c0fa0f2c9de3f74f85ba1b52d58de9e4ab1ae19c7421643436c0156926
identity core SHA-256 = 5b8246baf0f0b13fdfbc40b55bf3298895e7f0da660ca6b1275880361c4b7417
root identities = 124
trajectory identities = 124
opening-prefix identities = 67
scientificOutcomeFieldsRetained = false
g303DiagnosticScientificFieldsRetained = false
g304ScientificOutcomeFieldsRetained = false
```

Exact-byte mirror workflow:

```text
run = 33634259594
job = 100261031754
mirror commit = 229527b993012c8019ef782c62f4d2652ee0c7f9
```

The mirror re-materialized the identity-only file from frozen source bindings and required exact SHA-256 equality with the durable artifact before commit.

## Stage 1 source implementation

Frozen blobs:

```text
tools/experiments/lib/bect-stage1-production.js = 32995ed7e666b7cff7a6bb43946a30cdc86a7668
tools/experiments/lib/bect-stage1-independent.js = fcc150bdfcfbb1727ea6e0fdd4f336d1ae36e1e6
tools/experiments/run-bect-stage1-development.js = 127cb10ea23d18f0a32c2adc2d8c499de4c19b04
.github/workflows/bect-stage1-development.yml = dcb39d07420ad81db9e10d0ba08a10a9a3cb7cb7
UPSTREAM_IDENTITY_FIREWALL.json = 123430eb0cbe100bf50e068ee4c4ee7dc52c2ca8
STUDY_1_SPEC_CLARIFICATION_2.json = 87e78b008024301a26f78d1ac488d8489f9bd02b
```

Production imports only production BECT/LGTGMIV implementations. Independent imports only independent BECT/LGTGMIV implementations and does not import the production Stage 1 selector, aggregator, event detector or endpoint implementation.

## Static audit

```text
run = 33635090198
job = 100263846393
result = success
scientific runner execution = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

Syntax, implementation separation, source blobs, prereg, firewall core and protected-evidence state passed.

## Tooling smoke

Initial smoke:

```text
run = 33635334088
unarmed runner fail-closed = PASS
scientific computation started = false
Stage 1 seed access = false
final smoke disposition = technical assertion failure
```

The failure was confined to a static assertion that counted the literal `STAGE1_EXECUTION_TRIGGER` twice because the same literal also appears in the workflow's branch-advancement allowlist. No scientific or seed access occurred.

Corrected smoke:

```text
run = 33635443176
job = 100265043171
result = success
unarmed runner fail-closed = PASS
single dedicated trigger declaration = PASS
concurrency guard = PASS
scientific lease path declaration = PASS
artifact-before-mirror path declaration = PASS
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

The smoke invokes the scientific runner only while unarmed; it must stop at the missing authorization artifact before `freshAccessStarted` and must create neither scientific result nor lease.

## Source validation

```text
run = 33635524477
job = 100265316151
result = success
scientific workflow execution = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

All exact scientific source/blob bindings, firewall core, seed namespace, Stage 0 PASS and protected depth-10 seal were validated.

## Durable lease-path smoke

```text
run = 33635710262
job = 100265942917
result = success
trigger commit = bd7a7ef367b170e79d874d941bd0583513d02baa
durable technical marker commit = a588dbbaf01d1c5a5d5191ef3f34b9e054ab8037
scientific authorization = false
scientific computation = false
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

The smoke exercised the actual GitHub contents-write and branch-push path using a separate technical marker. The marker path does not match the scientific trigger path, and no scientific workflow was started by the marker push.

## Scientific execution-count audit before authorization

At this checkpoint:

```text
STAGE_1_DEVELOPMENT_AUTHORIZATION.json = absent
STAGE1_EXECUTION_TRIGGER = absent
stage-1-execution-started.json = absent
results/stage-1/scientific-result.json = absent
BECT Stage 1 Development workflow executions = 0
Stage 1 seed consumption = false
```

GitHub Actions history for the branch contains only the preauthorization materialization/static-audit/tooling-smoke/source-validation/lease-smoke runs described above; no run named `BECT Stage 1 Development` has occurred.

## Freshness boundary

```text
fresh BECT Stage 1 scientific evidence generated = false
fresh BECT Stage 1 scientific evidence read = false
Stage 1 seed 31510001..31510240 = NOT CONSUMED
Stage 2 seed 31520001..31520384 = NOT CONSUMED
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
no-rescue boundary = NOT CROSSED
```

## Authorization eligibility

A separate explicit Stage 1 authorization artifact may now be created. It must bind the exact preauthorization branch HEAD, the frozen source blobs above, one authorization nonce, `maxScientificExecutions=1`, and seed block `31510001..31510240`.

After that authorization, the only permitted branch advancements before scientific computation are the authorization artifact itself and exactly one `STAGE1_EXECUTION_TRIGGER` marker, as enforced by the frozen scientific workflow.
