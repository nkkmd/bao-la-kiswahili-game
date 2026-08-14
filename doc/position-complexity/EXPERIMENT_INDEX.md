# Position Complexity / Difficulty Study — Experiment Index

更新日: 2026-08-14  
Status: **STUDY 1 CLOSED INDEX**

## PCX-S0-T001 — Exact root/depth diagnostic technical validation

```text
stage = Stage 0
class = technical validation
status = COMPLETE / PASS
scientific inference = none
```

Canonical result:

```text
doc/position-complexity/STAGE_0_SMOKE_RESULT.md
workflow run = 31589325398
```

## PCX-S1-E001 — Multi-layer complexity exploratory design corpus

```text
stage = Stage 1
class = exploratory design development
stage ID = PCX-S1-EXPLORATORY-2026-08-12-v1
status = COMPLETE / READINESS PASS / CONSUMED
scientific inference = exploratory only
confirmatory reuse = prohibited
```

Frozen identity:

```text
specSha256 = 20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165
verificationIdentityHash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
selectionHash = 64df1467410923ce900d4f46c49c61b0d19b8142c041a55394b82020c460a823
measurementHash = 5a85c54a2dcfb3bbd17bb0c806e6f7347e6dfa7c2dcd63a1ddc2cbdf536ef584
resultHash = 51e6a0f7352e553f6a66e4e1db7c867148424cdbf7954b818bf7667bfd3c2eec
```

Population/result:

```text
games = 768
unique historical trajectories = 685
selected unique rule states = 666
Namua = 341
Mtaji = 325
D23 instability = 162
D23 stable = 504
ordinary-domain D2 margins = 510
all preregistered readiness gates = PASS
```

Canonical records:

```text
doc/position-complexity/STAGE_1_GENERATION_VERIFICATION.md
doc/position-complexity/STAGE_1_EXPLORATORY_RESULT.md
```

## PCX-S2-F001 — Structural branching / decision-instability formal confirmation

```text
stage = Stage 2
class = formal / confirmatory
stage ID = PCX-S2-FORMAL-2026-08-13-v1
status = COMPLETE
formal decision = INCONCLUSIVE
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

Formal identity:

```text
specSha256 = f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
authorizationHash = 00471bc8f285ae544994b636d922dff75995d548151cd12349259b390d8b0dee
sourceCommit = ba0e9a1dab6ca88095b0d35043c67f965adf7509
verificationIdentityHash = 27d4de0818033226f23e1a806a85457d71d8c05beaaf20a596e27fb411b8ef10
selectionHash = d214073fc1645a2942bc0bdc4a07c68309dc62737b5e18748907c8e8a0028c22
measurementHash = c7ad1762aad979513e12da2d83278f8d2de30888318aa9215749c0c7fdd8d105
resultHash = f20b51ec05b7c02e33dd77f8ce27b85c1b9671f6d8046dc6104f2e01946f5b75
```

Formal corpus:

```text
1024 games
seeds 20410001..20411024
gamesVerified = 1024
fullSearchRecomputation = true
unique historical trajectories = 891
selected unique rule states = 862
Namua = 424
Mtaji = 438
D23 instability = 203
D23 stable = 659
ordinary-domain D2 margins = 630
```

All preregistered count/coverage gates passed.

Primary PCX-H1 computed quantities:

```text
beta_log1pLegalMoveCount = +0.3818030009
OR = 1.4649234681
LR = 2.9350451603
p = 0.0866762390
```

But the preregistered primary full-model convergence gate failed:

```text
optimizerStatus = 2
optimizerMessage = Desired error not necessarily achieved due to precision loss.
converged = false
```

Therefore:

```text
PCX-H1 = INCONCLUSIVE
```

Key secondary PCX-H2 is:

```text
NOT-CONFIRMATORILY-EVALUATED
```

because H1 was not confirmed and the secondary reduced model also failed the frozen convergence gate. Its computed p-value is retained only for transparency and is not a confirmation result.

Canonical formal result:

```text
doc/position-complexity/STAGE_2_FORMAL_RESULT.md
```

## Study 1 closure

```text
scientific work = CLOSED
overall formal decision = INCONCLUSIVE
current formal corpus = consumed
within-study rescue = prohibited
```

Canonical closure documents:

```text
doc/position-complexity/STUDY_1_OVERVIEW.md
doc/position-complexity/STUDY_1_FINAL_REPORT.md
doc/position-complexity/REPRODUCIBILITY_INDEX.md
doc/position-complexity/checkpoints/2026-08-14-stage2-formal-result-and-study1-closure.md
```

A future numerical-method replication must be a new prospective independent study with fresh evidence.
