# PCEM-STUDY1 — Stage 1 exploratory complete / Stage 2 not authorized

Date: 2026-08-25

## Canonical Stage 1 execution

```text
stageId = PCEM-S1-EXPLORATORY-2026-08-25-v1
sourceCommit = f4b336ee6655c37f6c456ef1ba6175dc0816a93c
workflowRunId = 32820391017
workflowConclusion = success
productionArtifactId = 9557783361
productionArtifactDigest = sha256:e5936bba25b0aa55d81ec79c09710206d22f27b4a2f75903a6153694126ce693
verifiedArtifactId = 9558356215
verifiedArtifactDigest = sha256:bd92dc89283835c862e1fe6a86b4bbd7c43de696211d2761576b67055d202067
resultHash = 4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08
```

## Evidence accounting

```text
generatedGames = 3072
uniqueHistoricalTrajectories = 2764
selectedRoots = 300
namuaRoots = 150
mtajiRoots = 150
exactRootMoveInterventions = 1065
primaryContinuationRows = 12780
secondaryContinuationRows = 4260
referenceContinuationRows = 1065
totalContinuationRows = 18105
primaryAdministrativeHorizonExhaustions = 2
```

All frozen readiness gates passed. Independent verification independently regenerated all 3072 source games, reconstructed root selection, remeasured the selected-root chunks, and reproduced discovery.

## Frozen Stage 1 result

```text
scientificLabel = EXPLORATORY-ONLY
candidateAuditCount = 55
candidatesPassingPromotionGates = 0
promotedCandidateCount = 0
manualPromotionPerformed = false
```

Every audited candidate failed at least one frozen promotion gate. In particular, all 55 failed each of the minimum unique-root, unique-historical-trajectory, distinct-opening-prefix, unique error-condition root, and unique defense-condition root support requirements. This result is not eligible for threshold relaxation or near-miss promotion.

## Stage 2 disposition

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
reserved Stage 2 seeds = 23300001..23306144
reserved Stage 2 seeds consumed = false
```

No Stage 1 row may be reused as Stage 2 formal evidence. No favorable subgroup, altered opponent policy, expanded candidate grammar, or post-outcome threshold change is authorized as a rescue of PCEM-STUDY1.

## Interpretation boundary

The Stage 1 exploratory rows can describe machine-operational behavior under the frozen population, D3/D2 reference semantics, `P_MEDIUM_D1_TOP3` opponent, and 96-ply bounded endpoint. They do not establish a validated practical comeback class, objective move superiority, game-theoretic winning probability, human difficulty/error inducement, or expert/traditional Bao terminology.
