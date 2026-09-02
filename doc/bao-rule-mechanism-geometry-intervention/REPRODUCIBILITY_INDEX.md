# BRMGI-STUDY1 — Reproducibility Index

更新日: 2026-09-02

## Baseline

```text
repository = nkkmd/bao-la-kiswahili-game
review baseline remote main = 5525700937f0ada1aec39634012e8ad623e228c4
post-authorization Study baseline main = b0cbd9f562bb803597acb313360c064dadd73299
research branch = research/g3-06-bao-rule-mechanism-geometry-intervention
Study ID = BRMGI-STUDY1
```

## Program authorization

- `../research-program-decisions/2026-09-02-post-g3-05-g3-06-authorization-review.md`
- `../research-generation-3/checkpoints/2026-09-02-post-g3-05-g3-06-authorization-review.md`
- decision: `G3-06-AUTHORIZED`
- authorization scope: prospective Study definition + technical-only Stage 0
- fresh Stage 1: NOT AUTHORIZED

## Prospective contract

Canonical human-readable documents:

- `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_PROTOCOL.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`

Machine-readable preregistration:

- `prereg/STUDY_1_SPEC.json`

Initial machine preregistration commit:

`9ab2f7bb79c446df1431175686383271f341edd3`

Initial protocol commit:

`02d8b8605c913f42c145badd30aafd5fbb1f9538`

Current-status initial commit:

`49071dc27f1c337aa42d3dd1b84bc0a0a17cb683`

Decision-register initial commit:

`c4d9a2b18ff06aedfbb1f591a7bb3e44782e6bfe`

Overview initial commit:

`0f4a174c8cd971c8376c09966d4834fea5b1afc7`

README initial commit:

`503f46dd82f00cea1555cac704ae1c16f17211b5`

All of these were committed before G3-06 fresh scientific evidence generation/read.

## Representation / rule binding

```text
rule runtime source = public/engine.js
human-readable rule baseline = doc/RULES_BASELINE.md
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
relative horizon = 5
validated transforms = []
canonicalization = NOT AUTHORIZED
```

## Eligible instrument

Formal measurement source is LGTGMIV F1-F5 only.

Canonical upstream records:

- `../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md`
- `../local-game-tree-geometry-measurement-instrument-verification/CURRENT_STATUS.md`

Formal status:

`LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL`

## Frozen event / endpoint contract

Formal event families:

- `BRMGI-E1-CAPTURE-SOURCE-MOVE`
- `BRMGI-E2-NYUMBA-USE-VS-STOP`
- `BRMGI-E3-RESERVE-EXHAUSTION-NAMUA-TO-MTAJI`

Control/descriptive-only event:

- `BRMGI-E0-NAMUA-RESERVE-DECREMENT-NONTRANSITION`

Formal metric universe:

- `BRMGI-M1-ROOT-LEGAL-WIDTH`
- `BRMGI-M2-CUMULATIVE-TREE-OCCURRENCE`
- `BRMGI-M3-GLOBAL-DISTINCT-RAW-STATES`
- `BRMGI-M4-DUPLICATE-TRANSITION-FRACTION`
- `BRMGI-M5-CUMULATIVE-TREE-RAW-RATIO`
- `BRMGI-M6-UNIT-WIDTH-OCCUPANCY-FRACTION`

Candidate universe at freeze = `3 × 6 = 18` event/metric combinations.

## Stage IDs

```text
BRMGI-S0-TECHNICAL-2026-09-02-v1
BRMGI-S1-DEVELOPMENT-2026-09-02-v1
BRMGI-S2-FORMAL-2026-09-02-v1
```

## Seed namespaces

```text
technical-only = 31609001..31609008 / scientific use prohibited
Stage 1 = 31610001..31610256 / RESERVED / NOT CONSUMED
Stage 2 = 31620001..31620384 / RESERVED / NOT CONSUMED
```

Repository search before freeze confirmed Stage 1 / Stage 2 namespaces were not already used. `31600001..31600256` was already present in the independent public-AI engineering track, so G3-06 technical-only seeds were deliberately moved to `31609001..31609008` rather than reusing that range.

## Freshness firewall

Upstream identity-only exclusions must be materialized before Stage 1 authorization from:

- LGTGMIV-STUDY1
- EBRWS-STUDY1
- TCTGD-STUDY1
- SFCDF-STUDY1
- BECT-STUDY1

Outcome fields retained = false.

G3-03 diagnostic values/directions, G3-04 candidate values/directions and G3-05 partial telemetry are not scientific selection inputs.

Stage 2 must exclude Stage 1 source seed, full trajectory, first-16 prefix, RAW pre/post root, root pair, bound move, event-window and same-root event/control pair identities.

## Protected evidence

```text
standard initial RAW-root complete exact depth-10 holdout
= SEALED / NOT GENERATED / NOT READ
```

No BRMGI action may generate, partially generate, read, peek, trial-enumerate or resource-estimate this holdout without separate explicit authorization.

## Execution-integrity contract

Each future fresh scientific Stage requires:

```text
max authorized scientific executions = 1
arming separated from computation
single trigger path
concurrency guard
durable pre-computation lease
source blob binding
remote advancement allowlist
artifact-before-mirror
exact-byte recovery only
scientific recomputation for recovery prohibited
execution-count audit mandatory
```

## Relay-limit boundary

BECT-STUDY1 relay-limit partial telemetry is not read or reused as BRMGI scientific evidence.

Only the technical failure class is carried forward as design information:

- source/direct selected move relay-limit -> frozen technical ineligibility before geometry;
- relay-limit inside a required depth-5 reconstruction -> Stage `TECHNICAL-INVALID` fail-closed;
- no root replacement / seed extension / repair-and-same-evidence rerun.

## Current protected state

```text
fresh Stage 1 executions = 0
fresh Stage 2 executions = 0
Stage 1 seed consumed = false
Stage 2 seed consumed = false
no-rescue boundary crossed = false
protected depth-10 accessed = false
```
