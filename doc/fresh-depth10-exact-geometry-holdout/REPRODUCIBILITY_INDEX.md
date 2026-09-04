# FDEGHV-STUDY1 — REPRODUCIBILITY INDEX

更新日: 2026-09-04

## 1. Source-of-truth

```text
Program = Research Generation 3 / G3-11
Study = FDEGHV-STUDY1
Research branch = research/g3-11-fresh-depth10-exact-geometry-holdout
Reviewed main anchor = e537199a959c0808cbef6cf8aaeb1caab91e3702
Formal Stage = FDEGHV-S1-FORMAL-HOLDOUT-2026-09-04-v1
Representation = RAW-ONLY
Protected depth-10 = CONSUMED EXACTLY ONCE
Depth 11 = NOT AUTHORIZED / NOT ACCESSED
Main integration = COMPLETE / FAST-FORWARD / source tip 03d1b5bf28ed45aaa9480f0a7c5efc6d394fcbae / previous main e537199a959c0808cbef6cf8aaeb1caab91e3702 / force=false
```

Historical `doc/research-generation-3/PROGRAM_PLAN.md` is not a current-state document and remains unchanged.

## 2. Protocol and preregistration

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `prereg/STAGE_0_TECHNICAL_SPEC.json`
- `prereg/STAGE_1_FORMAL_SPEC.json`
- `../research-program-decisions/2026-09-04-post-g3-10-g3-11-authorization-review.md`

Frozen Stage 1 spec SHA-256:

`6d5a15091f5d4f28abc2a880dcf372ff85aff83be016b8abce7e1921268a8c01`

## 3. Source binding

Stage 1 authorization froze the following Git blob identities before protected evidence was opened:

| Path | Git blob SHA |
| --- | --- |
| `.github/workflows/fdeeghv-stage1-formal.yml` | `312185db5e1f2dee2e7abe7275ef764ad4700297` |
| `doc/fresh-depth10-exact-geometry-holdout/prereg/STAGE_1_FORMAL_SPEC.json` | `10ce4beace984fd3381f734b3a838eb05ce0fff7` |
| `public/engine.js` | `2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c` |
| `tools/experiments/run-fdeeghv-stage1-formal.js` | `1454c0158857b78519f18deeac96449a9a1c85fa` |
| `tools/experiments/verify-fdeeghv-stage1-independent-v2.js` | `3c8bbe590df2c6233c81f3bb37976a05b601c3dd` |
| `tools/experiments/finalize-fdeeghv-stage1-artifact.js` | `0943c37a3f6e8ca8cb2da8c1f1bf18d4a65099a4` |
| `tools/experiments/lib/fdeeghv-contract.js` | `4a9cf45b9abe6933c3949683038e5f3de7b9a518` |
| `tools/experiments/lib/drsse-production.js` | `e8fc23799415f566850c817c22cf658216bb98be` |
| `tools/experiments/lib/drsse-independent.js` | `906e0412bcf47fe37d95ac29ad83f9c83bc52857` |

Stage 1 source commit:

`852c3ec1003b8acb501610ecbb24fed11438d379`

## 4. Stage 0 technical validation

```text
Stage = FDEGHV-S0-TECHNICAL-2026-09-04-v1
Actions run = 33834641015
artifact ID = 9922855242
artifact digest = sha256:cb67ae1e768c725a6d4474c02fec9c51993a3fc4a11650c714ef83294e10e632
Stage 0 result SHA-256 = cbe1a078568a4d1162c9703dc089c1f9413cb0c2f34dd4f0b2925550ef3e1ea9
technical result = STAGE0-PASS
protected depth-10 access = false
```

The enclosing workflow later reported failure only in a post-artifact documentation-sync step. The technical Stage 0 execution was not rerun.

## 5. Formal authorization and durable lease

Canonical authorization:

`authorizations/STAGE_1_EXECUTE.json`

Authorization SHA-256:

`5dd1174eec4034c33a9d6d4c97c1c2169e8e2fdf79a053685c24196e0bc6e9ed`

Authorization fixed:

```text
executionAuthorized = true
scientificInferenceAuthorized = true
protectedDepth10AccessAuthorized = true
executionCountAuthorized = 1
maximumScientificExecutionsAuthorized = 1
depth11AccessAuthorized = false
sameEvidenceRerunAuthorized = false
g2_12EstimatorScientificInputAuthorized = false
```

Stage 1 pre-computation lease:

```text
Actions run = 33837413663
lease artifact ID = 9923733141
lease artifact digest = sha256:ed2ff24a146a5d22b3597cd9ab9ffaa7b09c086ee5c3e0463a072a386d5fc631
lease file SHA-256 = 8edf6e7e4dbedade15caef96b394e84af17dd816b0925c8dbf08f4b65f06d6a9
```

The lease artifact was uploaded before scientific access.

## 6. Stage 1 production and verified artifacts

```text
Actions run = 33837413663
run number = 1
workflow conclusion = success
production artifact ID = 9923774940
production artifact digest = sha256:d5863afe43b1f11221cc3a856a24ec8a12bce33b1094057b58abe19dcfb7ae76
verified artifact ID = 9923817605
verified artifact digest = sha256:d7c5b87954fdc472e989f27ef30389fcda7fe6196e8ab86493fdd9a080b94ff5
exact-byte compact mirror commit = 498cd3a0210169f8a692c52d6961c317d20ae81e
```

The production artifact was durably uploaded before independent verification. The verified artifact was then uploaded after independent verification/finalization.

## 7. Canonical result files

Repository compact mirror:

- `results/stage-1/STAGE_1_FORMAL_RESULT.json`
- `results/stage-1/STAGE_1_PRODUCTION_SUMMARY.json`
- `results/stage-1/result-core.json`
- `results/stage-1/ARTIFACT_MANIFEST.json`

Important SHA-256 identities:

```text
scientific result core = 5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9
production result core = 13f42d92549b9f796ef963aad3883f72bf63e27908cee2245d1dd4b8b73e4876
independent core = 2e913c8458037db33de0083981bf4442316bb28d7bf7dc4d05419b8e4a0057d5
result-core.json file = 9ad9cafe3e7d4ba54b23b1a0c153b8150c690cff8aea5cc0ea12925b8de93dff
STAGE_1_FORMAL_RESULT.json file = 4b7c283cef58aeba24759711d71bd59378e7b4e39bfc5c780df4e3c1bd0b8a93
STAGE_1_PRODUCTION_SUMMARY.json file = 6d2e8d17ffaa3275ff5a604263b21a8c5f8e6e80ffb2a7664ede51ce7f7e226d
```

`ARTIFACT_MANIFEST.json` contains the exact per-file SHA-256 values for all production materialization files in the verified artifact, including layer state/edge JSONL and depth checkpoints.

## 8. Exact scientific result

```text
formalDecision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
targetComplete = true
lastCompleteDepth = 10
firstIncompleteDepth = null
stopReason = null
```

Depth-10 exact values:

```text
unique RAW states = 348270
new RAW states = 348270
tree-node occurrences = 494456
arrival edges = 359995
duplicate arrivals = 11725
states with multiple predecessors = 10383
```

Cumulative through depth 10:

```text
distinct RAW states = 451127
depth-labelled legal edges = 466768
unique RAW graph edges = 466768
tree-node occurrences = 631101
tree-edge occurrences = 631100
tree/RAW ratio = 1.3989430914132828
```

## 9. Independent verification

```text
materialized verification = PASS
verified layer count = 11
verified parent-layer count = 10
full independent exact depth-10 re-enumeration = PERFORMED / PASS
```

The independent verifier did not import the production enumerator, production serializer, or production target evaluator. It shared only the study-bound Bao rule engine and independently reconstructed RAW keys, exact enumeration summaries, resource checks, and H1–H4 target calculations.

## 10. Resource gates

Frozen ceilings:

```text
max cumulative distinct RAW states = 2000000
max depth-labelled edges = 12000000
max parent expansions = 2000000
max move evaluations = 12000000
max cumulative tree-node occurrences = 50000000000
max RSS bytes = 6442450944
max wall-clock seconds = 5400
max uncompressed artifact bytes = 1073741824
```

Observed final gates all passed. No ceiling was changed after protected evidence was opened.

## 11. Reproduction boundary

The exact artifacts may be audited read-only and the code path may be independently studied. However, the protected depth-10 evidence has already been consumed exactly once for this Study/version.

A new execution over the same protected evidence is **not** a new prospective confirmation and is not authorized by this Study. Depth 11 requires a separate prospective Study. G2-12 estimator output must not be introduced retroactively as an expected count, tuning input, or interpretation aid for FDEGHV-STUDY1.

`main` integration is a repository operation, not part of scientific reproduction, and remains unperformed until explicit user instruction.