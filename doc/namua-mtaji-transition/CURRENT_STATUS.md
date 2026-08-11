# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-11  
Status: **ACTIVE / Stage 0 closed PASS / Stage 1 protocol + instrumentation ready / local generation pending**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

新規独立研究

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

はStage 0 technical feasibilityを完了し、Stage 1 fresh exploratory temporal pilotの生成直前まで進んでいる。

現在のpause point:

> **Stage 0 = closed PASS. Stage 1 exploratory protocol is frozen before generation, and the runner / verifier / inherited Category-A extractor / temporal event-support audit are implemented. Next step is local Stage 1 generation and verification.**

まだ行っていないこと:

- Stage 1 192-game exploratory corpus generation;
- Stage 1 event-support inspection;
- formal endpoint freeze;
- formal comparator freeze;
- formal statistical unit freeze;
- formal model freeze;
- formal seed/sample-size freeze;
- preregistration;
- held-out formal corpus generation/inspection.

したがって、新研究のconfirmatory positive/negative resultはまだ存在しない。

## 1. Closed-study state inherited unchanged

### Phase-transition Study 1

```text
Study 1 = closed
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

`capture-branch-expansion` remains a bounded strategic-transition phenotype.

Frozen phenotype settings:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Classifier precedence is unchanged.

### Position-typology / playing-style Study 1

Confirmed bounded Mtaji morphology:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No refit / restandardization / relabeling is allowed.

Namua:

```text
no discrete type promoted
N-PROG = progression context only
N-ACT  = exploratory continuous coordinate
N-CON  = exploratory continuous coordinate
```

Playing style:

```text
discrete cluster set = unsupported
STYLE-C1..C4 exact 4D geometry = formal not-confirmed
```

No rescue is allowed in this study.

## 2. Cross-study bridge inherited unchanged

Frozen Stage 6 result:

```text
capture-branch-expansion = 59 unique trajectory-ply units
Namua = 59
Mtaji = 0
```

Same-ply `capture-branch-expansion ↔ MTAJI-M1/M2` was therefore not estimable. This study changes the estimand to a prospective temporal connection; it does not reinterpret the old result.

## 3. Stage 0 — CLOSED PASS

Canonical result document:

```text
doc/namua-mtaji-transition/STAGE_0_RESULT.md
```

Local technical smoke was generated from:

```text
023a8bd16ec16838e1a5f072bdc941f702f850b6
```

Artifact identity:

```text
configHash
= 49cbccf1b060afccc9148b70308484eb6c30abb8e800c8b50ec931f1e7a27492

instrumentationHash
= 12906122b3706f8e941d1a46d831335a72ac7907b349fc1e6435a30800d4c24d

summaryHash
= c64ab305cd4691a44738d3068187c453ad2b609aaabf28083aa8652d1b18f916
```

Technical evidence:

```text
games = 8
observations = 452
legal moves checked = 1878
legacy compatibility checks = 452
phase-transition events = 8
source hashes match = true
all replay/identity/phase/provenance checks = passed
```

The frozen Mtaji artifact was found and independently rehashed exactly:

```text
expected = stored = recomputed
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

All 8 smoke first-Mtaji states were technically classifiable. The technical smoke M1/M2 counts are not scientific evidence and must not be used as an effect estimate or direction.

## 4. Critical design constraints carried forward

### 4.1 8-ply phenotype ascertainment

The frozen phenotype uses future observations through `candidatePly + 8` and gives precedence to `namua-to-mtaji-precursor` when first future Mtaji occurs within 8 ply.

Therefore a frozen `capture-branch-expansion` cannot have first future Mtaji at distance `<= 8` by construction.

Formal time origin remains unfrozen. Candidate-ply time can be descriptive, while a post-ascertainment landmark such as `candidatePly + 8` remains a primary design candidate.

### 4.2 Reserve is a rule-derived transition clock

Formal Namua→Mtaji conversion occurs when both reserves are exhausted.

Therefore Stage 1 must audit actor/opponent/total reserve support before deciding whether reserve belongs in matching, stratification, covariate adjustment, or mechanistic description.

### 4.3 Multiple events are not independent plies

Stage 1 must measure:

- Category-A events per game/trajectory;
- repeated same-class events;
- mixed classes;
- overlapping 8-ply ascertainment windows;
- duplicate trajectory-ply units.

Primary statistical unit remains unfrozen.

### 4.4 Non-Mtaji outcomes remain distinct

```text
first Mtaji                    = target-event candidate
natural terminal before Mtaji = competing-event candidate
max-ply truncation             = administrative-censoring candidate
```

The formal estimator/model remains unfrozen.

## 5. Important Stage 1 semantic decision

`capture-branch-expansion` will **not** be applied directly to every ply.

The inherited phenotype belongs to the inherited Category-A candidate context.

Stage 1 therefore reproduces the historical candidacy pipeline with the historical functions and fixed values:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
non-forcing groups = reserve / mobility / capture / front
minimum active non-forcing groups = 2
cluster max gap = 1
Category A = survives forcing-excluded candidacy and is not forcing-coincident
```

Only Category-A representatives proceed to frozen phenotype classification.

This prevents semantic drift from the closed Study 1 machine definition.

## 6. Stage 1 exploratory protocol — frozen before generation

Canonical protocol:

```text
doc/namua-mtaji-transition/STAGE_1_EXPLORATORY_PILOT_PROTOCOL.md
```

Corpus identity:

```text
paired opening replicates = 32
conditions = 6
total games = 192
opening seed range = 20271001..20271032
opening plies = 8
max ply = 100
```

Conditions:

```text
P2-D1 = hard / bao / phase2 / depth1
P2-D2 = hard / bao / phase2 / depth2
P2-D3 = hard / bao / phase2 / depth3
LG-D2 = hard / bao / legacy / depth2
LG-D3 = hard / bao / legacy / depth3
V2-D2 = hard / bao-v2 / phase2 / depth2
```

Each opening seed is used once in every condition, yielding paired opening-state coverage.

This Stage 1 seed block is permanently exploratory and cannot later become the formal held-out block.

## 7. Stage 1 instrumentation now present

```text
tools/experiments/run-namua-mtaji-stage1-pilot.js
tools/experiments/verify-namua-mtaji-stage1-pilot.js
tools/experiments/extract-namua-mtaji-stage1-candidates.py
tools/experiments/analyze-namua-mtaji-stage1-events.js
```

Existing frozen Mtaji artifact audit is reused with the Stage 1 corpus path:

```text
tools/experiments/audit-namua-mtaji-mtaji-artifact.py
```

Local execution instructions:

```text
doc/namua-mtaji-transition/STAGE_1_RUNBOOK.md
```

## 8. Stage 1 allowed outputs

Stage 1 may report exploratory design support for:

- Category-A incidence;
- inherited phenotype class incidence;
- event/phase support by condition;
- candidate-to-Mtaji and post-ascertainment time support;
- reserve support/range overlap;
- terminal/truncation frequencies;
- repeated-event and overlap structure;
- first-Mtaji frozen morphology classifiability.

The event audit intentionally computes no confirmatory p-values.

## 9. Decisions intentionally still unfrozen

Do not freeze until Stage 1 evidence has been inspected and documented:

- formal target population;
- exact comparator;
- candidate-ply versus landmark time origin;
- primary statistical unit;
- repeated-event handling;
- reserve matching/stratification/covariate policy;
- survival versus competing-risk model;
- RQ2 functional/time representation;
- formal condition set;
- formal sample size;
- formal seed block;
- effect direction;
- alpha/decision threshold and multiplicity policy.

## 10. Current RQ status

### RQ1

```text
time-to-first-Mtaji = priority endpoint family
exact origin / censoring model / comparator = not frozen
```

### RQ2

```text
reserve / nyumba / mobility / front-row / capture / forcing lifecycle
feature families fixed as audit scope
functional model not frozen
```

### RQ3

```text
frozen MTAJI-M1/M2 classifier technically validated
Stage 1 first-Mtaji distribution = exploratory only
formal endpoint handling not frozen
```

### RQ4

```text
search-profile/depth coverage included in exploratory pilot
no directional formal hypothesis registered
past D2/D3 reversal remains motivation only
```

## 11. Immediate next step

Run Stage 1 locally following:

```text
doc/namua-mtaji-transition/STAGE_1_RUNBOOK.md
```

Required returned artifacts after successful completion:

```text
manifest.json
verification.json
candidate-pipeline-audit.json
stage1-event-audit.json
stage1-event-table.csv
mtaji-artifact-audit.json
```

Stage 2 design freeze begins only after these exploratory artifacts are inspected.

## Pause point

> **Stage 0 is formally closed as technical PASS. Stage 1 has been protocol-frozen before generation and fully instrumented. No Stage 1 scientific data have yet been generated or inspected. The next action is local 192-game exploratory generation, deterministic verification, inherited Category-A extraction, temporal event-support audit, and frozen first-Mtaji morphology audit.**
