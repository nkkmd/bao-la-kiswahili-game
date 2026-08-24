# HYPOTHESES — Restricted Endgame / Winning Regions Study 1

Updated: 2026-08-24  
Status: PROSPECTIVE

This exact-enumeration Study does not use statistical null-hypothesis testing as its primary decision framework.

## REWR-H0 — Technical exact-domain feasibility

A nontrivial witness-reachable, Mtaji-only, transition-closed domain can be constructed without symmetry reduction and fully reconstructed by an independent verifier under frozen resource limits.

Possible outcomes:

```text
FEASIBLE
TECHNICALLY INFEASIBLE
NOT-ESTIMABLE
```

No positive result is required.

## REWR-H1 — Deterministic exact classification feasibility

Conditional on H0 feasibility and a frozen Stage 1 domain, every state can be deterministically assigned either:

```text
WIN
LOSS
RECURRENT
```

with full verifier equality. `RECURRENT` is not interpreted as formal DRAW unless a separate normative draw rule is frozen before Stage 1.

## REWR-H2 — Exact resolved-state policy feasibility

For every WIN/LOSS state in the frozen domain, an exact `optimalMoveSet` and finite `DTF` can be reproduced independently under the frozen recurrence.

H2 is not evaluated for RECURRENT states except for recurrence-preserving move metadata.

## Interpretation boundary

These hypotheses concern only the frozen bounded domain. They do not hypothesize that all Mtaji states, all endgames, or full Bao are solved.
