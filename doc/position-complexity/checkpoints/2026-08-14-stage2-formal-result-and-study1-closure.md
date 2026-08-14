# 2026-08-14 — Stage 2 formal result and Study 1 closure

Status: **CANONICAL CLOSURE CHECKPOINT / FORMAL INCONCLUSIVE**

## Final study state

```text
study = Position Complexity / Difficulty Study 1
branch = research/position-complexity-difficulty
Stage 0 = COMPLETE / TECHNICAL PASS
Stage 1 = COMPLETE / EXPLORATORY / READINESS PASS / CONSUMED
Stage 2 = COMPLETE / FORMAL
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
overall formal decision = INCONCLUSIVE
```

## Stage 2 identity

```text
Stage ID = PCX-S2-FORMAL-2026-08-13-v1
specSha256 = f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
sourceCommit = ba0e9a1dab6ca88095b0d35043c67f965adf7509
verificationIdentityHash = 27d4de0818033226f23e1a806a85457d71d8c05beaaf20a596e27fb411b8ef10
selectionHash = d214073fc1645a2942bc0bdc4a07c68309dc62737b5e18748907c8e8a0028c22
measurementHash = c7ad1762aad979513e12da2d83278f8d2de30888318aa9215749c0c7fdd8d105
resultHash = f20b51ec05b7c02e33dd77f8ce27b85c1b9671f6d8046dc6104f2e01946f5b75
```

## Formal corpus validity

```text
games = 1024
gamesVerified = 1024
observationsVerified = 56,336
movesVerified = 55,312
searchMovesRecomputed = 47,129
fullSearchRecomputation = true
uniqueHistoricalTrajectories = 891
selectedUniqueRuleStates = 862
Namua = 424
Mtaji = 438
D23 instability = 203
D23 stable = 659
ordinary-domain D2 margins = 630
```

All count/coverage gates passed.

## Why PCX-H1 is inconclusive

The frozen primary logistic LRT required both reduced and full models to be finite and converged.

Reduced model:

```text
converged = true
```

Full model:

```text
finite = true
designRank = 3 / 3
hessianMinEigenvalue = 4.5501540291
hessianConditionNumber = 131.6588243452
optimizerSuccess = false
optimizerStatus = 2
optimizerMessage = Desired error not necessarily achieved due to precision loss.
converged = false
```

Therefore the preregistered primary model gate failed.

The computed LRT (`p = 0.0866762390`) is retained for transparency but does not authorize a `not-confirmed` label because gate failure precedes the p-value decision rule.

Final primary decision:

```text
PCX-H1 = INCONCLUSIVE
```

## PCX-H2

The H2 subset count gates passed and a small computed p-value was obtained, but:

- H1 was not confirmed, so hierarchical confirmatory gatekeeping blocks H2 confirmation;
- the H2 reduced model also failed the frozen convergence requirement.

Final secondary status:

```text
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

No secondary confirmation claim is allowed.

## Closure decision

The current Study 1 is closed here rather than rescued.

No within-study action is authorized to:

- change optimizer/tolerance and relabel the formal result;
- append games or seeds;
- alter model family or endpoint;
- stratify by phase to rescue the global test;
- promote H2 from its computed p-value;
- reuse Stage 1 or Stage 2 consumed evidence as a fresh confirmation set.

A numerical-method replication, if pursued, must be a new prospective independent study with a newly frozen optimizer/convergence definition and a fresh held-out corpus.

## Canonical result

```text
doc/position-complexity/STAGE_2_FORMAL_RESULT.md
```

The study should now be integrated into the central research index and future-research agenda as a closed formal-inconclusive study.
