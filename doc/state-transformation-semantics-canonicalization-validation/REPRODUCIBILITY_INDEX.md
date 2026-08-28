# STSCV-STUDY1 — Reproducibility Index

Updated: 2026-08-28
Status: **STUDY START / PRE-SCIENTIFIC-GENERATION**

## Study anchor

```text
Program = G2-03
Study ID = STSCV-STUDY1
Research Generation = Research Generation 2
Baseline main = a8493d2a50e11f15d16ef8348f2442b262ca275d
Branch = research/g2-03-state-transformation-semantics-canonicalization-validation
```

## Study-start repository audit

```text
expected main = a8493d2a50e11f15d16ef8348f2442b262ca275d
observed remote main = a8493d2a50e11f15d16ef8348f2442b262ca275d
match = true
open PRs = 0
```

Residual G2 branch comparisons at start:

```text
research/g2-01-position-evaluation-empirical-outcome-calibration-replication: ahead 0 / behind 78
research/g2-01-stage1-implementation-backup: ahead 0 / behind 119
research/g2-02-search-reliability-decision-robustness: ahead 0 / behind 7
```

## Current rule-engine binding

```text
public/engine.js Git blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
public/engine.js byte SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
```

The byte SHA-256 is the previously independently recorded byte identity for the same immutable Git blob and will be recomputed by the Stage 0 source-audit tooling before any technical result is accepted.

## Authoritative identity

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
```

No transform is currently authorized for population deduplication, canonicalization, or symmetry-reduced counting.

## Frozen stage identities

```text
Stage 0 = STSCV-S0-TECHNICAL-2026-08-28-v1
Stage 1 = STSCV-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = STSCV-S2-FORMAL-2026-08-28-v1
```

## Prospectively frozen controls

```text
STSCV-C00-IDENTITY
STSCV-C01-LR-NO-DIRECTION-FLIP
```

## Machine-readable contracts

- `preregistration/STUDY_START_CONTRACT.json`
- `preregistration/STAGE_0_TECHNICAL_SPEC.json`

Stage 1 and Stage 2 specs do not yet exist and must not be inferred from this index. Each requires a new source/hash freeze and explicit authorization before its scientific outcome generation.

## Study-level canonical documents

- `STUDY_1_PROTOCOL.md`
- `STUDY_1_OVERVIEW.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `RESEARCH_LOG.md`
- `REPRODUCIBILITY_INDEX.md`

## Provenance contract for future scientific stages

Each scientific stage must materialize and verify at least:

```text
specSha256
sourceSha256 set
authorizationSha256
populationSha256
selectionSha256
rawStateIdentitySha256
transformationDefinitionSha256
measurementSha256
verificationSha256
artifactZipSha256
canonicalResultSha256
```

Stage 0 is technical only, but it will still record a technical spec hash, source hashes, fixture/result hashes, and independent verification identity to prevent technical ambiguity from propagating into Stage 1.

## Upstream closure anchors

```text
PEOCR-STUDY1 = INCONCLUSIVE
SRDR-STUDY1 = INCONCLUSIVE / primaryFormalCriterion = null
SIP-STUDY1 = 0 validated / 0 rejected / 5 NON-ESTIMABLE
ORISC Axis A = ORACLE-REPRESENTATION-INTEGRITY-NOT-CONFIRMED
ORISC Axis B = NOT-AUTHORIZED-NOT-EXECUTED
validated transform set at start = []
```

These are immutable context and not G2-03 formal evidence.
