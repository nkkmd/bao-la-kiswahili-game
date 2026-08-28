# REEOE-STUDY1 — Reproducibility Index

Updated: 2026-08-28  
Status: **STUDY START / PRE-SCIENTIFIC-GENERATION**

## Study anchor

```text
Program = G2-04
Study ID = REEOE-STUDY1
Research Generation = Research Generation 2
Baseline main = aba61596e6440e9d54be6f1e9520f65e983000b3
Branch = research/g2-04-restricted-endgame-exact-oracle-expansion
```

## Authoritative RAW identity

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
missing pending = invalid
validated transform set = []
symmetry/canonicalization = not authorized
```

## Exact move identity

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

## Frozen stages

```text
Stage 0 = REEOE-S0-TECHNICAL-2026-08-28-v1
Stage 1 = REEOE-S1-DEVELOPMENT-2026-08-28-v1
Stage 2 = REEOE-S2-FORMAL-2026-08-28-v1
```

Stage 0 is technical-only. Stage 1 and Stage 2 scientific generation are not authorized at Study start.

## Study-start machine-readable contract

- `preregistration/STUDY_START_CONTRACT.json`

This binds the repository baseline, representation contract, Stage identities, outcome-blind domain principles, closure/retrograde semantics, controls, upstream immutability, resource fields, hash requirements, and no-rescue rule.

## Positive technical fixture — immutable upstream target

Prior REWR target used only for instrument regression:

```text
study = REWR-STUDY1
domainId = REWR-S1-DOMAIN-2026-08-24-v1
root = fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33
states = 8
edges = 7
stateSetSha256 = 95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307
transitionSetSha256 = 33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11
TERMINAL = 4
WIN = 3
LOSS = 1
RECURRENT = 0
solutionSha256 = 4acb2f0517d653b241e78bf9fc94ef2c4353a2a89263d1e8e71918e1cce72c15
```

The positive control must reconstruct this graph from frozen semantics. Because ORISC identified a repository-row materialization discrepancy in three terminal rows, Stage 0 must not treat the later repository-facing raw rows as unverified identity authority. The immutable graph/hash/value facts and independently reconstructed current RAW graph are the control target.

## Historical large-candidate boundary

```text
REWR historical one-shot v3
states observed = 423733
edges observed = 426938
stop = ADMIN-CUTOFF at 1000000 move microsteps
same-candidate cap extension in G2-04 = forbidden
```

## Technical controls

```text
positive = REEOE-C00-REWR-8STATE-REGRESSION
negative = REEOE-C01-MISSING-SUCCESSOR
negative = REEOE-C02-INCORRECT-TERMINAL
negative = REEOE-C03-INCOMPLETE-EDGE-SET
negative = REEOE-C04-CORRUPTED-PREDECESSOR
```

## Stage 0 target implementation families to audit

Existing exact-analysis lineage includes:

```text
tools/experiments/lib/restricted-endgame-stage0.js
tools/experiments/lib/restricted-endgame-transition.js
tools/experiments/lib/restricted-endgame-independent-verifier.js
tools/experiments/lib/restricted-endgame-retrograde.js
tools/experiments/lib/restricted-endgame-retrograde-independent.js
tools/experiments/lib/restricted-endgame-tablebase.js
tools/experiments/lib/restricted-endgame-tablebase-independent.js
```

REEOE Stage 0 must audit current bytes and algorithmic responsibilities before deciding what can be reused and what requires new G2-04-specific code.

## Required scientific-stage provenance

Before Stage 2 outcome, the formal contract must bind:

```text
specSha256
sourceSha256
authorizationSha256
domainDefinitionSha256
rootOrPopulationSha256
rawStateIdentitySha256
nodeSetSha256
edgeSetSha256
closureSha256
retrogradeResultSha256
verificationSha256
canonicalResultSha256
artifactZipSha256
```

## Large artifact policy

Large raw graphs should remain immutable workflow artifacts with repository-facing compact results and full hash/provenance. Committed reporting projections never become RAW identity authority merely because they are in Git.

## Current reproduction boundary

No G2-04 scientific result exists yet. The current reproducible object is the prospective Study-start contract and its immutable baseline. Stage 0 will add technical-only evidence; Stage 1/2 evidence requires separate authorization.
