# CURRENT_STATUS — Tactical Motif Human / Expert Validation Study 1

Updated: 2026-08-16

## Current state

**STAGE 0 COMPLETE — DESIGN COMPLETE / HUMAN DATA COLLECTION NOT STARTED**

Stage 0でrepository source of truth、C03 identity、construct、expert eligibility、fresh stimulus strategy、controls、blinding、participant-level statistics、ethics/privacy boundaryを復元・設計した。

## Repository baseline

Current `main` at study start:

`3cc40d83917660dd815c785ff0e0c754666d9a0e`

This exactly matched the SHA supplied at study initiation. No intervening main delta existed at Stage 0 start.

Study branch:

`research/tactical-motif-human-validation`

## Historical evidence boundary

Immutable Tactical Motifs Study 1 decisions:

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

C03 machine evidence remains `CONFIRMED` regardless of this study's future human result.

Human/expert evidence is currently:

```text
humanExpertEvidence = NOT-YET-COLLECTED
```

## Stage 0 readiness result

- C03 canonical definition recovery: **PASS**
- historical decision immutability audit: **PASS**
- exact rule-state reconstruction feasibility: **PASS**
- fresh independent state generation feasibility: **PASS**
- position-only board rendering feasibility: **PASS WITH NEW STUDY UI REQUIRED**
- matched-control construction feasibility: **PASS / Stage 1 empirical pool audit required**
- pseudoreplication-safe participant-level formal strategy: **DESIGNED**
- expert eligibility rule: **DESIGNED BEFORE OUTCOME DATA**
- ethics/privacy boundary: **DESIGNED; local/institutional ethics determination still required before recruitment where applicable**
- expert recruitment feasibility: **UNKNOWN / MUST BE ESTABLISHED WITHOUT RELAXING CRITERIA**

## Authorization state

Authorized now:

- Stage 1 machine-only stimulus/instrument infrastructure work
- technical rendering and state reconstruction tests
- non-scientific UI dry runs that do not produce human endpoint data

Not authorized now:

- expert recruitment for scientific participation
- formal human responses
- Stage 2 inference
- any `human/expert validated tesuji` claim

## Stage 1 reserved machine stimulus population

Provisional frozen Stage 1 pool contract:

```text
games = 1536
seeds = 22100001..22101536
six generation strata x 256
first 8 plies seeded-uniform exact moveVariants
max ply = 100
no extension
no replacement
```

This pool is new and non-overlapping with Tactical Motifs Study 1 seed blocks. It is for stimulus/instrument development and formal-stimulus freeze; it is not human outcome data.

## Next required work

1. Implement Stage 1 fresh corpus generator/independent verifier under a new source-hash boundary.
2. Implement candidate/control selector and matching audit.
3. Build position-only study renderer/questionnaire separated from the gameplay UI.
4. Validate stimulus identity, orientation, legal-move rendering, and randomized presentation.
5. Produce consent/information materials and record applicable ethics determination.
6. Establish recruitment feasibility under frozen expert criteria.
7. Freeze Stage 2 machine-readable preregistration before any formal human response.

If minimum expert recruitment is not feasible, stop at:

`DESIGN COMPLETE / HUMAN DATA COLLECTION NOT STARTED`

Do not loosen expert criteria to rescue estimability.
