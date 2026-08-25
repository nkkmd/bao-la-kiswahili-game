# PCEM-STUDY1 — Final Consistency Audit

Date: 2026-08-25  
Role: post-closure documentation / provenance audit  
Scientific result mutation authorized: **NO**

## Audit scope

The final audit cross-checked:

- canonical Stage 0 compact result;
- canonical Stage 1 GitHub Actions verified artifact;
- Stage 1 repository-facing compact result and independent verification;
- Stage 2 non-authorization record;
- `CURRENT_STATUS.md`, overview, final report, study/results README, decision register, research log, reproducibility index;
- root `README.md`, `doc/RESEARCH_INDEX.md`, `doc/FUTURE_RESEARCH_AGENDA.md`;
- program-level closure decision;
- historical preregistration / authorization / execution-amendment boundaries;
- current post-closure GitHub Actions workflow behavior.

## Canonical scientific state re-confirmed

```text
PCEM-STUDY1 = COMPLETE
Stage 0 = TECHNICAL-PASS
Stage 1 = EXPLORATORY-ONLY / COMPLETE
generated games = 3072
unique historical trajectories = 2764
selected roots = 300 = 150 Namua + 150 Mtaji
exact root-move interventions = 1065
continuation rows = 18105
candidate audits = 55
candidates passing promotion gates = 0
promoted candidates = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
reserved Stage 2 seeds consumed = false
```

No discrepancy was found in these scientific counts, labels, or terminal decisions.

## Canonical artifact / hash re-verification

Canonical workflow:

```text
run = 32820391017
source commit = f4b336ee6655c37f6c456ef1ba6175dc0816a93c
production artifact = 9557783361
production artifact digest = sha256:e5936bba25b0aa55d81ec79c09710206d22f27b4a2f75903a6153694126ce693
verified artifact = 9558356215
verified artifact digest = sha256:bd92dc89283835c862e1fe6a86b4bbd7c43de696211d2761576b67055d202067
```

The verified artifact was re-opened and all embedded files were byte-hashed. The canonical `stage1ResultHash` was independently recomputed using the study's sorted-key stable serialization after removing the `resultHash` field and matched exactly:

```text
stage1ResultHash = 4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08
recomputed = MATCH
```

Exact embedded-file SHA-256 values are frozen in `results/STAGE_1_ARTIFACT_PROVENANCE.json`.

## Consistency corrections made

Two post-closure provenance/operations ambiguities were found and corrected. Neither changed scientific evidence or interpretation.

### 1. Result-hash scope

The repository compact Stage 1 JSON includes post-run workflow/artifact provenance not present when the canonical runner computed `resultHash`. The compact record now explicitly states that `resultHash` identifies the canonical artifact object, not the augmented repository file bytes. A separate machine-readable artifact-provenance record binds both identities.

### 2. Workflow path after closure

The execution amendment correctly binds the scientific `.github/workflows/pcem-stage1-parallel.yml` Git blob `3320575988f9f0ec315a8d7474840745a99ae325`. After scientific closure, the same path was intentionally replaced by a non-generative closure guard. `REPRODUCIBILITY_INDEX.md` now explicitly requires the canonical source commit / frozen blob for scientific reproduction and distinguishes it from the current guard.

The remaining PCEM Stage 0 / pre-authorization / authorization-material workflows were also converted to non-generative closure guards so PR synchronization cannot create new noncanonical technical or authorization artifacts after Study 1 completion.

## Historical records intentionally not rewritten

Prospective records retain their original freeze-state semantics. In particular, `STAGE_1_EXPLORATORY_SPEC.json` keeps its historical `prospective-frozen-not-authorized` status while the later separate authorization record documents authorization. This is intentional provenance, not a stale current-status error.

## Permanent regression protection

Added:

```text
test/practical-comeback-closure-consistency.test.js
.github/workflows/pcem-closure-audit.yml
```

The audit checks terminal result values, independent verification, Stage 2 non-authorization, no-rescue flags, canonical artifact provenance, current-facing documentation, frozen-preregistration preservation, and post-closure workflow guards.

## Final interpretation

No scientific inconsistency, missing Stage 2 disposition, stale current-facing study status, or central-document omission remains known after these corrections.

The corrections are post-closure reproducibility/operations hardening only:

```text
scientificResultChanged = false
thresholdChanged = false
candidateGrammarChanged = false
populationChanged = false
endpointChanged = false
opponentPolicyChanged = false
promotionChanged = false
Stage2AuthorizationChanged = false
```

PR #50 remains draft and unmerged. No main merge, auto-merge, or branch deletion is authorized by this checkpoint.
