# Critical Positions / Outcome Branching Study 1

## 研究題目

**Baoにおける重要局面と勝敗分岐点の同定 — move-sensitive continuation divergence と decision-critical position structure の抽出・検証**

Working English title: **Critical Positions / Outcome Branching Study 1**

```text
studyId = CPOB-STUDY1
status = ACTIVE / STAGE 0 DESIGN ONLY
baseline main HEAD = 576783b1a1d514726d4d30e4dfac1bf79dde9e2a
branch = research/critical-positions-outcome-branching
scientific corpus generated = false
scientific continuation outcomes measured = false
```

## Central question

同一root stateのexact legal moveVariantsを別々にinterveneし、その後を事前固定したcontinuation policyで進めたとき、root actorから見たempirical continuation outcomeがどの程度分岐するかを測定する。

Primary construct:

```text
fixed-policy empirical continuation divergence
```

これは次と同一ではない。

```text
search-value separation
move-ranking instability
structural branch divergence
game-theoretic criticality
human-perceived criticality
```

特に、engine evaluation差をvalidated win-probability差へ変換しない。Position Evaluation / Win-Rate Calibration Study 1はformal `INCONCLUSIVE`であり、Stage 1 isotonic mappingはformal probability instrumentではない。

## Study architecture

```text
Stage 0 — construct / technical / feasibility audit      ACTIVE
Stage 1 — fresh exploratory discovery                    LOCKED
Stage 2 — fresh prospective formal confirmation          LOCKED
```

Stage 0ではscientific seedを消費するcorpus generationやscientific continuation measurementを行わない。

## First documents

- `STAGE_0_CONSTRUCT_DESIGN.md` — construct・endpoint・policy候補・replication design
- `STAGE_0_TECHNICAL_PLAN.md` — technical-only tooling / fixture / verification plan
- `RESEARCH_PLAN.md` — Study 1全体のprospective architecture
- `HYPOTHESES.md` — hypothesis hierarchy
- `VOCABULARY.md` — criticality語彙と禁止された同一視
- `DECISION_REGISTER.md` — frozen / provisional decisions と no-rescue boundary
- `SEED_AUDIT.md` — fresh seed namespace reservation
- `CURRENT_STATUS.md` — current gate state
- `EXPERIMENT_INDEX.md` — stage execution index
- `REPRODUCIBILITY_INDEX.md` — source / identity / future artifact map
- `STUDY_1_OVERVIEW.md` — 初見向け研究概要
- `RESEARCH_LOG.md` — chronological research log

## Artifact policy

Large future scientific artifacts remain local:

```text
artifacts/local/critical-positions-outcome-branching/
```

Gitにはpreregistration、source freeze、authorization、compact results、checkpoints、status、reproducibility records、final synthesisを記録する。

## Interpretation boundary

Study 1はmachine-onlyで設計する。human participant / expert reviewがなくても完結可能とする。

No claim is authorized at initiation for:

- true/game-theoretic winning probability;
- theoretically winning/losing states;
- unique game-theoretic turning points;
- human/expert-perceived importance;
- traditional Bao strategic importance;
- validated score-to-win-probability conversion;
- rescue or relabeling of any completed Bao study.
