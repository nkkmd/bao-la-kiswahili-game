# Position Complexity / Difficulty Study 1 — Hypotheses

更新日: 2026-08-14  
Status: **STUDY 1 CLOSED / FINAL HYPOTHESIS DECISIONS**

This document records the final status of the prospectively defined Study 1 hypotheses.

## PCX-H1 — Structural branching and D2→D3 instability

Scientific statement:

> Structural root branching is associated with tie-aware D2-to-D3 root-optimum instability conditional on Namua/Mtaji phase.

Frozen formal outcome:

```text
D23Instability = 1 iff TopSet_D2 intersect TopSet_D3 is empty
```

Frozen predictor/covariate:

```text
log1pLegalMoveCount = log(1 + E.moveVariants(state).length)
phaseMtajiIndicator
```

Frozen comparison:

```text
reduced: D23Instability ~ 1 + phase
full:    D23Instability ~ 1 + phase + log1pLegalMoveCount
unpenalized binomial logistic likelihood-ratio test
df = 1
alpha = 0.05
two-sided
```

Stage 2 count/coverage gates passed, but the full model failed the preregistered convergence gate because BFGS returned precision loss.

Computed quantities retained for transparency:

```text
beta_log1pLegalMoveCount = +0.3818030009
OR = 1.4649234681
LR = 2.9350451603
p = 0.0866762390
```

Final decision:

```text
PCX-H1 = INCONCLUSIVE
```

This is not `not-confirmed`, because model convergence was a prerequisite gate before the p-value decision branch.

## PCX-H2 — Decision ambiguity adds information beyond structure

Scientific statement:

> Among states with a finite ordinary-evaluation-domain D2 best-second margin, root decision ambiguity adds information about D2-to-D3 instability beyond structural branching and phase.

Frozen ambiguity predictor/population:

```text
log1pD2BestSecondGap
finite ordinary-evaluation-domain D2 best-second margin only
```

Frozen comparison:

```text
reduced: D23Instability ~ 1 + phase + log1pLegalMoveCount
full:    D23Instability ~ 1 + phase + log1pLegalMoveCount + log1pD2BestSecondGap
```

H2 was prospectively gate-kept: it receives a confirmatory label only if H1 is confirmed.

Computed Stage 2 quantities retained for transparency:

```text
beta_log1pD2BestSecondGap = -0.3100107533
OR = 0.7334390693
LR = 24.7198668945
p = 6.6297244613e-07
```

However:

```text
PCX-H1 = INCONCLUSIVE
secondary reduced model converged = false
finiteConvergedSecondaryModels = false
```

Final status:

```text
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

The small computed p-value is not a confirmed secondary result.

## H3 — Structural branching and deterministic search workload

Original exploratory statement:

> Structural branching and fixed-search workload may be related but are not assumed to be identical.

Stage 1 exploratory evidence included a substantial descriptive association between `legalMoveCount` and `log1p(D3 nodes)`.

Final Study 1 status:

```text
EXPLORATORY / NOT FORMALLY CONFIRMED
```

No formal Study 1 success claim is attached to a particular workload correlation magnitude.

## H4 — Multiple machine-reproducible layers

Original exploratory statement:

> Structural, workload, ambiguity and prediction-instability measures should not be assumed to collapse into one interchangeable dimension.

Final Study 1 status:

```text
EXPLORATORY / MEASUREMENT FRAMEWORK ESTABLISHED
NO FORMAL LATENT-DIMENSION CLAIM
```

PCA/factor/latent geometry was not made the confirmatory center.

## H5 future — Human difficulty validation

Future question:

> Do machine-reproducible structural/ambiguity/instability layers predict human error rate, response time, candidate generation or explanation quality?

Status:

```text
OUT OF SCOPE FOR STUDY 1
FUTURE INDEPENDENT STUDY
```

Study 1 does not infer human cognitive difficulty from engine search difficulty.

## Explicit no-rescue boundary

The completed formal result may not be changed by:

- re-running the same Stage 2 data with a different optimizer/tolerance and replacing the formal label;
- adding seeds/games;
- switching the primary depth pair;
- changing the endpoint or `legalMoveCount` definition;
- adding phase interactions or phase-stratified confirmation;
- substituting another ambiguity metric for H2;
- promoting the H2 computed p-value despite gatekeeping;
- using Stage 1 exploratory evidence as formal confirmation.

Any numerical-method replication must be a new prospective independent study with fresh evidence.

## Final Study 1 hypothesis state

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
H3 = EXPLORATORY ONLY
H4 = EXPLORATORY / NO FORMAL LATENT CLAIM
H5 = FUTURE INDEPENDENT STUDY
```
