# G4-08 / BRSGT-STUDY1 — Stage 0 v2 preauthorization static audit

Date: 2026-09-27  
Stage: `BRSGT-S0-TECHNICAL-2026-09-27-v2`  
Decision: **`V2-PREAUTH-STATIC-AUDIT-PASS / EXECUTION NOT YET AUTHORIZED BY BINDING`**

## Context

Stage 0 v1 run `36295138475` is permanently closed as `TECHNICAL-INVALID / NO-RERUN`. Its failure was the invalid 34-seed NYUMBA technical fixture; no scientific evidence was accessed.

v2 is a new technical version and does not reuse v1 authorization or trigger.

## Audit baseline

```text
main baseline = 2023860419d13b6f294b0600943de8fb4e50b1bb
v1 trigger source = b3871b0454f6ce5e5f4a2e51afc95a10282ff4cd
v2 pre-checkpoint implementation HEAD = 0f9e81b98e18bd5f624bd1fb978453da4811b9db
v2 commits after v1 trigger = 8
fresh scientific seed access = 0
G4-10 depth-11 access = 0
public/ changes for v2 correction = 0
```

## Changed paths reviewed for v2

- v1 technical-invalid closure checkpoint
- `STAGE_0_V2_TECHNICAL_SPEC.json`
- Study spec stage-version ledger
- current status / decision register synchronization
- `run-brsgt-stage0-v2-technical.js`
- `verify-brsgt-stage0-v2-binding.js`
- `.github/workflows/brsgt-stage0-v2-technical.yml`

Production and independent BRSGT libraries are unchanged from the source whose byte separation and upstream binding passed in v1 pre-execution binding verification.

## v1 defect correction

PASS at static design level.

### NYUMBA fixture

v2 keeps the v1 front-row house-choice semantics but restores mass balance by placing the missing 30 stones in the non-active opponent back row.

Frozen state totals:

```text
front-board stones inherited from v1 semantics = 14
added opponent back-row balance = 30
reserves = 10 + 10 = 20
pending = 0
represented total = 64
```

The runner verifies the represented total before any event selection or geometry measurement.

### Namua→Mtaji fixture

v2 removes the manually mutated `reserve=[1,0]` fixture.

Instead, starting from `engine.initialState()`, it:

1. obtains production and independent canonical legal-move lists;
2. requires exact move-key-list equality;
3. applies candidate moves through both implementations and requires post RAW identity equality;
4. selects a direct Namua→Mtaji nonterminal transition if present;
5. otherwise advances through the first canonical nonterminal/non-relay successor;
6. repeats up to 160 plies.

No PRNG or scientific seed namespace is used.

## RAW identity firewall

PASS at static design level.

Before `selectionCore`, the runner explicitly checks:

```text
sum(pits) + reserve[0] + reserve[1] + pending[0] + pending[1] = 64
production RAW key = independent RAW key
```

This applies to initial, NYUMBA, reachable phase-pre, and phase-post fixtures.

## Event-selection gate

PASS at static design level.

The original G3-06 risk remains protected by canonical unit-by-unit comparison. v2 retains comparison of:

- fixture ID
- event labels
- pre RAW identity
- canonical move identity
- post RAW identity
- inclusion/exclusion disposition
- NYUMBA physical/stop/use identities
- compound label vector
- canonical order

Count-only agreement is not accepted.

## Geometry contract

PASS at static design level.

Planned measurements remain exactly seven roots, within frozen ceiling eight:

```text
initial pre/post
nyumba pre/stop-post/use-post
phase pre/post
```

All are required to be nonterminal, non-relay, 64-seed-valid RAW states before depth-5 LGTGMIV measurement.

M1-M6 and exact integer/reduced-rational arithmetic are unchanged.

## Scientific and protected-evidence firewall

PASS.

- future Stage 1 candidate namespace is not referenced by runner;
- future Stage 2 candidate namespace is not referenced by runner;
- G3-06 scientific namespaces are not referenced by runner;
- fresh scientific seed access remains false;
- G4-10 depth-11 access remains false;
- scientific outcome generation remains false;
- public AI changes remain false.

## Workflow isolation

PASS at static design level.

v2 has a dedicated workflow triggered only by:

`doc/rule-semantic-geometry-transition/executions/STAGE_0_V2_TRIGGER.json`

Its dedicated binding verifier will require:

- v1 closure present in Study version ledger;
- v2 stage identity;
- v2 new authorization;
- one authorized execution only;
- audited source SHA ancestry;
- exactly two post-audit changed paths: v2 authorization JSON and v2 trigger JSON;
- no future/G3-06 scientific namespace references.

## Runtime checks pending

This audit does not claim Stage 0 v2 PASS. GitHub Actions must still verify:

- syntax;
- v2 source binding;
- 64-seed fixture validity;
- deterministic phase fixture reachability;
- E1-E4 coverage;
- NYUMBA pair availability after 64-seed correction;
- unit-by-unit selection exact agreement;
- depth-5 geometry exact agreement;
- exact arithmetic agreement;
- resource ceilings;
- zero scientific reads;
- zero G4-10 depth-11 access.

## Decision

**`V2-PREAUTH-STATIC-AUDIT-PASS`**

The v2 implementation is ready to be bound to a new technical-only exactly-once authorization. The audited source SHA shall be the research HEAD including this checkpoint.

Stage 1 remains not authorized regardless of the v2 result.
