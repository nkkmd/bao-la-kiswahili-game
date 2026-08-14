# RESEARCH_LOG — Tactical Motifs / Tesuji Study 1

## 2026-08-14 — Study initialization and Stage 0

- Verified GitHub `main` HEAD as `08c70ba6ac980884d51562c207410db3521b8ae4` and fixed it as study baseline.
- Restored immutable boundaries from Phase Transition, Position Typology / Playing Style, Namua→Mtaji Transition, Position Complexity / Difficulty, and first Joseki studies.
- Created branch `research/tactical-motif-discovery`.
- Completed Stage 0 representation/search audit and added tactical-motif feature instrumentation.
- Stage 0 initialization commit: `de4931fb20c218c0d4b3d13689cf79af400e89bd`.
- Stage 0 validation-record commit: `c3e14ea9bdf7c6a92ec57b0413af925e9c8e70d1`.
- Actions run `31768708597` = `success`.
- No scientific corpus generated.

## 2026-08-14 — Stage 1 v1 scientific contract freeze

- Rechecked `main`; it remained at baseline `08c70ba6ac980884d51562c207410db3521b8ae4`.
- Froze Stage ID `TM-S1-EXPLORATORY-2026-08-14-v1`.
- Froze 768 games, fresh seeds `21900001–21900768`, max ply 100, no early stop, no extension, and no replacement sampling.
- Froze six trajectory-generation strata × 128 games: `B-D1`, `B-D2`, `B-D3`, `LS-D2`, `V2-D2`, `LE-D2`.
- Froze first 8 plies as seeded uniform selection over exact `E.moveVariants` and hashed the exact opening prefix for joseki/opening-family concentration audit.
- Froze unique historical trajectory as recurrence/support unit and one outcome-independent root per representative trajectory.
- Froze all-legal-moveVariant measurement, all-immediate-reply response envelopes, exact D1/D2/D3 root values, and D1 reply diagnostics.
- Froze candidate grammar, transferability/value promotion gates, deterministic ranking/caps, readiness gates, and no-rescue rules.
- Froze spec SHA-256 `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`.
- Scientific-contract freeze commit: `62fbf68cf12a3539b46dcdcd4487a0a9ea7debba`.
- Dedicated Actions run `31770343371` completed with `success`.
- At this checkpoint the spec alone still did not authorize scientific generation.

## 2026-08-14 — Stage 1 execution tooling validation

- Implemented `tools/experiments/lib/tactical-motif-stage1-corpus.js`.
- Implemented phase-separated runner `tools/experiments/run-tactical-motif-stage1-exploratory.js` with `status`, `generate`, `select`, `measure`, and `discover`.
- Implemented independent verifier `tools/experiments/verify-tactical-motif-stage1-exploratory.js`.
- The verifier replays from the frozen seed, recomputes randomized opening moves, recomputes AI search decisions/stats, reconstructs observations, and checks state/trajectory/opening identities.
- Enforced that every scientific phase requires a hash-bound authorization; `select` additionally requires full replay/search verification.
- Updated Stage 1 technical test to exercise deterministic short smoke trajectories across all six generation strata and full-search replay verification.
- Execution-tooling commit: `1f97881338b14b9a885bd124a1a68d436c1e0a43`.
- Actions run `31770629848` / job `94675639391` completed with `success`.
- The successful CI `status` output confirmed: authorization absent, generated games 0, no manifest, no verification, no selection audit, measurement files 0, no discovery result.
- CI also emitted the exact SHA-256 mapping of the 15 frozen scientific source files.

## 2026-08-14 — Stage 1 exploratory generation authorization

- Rechecked `main`; it still remained at baseline `08c70ba6ac980884d51562c207410db3521b8ae4`.
- Created `doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_AUTHORIZATION.json` only after both Stage 1 technical validation gates succeeded.
- Authorization binds:
  - spec SHA-256 `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`;
  - validated implementation commit `1f97881338b14b9a885bd124a1a68d436c1e0a43`;
  - validation run `31770629848` and job `94675639391`;
  - exact SHA-256 map of all frozen scientific source files.
- Authorization commit: `1079e2e02d4031f980f0ddc2213c50f6c8a6e678`.
- Stage 1 scientific generation is now **AUTHORIZED / NOT GENERATED**.
- Stage 1 remains exploratory; confirmatory inference is not authorized.
- Stage 2 generation and any `confirmed tesuji` claim remain not authorized.
- No scientific corpus was generated as part of authorization.
