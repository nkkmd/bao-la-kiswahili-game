# Position Complexity / Difficulty Study 1 — Hypotheses

更新日: 2026-08-13  
Status: **STAGE 2 FORMAL HYPOTHESES FROZEN / FORMAL CORPUS NOT GENERATED**

Stage 1 exploratory evidence has been consumed and may be used only for prospective Stage 2 design freezing. It is not confirmatory evidence.

Formal machine-readable specification:

```text
doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json
```

Formal protocol:

```text
doc/position-complexity/STAGE_2_FORMAL_PROTOCOL.md
```

## PCX-H1 — Structural branching and depth instability

Status:

```text
PRIMARY FORMAL HYPOTHESIS — FROZEN
```

Scientific statement:

> Structural root branching is associated with tie-aware D2-to-D3 root-optimum instability conditional on Namua/Mtaji phase.

Formal outcome:

```text
D23Instability = 1 iff TopSet_D2 intersect TopSet_D3 is empty
otherwise 0
```

Formal predictor:

```text
log1pLegalMoveCount = log(1 + E.moveVariants(state).length)
```

Population:

```text
one outcome-independent selected state per unique historical trajectory
exact duplicate selected ruleStateKey collapsed
legalMoveCount >= 2
Namua and Mtaji included
```

Covariate:

```text
phaseMtajiIndicator
```

Reduced model:

```text
D23Instability ~ 1 + phaseMtajiIndicator
```

Full model:

```text
D23Instability ~ 1 + phaseMtajiIndicator + log1pLegalMoveCount
```

Formal test:

```text
unpenalized binomial logistic likelihood-ratio test
df = 1
alpha = 0.05
two-sided association
```

Decision:

```text
required gates pass and p < 0.05  -> CONFIRMED
required gates pass and p >= 0.05 -> NOT-CONFIRMED
required technical/estimability gate fails -> INCONCLUSIVE
```

A valid nonsignificant result is not `inconclusive`.

The formal test is two-sided. A positive Stage 1 exploratory direction does not authorize a one-sided Stage 2 test.

## PCX-H2 — Decision ambiguity adds information beyond structure

Status:

```text
KEY SECONDARY FORMAL HYPOTHESIS — FROZEN / GATE-KEPT BY PCX-H1
```

Scientific statement:

> Among states with a finite ordinary-evaluation-domain D2 best-second margin, D2 root-score margin adds information about D2-to-D3 instability beyond structural branching and phase.

Formal ambiguity predictor:

```text
log1pD2BestSecondGap
  = log(1 + D2 bestScore - D2 secondBestScore)
```

Population restriction:

```text
finite ordinary-evaluation-domain D2 margin only
```

Mate-domain and ordinary-domain raw margins are not pooled into one ambiguity scale.

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

Formal test:

```text
unpenalized binomial logistic likelihood-ratio test
df = 1
alpha = 0.05
```

Gatekeeping:

```text
if PCX-H1 CONFIRMED:
  H2 may receive confirmatory status if its own estimability gates pass

if PCX-H1 NOT-CONFIRMED:
  H2 confirmatory status = NOT-CONFIRMATORILY-EVALUATED
```

If H1 is confirmed and H2 gates pass:

```text
p < 0.05  -> SECONDARY-CONFIRMED
p >= 0.05 -> SECONDARY-NOT-CONFIRMED
```

This is an incremental association hypothesis, not causal mediation and not human cognitive difficulty.

## H3 — Structural branching and deterministic search workload

Status:

```text
EXPLORATORY / DESCRIPTIVE IN STUDY 1
```

Stage 1 showed a substantial descriptive association between `legalMoveCount` and `log1p(D3 nodes)`, but no formal Stage 2 H3 test is preregistered.

Allowed after the H1/H2 formal decision is locked:

- legalMoveCount vs nodes;
- other structural features vs deterministic workload;
- quiescence/cutoff/evaluation analyses;
- phase-stratified workload descriptions.

These cannot modify H1/H2.

## H4 — Multiple machine-reproducible layers

Status:

```text
EXPLORATORY ONLY FOR STUDY 1
```

Possible post-formal diagnostics include:

- cross-layer correlation matrix;
- partial associations;
- PCA/factor diagnostics;
- variance partitioning;
- interaction diagnostics.

No exact latent-factor count is a formal Study 1 endpoint.

## H5 — Human difficulty validation

Status:

```text
OUT OF SCOPE FOR STUDY 1
FUTURE INDEPENDENT STUDY
```

Machine search workload, ambiguity or instability is not automatically interpreted as human difficulty.

A separate human/expert validation study would be required for:

- error rate;
- response time;
- candidate generation;
- explanation quality;
- expertise interactions.

## Formal estimability gates

PCX-H1 requires:

```text
selected unique rule states >= 500
Namua selected >= 180
Mtaji selected >= 180
D23 instability events >= 80
D23 stable events >= 80
primary models finite/converged
```

PCX-H2 additionally requires:

```text
ordinary-domain D2 margins >= 350
H2-subset instability events >= 50
H2-subset stable events >= 50
secondary models finite/converged
```

Gate failure is `inconclusive` for the affected hypothesis and never authorizes seed extension or model switching.

## Explicit prohibited rescue targets

Stage 2 may not rescue H1/H2 by:

- redefining legalMoveCount;
- including legalMoveCount=1 roots;
- switching D2->D3 to another depth pair;
- phase-stratified confirmation after global failure;
- adding a phase interaction after outcome inspection;
- changing state-selection salts or replacing unavailable phase assignments;
- mixing mate-domain and ordinary-domain raw margins for H2;
- selecting an alternative ambiguity/structural metric by smaller p-value;
- changing alpha/test family;
- appending games or seeds;
- reusing Stage 1 states/seeds as confirmation.

Closed-study rescue targets remain prohibited as already documented in the Decision Register.
