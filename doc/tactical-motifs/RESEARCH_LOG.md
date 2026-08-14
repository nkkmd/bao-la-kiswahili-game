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
- Froze detailed-candidate, transferability, opening-family, generation-stratum, D3 value, ranking, and candidate-cap rules before corpus generation.
- Froze readiness gates before measurement/discovery.
- Implemented response-envelope representation, deterministic candidate-mining grammar, machine-readable spec validator, technical tests, and a dedicated pre-generation GitHub Actions workflow.
- Deliberately left the scientific corpus runner and independent replay verifier for the next gate so the frozen scientific contract is validated before execution code can authorize data creation.
- Preserved the two-step authorization firewall: the spec alone cannot authorize generation; authorization remains forbidden until runner/verifier implementation is separately validated and hash-bound.
- Scientific corpus remains **not generated** and **not authorized**.
