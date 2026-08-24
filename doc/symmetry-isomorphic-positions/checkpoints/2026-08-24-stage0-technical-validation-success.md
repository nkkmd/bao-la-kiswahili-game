# Stage 0 technical validation success — Symmetry / Isomorphic Positions Study 1

Date: 2026-08-24  
Study: `SIP-STUDY1`  
Stage: `SIP-STAGE0-TECHNICAL-2026-08-24-v2`

## Verification provenance

```text
PR-triggered verification PR = #40
workflow run = 32713095966
job = 97388528118
artifact = 9514839582
artifact ZIP SHA256 = 9e7ac1b261bd74e91b729bffb0ea0641812b92f7d711080a0db1e73b8ce7da0f
candidate JSON bytes SHA256 = b349a34c28824ee54770329a516fd0cf7a7c2cc6488e874b02fe5800ee75c9f0
```

Engine regression, Stage 0 synthetic/control tests, and the outcome-blind graph-size benchmark all completed successfully.

## Firewall status

```text
scientificOutcomeGenerated = false
candidateOutcomeInspected = false
formalSeedBlockConsumed = false
```

No fresh formal reachable-corpus candidate pass/fail result, exact-oracle symmetry result, Stage 1 decision, or canonicalization result was generated during Stage 0.

## Technical sizing decision

The largest prospectively benchmarked configuration is selected unchanged for Stage 1 fresh bounded-local graphs:

```text
roots per formal stratum = 8
local expansion depth = 3
```

This choice uses only technical quantities. Stage 0 observed:

| stratum | depth | roots | states | edges | max branching | guard hits |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Namua | 3 | 8 | 386 | 386 | 8 | 0 |
| Mtaji | 3 | 8 | 372 | 364 | 12 | 0 |
| Mtaji-houseless | 3 | 8 | 372 | 364 | 12 | 0 |

The `mtaji-houseless` stratum is the already-frozen structural applicability domain for T02/T03; it was not created in response to symmetry outcomes.

## Stage 1 seed freeze rule

Stage 1 will use only the disjoint prospective seed block `22910001..22910064`, maximum trajectory ply 120. For each formal stratum, candidates are deduplicated by direct raw rule-state key, sorted ascending by that key, and the first 8 are selected. No symmetry outcome enters root selection.

If a stratum yields fewer than 8 eligible unique roots, that fresh stratum is `NON-ESTIMABLE`; the seed interval will not be extended after generation.

## Authorization boundary

This checkpoint authorizes **Stage 1 specification/tooling freeze work only**. It does not yet authorize scientific candidate outcome generation. Formal authorization must bind the final Stage 1 spec and production/verifier source identities first.
