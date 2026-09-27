# G4-08 / BRSGT-STUDY1 — Stage 0 preauthorization static audit

Date: 2026-09-27  
Stage: `BRSGT-S0-TECHNICAL-2026-09-27-v1`  
Decision: **`PREAUTH-STATIC-AUDIT-PASS / EXECUTION NOT YET AUTHORIZED BY BINDING`**

## Audit baseline

```text
main baseline = 2023860419d13b6f294b0600943de8fb4e50b1bb
research branch = research/g4-08-rule-semantic-geometry-transition
pre-checkpoint implementation HEAD = 2341923ea97f70a50ca28f25aa77d971d0bd65c2
branch relation = ahead / 13 commits / behind 0
public/ changes = 0
scientific result files = 0
fresh scientific seed access = 0
G4-10 depth-11 access = 0
```

## Static scope reviewed

- authorization review
- Study README / protocol / current status / decision register
- Study preregistration JSON
- Stage 0 technical spec
- Stage 0 technical plan
- production implementation
- structurally independent implementation
- Stage 0 runner
- authorization/source-binding verifier
- GitHub Actions technical workflow

## Contract checks

### Scientific firewall

PASS.

- Stage 0 evidence class is `TECHNICAL-FIXTURE`.
- Stage 1/2 future namespaces are recorded only as unread candidates.
- Stage 0 runner contains no reference to candidate scientific seed values.
- G3-06 scientific namespace is not used.
- G4-10 depth-11 access is explicitly disabled.
- public AI changes are not authorized.

### G3-06 non-repair boundary

PASS.

`BRSGT-STUDY1` is a new Study identity. G3-06 Stage 1 evidence, unused Stage 2 namespace, and partial selector diagnostics are not adopted as BRSGT scientific evidence.

### Event-family separation

PASS.

Four contracts are frozen separately:

```text
E1 capture
E2 nyumba use vs stop
E3 reserve decrement without phase transition
E4 Namua to Mtaji
```

E1 may overlap E3/E4 through a full label vector; E3/E4 are not pooled.

### Selector verification design

PASS.

The Stage 0 comparison is not count-only. Production and independent outputs are compared as complete canonical selection cores including fixture, event labels, RAW pre/post identity, move identity, disposition, NYUMBA pair identity, overlap vector, and canonical order.

### Implementation independence

PASS at static structural level.

- production binds `lgtgmiv-stage1-production.js`;
- independent binds `lgtgmiv-stage1-independent.js`;
- rule-event extraction is separately implemented;
- both are joined only at the Stage 0 runner exact-agreement gate.

Runtime exact agreement remains to be tested by the authorized technical workflow.

### Geometry boundary

PASS.

- RAW-only
- relative depth exactly 5
- LGTGMIV F1-F5 derived M1-M6 only
- exact integer/reduced-rational arithmetic
- max 8 geometry roots
- planned Stage 0 measurements = 7

### Workflow binding

PASS at static design level.

Workflow triggers only from:

`doc/rule-semantic-geometry-transition/executions/STAGE_0_TRIGGER.json`

Before technical execution it runs syntax checks and `verify-brsgt-stage0-binding.js`. The verifier requires the audited source SHA to be an ancestor and permits only the authorization JSON plus trigger JSON to differ from that audited source.

## Runtime checks still pending

This static audit does not claim runtime PASS. The authorized GitHub Actions run must still verify:

- Node syntax
- source/authorization binding
- E1-E4 fixture coverage
- unit-by-unit production/independent selection equality
- depth-5 production/independent geometry equality
- exact arithmetic equality
- resource ceiling
- zero scientific-seed reads
- zero G4-10 depth-11 access

## Decision

The Stage 0 implementation is structurally ready to be source-bound for one technical execution.

The authorization JSON must bind to the research HEAD **including this checkpoint**. After that binding, no implementation/spec/workflow/document change is allowed before the trigger except the authorization JSON itself and the trigger JSON.

Stage 1 remains not authorized regardless of Stage 0 outcome.
