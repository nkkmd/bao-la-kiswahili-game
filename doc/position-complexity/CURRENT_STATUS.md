# Position Complexity / Difficulty Study — Current Status

更新日: 2026-08-13  
Status: **ACTIVE / STAGE 1 COMPLETE / STAGE 2 FORMAL EXECUTION AUTHORIZED / CORPUS NOT YET GENERATED**

## Research identity

```text
research title = Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離
branch = research/position-complexity-difficulty
base main head = d681b4593242973fcb33805edca12eb3e8633653
draft PR = #29
Stage 0 = COMPLETE / TECHNICAL PASS
Stage 1 = COMPLETE / EXPLORATORY / CONSUMED
Stage 2 = FORMAL DESIGN FROZEN / TOOLING VALIDATED / LOCAL EXECUTION AUTHORIZED / NOT GENERATED
```

## Immutable inherited boundaries

No prior closed study is reopened or rescued.

Immutable historical results include:

```text
phase-transition:
  E-010 not-confirmed
  E-011 inconclusive
  E-017 not-confirmed
  E-018/H16 confirmed only fixed D2 phase2 > legacy
  E-019/H17 global not-confirmed
  E-020/H18 confirmed only fixed D3 legacy > phase2

position typology / style:
  MTAJI-M1/M2 bounded confirmed morphology
  no discrete Namua type
  N-ACT/N-CON exploratory only
  discrete playing-style clustering unsupported
  STYLE-C1..C4 exact geometry formal not-confirmed

Namua->Mtaji:
  formal decision NOT-CONFIRMED
  first Mtaji observation deterministic at ply 44 in the frozen engine
```

No first-Mtaji timing/survival/hazard/acceleration/delay endpoint is authorized.

## Stage 0 — COMPLETE

Validated exact-search diagnostic:

```text
tools/experiments/lib/position-complexity-search-diagnostic.js
search semantics = exact-full-window-root-candidates/phase2-value-semantics/v1
```

Stage 0 gates G0-1..G0-9 passed and existing search behavior remained protected.

Canonical record:

```text
doc/position-complexity/STAGE_0_SMOKE_RESULT.md
```

## Stage 1 — COMPLETE / EXPLORATORY / CONSUMED

Stage ID:

```text
PCX-S1-EXPLORATORY-2026-08-12-v1
specSha256 = 20574bf430c26181fe6947a9d4ae10db86a9a37b8aec43e8c59af4fa98497165
```

Generation/full verification:

```text
games = 768
observations verified = 43,110
moves verified = 42,342
post-opening searches recomputed = 36,211
fullSearchRecomputation = true
unique historical trajectories = 685
verificationIdentityHash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
```

Frozen selection/measurement:

```text
assigned Namua = 343
assigned Mtaji = 342
unavailable assigned phase = 19
selected unique rule states = 666
selected Namua = 341
selected Mtaji = 325
duplicate selected rule states collapsed = 0
selectionHash = 64df1467410923ce900d4f46c49c61b0d19b8142c041a55394b82020c460a823
measurementHash = 5a85c54a2dcfb3bbd17bb0c806e6f7347e6dfa7c2dcd63a1ddc2cbdf536ef584
resultHash = 51e6a0f7352e553f6a66e4e1db7c867148424cdbf7954b818bf7667bfd3c2eec
```

All preregistered readiness gates passed:

```text
selected unique rule states >= 300      666 PASS
Namua selected >= 120                   341 PASS
Mtaji selected >= 120                   325 PASS
D2->D3 instability events >= 30         162 PASS
D2->D3 stable events >= 30              504 PASS
ordinary-domain D2 margins >= 200       510 PASS
```

This is a design-readiness result, not scientific confirmation.

Exploratory descriptive results, no p-values:

```text
D1->D2 instability = 205 / 666
D2->D3 instability = 162 / 666 = 24.32%
D3->D4 instability = 170 / 666
D2 exact ties = 70 / 666
ordinary-domain D2 margins = 510

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

Stage 1 is permanently ineligible for Stage 2 confirmatory reuse.

Canonical Stage 1 records:

```text
doc/position-complexity/STAGE_1_GENERATION_VERIFICATION.md
doc/position-complexity/STAGE_1_EXPLORATORY_RESULT.md
```

## Stage 2 — FORMAL DESIGN FROZEN

Stage ID:

```text
PCX-S2-FORMAL-2026-08-13-v1
```

Formal design:

```text
doc/position-complexity/STAGE_2_FORMAL_PROTOCOL.md
doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json
specSha256 = f717d3990e83bfb08b584d49b521c87d7d9a9b73692a823137b5dbaaf9bd9071
```

Fresh fixed corpus:

```text
games = 1024
seeds = 20410001..20411024
opening = seeded-uniform E.moveVariants, 8 plies
then = hard / bao / phase2 / depth2
max ply = 100
timeLimitMs = Infinity
adaptive = false
```

No Stage 1 seed/state is reused.

Frozen selection:

```text
collapse duplicate historicalTrajectoryHash
-> phase assignment using PCX-S2-PHASE-v1
-> nonterminal ply >= 8 and legalMoveCount >= 2
-> one state/trajectory using PCX-S2-STATE-v1
-> no replacement if assigned phase unavailable
-> collapse duplicate selected ruleStateKey
```

No search outcome enters state selection.

## Frozen primary PCX-H1

```text
outcome:
  D23Instability = 1 iff exact TopSet_D2 and TopSet_D3 are disjoint

predictor:
  log1pLegalMoveCount = log(1 + E.moveVariants(state).length)

covariate:
  phaseMtajiIndicator

reduced:
  D23Instability ~ 1 + phase

full:
  D23Instability ~ 1 + phase + log1pLegalMoveCount

test:
  unpenalized binomial logistic likelihood-ratio test
  df = 1
  alpha = 0.05
  two-sided
```

After primary technical/estimability gates pass:

```text
p < 0.05  -> PCX-H1 CONFIRMED
p >= 0.05 -> PCX-H1 NOT-CONFIRMED
```

A valid nonsignificant result is not `inconclusive`.

## Frozen key secondary PCX-H2

Population:

```text
finite ordinary-evaluation-domain D2 best-second margin only
```

Formal comparison:

```text
reduced:
  D23Instability ~ 1 + phase + log1pLegalMoveCount

full:
  D23Instability ~ 1 + phase + log1pLegalMoveCount + log1pD2BestSecondGap
```

H2 receives a confirmatory label only if H1 is confirmed. If H1 is not-confirmed, H2 is `not-confirmatorily-evaluated` even if computed descriptively.

## Frozen formal estimability gates

H1:

```text
selected unique rule states >= 500
Namua >= 180
Mtaji >= 180
D23 instability >= 80
D23 stable >= 80
primary models finite/converged
```

H2:

```text
ordinary-domain D2 margins >= 350
H2-subset D23 instability >= 50
H2-subset D23 stable >= 50
secondary models finite/converged
```

Gate failure yields `inconclusive` for the affected hypothesis and does not authorize extension or relaxation.

## Stage 2 tooling — VALIDATED

Dedicated tooling:

```text
tools/experiments/run-position-complexity-stage2-formal.js
tools/experiments/verify-position-complexity-stage2-formal.js
tools/experiments/analyze-position-complexity-stage2-formal.py
tools/experiments/check-position-complexity-stage2-authorization.js
test/position-complexity-stage2-formal-tooling.test.js
```

Technical CI used to freeze source/tool fingerprints:

```text
workflow = Position Complexity Research CI
run = 31673666993
job = 94363432226
result = success
validated tooling commit = 767d59b08b4772aa904058a47457ff3a822b0017
```

After the authorization record was committed, a second technical CI also passed:

```text
workflow = Position Complexity Research CI
run = 31673835352
job = 94363941841
result = success
authorization preflight = success
```

This CI generated no scientific Stage 2 corpus.

## Stage 2 formal execution — AUTHORIZED / NOT STARTED

Authorization:

```text
doc/position-complexity/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json
authorized = true
```

Canonical authorization checkpoint:

```text
doc/position-complexity/checkpoints/2026-08-13-stage2-formal-generation-authorization.md
```

Local execution runbook:

```text
doc/position-complexity/STAGE_2_FORMAL_RUNBOOK.md
```

Formal artifact root:

```text
artifacts/local/position-complexity/stage2-formal-v1/
```

Before generation, local preflight must pass:

```bash
node tools/experiments/check-position-complexity-stage2-authorization.js
```

Required scientific execution order:

```text
generate
-> full independent verification
-> frozen select
-> D2/D3 measure
-> formal analyze
```

GitHub Actions formal-corpus generation remains prohibited.

## Prohibited rescue remains in force

Do not after formal generation/outcome inspection:

- change `legalMoveCount` definition;
- include single-choice roots;
- change D2->D3 TopSet-disjoint endpoint;
- switch depth pair;
- phase-stratify or add interaction to rescue H1;
- replace assigned-phase failures;
- change salts;
- mix mate and ordinary raw margins for H2;
- substitute another ambiguity metric;
- change alpha/test family;
- append games/seeds;
- reuse Stage 1 evidence as confirmation;
- relabel a valid nonsignificant result as inconclusive.

## Next authorized action

Run the Stage 2 formal pipeline locally according to `STAGE_2_FORMAL_RUNBOOK.md`.

At the present repository state:

```text
Stage 2 corpus = NOT YET GENERATED
Stage 2 formal result = NONE
PR #29 = draft / unmerged
```
