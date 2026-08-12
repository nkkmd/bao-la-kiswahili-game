# Checkpoint — Stage 1 primary pilot complete / risk-set support audit frozen

Date: 2026-08-11  
Branch: `research/namua-mtaji-temporal-transition`

## State entering checkpoint

Stage 0 was closed PASS.

Before Stage 1 generation, engine semantics established a deterministic Namua clock and removed raw time-to-first-Mtaji from the candidate survival endpoint family.

The fresh Stage 1 exploratory corpus was then generated locally from source commit:

```text
b2e36fe3c76a599b4c96d77fd25685836a27dbbd
```

## Stage 1 corpus

```text
192 games
32 paired opening replicates
6 conditions
11083 observations
169 unique historical trajectories
178 reached Mtaji
14 terminal before Mtaji
1 administrative truncation
```

Verification passed:

```text
43422 legal moves checked
11083 legacy compatibility checks
178 phase events
all replay/provenance/identity gates = passed
```

## Deterministic clock result

```text
first Mtaji ply 44 = 178/178 reached-Mtaji games
violations = 0
```

The survival/hazard interpretation remains unauthorized.

## Inherited Category-A result

```text
Category A = 9 rows
Category B = 72
Category C = 105
```

Only four Category-A rows are in Namua.

Frozen phenotype classes:

```text
CBE = 2 Namua rows
convergence = 2 Namua rows
forcing-release-precursor = 5 Mtaji rows
temporary-spike = 0
```

## Identity collapse

The two CBE rows are one historical trajectory-ply unit represented under P2-D2 and V2-D2.

The two convergence rows are likewise one historical trajectory-ply unit represented under P2-D2 and V2-D2.

Effective independent Namua support:

```text
CBE = 1 unique trajectory-ply unit
convergence = 1 unique trajectory-ply unit
```

Condition rows are not independent evidence when the complete deterministic trajectory is identical.

## Comparator decision

The inherited Stage 6 comparator family is not frozen for this study.

Observed progression support:

```text
CBE: candidate ply 33 / reserve 11 / landmark reserve 3
convergence: candidate ply 29 / reserve 15 / landmark reserve 7
```

There is no progression overlap and no temporary-spike support.

Therefore a direct CBE-versus-old-comparator formal morphology analysis is not identifiable from this design.

## Mtaji morphology feasibility

Frozen artifact hash remained exact:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

```text
eligible first-Mtaji states = 178
MTAJI-M1 = 118
MTAJI-M2 = 60
```

No refit/restandardization/relabeling occurred.

Outcome measurement is therefore feasible; exposure/comparator support is the bottleneck.

## Decision

Do not enter Stage 2 freeze.

Before generating a larger exploratory corpus, audit the existing pilot for an exact-ply same-condition risk-set comparator.

Protocol amendment frozen before audit execution:

```text
doc/namua-mtaji-transition/STAGE_1_PROTOCOL_AMENDMENT_2.md
```

Audit implementation:

```text
tools/experiments/audit-namua-mtaji-stage1-riskset.js
```

Runbook:

```text
doc/namua-mtaji-transition/STAGE_1_RISKSET_RUNBOOK.md
```

## Boundaries

The supplemental audit:

- uses no new games;
- performs no p-values/effect testing;
- does not inspect M1/M2 contrast by comparator family;
- does not change inherited classifiers;
- does not freeze the formal comparator;
- cannot be reused as formal confirmation.

## Pause point

> **Primary Stage 1 pilot is complete. Stage 2 remains unauthorized because CBE exposure is one independent trajectory-ply unit and the inherited comparator has no progression overlap. An exact-ply same-condition risk-set support audit is frozen and must be executed on the existing Stage 1 corpus before deciding whether to expand CBE exposure sampling.**
