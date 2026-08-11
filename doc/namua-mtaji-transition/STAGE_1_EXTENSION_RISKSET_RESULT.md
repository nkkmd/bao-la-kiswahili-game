# Stage 1 Extension Exact-Ply Risk-Set Result

更新日: 2026-08-11  
Status: **PASS / exploratory comparator-support audit only**

## Purpose

This result closes the prespecified extension-wide exact-ply risk-set support audit from `STAGE_1_PROTOCOL_AMENDMENT_3.md`.

It does **not** test a CBE effect, inspect CBE-vs-control Mtaji morphology, or freeze a formal comparator/model.

## Input identity

Stage 1 exposure-support extension:

```text
configHash
= 38ac12979e63694b2ba36160094d94e3bef1a81a04dd84d6798133b642a6345a

games = 768
paired openings = 384
conditions = P2-D2 + V2-D2
```

The audit reported:

```text
passed = true
exposure rows = 6
unique CBE historicalTrajectoryHash + candidatePly units = 4
progression violations = 0
```

No morphology labels or morphology contrasts were used for comparator selection.

## CBE progression support audited

```text
candidate ply 24 -> landmark ply 32
candidate ply 26 -> landmark ply 34  (two distinct exposure trajectories)
candidate ply 27 -> landmark ply 35
```

All four exposure units had `forcedCaptureAtCandidate = true`.

Together with the primary-pilot risk-set audit, observed CBE clock support now spans:

```text
ply 24
ply 26
ply 27
ply 33
```

## Prespecified control families

Unchanged:

```text
R0 = same condition + exact candidate ply
R1 = R0 + no Category-A representative at that exact index
R2 = R1 + same forced-capture status
R3 = R2 + no Namua CBE anywhere in the control trajectory
```

The deterministic Namua clock ensures exact-ply matching also fixes total remaining reserve.

## Strict R3 support

All observed extension CBE units retained abundant R3 support.

```text
ply 24, P2-D2: 331 unique historical trajectories
ply 24, V2-D2: 331 unique historical trajectories

ply 26, P2-D2: 334 unique historical trajectories
ply 26, V2-D2: 334 unique historical trajectories

ply 27, P2-D2: 334 unique historical trajectories
ply 27, V2-D2: 334 unique historical trajectories
```

For the two exposure units appearing under both conditions, cross-condition trajectory collapse gives:

```text
ply 24:
  R3 condition rows represented by 493 unique historical trajectories
  169 trajectories shared across both conditions

ply 27:
  R3 condition rows represented by 501 unique historical trajectories
  167 trajectories shared across both conditions
```

The two distinct ply-26 exposure units each have 334 same-condition unique R3 controls.

## Deterministic progression check

No violations were observed.

Examples:

```text
ply 24:
  candidate total reserve = 20
  landmark total reserve = 12

ply 26:
  candidate total reserve = 18
  landmark total reserve = 10

ply 27:
  candidate total reserve = 17
  landmark total reserve = 9
```

These are deterministic clock coordinates, not survival-time outcomes.

## Duplicate-condition structure

The 768-game extension contains substantial complete-trajectory duplication:

```text
duplicate historical trajectory groups = 217
largest duplicate group = 6
P2-D2/V2-D2 shared-condition duplicate groups = 189
```

Therefore future formal units cannot treat condition rows with identical complete historical trajectories as independent observations.

## Decision

**PASS.** Exact-ply same-condition risk-set construction remains feasible across every observed extension CBE progression location.

Comparator scarcity is no longer a Stage 1 blocking issue.

The remaining blocking issue is exposure support:

```text
combined unique CBE trajectory-ply units = 5
combined unique CBE historical trajectories = 5

prespecified Stage 2 readiness minimum:
  units >= 10
  trajectories >= 8
```

Thus Stage 2 design freeze remains unauthorized.

## Interpretation boundary

This result does not authorize:

- CBE effect estimation;
- CBE-vs-control M1/M2 comparison;
- causal claims;
- formal comparator freeze;
- formal statistical-unit freeze;
- formal model freeze.

The next step may address exposure support only, with a fixed final exploratory extension and a prespecified stopping rule.