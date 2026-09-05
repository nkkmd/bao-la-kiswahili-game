# Position Complexity / Difficulty Study — Current Status （現在の状態）

## 日本語での要点

formal decisionはINCONCLUSIVEで、人間の難しさや単一difficulty scoreを確認したものではない。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

更新日: 2026-08-14  
Status: **STUDY 1 CLOSED / FORMAL DECISION INCONCLUSIVE / REPOSITORY CLOSURE COMPLETE**

## Research identity （識別と表現）

```text
research title = Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離
research branch = research/position-complexity-difficulty
base main head at study initiation = d681b4593242973fcb33805edca12eb3e8633653
PR #29 = MERGED
merge commit = 7ef83fcb95621aedd1f4b22ec6f213f976576a6c
Stage 0 = COMPLETE / TECHNICAL PASS
Stage 1 = COMPLETE / EXPLORATORY / READINESS PASS / CONSUMED
Stage 2 = COMPLETE / FORMAL
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
OVERALL FORMAL DECISION = INCONCLUSIVE
```

## Immutable inherited boundaries （日本語の要点）

No completed study is reopened or rescued.

Immutable historical results remain:

```text
phase-transition:
  E-010 NOT-CONFIRMED
  E-011 INCONCLUSIVE
  E-017 NOT-CONFIRMED
  E-018/H16 CONFIRMED only fixed hard/bao/D2 phase2 > legacy
  E-019/H17 global NOT-CONFIRMED
  E-020/H18 CONFIRMED only fixed hard/bao/D3 legacy > phase2

position typology / style:
  MTAJI-M1/M2 bounded confirmed morphology
  no discrete Namua type
  N-ACT/N-CON exploratory only
  discrete playing-style clustering unsupported
  STYLE-C1..C4 exact geometry formal NOT-CONFIRMED

Namua->Mtaji:
  formal decision NOT-CONFIRMED
  first Mtaji observation deterministic at ply 44 in the frozen engine
```

No first-Mtaji timing/survival/hazard/acceleration/delay endpoint is authorized.

## Stage 0 — COMPLETE （Stageの記録）

Validated exact-search diagnostic:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
```

Technical gates G0-1..G0-9 passed. The diagnostic provides exhaustive root candidate values, exact TopSet, best-second gap, score-domain handling, and depth-transition diagnostics without modifying normal game search behavior.

## Stage 1 — COMPLETE / EXPLORATORY / CONSUMED （Stageの記録）

```text
Stage ID = PCX-S1-EXPLORATORY-2026-08-12-v1
specSha256 = 20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165
games = 768
unique historical trajectories = 685
selected unique rule states = 666
Namua = 341
Mtaji = 325
D23 instability = 162
D23 stable = 504
ordinary-domain D2 margins = 510
verificationIdentityHash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
selectionHash = 64df1467410923ce900d4f46c49c61b0d19b8142c041a55394b82020c460a823
measurementHash = 5a85c54a2dcfb3bbd17bb0c806e6f7347e6dfa7c2dcd63a1ddc2cbdf536ef584
resultHash = 51e6a0f7352e553f6a66e4e1db7c867148424cdbf7954b818bf7667bfd3c2eec
```

All preregistered Stage 2 readiness gates passed. Stage 1 remains exploratory only and cannot serve as formal confirmation evidence.

## Stage 2 — COMPLETE / FORMAL （Stageの記録）

### Frozen identity （識別と表現）

```text
Stage ID = PCX-S2-FORMAL-2026-08-13-v1
specSha256 = f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
authorizationHash = 00471bc8f285ae544994b636d922dff75995d548151cd12349259b390d8b0dee
sourceCommit = ba0e9a1dab6ca88095b0d35043c67f965adf7509
```

Fresh formal corpus:

```text
1024 games
seeds 20410001..20411024
8-ply seeded-uniform moveVariants opening
then hard / bao / phase2 / depth2
max ply 100
```

No Stage 1 seed/state was reused.

### Generation / full verification （日本語の要点）

```text
gamesVerified = 1024
observationsVerified = 56,336
movesVerified = 55,312
searchMovesRecomputed = 47,129
fullSearchRecomputation = true
uniqueHistoricalTrajectories = 891
verificationIdentityHash = 27d4de0818033226f23e1a806a85457d71d8c05beaaf20a596e27fb411b8ef10
```

The formal corpus is technically valid under the frozen verifier.

### Selection / measurement （日本語の要点）

```text
unique historical trajectories = 891
assigned Mtaji = 461
assigned Namua = 430
unavailable assigned phase = 28
selected before rule-state collapse = 863
duplicate selected rule states collapsed = 1
selected unique rule states = 862
selected Mtaji = 438
selected Namua = 424
selectionHash = d214073fc1645a2942bc0bdc4a07c68309dc62737b5e18748907c8e8a0028c22
completedMeasurements = 862
measurementHash = c7ad1762aad979513e12da2d83278f8d2de30888318aa9215749c0c7fdd8d105
```

### Formal population gates （日本語の要点）

```text
selected unique rule states >= 500   862 PASS
Namua >= 180                         424 PASS
Mtaji >= 180                         438 PASS
D23 instability >= 80                203 PASS
D23 stable >= 80                     659 PASS
ordinary-domain D2 margins >= 350    630 PASS
H2 subset instability >= 50          203 PASS
H2 subset stable >= 50               427 PASS
```

Coverage/counts were not the limiting factor.

## PCX-H1 — FINAL FORMAL DECISION = INCONCLUSIVE （結論）

Frozen primary comparison:

```text
reduced: D23Instability ~ 1 + phase
full:    D23Instability ~ 1 + phase + log1pLegalMoveCount
unpenalized binomial logistic LRT
alpha = 0.05
```

Reduced model converged. Full model was finite/full-rank with a well-defined positive Hessian, but BFGS returned:

```text
optimizerSuccess = false
optimizerStatus = 2
optimizerMessage = Desired error not necessarily achieved due to precision loss.
converged = false
```

The preregistered gate required **both** primary models finite and converged.

Computed values retained for transparency:

```text
beta_log1pLegalMoveCount = +0.3818030009
OR = 1.4649234681
LR = 2.9350451603
p = 0.0866762390
```

Because the convergence gate failed before the p-value decision branch:

```text
PCX-H1 = INCONCLUSIVE
```

Do not relabel this as `NOT-CONFIRMED` from p=0.0867 and do not claim confirmation from the positive coefficient.

## PCX-H2 — FINAL STATUS = NOT-CONFIRMATORILY-EVALUATED （結論）

Computed secondary quantities:

```text
beta_log1pD2BestSecondGap = -0.3100107533
OR = 0.7334390693
LR = 24.7198668945
p = 6.6297244613e-07
```

However:

```text
H1 = INCONCLUSIVE
secondary reduced model converged = false
finiteConvergedSecondaryModels = false
```

The preregistered hierarchy allows H2 confirmation only after H1 confirmation. Therefore:

```text
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
```

The small computed p-value is not a confirmed secondary result.

## Final result identity （結論）

```text
resultHash = f20b51ec05b7c02e33dd77f8ce27b85c1b9671f6d8046dc6104f2e01946f5b75
formalDecision = inconclusive
scientificInferenceAuthorized = true
```

Canonical result:

```text
doc/position-complexity/STAGE_2_FORMAL_RESULT.md
```

## Study 1 closure （結論）

Study 1 closes here without rescue.

Canonical closure documents:

```text
doc/position-complexity/STUDY_1_OVERVIEW.md
doc/position-complexity/STUDY_1_FINAL_REPORT.md
doc/position-complexity/REPRODUCIBILITY_INDEX.md
doc/position-complexity/checkpoints/2026-08-14-stage2-formal-result-and-study1-closure.md
```

No within-study extension, reseeding, optimizer/tolerance change, endpoint substitution, phase interaction, phase-stratified rescue or H2 promotion is authorized.

## Future work boundary （適用範囲と制限）

If the H1 scientific question is revisited, the preferred next step is a **new prospective numerical-method replication** with:

- robust optimizer/convergence procedure frozen before generation;
- fresh seed block / fresh corpus;
- current Stage 1/Stage 2 evidence treated as consumed historical evidence only.

Human difficulty validation also remains a separate future independent study.

## Repository state （リポジトリ状態）

```text
Study 1 scientific work = CLOSED
Stage 2 corpus = CONSUMED
formal result = INCONCLUSIVE
PR #29 = MERGED
merge commit = 7ef83fcb95621aedd1f4b22ec6f213f976576a6c
repository closure = COMPLETE
```
