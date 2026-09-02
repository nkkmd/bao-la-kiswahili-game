# Program Decision — G3-06 technical-invalid closure

Date: 2026-09-03  
Status: **PROGRAM-LEVEL CLOSURE RECORDED / G3-07 NOT AUTOMATICALLY AUTHORIZED**

## Formal decision

Research Generation 3 / G3-06 `BRMGI-STUDY1` is closed as:

**`CLOSED / TECHNICAL-INVALID`**

```text
Stage 0 v1 = TECHNICAL-INVALID / NO RERUN
Stage 0 v2 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID
formal promoted candidate set = []
Stage 1 seed 31610001..31610256 = CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed 31620001..31620384 = NOT CONSUMED
no-rescue boundary = CROSSED / ACTIVE
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

## Stage 1 failure

The exactly-one authorized fresh Stage 1 execution was workflow run `33679269612`.

Authorization, source binding and durable pre-computation lease all passed. After fresh Stage 1 seed access, the mandatory production / independent event-unit selection comparison failed with:

```text
production/independent selection mismatch
```

The canonical result is `TECHNICAL-INVALID`. The failure occurred before geometry measurement; telemetry contains no measured-unit timing rows and no production/independent resource summaries.

This failure is not a null or negative scientific result about capture, nyumba, reserve exhaustion or Namua→Mtaji geometry change.

## No-rescue consequence

Fresh Stage 1 access occurred and the Stage 1 namespace is consumed. The program does not authorize:

- same Stage 1 seed/evidence rerun;
- selector/event-unit implementation repair followed by BRMGI-STUDY1 reclassification;
- seed extension or favorable unit replacement;
- event/control grammar changes;
- endpoint additions/substitutions;
- threshold/resource changes;
- promotion from partial selection provenance;
- Stage 2 execution.

A future study may redesign selection verification only as a new prospective independent Study/version with new evidence. It must not alter the BRMGI-STUDY1 decision.

## Preserved upstream boundaries

- `LGTGMIV-STUDY1` remains `CLOSED / FORMAL-ELIGIBLE-ALL`, limited to F1-F5 / RAW-only / relative depth 5.
- `TCTGD-STUDY1` remains `CLOSED / TECHNICAL-INVALID`, promoted set `[]`.
- `SFCDF-STUDY1` remains `CLOSED / FORMAL-COMPLETE`, C1 `CONFIRMED / MTAJI-GREATER`, C6 `CONFIRMED / NAMUA-GREATER` within its frozen scope.
- `BECT-STUDY1` remains `CLOSED / TECHNICAL-INVALID`, promoted set `[]`.
- G3-06 does not reinterpret G3-04 C1/C6 or rescue G3-05.

## G3-07 boundary

Historical `PROGRAM_PLAN.md` names G3-07 as Search Instability / Local Geometry Mechanism Study 1.

G3-06 did not produce a valid promoted rule-mechanism candidate family. Therefore G3-07 may not treat BRMGI selection diagnostics, event directions or any unmaterialized Stage 1 candidate information as validated scientific inputs.

G3-07 is **not automatically authorized** by this closure. A separate post-G3-06 current-state authorization review is required before any G3-07 Study ID, fresh seed, population, endpoint or scientific evidence is fixed/generated/read.

## Protected evidence

The standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ`**

## Repository boundary

This closure is recorded on the G3-06 research branch. `main` integration is not performed without explicit user instruction.
