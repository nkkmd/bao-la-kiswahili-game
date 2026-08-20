# STAGE_1_EXECUTION_RUNBOOK — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-20  
Status: **EXECUTION TOOLING MATERIALIZED / TECHNICAL VALIDATION PENDING / SCIENTIFIC GENERATION NOT AUTHORIZED**

## 1. Frozen scientific contract

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
games = 2048
seeds = 22400001..22402048
root quota = Namua 600 + Mtaji 600
primary reference = D3 + Q1 / bao / root actor
```

The contract was validated at exact local HEAD `b3ff83a4b94b5e60e98ef48b6b2666a20a26334a`.

## 2. Tooling surface

```text
tools/experiments/lib/blunder-misvaluation-stage1-corpus.js
tools/experiments/lib/blunder-misvaluation-stage1-discovery.js
tools/experiments/run-blunder-misvaluation-stage1-exploratory.js
tools/experiments/verify-blunder-misvaluation-stage1-exploratory.js
test/blunder-misvaluation-stage1-tooling.test.js
.github/workflows/blunder-misvaluation-stage1-tooling.yml
```

The implementation reuses already validated Bao engine/search/feature instrumentation. It does not modify the frozen Stage 1 spec or closed-study decisions.

## 3. Current allowed commands

Before a separate authorization exists, only status and technical validation are allowed:

```bash
git status --short --branch
git rev-parse HEAD
node tools/experiments/validate-blunder-misvaluation-stage1-spec.js
node test/blunder-misvaluation-stage1-contract.test.js
node test/blunder-misvaluation-stage1-tooling.test.js
node tools/experiments/run-blunder-misvaluation-stage1-exploratory.js --phase status
```

The tooling test uses a short non-scientific fixture seed namespace beginning at `99000001`; it does not use `22400001..22402048`.

## 4. Fail-closed authorization gate

The scientific runner requires:

```text
doc/blunder-misvaluation-patterns/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json
```

For any phase other than `status`, the runner loads that file before scientific work. Authorization must bind:

- the exact frozen spec SHA-256;
- the exact source-file SHA-256 map;
- exploratory-only semantics;
- no Stage 2 authorization.

If the file is absent or hashes differ, generation is blocked.

At this checkpoint the authorization file intentionally does not exist.

## 5. Future scientific execution order

Only after tooling validation, source-hash freeze and a separate explicit authorization commit:

```text
generate
→ verify-full-replay-and-search
→ select
→ inspect selection readiness
→ measure
→ inspect measurement readiness
→ discover
```

### Generate

Produces exactly 2,048 games under the frozen seed block and six deterministic generation strata.

### Verify

The independent verifier reconstructs every game from the initial state and seed, recomputes the trajectory AI search, checks exact moves and state identities, and writes `verification.json` only after full success.

### Select

Selection is blocked until full verification passes. It:

1. collapses duplicate historical trajectories;
2. hash-assigns each representative trajectory to Namua or Mtaji;
3. selects one outcome/value-blind root in the assigned phase;
4. performs no unavailable-phase reassignment;
5. collapses duplicate rule states before quota selection;
6. applies frozen quota ranking;
7. takes at most 600 Namua and 600 Mtaji roots.

If a quota or readiness gate fails, Stage 1 becomes non-estimable at that gate. No replacement or seed extension is allowed.

### Measure

Every exact legal `E.moveVariants` move is measured with:

- D1/D2/D3 exact root search;
- D3 domain-aware decision loss and normalized rank loss;
- static post-move `bao` evaluation from the original root actor;
- immediate structural transition;
- all-immediate-reply response envelope;
- frozen failure-token predicates.

D4 and fresh continuation outcomes are not measured.

### Discover

Candidate matchers use only:

```text
phase + 1–2 precondition tokens + move abstraction
```

Failure tokens are excluded from matching and are evaluated over the full outcome-blind matcher denominator. Within one trajectory/matcher, the lexicographically smallest exact `AI.moveKey` is the representative opportunity.

Promotion and candidate caps follow the frozen spec. Manual candidate addition or override is forbidden.

## 6. Source-hash boundary

The authorization source map must include the runner, independent verifier, discovery/corpus helpers, frozen contract helper/spec validator, engine/AI/search/feature dependencies and the exact Stage 1 spec.

Any scientific-source change after authorization invalidates the authorization until a new prospective technical-validation/hash-binding cycle is completed. It does not permit reuse of already generated scientific data under a changed implementation.

## 7. Current firewall

```text
Stage 1 scientific generation authorized = false
Stage 1 scientific games generated = 0
Stage 2 generation authorized = false
formal scientific result = none
```
