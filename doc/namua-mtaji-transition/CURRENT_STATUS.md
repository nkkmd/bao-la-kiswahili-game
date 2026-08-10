# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-10  
Status: **ACTIVE / Stage 0 instrumentation implemented, local validation pending**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

新規独立研究

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

を開始した。

Stage 0のschema / adapter / technical smoke runner / replay verifier / engine regression test / frozen Mtaji artifact auditをrepository上へ実装済みである。

現在の停止点:

> **Stage 0 instrumentation implementation complete / local technical validation pending.**

まだ行っていないこと:

- new scientific exploratory corpus generation
- exploratory temporal association analysis
- formal endpoint freeze
- formal comparator freeze
- formal statistical unit freeze
- formal seed freeze
- statistical model freeze
- preregistration
- held-out formal corpus generation/inspection

したがって、このbranch上には新研究のpositive/negative scientific resultはまだ存在しない。

## Main head verification

研究開始時GitHub `main`:

```text
c7d06d485789e1ea96d6603802423951a88c1f87
docs: update future research agenda after Study 1 closures
```

このSHAを研究開始provenanceとして固定する。

## Closed-study state inherited unchanged

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

`capture-branch-expansion`はbounded strategic-transition phenotypeとして固定する。

Frozen classifier settings:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Classifier precedenceもclosed moduleからそのまま継承し、変更しない。

`sustained-forcing window`はretrospective Stage B interpretationであり、新研究のfitted thresholdではない。

### Position-typology / playing-style Study 1

```text
research complete / final integration complete
```

Confirmed bounded Mtaji classifier:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No refit / restandardization / relabeling.

Namua:

```text
no discrete type promoted
N-PROG = progression context
N-ACT  = exploratory continuous coordinate
N-CON  = exploratory continuous coordinate
```

Playing style:

```text
discrete cluster set = unsupported
STYLE-C1..C4 exact 4D geometry = formal not-confirmed
```

No rescue is allowed in this study.

## Cross-study bridge inherited unchanged

Frozen Stage 6 result:

```text
capture-branch-expansion = 59 unique trajectory-ply units
Namua = 59
Mtaji = 0
```

Same-ply `capture-branch-expansion ↔ MTAJI-M1/M2` was therefore not estimable. The new study addresses the unestimated **future temporal connection** prospectively and does not reinterpret this zero-overlap result.

## Critical pre-pilot methodological findings

### 1. Frozen phenotype has an 8-ply future ascertainment window

The existing classifier uses observations through `candidatePly + 8` and gives precedence to `namua-to-mtaji-precursor` when first later Mtaji occurs within 8 ply.

Therefore a frozen `capture-branch-expansion` cannot, by definition, have first later Mtaji at distance `<= 8` ply.

Consequently the formal time origin remains unfrozen. Candidate-ply time may be retained descriptively, but an ascertainment-aware landmark such as `candidatePly + 8` must be evaluated before preregistration.

### 2. Formal Mtaji is mechanically linked to reserve exhaustion

`public/engine.js` transitions from Namua to Mtaji when both reserves are zero at turn completion.

Therefore any temporal association must distinguish strategic structure from rule-derived progression. Stage 1 must audit raw actor/opponent/total reserve support; N-PROG is not upgraded to a confirmed coordinate.

### 3. Non-Mtaji outcomes require explicit treatment

Current candidate event-state distinction:

```text
first Mtaji                     = target event candidate
natural terminal before Mtaji  = competing-event candidate
max-ply truncation              = administrative censoring candidate
```

The exact survival / competing-risk model remains unfrozen until Stage 1 support is known.

## Stage 0 implementation now present

```text
schemas/namua-mtaji-transition-observation.schema.json
schemas/namua-mtaji-transition-game.schema.json

tools/experiments/lib/namua-mtaji-transition-features.js
tools/experiments/run-namua-mtaji-transition-smoke.js
tools/experiments/verify-namua-mtaji-transition-smoke.js
tools/experiments/audit-namua-mtaji-mtaji-artifact.py

test/namua-mtaji-transition-features.test.js
test/namua-mtaji-transition-engine.test.js

doc/namua-mtaji-transition/STAGE_0_RUNBOOK.md
```

Implementation checkpoint:

```text
doc/namua-mtaji-transition/checkpoints/2026-08-10-stage0-instrumentation-implemented.md
```

## Stage 0 compatibility design

The new research does not edit closed-study feature/classifier modules.

For every smoke replay state:

1. compute the position-typology observation;
2. independently compute the legacy phase-transition observation;
3. require equality for inherited phenotype inputs and state quantities;
4. replay the stored move and require before/after identity hashes;
5. recompute game-level temporal outcome.

Compatibility checks cover at least:

- phase
- reserve / houseOwned / pending
- historical state hash
- legal move count
- capture move count
- forced-capture state
- board/non-empty seed summaries
- front-row occupancy and seed counts

This guards against semantic drift when the new study composes both prior research infrastructures.

## Frozen Mtaji artifact audit

RQ3 requires the historical `mtaji-candidate-definition.json` artifact.

The Stage 0 audit requires all of the following:

```text
stored candidateDefinitionHash = expected hash
canonical recomputation hash   = expected hash
representation dimensions      = 40
field order                    = exact frozen order
scaler                         = frozen discovery scaler
centroids                      = frozen discovery centroids
canonical labels               = MTAJI-M1 / MTAJI-M2
```

If the artifact is unavailable, it is not reconstructed from smoke or held-out data. RQ3 must remain unauthorized/deferred until provenance is restored.

## Current RQ status

### RQ1

```text
time-to-first-Mtaji = priority endpoint family
exact time origin / estimator / model = not frozen
```

### RQ2

```text
reserve / nyumba / mobility / front-row / capture / forcing lifecycle
feature families identified
functional/time representation not frozen
```

### RQ3

```text
frozen MTAJI-M1/M2 classifier authorized in principle
historical artifact exact-hash local audit pending
```

### RQ4

```text
secondary/formal candidate only
no direction preregistered
past D2/D3 reversal = motivation only
```

## Decisions intentionally not made yet

Do not freeze before Stage 0/1 evidence:

- exact comparator;
- candidate-ply versus landmark time origin;
- survival versus competing-risk model;
- primary statistical unit;
- multiple-event policy;
- reserve matching/stratification/covariate policy;
- formal condition set;
- sample size;
- formal seed block;
- effect direction;
- significance/decision threshold;
- RQ2 smoothing/window/functional form.

## Immediate next step — local Stage 0 validation

Follow:

```text
doc/namua-mtaji-transition/STAGE_0_RUNBOOK.md
```

Required local outputs:

```text
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/manifest.json
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/verification.json
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/mtaji-artifact-audit.json
```

These are technical QA artifacts, not scientific evidence.

## Stage 0 completion gate

Stage 0 is not complete until:

1. new-study unit tests pass;
2. inherited critical regression tests pass;
3. technical smoke completes;
4. full replay/recomputation passes;
5. legacy/new observation compatibility passes;
6. formal phase-transition engine regression passes;
7. first-Mtaji reserve exhaustion/linkage passes;
8. terminal-before-Mtaji and max-ply truncation remain distinguishable;
9. source provenance passes;
10. frozen Mtaji artifact exact hash passes, or RQ3 defer is formally recorded.

## Pause point

> **Stage 0 instrumentation has been implemented on the research branch. No scientific pilot or formal corpus has been generated. Local unit/regression tests, technical smoke, replay verification, and frozen Mtaji artifact audit are now required. Formal endpoint, comparator, statistical unit, model, and seed block remain deliberately unfrozen.**
