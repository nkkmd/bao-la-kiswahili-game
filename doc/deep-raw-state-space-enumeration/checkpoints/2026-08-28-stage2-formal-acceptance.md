# DRSSE Stage 2 formal acceptance

Date: 2026-08-28  
Study: `DRSSE-STUDY1`  
Stage: `DRSSE-S2-FORMAL-2026-08-28-v1`  
Decision: **`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

## Canonical execution

```text
authorization/head SHA = 9199a3d25ea38978673f94bfcd4250aa3b5411fa
workflow run = 33156581843
workflow job = 98800676702
artifact = 9679860509
artifact name = drsse-stage2-formal-v1
artifact ZIP SHA256 = cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e
```

Production completed the frozen standard-initial RAW root through depth 9. The mandatory separate-process verifier then validated all materialized state and edge layers and independently re-enumerated the entire frozen depth-9 domain using the independent RAW representation/enumerator implementation.

```text
targetComplete = true
lastCompleteDepth = 9
firstIncompleteDepth = null
stopReason = null
verified layers = 10
verified parent layers = 9
full independent exact recomputation = PASS
```

## Exact bounded endpoints

```text
cumulative distinct RAW states through depth 9 = 102857
depth-labelled legal edges from parent depths 0..8 = 106773
unique RAW graph edges from parent depths 0..8 = 106773
tree node occurrences through depth 9 = 136645
tree edge occurrences from parent depths 0..8 = 136644
tree / cumulative RAW-state occurrence ratio = 1.328494900687362
```

Exact identities:

```text
cumulativeRawStateSetSha256 = 993c5056ca54521b7b124d8c5c97fa18d8ef04b860b5e4c6870df278d5944816
cumulativeGlobalRawGraphEdgeSetSha256 = da836a6a0b2e18c155f59de7617b4e72ab62955410ca7725a3f3525211f9a654
cumulativeDepthLabelledEdgeSetSha256 = 3453b457aee547c645be0ec3a3a5550656e9fcaa1917be13d5ac0bb0e7b69aed
productionResultCoreSha256 = b9e79571ab2492edf717569cb331f381e4dbff603684d2e932b8b57c2ffb322b
independentCoreSha256 = 02e4a1fa865af977cb10c1f288c42886b32453e56a40bc85cbb0dc9975b257d3
decisionCoreSha256 = c1756994ceea3ea9b605805ddd6387f359aeb14e14d894bfc8a1e8b26122fa3f
```

## Interpretation boundary

The decision is exact only inside the prospectively frozen standard-initial-root depth-9 RAW domain. It is not a full Bao state-space count, full game-tree count, unbounded estimate, growth-law extrapolation, symmetry-reduced count, or game-theoretic solution.

No G2-04 root, partial closure, G1 depth-9 partial row, Stage 1 row, Stage 1 root, symmetry transform, or canonicalization result was used as formal evidence. G2-04 remains `INCONCLUSIVE`; G1 `SSGTC-STUDY1` remains independently `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`.

Administrative integration state: **accepted scientific result ready for central indexing; no further outcome generation authorized.**
