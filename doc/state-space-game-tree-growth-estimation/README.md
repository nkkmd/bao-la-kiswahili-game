# State-Space / Game-Tree Growth Estimation Study 1

Research Generation 2 `G2-12` / Study ID `SSGTGE-STUDY1` のStudy-local正本ディレクトリです。

## 現在の状態

```text
initial prospective freeze = complete
fresh depth 10/11 holdout = not generated
Stage 0 = technical-only authorized, not yet executed
Stage 1 = not yet executed
Stage 2 = not authorized
formal decision = not established
```

## 研究の目的

G2-05でexactに確立したstandard-root depth 0..9のbounded RAW-state / game-tree growthだけをdevelopment evidenceとして使い、事前固定したestimatorがfresh deeper exact holdoutへ一般化するかを検証します。

G2-05のformal exact domainを拡張・救済する研究ではなく、Bao全体のstate-space sizeを無理に一点推定する研究でもありません。

## 主要文書

- `STUDY_1_OVERVIEW.md` — 初見向け概要
- `STUDY_1_PROTOCOL.md` — 科学的・技術的protocol
- `CURRENT_STATUS.md` — 現在のauthorization/execution状態
- `DECISION_REGISTER.md` — prospective decisions
- `RESEARCH_LOG.md` — 研究進行ログ
- `REPRODUCIBILITY_INDEX.md` — 再現性・provenance索引
- `RESUME_HERE.md` — 再開入口
- `preregistration/STUDY_START_FREEZE.md` — study-start human-readable freeze
- `preregistration/STUDY_START_SPEC.json` — machine-readable freeze

## Formal boundary

Primary fresh holdoutはdepth 10です。Depth 11はsecondary stress-testです。どちらもStage 1 estimator freeze後まで生成しません。

G2-11はrepresentation dependency未解決のため`NOT-AUTHORIZED`のままであり、本Studyはその状態を変更しません。
