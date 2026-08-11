# Checkpoint — Stage 2 pre-generation firewall hardening

Date: 2026-08-11  
Timing: **after Stage 2 design freeze, before any Stage 2 formal game generation**

## Scope

Two implementation-boundary clarifications were made before formal data generation. They do not change the frozen research question, condition, sample size, exposure threshold, primary estimand, comparator family, number of controls, alpha, or primary test.

## 1. Conservative R3 CBE exclusion

The frozen R3-M concept requires a control historical trajectory to contain no Namua CBE anywhere.

Implementation is now explicit:

```text
control exclusion set
= every historicalTrajectoryHash containing any inherited Namua Category-A row
  classified capture-branch-expansion
```

This exclusion does not require that the CBE row itself be retained as a fully ascertained formal exposure.

Formal exposures still require:

```text
Namua
Category A
capture-branch-expansion
ascertainment complete
earliest qualifying CBE per historical trajectory
```

The clarification only makes the control-side `no CBE anywhere` rule conservative and literal.

## 2. Machine-enforced outcome unlock

The Stage 2 protocol already required a hard stop after preoutcome R3-M matching. The implementation now enforces that boundary mechanically.

Before preoutcome review this file must not exist:

```text
doc/namua-mtaji-transition/preregistration/STAGE_2_OUTCOME_UNLOCK.json
```

`analyze-namua-mtaji-stage2-formal.py --phase evaluate` refuses to load the frozen Mtaji classifier unless the unlock exists and exactly binds:

```text
stage = stage2-formal-outcome-unlock
outcomeEvaluationAuthorized = true
inputConfigHash
formalSourceCommit
matchingAssignmentHash
preoutcomeAssignmentCsvSha256
formalSpecSha256
eventTableSha256
```

The unlock cannot be written prospectively because `matchingAssignmentHash` and the bound file hashes do not exist until after formal corpus generation and preoutcome matching.

If G1 or G2 fails, the prespecified inconclusive decision remains writable without morphology inspection and without an unlock.

## Unchanged frozen design

```text
condition = P2-D2 only
games = 4096
seeds = 20280001..20284096
exposure = earliest fully ascertained Namua CBE per historical trajectory
primary target = first-Mtaji morphology eligible
comparator = R3-M
controls = 20 per exposure, globally non-reused
G1 = >=20 morphology-eligible exposed trajectories
G2 = exactly20 controls per exposure
primary test = matched-set exact conditional Poisson-binomial
two-sided alpha = .05
```

No Stage 2 formal data had been generated when these hardening changes were committed.

## Next action

Follow `doc/namua-mtaji-transition/STAGE_2_RUNBOOK.md` through `--phase match` only, upload the eight preoutcome artifacts, and do not attempt morphology evaluation until the exact unlock is committed after review.
