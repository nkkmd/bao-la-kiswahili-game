# PCEM-STUDY1 — Current Status （現在の状態）

## 日本語での要点

Stage 1はEXPLORATORY-ONLY、promotion 0件、Stage 2はNOT-AUTHORIZED-NOT-EXECUTEDである。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

Updated: 2026-08-25

## Study identity （識別と表現）

```text
studyId = PCEM-STUDY1
slug = practical-comeback-error-inducing-moves
branch = research/practical-comeback-error-inducing-moves
studyStartMainHead = 587472b7e1a3f6e390cdfea6ed0d8e0971d5711d
```

## Terminal study state （日本語の要点）

```text
study = COMPLETE
Stage 0 = TECHNICAL-PASS
Stage 1 = EXPLORATORY-ONLY / COMPLETE
Stage 1 promoted candidates = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
scientificOutcomeGenerated = true
```

The terminal result is a valid zero-promotion exploratory result, not a technical failure. No upstream completed-study decision is reopened or rescued.

## Stage 0 canonical record （Stageの記録）

```text
stageId = PCEM-S0-TECHNICAL-2026-08-25-v1
canonical source commit = 29976182dcdcabf206a1d0bf59252fe8bb2288df
workflow run = 32813154014
job = 97696278964
artifact = 9550497573
artifact digest = sha256:0021c59fea047c0a192b0e9394513d63aba6347a02d79b1ce41b1bf6e61e2d32
production = PASS (12/12 technical gates)
independent verification = TECHNICAL-PASS (8/8 gates)
```

Technical coverage:

```text
fixtures = 3
phases = Namua + Mtaji
exact root moves = 15
exact first replies = 38
continuation rows = 60
accounted rows = 60
production elapsed = 4857.528147 ms
max RSS = 94.82421875 MiB
```

The first workflow run `32813015855` remains an invalidated technical attempt. Its verifier independence audit self-matched its own forbidden-module literals; no scientific outcome was used in the correction.

## Stage 1 frozen design （方法と設計）

```text
stageId = PCEM-S1-EXPLORATORY-2026-08-25-v1
specSha256 = 26a7daea8588a460e19ae8e77485c50a092d714bfb3243608b5b64a95fa3fe22
featureDefinitionsSha256 = 3f1e622c86fca8d4153baca815000234cd1672ad5a6a259aaae4ffea4a6e84d6
source games = 3072
Stage 1 seeds = 23200001..23203072
Stage 2 reserved seeds = 23300001..23306144
selected-root target = 300 (Namua 150 / Mtaji 150)
primary imperfect opponent = P_MEDIUM_D1_TOP3
primary replicates per exact root move = 12
bounded continuation horizon = 96 post-root plies
candidate templates = PCEM-T1..T8
zeroPromotedCandidatesAllowed = true
```

The disadvantaged-root rule was outcome-blind at selection time: one state was hash-ranked within the assigned phase before reference disadvantage was inspected; it was eligible only if the frozen D3 reference best score was `< 0`. No replacement within trajectory was permitted after reference failure.

## Stage 1 execution and verification （Stageの記録）

Canonical run:

```text
sourceCommit = f4b336ee6655c37f6c456ef1ba6175dc0816a93c
workflowRunId = 32820391017
workflowConclusion = success
productionArtifactId = 9557783361
productionArtifactDigest = sha256:e5936bba25b0aa55d81ec79c09710206d22f27b4a2f75903a6153694126ce693
verifiedArtifactId = 9558356215
verifiedArtifactDigest = sha256:bd92dc89283835c862e1fe6a86b4bbd7c43de696211d2761576b67055d202067
resultHash = 4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08
```

Evidence accounting:

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

All frozen readiness gates passed. The independent verifier independently regenerated all 3072 source games and reproduced selection, RAW identity, measurement, and discovery.

## Stage 1 result （結果）

```text
scientificLabel = EXPLORATORY-ONLY
candidateAuditCount = 55
candidatesPassingPromotionGates = 0
promotedCandidateCount = 0
manualPromotionPerformed = false
```

All 55 audited candidate definitions failed the frozen minimum unique-root, unique-historical-trajectory, distinct-opening-prefix, unique error-condition root, and unique defense-condition root support requirements. Some other individual effect/error-dependence gates passed for subsets, but no candidate passed the full preregistered conjunction and no near-miss promotion is authorized.

## Stage 2 disposition （Stageの記録）

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
stage2GenerationAuthorized = false
reserved seeds = 23300001..23306144
reserved seeds consumed = false
```

Threshold relaxation, favorable subgroup rescue, candidate grammar expansion, opponent-policy substitution, and reuse of Stage 1 rows as Stage 2 evidence are prohibited.

## Interpretation boundary （適用範囲と制限）

The study does not establish objective move superiority, game-theoretic optimality, true Bao winning probability, all-opponent-strength effectiveness, human difficulty/error inducement, or expert/traditional recognition as a Bao winning try.

Machine-only reply structure remains machine-operational. RAW-ONLY identity remains authoritative. No symmetry/canonicalization is authorized.

## Canonical repository records （リポジトリ状態）

- `STUDY_1_FINAL_REPORT.md`
- `results/STAGE_1_EXPLORATORY_RESULT.json`
- `results/STAGE_1_INDEPENDENT_VERIFICATION.json`
- `results/STAGE_2_NON_AUTHORIZATION.json`
- `checkpoints/2026-08-25-stage1-exploratory-complete-stage2-not-authorized.md`

## Git boundary （適用範囲と制限）

No merge to `main`, auto-merge, or branch deletion is authorized without explicit user instruction.
