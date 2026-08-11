# Namua→Mtaji Strategic Temporal Transition — Current Status

更新日: 2026-08-11  
Status: **ACTIVE / Stage 0 closed PASS / Stage 1 pre-generation protocol amended / local generation pending**  
Branch: `research/namua-mtaji-temporal-transition`  
Base main head at study start: `c7d06d485789e1ea96d6603802423951a88c1f87`

## Current state

研究題目:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

Stage 0 technical feasibility is closed as PASS.

Stage 1 fresh exploratory pilot has been protocol-frozen before generation, but a **pre-generation engine-level amendment** was added after proving that the standard Namua→Mtaji transition clock is deterministic.

Current pause point:

> **No Stage 1 games have yet been generated. The exploratory corpus/instrumentation is ready, but the study no longer treats time-to-first-Mtaji as a candidate survival endpoint. The next action is local Stage 1 generation followed by deterministic-clock, replay, inherited-candidacy, event-support, and frozen-Mtaji audits.**

## 1. Closed-study boundaries remain unchanged

### Phase-transition Study 1

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

Frozen `capture-branch-expansion` settings:

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

Classifier order remains unchanged.

### Position-typology / playing-style Study 1

Confirmed bounded Mtaji classifier:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

No refit / restandardization / relabeling.

Namua discrete type remains unsupported; N-ACT/N-CON remain exploratory. Playing-style STYLE-C1..C4 exact 4D geometry remains formal not-confirmed.

## 2. Stage 0 — CLOSED PASS

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_0_RESULT.md
```

Local technical artifacts were generated from:

```text
023a8bd16ec16838e1a5f072bdc941f702f850b6
```

Identity:

```text
configHash
= 49cbccf1b060afccc9148b70308484eb6c30abb8e800c8b50ec931f1e7a27492
summaryHash
= c64ab305cd4691a44738d3068187c453ad2b609aaabf28083aa8652d1b18f916
```

Technical verification:

```text
8 games
452 observations
1878 legal moves checked
452 legacy compatibility checks
8 phase-transition events
all replay/identity/phase/provenance checks = passed
source hashes match = true
```

Frozen Mtaji artifact:

```text
expected = stored = recomputed
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

No refit, restandardization, or relabeling occurred.

## 3. Deterministic Namua clock — critical pre-generation finding

Engine re-audit established:

```text
initial reserve = [22, 22]
initial player = 0
```

Every non-pass Namua move decrements the current player's reserve by exactly 1, and normal turn completion alternates the player.

Formal phase conversion occurs when:

```text
reserve[0] == 0 && reserve[1] == 0
```

Therefore, for a standard trajectory that does not terminate during Namua:

```text
first Mtaji observation ply = 44
```

Stage 0 smoke independently showed first Mtaji at ply 44 in all 8/8 games.

### Consequence

For a surviving Namua candidate at ply `t`:

```text
candidate-to-first-Mtaji = 44 - t
```

This is a deterministic progression coordinate, not a variable survival time.

Therefore the study must not use a first-Mtaji hazard/survival model to claim that CBE accelerates or delays formal phase transition.

Canonical amendment:

```text
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_1.md
```

## 4. Revised temporal research target

The new study now separates:

### A. Temporal localization

Where inherited candidate classes occur on the fixed Namua progression clock.

Candidate ply and total remaining reserve encode essentially the same clock information and must not be treated as independent evidence.

### B. Post-ascertainment structural carry-through

How board/legal-move/forced-capture structure evolves from the fully ascertained phenotype landmark:

```text
candidatePly + 8
```

toward the fixed formal boundary at ply 44.

### C. First Mtaji morphology

Whether progression-matched trajectories containing `capture-branch-expansion` reach a different frozen first-Mtaji morphology than a prespecified progression-matched comparator.

This is now a stronger candidate family for the later formal bridge than raw time-to-first-Mtaji.

No formal primary endpoint is frozen yet.

## 5. Additional inherited-classifier implication

Because `namua-to-mtaji-precursor` has precedence when first Mtaji is within 8 ply and first Mtaji is fixed at ply 44 for surviving games:

```text
candidatePly >= 36
```

falls inside the precursor window.

Thus a surviving-trajectory `capture-branch-expansion` cannot occur at candidate ply 36 or later under the frozen classifier.

This is a structural consequence of the machine definition and fixed phase clock, not an empirical discovery about late-Namua strategy.

## 6. Category-A semantic preservation

`capture-branch-expansion` is not applied to every ply.

Only inherited Category-A candidate representatives proceed to phenotype classification.

Historical candidacy is reused unchanged:

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
non-forcing groups = reserve / mobility / capture / front
minimum active non-forcing groups = 2
cluster max gap = 1
Category A = survives forcing-excluded candidacy and is not forcing-coincident
```

## 7. Stage 1 exploratory corpus identity

No Stage 1 game has yet been generated.

Pre-generation corpus identity remains:

```text
paired opening replicates = 32
conditions = 6
total games = 192
opening seeds = 20271001..20271032
opening plies = 8
max ply = 100
```

Conditions:

```text
P2-D1
P2-D2
P2-D3
LG-D2
LG-D3
V2-D2
```

The Stage 1 seed block is permanently exploratory and cannot be reused formally.

## 8. Stage 1 instrumentation

```text
tools/experiments/run-namua-mtaji-stage1-pilot.js
tools/experiments/verify-namua-mtaji-stage1-pilot.js
tools/experiments/audit-namua-mtaji-stage1-clock.js
tools/experiments/extract-namua-mtaji-stage1-candidates.py
tools/experiments/analyze-namua-mtaji-stage1-events.js
tools/experiments/audit-namua-mtaji-mtaji-artifact.py
```

Runbooks:

```text
doc/namua-mtaji-transition/STAGE_1_RUNBOOK.md
doc/namua-mtaji-transition/STAGE_1_RUNBOOK_AMENDMENT_1.md
```

## 9. Stage 1 required design audits

Stage 1 may inspect only exploratory design support:

- Category-A event availability;
- inherited phenotype class availability;
- progression/candidate-ply support;
- shared progression support for comparator construction;
- repeated/mixed event structure;
- overlapping 8-ply ascertainment windows;
- early terminal-before-Mtaji frequency;
- post-ascertainment structural support;
- first-Mtaji frozen M1/M2 classifiability and exploratory counts;
- condition coverage.

Raw candidate-to-Mtaji distances remain only deterministic clock diagnostics.

## 10. Decisions still intentionally unfrozen

Do not freeze until Stage 1 exploratory evidence is inspected:

- formal target population;
- progression representation used for matching/stratification;
- exact comparator;
- primary statistical unit;
- repeated-event handling;
- early-terminal handling;
- post-ascertainment structural endpoint/model;
- first-Mtaji morphology endpoint/model;
- formal condition set;
- formal sample size;
- disjoint formal seed block;
- effect direction;
- decision threshold/multiplicity policy.

A standard first-Mtaji survival model is no longer on the candidate-primary list.

## 11. Immediate next local step

Follow both:

```text
doc/namua-mtaji-transition/STAGE_1_RUNBOOK.md
doc/namua-mtaji-transition/STAGE_1_RUNBOOK_AMENDMENT_1.md
```

After successful generation and verification, return:

```text
manifest.json
verification.json
clock-audit.json
candidate-pipeline-audit.json
stage1-event-audit.json
stage1-event-table.csv
mtaji-artifact-audit.json
```

## Pause point

> **Stage 0 is closed PASS. Before any Stage 1 data generation, engine semantics showed that first Mtaji is fixed at ply 44 for surviving standard trajectories. The study was prospectively amended: raw time-to-first-Mtaji is no longer a meaningful candidate survival endpoint. Stage 1 will instead audit progression-matched temporal localization, post-ascertainment structural carry-through, and first-Mtaji morphology feasibility. Local Stage 1 generation is now the next action.**
