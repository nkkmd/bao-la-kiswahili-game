# Research Generation 2 G2-05 — Deep RAW State-Space Enumeration Study 1 Closure

Date: 2026-08-28  
Program label: `G2-05`  
Study ID: `DRSSE-STUDY1`  
Formal decision: **`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

## Program-level closure

G2-05 is complete as a new prospective independent Research Generation 2 Study.

The prospectively frozen standard initial Bao RAW root was completely enumerated through depth 9. All reachable layers 0..9 and parent expansion layers 0..8 were complete, materialized verification passed, and a structurally separate independent implementation reproduced the full bounded domain.

Canonical exact endpoints:

```text
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
```

Canonical formal provenance:

```text
authorization/head = 9199a3d25ea38978673f94bfcd4250aa3b5411fa
workflow run = 33156581843
workflow job = 98800676702
artifact = 9679860509
artifact ZIP SHA256 = cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e
```

## No-rescue / upstream preservation

This closure does not alter:

- `G2-01 / PEOCR-STUDY1 = INCONCLUSIVE`;
- `G2-02 / SRDR-STUDY1 = INCONCLUSIVE`;
- `G2-03 / STSCV-STUDY1 = INCONCLUSIVE`, validated transform set `[]` and non-authorization of canonicalization;
- `G2-04 / REEOE-STUDY1 = INCONCLUSIVE`, including its Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED` result;
- G1 `SSGTC-STUDY1 = SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`.

No G2-04 selected root or partial closure and no G1 partial depth-9 row was used as G2-05 formal evidence. Stage 1 G2-05 development rows/roots were also excluded from Stage 2 evidence.

## Interpretation boundary

The exact result is bounded to the frozen standard-root depth-9 RAW domain. It does not authorize a total Bao state-space count, total game-tree complexity estimate, asymptotic growth model, symmetry-reduced count, game-theoretic solution, or engineering conclusion.

Any inference beyond enumerated depth 9 requires a new prospective Study. Full-game state-space/game-tree estimation remains reserved for future Research Generation 2 work, including G2-12.
