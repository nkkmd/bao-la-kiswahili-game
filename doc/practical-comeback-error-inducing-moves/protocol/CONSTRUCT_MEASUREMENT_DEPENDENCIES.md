# PCEM-STUDY1 — Construct / Measurement Dependency Audit

Frozen at research start: 2026-08-25.

This document identifies what must be measurable before Stage 1 and prevents circular definitions.

## 1. Root disadvantage

The disadvantaged-root rule must not use the unvalidated Position Evaluation / Win-Rate Calibration Study 1 isotonic mapping.

The preferred design family is a **fresh reference-search definition**, computed before continuation outcomes are inspected. Candidate implementation:

```text
reference search = exact full-window all-root-move search
actor perspective = player to move at root
phase = Namua / Mtaji handled separately
eligibility = nonterminal, >= 2 exact legal root moves, valid RAW state
selection = prospectively frozen negative/low reference-score rule with phase-specific quotas
```

A relative rank/quantile rule may be used if an absolute score threshold is not technically stable across phase, but the exact rule must be frozen before Stage 1 outcome inspection. If the required disadvantaged support is not available, the corresponding phase is `NON-ESTIMABLE`; the rule is not relaxed post outcome.

## 2. Strong/reference comparator

A reference comparator is needed for both move quality and reply quality. It must be deterministic given state and frozen configuration, with full-window exact legal-move enumeration where feasible.

Preferred reference family:

```text
search profile = phase2
level = hard
fixed depth = prospectively frozen after Stage 0 resource profiling
fixed evaluation profile = bao
finite/infinite time behavior = deterministic and frozen
root move ranking = all exact legal moves, explicit tie handling
```

The reference search is an instrument, not game-theoretic truth.

## 3. Move optimality gap

For root `s`, move `m`, and reference score `V_ref(s,m)`:

```text
bestRef(s) = max_m V_ref(s,m)
optimalityGap(s,m) = bestRef(s) - V_ref(s,m)
```

Exact score normalization, tie epsilon if any, and whether formal candidates must be strictly non-best or may include tied/near-best moves must be frozen before Stage 1.

This quantity cannot be described as true decision loss.

## 4. Comeback endpoint

The primary comeback endpoint must be newly measured in PCEM-STUDY1.

Preferred endpoint family:

```text
bounded-horizon comeback = 1
iff the disadvantaged root actor reaches a terminal win
within H post-root plies under the frozen continuation policies;
otherwise 0 for that bounded-horizon endpoint.
```

Terminal loss, engine draw if explicitly represented, and administrative horizon exhaustion must still be separately counted. A horizon-exhausted replicate is not silently dropped. This keeps the primary estimand as a bounded-horizon policy-conditioned frequency rather than an unbounded true winning probability.

The exact horizon `H` must be frozen before Stage 1.

## 5. Opponent policy

The opponent policy is part of the estimand and may not be selected after observing which condition produces the largest effect.

At minimum two roles are required:

```text
P-reference = strong/reference policy used as robustness comparator
P-primary-imperfect = prospectively frozen imperfect policy used for the primary practical-comeback endpoint
```

Additional opponent strengths may be secondary or co-primary only if frozen in advance with multiplicity handling.

A technically attractive primary imperfect policy is a reproducibly seeded existing engine policy with explicit RNG binding, because it permits exact rerun of first-reply choices and continuations. Stage 0 must confirm its determinism conditional on state+seed and its policy semantics before it is frozen for Stage 1.

## 6. First-reply semantics

After root move `m`, let `R(s,m)` be the exact legal opponent first-reply set.

The study must distinguish:

```text
uniqueLegalReply      = |R| == 1
referenceBestReplies  = replies attaining the frozen reference-best value
successfulDefenseSet  = replies meeting the prospectively frozen defense-success rule
```

These sets may differ.

## 7. Successful defense

A defense-success rule is required to measure narrowness and opponent error without circularly defining defense from the same noisy imperfect-policy outcome that is being explained.

Preferred hierarchy:

1. if a valid exact oracle applies to the exact state inside its frozen authorized domain, exact value may be used only within that domain;
2. otherwise use a prospectively frozen reference-policy / reference-search criterion;
3. never extrapolate the 8-state restricted endgame oracle beyond its frozen domain.

Candidate machine-operational definitions include:

```text
reference-continuation prevention of root-actor bounded-horizon win
or
reference reply value meeting a predeclared adequacy threshold relative to the best reply
```

The exact choice and threshold must be frozen before Stage 1 outcomes.

## 8. Reply narrowness

Primary structural narrowness should remain directly interpretable. Preferred raw measures:

```text
legalReplyCount = |R|
defensiveReplyCount = |D|
defensiveReplyFraction = |D| / |R|
uniqueSuccessfulDefense = (|D| == 1)
noSuccessfulDefense = (|D| == 0)
```

A derived machine-operational difficulty index may be defined as:

```text
1 - defensiveReplyFraction
```

only if prospectively frozen. It must not be called human difficulty.

## 9. Opponent-error dependence

For the primary imperfect opponent policy, an opponent first-reply error can be defined prospectively as:

```text
firstReplyError = selected first reply not in successfulDefenseSet
```

Policy-conditioned error dependence should be measured with quantities such as:

```text
observed first-reply error rate
comeback frequency conditional on error vs successful defense
comeback-frequency difference between P-primary-imperfect and P-reference
share of comeback replicates whose first reply is outside successfulDefenseSet
```

The exact primary/co-primary choice must be frozen before Stage 1.

## 10. Punishment concentration

Punishment concentration describes how strongly continuation outcome is concentrated on the opponent missing a small defense set. Candidate predeclared measures include:

```text
P(comeback | first-reply error) - P(comeback | successful defense)
policy mass outside successfulDefenseSet
entropy / concentration of first-reply selections, if the policy distribution is identifiable
```

No post-outcome metric shopping is allowed.

## 11. Paired move comparison within root

Because all legal root moves share the same root, the core practical-vs-reference comparison should be root-paired.

For a candidate practical move `m_p` and reference-best comparator `m_b`:

```text
DeltaComeback = p_hat_imperfect(s,m_p) - p_hat_imperfect(s,m_b)
DeltaReference = V_ref(s,m_p) - V_ref(s,m_b) <= 0 for a non-best practical move
```

Common replicate seeds should be bound by root and replicate index across root moves where the stochastic policy permits this, reducing Monte Carlo noise without pretending replicates are independent roots.

## 12. Identifiability gates

A root/move is not primary-estimable unless all required measurements are available and validated, including:

```text
valid raw identity
complete exact legal root move set
successful root move application
complete opponent first-reply set
finite reference move/reply values where required
planned continuation replicate accounting
no silent seed or policy substitution
```

A phase/study may become `NON-ESTIMABLE`, `RESOURCE-CENSORED`, or `TECHNICALLY-INVALID`; these are not negative scientific results.
