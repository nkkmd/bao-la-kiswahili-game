# DRSSE-STUDY1 — Reproducibility Index

Updated: 2026-08-28  
Status: **COMPLETE / EXACT WITHIN FROZEN DEPTH-9 DOMAIN / MAIN INTEGRATED**

## Study anchor

```text
Program = G2-05
Study ID = DRSSE-STUDY1
Research Generation = Research Generation 2
Baseline main = c515c36a9b27a796dc7eae13fd1b2cec2b9d3ea6
Branch = research/g2-05-deep-raw-state-space-enumeration
Formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

## Authoritative representation

```text
RAW identity include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
missing pending = invalid
represented seeds = 64
validated transform set = []
symmetry reduction = false
canonicalization = false
```

Exact move identity fields:

```text
type,phase,row,index,direction,side,houseChoice,houseTwo
```

## Primary study files

- `STUDY_1_PROTOCOL.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `RESEARCH_LOG.md`
- `results/STUDY_1_FINAL_RESULT.json`

## Stage 0

```text
Stage ID = DRSSE-S0-TECHNICAL-2026-08-28-v1
Decision = STAGE0-TECHNICAL-PASS
Run = 33155526103
Job = 98797262242
Artifact = 9679427896
Artifact ZIP SHA256 = 7cd8dbb4e61acf113c0085b79bd298a7588994447750e0f7d4d8201e51c638c4
```

Canonical compact result:

- `results/STAGE_0_TECHNICAL_RESULT.json`

Technical implementation:

- `tools/experiments/lib/drsse-production.js`
- `tools/experiments/lib/drsse-independent.js`
- `tools/experiments/run-drsse-stage0-technical.js`
- `tools/experiments/verify-drsse-stage0-independent.js`
- `.github/workflows/drsse-stage0-technical.yml`

Relevant checkpoints:

- `checkpoints/2026-08-28-stage0-implementation-freeze.md`
- `checkpoints/2026-08-28-stage0-preoutput-workflow-failure.md`
- `checkpoints/2026-08-28-stage0-fixture-hash-binding-block.md`
- `checkpoints/2026-08-28-stage0-technical-acceptance.md`

Stage 0 is technical-only and is not G2-05 scientific evidence.

## Stage 1

```text
Stage ID = DRSSE-S1-DEVELOPMENT-2026-08-28-v1
Decision = STAGE1-DEVELOPMENT-PASS
Fresh seed block = 28050001..28050064
Selected roots = 3 Namua + 3 Mtaji
Complete depth-5 development domains = 6/6
Run = 33155886879
Job = 98798433942
Artifact = 9679565765
Artifact ZIP SHA256 = 47f83b614876a988495c8a68f8d63dda9bf9de105b967398178e6b4bc4fade04
```

Canonical contract/result:

- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
- `authorizations/STAGE_1_EXECUTE.json`
- `results/STAGE_1_DEVELOPMENT_RESULT.json`
- `checkpoints/2026-08-28-stage1-implementation-freeze.md`
- `checkpoints/2026-08-28-stage1-development-acceptance.md`

Implementation:

- `tools/experiments/run-drsse-stage1-development.js`
- `tools/experiments/verify-drsse-stage1-independent.js`
- `.github/workflows/drsse-stage1-development.yml`

Stage 1 rows and roots are explicitly not reusable as formal Stage 2 evidence.

## Stage 2 prospective source freeze

Formal spec:

- `preregistration/STAGE_2_FORMAL_SPEC.json`
- Git blob at formal freeze: `705628a3cdfcc2899e3ae53f0fa17d614cb227e9`
- file SHA256 in canonical formal run: `b7af4dbf962655d8600391aa09d08531ea7126774a8f4142305c5315379f9013`

Formal authorization:

- `authorizations/STAGE_2_EXECUTE.json`
- authorization/head commit: `9199a3d25ea38978673f94bfcd4250aa3b5411fa`
- file SHA256: `768e027346ad13984b1231e0440224311c65c0061cde00d80cd45d7085028f0f`

Frozen source Git blobs:

```text
STAGE_2_FORMAL_SPEC.json = 705628a3cdfcc2899e3ae53f0fa17d614cb227e9
drsse-production.js = e8fc23799415f566850c817c22cf658216bb98be
drsse-independent.js = 906e0412bcf47fe37d95ac29ad83f9c83bc52857
run-drsse-stage2-formal.js = 18b2f539e1062a703dd511379e8c3889eaec3866
verify-drsse-stage2-independent.js = 7c0189ce468a697e0283cae57bb5959a9d5e3870
public/engine.js = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
drsse-stage2-formal.yml = facd279003bbb7d85c9156a54696d59266c1ca91
```

Checkpoint:

- `checkpoints/2026-08-28-stage2-formal-source-freeze.md`

## Stage 2 canonical execution

```text
Stage ID = DRSSE-S2-FORMAL-2026-08-28-v1
Formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
Root RAW key = 2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6
Target depth = 9
Run = 33156581843
Job = 98800676702
Artifact = 9679860509
Artifact name = drsse-stage2-formal-v1
Artifact ZIP SHA256 = cca193ec27e4b2dc170266a13395248e93625bdb93ca7e3a669a5cde4ca4a71e
```

Canonical repository results:

- `results/STAGE_2_FORMAL_RESULT.json`
- `results/STUDY_1_FINAL_RESULT.json`
- `checkpoints/2026-08-28-stage2-formal-acceptance.md`

Canonical artifact/file identities:

```text
stage2-formal-result artifact file SHA256 = 3b6b0b194f79b4c768e0af775bca33ffa2e143c52f52b8f27db23c12a02c8545
production summary SHA256 = 25f04f6aff96c3fac02d84c529fb13355c512320167f4a7cf2f8a4a767978d76
production result-core file SHA256 = b39ddbcf3f490e63d7304d0571c8d0c26d6ab0c5ce20eb69a445958e35f8794a
production resultCoreSha256 = b9e79571ab2492edf717569cb331f381e4dbff603684d2e932b8b57c2ffb322b
independentCoreSha256 = 02e4a1fa865af977cb10c1f288c42886b32453e56a40bc85cbb0dc9975b257d3
decisionCoreSha256 = c1756994ceea3ea9b605805ddd6387f359aeb14e14d894bfc8a1e8b26122fa3f
```

Exact cumulative state/edge identities:

```text
cumulativeRawStateSetSha256 = 993c5056ca54521b7b124d8c5c97fa18d8ef04b860b5e4c6870df278d5944816
cumulativeGlobalRawGraphEdgeSetSha256 = da836a6a0b2e18c155f59de7617b4e72ab62955410ca7725a3f3525211f9a654
cumulativeDepthLabelledEdgeSetSha256 = 3453b457aee547c645be0ec3a3a5550656e9fcaa1917be13d5ac0bb0e7b69aed
```

## Exact endpoint replay target

A correct reproduction of the frozen formal domain must recover:

```text
complete reachable layers = 0..9
complete parent layers = 0..8
cumulative RAW states = 102857
depth-labelled legal edges = 106773
unique RAW graph edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
```

and the exact set hashes above.

## Independent verification contract

The independent path does not import the production enumerator or production serializer. It independently implements RAW representation serialization/keying and full-domain enumeration, while both paths necessarily invoke the same repository rule engine for Bao legal moves and state transition semantics.

Formal exactness required both:

1. complete materialized state/edge verification; and
2. independent full depth-9 re-enumeration agreement.

Both passed in the canonical Stage 2 execution.

## PR review disposition

Two latent implementation concerns identified on PR #71 are preserved at:

- `checkpoints/2026-08-28-pr71-review-disposition.md`

They do not alter the canonical result because the accepted run took the target-complete path with full independent depth-9 re-enumeration, and its final recorded resource use remained below every frozen cap. Frozen Stage 2 source blobs were not modified or rerun after outcome observation.

## Main integration provenance

```text
PR = #71
final research head = a6a4dc73ae1b448a909913dbff99b06862da2ac0
final PR CI = all five workflows success
merge method = merge
merge commit = 8d024c5a6b5114eefbab8fb23d54582d149b85f3
integrated branch = main
```

Final PR workflow runs on the research head:

```text
DRSSE Study 1 Closure CI = 33167122626 / success
Second-generation research agenda audit = 33167122612 / success
SSGTC closure consistency audit = 33167122620 / success
PCEM closure consistency audit = 33167122615 / success
Phase Transition Research CI = 33167122608 / success
```

Post-merge integration checkpoint:

- `checkpoints/2026-08-28-main-integration.md`

## Interpretation boundary

Reproduction of these values establishes only the frozen standard-root depth-9 RAW domain. It does not establish total Bao state-space size, total game-tree complexity, asymptotic growth, symmetry-reduced counts, game-theoretic value, or AI performance.
