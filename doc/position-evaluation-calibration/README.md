# Position Evaluation / Win-Rate Calibration Study 1

研究題目: **Baoにおける形勢評価値と実現勝率の校正 — phase-aware empirical win-probability calibration と評価値の解釈境界**

Status: **STAGE 1 MODEL SELECTED / STAGE 2 FORMAL DESIGN FROZEN / TECHNICAL VALIDATION PENDING / STAGE 2 GENERATION NOT AUTHORIZED**

開始日: 2026-08-18

## 目的

現在のfrozen Bao engine / evaluator / search / continuation policy / sampled state populationの範囲で、engine evaluationとその後のempirical continuation outcomeの対応を測定し、fresh held-out dataで再現可能なcalibration mappingが成立するかを検証する。

この研究では次を別概念として扱う。

```text
engine evaluation
empirical continuation win probability
game-theoretic value
human perception of advantage
```

本研究はgame-theoretic solution、evaluator correctness proof、human advantage judgment、causal effectを主張しない。

## Baseline

研究開始時のrepository source of truth:

```text
main HEAD = 8672ba4fafb896124df0c4728d41f7c3a6ed5056
previously reported HEAD = 1a5a591d526b2383ca3540827eff6f8f39c14861
study branch = research/position-evaluation-winrate-calibration
```

開始時の差分は`doc/FUTURE_RESEARCH_AGENDA.md`の研究優先順位更新のみで、既存研究のformal decision変更はない。

## Architecture

```text
Stage 0  technical / construct / feasibility audit — COMPLETE
Stage 1  fresh exploratory calibration development — COMPLETE / MODEL SELECTED
Stage 2  prospectively frozen fresh held-out formal evaluation — DESIGN FROZEN / NOT AUTHORIZED TO GENERATE
```

## Stage 1 selected mapping

Stage 1 corpus:

```text
1024 games
22200001..22201024
independent verification = PASS
readiness = PASS
selected binary states = 830
```

Candidate result:

```text
phase-aware logistic = ineligible under frozen convergence rule
phase-stratified isotonic = eligible
pooled CV Brier = 0.1532240986334561
selected family = phase-stratified isotonic
```

Stage 1 result artifact SHA-256:

```text
136889c6d778bfccbde2adf969c838cccc6e7372722c157807bf21a0794d1449
```

Stage 1 remains exploratory only; it does not itself confirm calibration.

## Stage 2 formal design

Fresh reserved population:

```text
2048 games
22300001..22302048
```

The Stage 1 isotonic mapping is frozen without Stage 2 refitting. Cross-stage historical trajectory, opening prefix and rule-state overlap are excluded without replacement.

Primary formal success requires all:

```text
paired Brier-skill one-sided 95% bootstrap lower bound > 0
pooled Brier <= 0.18
Namua Brier <= 0.25
Mtaji Brier <= 0.12
```

The exact formal protocol is frozen in `preregistration/STAGE_2_FORMAL_SPEC.json` and `STAGE_2_FORMAL_PROTOCOL.md`.

The Stage 2 spec alone does **not** authorize generation. A separate source-bound authorization is required after the non-scientific Stage 2 smoke passes.

## Canonical working documents

- `RESEARCH_PLAN.md`
- `HYPOTHESES.md`
- `TECHNICAL_SEMANTICS_AUDIT.md`
- `STATISTICAL_ANALYSIS_PLAN.md`
- `SEED_AUDIT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `RESEARCH_LOG.md`
- `STAGE_2_FORMAL_PROTOCOL.md`
- `STAGE_2_RUNBOOK.md`
- `preregistration/`
- `results/`
- `checkpoints/`

完了時に`STUDY_1_OVERVIEW.md`と`STUDY_1_FINAL_REPORT.md`を追加し、root `README.md`、`doc/RESEARCH_INDEX.md`、`doc/FUTURE_RESEARCH_AGENDA.md`をcross-auditする。
