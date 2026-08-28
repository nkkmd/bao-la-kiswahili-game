# 2026-08-28 — STSCV-STUDY1 prospective study-start freeze

## Classification

```text
Research Generation = Research Generation 2
Agenda label = G2-03
Study ID = STSCV-STUDY1
Scientific outcome generated = false
Stage 1 authorized = false
Stage 2 authorized = false
```

## Repository baseline

```text
remote main at audit = a8493d2a50e11f15d16ef8348f2442b262ca275d
prior recorded main = a8493d2a50e11f15d16ef8348f2442b262ca275d
match = true
open PRs at audit = 0
competing active/unmerged G2 research = none found
```

Residual G2 branches were all behind `main` and had zero commits ahead.

## Prospective identity freeze

Formal Study identity:

```text
State Transformation Semantics / Canonicalization Validation Study 1
STSCV-STUDY1
```

Frozen stages:

```text
STSCV-S0-TECHNICAL-2026-08-28-v1
STSCV-S1-DEVELOPMENT-2026-08-28-v1
STSCV-S2-FORMAL-2026-08-28-v1
```

Authoritative RAW identity remains:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason` are excluded. Canonicalized/symmetry-reduced identity remains unauthorized.

## Immutable prior decisions

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primaryFormalCriterion = null
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
```

No prior Study is reopened or rescued.

## Control freeze

```text
positive = STSCV-C00-IDENTITY
negative = STSCV-C01-LR-NO-DIRECTION-FLIP
```

IDENTITY failure or false acceptance of the broken negative control causes technical fail-closed handling.

## Important prospective distinction

Rule-semantic graph isomorphism and downstream canonicalization authorization are separate endpoints. A transform may be a valid bounded rule-semantic isomorphism without preserving the exact fixed-start reachable population required for state-space quotient counting.

## Next execution boundary

Only Stage 0 technical validation is eligible after this checkpoint. Stage 0 may use synthetic/technical fixtures but those fixtures are permanently excluded from Stage 1/2 scientific evidence. The finite scientific candidate set must be frozen before Stage 1 fresh outcome generation.
