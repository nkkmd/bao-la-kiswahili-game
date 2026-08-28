# REEOE-STUDY1 — Research Log

## 2026-08-28 — Repository audit and Study start

Read-only repository audit completed before G2-04 modifications.

```text
expected prior main = aba61596e6440e9d54be6f1e9520f65e983000b3
observed remote main = aba61596e6440e9d54be6f1e9520f65e983000b3
match = true
open PRs = 0
```

Residual Research Generation 2 branches were audited against `main`:

```text
research/g2-01-position-evaluation-empirical-outcome-calibration-replication
  ahead = 0 / behind = 130

research/g2-01-stage1-implementation-backup
  ahead = 0 / behind = 171

research/g2-02-search-reliability-decision-robustness
  ahead = 0 / behind = 59

research/g2-03-state-transformation-semantics-canonicalization-validation
  ahead = 0 / behind = 2
```

No competing active/unmerged G2 research was found. No `g2-04` branch existed before Study start.

## 2026-08-28 — Upstream contract reconstruction

The Study-start audit reconstructed the current Research Generation 2 program contract, G2-01/G2-02/G2-03 closures, Restricted Endgame exact lineage, ORISC representation boundary, and SSGTC RAW-only boundary.

Key immutable facts recorded:

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primary null / 1040 < 1050
STSCV-STUDY1 = INCONCLUSIVE / T01-T03 NON-ESTIMABLE / transform set []
REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN for 8 states / 7 edges only
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

The Research Generation 2 agenda explicitly permits G2-04 to proceed RAW-only despite G2-03 non-estimability.

## 2026-08-28 — Formal Study identity freeze

The agenda label was instantiated as:

```text
Program label = G2-04
Study ID = REEOE-STUDY1
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
```

Frozen Stage IDs:

```text
REEOE-S0-TECHNICAL-2026-08-28-v1
REEOE-S1-DEVELOPMENT-2026-08-28-v1
REEOE-S2-FORMAL-2026-08-28-v1
```

Research branch created directly from audited `main`:

```text
research/g2-04-restricted-endgame-exact-oracle-expansion
```

## 2026-08-28 — Study-start prospective freeze

Created and froze:

```text
preregistration/STUDY_START_CONTRACT.json
STUDY_1_PROTOCOL.md
STUDY_1_OVERVIEW.md
CURRENT_STATUS.md
DECISION_REGISTER.md
```

Authoritative RAW identity:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason` excluded. Symmetry/canonicalization/quotient counting prohibited.

Stage 0 positive control was frozen as a technical reconstruction of the REWR 8-state / 7-edge exact domain. Four negative corruption controls were frozen. Stage 1 and Stage 2 scientific generation remained not authorized.

No scientific exact-domain outcome had been generated at this point.
