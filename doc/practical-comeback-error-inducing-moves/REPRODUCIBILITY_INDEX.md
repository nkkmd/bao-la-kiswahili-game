# PCEM-STUDY1 — Reproducibility Index （再現性）

## 日本語での要点

Stage 1はEXPLORATORY-ONLY、promotion 0件、Stage 2はNOT-AUTHORIZED-NOT-EXECUTEDである。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

Updated: 2026-08-25

## Study baseline （日本語の要点）

```text
studyId = PCEM-STUDY1
remoteMainHead = 587472b7e1a3f6e390cdfea6ed0d8e0971d5711d
branch = research/practical-comeback-error-inducing-moves
terminalState = COMPLETE
```

## Required upstream scientific records （日本語の要点）

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

## Study-owned protocol records （方法と設計）

- `preregistration/STUDY_START_FIREWALL.md`
- `protocol/CONSTRUCT_MEASUREMENT_DEPENDENCIES.md`
- `preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md`
- `preregistration/STAGE_1_DESIGN_SKELETON.md`
- `preregistration/STAGE_1_EXPLORATORY_SPEC.json`
- `preregistration/STAGE_1_FEATURE_DEFINITIONS.json`
- `preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json`
- `preregistration/STAGE_1_EXECUTION_AMENDMENT_1.json`
- `preregistration/STAGE_2_FORMAL_SKELETON.md`

Historical preregistration/status fields are preserved as records of their freeze points. They are not rewritten to terminal status after outcome generation. Current study state is carried by `CURRENT_STATUS.md`, the final report, compact result records, and the program closure decision.

## Authoritative representation （識別と表現）

```text
identityFields = pits,reserve,houseOwned,player,phase,winner,pending
excludedIdentityFields = turn,reason
pendingRequired = true
representedSeedTotal = 64
symmetryReduction = false
canonicalization = false
```

## Stage 0 implementation （Stageの記録）

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

## Stage 1 frozen inputs （Stageの記録）

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

## Stage 1 execution-only amendment provenance （Stageの記録）

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

## Stage 1 canonical execution code （Stageの記録）

The canonical scientific execution is identified by the **exact source commit and frozen Git blobs**, not merely by current repository paths.

```text
sourceCommit = f4b336ee6655c37f6c456ef1ba6175dc0816a93c
scientificWorkflowPath = .github/workflows/pcem-stage1-parallel.yml
scientificWorkflowGitBlobSha = 3320575988f9f0ec315a8d7474840745a99ae325
parallelProductionHelperGitBlobSha = 4ee0f0c595564a5222159b5f1e995091a1eb12a6
parallelIndependentHelperGitBlobSha = 9bcea2d351e9ba0755bdb851b247fd5c33a0dcd4
```

Canonical production components at that source commit include:

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

### Post-closure workflow-path distinction （結論）

After canonical Stage 1 completion, the file at `.github/workflows/pcem-stage1-parallel.yml` was intentionally replaced by a lightweight **closure guard** so PR synchronization cannot regenerate the completed 3,072-game scientific evidence. The current closure-guard workflow is therefore **not** the workflow blob frozen in `STAGE_1_EXECUTION_AMENDMENT_1.json`.

```text
canonical scientific workflow blob = 3320575988f9f0ec315a8d7474840745a99ae325
post-closure guard blob at provenance freeze = 53637539dca6269b63b18dd155e233dcf8a290b0
same blob = false
```

This is an intentional post-outcome operational hardening, not a change to the scientific execution. A scientific reproduction must check out the canonical source commit `f4b336ee...` (or otherwise restore the exact frozen blobs) rather than invoking the production binding check against the current closure-guard workflow.

## Canonical Stage 1 workflow （Stageの記録）

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

`stage1ResultHash` is the study's canonical-content hash computed by the Stage 1 runner over the canonical `stage1-result` object **before** the `resultHash` field was appended. It is not a byte SHA-256 of the later repository-facing compact JSON, which was augmented after the canonical workflow with workflow/artifact provenance. The scientific outcome fields were not changed by that augmentation.

Canonical files inside the verified artifact have these byte SHA-256 values:

```text
stage1-result.json = 0302b39d739e437175a054585ba53cb5b582c9ca8d015ecf671a4e28576b9b95
independent-verification.json = 89ba84c235c784d49fe2f6b0e9aed43549f77d65b26bbacd74866ffda7b074c6
discovery.json = 084a848d2c59b9407f1bf1dec593e9a43dfea031f1c39623f8b715f22106515d
selection.json = 6a47b73e229959256c18ec03f2de2542386d7a4a626972f0575be0f438467f7b
measurements.json = 95db19310648d8a6d5cdbf693c0000e9a74ec6a680773782dedcb21c668c5fb3
source-summary.json = 5d84a42938b0ca5bed14c505207313558b1d2be945e33934b5fa89d6ba25c1ea
parallel-control.json = 67a3cc16d841a35ee9ee496e1b6852657e441f0e80e3de75b6192e4adb6572bb
```

The machine-readable provenance clarification is `results/STAGE_1_ARTIFACT_PROVENANCE.json`.

## Stage 1 evidence accounting （Stageの記録）

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

## Stage 1 independent verification （Stageの記録）

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

## Repository-owned compact result records （結果）

- `results/STAGE_0_TECHNICAL_RESULT.json`
- `results/STAGE_1_EXPLORATORY_RESULT.json`
- `results/STAGE_1_INDEPENDENT_VERIFICATION.json`
- `results/STAGE_1_ARTIFACT_PROVENANCE.json`
- `results/STAGE_2_NON_AUTHORIZATION.json`
- `checkpoints/2026-08-25-stage0-technical-pass.md`
- `checkpoints/2026-08-25-stage1-exploratory-complete-stage2-not-authorized.md`
- `doc/research-program-decisions/2026-08-25-practical-comeback-error-inducing-move-study1-closure.md`

## Terminal scientific boundary （適用範囲と制限）

```text
Stage 1 scientificLabel = EXPLORATORY-ONLY
Stage 1 promoted candidates = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
reservedStage2SeedsConsumed = false
```

No threshold relaxation, candidate near-miss promotion, favorable subgroup rescue, altered opponent policy, expanded grammar, or reuse of Stage 1 rows as Stage 2 evidence is authorized.

## Reproduction rule after closure （結論）

For scientific reproduction or verification of the completed Stage 1:

1. use source commit `f4b336ee6655c37f6c456ef1ba6175dc0816a93c` and the exact execution bindings above;
2. treat workflow run `32820391017` plus artifact IDs/digests as the canonical execution record;
3. use `results/STAGE_1_ARTIFACT_PROVENANCE.json` to distinguish artifact byte hashes from the canonical-content `resultHash`;
4. do not interpret current post-closure workflow files as an authorization to regenerate or alter the completed scientific result.
