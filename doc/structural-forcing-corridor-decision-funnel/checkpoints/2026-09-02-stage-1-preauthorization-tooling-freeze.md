# SFCDF-STUDY1 — Stage 1 pre-authorization tooling freeze

Date: 2026-09-02

## Scientific state

```text
Stage 0 = STAGE0-PASS
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed 31410001..31410192 = NOT CONSUMED
Stage 2 seed 31420001..31420288 = NOT CONSUMED
fresh G3-04 scientific evidence = NOT GENERATED / NOT READ
no-rescue boundary = NOT CROSSED
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
Stage 1 scientific workflow runs before authorization = 0
```

## Identity-only firewall

Final manifest:

```text
path = doc/structural-forcing-corridor-decision-funnel/prereg/UPSTREAM_IDENTITY_FIREWALL.json
blob = 9bc9debfa8df428eece243ca2ce49baf5707b9bf
identity core SHA-256 = 0196f255aa152f343cb428ee048ab1570ccdf4661c5adba5a47f4356a974b086
upstream LGTGMIV identity records = 80
G3-03 source pairs = 12
G3-03 root identity records = 24
scientificOutcomeFieldsRetained = false
g303ScientificOutcomesRetained = false
```

Initial materialization run `33620632604` failed before manifest materialization because partial upstream identities were incorrectly required to be complete root/trajectory/prefix triples. It accessed no G3-04 fresh seed. Corrected v2 treated root, trajectory and prefix as independent exclusion sets and passed in run `33620803843`; manifest commit `03e4ddcf99a4e17aa6286a649de6ba1e8bbe413e`.

## Actual control-plane tooling smoke

GitHub Actions run:

```text
run = 33621353261
trigger SHA = b18fa1a9c11ee16a30923e6ef667511d4bc99c2e
trigger-SHA workflow count = 1
scientific workflow count = 0
lease commit = 7a58189f8d5c776a7c249af0dc2a6b6e75d63212
mirror commit = 4ffe10db
artifact ID = 9843024068
artifact ZIP SHA-256 = 2a09ac45fef612dbc85c3bbeb5ea05fd57dfa04334d24b8840e22baaa4505d7b
conclusion = success
```

The smoke exercised, without Stage 1/2 seed access:

1. dedicated path-trigger separation;
2. durable lease commit/push before the smoke computation;
3. canonical ordinary-object / null-prototype equality;
4. durable artifact upload;
5. exact-byte artifact download and repository mirror;
6. no recursive scientific workflow trigger.

Canonical mirrored smoke result:

```text
blob = dbab4c6c70230ad6d7e827d766a5d9ac3fcf1f3d
canonicalPrototypeInsensitiveEquality = true
canonicalContentSha256 = 33c2e73494cf473a7b9ef46e2a7043eb67133ad54d890ae2d682a799b479b2f1
freshScientificEvidence = false
stage1SeedAccess = false
stage2SeedAccess = false
protectedDepth10Access = false
disposition = TOOLING-SMOKE-PASS
```

## Final Stage 1 source validation

Run `33621535038` completed `success` on trigger SHA `f2d6a4feec6591cf7071522be48374d2dd6c1af3`.

The run performed only source/static validation and no selection or measurement. It passed:

- `node --check` for production selector, independent selector and Stage 1 runner;
- module import/API validation;
- six-candidate identity agreement;
- Stage 1/2 seed and population contract checks;
- identity-only firewall validation;
- Stage 0 PASS binding;
- no `isDeepStrictEqual` in the scientific runner;
- canonical scientific content gate presence;
- lease environment guards;
- dedicated execution trigger;
- artifact-before-mirror control order.

No fresh seed was accessed.

## Frozen Stage 1 source blobs

```text
tools/experiments/lib/sfcdf-stage1-production.js
= 1cfbc58b2d670fa2bee0254c4ab8bb09c67d5a48

tools/experiments/lib/sfcdf-stage1-independent.js
= 9d39e13c7dd4d0d2d9dcb99500dfb07c92e48215

tools/experiments/run-sfcdf-stage1-development.js
= a4162e2dba356b2b4a2639ef320e87b7b567bb83

.github/workflows/sfcdf-stage1-development.yml
= a0454e894c0d5e1709d7c79a3140aed58be95eaf
```

Already frozen scientific dependencies remain:

```text
STUDY_1_SPEC.json = 3742a0b9ddbcf9c7b3534d22adb0e06d859410bf
sfcdf-production.js = b6fca5d533ff4fdf906e64509185b480c6dc5818
sfcdf-independent.js = 3bbc16d41c56f2eb00d7169ace2359f0fa9b9b53
lgtgmiv-stage1-production.js = a4664f01535d6abbf6f83821befbb2fafd55cde6
lgtgmiv-stage1-independent.js = 0c7239ac7acf146e9aee63dae66194681b8631d6
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
```

## Authorization boundary

This checkpoint does **not** authorize Stage 1.

The next action is a separate read-only Stage 1 authorization review. If and only if it passes, a machine-readable authorization may freeze this exact scientific-content state with `maxScientificExecutions = 1`. Only a subsequent dedicated `STAGE1_EXECUTION_TRIGGER` may consume the fresh Stage 1 seed block.
