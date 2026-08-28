# 2026-08-28 — STSCV Stage 1 explicit authorization

## Authorization

```text
Study = STSCV-STUDY1
Stage = STSCV-S1-DEVELOPMENT-2026-08-28-v1
Authorized = true
Authorization class = EXPLICIT-PROSPECTIVE-STAGE1-DEVELOPMENT-AUTHORIZATION
Scientific inference authorized = false
Formal confirmation authorized = false
Stage 2 authorized = false
Canonicalization authorized = false
```

This authorization is bound exactly to the successful Stage 1 prefreeze manifest from workflow run `33143959121` and its frozen source/spec/candidate/RAW-identity hashes.

## Population

```text
fresh seeds = 26031001..26031384
seed count = 384
assigned strata = Namua / Mtaji / Mtaji-houseless by frozen modulo rule
target roots = 24 per stratum
opening-prefix dedup length = 8 exact move identities
RAW-state dedup only = true
local graph depth = 3
replacement outside frozen seed block = false
```

## Candidate set

```text
STSCV-T01-SEAT-SWAP-LOCAL
STSCV-T02-LR-MTAJI-HOUSELESS
STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS
```

Controls:

```text
STSCV-C00-IDENTITY
STSCV-C01-LR-NO-DIRECTION-FLIP
```

No candidate definition, applicability scope, population rule, endpoint, or exact mismatch gate may be changed in response to Stage 1 results.

## Stage role boundary

Stage 1 is development characterization only. It can establish instrument/readiness evidence and characterize candidate behavior on fresh data, but it cannot issue `VALIDATED-BOUNDED-ISOMORPHISM`, `NOT-VALIDATED`, or canonicalization authorization decisions.

After inspection, selected Stage 1 trajectory seeds, opening-prefix hashes, and authoritative RAW-state keys are consumed and must not appear in Stage 2 formal evidence.

Stage 2 remains separately prospective and requires a new held-out spec, three-axis firewall, source freeze, exact decision rule, and explicit authorization.
