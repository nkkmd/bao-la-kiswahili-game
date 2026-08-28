# REEOE-STUDY1 — Current Status

Updated: 2026-08-28

## Status

**STUDY STARTED / PROSPECTIVE STUDY FREEZE COMPLETE / STAGE 0 TECHNICAL WORK ONLY / NO SCIENTIFIC OUTCOME GENERATED**

## Identity

```text
Program = G2-04
Study ID = REEOE-STUDY1
Research Generation = Research Generation 2
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
Baseline main = aba61596e6440e9d54be6f1e9520f65e983000b3
Research branch = research/g2-04-restricted-endgame-exact-oracle-expansion
```

## Repository-start audit

```text
expected prior main = aba61596e6440e9d54be6f1e9520f65e983000b3
observed remote main = aba61596e6440e9d54be6f1e9520f65e983000b3
match = true
open PRs at audit = 0
competing active G2 research = false
residual G2 branches ahead of main = 0
```

Residual G2 branches were historical branch heads behind `main`, not unmerged active work.

## Stage progression

```text
Stage 0 = REEOE-S0-TECHNICAL-2026-08-28-v1 — eligible / technical only
Stage 1 = REEOE-S1-DEVELOPMENT-2026-08-28-v1 — NOT AUTHORIZED
Stage 2 = REEOE-S2-FORMAL-2026-08-28-v1 — NOT AUTHORIZED
```

No Stage 1 or Stage 2 scientific generation has occurred.

## Authoritative representation

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
symmetry reduction = forbidden
canonicalization = forbidden
quotient graph = forbidden
```

## Immutable upstream scientific state

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE
SRDR primaryFormalCriterion = null
SRDR uniqueHistoricalTrajectoriesAfterStage1Firewall = 1040 < 1050

STSCV-STUDY1 = INCONCLUSIVE
STSCV-T01 = NON-ESTIMABLE
STSCV-T02 = NON-ESTIMABLE
STSCV-T03 = NON-ESTIMABLE
STSCV validated transform set = []
STSCV canonicalization = NON-ESTIMABLE

REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN
REWR exact domain = 8 states / 7 edges only
historical 423,733-state candidate = ADMIN-CUTOFF / technical history only

ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED

SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

None of these decisions may be repaired or reinterpreted by REEOE-STUDY1.

## Stage 0 technical objective

Before Stage 1 design is eligible, Stage 0 must establish that the current technical instrument can:

1. represent and hash RAW states exactly;
2. distinguish exact move variants;
3. reconstruct guard-free endgame legal transitions under the frozen rule semantics;
4. enumerate complete forward closure;
5. reconstruct exact predecessor relations;
6. solve the known REWR fixture exactly;
7. reproduce its values, DTF, and all optimal/max-resistance moves;
8. detect four prospectively frozen corruptions;
9. independently reproduce the technical result through a separate verifier path.

## Formal-generation lock

No fresh domain development or formal exact outcome generation is authorized by the Study-start documents. Stage 1 requires a separate prospective development spec/authorization. Stage 2 requires a later domain/resource/source/decision freeze and explicit formal authorization.
