# Stage 1 Final Exposure-Support Extension Protocol

更新日: 2026-08-11  
Status: **FROZEN BEFORE GENERATION / exploratory-only / final exposure-driven extension**

## 1. Purpose

This protocol defines the final additional Stage 1 corpus for the independent Namua→Mtaji temporal-transition study.

Its sole purpose is to determine whether the frozen `capture-branch-expansion` exposure occurs often enough to support a later Stage 2 formal design.

It is not a confirmatory experiment and cannot be reused as formal evidence.

## 2. Why one final extension is justified

The completed primary pilot plus extension #1 provide:

```text
combined unique Namua CBE trajectory-ply units = 5
combined unique CBE historical trajectories = 5
```

The prespecified Stage 2 design-readiness minimum remains unchanged:

```text
unique CBE trajectory-ply units >= 10
unique CBE historical trajectories >= 8
```

Thus the fixed readiness minimum is not met.

However, comparator feasibility is now established across all observed CBE clock positions. The strict R3 risk-set family retained 331–334 unique same-condition control trajectories per observed exposure-condition at plies 24/26/27, and the primary pilot retained 31 at ply 33.

Therefore the remaining design bottleneck is exposure rarity, not comparator scarcity.

## 3. Planning-rate heuristic

Extension #1 observed:

```text
4 unique CBE trajectory-ply units / 384 paired openings
```

For corpus-size planning only, this corresponds to a simple plug-in rate of approximately:

```text
0.0104 unique CBE units per paired opening
```

A final block of 768 paired openings therefore has an expected count of roughly 8 additional units if that exploratory rate were stable.

Under a simple independent-binomial plug-in approximation, 768 paired openings give approximately 90% probability of observing at least 5 additional units, the current unit-count deficit.

This calculation is **not** a power analysis, not an inference about true CBE prevalence, and not a decision threshold. The rate estimate is noisy and trajectory/condition duplication exists.

## 4. Fixed final corpus

```text
conditions = 2
paired opening replicates = 768
total games = 1536
opening plies = 8
max ply = 100
```

Conditions remain:

```text
P2-D2 = hard / bao / phase2 / depth2
V2-D2 = hard / bao-v2 / phase2 / depth2
```

No condition was selected using Mtaji morphology outcomes.

## 5. Fresh seed block

```text
base opening seed = 20273001
opening seeds = 20273001..20273768
```

This block is disjoint from:

```text
primary pilot: 20271001..20271032
extension #1: 20272001..20272384
```

The final block is permanently consumed exploratory data after generation.

## 6. Frozen inherited definitions

No changes are authorized.

Category-A candidacy:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing signals = reserve / mobility / capture / front
```

Frozen CBE classifier:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Classifier precedence remains unchanged.

The fixed first-Mtaji morphology classifier remains the previously confirmed frozen artifact; no refit, restandardization, or relabeling is authorized.

## 7. Outcome-blind generation boundary

Before the final support gate is run, the final extension may be used only to audit:

- replay/provenance validity;
- deterministic Namua clock;
- inherited Category-A candidacy;
- frozen phenotype class counts;
- unique CBE trajectory-ply support;
- candidate-ply distribution;
- trajectory duplication/multiplicity;
- exact-ply R0–R3 comparator support.

Forbidden before Stage 2 design freeze:

- CBE-vs-control M1/M2 effect comparison;
- outcome-selected comparator choice;
- p-values for a CBE effect;
- effect-direction selection;
- model selection based on morphology contrast.

## 8. No early stopping

All 768 paired openings / 1536 games must be generated unless a technical invalidation occurs.

Not authorized:

- stopping after 10 CBE units appear;
- stopping after 8 CBE-bearing trajectories appear;
- stopping based on morphology labels;
- enlarging/reducing the block after inspecting partial scientific output.

Technical interruption/resume is allowed.

## 9. Final readiness gate — unchanged

After combining:

```text
primary pilot
+ extension #1
+ final extension
```

Stage 2 design-readiness requires both:

```text
unique Namua CBE historicalTrajectoryHash + candidatePly units >= 10
unique CBE-bearing historical trajectories >= 8
```

The deduplication key remains:

```text
historicalTrajectoryHash + candidatePly
```

Identical complete historical trajectories under multiple condition labels are not independent replications.

## 10. Terminal stopping rule

This is the **final exposure-driven Stage 1 extension**.

After its full fixed corpus is generated and audited:

### If the readiness gate passes

Proceed to Stage 2 design freeze, but only after the final extension-wide exact-ply risk-set audit confirms comparator support across any newly observed CBE clock locations.

### If the readiness gate fails

Do **not** generate another exposure-targeted Stage 1 block under the same frozen CBE definition and P2-D2/V2-D2 condition family merely to reach the numerical gate.

Instead conclude:

> the prospective CBE→Mtaji formal bridge is not design-ready under the current frozen exposure definition and studied condition family.

Any later research would require a separately justified research redesign, not post-hoc threshold relaxation or continued sample-to-threshold extension.

## 11. Interpretation boundary

This protocol does not alter any closed-study result, historical classifier, threshold, morphology definition, deterministic-clock conclusion, or prior null/not-confirmed result.

It freezes only a final exploratory exposure-support corpus and the stopping rule that follows it.