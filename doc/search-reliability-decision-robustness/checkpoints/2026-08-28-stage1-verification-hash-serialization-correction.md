# G2-02 Stage 1 verification hash serialization correction

Date: 2026-08-28

Study: `SRDR-STUDY1` — Search Reliability / Decision Robustness Study 1

Stage: `SRDR-S1-DEVELOPMENT-2026-08-27-v1`

Correction ID: `SRDR-S1-VERIFICATION-HASH-CORRECTION-2026-08-28-v1`

## Status before correction

The authorized Stage 1 development workflow run `33067208005` completed the frozen scientific generation, state selection, and search measurement path successfully.

Frozen population and measurement outputs:

- games generated: `1280 / 1280`
- unique historical trajectories: `1057`
- selected unique RAW states: `1018`
- Namua selected states: `527`
- Mtaji selected states: `491`
- selection hash: `ed00623f244310b29bc25c0885f287321d4430df1b4d8e4a3a061c06dfc62052`
- stored production measurement hash: `9b3425d546bdb59176fb49711161b0d5b79fb368039d65a89946ad37efb98532`

The frozen independent verifier then completed all replay and remeasurement work but failed closed on the final aggregate measurement hash check.

Independent verifier evidence before correction:

- games verified: `1280`
- game replay mismatches: `0`
- selected-state mismatches: `0`
- measurement mismatches: `0`
- selection hash match: `true`
- stored measurement hash: `9b3425d546bdb59176fb49711161b0d5b79fb368039d65a89946ad37efb98532`
- independently recomputed measurement hash: `76225f2d76176ab13bfa34566874b13e14b97c587b1505877504b0aa68959eea`
- measurement hash match: `false`

Because the aggregate hash did not match, Stage 1 readiness analysis was correctly skipped. No Stage 1 development outcome was used to alter the protocol, population, search grid, endpoints, thresholds, or decision rule.

## Root cause

The discrepancy is a representation-only hash serialization defect in the frozen production measurement path.

`compactSearchResult()` in `tools/experiments/lib/search-reliability-stage1-measurement.js` always creates the object properties:

```text
attemptedDepth
abortedDepth
```

For exact-depth search conditions, the underlying frozen production search result does not define these two values. The in-memory production object therefore contains:

```text
attemptedDepth: undefined
abortedDepth: undefined
```

The frozen `stableStringify()` implementation hashes these object keys as literal `undefined` tokens. Later, normal JSON persistence through `JSON.stringify()` omits object properties whose value is `undefined`.

Therefore:

1. the production measurement hash was computed from an in-memory representation containing two `undefined` fields per exact-depth condition;
2. the persisted JSON artifact omitted those fields;
3. the independent verifier reconstructed the scientific rows semantically and matched every row (`measurementMismatches = 0`), but its exact-depth compact representation did not create the undefined-only fields;
4. its canonical aggregate hash therefore matched the persisted artifact rather than the production pre-serialization representation.

This defect does **not** change any search result, move identity, score, rank, TopSet, PV, selected RAW state, trajectory, phase assignment, or scientific endpoint value.

## Exact forensic reproduction

Using only the uploaded frozen Stage 1 artifact from run `33067208005`:

- canonical hash of persisted measurement rows = `76225f2d76176ab13bfa34566874b13e14b97c587b1505877504b0aa68959eea`
- this exactly equals the frozen independent verifier recomputation;
- after restoring `attemptedDepth = undefined` and `abortedDepth = undefined` for each prospectively frozen exact-depth condition, the frozen production pre-serialization hash becomes `9b3425d546bdb59176fb49711161b0d5b79fb368039d65a89946ad37efb98532`;
- this exactly equals the stored production measurement hash.

Thus both previously observed hashes are reproducible from one immutable scientific artifact and the frozen source semantics.

## Correction rule

No scientific generation, seed use, search replay, state replacement, measurement replacement, search-grid change, endpoint change, threshold change, or readiness-gate relaxation is authorized by this correction.

The correction may mark independent verification as passed only if all of the following are simultaneously true:

1. the original frozen independent verifier completed all `1280` game replays;
2. `gameReplayMismatches == 0`;
3. `selectedStateMismatches == 0`;
4. `measurementMismatches == 0`;
5. the independently recomputed selection hash equals the stored selection hash;
6. the canonical hash recomputed from the persisted measurement rows equals the original independent verifier recomputed measurement hash;
7. restoring the two frozen exact-depth `undefined` fields reproduces the original stored production measurement hash exactly.

This is a verification-contract repair, not a scientific rescue.

## No-rescue boundary

The following remain prohibited:

- new Stage 1 scientific seeds;
- Stage 1 seed extension;
- replacement trajectories or RAW states;
- search-grid changes;
- TopSet/tie tolerance changes;
- endpoint substitution;
- readiness-threshold relaxation;
- favorable subgroup selection;
- alternate-primary relabeling;
- treating higher-resource search as game-theoretic truth;
- Stage 2 generation without a separate prospective authorization.

## Artifact provenance

Original workflow run: `33067208005`

Original artifact ID: `9651424447`

Original artifact name: `g2-02-stage1-development-v1`

Original uploaded artifact ZIP SHA-256:

```text
2c90e3cdd935bdbeab4e79f99eba3b59968763327cd78e8e912cfc7864e04627
```

The original failed verifier result must be preserved as `stage1-verification-original.json` when the corrected verification record is materialized.
