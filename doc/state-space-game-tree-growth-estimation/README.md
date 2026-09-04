# 状態空間・ゲーム木の成長推定 — `SSGTGE-STUDY1`

Research Generation 2 `G2-12` / Study ID `SSGTGE-STUDY1` のStudy-local正本ディレクトリです。

## 現在の状態

```text
Study status = COMPLETE
formal decision = TECHNICAL-INVALID
Stage 0 v1 = STAGE0-TECHNICAL-INVALID
Stage 0 v2 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
canonical selectedEstimator = null
fresh depth 10/11 = not generated / not read
```

## 研究の目的

G2-05でexactに確立したstandard-root depth 0..9のbounded RAW-state / game-tree growthだけをdevelopment evidenceとして使い、事前固定したestimatorがfresh deeper exact holdoutへ一般化するかを検証するStudyでした。

Stage 1 productionはE2をproposalしましたが、mandatory independent verificationが凍結済みtolerance内で一致しなかったため、そのproposalはcanonical estimatorへ昇格していません。同じdevelopment evidenceの修正版rerunは禁止されているためStudyは`TECHNICAL-INVALID`で閉じています。

## 主要文書

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け概要
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md) — prospectively frozen protocol
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 最終報告
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — closure状態
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — prospective / closure decisions
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — 進行ログ
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — 再現性・provenance索引
- [`RESUME_HERE.md`](RESUME_HERE.md) — 再開時の入口
- `results/STUDY_1_FINAL_RESULT.json` — machine-readable final result
- `results/STAGE_1_TECHNICAL_INVALID_RESULT.json` — Stage 1 fail-closed記録

## 正式結果の境界

Fresh depth 10/11 scientific outcomeは本Studyでは未生成・未読である。production-only Stage 1予測をformal holdout predictionとして使用しない。

G2-05の`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`は不変。G2-11もrepresentation dependency未解決のため`NOT-AUTHORIZED`のままである。

修正版のgrowth-estimator研究を行う場合は、新しいprospective Studyまたは明示的new versionとして開始する。
