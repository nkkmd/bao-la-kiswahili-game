# GCLD-STUDY1 — post-Stage-1 Stage 2 authorization review

Date: 2026-09-04
Program: Research Generation 3 / G3-10
Study: `GCLD-STUDY1`
Reviewed research branch artifact mirror commit: `194e35b4d611e8d043fb802266f39f129106f199`
Reviewed remote `main`: `0bcd1695b6dbd044acf2eed91740d282c63dbb07`

## Review boundary

This is a fresh-free control-plane review. It does not generate, read, peek or partially probe the protected standard-initial complete exact depth-10 holdout. It does not execute Stage 2 and does not consume any Stage 2 seed.

The review may use Stage 1 readiness/integrity fields but must not use Stage 1 endpoint direction, effect size, sign distribution or p-value as a promotion criterion.

## Stage 1 state

`GCLD-S1-DEVELOPMENT-2026-09-03-v1` was executed exactly once by Actions run `33767857909` after source-bound authorization and durable pre-computation lease materialization.

Canonical result artifact:

```text
artifact ID = 9899355887
artifact ZIP SHA-256 = 12a498f8da08adedb8dd8ab758790e3395927dd2580c9d9e8f45e89ac0270ed2
stage disposition = STAGE1-PASS
same-evidence rerun = false
formal inference performed = false
p-values computed = false
effect sizes used for promotion = false
endpoint signs used for promotion = false
```

Readiness gates:

```text
candidate trajectories = 24/24 complete
fully resource-eligible trajectories = 24
minimum required = 18
measured trajectories = 16/16
measured population frozen before coordinates = true
production / independent exact agreement = true
control permutations = 32 per measured trajectory
C1 defined contrasts = 16
C2 defined contrasts = 16
C3 defined contrasts = 16
C4 defined contrasts = 16
C5 defined contrasts = 16
minimum required per endpoint = 14
checkpoint as inferential unit = false
stage2Eligible = true
```

The durable artifact was mirrored without scientific recomputation. The first recovery-only workflow attempt `33808888530` failed before any repository result mirror because its expected filename manifest was incorrect. The artifact itself was unchanged. Corrected recovery-only run `33809061161` verified the same ZIP digest, all eight exact file hashes and the exact file set, then committed only the artifact bytes in commit `194e35b4d611e8d043fb802266f39f129106f199`. No scientific rerun occurred.

## Stage 2 frozen contract

The already-prospective Stage 2 contract remains unchanged:

```text
Stage ID = GCLD-S2-FORMAL-2026-09-03-v1
fresh seed block = 32220001..32220384
candidate trajectories = 48
minimum fully resource-eligible = 40/48
formal measured population = first 32 eligible trajectories after complete 48 x 15 preflight
checkpoint plies = 16..72 every 4 ply
primary endpoints = C1..C5
formal test = exact two-sided binomial sign test at trajectory level
multiplicity = Holm across C1..C5 at exact family alpha 1/20
minimum formal nonzero trajectories per endpoint = 20
Stage 1 trajectory / opening-prefix / checkpoint identity exclusion = mandatory
post-coordinate trajectory replacement = prohibited
same-evidence rerun = prohibited
```

No Stage 1 outcome was used to change any Stage 2 seed, population, endpoint, direction, threshold, control permutation, test, multiplicity rule, resource ceiling or estimability rule.

## Dependency and integrity review

PASS:

- `CRCLGR-STUDY1` remains formally eligible for the frozen continuous representation;
- GCLD Stage 0 is `STAGE0-PASS`;
- GCLD Stage 1 is `STAGE1-PASS`;
- Stage 1 identity-only exclusion for Stage 2 exists and is durably mirrored;
- Stage 2 has an independent fresh seed namespace;
- trajectory remains the sole inferential unit;
- production/independent implementation separation remains mandatory;
- protected depth-10 remains sealed;
- no Stage 1 same-evidence rerun occurred;
- `main` integration remains unauthorized.

## Formal decision

**`GCLD-STAGE2-AUTHORIZED`**

Exactly one fresh formal execution of `GCLD-S2-FORMAL-2026-09-03-v1` may be performed after Stage 2 tooling, verifier, workflow and a source-bound machine authorization artifact are frozen prospectively. The final scientific execution must be triggered separately from its authorization commit.

This decision does not authorize redesign, seed extension, trajectory replacement, resource-ceiling relaxation, endpoint/test changes, protected depth-10 access, same-evidence rerun or `main` integration.
