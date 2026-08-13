# Position Complexity / Difficulty Study — Current Status

更新日: 2026-08-13  
Status: **ACTIVE / STAGE 1 COMPLETE / STAGE 2 FORMAL DESIGN FROZEN / FORMAL GENERATION LOCKED PENDING TOOL VALIDATION**

## Research identity

```text
research title = Baoにおける局面複雑度の多層構造 — structural complexity, search instability, and decision ambiguity の分離
branch = research/position-complexity-difficulty
base main head = d681b4593242973fcb33805edca12eb3e8633653
draft PR = #29
Stage 0 = COMPLETE / TECHNICAL PASS
Stage 1 = COMPLETE / EXPLORATORY / CONSUMED
Stage 2 = FORMAL DESIGN FROZEN / CORPUS NOT GENERATED
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

Stage 0 gates G0-1..G0-9 passed. Existing search behavior remained protected.

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

Generation verification:

```text
games = 768
observations verified = 43,110
moves verified = 42,342
post-opening searches recomputed = 36,211
full search recomputation = true
unique historical trajectories = 685
verification identity hash = b74a48c2c88fc46f48507245ec08f3da820ba4bd2fc5edb7d08bf6574924784f
```

Frozen selection result:

```text
assigned Namua = 343
assigned Mtaji = 342
unavailable assigned phase = 19
selected unique rule states = 666
selected Namua = 341
selected Mtaji = 325
duplicate selected rule states collapsed = 0
selectionHash = 64df1467410923ce900d4f46c49c61b0d19b8142c041a55394b82020c460a823
```

Measurement result:

```text
selected states = 666
completed measurements = 666
measurementHash = 5a85c54a2dcfb3bbd17bb0c806e6f7347e6dfa7c2dcd63a1ddc2cbdf536ef584
resultHash = 51e6a0f7352e553f6a66e4e1db7c867148424cdbf7954b818bf7667bfd3c2eec
```

Canonical Stage 1 records:

```text
doc/position-complexity/STAGE_1_GENERATION_VERIFICATION.md
doc/position-complexity/STAGE_1_EXPLORATORY_RESULT.md
```

### Stage 1 readiness gates

All preregistered design-estimability gates passed:

```text
selected unique rule states >= 300      666 PASS
Namua selected >= 120                   341 PASS
Mtaji selected >= 120                   325 PASS
D2->D3 instability events >= 30         162 PASS
D2->D3 stable events >= 30              504 PASS
ordinary-domain D2 margins >= 200       510 PASS
```

This is a readiness result, not scientific confirmation.

### Stage 1 exploratory measurement summary

Prediction instability:

```text
D1->D2 events = 205 / 666
D2->D3 events = 162 / 666 = 24.32%
D3->D4 events = 170 / 666
```

Decision ambiguity at D2:

```text
exact ties = 70 / 666
ordinary-domain best-second margins = 510
ordinary margin median = 91
ordinary margin p90 = 403.1
```

Exploratory descriptive correlations, no p-values:

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

These directions may motivate/freeze the formal design but are not confirmation.

Stage 1 is permanently ineligible for Stage 2 confirmatory reuse.

## Stage 2 — FORMAL DESIGN FROZEN

Stage ID:

```text
PCX-S2-FORMAL-2026-08-13-v1
```

Canonical formal design:

```text
doc/position-complexity/STAGE_2_FORMAL_PROTOCOL.md
doc/position-complexity/preregistration/STAGE_2_FORMAL_SPEC.json
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

### Frozen Stage 2 selection

```text
collapse duplicate historicalTrajectoryHash
-> phase assignment using salt PCX-S2-PHASE-v1
-> eligible nonterminal ply >= 8 and legalMoveCount >= 2
-> one state/trajectory by salt PCX-S2-STATE-v1
-> no replacement if assigned phase unavailable
-> collapse duplicate selected ruleStateKey
```

No outcome enters selection.

### Frozen primary hypothesis PCX-H1

Outcome:

```text
D23Instability = 1 iff exact TopSet_D2 and TopSet_D3 are disjoint
```

Predictor:

```text
log1pLegalMoveCount = log(1 + E.moveVariants(state).length)
```

Covariate:

```text
phaseMtajiIndicator
```

Formal test:

```text
unpenalized binomial logistic likelihood-ratio test
reduced: D23Instability ~ 1 + phase
full:    D23Instability ~ 1 + phase + log1pLegalMoveCount
df = 1
alpha = 0.05
two-sided association
```

Decision after all primary gates pass:

```text
p < 0.05  -> PCX-H1 CONFIRMED
p >= 0.05 -> PCX-H1 NOT-CONFIRMED
```

A valid nonsignificant result is not `inconclusive`.

### Frozen key secondary PCX-H2

Population:

```text
finite ordinary-evaluation-domain D2 best-second margin only
```

Predictor added:

```text
log1pD2BestSecondGap
```

Formal model comparison:

```text
reduced: D23Instability ~ 1 + phase + log1pLegalMoveCount
full:    D23Instability ~ 1 + phase + log1pLegalMoveCount + log1pD2BestSecondGap
```

H2 receives a confirmatory label only if H1 is confirmed. If H1 is not-confirmed, H2 is `not-confirmatorily-evaluated` even if computed descriptively.

### Frozen formal estimability gates

Primary:

```text
selected unique rule states >= 500
Namua selected >= 180
Mtaji selected >= 180
D23 instability events >= 80
D23 stable events >= 80
primary models finite/converged
```

H2:

```text
ordinary-domain D2 margins >= 350
H2-subset instability events >= 50
H2-subset stable events >= 50
secondary models finite/converged
```

Gate failure yields `inconclusive` for the affected formal decision and does not authorize extension or relaxation.

### Fixed sample-size planning

Stage 1 availability projected to 1024 games gives approximately:

```text
selected states ~ 888
D23 instability events ~ 216
D23 stable events ~ 672
ordinary D2 margins ~ 680
```

These are planning projections only. Stage 2 always stops at exactly 1024 games.

## Stage 2 generation remains LOCKED

The scientific protocol is frozen, but formal generation is not yet authorized.

Required next:

1. implement dedicated Stage 2 formal runner;
2. implement independent full verifier;
3. implement frozen H1/H2 analyzer;
4. add technical unit/smoke tests;
5. pass technical CI;
6. freeze source/tool hashes;
7. create explicit formal-generation authorization record and runbook.

Until all seven are complete:

```text
Stage 2 corpus = NOT GENERATED
Stage 2 formal inference = NOT STARTED
```

## Prohibited rescue remains in force

Do not after outcome inspection:

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
- reuse Stage 1 evidence as confirmation.

Draft PR #29 remains open/draft and should not be merged solely because Stage 1 readiness passed.
