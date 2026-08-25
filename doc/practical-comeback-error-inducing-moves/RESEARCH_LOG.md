# PCEM-STUDY1 — Research Log

## 2026-08-25 — Research start

- Re-fetched remote `main`; HEAD confirmed as `587472b7e1a3f6e390cdfea6ed0d8e0971d5711d`.
- Restored program-level and directly relevant completed-study boundaries.
- Confirmed this study is a new prospective independent study, not a rescue of any completed study.
- Fixed Study ID `PCEM-STUDY1` and slug `practical-comeback-error-inducing-moves`.
- Created branch `research/practical-comeback-error-inducing-moves` from the verified baseline SHA.
- Reaffirmed RAW-ONLY downstream identity and prohibition on symmetry/canonicalization.
- Separated strongest-policy quality, empirical comeback, reply narrowness, opponent-error dependence, machine reply difficulty, and move optimality gap.
- Established Stage 0 technical-only / Stage 1 exploratory / Stage 2 fresh formal architecture.
- No Stage 0 scientific outcome, Stage 1 outcome, candidate, or formal result was generated at research start.

## 2026-08-25 — Stage 0 technical implementation

- Added study-owned exact-root reference-search semantics `pcem-exact-full-window-root-candidates/bao/q0/v1`.
- Added exact legal root-move intervention and first-reply enumeration under the RAW-ONLY representation firewall.
- Added seeded asymmetric continuation architecture: root actor may use `P_REFERENCE_D2_BEST`; opponent may use separately frozen imperfect policies.
- Added `P_MEDIUM_D1_TOP3` and `P_SHALLOW_UNIFORM` technical policy implementations.
- Bound replicate RNG to stage salt + raw root identity + root actor + replicate index, independent of root move, enabling common-random-number pairing without treating replicates as roots.
- Added bounded outcome accounting that separates terminal win/loss from administrative horizon exhaustion.
- Added an independent verifier that reimplements search, RNG, policy selection, move/reply binding and continuation replay rather than importing the production PCEM measurement core.
- Added a read-only GitHub Actions Stage 0 workflow.

## 2026-08-25 — Invalidated Stage 0 technical attempt

Workflow run `32813015855` executed the primitive tests and production technical pilot successfully. Production passed all technical gates. Independent raw-state, legal-move, move-application, reply-set, reference-search, continuation and hash checks also matched.

The verifier nevertheless returned `TECHNICALLY-INVALID` because its independence audit searched its full source text for forbidden module-name regex literals; those literals appeared in the audit code itself and self-matched. The only failed verifier gate was `independence`.

This was classified as an implementation defect in the verifier audit, not scientific evidence and not a negative scientific result. The run and artifact `9550453776` remain retained for provenance.

## 2026-08-25 — Canonical Stage 0 technical PASS

The independence audit was corrected without changing the scientific population, endpoint, threshold, candidate grammar or any scientific outcome. The full workflow was rerun from commit `29976182dcdcabf206a1d0bf59252fe8bb2288df`.

Canonical workflow:

```text
run = 32813154014
job = 97696278964
artifact = 9550497573
artifact digest = sha256:0021c59fea047c0a192b0e9394513d63aba6347a02d79b1ce41b1bf6e61e2d32
conclusion = success
```

Canonical technical result:

```text
Stage 0 = TECHNICAL-PASS
production gates = 12 / 12 PASS
independent verifier gates = 8 / 8 PASS
technical fixtures = 3
phases = Namua + Mtaji
exact root moves = 15
exact first replies = 38
continuation rows = 60
production elapsed = 4857.528147 ms
max RSS = 94.82421875 MiB
```

Stage 0 remains `scientificInferenceAuthorized = false`. No scientific prevalence/effect/candidate result was generated.

## 2026-08-25 — Stage 1 prospective design freeze

Before any Stage 1 scientific generation or outcome inspection, the exploratory design was frozen as `PCEM-S1-EXPLORATORY-2026-08-25-v1`.

Key frozen decisions:

```text
source games = 3072
Stage 1 seeds = 23200001..23203072
Stage 2 reserved seeds = 23300001..23306144
root target = 300 (Namua 150 / Mtaji 150)
reference disadvantage = D3 bestScore < 0
root actor continuation = P_REFERENCE_D2_BEST
primary imperfect opponent = P_MEDIUM_D1_TOP3
primary replicates = 12 per exact root move
bounded endpoint horizon = 96 post-root plies
zeroPromotedCandidatesAllowed = true
```

Within each historical trajectory, the assigned-phase root candidate is selected by frozen hash rank before D3 reference disadvantage is inspected. If the selected state fails the D3 disadvantage criterion, no replacement state from that trajectory is allowed. This prevents retrospective selection of a more favorable disadvantaged state.

Candidate matching was bounded prospectively to templates `PCEM-T1..T8`; outcome fields and reference-score magnitude are forbidden in the matcher. Promotion requires the frozen support, diversity, comeback-difference, first-reply reference-error, defense-concentration, and conditional error-dependence gates. Human difficulty/error claims remain unauthorized.

The frozen byte hashes are:

```text
STAGE_1_EXPLORATORY_SPEC.json
26a7daea8588a460e19ae8e77485c50a092d714bfb3243608b5b64a95fa3fe22

STAGE_1_FEATURE_DEFINITIONS.json
3f1e622c86fca8d4153baca815000234cd1672ad5a6a259aaae4ffea4a6e84d6
```

## 2026-08-25 — Stage 1 pre-authorization contract PASS

Workflow `32814139745` completed successfully at head `c40679a93ab0e01899496e889f42476a3ac10339` before authorization existed.

The workflow checked only pre-outcome contract properties:

- frozen spec validation;
- production/independent primitive agreement;
- scientific runner hard-block when authorization is absent.

No Stage 1 scientific seed block was generated by this workflow.

## 2026-08-25 — Stage 1 hash materialization and authorization

Hash materialization workflow `32814274403` produced artifact `9550850177` and digest `sha256:86d78ce3a88e65361aeae17bc0bae7d8d2f9b8c887a0e54b184f571f8d5ff270`.

A separate `STAGE_1_EXPLORATORY_AUTHORIZATION.json` was then created at commit `6c7b8c53127f6b47f802d2d0af1ac14bba24d180`. It binds:

- the exact Stage 1 spec SHA-256;
- the exact feature-definition SHA-256;
- 12 scientific source-file SHA-256 values;
- the 3072-game Stage 1 seed block;
- the reserved, non-consumable Stage 2 seed block.

Authorization semantics are:

```text
stage1GenerationAuthorized = true
scientificInferenceAuthorized = false
exploratoryAnalysisAuthorized = true
confirmatoryReuseAllowed = false
stage2GenerationAuthorized = false
```

Any source/spec/feature hash mismatch or dirty scientific source tree blocks generation. Stage 2 remains unauthorized. No Stage 1 scientific outcome had been generated at the moment of authorization.

## 2026-08-25 — Authorized serial execution and orchestration correction

The first authorized scientific workflow architecture was serial. A hash-gate implementation defect initially caused a module `require()` to begin generation during the gate. That run was superseded before `stage1-result.json` was produced; no candidate/effect/promotion outcome was inspected.

The corrected serial run then proceeded under the frozen contract but showed unexpectedly long orchestration runtime. Before any completed Stage 1 result artifact existed, the latest pre-amendment serial run was confirmed to have zero workflow result artifacts and was superseded.

No serial partial row is authorized for combination with the final parallel run.

## 2026-08-25 — Execution-only parallel amendment

`STAGE_1_EXECUTION_AMENDMENT_1.json` prospectively froze deterministic execution-only chunking without changing any scientific input or decision rule:

```text
source chunks = 12 x 256 games
measurement chunks = 12 x <=25 roots
scientific logic changed = false
seed block changed = false
population changed = false
root selection changed = false
opponent policy changed = false
endpoint changed = false
promotion rule changed = false
additional scientific seeds allowed = false
```

Three implementation defects were caught at the parallel gate before scientific seed generation:

1. a missing parenthesis in an execution helper;
2. wrong JSON hierarchy paths for execution-amendment fields;
3. an independent-verifier self-audit that matched its own audit literal.

Each was recorded as `TECHNICALLY-INVALID-NO-SCIENTIFIC-GENERATION` with `scientificSeedsGenerated = 0`. Only execution/helper code and binding hashes were corrected; the frozen scientific contract was unchanged.

## 2026-08-25 — Canonical Stage 1 parallel execution

At head `f4b336ee6655c37f6c456ef1ba6175dc0816a93c`, workflow `32820391017` passed the complete frozen contract gate and generated all 12 source chunks.

Production source generation completed 3072 games successfully. Root selection then completed with all readiness gates passing.

Selection summary:

```text
generatedGames = 3072
uniqueHistoricalTrajectories = 2764
duplicateHistoricalTrajectoriesCollapsed = 308
unavailableAssignedPhase = 93
failedReferenceDisadvantage = 2004
disadvantagedBeforeRawStateCollapse = 667
duplicateDisadvantagedRawStatesCollapsed = 0
disadvantagedPoolNamua = 225
disadvantagedPoolMtaji = 442
selectedRoots = 300
namuaRoots = 150
mtajiRoots = 150
generatedDistinctOpeningPrefixes = 2262
selectedDistinctOpeningPrefixes = 287
```

Production measurement completed all 12 chunks:

```text
exactRootMoveInterventions = 1065
primaryContinuationRows = 12780
secondaryContinuationRows = 4260
referenceContinuationRows = 1065
totalContinuationRows = 18105
primaryAdministrativeHorizonExhaustions = 2
```

## 2026-08-25 — Independent Stage 1 reconstruction PASS

The independent implementation regenerated all 12 source chunks, reconstructed the selected roots, independently remeasured root chunks, and reproduced discovery.

Canonical independent result:

```text
decision = TECHNICAL-PASS
passed = true
independence = true
sourceReplay = true
selection = true
rawIdentity = true
measurement = true
discovery = true
```

Canonical workflow/artifacts:

```text
workflowRunId = 32820391017
workflowConclusion = success
productionArtifactId = 9557783361
productionArtifactDigest = sha256:e5936bba25b0aa55d81ec79c09710206d22f27b4a2f75903a6153694126ce693
verifiedArtifactId = 9558356215
verifiedArtifactDigest = sha256:bd92dc89283835c862e1fe6a86b4bbd7c43de696211d2761576b67055d202067
stage1ResultHash = 4c9f7d9c88e6430bd9ec248b7360ba2894c6bfddc57516e7946a0d2d3192da08
```

## 2026-08-25 — Stage 1 exploratory result and zero promotion

The frozen candidate grammar generated 55 candidate definitions for audit.

```text
scientificLabel = EXPLORATORY-ONLY
candidateAuditCount = 55
candidatesPassingPromotionGates = 0
promotedCandidateCount = 0
manualPromotionPerformed = false
```

Every candidate failed at least one preregistered promotion gate. All 55 failed each of the minimum unique-root, unique-historical-trajectory, distinct-opening-prefix, unique error-condition root, and unique defense-condition root support gates.

Some individual candidates passed machine error-dependence or reply-concentration metrics, but none satisfied the complete support/diversity/effect/error-dependence conjunction. No near-miss promotion or favorable subgroup rescue was performed.

## 2026-08-25 — Stage 2 not authorized / Study 1 closure

Frozen zero-promotion logic was applied without modification:

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
stage2GenerationAuthorized = false
reserved Stage 2 seeds = 23300001..23306144
reserved Stage 2 seeds consumed = false
```

Repository-owned compact records and the final report were added. The terminal Study 1 state is:

```text
PCEM-STUDY1 = COMPLETE
Stage 0 = TECHNICAL-PASS
Stage 1 = EXPLORATORY-ONLY / COMPLETE
Stage 1 promoted candidates = 0
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

No upstream completed-study decision, human claim, game-theoretic claim, true-win-probability claim, or all-opponent-strength claim is altered or authorized.
