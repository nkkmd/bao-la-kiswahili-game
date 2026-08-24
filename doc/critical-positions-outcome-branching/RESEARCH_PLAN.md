# RESEARCH_PLAN — Critical Positions / Outcome Branching Study 1

Updated: 2026-08-23

## 1. Scientific question

Can Bao root states be prospectively classified into reproducible structural classes for which exact legal-move intervention produces materially different **fixed-policy empirical continuation outcomes**, while keeping search values, structural transitions, game-theoretic value and human importance as distinct constructs?

## 2. Study independence

This is a new prospective independent study. Completed-study formal decisions, candidate labels, thresholds, null/inconclusive results and interpretation boundaries are immutable historical evidence.

Historical corpora may be read for design provenance and technical fixtures only. They are not fresh Stage 1/2 confirmation evidence.

## 3. Three-stage architecture

### Stage 0 — construct / technical / feasibility audit

No scientific corpus generation.

Audit and validate:

- exact root identity and root actor perspective;
- exhaustive exact legal moveVariants;
- exact root-move intervention replay;
- continuation RNG injection and deterministic replay by seed;
- continuation policy semantics;
- terminal winner / administrative unfinished handling;
- paired/common-random-number replicate design;
- search-value diagnostic reuse;
- structural feature extraction before/after root move;
- response-envelope extraction;
- runtime and artifact size;
- independent continuation remeasurement feasibility;
- authorization firewall.

### Stage 1 — fresh exploratory discovery

Reserved source-game seed block:

```text
22600001..22603072
3072 games maximum / no within-version extension
```

Before any Stage 1 scientific generation, freeze exact game count (currently reserved as the full 3072), generation strata, root budget, continuation policy, replicate count, max continuation length, outcome encoding, primary statistic, criticality floor, candidate grammar, binning, support/diversity gates, ranking/caps, artifact schema, source hashes and authorization.

Recommended execution firewall:

```text
generate source trajectories
→ independent full replay verification
→ outcome/value-blind root selection
→ continuation measurement across all exact legal root moves
→ independent continuation replay/remeasurement
→ exploratory candidate discovery
```

Stage 1 candidate matching may use only frozen pre-root structural tokens. The high-divergence outcome may not define its own matcher denominator.

### Stage 2 — fresh prospective formal confirmation

Reserved seed block:

```text
22700001..22706144
6144 games maximum / no within-version extension
```

This block is deliberately larger than Stage 1 to provide prospective allowance for cross-stage identity attrition and candidate-specific support loss. Reservation is not authorization.

Stage 2 must enforce zero final Stage 1 overlap on the required identity firewall and must not use replacement sampling or seed extension after attrition is observed.

## 4. Root population and statistical unit

Preferred design:

- nonterminal root;
- at least two exact legal moveVariants for primary criticality measurement;
- collapse duplicate `historicalTrajectoryHash` source games;
- outcome-independent phase assignment when one-root-per-trajectory sampling is used;
- at most one primary selected root per historical trajectory;
- collapse exact duplicate selected `ruleStateKey` without replacement;
- preserve opening prefix and generation-stratum provenance.

Primary inferential/support unit:

```text
root sampled from a unique historical trajectory
```

Nested quantities:

```text
move-level estimates ⊂ root
continuation replicates ⊂ root × move
opening-prefix dependence ⊂ generated population
generation-stratum dependence ⊂ generated population
```

No count of move records or replicate games may be reported as independent root sample size.

## 5. Continuation intervention

For every selected root, measure every exact legal moveVariant. Distinct Namua house variants remain distinct.

The root move is externally fixed. After applying it, the remaining play follows one frozen stochastic policy. The random stream for replicate `r` is reinitialized for every legal root move using the same root/replicate seed derivation, producing a paired common-random-number design.

Derived continuation RNG values are not independent source-game seeds and do not enlarge the scientific root sample.

## 6. Outcome encoding

Current engine terminal winner is a player index. A max-continuation stop is administrative truncation, not a draw and not a loss.

Planned categories:

```text
ROOT_ACTOR_WIN
ROOT_ACTOR_LOSS
ADMINISTRATIVE_UNFINISHED
```

The primary binary win-rate statistic is eligible only under a prospectively frozen per-move/root completion gate. Unfinished outcomes are never silently recoded to 0.5, win or loss.

## 7. Primary and secondary measurements

Primary:

```text
move-specific empirical continuation win rates
D_range = max - min across exact legal root moves
```

Secondary, separate axes:

- best-vs-second empirical outcome separation;
- dispersion / entropy-like summaries of move-specific empirical outcomes;
- probability of majority continuation-winner change across moves;
- exact D3+Q1 search-value separation;
- D2→D3 TopSet instability;
- immediate post-move structural divergence;
- all-reply response-envelope divergence.

No engine score is passed through the exploratory Calibration Study isotonic mapping for formal use.

## 8. Candidate discovery grammar

Before Stage 1 generation, freeze a structural matcher grammar of the form:

```text
phase
+ 1–2 pre-root structural condition tokens
(+ optional move-choice-set structural token only if it is outcome-independent)
```

Candidate outcome is high continuation divergence; it is not part of the matcher.

Candidate grammar will be limited to rule/board quantities such as legal/capture branching, forced-capture status, front-row occupancy/connections, reusable pits, reserve/nyumba state and other validated raw structural features. Historical BMP candidate IDs, exploratory N-ACT/N-CON and unvalidated human labels are not promoted as formal matcher tokens.

Use deterministic support-equivalence handling and fixed maximum candidate caps. Manual promotion is forbidden.

## 9. Identity firewall

Stage 2 final formal roots must have zero Stage 1 overlap on:

```text
historicalTrajectoryHash
openingPrefixHash
ruleStateKey
```

`seatCanonicalKey` may be reported as a structural-equivalence audit but is not currently a mandatory exclusion axis because cross-position structural recurrence is itself a target of the study.

## 10. Estimability risk

Calibration Study 1 showed that strict identity exclusion can remove enough support to invalidate formal inference. Therefore Stage 2 is reserved at twice the Stage 1 source-game capacity. Exact candidate-specific minimum support and attrition allowances must be fixed before Stage 2 generation.

No post-hoc replacement of excluded roots is allowed.

## 11. Formal confirmation requirements

Before Stage 2 generation freeze:

- exact Stage 1 candidate mapping;
- candidate support groups;
- fresh population;
- exact seed range/game count;
- generation conditions;
- root selection;
- continuation policy and replicate count;
- primary endpoint and absolute effect floor;
- candidate estimability/diversity gates;
- multiplicity family and alpha;
- formal labels;
- no-rescue rules;
- independent verification order;
- interpretation boundary;
- source-hash-bound authorization.

Possible formal labels:

```text
CONFIRMED
NOT-CONFIRMED
INCONCLUSIVE-NOT-ESTIMABLE
TECHNICAL-INCONCLUSIVE
```

Zero confirmed candidates is valid.

## 12. No-rescue principle

Once a scientific stage starts, do not alter it by seed extension, replacement sampling, identity-overlap replacement, replicate extension triggered by results, matcher editing, threshold relaxation, endpoint/policy/evaluator substitution, phase reassignment, favorable subgroup promotion, alpha/multiplicity changes or manual override.
