# STSCV-STUDY1 — Research Log

## 2026-08-28 — Study-start repository audit

Observed remote `main`:

```text
a8493d2a50e11f15d16ef8348f2442b262ca275d
```

This exactly matched the user-provided post-G2-02 integration/provenance anchor.

Open PR audit returned zero open PRs.

Residual G2 branches:

```text
research/g2-01-position-evaluation-empirical-outcome-calibration-replication: ahead 0 / behind 78
research/g2-01-stage1-implementation-backup: ahead 0 / behind 119
research/g2-02-search-reliability-decision-robustness: ahead 0 / behind 7
```

Conclusion: no active/unmerged competing Research Generation 2 work was found.

## 2026-08-28 — Required scientific-state reconstruction

Read and reconciled the Research Generation 2 agenda/governance, G2-01/G2-02 closure documents, SIP-STUDY1, ORISC-STUDY1, REWR-STUDY1, SSGTC-STUDY1, root README, and RULES_BASELINE.

Immutable boundaries recorded:

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primaryFormalCriterion null
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
validated transform set = []
```

## 2026-08-28 — Study identity and stage freeze

Formal Study identity fixed prospectively:

```text
Agenda = G2-03
Study ID = STSCV-STUDY1
Formal title = State Transformation Semantics / Canonicalization Validation Study 1
```

Stage IDs fixed:

```text
STSCV-S0-TECHNICAL-2026-08-28-v1
STSCV-S1-DEVELOPMENT-2026-08-28-v1
STSCV-S2-FORMAL-2026-08-28-v1
```

No scientific outcome existed at this point.

## 2026-08-28 — Representation design decision

Authoritative state identity retained as RAW-only:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

A key G2-03 design distinction was fixed prospectively: exact rule-semantic isomorphism does not automatically imply authorization for fixed-start reachable-population canonicalization. Domain/reachability closure must be separately demonstrated.

## 2026-08-28 — Stage 0 entry

Stage 0 is authorized only as technical/non-scientific work. Initial technical source inspection confirms the current engine uses player-local pit coordinates, `opposite = 7-index`, `HOUSE=4`, distinct Namua `moveVariants`, and terminal capture transfer into `pending` on the relevant front-empty path.

Next work is implementation of production/independent Stage 0 fixtures and transform-family classification. Stage 1/2 scientific generation remains locked.
