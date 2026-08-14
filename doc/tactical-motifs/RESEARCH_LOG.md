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
- Stage 1 generation remains blocked pending a committed machine-readable exploratory spec and technical validation.
