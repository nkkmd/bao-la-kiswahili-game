# Stage 1 Protocol Amendment 3 — Extension-Wide Exact-Ply Risk-Set Scope

Date: 2026-08-11  
Status: **FROZEN BEFORE EXTENSION RISK-SET AUDIT**

## Reason for amendment

The fixed Stage 1 exposure-support extension is complete.

It added four independent Namua `capture-branch-expansion` trajectory-ply units at candidate plies 24, 26, and 27.

The earlier exact-ply risk-set audit established R0–R3 comparator support only for the primary-pilot CBE unit at ply 33.

Before any further game generation or Stage 2 design work, comparator positivity must therefore be checked across the newly observed CBE clock support.

## Inherited comparator families remain unchanged

This amendment does not create a new comparator definition.

The previously frozen nested support families remain exactly:

```text
R0 = same condition + exact candidate ply
R1 = R0 + control is not Category A at the exact index
R2 = R1 + same forced-capture status at candidate ply
R3 = R2 + no Namua CBE anywhere in the control trajectory
```

Progression anchor remains:

```text
exact candidate ply
```

Under the deterministic Namua clock, exact ply also fixes total remaining reserve.

## Audit population

Apply the existing risk-set support procedure to **every fully ascertained Namua CBE trajectory-ply unit in the fixed Stage 1 exposure-support extension**.

No exposure may be omitted because of:

- candidate ply;
- condition;
- structural feature values;
- later terminal status;
- later Mtaji morphology;
- number of available controls.

The audit therefore covers all extension CBE support discovered by the inherited pipeline.

Observed extension CBE clock locations are currently:

```text
ply 24
ply 26
ply 27
```

These locations define audit inputs, not a new phenotype definition.

## Outcome firewall

The risk-set audit remains support-only.

It must not:

- read or compare MTAJI-M1/MTAJI-M2 labels for comparator selection;
- compute morphology effect sizes;
- compute p-values;
- choose a comparator family based on later outcomes;
- tune matching tolerances;
- exclude difficult CBE units after seeing support.

## What may be inspected

For every extension CBE unit and every condition row in which it occurs:

- R0/R1/R2/R3 raw control rows;
- unique historical trajectories;
- forced-capture composition;
- deterministic reserve/progression integrity;
- terminal-before-Mtaji counts;
- first-Mtaji eligibility counts;
- descriptive ranges of already instrumented structural variables;
- duplicate historical trajectory structure across condition labels.

These quantities are design-support diagnostics only.

## Decision after audit

The audit may establish whether the exact-ply strategy remains feasible over the broader observed CBE clock range.

It does **not** by itself authorize Stage 2.

The previously frozen Stage 2 readiness minimum remains unchanged:

```text
>= 10 unique Namua CBE trajectory-ply units
>= 8 unique CBE-bearing historical trajectories
```

Current combined support is only:

```text
5 unique units
5 unique trajectories
```

Therefore Stage 2 remains unauthorized regardless of the risk-set result.

## Next-action boundary

No additional exploratory corpus should be generated until this extension-wide risk-set audit is inspected.

If exact-ply R3 support remains adequate across all extension CBE units, a subsequent fixed exploratory exposure-support continuation may be designed prospectively.

If support fails materially at one or more CBE clock locations, comparator design must be reconsidered before further exposure accumulation.

## Frozen statement

> **Apply the unchanged R0–R3 exact-ply support audit to every fully ascertained Namua CBE unit in the completed Stage 1 extension. Do not inspect morphology outcomes, tune matching rules, or omit poorly supported exposures. This audit is a prerequisite to any further exploratory generation and does not waive the 10-unit / 8-trajectory Stage 2 readiness gate.**
