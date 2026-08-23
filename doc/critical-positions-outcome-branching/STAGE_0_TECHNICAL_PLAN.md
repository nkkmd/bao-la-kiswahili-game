# STAGE_0_TECHNICAL_PLAN — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-23  
Stage ID: `CPOB-S0-DESIGN-2026-08-23-v1`  
Mode: **TECHNICAL ONLY / NO SCIENTIFIC INFERENCE**

## 1. Purpose

Validate the software and measurement contract needed for Stage 1 without consuming the reserved Stage 1/2 scientific source-game seeds or inspecting a scientific continuation-divergence population.

## 2. Fixture policy

Use deterministic fixtures from:

- engine initial/known-rule states constructed explicitly in test code;
- small previously archived states only when used as read-only technical fixtures and not as candidate evidence;
- hand-constructed edge states for Namua house variants, Mtaji capture forcing, terminal transitions and one/many legal moves.

Do not sample a fresh scientific root corpus in Stage 0.

Stochastic fixture tests may use a technical-only deterministic seed derivation from fixture ID / policy ID / replicate index. They do not consume `226...` or `227...` source-game blocks.

## 3. Planned technical library

Proposed new module:

```text
tools/experiments/lib/critical-positions-outcome-branching.js
```

Responsibilities:

- canonical root/move identity;
- root intervention;
- continuation seed derivation;
- frozen policy adapters;
- continuation execution;
- terminal/unfinished encoding;
- root-level measurement summaries;
- structural post-move features;
- response-envelope summaries;
- canonical hashing.

No candidate thresholds should be hard-coded into the low-level executor.

## 4. Planned Stage 0 runner

```text
tools/experiments/run-critical-positions-stage0-smoke.js
```

Outputs only technical audit values under a small fixture bundle. It must mark:

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
scientificSeedConsumed = false
```

## 5. Planned independent verifier

```text
tools/experiments/verify-critical-positions-stage0-smoke.js
```

The verifier should independently:

- reconstruct fixture states;
- enumerate exact legal moveVariants;
- reapply interventions;
- regenerate derived replicate seeds;
- replay every continuation;
- compare move sequences, terminal winner/reason and cap state;
- recompute move-specific win/loss/unfinished counts;
- recompute `D_range` where technically eligible;
- verify no source state mutation;
- verify output hash.

The verifier should not merely re-read primary summary quantities.

## 6. Policy-specific technical tests

### Seeded normal

Verify `AI.analyzeMove(state, "normal", seededRandom(seed), {evaluationProfile:"bao"})`:

- chooses an exact legal variant;
- is deterministic conditional on seed;
- uses only supplied RNG for stochastic pool choice;
- exact replay is stable.

### Seeded D2-ranked top-3

If implemented, verify:

- exact D2+Q1 table from the validated diagnostic;
- deterministic score-descending / `moveKey` ordering;
- pool exactly first `min(3,n)`;
- supplied RNG chooses only within pool;
- no wall-clock timeout (`timeLimitMs`-style behavior is not part of exact diagnostic);
- independent verifier recomputes candidate tables.

### Uniform exact legal

Verify seeded uniform indexing over `E.moveVariants` and exact replay.

## 7. Root identity tests

Validate distinct roles of:

```text
historical state identity
ruleStateKey
historicalTrajectoryHash
openingPrefixHash
root actor
root ply
```

Do not substitute `AI.stateKey` for historical trajectory identity; it is a search state key and intentionally omits some history.

## 8. Exact move identity tests

Include fixtures where Namua capture house-choice variants differ. Verify all exact variants have distinct measurement rows where `AI.moveKey` distinguishes them.

Audit the engine legality check carefully because `engine.sameMove` does not itself compare `houseChoice`; `moveVariants` expands house-choice semantics and `AI.moveKey` records them. Stage 0 must confirm that explicit intervention replay preserves the intended exact variant behavior.

## 9. Terminal tests

Cover at least:

- `front-empty` winner;
- `no-move` winner;
- relay-limit terminal if a deterministic fixture can reach it;
- Namua→Mtaji phase change;
- administrative continuation cap without native winner.

Administrative cap must remain nonterminal evidence category.

## 10. Replicate-seed tests

Proposed canonical derivation contract:

```text
seed32 = first 32 bits of SHA-256(
  stageSalt | rootRuleStateKey | rootActor | replicateIndex
)
```

Requirements:

- stage-specific salt;
- same seed32 for all legal root moves at one root/replicate index;
- fresh RNG instance per move;
- distinct replicate indexes produce distinct seed32 in fixture suite;
- derivation recorded in output schema.

## 11. Runtime / precision benchmark

Technical-only benchmark grid:

```text
policy ∈ {P1, P2, P3}
R ∈ {32, 48, 64}
small fixed fixture set
```

Record:

- continuation plies;
- terminal completion;
- node/search counters when applicable;
- wall-clock only as feasibility metadata;
- bytes per continuation/root measurement;
- projected Stage 1 measurement volume.

Do not publish or use fixture `D_range` as scientific evidence.

## 12. Stage 0 pass conditions

Stage 0 can close only after:

- root intervention exactness PASS;
- supplied-seed replay PASS;
- winner/unfinished encoding PASS;
- paired replicate derivation PASS;
- policy selection frozen by technical criteria only;
- exact R and continuation cap frozen;
- runtime/artifact feasibility PASS;
- independent verifier full recomputation PASS;
- candidate grammar / numeric discovery gates frozen;
- Stage 1 spec validator exists;
- no Stage 1 scientific seed consumed.

Only then may a separate source-bound Stage 1 authorization be considered.
