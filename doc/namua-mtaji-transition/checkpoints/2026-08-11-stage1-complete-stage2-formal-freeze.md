# Checkpoint — Stage 1 complete / Stage 2 formal design frozen

Date: 2026-08-11

## Stage 1 final disposition

The final fixed exposure-support extension completed successfully.

Final-extension technical identity:

```text
source commit = 0f1ad87b5e0340e051003d2dfc81e32af3127cd8
games = 1536
observations = 84787
verification = PASS
clock violations = 0
```

Combined Stage 1 independent CBE support:

```text
unique CBE trajectory-ply units = 14
unique CBE historical trajectories = 14
```

Prospectively frozen readiness requirement:

```text
>= 10 units
>= 8 trajectories
```

Result:

```text
PASS
```

The threshold was not relaxed.

## Final comparator review

The final-extension exact-ply audit included all 9 unique final-extension CBE units.

Strict R3 support:

```text
unique controls per exposure-condition stratum = 601..646
progression violations = 0
```

Direct structural positivity check:

```text
13 exposure-condition strata
28 candidate/landmark numeric fields per stratum
364 comparisons
out-of-R3-range exposure values = 0
```

Comparator support is therefore not a remaining feasibility limitation.

No MTAJI-M1/MTAJI-M2 contrast was inspected to reach this decision.

## Stage 2 frozen design

Canonical protocol:

```text
doc/namua-mtaji-transition/STAGE_2_FORMAL_PROTOCOL.md
```

Machine-readable spec:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_FORMAL_SPEC.json
```

Formal corpus:

```text
condition = P2-D2 only
games = 4096
seeds = 20280001..20284096
opening = seeded-uniform-legal, 8 plies
max ply = 100
```

Exposure:

```text
earliest fully ascertained Namua CBE per unique historicalTrajectoryHash
maximum one exposure per historical trajectory
```

Primary population:

```text
first-Mtaji morphology eligible trajectories only
```

Comparator:

```text
R3-M
exact candidate ply
not Category A at index
same forced-capture status
no Namua CBE anywhere
first-Mtaji morphology eligible
20 controls per exposure
global control non-reuse
deterministic SHA-256 allocation
```

Estimability:

```text
G1 >= 20 morphology-eligible unique exposed trajectories
G2 exactly 20 unique R3-M controls for every exposure
```

No rescue sampling is authorized if either gate fails.

Primary test:

```text
matched-set exact conditional Poisson-binomial test
two-sided alpha = 0.05
one primary test
```

Formal decisions:

```text
confirmed-association
not-confirmed
inconclusive-insufficient-exposure
inconclusive-comparator-shortage
```

No causal or Mtaji-timing claim is authorized.

## Outcome firewall

The formal workflow stops after:

```text
python3 tools/experiments/analyze-namua-mtaji-stage2-formal.py --phase match
```

At that point `stage2-matching-audit.json` and `stage2-matched-sets-preoutcome.csv` must be reviewed before `--phase evaluate` is run.

The matching phase does not load the Mtaji classifier and records `morphologyLabelsRead = false`.

## Pause point

Stage 1 is closed. Stage 2 is prospectively frozen before formal generation. The next action is local execution through the preoutcome matching hard stop only, following `STAGE_2_RUNBOOK.md`.