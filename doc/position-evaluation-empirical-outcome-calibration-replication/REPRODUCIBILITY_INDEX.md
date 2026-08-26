# PEOCR-STUDY1 — Reproducibility Index

更新日: 2026-08-26

## Study anchor

```text
Study ID = PEOCR-STUDY1
Program label = G2-01
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Branch = research/g2-01-position-evaluation-empirical-outcome-calibration-replication
```

## Frozen protocol documents

- `README.md`
- `STUDY_1_PROTOCOL.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `RESEARCH_LOG.md`

## Preregistration

- `preregistration/STAGE_0_TECHNICAL_SPEC.json`
  - file SHA-256 at initial freeze: `39f886334a4b7515053f35bc606928c2ebe9d7baa2c2d216a44b0b42be8209c7`
- `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
  - file SHA-256 at initial freeze: `3b5262105de7a804cbbbb67e9ad111212bef6f4859f722fcaea42e5504e8eb99`
- `preregistration/STAGE_2_FORMAL_SPEC.json`
  - file SHA-256 at initial freeze: `6ef20e20f639797c3d98673980e6e4b2c4c63a522e0c052ce523f6132a94ea60`

These hashes refer to exact UTF-8 file bytes including the final newline in the initial study-start commit.

## Upstream records read before freeze

- `doc/FUTURE_RESEARCH_AGENDA.md` Version 2.0.0, Section 9
- `doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md`
- `doc/position-evaluation-calibration/STUDY_1_FINAL_REPORT.md`
- `doc/position-evaluation-calibration/preregistration/STAGE_2_FORMAL_SPEC.json`

## Future reproducibility requirements

Before Stage 1 authorization, record exact SHA-256 for:

- `public/engine.js`
- `public/ai.js`
- `public/ai-weights.js`
- any G2-01 generation/measurement common library
- Stage 0/1 validators and runners
- Stage 1 spec

Before Stage 2 authorization, additionally freeze:

- verified Stage 1 development result
- exact frozen calibration mapping artifact
- Stage 2 common library
- formal evaluator
- independent verifier
- Stage 2 spec
- exact source hashes

Production and independent verification logic should not share unverified scientific decision logic.
