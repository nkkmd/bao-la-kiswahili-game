# 2026-08-13 — Stage 1 completion and Stage 2 formal-design freeze

Status: **CANONICAL CHECKPOINT**

## Stage 1 closure

Stage ID:

```text
PCX-S1-EXPLORATORY-2026-08-12-v1
```

Stage 1 is now complete, exploratory-only and permanently consumed.

Verified/frozen identities:

```text
specSha256 = 20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165
verificationIdentityHash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
selectionHash = 64df1467410923ce900d4f46c49c61b0d19b8142c041a55394b82020c460a823
measurementHash = 5a85c54a2dcfb3bbd17bb0c806e6f7347e6dfa7c2dcd63a1ddc2cbdf536ef584
resultHash = 51e6a0f7352e553f6a66e4e1db7c867148424cdbf7954b818bf7667bfd3c2eec
```

Population:

```text
generated games = 768
unique historical trajectories = 685
selected unique rule states = 666
selected Namua = 341
selected Mtaji = 325
unavailable assigned phase = 19
duplicate selected rule states collapsed = 0
```

All frozen readiness gates passed:

```text
selected unique rule states >= 300      666 PASS
Namua >= 120                            341 PASS
Mtaji >= 120                            325 PASS
D23 instability >= 30                  162 PASS
D23 stable >= 30                       504 PASS
ordinary-domain D2 margins >= 200      510 PASS
```

No formal decision is made from Stage 1.

```text
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

Canonical result:

```text
doc/position-complexity/STAGE_1_EXPLORATORY_RESULT.md
```

## Exploratory design observations

Without p-values:

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

These are planning/freeze inputs only.

## Stage 2 design freeze

Stage ID:

```text
PCX-S2-FORMAL-2026-08-13-v1
```

Formal design documents:

```text
doc/position-complexity/STAGE_2_FORMAL_PROTOCOL.md
doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json
```

Fresh corpus:

```text
games = 1024
seeds = 20410001..20411024
opening = seeded-uniform moveVariants, 8 plies
trajectory generator = hard / bao / phase2 / depth2
max ply = 100
```

Repository search before freeze found no existing use of seed `20410001`.

## Formal H1

Frozen primary:

```text
PCX-H1
D23Instability = exact TopSet_D2 / TopSet_D3 disjointness
predictor = log1pLegalMoveCount
covariate = phaseMtajiIndicator
```

Test:

```text
unpenalized binomial logistic likelihood-ratio test
reduced = phase only
full = phase + log1pLegalMoveCount
df = 1
alpha = 0.05
two-sided
```

## Formal H2

Frozen key secondary:

```text
PCX-H2
ordinary-domain log1pD2BestSecondGap
adds information beyond phase + log1pLegalMoveCount
```

H2 is confirmatory only if H1 is confirmed.

This gatekeeping supersedes the earlier provisional multiplicity recommendation in PCX-D016 for this Stage 2 design.

## Superseded provisional decisions

The following earlier provisional entries are now resolved prospectively by the Stage 2 spec:

```text
PCX-D011 legalMoveCount candidate -> FROZEN as log1pLegalMoveCount predictor
PCX-D012 D2->D3 TopSet instability candidate -> FROZEN as primary outcome
PCX-D013 D2 margin candidate -> FROZEN as ordinary-domain log1p margin for H2
PCX-D014 one-state-per-trajectory preference -> FROZEN for Stage 2
PCX-D016 multiplicity recommendation -> FROZEN as H1 primary + gate-kept H2
```

Historical text in the append-only Decision Register should not be rewritten to make those choices appear to have been fixed earlier.

## Formal estimability gates

H1:

```text
selected unique states >= 500
Namua >= 180
Mtaji >= 180
D23 instability >= 80
D23 stable >= 80
finite/converged primary models
```

H2:

```text
ordinary-domain margins >= 350
H2-subset instability >= 50
H2-subset stable >= 50
finite/converged secondary models
```

A valid nonsignificant H1 result is `not-confirmed`, not `inconclusive`.

## Generation firewall

The scientific Stage 2 design is frozen, but corpus generation is still locked.

Required before authorization:

1. dedicated formal runner;
2. independent full verifier;
3. formal analyzer implementing the frozen logistic LRTs and decision vocabulary;
4. technical unit/smoke tests;
5. successful technical CI;
6. frozen source/tool hashes;
7. explicit formal-generation authorization record.

Therefore at this checkpoint:

```text
Stage 1 = COMPLETE / CONSUMED
Stage 2 design = FROZEN
Stage 2 corpus = NOT GENERATED
Stage 2 generation = NOT AUTHORIZED
PR #29 = remains draft / unmerged
```
