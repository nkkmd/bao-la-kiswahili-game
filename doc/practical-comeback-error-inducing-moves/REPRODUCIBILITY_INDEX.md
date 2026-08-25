# PCEM-STUDY1 — Reproducibility Index

Updated: 2026-08-25

## Study baseline

```text
studyId = PCEM-STUDY1
remoteMainHead = 587472b7e1a3f6e390cdfea6ed0d8e0971d5711d
branch = research/practical-comeback-error-inducing-moves
terminalState = COMPLETE
```

## Required upstream scientific records

- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/RESEARCH_INDEX.md`
- `doc/critical-positions-outcome-branching/STUDY_1_FINAL_REPORT.md`
- `doc/blunder-misvaluation-patterns/STUDY_1_FINAL_REPORT.md`
- `doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`
- `doc/position-complexity/STUDY_1_OVERVIEW.md`
- `doc/tactical-motifs/STUDY_1_OVERVIEW.md`
- `doc/restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md`
- `doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`
- `doc/oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md`
- `doc/state-space-game-tree-complexity/STUDY_1_FINAL_REPORT.md`

## Study-owned protocol records

- `preregistration/STUDY_START_FIREWALL.md`
- `protocol/CONSTRUCT_MEASUREMENT_DEPENDENCIES.md`
- `preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md`
- `preregistration/STAGE_1_DESIGN_SKELETON.md`
- `preregistration/STAGE_1_EXPLORATORY_SPEC.json`
- `preregistration/STAGE_1_FEATURE_DEFINITIONS.json`
- `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`
- `preregistration/STAGE_1_EXECUTION_AMENDMENT_1.json`
- `preregistration/STAGE_2_FORMAL_SKELETON.md`

## Authoritative representation

```text
identityFields = pits,reserve,houseOwned,player,phase,winner,pending
excludedIdentityFields = turn,reason
pendingRequired = true
representedSeedTotal = 64
symmetryReduction = false
canonicalization = false
```

## Stage 0 implementation

```text
tools/experiments/lib/practical-comeback-stage0-production.js
tools/experiments/run-pcem-stage0-technical.js
tools/experiments/verify-pcem-stage0-independent.js
test/practical-comeback-stage0-tooling.test.js
.github/workflows/pcem-stage0-technical.yml
```

Reference-search identity:

```text
pcem-exact-full-window-root-candidates/bao/q0/v1
```

Canonical Stage 0:

```text
stageId = PCEM-S0-TECHNICAL-2026-08-25-v1
sourceCommit = 29976182dcdcabf206a1d0bf59252fe8bb2288df
workflowRunId = 32813154014
workflowJobId = 97696278964
artifactId = 9550497573
artifactName = pcem-stage0-technical-v1
artifactDigest = sha256:0021c59fea047c0a192b0e9394513d63aba6347a02d79b1ce41b1bf6e61e2d32
workflowConclusion = success
productionGates = 12/12 PASS
independentGates = 8/8 PASS
```

Invalidated first technical attempt:

```text
workflowRunId = 32813015855
artifactId = 9550453776
classification = TECHNICALLY-INVALID
scientificEvidenceAuthorized = false
```

Its sole verifier failure was a self-matching independence audit; the run is retained only as provenance.

## Stage 1 frozen inputs

```text
stageId = PCEM-S1-EXPLORATORY-2026-08-25-v1
specSha256 = 26a7daea8588a460e19ae8e77485c50a092d714bfb3243608b5b64a95fa3fe22
featureDefinitionsSha256 = 3f1e622c86fca8d4153baca815000234cd1672ad5a6a259aaae4ffea4a6e84d6
authorizationSha256 = 3037ee2477bf58a6d77f325609933a40c69f008cd0820c9c1e9dce960e44fe7b
executionAmendmentSha256 = 6fd9dc408c7ff30cadbb1acefe3f27c591098bdb1dea53a9e26b651ca0c54c19
Stage1Seeds = 23200001..23203072
reservedStage2Seeds = 23300001..23306144
```

Pre-authorization workflow:

```text
workflowRunId = 32814139745
head = c40679a93ab0e01899496e889f42476a3ac10339
conclusion = success
scientificSeedGeneration = none
```

Hash-materialization workflow:

```text
workflowRunId = 32814274403
artifactId = 9550850177
artifactDigest = sha256:86d78ce3a88e65361aeae17bc0bae7d8d2f9b8c887a0e54b184f571f8d5ff270
```

## Stage 1 execution-only amendment provenance

The first authorized serial workflow proved too slow operationally. Before an interpretable Stage 1 result artifact existed, execution was prospectively amended to deterministic chunking without changing scientific evidence, seeds, population, thresholds, policies, endpoint, grammar or promotion rules.

Parallel contract:

```text
sourceChunks = 12 x 256 games
measurementChunks = 12 x <=25 selected roots
additionalScientificSeedsAllowed = false
scientificLogicChanged = false
```

Pre-seed parallel gate failures were retained in `STAGE_1_EXECUTION_AMENDMENT_1.json` and generated zero scientific seeds:

1. helper syntax defect;
2. execution-amendment JSON hierarchy reference defect;
3. independent-verifier self-audit defect.

None changed the frozen scientific contract.

## Stage 1 production implementation

Primary production components include:

```text
tools/experiments/run-pcem-stage1-exploratory.js
tools/experiments/run-pcem-stage1-parallel-execution.js
tools/experiments/lib/practical-comeback-stage1-corpus.js
tools/experiments/lib/practical-comeback-stage1-measurement.js
tools/experiments/lib/practical-comeback-stage1-discovery.js
.github/workflows/pcem-stage1-parallel.yml
```

Independent components include:

```text
tools/experiments/verify-pcem-stage1-parallel-execution.js
tools/experiments/lib/practical-comeback-stage1-independent-core.js
tools/experiments/lib/practical-comeback-stage1-independent-discovery.js
```

The independent verifier does not import the production Stage 1 corpus, measurement, or discovery modules.

## Canonical Stage 1 workflow

```text
workflowRunId = 32820391017
sourceCommit = f4b336ee6655c37f6c456ef1ba6175dc0816a93c
workflowConclusion = success
productionArtifactId = 9557783361
productionArtifactName = pcem-stage1-parallel-production-v1
productionArtifactDigest = sha256:e5936bba25b0aa55d81ec79c09710206d22f27b4a2f75903a6153694126ce693
verifiedArtifactId = 9558356215
verifiedArtifactName = pcem-stage1-parallel-verified-v1
verifiedArtifactDigest = sha256:bd92dc89283835c862e1fe6a86b4bbd7c43de696211d2761576b67055d202067
```

Canonical hashes:

```text
selectionHash = 5bf65534e88500b5d30565a1a9266664375a1d43b9a374b69aa7dd14c1409339
discoveryHash = 3cd0df252036aa5794a7699b21d833e1f68b854cb8b5ec25ec59d65a314b81e8
stage1ResultHash = 4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08
```

## Stage 1 evidence accounting

```text
generatedGames = 3072
uniqueHistoricalTrajectories = 2764
duplicateHistoricalTrajectoriesCollapsed = 308
selectedRoots = 300
namuaRoots = 150
mtajiRoots = 150
exactRootMoveInterventions = 1065
primaryContinuationRows = 12780
secondaryContinuationRows = 4260
referenceContinuationRows = 1065
totalContinuationRows = 18105
primaryAdministrativeHorizonExhaustions = 2
candidateAuditCount = 55
promotedCandidateCount = 0
```

All frozen readiness gates passed.

## Stage 1 independent verification

```text
decision = TECHNICAL-PASS
passed = true
independence = true
sourceReplay = true
selection = true
rawIdentity = true
measurement = true
discovery = true
gamesVerified = 3072
selectedRootsVerified = 300
rootMoveInterventionsVerified = 1065
candidateAuditCountVerified = 55
promotedCandidateCountVerified = 0
```

## Repository-owned compact result records

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_1_EXPLORATORY_RESULT.json`
- `results/STAGE_1_INDEPENDENT_VERIFICATION.json`
- `results/STAGE_2_NON_AUTHORIZATION.json`
- `checkpoints/2026-08-25-stage0-technical-pass.md`
- `checkpoints/2026-08-25-stage1-exploratory-complete-stage2-not-authorized.md`

## Terminal scientific boundary

```text
Stage 1 scientificLabel = EXPLORATORY-ONLY
Stage 1 promoted candidates = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
reservedStage2SeedsConsumed = false
```

No threshold relaxation, candidate near-miss promotion, favorable subgroup rescue, altered opponent policy, expanded grammar, or reuse of Stage 1 rows as Stage 2 evidence is authorized.
