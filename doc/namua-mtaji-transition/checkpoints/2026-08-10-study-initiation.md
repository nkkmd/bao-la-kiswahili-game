# Checkpoint — New independent Namua→Mtaji temporal-transition study initiated

Date: 2026-08-10  
Branch: `research/namua-mtaji-temporal-transition`  
Status: **Stage 0 design complete / no new scientific corpus generated**

## 1. Study initiated

Research title:

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

This is a prospective independent study selected from `doc/FUTURE_RESEARCH_AGENDA.md` 4.2.1.

It does not reopen either completed Study 1.

## 2. Verified source state

GitHub `main` at study initiation:

```text
c7d06d485789e1ea96d6603802423951a88c1f87
```

Commit:

```text
docs: update future research agenda after Study 1 closures
```

Research branch created directly from this SHA:

```text
research/namua-mtaji-temporal-transition
```

## 3. Canonical documents reviewed before initiation

Priority research governance:

```text
doc/FUTURE_RESEARCH_AGENDA.md
doc/RESEARCH_INDEX.md
```

Phase-transition Study 1:

```text
doc/phase-transition/STUDY_1_OVERVIEW.md
doc/phase-transition/STUDY_1_FINAL_REPORT.md
doc/phase-transition/STUDY_1_VOCABULARY.md
doc/phase-transition/FORMAL_EXPORT_INDEX.md
```

Position-typology / playing-style Study 1:

```text
doc/position-typology/STUDY_1_OVERVIEW.md
doc/position-typology/STUDY_1_FINAL_REPORT.md
doc/position-typology/STUDY_1_VOCABULARY.md
doc/position-typology/REPRODUCIBILITY_INDEX.md
doc/position-typology/MTAJI_CONFIRMED_ONTOLOGY.md
```

Cross-study bridge:

```text
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_PROTOCOL.md
doc/position-typology/STAGE_6_CROSS_STUDY_BRIDGE_SPEC.json
doc/position-typology/STAGE_6_CROSS_STUDY_ASSOCIATION_RESULT.md
```

Additional implementation/design sources inspected:

```text
doc/position-typology/STAGE_0_AUDIT.md
doc/position-typology/STAGE_0_RUNBOOK.md
doc/position-typology/STAGE_2_MTAJI_CONFIRMATION_PREREGISTRATION.md
schemas/position-typology-observation.schema.json
public/engine.js
tools/experiments/lib/phase-transition-features.js
tools/experiments/lib/forced-capture-regimes.js
tools/experiments/lib/position-typology-features.js
tools/experiments/run-phase-transition-research.js
tools/experiments/run-position-typology-smoke.js
tools/experiments/prepare-position-typology-stage6-cross-study-bridge.py
tools/experiments/replay-position-typology-stage6-candidate-states.js
```

## 4. Closed-study formal state preserved

### Phase-transition Study 1

```text
E-010 = not-confirmed
E-011 = inconclusive
E-017 = not-confirmed
E-018 / H16 = confirmed only fixed hard / bao / depth2, phase2 > legacy
E-019 / H17 = global not-confirmed
E-020 / H18 = confirmed only fixed hard / bao / depth3, legacy > phase2
```

No formal decision is modified.

`capture-branch-expansion` remains the fixed bounded strategic-transition phenotype.

`sustained-forcing window` remains retrospective Stage B vocabulary and is not adopted as a new threshold.

### Position-typology / playing-style Study 1

Confirmed bounded Mtaji ontology:

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
candidateDefinitionHash = 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Namua:

```text
no discrete position type promoted
N-ACT / N-CON = exploratory continuous coordinates
```

Playing style:

```text
discrete cluster set = unsupported
STYLE-C1..C4 exact 4D geometry = Stage 5 formal not-confirmed
```

No rescue or promotion is allowed.

## 5. Fixed bridge result preserved

Stage 6 fixed bridge:

```text
capture-branch-expansion = 59
Namua = 59
Mtaji = 0
```

This means same-ply MTAJI-M1/M2 association was not estimable in that bridge.

It does not mean expansion is universally unrelated to Mtaji or impossible in Mtaji.

The new study addresses **later temporal connection** using a fresh prospective design.

## 6. Initial new-study scope

Primary candidate questions:

1. time-to-first-Mtaji after the inherited phenotype versus a prespecified comparator;
2. continuous structural trajectory toward Mtaji;
3. first later Mtaji morphology under frozen MTAJI-M1/M2;
4. search-profile/depth relation to the new temporal endpoint, if newly preregistered.

## 7. Important pre-pilot methodological findings

### Frozen classifier imposes an 8-ply ascertainment horizon

The inherited classifier:

- uses up to 8 post-candidate ply for persistence;
- labels first future Mtaji within 8 ply as `namua-to-mtaji-precursor` before expansion classification.

Therefore `capture-branch-expansion` has a built-in support restriction relative to first Mtaji.

Decision:

> Do not freeze candidate-ply survival origin yet. Audit an ascertainment-aware landmark design before preregistration.

### Formal Mtaji is mechanically linked to reserve exhaustion

Engine transition occurs when both reserves are zero at turn completion.

Decision:

> Audit raw reserve overlap/progression before interpreting shorter time-to-Mtaji as strategic proximity.

Do not use exploratory N-PROG as if it were a confirmed state coordinate.

### Non-Mtaji outcomes require explicit endpoint handling

Decision:

> Treat natural terminal-before-Mtaji as a competing-event candidate and max-ply truncation as administrative right-censoring candidate. Do not simply drop non-Mtaji trajectories.

### Multiple candidate events may create dependent episodes

Decision:

> Do not use raw candidate rows or raw ply as independent samples. Stage 1 must audit event multiplicity and overlapping episodes before selecting the primary statistical unit.

## 8. Comparator state

The prior Stage 6 comparator:

```text
temporary-spike
capture-branch-convergence
```

is an exploratory starting candidate only.

It is **not yet frozen** for the new study.

Before freeze, Stage 1 must audit progression/reserve overlap, condition support, multiplicity, censoring behavior, and scientific coherence.

## 9. Corpus boundary

Existing formal archives:

```text
read-only
```

Allowed now:

- schema/provenance audit;
- replay technical QA;
- validation of existing published boundaries.

Not allowed:

- using old formal archives as a new held-out confirmation corpus;
- fitting new endpoint/comparator/model to maximize a new claim.

Formal claims require a fresh prospective corpus after preregistration.

## 10. Repository initialization created

New dedicated area:

```text
doc/namua-mtaji-transition/
```

Initial documents:

```text
README.md
RESEARCH_PLAN.md
CURRENT_STATUS.md
STAGE_0_AUDIT.md
checkpoints/2026-08-10-study-initiation.md
```

## 11. Next execution point

Next work should begin with implementation of technical Stage 0 only:

1. new temporal observation/game schema;
2. adapter/runner reusing position-typology primitives;
3. exact inherited classifier compatibility tests;
4. engine phase-transition regression tests;
5. deterministic replay/provenance verifier;
6. frozen MTAJI artifact locate/hash audit;
7. local smoke-only generation;
8. Stage 0 result and Stage 1 pilot protocol.

Do not generate a formal corpus yet.

## 12. Pause point

> **Research governance, scientific inheritance, branch, initial plan and Stage 0 audit design are fixed on the new branch. No new scientific result has been generated. Resume from technical schema/instrumentation implementation, not from endpoint fitting or formal corpus generation.**
