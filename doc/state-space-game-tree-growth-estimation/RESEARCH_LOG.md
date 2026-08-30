# SSGTGE-STUDY1 — Research Log

## 2026-08-30 — Study startup audit

- Remote `main` was re-read directly from GitHub.
- Observed remote `main` HEAD: `c5efcdb7972d1bc775a2857c1b0641c35c9df622`.
- This exactly matched the SHA recorded after PSRRE-STUDY1 integration.
- Reviewed the root `README.md`, `doc/FUTURE_RESEARCH_AGENDA.md`, `doc/RESEARCH_INDEX.md`, and `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`.
- Audited G2-05 `DRSSE-STUDY1` overview, protocol, preregistration structure, and Stage 2 formal result.

Confirmed immutable G2-05 boundary:

```text
formal decision = EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
complete exact layers = 0..9
cumulative RAW states = 102857
depth 9 new RAW states = 78009
depth 9 tree node occurrences = 105704
validated transform set = []
```

## 2026-08-30 — G2-12 prospective identity freeze

Frozen:

```text
Study ID = SSGTGE-STUDY1
Formal title = State-Space / Game-Tree Growth Estimation Study 1
Stage 0 = SSGTGE-S0-TECHNICAL-2026-08-30-v1
Stage 1 = SSGTGE-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = SSGTGE-S2-FORMAL-2026-08-30-v1
Branch = research/g2-12-state-space-game-tree-growth-estimation
```

The authoritative RAW identity remains unchanged from G2-05.

## 2026-08-30 — Estimator/holdout freeze

Before generating any fresh depth 10/11 outcome, fixed a finite 3-family estimator candidate set, rolling-origin selection rule, uncertainty-envelope rule, depth 10 primary formal endpoint, depth 11 secondary stress-test, resource ceilings, decision taxonomy, and no-rescue rule.

Fresh depth 10/11 counts have not been generated or inspected during this startup step.

## 2026-08-30 — Stage 0 v1 implementation freeze and authorization

Created a technical-only Stage 0 implementation that limited real enumeration to depth 2, permitted G2-05 depth 0..9 only as read-only plumbing input, and restricted estimator numerical checks to synthetic series.

Implementation/source freeze commit:

```text
00b89802c9d40313cc0309bc36f59eecc53899b2
```

Separate v1 execution authorization commit:

```text
76afec9b0ba3d1c5ef84cb42bc3d205360da9b97
```

The v1 authorization retained:

```text
scientificInferenceAuthorized = false
realDevelopmentCandidateEvaluationAuthorized = false
freshDepth10Or11GenerationAuthorized = false
Stage 1 = unauthorized
Stage 2 = unauthorized
sameStage0EvidenceRerunAuthorized = false
```

## 2026-08-30 — Stage 0 v1 technical-invalid discovery

Triggered GitHub Actions run `33315971968` / job `99269373670`.

The Actions metadata ultimately reported `conclusion=success`, but direct job-log inspection showed the production Node process exited 1 at the first source-binding gate:

```text
Error: source SHA256 mismatch: tools/experiments/verify-ssgtge-stage0-independent.js
```

Because no production result was generated, the independent verifier also exited 1 with `ENOENT` for `stage0-production-result.json`.

The workflow had used `/usr/bin/time ... | tee ...` without `set -o pipefail`; therefore Bash propagated `tee`'s zero status rather than the failing Node status. Artifact upload succeeded and masked the calculation failure at the workflow-conclusion layer.

Accepted disposition:

```text
Stage 0 v1 = STAGE0-TECHNICAL-INVALID
primary failure = SOURCE-HASH-BINDING-MISMATCH
secondary workflow defect = PIPELINE-EXIT-CODE-MASKED-BY-TEE-WITHOUT-PIPEFAIL
```

No depth-2 technical enumeration output, real G2-05 candidate ranking, Stage 1 scientific evidence, or fresh depth 10/11 outcome was generated.

Failure provenance:

```text
run = 33315971968
job = 99269373670
artifact = 9733443553
artifact ZIP SHA256 = df9bb95a22bec49141bd45ac7baf0c6829f668e2c764b3b4668103ada208d7ac
```

The v1 run will not be rerun.

## 2026-08-30 — Prospective Stage 0 v2 corrective design

Reviewed Research Generation 2 precedent from `REEOE-STUDY1`: a genuine technical defect discovered before scientific outcome may be corrected through explicit revoke/refreeze/reauthorize provenance, while the invalid version remains preserved.

A new technical-entry version was therefore prepared prospectively:

```text
SSGTGE-S0-TECHNICAL-2026-08-30-v2
```

Only source-binding/orchestration mechanics change:

- source gate uses repository Git blob identity;
- workflow uses `set -euo pipefail` so a failing Node process cannot be hidden by `tee`;
- v2 has separate runner/verifier/workflow/spec/result/authorization paths.

No scientific contract element changes. v2 remains depth-2 technical-only, synthetic-estimator-fixture-only, and prohibited from depth-10/depth-11 generation or real G2-05 candidate selection.
