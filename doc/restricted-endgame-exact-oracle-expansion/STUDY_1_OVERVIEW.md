# Restricted Endgame Exact Oracle Expansion Study 1 — Overview

Updated: 2026-08-28  
Status: **STARTED / PROSPECTIVE FREEZE COMPLETE / STAGE 0 TECHNICAL WORK ONLY**

## Study identity

```text
Program label = G2-04
Study ID = REEOE-STUDY1
Research Generation = Research Generation 2
Formal title = Restricted Endgame Exact Oracle Expansion Study 1
Baseline main = aba61596e6440e9d54be6f1e9520f65e983000b3
Research branch = research/g2-04-restricted-endgame-exact-oracle-expansion
```

日本語作業表記:

**Baoにおける限定終盤exact oracleの拡張 — prospectively selected RAW-state domains に対する complete forward closure, exact retrograde analysis, cycle structure, distance, and optimal-move multiplicity の厳密解析**

## Question

複数のrestricted Bao endgame domainを、game-theoretic outcomeを見ずにprospectively選択し、authoritative RAW identityの下でcomplete forward closureを証明したうえで、exact retrograde analysisによってvalue、recurrent/cycle structure、distance-to-resolution、all optimal moves、optimal-move multiplicityを完全かつ再現可能に列挙できるかを検証する。

## Representation boundary

Authoritative scientific identity:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

Excluded:

```text
turn,reason
```

G2-03のvalidated transform setは空であるため、このStudyはRAW-onlyで実施する。symmetry reduction、canonicalization、player-swap/left-right quotient、symmetry-reduced countingは使用しない。

## Stage structure

```text
REEOE-S0-TECHNICAL-2026-08-28-v1
  technical solver / representation / closure / verifier validation only

REEOE-S1-DEVELOPMENT-2026-08-28-v1
  fresh domain development + resource characterization
  formal exact decision not authorized

REEOE-S2-FORMAL-2026-08-28-v1
  prospectively frozen exact formal domains only
  separate source freeze + explicit authorization required
```

At Study start, only Stage 0 technical work is eligible. Stage 1 and Stage 2 scientific generation are not authorized.

## Complete-closure rule

An exact-oracle claim requires every legal successor of every included nonterminal state to be accounted for. A structural root filter does not prune successors. If closure is incomplete, escaping, resource-censored, or technically invalid, the domain is not reported as exact.

## Retrograde rule

Initial solver vocabulary:

```text
TERMINAL
WIN
LOSS
RECURRENT
```

At Study start, `RECURRENT` is not renamed `DRAW`. DTF is legal-move/ply distance to forced terminal:

```text
TERMINAL = 0
WIN = 1 + min winning-successor DTF
LOSS = 1 + max opponent-winning-successor DTF
RECURRENT = null
```

All optimal moves and optimal-move multiplicity are preserved.

## Controls

Positive technical regression:

```text
REEOE-C00-REWR-8STATE-REGRESSION
```

The prior REWR 8-state / 7-edge exact domain is reconstructed only as an instrument control. It is not fresh G2-04 evidence.

Negative technical controls require the independent verifier to detect:

```text
missing successor
incorrect terminal classification
incomplete edge set
corrupted predecessor mapping
```

## Immutable upstream boundaries

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primaryFormalCriterion = null / 1040 < 1050
STSCV-STUDY1 = INCONCLUSIVE / T01-T03 NON-ESTIMABLE / validated transform set = []
REWR-STUDY1 = EXACT-SOLVED-WITHIN-FROZEN-DOMAIN for its 8-state domain only
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN
```

The historical REWR 423,733-state candidate stopped at `ADMIN-CUTOFF`; G2-04 does not simply increase that cap and resume it.

## Current next step

Stage 0 must audit current RAW serialization, exact move identity, guard-free endgame transitions, closure traversal, retrograde solving, and independent verification; reproduce the REWR positive fixture; and prove detection of the four frozen corruption controls before any Stage 1 development generation can be considered.
