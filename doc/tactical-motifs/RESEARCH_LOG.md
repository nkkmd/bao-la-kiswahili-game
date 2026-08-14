# RESEARCH_LOG — Tactical Motifs / Tesuji Study 1

## 2026-08-14 — Study initialization

- Verified GitHub `main` HEAD as `08c70ba6ac980884d51562c207410db3521b8ae4`.
- Confirmed it exactly matched the recorded pre-study HEAD; no intervening-main diff existed to audit.
- Restored central research state from `doc/FUTURE_RESEARCH_AGENDA.md`, `doc/RESEARCH_INDEX.md`, and root `README.md`.
- Restored immutable boundaries from Phase Transition Study 1, Position Typology / Playing Style Study 1, Namua→Mtaji Strategic Temporal Transition Study 1, Position Complexity / Difficulty Study 1, and the first Joseki study.
- Confirmed that `capture-branch-expansion` cannot be imported as a confirmed tesuji and that prior morphology/style/search constructs cannot be automatically relabeled as motif classes.
- Fixed joseki/tesuji distinction: opening-sequence knowledge versus position-transferrable structural move principle.
- Audited engine move/event representation, moveVariant handling, state identities, seat symmetry, position features, and exact search diagnostic tooling.
- Identified existing support for actor/opponent structural features, exact root candidate values, immediate engine event sequences, and forced/free reply-set measurement.
- Identified two important limits: only seat-swap symmetry is validated; current exact-root diagnostic does not expose a search-consistent principal variation.
- Chose response-set / response-envelope analysis as the safer default for Stage 1 rather than fabricating a PV from repeated independent searches.
- Created branch `research/tactical-motif-discovery` from the verified baseline.
- Added Stage 0 technical instrumentation `tools/experiments/lib/tactical-motif-features.js` and deterministic test `test/tactical-motif-stage0.test.js` in initialization commit `de4931fb20c218c0d4b3d13689cf79af400e89bd`.
- Added technical-only GitHub Actions workflow `.github/workflows/tactical-motif-stage0.yml`; it does not generate scientific data.
- GitHub Actions run `31768708597` completed with conclusion `success`. It validated symmetry transforms, position-typology features/identities, exact root search diagnostics, and the new tactical-motif Stage 0 instrumentation.
- No scientific corpus generated.
- Stage 1 generation remained blocked pending a committed machine-readable exploratory spec and technical validation.

## 2026-08-14 — Stage 1 v1 prospective design freeze

- Rechecked `main`; it remained at baseline `08c70ba6ac980884d51562c207410db3521b8ae4`.
- Rechecked `research/tactical-motif-discovery`; no external branch change had occurred.
- Froze Stage 1 ID `TM-S1-EXPLORATORY-2026-08-14-v1`.
- Froze scientific population at 768 games, fresh seeds `21900001–21900768`, max ply 100, no early stop, no outcome-dependent extension, and no replacement sampling.
- Froze six trajectory-generation strata, 128 games each: `B-D1`, `B-D2`, `B-D3`, `LS-D2`, `V2-D2`, `LE-D2`.
- Explicitly restricted reuse of those condition names to trajectory diversification; prior formal comparisons remain immutable.
- Froze the first 8 plies of every game as seeded uniform selection over exact `E.moveVariants`.
- Froze opening-family identity as the SHA-256 hash of the ordered exact opening move-key prefix with prefix length included.
- Froze recurrence/support at unique historical trajectory level.
- Froze one outcome-independently selected root per representative trajectory using hash phase assignment and within-phase SHA-256 rank.
- Froze no-replacement handling for unavailable assigned phases and exact selected rule-state duplicates.
- Froze measurement over all legal moveVariants rather than only generated/AI-best moves.
- Extended technical instrumentation to include all-immediate-reply structural response envelopes relative to the original root actor.
- Froze exact D1/D2/D3 root value measurement and D1 reply diagnostics; search-consistent PV remains unnecessary/unavailable.
- Froze candidate grammar as phase + 1–2 structural precondition tokens + one move-abstraction token + one consequence token.
- Froze both coarse-no-index and indexed move abstractions.
- Froze within-trajectory candidate support representative as lexicographically smallest exact moveKey, not highest D3 value.
- Froze detailed-candidate, transferability, opening-family, generation-stratum, D3 value, ranking, and candidate-cap rules before generation.
- Froze readiness gates before measurement/discovery.
- Implemented response-envelope representation, deterministic candidate-mining grammar, machine-readable spec validator, technical tests, and a dedicated pre-generation GitHub Actions workflow.
- Deliberately left the scientific corpus runner and independent replay verifier for the next gate so the frozen scientific contract is validated before execution code can authorize data creation.
- Preserved the two-step authorization firewall: the spec alone cannot authorize generation; authorization remains forbidden until runner/verifier implementation is separately validated and hash-bound.
- Scientific corpus remains **not generated** and **not authorized**.

## 2026-08-14 — Stage 1 scientific-contract validation

- Committed the frozen Stage 1 scientific contract at `62fbf68cf12a3539b46dcdcd4487a0a9ea7debba` without any scientific corpus generation.
- Dedicated GitHub Actions run `31770343371` completed with conclusion `success`.
- The validation confirmed the fixed 768-game population, seed interval, six generation strata, sampling/dedup rules, response-envelope representation, candidate grammar, readiness gates, promotion gates, and Stage 2 boundary.
- The spec alone continued to forbid Stage 1 scientific generation.

## 2026-08-14 — Stage 1 execution tooling implementation and validation

- Implemented `tools/experiments/lib/tactical-motif-stage1-corpus.js` for fixed seed/condition assignment, deterministic generation, provenance, source hashes, and authorization binding.
- Implemented `tools/experiments/run-tactical-motif-stage1-exploratory.js` with separate `status`, `generate`, `select`, `measure`, and `discover` phases.
- Implemented `tools/experiments/verify-tactical-motif-stage1-exploratory.js` for independent seed replay, opening move recomputation, AI search recomputation, observation/move/state identity checks, and trajectory/opening hash verification.
- Enforced that scientific phases require a valid source-hash-bound authorization and that `select` additionally requires `verification.json` with `passed=true` and `fullSearchRecomputation=true`.
- Updated technical tests to exercise deterministic short smoke trajectories across all six generation strata and full-search replay verification.
- Execution-tooling commit: `1f97881338b14b9a885bd124a1a68d436c1e0a43`.
- Dedicated Actions run `31770629848`, job `94675639391`, completed with conclusion `success`.
- The successful CI `status` output confirmed authorization absent, generated games 0, no manifest, no verification, no selection audit, measurement files 0, and no discovery result.
- The same CI emitted the exact SHA-256 mapping of all 15 frozen scientific source files.

## 2026-08-14 — Stage 1 exploratory generation authorization

- Rechecked `main`; it still remained at baseline `08c70ba6ac980884d51562c207410db3521b8ae4`.
- Created `doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json` only after both Stage 1 technical validation gates succeeded.
- Authorization binds the frozen spec SHA-256 `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`, implementation commit `1f97881338b14b9a885bd124a1a68d436c1e0a43`, validation run `31770629848` / job `94675639391`, and the exact frozen scientific source-file SHA-256 mapping.
- Authorization commit: `1079e2e02d4031f980f0ddc2213c50f6c8a6e678`.
- Stage 1 scientific generation is now **AUTHORIZED / NOT GENERATED**.
- Stage 1 remains exploratory; confirmatory inference is not authorized.
- Stage 2 generation and any `confirmed tesuji` claim remain not authorized.
- No scientific corpus was generated as part of authorization.

## 2026-08-14 — Stage 1 execution-environment recovery boundary

- The first in-chat container attempt was not retained as scientific data because the ephemeral runtime was recreated before the fixed 768-game corpus completed.
- No threshold, seed, phase assignment, candidate rule, or population was changed.
- No partial corpus was promoted, no replacement sampling was introduced, and no motif outcome was inspected.
- Added `STAGE_1_EXECUTION_RUNBOOK.md` and a recovery checkpoint at commit `6694714194eee2f536e90b4411566d9126e162ae` so the exact authorized corpus could be generated in a stable local/Colab runtime.

## 2026-08-14 — Stage 1 corpus generation and full replay/search verification

- Generated the exact fixed Stage 1 exploratory population of 768 games using seeds `21900001–21900768` from clean source commit `6694714194eee2f536e90b4411566d9126e162ae`.
- Generation produced exactly 128 games in each frozen stratum: `B-D1`, `B-D2`, `B-D3`, `LS-D2`, `V2-D2`, and `LE-D2`.
- Manifest summary: 741 unique historical trajectories, 27 duplicate historical-trajectory groups, largest duplicate group 2, and 681 distinct opening-prefix identities.
- Manifest summary hash: `7d11bae51a21b77ed91eb7ffe4098d6be3e7035a0480689616a72bd76b3eb96c`.
- Authorization SHA-256 recorded by the manifest: `9df06af5c330a529c7d4b33fbd3fa885a084fd1797d425a20d4ce620b6328f9a`.
- Independent verifier then replayed and recomputed the full search trajectory for all 768 games.
- Verification returned `passed=true`, `fullSearchRecomputation=true`, and `gamesVerified=768`.
- Verification reproduced 741 unique historical trajectories and 681 opening prefixes exactly.
- Verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`.
- Both artifacts report `sourceTreeDirty=false`; their scientific source SHA-256 mappings match exactly and remain equal to the authorization-bound mapping.
- No state selection, motif measurement, candidate discovery, threshold adjustment, or scientific interpretation was performed before this integrity gate was accepted.
- The preregistered firewall therefore permits the deterministic `select` phase next. Selection readiness must be inspected before measurement.
