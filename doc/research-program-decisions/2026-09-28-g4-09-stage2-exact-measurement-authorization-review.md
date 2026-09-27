# G4-09 Stage 2 exact-census measurement authorization review — 2026-09-28

## Decision

**AUTHORIZED-FOR-ONE-SHOT-EXACT-CENSUS**

This review authorizes exactly one scientific measurement for GCSREA-STUDY1 Stage 2, limited to the preregistered fixed finite census of the eight immutable G4-05 exact microdomain roots. It does not authorize a general-domain Stage 2 sample, a rerun, any G4-10 access, public-AI changes, engine changes, or main integration.

## Frozen source

- code freeze commit: `c1425c6b67d85f4e7f42032fc04aaf968f151454`
- branch: `research/g4-09-search-reliability-exact-agreement`
- final source audit: PASS before authorization
- G4-05 canonical exact artifact ZIP SHA-256: `90520ed47e8d314e15c0c8dab18d805fa147d69c54ab3e7a4afc2136238c2154`
- immutable population: `RLEMOF-STUDY1-FIXED8`, 8 roots
- root classes known from the frozen manifest: 2 forced width-1 roots and 6 nontrivial roots
- search configurations, frozen order: `D2_Q1`, `D3_Q1`, `D2_Q0`, `D2_Q2`, `B256_Q1_MAXD3`, `B1024_Q1_MAXD3`

Any scientific-code, workflow, search-semantics, exact-classifier, fixed-population, or preregistration change after this authorization requires a new code freeze and a new authorization. The only permitted post-freeze changes before execution are the authorization review, the machine-readable authorization, and the single execution trigger.

## Evidence reviewed before authorization

The Stage 2 classifier technical preflight and premeasurement audit both completed successfully and made zero actual G4-05 search-vs-exact measurements. The final source audit also completed successfully after the one-shot workflow was added. Immediately before this authorization, the branch still pointed to the frozen source commit and `main` remained unchanged.

The measurement workflow re-verifies source binding, the technical evidence artifacts, fixed-eight exact-oracle integrity, and the structural premeasurement state before acquiring a durable lease. The durable lease must be written before the first actual search-vs-exact measurement.

## Authorized measurement boundary

Authorized:

- one fixed-eight exact census only;
- six frozen search configurations;
- forced roots reported separately without invoking a ranking search helper;
- at most 36 nontrivial search executions per implementation and 72 across production plus independent implementations;
- descriptive finite-census outputs only: estimability, canonical-best membership in the exact-optimal set, TopSet relation, PV-first exact membership, exact-optimal rank positions, production/independent agreement, and integrity digests.

Not authorized:

- fresh general-domain Stage 2 seed reads or a new seed namespace;
- G4-05 candidate rescanning, domain replacement, seed extension, threshold relaxation, or rescue after observing results;
- a second scientific measurement or rerun after the durable lease is acquired, regardless of outcome;
- G4-10 depth-11 access, including metadata/reference access for this measurement;
- main integration, public-AI adoption/change, or engine changes;
- p-values, confidence intervals, a search-configuration winner/ranking, whole-Bao correctness probability, causal geometry claims, or human-difficulty interpretation.

## Interpretation boundary

The resulting evidence is a **fixed finite exact census of eight upstream G4-05 microdomain roots**. It may describe agreement within those eight roots and the six frozen search configurations. It must not be converted into a population estimate or generalized to whole Bao.

## Authorization controls

- scientific measurements authorized: `1`
- rerun authorized: `false`
- durable pre-measurement lease required: `true`
- general Stage 2 fresh reads authorized: `false`
- G4-05 rescan/replacement authorized: `false`
- G4-10 depth-11 access authorized: `false`
- public-AI change authorized: `false`
- main integration authorized: `false`

The machine-readable authorization must bind the frozen source blobs and the completed technical evidence before the execution trigger is committed.
