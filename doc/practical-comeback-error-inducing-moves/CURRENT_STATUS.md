# PCEM-STUDY1 — Current Status

Updated: 2026-08-25

## Study identity

```text
studyId = PCEM-STUDY1
slug = practical-comeback-error-inducing-moves
branch = research/practical-comeback-error-inducing-moves
studyStartMainHead = 587472b7e1a3f6e390cdfea6ed0d8e0971d5711d
```

## Current stage

```text
study = ACTIVE-PROTOCOL-DEVELOPMENT
Stage 0 = NOT-YET-EXECUTED
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
scientificOutcomeGenerated = false
```

## Fixed at research start

1. The study is prospective and independent; no upstream decision may be rescued or re-adjudicated.
2. Authoritative state identity is RAW-ONLY: `pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`.
3. Missing `pending` is invalid before engine entry.
4. Seed conservation is mandatory: `sum(pits) + sum(reserve) + sum(pending) = 64`.
5. Symmetry reduction and transform-based deduplication are forbidden.
6. Strongest-policy quality, practical comeback frequency, reply narrowness, error dependence, machine reply difficulty and move optimality gap are separate constructs.
7. Human difficulty/psychology claims are outside scope unless a future separately authorized human study is performed.
8. Stage 0 is technical-only.
9. Stage 1 and Stage 2 must use fresh non-overlapping evidence blocks.
10. Stage 1 zero promoted candidates is a legitimate outcome and does not authorize rescue.
11. No merge, auto-merge or branch deletion is authorized without explicit user instruction.

## Measurement decisions still requiring prospective freeze before Stage 1

The following are intentionally not fixed from scientific outcomes at study start. They must be resolved using technical identifiability/resource evidence only and frozen before any Stage 1 outcome inspection:

- exact disadvantaged-root eligibility rule and phase quotas;
- exact strong/reference search/policy configuration;
- exact primary imperfect-opponent policy and any secondary strength conditions;
- bounded-horizon comeback endpoint and horizon;
- exact definition of successful defense, best reply and punishing reply;
- reply-narrowness and machine-operational reply-difficulty metrics;
- move optimality-gap normalization and allowed near-best/inferior range;
- continuation replicate count and common-random-number binding;
- Stage 1 candidate feature universe, interaction order and promotion thresholds;
- resource caps and Stage 1/Stage 2 seed blocks;
- Stage 2 estimability, confirmation floors, tests and multiplicity correction.

## Immediate next step

Implement and run Stage 0 technical validation only. Stage 0 must not inspect or report scientific candidate prevalence or a comeback-effect result. After Stage 0 passes, freeze the complete Stage 1 design before generating or inspecting Stage 1 scientific outcomes.
