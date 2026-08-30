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
