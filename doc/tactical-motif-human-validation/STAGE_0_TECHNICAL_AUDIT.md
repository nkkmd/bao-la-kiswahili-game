# Stage 0 Technical Audit — Tactical Motif Human / Expert Validation Study 1

Date: 2026-08-16  
Stage ID: `TMHV-S0-DESIGN-2026-08-16-v1`  
Scientific human inference: **NOT AUTHORIZED**

## 1. Repository source-of-truth audit

Current `main` at Stage 0 start:

`3cc40d83917660dd815c785ff0e0c754666d9a0e`

It matched the study-initiation reference SHA exactly. Repository state, not prior chat/working tree, was used as the source of truth.

## 2. C03 identity recovery

Canonical Stage 1 rank: `5`

Candidate key:

`7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba`

Frozen definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

Historical fresh formal evidence:

```text
n = 1272
structural success = 1245/1272 = 0.978774
D3 top-set = 937/1272 = 0.736635
D3 >= state median = 0.869497
D3 unique worst = 0.070755
opening prefixes = 1121
generation strata = 6/6
formal decision = CONFIRMED
```

These quantities are machine evidence only and are not human outcomes.

## 3. Existing technical capabilities relevant to human stimuli

### Exact rule-state reconstruction — PASS

Tactical Motifs Stage 2 observations serialize pits, reserve, house ownership, player, phase, winner/reason, turn and pending state. `stateFromObservation()` reconstructs an engine-consumable rule state.

### Candidate matching — PASS

`tactical-motif-stage2-formal.js` exposes deterministic candidate precondition and exact move-abstraction matching. C03 eligibility can therefore be selected without using future human responses.

### Fresh generation — PASS

Existing Stage 2 corpus tooling demonstrates deterministic seed-based diversified trajectory generation, exact opening-prefix identity, full replay/search verification and one-root-per-trajectory selection. New study tooling must use a distinct Stage 1 contract/source hash and fresh seeds.

### Position rendering — FEASIBLE / STUDY UI REQUIRED

`public/main.js` already defines deterministic board orientation, pit labels, reserves and phase display. `public/diagnostics.js` supports position-state serialization/roundtrip. However the gameplay UI highlights legal moves and includes interaction/context not suitable for blinded formal stimuli.

A dedicated static human-study renderer is therefore required; this is an implementation task, not a conceptual blocker.

### Local artifact boundary — PASS WITH PRIVACY CAVEAT

`.gitignore` excludes `artifacts/local/`. This prevents ordinary Git inclusion of local study artifacts, but it is not a substitute for secure private storage of identifiable human data.

## 4. Pseudoreplication audit

Risk: many positions rated by the same small expert cohort can create a falsely large nominal `n`.

Mitigation: primary inferential unit is participant; repeated blocks are aggregated within participant. Position/block variation remains design/measurement replication, not independent expert replication.

## 5. Opening leakage audit

Risk: experts recognize opening sequence rather than transferable motif.

Mitigation: primary condition is position-only. Opening prefix is used internally for diversity/non-overlap audits but not shown to participants.

## 6. Confirmation-bias audit

Risk: revealing C03/machine-confirmed status induces support.

Mitigation:

- no C03/machine/tesuji terminology before uncued tasks;
- primary discrimination precedes move-choice explanation/label tasks;
- fresh controls are selected without human outcomes;
- C01/C02/C04 are not used as outcome-convenient primary controls;
- negative human result is valid and cannot alter machine confirmation.

## 7. Technical gaps before Stage 2

Required Stage 1 implementation:

1. new fresh corpus spec/authorization/runner/verifier;
2. C03 target and near-miss control selector;
3. deterministic matching audit;
4. stimulus identity manifest and no-reuse audit;
5. dedicated position-only renderer;
6. questionnaire/randomization/export format;
7. consent/eligibility/competence-screen instrument;
8. secure human response storage/export boundary;
9. Stage 2 preregistration validator.

## 8. Stage 0 conclusion

**PASS FOR CONTINUING TO STAGE 1 MACHINE/INSTRUMENT DEVELOPMENT.**

The research question is technically operationalizable without reusing Study 1 formal roots. Existing engine/state/search infrastructure is sufficient to construct fresh states and reconstruct/render them, while a dedicated blinded instrument remains to be built.

**Human data collection is not authorized.** Recruitment feasibility and applicable ethics determination remain preconditions for Stage 2.
