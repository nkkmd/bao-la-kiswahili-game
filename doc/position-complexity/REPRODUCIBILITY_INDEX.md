# Position Complexity / Difficulty Study 1 — Reproducibility Index （再現性）

## 日本語での要点

formal decisionはINCONCLUSIVEで、人間の難しさや単一difficulty scoreを確認したものではない。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

更新日: 2026-08-14  
Status: **CLOSED STUDY / REPRODUCIBILITY INDEX**

## Study identity （識別と表現）

```text
study = Position Complexity / Difficulty Study 1
branch = research/position-complexity-difficulty
base main = d681b4593242973fcb33805edca12eb3e8633653
formal decision = INCONCLUSIVE
```

## Stage 0 （Stageの記録）

Canonical result:

```text
doc/position-complexity/STAGE_0_SMOKE_RESULT.md
```

Validated diagnostic:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
```

Technical CI:

```text
workflow run = 31589325398
validated branch head = 7bf6d801fc1f60ecf73d51c6be158f3f82b226d9
```

## Stage 1 exploratory corpus （Stageの記録）

Stage identity:

```text
Stage ID = PCX-S1-EXPLORATORY-2026-08-12-v1
specSha256 = 20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165
```

Canonical protocol/spec/runbook:

```text
doc/position-complexity/STAGE_1_EXPLORATORY_PROTOCOL.md
doc/position-complexity/preregistration/STAGE_1_EXPLORATORY_SPEC.json
doc/position-complexity/STAGE_1_RUNBOOK.md
```

Local artifact root:

```text
artifacts/local/position-complexity/stage1-exploratory-v1/
```

Primary Stage 1 artifact identities:

```text
verificationIdentityHash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
selectionHash = 64df1467410923ce900d4f46c49c61b0d19b8142c041a55394b82020c460a823
measurementHash = 5a85c54a2dcfb3bbd17bb0c806e6f7347e6dfa7c2dcd63a1ddc2cbdf536ef584
resultHash = 51e6a0f7352e553f6a66e4e1db7c867148424cdbf7954b818bf7667bfd3c2eec
```

Canonical records:

```text
doc/position-complexity/STAGE_1_GENERATION_VERIFICATION.md
doc/position-complexity/STAGE_1_EXPLORATORY_RESULT.md
```

Stage 1 is exploratory-consumed and cannot be reused as Stage 2 confirmation evidence.

## Stage 2 formal corpus （Stageの記録）

Stage identity:

```text
Stage ID = PCX-S2-FORMAL-2026-08-13-v1
specSha256 = f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
authorizationHash = 00471bc8f285ae544994b636d922dff75995d548151cd12349259b390d8b0dee
sourceCommit = ba0e9a1dab6ca88095b0d35043c67f965adf7509
```

Canonical protocol/spec/authorization/runbook:

```text
doc/position-complexity/STAGE_2_FORMAL_PROTOCOL.md
doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json
doc/position-complexity/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
doc/position-complexity/STAGE_2_FORMAL_RUNBOOK.md
```

Local artifact root:

```text
artifacts/local/position-complexity/stage2-formal-v1/
```

Formal artifact identities:

```text
generation summaryHash = fb035091ef9c4978dd59cf26c3a4e1f1d1fbe8299e6f914d2aded28237ba2e2b
verificationIdentityHash = 27d4de0818033226f23e1a806a85457d71d8c05beaaf20a596e27fb411b8ef10
selectionHash = d214073fc1645a2942bc0bdc4a07c68309dc62737b5e18748907c8e8a0028c22
measurementHash = c7ad1762aad979513e12da2d83278f8d2de30888318aa9215749c0c7fdd8d105
resultHash = f20b51ec05b7c02e33dd77f8ce27b85c1b9671f6d8046dc6104f2e01946f5b75
```

Formal corpus verification:

```text
gamesVerified = 1024
observationsVerified = 56,336
movesVerified = 55,312
searchMovesRecomputed = 47,129
fullSearchRecomputation = true
```

Canonical formal result:

```text
doc/position-complexity/STAGE_2_FORMAL_RESULT.md
```

## Frozen Stage 2 source fingerprint （Stageの記録）

```text
public/engine.js
  e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
public/ai.js
  2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
public/ai-weights.js
  7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8
tools/benchmark.js
  2a893d7fe78d9d9cb211b38840c45f5c3dd9053fa3e05255b123985a08cfa808
tools/symmetry/transform-candidates.js
  fc85e8520b23b0b4ceb0bd8a95ad7f2b47171405190eedecdc822054d44decc5
tools/experiments/lib/phase-transition-features.js
  b0948a94b8e6358d12194e4dad10018448f85814ac735ca3ceee7a4c74a78480
tools/experiments/lib/position-typology-features.js
  94ec8283cdc9d8f75cbdb13215cc2acd95fd33a2ca3a14afccd3a26ca8644242
tools/experiments/lib/position-complexity-search-diagnostic.js
  471dace470d1d83651d75b2e239b35bbfd55fd65cccc562ac3b47c020988eda9
tools/experiments/run-position-complexity-stage1-exploratory.js
  1b44ff5fb0f58e3391f1b19bcb05f613484f3974d0266919b56fb363f50181a3
tools/experiments/run-position-complexity-stage2-formal.js
  0916a2f530a459dd55ace97c8ee4e6809e6c7a26dd734b8005c96794d43c48e2
doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json
  f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
doc/position-complexity/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
  3b23f984fdaa9413730100cdd217009fc2ff44d53c2c5725fa08144c1c911e42
```

Pipeline files frozen by authorization:

```text
tools/experiments/verify-position-complexity-stage2-formal.js
  a719a83989d8adb33a0312b0708e7ebf4f1107baa6edf0848e7223017e918ffc
tools/experiments/analyze-position-complexity-stage2-formal.py
  5b20fdba78418c243313ed0601554159e9b2e5e361127c3ccd903ba8237ad761
test/position-complexity-stage2-formal-tooling.test.js
  a6c2c7551dcc466912d614b8a753388749dcddb630a0a5c1998c1c9e5e72a4b3
```

## Formal tooling validation （日本語の要点）

```text
fingerprint CI run = 31673666993 / success
authorization-present CI run = 31673835352 / success
authorization preflight = success
```

GitHub Actions was used only for technical validation and never generated the scientific Stage 1 or Stage 2 corpora.

## Final decision （結論）

```text
PCX-H1 = INCONCLUSIVE
PCX-H2 = NOT-CONFIRMATORILY-EVALUATED
OVERALL FORMAL DECISION = INCONCLUSIVE
```

Reason:

```text
frozen primary full-model convergence gate failed
BFGS status 2 / precision loss
```

The formal data remain consumed. Any numerical-method replication requires a new prospective protocol and fresh evidence.
