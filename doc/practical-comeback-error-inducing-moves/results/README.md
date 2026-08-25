# PCEM-STUDY1 Results Directory

Status: **STUDY 1 COMPLETE**

## Canonical compact records

- `STAGE_0_TECHNICAL_RESULT.json` — Stage 0 technical-only canonical result.
- `STAGE_1_EXPLORATORY_RESULT.json` — Stage 1 repository-facing compact exploratory result.
- `STAGE_1_INDEPENDENT_VERIFICATION.json` — independent full reconstruction result.
- `STAGE_1_ARTIFACT_PROVENANCE.json` — canonical artifact byte hashes, result-hash scope, exact scientific workflow binding, and post-closure workflow distinction.
- `STAGE_2_NON_AUTHORIZATION.json` — terminal Stage 2 non-authorization record.

## Stage 1 canonical outcome

```text
scientificLabel = EXPLORATORY-ONLY
generatedGames = 3072
selectedRoots = 300
candidateAuditCount = 55
promotedCandidateCount = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Canonical workflow:

```text
workflowRunId = 32820391017
sourceCommit = f4b336ee6655c37f6c456ef1ba6175dc0816a93c
productionArtifactId = 9557783361
productionArtifactDigest = sha256:e5936bba25b0aa55d81ec79c09710206d22f27b4a2f75903a6153694126ce693
verifiedArtifactId = 9558356215
verifiedArtifactDigest = sha256:bd92dc89283835c862e1fe6a86b4bbd7c43de696211d2761576b67055d202067
stage1ResultHash = 4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08
```

`stage1ResultHash` is the canonical-content hash emitted by the scientific runner for the canonical artifact object; it is **not** a byte SHA-256 of the later repository-facing JSON after provenance fields were added. Exact artifact-file SHA-256 values and the hash scope are frozen in `STAGE_1_ARTIFACT_PROVENANCE.json`.

The large source/selection/measurement/discovery artifacts are retained as GitHub Actions artifacts rather than committed wholesale. The compact repository records preserve the canonical decision, counts, hashes, artifact IDs and interpretation boundary.

The current `.github/workflows/pcem-stage1-parallel.yml` is a post-closure guard and is intentionally not the scientific workflow blob bound by the execution amendment. Reproduction of the completed scientific run uses source commit `f4b336ee...` and the exact binding recorded in `STAGE_1_ARTIFACT_PROVENANCE.json` / `REPRODUCIBILITY_INDEX.md`.

Stage 1 remains exploratory-only and may not be reused as Stage 2 formal evidence. Zero promotion is the frozen terminal outcome; no threshold relaxation, favorable subgroup rescue or post-outcome candidate expansion is authorized.
