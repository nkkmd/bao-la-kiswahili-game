# BRMGI-STUDY1 — Reproducibility Index

更新日: 2026-09-03

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
BRMGI-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID / NO RERUN
BRMGI-S0-TECHNICAL-2026-09-03-v2 / STAGE0-PASS
BRMGI-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID
BRMGI-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
```

## Seed namespaces

```text
technical-only = 31609001..31609008 / scientific use prohibited
Stage 1 = 31610001..31610256 / CONSUMED / CLOSED TO SAME-EVIDENCE REUSE
Stage 2 = 31620001..31620384 / NOT CONSUMED / NOT-AUTHORIZED-NOT-EXECUTED
```

Repository search before freeze confirmed Stage 1 / Stage 2 namespaces were not already used. `31600001..31600256` was already present in the independent public-AI engineering track, so G3-06 technical-only seeds were deliberately moved to `31609001..31609008` rather than reusing that range.

## Freshness firewall

Upstream identity-only exclusions were materialized before Stage 1 scientific authorization from:

- LGTGMIV-STUDY1
- EBRWS-STUDY1
- TCTGD-STUDY1
- SFCDF-STUDY1
- BECT-STUDY1

Outcome fields retained = false. Final identity-only manifest counts: root RAW identities 149, source trajectory identities 124, opening-prefix identities 67; G3-05 retained only 25 `rootRawSha256` identities and no partial scientific fields. `identityCoreSha256 = a225b8c15d6da956dd1afbdc0a64c6d40b9c77add2e464d34f11dfc1278e2182`.

G3-03 diagnostic values/directions, G3-04 candidate values/directions and G3-05 partial telemetry are not scientific selection inputs.

Stage 2 must exclude Stage 1 source seed, full trajectory, first-16 prefix, RAW pre/post root, root pair, bound move, event-window and same-root event/control pair identities.

## Actual Stage 0 / Stage 1 provenance

Stage 0 v1:

```text
run = 33677691455
disposition = TECHNICAL-INVALID / NO RERUN
fresh scientific evidence = false
```

Stage 0 v2:

```text
static audit run = 33677942576 / PASS
execution run = 33678004793 / STAGE0-PASS
result artifact = 9865102178
result ZIP SHA-256 = 06015d340a3a0de4703af2755c1a265153fef08393dc43fcd38e1285fb1295ff
result file SHA-256 = 4089bc0acd8b719e23a21a2605b34281d13992c2cc75dfd9dc5474c8bb2eade3
```

Upstream firewall:

```text
materialization run = 33678555012
artifact = 9865308337
ZIP SHA-256 = 5f625d34f421da493fee1bcfc463687a26d9bd01d29a9bf838e3d1c6637f1ec7
exact mirror commit = 6029679c7a218ca35bb1da343d86670285070d7a
```

Stage 1:

```text
preauthorization static audit run = 33679102557 / PASS
authorization commit = 1edc8886ffb0d2b65c7f4c1c8fb002be0abbe6e7
trigger commit = 61cb2ed31c26151edf19b9c1eb49f6b22b935898
scientific run = 33679269612
job = 100411609044
authorized executions = 1
actual executions = 1
stageDisposition = TECHNICAL-INVALID
technicalError = production/independent selection mismatch
result artifact = 9865581198
result ZIP SHA-256 = 3f43ff832afaae5fc0a1d6756dcc9fa0101eb5a67befc7f3cdc2d1536bdb5d2a
scientific-result SHA-256 = a5a2f385699cd8bc629e1d1594005841778a82c7d1ca18bb7eb5bcfeb0d41452
telemetry SHA-256 = 141f4687528ce62fe60052c4c9ecff217a6a929a43190e4f5a507f8d4abc77f0
execution-summary SHA-256 = a3fdf314f12d6853e337f13b6c252eaebf27edb69c96dab53829b033ece5ca77
exact-byte mirror commit = b8f9fe0e2d5008be2d41b3b8271fa325144f82fc
```

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
fresh Stage 1 authorized executions = 1
fresh Stage 1 actual executions = 1
fresh Stage 2 executions = 0
Stage 1 seed consumed = true
Stage 2 seed consumed = false
no-rescue boundary crossed = true
formal promoted candidate set = []
Study = CLOSED / TECHNICAL-INVALID
protected depth-10 accessed = false
main integration = NOT PERFORMED
```
