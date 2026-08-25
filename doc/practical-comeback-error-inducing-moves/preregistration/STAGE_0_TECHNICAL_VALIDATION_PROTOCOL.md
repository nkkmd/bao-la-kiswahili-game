# PCEM-STUDY1 — Stage 0 Technical / Construct Validation Protocol

Status: **PROSPECTIVE SKELETON / NOT YET EXECUTED**  
Frozen role: technical-only.

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

## Objective

Stage 0 establishes whether the planned PCEM measurement system is technically reproducible and computationally feasible without generating a scientific candidate-prevalence or comeback-effect conclusion.

## Required technical checks

### T0-1 — RAW representation validation

For every test state before engine entry:

- exact identity fields are `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`;
- `pending` is present;
- `turn` and `reason` are excluded from identity;
- `sum(pits) + sum(reserve) + sum(pending) = 64`;
- production and independent serializer hashes agree.

### T0-2 — Exact legal root-move enumeration

Production and independent implementations must enumerate the same exact legal root move identities and cardinality.

### T0-3 — Root move application

For each technical test move, production and independent application must agree on raw successor state and seed conservation.

### T0-4 — First-reply enumeration

After the exact root move, production and independent implementations must enumerate the same complete opponent first-reply set.

### T0-5 — Reference-search reproducibility

The candidate reference-search configuration must be deterministic for the same raw state and must return reproducible all-legal-move scores/ranks, including explicit tie handling.

Stage 0 may compare feasible fixed depths/configurations for runtime and determinism. It may not select a configuration because it produces a preferred scientific effect.

### T0-6 — Imperfect-policy seedability

The candidate primary imperfect policy must be reproducible conditional on state + supplied RNG seed. Verify:

- same first reply for same state/seed;
- same continuation for same root/move/replicate binding;
- changed seed can change stochastic choices when the policy is genuinely stochastic;
- no hidden wall-clock/adaptive behavior changes the policy.

### T0-7 — Continuation outcome accounting

Every planned replicate must end in exactly one recorded accounting class:

```text
root-actor terminal win
root-actor terminal loss
explicit draw if engine represents one
administrative horizon exhaustion
technical invalidity
```

No replicate may disappear from the denominator silently.

### T0-8 — Common-random-number binding

Where supported, verify a deterministic binding such as:

```text
continuationSeed = H(stageSeed, rootRawHash, replicateIndex)
```

and reuse the same replicate-index seed across alternative root moves from the same root. Exact hashing/seed algorithm must be frozen before Stage 1.

### T0-9 — Successful-defense identifiability

Test whether the preferred reference criterion can classify every legal first reply into a prospectively definable machine-operational defense category without using the primary imperfect-policy outcome as the classifier itself.

If not identifiable, Stage 1 must not proceed until a non-circular rule is prospectively frozen.

### T0-10 — Independent verifier feasibility

The independent verifier must not import the production serializer, candidate classifier, formal runner or aggregation code. It must independently recompute at least:

```text
raw identity
seed conservation
legal root moves
root move successor
legal first replies
reference reply values/category when required
continuation outcome accounting
root/move/replicate binding
aggregate counts
artifact hashes
```

### T0-11 — Resource profiling

Measure technical runtime/RSS/artifact-size scaling for bounded pilot workloads only. The pilot must not be used to estimate scientific prevalence/effect.

Freeze before Stage 1:

```text
maximum source games
maximum selected roots
maximum exact root-move interventions
maximum continuation replicates per move
maximum post-root horizon
maximum reference-search work
maximum wall clock
maximum RSS
maximum artifact size
```

### T0-12 — Failure vocabulary

Technical failures must map to explicit states such as:

```text
TECHNICALLY-INVALID
RESOURCE-CENSORED
NON-ESTIMABLE
```

They may not be translated into a scientific negative result.

## Stage 0 pass rule

`TECHNICAL-PASS` requires all mandatory representation, legal-move, move-application, reply-enumeration, seedability, accounting and independent-verifier checks to pass, plus a resource envelope that permits a prospectively frozen Stage 1 design.

If any mandatory check fails, Stage 1 remains `NOT-AUTHORIZED-NOT-EXECUTED` until a new prospective technical version is frozen. Scientific outcomes from failed technical runs are unusable.

## Prohibited Stage 0 outputs

Stage 0 must not report or optimize:

- proportion of practical-comeback candidates;
- phase difference in candidate prevalence;
- effect size for comeback probability;
- best opponent strength for producing separation;
- favorable reply-difficulty threshold;
- a Stage 1 promotion grammar derived from observed scientific outcomes.
