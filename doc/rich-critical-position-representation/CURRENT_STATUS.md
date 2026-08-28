# RCPR-STUDY1 — Current Status

Updated: 2026-08-28  
Program: `G2-06` / Research Generation 2  
Study: `RCPR-STUDY1` — Rich Critical-Position Representation Study 1

## Status

**STUDY ACTIVE / STAGE 0 TECHNICAL DESIGN AND IMPLEMENTATION IN PROGRESS / NO SCIENTIFIC OUTCOME GENERATED**

Stage state:

```text
RCPR-S0-TECHNICAL-2026-08-28-v1 = ACTIVE / TECHNICAL-ONLY
RCPR-S1-DEVELOPMENT-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
RCPR-S2-FORMAL-2026-08-28-v1 = NOT-AUTHORIZED-NOT-EXECUTED
```

Repository anchor:

```text
baseline remote main = 37480777246aa306c6ca3d0679d936b5e0107071
expected baseline match = true
research branch = research/g2-06-rich-critical-position-representation
open PRs at startup = 0
residual unmerged commits on audited G2-01..G2-05 / G2-05-hardening branches = 0
```

The GitHub-connected workflow operates on remote repository state; no local checkout/worktree is participating in the current writes. Remote branch ancestry and ahead/behind status were audited before study creation.

## Prospective freezes already committed

- `preregistration/STUDY_START_FREEZE.md`
- `STUDY_1_PROTOCOL.md`

These freeze the Study/Stage IDs, RAW identity, no-rescue boundary, leakage taxonomy, eligible family search space, Stage transition firewalls, independent-verification requirements, and interpretation boundary before G2-06 scientific outcome generation.

## Stage 0 focus

Current technical work is limited to:

- dedicated RAW-only serialization/keying without symmetry/canonicalization helpers;
- deterministic rich pre-root feature semantics;
- strict rejection of continuation/future outcome fields;
- deterministic search-derived features under an explicit search profile;
- strict pre-root temporal-history validation;
- production/independent feature recomputation agreement;
- positive and negative controls;
- resource-feasibility characterization.

A repository audit found that the historical `position-typology-features.js::identityKeys()` computes `seatCanonicalKey` through `mirrorState()`. It is therefore **not authorized as the G2-06 scientific identity helper**. G2-06 will use a dedicated RAW-only identity implementation consistent with the G2-05 authoritative boundary.

## Immutable upstream boundary

```text
G2-01 = INCONCLUSIVE
G2-02 = INCONCLUSIVE
G2-03 = INCONCLUSIVE
validated transform set = []
canonicalization = not authorized
G2-04 = INCONCLUSIVE / Stage 2 not executed
G2-05 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
G1 Critical Positions Study = closed after zero-promotion exploratory result / Stage 2 not executed
```

No upstream decision is reopened by this Study.
