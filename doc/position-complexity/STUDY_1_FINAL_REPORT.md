# Position Complexity / Difficulty Study 1 — Final Report

更新日: 2026-08-14  
Status: **STUDY 1 CLOSED / FORMAL DECISION INCONCLUSIVE**

## Executive summary

This prospective study separated Bao position difficulty into machine-reproducible layers rather than assuming one global difficulty score.

The study successfully established and validated exact root/depth instrumentation, completed an exploratory design-development corpus, and executed a fresh held-out formal corpus with trajectory/state pseudoreplication controls.

The Stage 2 formal corpus was technically valid and fully verified. All count/coverage gates passed. However, the preregistered primary full logistic model failed the frozen optimizer-convergence gate because BFGS returned precision loss. Under the preregistered decision rule, this makes the primary result **INCONCLUSIVE**, irrespective of the computed nonsignificant p-value.

The key secondary ambiguity model cannot receive a confirmatory label because H1 was not confirmed and its own reduced model also failed convergence.

Final decisions:

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
OVERALL FORMAL DECISION = INCONCLUSIVE
```

No rescue analysis changes these labels.

---

## 1. Research question

The study asked whether several machine-reproducible aspects of Bao position difficulty can be measured separately:

```text
structural complexity
search workload
decision ambiguity
prediction instability
```

The confirmatory center was deliberately narrow:

1. whether structural root branching is associated with D2→D3 decision instability after phase adjustment;
2. if H1 is confirmed, whether D2 ordinary-domain ambiguity adds incremental information.

Human difficulty was excluded from Study 1.

---

## 2. Inherited scientific boundaries

This study did not reopen or rescue completed research.

Immutable inherited boundaries include:

```text
phase-transition Study 1:
  E-010 not-confirmed
  E-011 inconclusive
  E-017 not-confirmed
  E-018/H16 confirmed only fixed hard/bao/D2 phase2 > legacy
  E-019/H17 global not-confirmed
  E-020/H18 confirmed only fixed hard/bao/D3 legacy > phase2

position-typology / playing-style Study 1:
  MTAJI-M1/M2 bounded confirmed morphology
  no discrete Namua type
  N-ACT/N-CON exploratory only
  discrete playing-style clustering unsupported
  STYLE-C1..C4 exact geometry not-confirmed

Namua→Mtaji Study 1:
  formal decision NOT-CONFIRMED
  deterministic first-Mtaji clock retained as boundary
```

No prior formal archive was reused as fresh present-study confirmation evidence.

---

## 3. Stage 0 — measurement validation

### 3.1 Structural layer

Existing position-typology tooling supplied raw state-level quantities including:

- `legalMoveCount`;
- `captureMoveCount`;
- forced capture;
- capture/relay/chain summaries;
- front-row structure;
- reusable pits;
- reserve/house/nyumba quantities;
- pit variance and seed concentration;
- trajectory/state identity keys.

For this study:

```text
legalMoveCount = E.moveVariants(state).length
```

Single-choice roots were excluded from primary decision-instability inference.

### 3.2 Search workload layer

Fixed-search workload quantities included:

```text
nodes
quiescenceNodes
cutoffs
evaluationRequests
evaluations
completedDepth
```

Wall-clock time was descriptive/QA only.

### 3.3 Exact ambiguity / instability instrumentation

A dedicated diagnostic was implemented:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
```

Frozen semantics:

```text
exact-full-window-root-candidates/phase2-value-semantics/v1
```

It exposes exhaustive root-candidate values, exact TopSet, tie status, best-second gap, score domains, and adjacent-depth transitions.

Technical validation passed non-mutation, legal-root exhaustiveness, common score perspective, fixed-depth consistency, determinism, replay validity, identity availability, and existing-search regression protection.

Stage 0 was technical only and contained no scientific confirmation.

---

## 4. Stage 1 — exploratory design development

Stage ID:

```text
PCX-S1-EXPLORATORY-2026-08-12-v1
specSha256 = 20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165
```

Fresh exploratory generation:

```text
768 games
seeds 20400001..20400768
8-ply seeded-uniform moveVariants opening
then hard / bao / phase2 / D2
max ply 100
```

Independent verification passed:

```text
gamesVerified = 768
observationsVerified = 43,110
movesVerified = 42,342
searchMovesRecomputed = 36,211
fullSearchRecomputation = true
uniqueHistoricalTrajectories = 685
verificationIdentityHash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
```

Outcome-independent selection yielded:

```text
selectedUniqueRuleStates = 666
Namua = 341
Mtaji = 325
selectionHash = 64df1467410923ce900d4f46c49c61b0d19b8142c041a55394b82020c460a823
```

All 666 selected states were measured D1-D4:

```text
measurementHash = 5a85c54a2dcfb3bbd17bb0c806e6f7347e6dfa7c2dcd63a1ddc2cbdf536ef584
resultHash = 51e6a0f7352e553f6a66e4e1db7c867148424cdbf7954b818bf7667bfd3c2eec
```

Readiness result:

```text
selected unique rule states = 666     PASS >= 300
Namua = 341                           PASS >= 120
Mtaji = 325                           PASS >= 120
D23 instability = 162                 PASS >= 30
D23 stable = 504                      PASS >= 30
ordinary-domain D2 margins = 510      PASS >= 200
```

Exploratory descriptive correlations, with no confirmatory p-values, were directionally compatible with the original candidates:

```text
legalMoveCount vs D23 instability:
  Pearson +0.1446
  Spearman +0.1476

ordinary D2 gap vs D23 instability:
  Pearson -0.2242
  Spearman -0.2435

legalMoveCount vs log1p(D3 nodes):
  Pearson +0.6267
  Spearman +0.6555
```

Stage 1 was permanently consumed and ineligible for Stage 2 confirmation reuse.

---

## 5. Stage 2 — preregistered formal design

Stage ID:

```text
PCX-S2-FORMAL-2026-08-13-v1
specSha256 = f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
```

Fresh fixed corpus:

```text
1024 games
seeds 20410001..20411024
8-ply seeded-uniform E.moveVariants opening
then hard / bao / phase2 / D2
max ply 100
```

The formal tooling, verifier, analyzer and authorization firewall were technically validated before generation.

### 5.1 Frozen state sampling

```text
generated games
-> collapse duplicate historicalTrajectoryHash
-> outcome-independent hash phase assignment
-> nonterminal ply >= 8
-> legalMoveCount >= 2
-> one state per trajectory by frozen SHA rank
-> no replacement for unavailable assigned phase
-> collapse exact duplicate selected ruleStateKey
```

### 5.2 PCX-H1

Outcome:

```text
D23Instability = 1 iff TopSet_D2 ∩ TopSet_D3 = empty
```

Predictor:

```text
log1pLegalMoveCount
```

Covariate:

```text
phaseMtajiIndicator
```

Models:

```text
reduced: D23Instability ~ 1 + phase
full:    D23Instability ~ 1 + phase + log1pLegalMoveCount
```

Test:

```text
unpenalized binomial logistic likelihood-ratio test
alpha = 0.05
df = 1
```

Formal H1 gates required adequate count coverage and both models finite/converged.

### 5.3 PCX-H2

Among ordinary-domain D2 margins:

```text
reduced: D23Instability ~ 1 + phase + log1pLegalMoveCount
full:    D23Instability ~ 1 + phase + log1pLegalMoveCount + log1pD2BestSecondGap
```

H2 was hierarchically confirmatory only after H1 confirmation.

---

## 6. Stage 2 corpus validity

Generation:

```text
games = 1024
observations = 56,336
uniqueHistoricalTrajectories = 891
duplicateHistoricalTrajectoryGroups = 91
largestHistoricalTrajectoryGroup = 8
reachedMtajiGames = 970
summaryHash = fb035091ef9c4978dd59cf26c3a4e1f1d1fbe8299e6f914d2aded28237ba2e2b
```

Independent full verification:

```text
passed = true
gamesVerified = 1024
observationsVerified = 56,336
movesVerified = 55,312
searchMovesRecomputed = 47,129
fullSearchRecomputation = true
verifiedIdentityHash = 27d4de0818033226f23e1a806a85457d71d8c05beaaf20a596e27fb411b8ef10
```

The formal corpus is therefore technically valid under the frozen verifier.

---

## 7. Stage 2 formal selection / measurement

Selection:

```text
uniqueHistoricalTrajectories = 891
assigned Mtaji = 461
assigned Namua = 430
unavailable assigned phase = 28
selectedBeforeRuleStateCollapse = 863
duplicateSelectedRuleStatesCollapsed = 1
selectedUniqueRuleStates = 862
Mtaji = 438
Namua = 424
selectionHash = d214073fc1645a2942bc0bdc4a07c68309dc62737b5e18748907c8e8a0028c22
```

Measurement:

```text
selectedStates = 862
completedMeasurements = 862
measurementHash = c7ad1762aad979513e12da2d83278f8d2de30888318aa9215749c0c7fdd8d105
```

All count/coverage gates passed:

```text
selected unique rule states = 862     PASS >= 500
Namua = 424                           PASS >= 180
Mtaji = 438                           PASS >= 180
D23 instability = 203                 PASS >= 80
D23 stable = 659                      PASS >= 80
ordinary-domain D2 margins = 630      PASS >= 350
H2 subset instability = 203           PASS >= 50
H2 subset stable = 427                PASS >= 50
```

---

## 8. PCX-H1 result

Reduced primary model:

```text
converged = true
optimizerSuccess = true
logLikelihood = -439.7800862642
```

Full primary model:

```text
finite = true
designRank = 3 / 3
hessianMinEigenvalue = 4.5501540291
hessianConditionNumber = 131.6588243452
optimizerSuccess = false
optimizerStatus = 2
optimizerMessage = Desired error not necessarily achieved due to precision loss.
converged = false
logLikelihood = -438.3125636841
```

Computed quantities:

```text
beta_log1pLegalMoveCount = +0.3818030009
OR = 1.4649234681
LR = 2.9350451603
p = 0.0866762390
```

Because the preregistered gate requires both primary models to be finite and converged:

```text
finiteConvergedPrimaryModels = false
```

Therefore:

```text
PCX-H1 = INCONCLUSIVE
```

The result is not relabeled `not-confirmed` from the p-value because the model-convergence gate failed before the p-value decision branch.

---

## 9. PCX-H2 result

Secondary full model converged, but the secondary reduced model returned BFGS precision loss and `converged=false`.

Computed quantities for transparency:

```text
beta_log1pD2BestSecondGap = -0.3100107533
OR = 0.7334390693
LR = 24.7198668945
p = 6.6297244613e-07
```

However:

```text
H1 decision = inconclusive
finiteConvergedSecondaryModels = false
```

The hierarchy permits a confirmatory H2 label only after H1 confirmation.

Therefore:

```text
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

The small computed p-value is not a confirmed secondary result.

---

## 10. Final scientific conclusion

The study succeeded in constructing a technically validated multi-layer position-complexity measurement pipeline and in obtaining large, reproducible exploratory and fresh formal corpora with strong pseudoreplication controls.

The confirmatory scientific center, however, was not resolved because the preregistered numerical convergence gate failed.

Final state:

```text
Stage 0 = COMPLETE / TECHNICAL PASS
Stage 1 = COMPLETE / READINESS PASS / EXPLORATORY-CONSUMED
Stage 2 = COMPLETE / FORMAL
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
OVERALL FORMAL DECISION = INCONCLUSIVE
```

This does not establish either presence or absence of the H1 association.

---

## 11. Interpretation boundary

The present study supports:

- reproducible separation and measurement of structural branching, search workload, ambiguity and depth instability;
- robust formal-corpus generation/replay/identity verification;
- adequate sample/event availability under the frozen state-sampling design;
- closure of the current formal test as inconclusive due to a prespecified convergence gate.

It does not support:

- a confirmed structural branching → instability relation;
- a confirmed null relation;
- confirmed incremental ambiguity information;
- human cognitive difficulty claims;
- causal claims;
- post-hoc phase-specific or alternative-depth confirmation.

---

## 12. Why no rescue is performed

After formal outcome inspection, changing the optimizer, tolerance, convergence definition, model family, phase structure, depth pair, predictor, endpoint, seed count or state-selection rule would alter the preregistered formal test.

Such changes may be scientifically reasonable for future work but cannot overwrite this formal decision.

Therefore the current study closes without rescue.

---

## 13. Recommended next independent study

The highest-priority follow-up is a fresh prospective numerical-method replication:

1. freeze a more robust logistic optimization strategy before any new outcome generation;
2. define convergence diagnostically and operationally in advance;
3. retain the same scientific H1 endpoint/predictor unless a new scientific question is explicitly declared;
4. use a fresh seed block and fresh formal corpus;
5. treat the current Stage 2 as consumed historical evidence only.

The purpose would be to resolve the numerical estimability problem, not to rescue the current result.

---

## 14. Canonical records

```text
doc/position-complexity/STUDY_1_OVERVIEW.md
doc/position-complexity/STUDY_1_FINAL_REPORT.md
doc/position-complexity/STAGE_2_FORMAL_RESULT.md
doc/position-complexity/REPRODUCIBILITY_INDEX.md
doc/position-complexity/CURRENT_STATUS.md
doc/position-complexity/EXPERIMENT_INDEX.md
doc/position-complexity/DECISION_REGISTER.md
doc/position-complexity/RESEARCH_LOG.md
```
