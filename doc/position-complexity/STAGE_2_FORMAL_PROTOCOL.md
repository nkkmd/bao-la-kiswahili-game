# Position Complexity / Difficulty Study — Stage 2 Formal Protocol

更新日: 2026-08-13  
Stage ID: `PCX-S2-FORMAL-2026-08-13-v1`  
Status: **FORMAL DESIGN FROZEN / CORPUS GENERATION STILL LOCKED PENDING TOOL VALIDATION**

Machine-readable preregistration:

```text
doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json
```

## 1. Purpose

Stage 2 is the fresh held-out confirmatory stage for the prospective Position Complexity / Difficulty Study 1.

It tests two questions that were already identified before Stage 1 outcome inspection:

1. whether structural root branching is associated with D2->D3 root decision instability;
2. if the primary association is confirmed, whether ordinary-domain D2 decision ambiguity adds information beyond branching and phase.

Stage 1 was exploratory and is permanently consumed. No Stage 1 state, seed or measured outcome is part of Stage 2 formal evidence.

## 2. Immutable inherited boundaries

Stage 2 does not reopen any closed study.

The following remain immutable:

- phase-transition Study 1 formal decisions;
- bounded meaning of `capture-branch-expansion`;
- MTAJI-M1/MTAJI-M2 bounded morphology only;
- no discrete Namua type;
- N-ACT/N-CON exploratory status;
- unsupported discrete playing-style clustering;
- STYLE-C1..C4 formal not-confirmed result;
- Namua->Mtaji Study 1 formal `NOT-CONFIRMED` result;
- deterministic first-Mtaji clock boundary.

None of these labels enters the Stage 2 primary model.

## 3. Fresh formal corpus

Fixed generation:

```text
games = 1024
seeds = 20410001..20411024
opening = 8 plies seeded-uniform over E.moveVariants(state)
then = hard / bao / phase2 / depth2
quiescenceDepth = 1
timeLimitMs = Infinity
adaptive = false
max ply = 100
```

No Stage 1 seed is reused.

No:

- early stop;
- outcome-dependent extension;
- seed replacement;
- favorable reseeding;
- post-inspection game append;
- GitHub Actions large-corpus generation.

The formal corpus must be generated locally under a dedicated Stage 2 artifact root.

## 4. Trajectory and state sampling

The pseudoreplication strategy is frozen before formal generation.

### 4.1 Historical trajectory collapse

Collapse identical `historicalTrajectoryHash` groups before state selection.

Representative:

```text
minimum seed, then gameId
```

### 4.2 Outcome-independent phase assignment

For each unique historical trajectory:

```text
sha256("PCX-S2-PHASE-v1|" + historicalTrajectoryHash)
even -> Namua
odd  -> Mtaji
```

### 4.3 Eligible state population

Within the assigned phase:

```text
nonterminal
ply >= 8
E.moveVariants(state).length >= 2
```

The last condition permanently excludes mechanically single-choice roots from the primary decision-instability population.

### 4.4 One state per trajectory

Choose exactly one eligible state by minimum SHA-256 rank over:

```text
salt = PCX-S2-STATE-v1
historicalTrajectoryHash | ruleStateKey | ply
```

If the assigned phase has no eligible state:

```text
no replacement
```

If multiple selected historical trajectories yield the same exact `ruleStateKey`, retain one by the frozen representative rule rather than counting identical deterministic states independently.

No search score, instability result, ambiguity margin, CBE label, morphology label or winner enters selection.

## 5. Fixed formal measurement

Only the depths needed by the formal hypotheses are measured:

```text
D2
D3
```

Frozen search semantics:

```text
exact-full-window-root-candidates/phase2-value-semantics/v1
```

At both depths:

```text
evaluationProfile = bao
searchProfile = phase2
quiescenceDepth = 1
orderQuiescenceCaptures = false
timeLimitMs = Infinity
adaptive = false
stableBestDepths = 0
aspirationWindow = 0
```

At every selected state/depth the diagnostic value must cross-check against the normal engine:

```text
exact diagnostic bestScore == engine rootScore
engine selected move belongs to exact TopSet
```

A failure is technical invalidity, not a scientific result.

## 6. Primary hypothesis — PCX-H1

Scientific statement:

> Structural root branching is associated with tie-aware D2-to-D3 root-optimum instability conditional on Namua/Mtaji phase.

Outcome:

```text
D23Instability = 1 iff TopSet_D2 intersect TopSet_D3 is empty
otherwise 0
```

Primary structural predictor:

```text
log1pLegalMoveCount = log(1 + E.moveVariants(state).length)
```

Phase context:

```text
phaseMtajiIndicator = 1 for Mtaji, 0 for Namua
```

Reduced model:

```text
logit P(D23Instability=1)
  = beta0 + beta_phase * phaseMtajiIndicator
```

Full model:

```text
logit P(D23Instability=1)
  = beta0
  + beta_phase * phaseMtajiIndicator
  + beta_legal * log1pLegalMoveCount
```

Formal test:

```text
unpenalized binomial logistic likelihood-ratio test
LR = 2 * (logLik_full - logLik_reduced)
df = 1
reference = chi-square(1)
alpha = 0.05
two-sided association claim
```

Formal H1 decision does not depend on the sign seen in Stage 1.

Report:

- beta for `log1pLegalMoveCount`;
- `exp(beta)`;
- reduced/full log likelihoods;
- LR statistic;
- p-value;
- event/stable counts;
- phase counts.

## 7. Key secondary hypothesis — PCX-H2

Scientific statement:

> Among states with a finite ordinary-evaluation-domain D2 best-second margin, D2 root-score margin adds information about D2-to-D3 instability beyond structural branching and phase.

Ambiguity predictor:

```text
log1pD2BestSecondGap
  = log(1 + D2 bestScore - D2 secondBestScore)
```

Population restriction:

```text
finite ordinary-evaluation-domain D2 best-second margin only
```

Do not mix raw mate-domain and ordinary-domain margins into one scale.

Reduced model:

```text
D23Instability
  ~ 1 + phaseMtajiIndicator + log1pLegalMoveCount
```

Full model:

```text
D23Instability
  ~ 1 + phaseMtajiIndicator
    + log1pLegalMoveCount
    + log1pD2BestSecondGap
```

Test:

```text
unpenalized binomial logistic likelihood-ratio test
df = 1
alpha = 0.05
```

### Gatekeeping

H2 receives a confirmatory label only when PCX-H1 is formally confirmed.

If H1 is not-confirmed:

```text
H2 confirmatory status = not-confirmatorily-evaluated
```

H2 may still be computed for completeness, but it cannot be promoted as a confirmed secondary finding.

This hierarchical gatekeeping keeps the formal claim family bounded without searching over multiple candidate metrics.

## 8. Formal estimability gates

Before scientific decisions, all applicable gates must be checked.

Primary gates:

```text
selected unique rule states >= 500
Namua selected states >= 180
Mtaji selected states >= 180
D23 instability events >= 80
D23 stable events >= 80
primary reduced/full models finite and converged
```

H2 gates:

```text
ordinary-domain D2 margins >= 350
H2-subset D23 instability events >= 50
H2-subset D23 stable events >= 50
secondary reduced/full models finite and converged
```

Gate failure is not a negative scientific result.

It yields:

```text
INCONCLUSIVE
```

for the affected formal decision.

A valid nonsignificant H1 test is **not** inconclusive. It is `not-confirmed`.

## 9. Fixed game-count rationale

Stage 1 planning observations were:

```text
selected state rate = 666/768 = 0.8672
D23 event rate among selected = 162/666 = 0.2432
ordinary D2 margin rate among selected = 510/666 = 0.7658
```

Applying those rates only as a planning projection to 1024 games gives approximately:

```text
selected unique states ~ 888
D23 instability events ~ 216
D23 stable events ~ 672
ordinary-domain D2 margins ~ 680
```

These are not guaranteed counts and are not formal evidence.

The actual Stage 2 fixed stopping rule remains exactly 1024 games even if the observed counts are unexpectedly favorable or unfavorable.

## 10. Formal decision vocabulary

### H1

If technical/estimability gates pass:

```text
p < 0.05  -> PCX-H1 CONFIRMED
p >= 0.05 -> PCX-H1 NOT-CONFIRMED
```

If required gates fail:

```text
PCX-H1 INCONCLUSIVE
```

### H2

Only if H1 is confirmed and H2 gates pass:

```text
p < 0.05  -> PCX-H2 SECONDARY-CONFIRMED
p >= 0.05 -> PCX-H2 SECONDARY-NOT-CONFIRMED
```

If H1 is not-confirmed:

```text
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

## 11. Prohibited rescue

After Stage 2 generation or outcome inspection, do not:

- redefine `legalMoveCount`;
- include legalMoveCount=1 roots;
- replace TopSet-disjoint D2->D3 instability;
- switch to D1->D2 or D3->D4 as primary;
- change the phase covariate/model family;
- add a phase interaction to rescue H1;
- perform phase-stratified confirmation after global failure;
- change state-selection salts;
- replace unavailable assigned-phase trajectories;
- mix mate-domain and ordinary-domain gaps for H2;
- substitute another ambiguity metric because it has a smaller p-value;
- change alpha;
- append games/seeds;
- reuse Stage 1 positions or seeds;
- relabel a valid nonsignificant result as inconclusive;
- interpret a favorable descriptive direction as confirmation after a failed formal test.

## 12. Exploratory analyses after formal decision

Only after the formal decision is locked may additional analyses be labeled exploratory, including:

- phase-stratified descriptive effects;
- phase interactions;
- alternative structural variables;
- search-workload associations;
- D1->D2 or D3->D4 instability if separately measured/recomputed;
- effect plots and calibration summaries;
- broader multilayer/PCA diagnostics.

They may not modify the formal H1/H2 decisions.

## 13. Current authorization state

This protocol freezes the scientific design, but **does not yet authorize corpus generation**.

Before Stage 2 generation, the repository must additionally contain:

1. a dedicated formal runner implementing this exact spec;
2. an independent full verifier;
3. a formal analyzer implementing the frozen models/decision rules;
4. technical unit/smoke tests;
5. successful technical CI;
6. frozen source/tool hashes;
7. an explicit formal-generation authorization record.

Until then:

```text
Stage 2 design = FROZEN
Stage 2 generation = LOCKED
```
