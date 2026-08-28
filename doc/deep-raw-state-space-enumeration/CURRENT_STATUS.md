# DRSSE-STUDY1 — Current Status

Updated: 2026-08-28  
Program: `G2-05` / Research Generation 2  
Study: `DRSSE-STUDY1` — Deep RAW State-Space Enumeration Study 1

## Status

**STUDY COMPLETE / MAIN INTEGRATION COMPLETE — `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`**

Stage state:

```text
DRSSE-S0-TECHNICAL-2026-08-28-v1 = STAGE0-TECHNICAL-PASS
DRSSE-S1-DEVELOPMENT-2026-08-28-v1 = STAGE1-DEVELOPMENT-PASS
DRSSE-S2-FORMAL-2026-08-28-v1 = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

Formal bounded endpoint:

```text
root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
complete layers = 0..9
cumulative RAW states = 102857
cumulative depth-labelled legal edges = 106773
cumulative tree node occurrences = 136645
lastCompleteDepth = 9
firstIncompleteDepth = null
stopReason = null
```

Independent verification completed successfully, including full exact re-enumeration of the frozen depth-9 domain.

Canonical Stage 2 provenance:

```text
head = 9199a3d25ea38978673f94bfcd4250aa3b5411fa
run = 33156581843
job = 98800676702
artifact = 9679860509
artifact ZIP SHA256 = cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e
```

## Repository integration

```text
PR = #71
final research head = a6a4dc73ae1b448a909913dbff99b06862da2ac0
merge method = merge
merge commit = 8d024c5a6b5114eefbab8fb23d54582d149b85f3
integrated branch = main
```

All five final PR workflows passed on the final research head. Both automated review threads were dispositioned and resolved before merge. The post-review audit did not alter or rerun the frozen Stage 2 formal source or evidence.

## Immutable boundaries

- G2-01 remains `INCONCLUSIVE`.
- G2-02 remains `INCONCLUSIVE`.
- G2-03 remains `INCONCLUSIVE`; validated transform set remains `[]` and canonicalization is not authorized.
- G2-04 remains `INCONCLUSIVE`; G2-05 is not its rescue.
- G1 SSGTC remains `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`.
- No full-game state-space or game-tree estimate is authorized by G2-05.
- Full-game extrapolation remains future prospective work, including G2-12.

G2-05 scientific outcome generation is closed. Subsequent work must proceed as a new prospective Study/version where required.
