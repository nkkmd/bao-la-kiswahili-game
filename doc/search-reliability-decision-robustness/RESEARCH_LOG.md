# SRDR-STUDY1 — Research Log

## 2026-08-27 — Study-start audit

- Re-fetched remote `main` and confirmed `db6980bffb7e6853751914da628db8936c76d81e` exactly matches the post-G2-01 provenance anchor supplied at handoff.
- Confirmed zero open pull requests.
- Audited Research Generation 2 residual branches. `research/g2-01-position-evaluation-empirical-outcome-calibration-replication` and `research/g2-01-stage1-implementation-backup` are both behind `main` and `ahead_by = 0`; no unintegrated competing G2 work exists.
- Reconstructed Research Generation 2 common contract and G2-02 agenda position from `FUTURE_RESEARCH_AGENDA.md`, `RESEARCH_INDEX.md`, and the second-generation program decision.
- Reconstructed `PEOCR-STUDY1 = INCONCLUSIVE` and its strict no-rescue boundary.
- Reconstructed Position Complexity / Difficulty Study 1 as `INCONCLUSIVE`, with PCX-H1 `INCONCLUSIVE` and PCX-H2 `NOT-CONFIRMATORILY-EVALUATED`.

## 2026-08-27 — Search implementation audit

Current `public/ai.js::analyzeMove()` supports:

```text
maxDepth
timeLimitMs
quiescenceDepth
orderQuiescenceCaptures
ttMoveFirst
historyHeuristic
aspirationWindow
stableBestDepths / stableBestMinDepth
adaptive metadata / allocation input
```

Existing `tools/experiments/lib/position-complexity-search-diagnostic.js` supports exhaustive exact legal-root candidate scores, exact ties, TopSet, canonical best, full ranking and depth-transition diagnostics under fixed full-window semantics.

Dedicated node-budget enforcement and first-class PV-sequence output are not exposed by the current public API. They are therefore Stage 0 technical feasibility items rather than assumed scientific endpoints.

## 2026-08-27 — Prospective study freeze

Frozen:

```text
Program label = G2-02
Study ID = SRDR-STUDY1
Formal title = Search Reliability / Decision Robustness Study 1
Branch = research/g2-02-search-reliability-decision-robustness
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1
```

Stage 0 machine spec SHA-256:

```text
12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26
```

No scientific G2-02 seed or outcome has been generated. Stage 1 and Stage 2 remain not authorized.
