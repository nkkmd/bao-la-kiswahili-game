# Position Complexity / Difficulty Study — Stage 2 Formal Result

更新日: 2026-08-14  
Stage ID: `PCX-S2-FORMAL-2026-08-13-v1`  
Status: **FORMAL COMPLETE / PCX-H1 INCONCLUSIVE / PCX-H2 NOT-CONFIRMATORILY-EVALUATED**

## 1. Formal identity

```text
Stage ID = PCX-S2-FORMAL-2026-08-13-v1
specSha256 = f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
authorizationHash = 00471bc8f285ae544994b636d922dff75995d548151cd12349259b390d8b0dee
sourceCommit = ba0e9a1dab6ca88095b0d35043c67f965adf7509
sourceTreeDirty = false
```

Formal corpus generation used the prospectively frozen fresh seed block:

```text
games = 1024
seeds = 20410001..20411024
opening = seeded-uniform E.moveVariants for 8 plies
then = hard / bao / phase2 / depth2
max ply = 100
```

No Stage 1 seed/state was reused as confirmation evidence.

## 2. Generation and independent verification

Generation summary:

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
uniqueHistoricalTrajectories = 891
verifiedIdentityHash = 27d4de0818033226f23e1a806a85457d71d8c05beaaf20a596e27fb411b8ef10
```

Therefore the formal corpus passed the frozen replay/search/identity verification firewall.

## 3. Frozen state selection

Outcome-independent selection produced:

```text
uniqueHistoricalTrajectories = 891
assigned Mtaji = 461
assigned Namua = 430
unavailableAssignedPhase = 28
selectedBeforeRuleStateCollapse = 863
duplicateSelectedRuleStatesCollapsed = 1
selectedUniqueRuleStates = 862
selected Mtaji = 438
selected Namua = 424
selectionHash = d214073fc1645a2942bc0bdc4a07c68309dc62737b5e18748907c8e8a0028c22
```

The one exact duplicate selected `ruleStateKey` was collapsed by the frozen representative rule. No replacement was made for unavailable assigned phases.

## 4. Fixed measurement

All selected unique rule states were measured:

```text
selectedStates = 862
completedMeasurements = 862
measurementHash = c7ad1762aad979513e12da2d83278f8d2de30888318aa9215749c0c7fdd8d105
```

Measurement provenance matched the frozen source/tool fingerprint and the source tree was clean.

## 5. Formal population and gates

Formal population:

```text
selectedUniqueRuleStates = 862
Namua = 424
Mtaji = 438
D23InstabilityEvents = 203
D23StableEvents = 659
ordinaryDomainD2Margins = 630
H2SubsetInstabilityEvents = 203
H2SubsetStableEvents = 427
```

Count/coverage gates all passed comfortably.

### PCX-H1 primary gates

```text
selected unique rule states >= 500   PASS (862)
Namua >= 180                         PASS (424)
Mtaji >= 180                         PASS (438)
D23 instability >= 80                PASS (203)
D23 stable >= 80                     PASS (659)
primary reduced/full finite+converged FAIL
```

The reduced primary model converged. The full primary model was finite, full rank, had a positive Hessian minimum eigenvalue and moderate Hessian condition number, but the frozen BFGS optimizer returned:

```text
optimizerSuccess = false
optimizerStatus = 2
optimizerMessage = Desired error not necessarily achieved due to precision loss.
converged = false
```

Because the preregistered gate required both primary models to be finite **and converged**, the primary model gate failed.

## 6. PCX-H1 formal decision

Computed primary model quantities were:

```text
beta_log1pLegalMoveCount = +0.3818030009
odds ratio per unit log1pLegalMoveCount = 1.4649234681
LR statistic = 2.9350451603
df = 1
p = 0.0866762390
```

These numerical quantities do **not** determine the formal label because the convergence gate failed first.

Frozen decision rule:

```text
required gate failure -> INCONCLUSIVE
```

Therefore:

```text
PCX-H1 = INCONCLUSIVE
```

It is prohibited to relabel this result as `not-confirmed` based on the nonsignificant p-value, because that would ignore the preregistered finite/converged-model gate.

It is equally prohibited to relabel the positive coefficient direction as confirmation.

## 7. PCX-H2 formal status

The ordinary-domain secondary population was large enough:

```text
ordinary-domain D2 margins = 630
H2 subset instability events = 203
H2 subset stable events = 427
```

The computed H2 comparison gave:

```text
beta_log1pD2BestSecondGap = -0.3100107533
odds ratio = 0.7334390693
LR statistic = 24.7198668945
p = 6.6297244613e-07
```

However:

1. PCX-H1 was not formally confirmed;
2. the frozen H2 hierarchy permits a confirmatory label only after H1 confirmation;
3. the H2 reduced model also returned BFGS precision-loss and `converged=false`, so the secondary finite+converged-model gate failed independently.

Therefore:

```text
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

The small computed p-value is not a confirmed secondary result and must not be promoted as one.

## 8. Overall formal decision

Machine result identity:

```text
resultHash = f20b51ec05b7c02e33dd77f8ce27b85c1b9671f6d8046dc6104f2e01946f5b75
formalDecision = inconclusive
scientificInferenceAuthorized = true
```

Study-level formal outcome:

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
OVERALL FORMAL DECISION = INCONCLUSIVE
```

The reason is a prospectively frozen numerical-convergence gate failure, not insufficient state/event coverage and not corpus invalidity.

## 9. Interpretation boundary

Supported conclusions:

- the fresh formal corpus is valid and fully verified;
- formal population/count gates were amply satisfied;
- the frozen analyzer did not satisfy its own primary full-model convergence requirement;
- therefore this Stage 2 does not resolve the structural-branching / D23-instability confirmatory question;
- H2 cannot be claimed confirmatorily.

Not supported:

- `legalMoveCount` formally predicts D23 instability;
- `legalMoveCount` is formally unrelated to D23 instability;
- D2 ambiguity is formally confirmed as incremental information;
- the Stage 1 exploratory directions have been confirmed;
- an alternative optimizer, tolerance, interaction, phase split or endpoint may retroactively replace the frozen formal result.

## 10. No rescue

Do not alter the completed Stage 2 decision by:

- rerunning the same formal data with another optimizer and promoting that result;
- weakening the convergence criterion;
- changing BFGS tolerance after outcome inspection;
- using the raw p=0.0867 to force `not-confirmed`;
- using the H2 p-value to claim secondary confirmation;
- adding seeds/games;
- changing the depth pair, predictor or endpoint;
- adding phase interactions or phase-stratified confirmation.

Any attempt to resolve the numerical convergence issue must be a **new prospective independent replication** with a newly frozen numerical-analysis procedure and fresh evidence.
