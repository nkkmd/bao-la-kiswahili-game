# Checkpoint — Extension Risk-Set PASS / Final Exposure Extension Frozen

Date: 2026-08-11

## Completed

The Stage 1 extension-wide exact-ply risk-set audit is complete and passes.

Observed extension CBE support:

```text
6 raw condition rows
4 unique historicalTrajectoryHash + candidatePly units
candidate plies = 24, 26, 26, 27
```

Strict R3 control support remains abundant:

```text
ply 24: 331 unique controls per condition
ply 26: 334 unique controls in the corresponding condition
ply 27: 334 unique controls per condition
progression violations = 0
```

Together with the primary-pilot ply-33 result, exact-ply comparator feasibility is established across all currently observed CBE clock locations.

## Combined exposure support

Primary pilot + extension #1:

```text
unique CBE trajectory-ply units = 5
unique CBE historical trajectories = 5
```

Prespecified Stage 2 readiness minimum remains:

```text
units >= 10
trajectories >= 8
```

The gate is not met and has not been relaxed.

## Decision

Stage 2 design freeze remains unauthorized.

A single **final exposure-driven Stage 1 extension** is frozen before generation:

```text
conditions = P2-D2 + V2-D2
paired openings = 768
total games = 1536
opening seeds = 20273001..20273768
opening plies = 8
max ply = 100
```

No early stopping is allowed.

No CBE-vs-control morphology effect inspection is allowed before the final support decision.

## Terminal stopping rule

After the final extension:

- if combined support reaches `>=10 units` and `>=8 trajectories`, and final exact-ply risk-set support remains adequate, proceed to Stage 2 design freeze;
- if not, do not add another exposure-targeted block under the same frozen CBE definition and P2-D2/V2-D2 family merely to reach the gate.

A failed final gate means the current prospective formal bridge is not design-ready and requires a separately justified future redesign.

## Canonical files

```text
doc/namua-mtaji-transition/STAGE_1_EXTENSION_RISKSET_RESULT.md
doc/namua-mtaji-transition/STAGE_1_FINAL_EXPOSURE_EXTENSION_PROTOCOL.md
doc/namua-mtaji-transition/STAGE_1_FINAL_EXTENSION_RUNBOOK.md

tools/experiments/run-namua-mtaji-stage1-final-extension.js
tools/experiments/verify-namua-mtaji-stage1-final-extension.js
tools/experiments/audit-namua-mtaji-stage1-final-support.js
```

## Pause point

> The extension-wide risk-set audit is PASS. Comparator scarcity is resolved across observed CBE clock positions, but combined exposure support remains 5/5 against the fixed 10/8 design-readiness minimum. One final fixed 768-paired-opening exploratory extension is now frozen. No further exposure-driven Stage 1 sampling will be authorized if that final gate fails.