# Position Evaluation / Win-Rate Calibration Study 1

研究題目: **Baoにおける形勢評価値と実現勝率の校正 — phase-aware empirical win-probability calibration と評価値の解釈境界**

Status: **STAGE 0 OPEN / TECHNICAL-CONSTRUCT AUDIT IN PROGRESS / SCIENTIFIC GENERATION NOT AUTHORIZED**

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
```

差分は`doc/FUTURE_RESEARCH_AGENDA.md`の研究優先順位更新のみで、既存研究のformal decision変更はない。

Study branch:

```text
research/position-evaluation-winrate-calibration
```

## Architecture

```text
Stage 0  technical / construct / feasibility audit
Stage 1  fresh exploratory calibration development
Stage 2  prospectively frozen fresh held-out formal evaluation
```

Stage 0のspecや文書だけではscientific corpus generationを許可しない。authorization artifactを別途要求する。

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
- `preregistration/`
- `checkpoints/`

完了時に`STUDY_1_OVERVIEW.md`と`STUDY_1_FINAL_REPORT.md`を追加する。
