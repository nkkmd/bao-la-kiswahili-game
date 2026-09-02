# Program Decision — G3-05 technical-invalid closure

Date: 2026-09-02  
Status: **PROGRAM-LEVEL CLOSURE RECORDED / G3-06 NOT AUTHORIZED**

## Formal decision

Research Generation 3 / G3-05 `BECT-STUDY1` is closed as:

**`CLOSED / TECHNICAL-INVALID`**

```text
Stage 0 v2 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal promoted candidate set = []
Stage 1 seed 31510001..31510240 = CONSUMED
Stage 2 seed 31520001..31520384 = NOT CONSUMED
no-rescue boundary = CROSSED / ACTIVE
protected depth-10 = SEALED / NOT GENERATED / NOT READ
```

## Cause

The exactly-one authorized fresh Stage 1 execution, workflow run `33636606641`, entered fresh measurement and then failed closed during bounded RAW enumeration with:

```text
relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529
```

The canonical `TECHNICAL-INVALID` result was durably uploaded as artifact `9849245665` before repository recovery and mirrored without scientific recomputation.

This is a technical validity result, not a negative or null finding about the existence of branch-expansion / compression transitions in Bao.

## No-rescue consequence

G3-05 Stage 1 fresh evidence has been generated/read and the seed namespace is consumed. Therefore the program does not authorize:

- same Stage 1 seed/evidence rerun;
- relay-limit handling repair followed by reclassification of BECT-STUDY1;
- seed extension or root replacement;
- post hoc endpoint/event/threshold/resource change;
- promotion from partial Stage 1 telemetry;
- G3-05 Stage 2 execution.

Any future investigation of relay-limit-safe local geometry must be a new prospective independent study/version and must not retroactively alter BECT-STUDY1.

## G3-06 boundary

Historical `PROGRAM_PLAN.md` names G3-06 as `Bao Rule-Mechanism / Geometry Intervention Study 1` and asks how capture, reserve, nyumba, Namua→Mtaji and other rule-semantic events relate to bounded local geometry.

G3-05 did **not** produce a valid promoted transition family. Therefore G3-06 may not treat BECT transition events, directions, partial telemetry or the relay-limit failure as validated scientific inputs.

At the same time, the historical G3-06 question can in principle be reformulated prospectively around independently defined rule-semantic events and formally eligible LGTGMIV bounded RAW geometry measurements without rescuing G3-05. Whether that is scientifically and technically authorized must be decided in a separate post-G3-05 current-state authorization review.

Formal program state:

**`G3-06 = NOT AUTHORIZED`**

No G3-06 Study ID, seed block, population, intervention family, endpoint set or fresh evidence may be fixed/generated/read until that separate review is completed.

## Preserved upstream evidence

The following upstream decisions remain immutable:

- `LGTGMF-STUDY1` = `CLOSED / TECHNICAL-INVALID`;
- `LGTGMIV-STUDY1` = `CLOSED / FORMAL-ELIGIBLE-ALL`, limited to RAW-only relative depth 5 F1-F5;
- `EBRWS-STUDY1` = `CLOSED / TECHNICAL-INVALID`;
- `TCTGD-STUDY1` = `CLOSED / TECHNICAL-INVALID`;
- `SFCDF-STUDY1` = `CLOSED / FORMAL-COMPLETE`, with C1 `CONFIRMED / MTAJI-GREATER` and C6 `CONFIRMED / NAMUA-GREATER` within their frozen scope;
- `BECT-STUDY1` = `CLOSED / TECHNICAL-INVALID`.

G3-04 C1/C6 are not reinterpreted as evidence for G3-05 transitions or G3-06 mechanisms.

## Next permitted program action

A **post-G3-05 G3-06 authorization review** may be performed using only current repository state, immutable upstream decisions, formally eligible measurement instruments and fresh-free design reasoning.

That review itself may not generate/read G3-06 fresh scientific evidence.
