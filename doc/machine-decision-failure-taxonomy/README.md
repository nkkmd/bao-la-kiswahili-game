# G2-08 / MDFT-STUDY1 — Machine Decision-Failure Taxonomy Study 1

このディレクトリは、Research Generation 2 `G2-08` の新規・prospective・独立研究を管理します。

## 研究識別

```text
Program label = G2-08
Study ID = MDFT-STUDY1
Formal title = Machine Decision-Failure Taxonomy Study 1
Research Generation = Research Generation 2
Baseline remote main = cb660e166460e0f19d4ba16d5283fa880d55757f
Research branch = research/g2-08-machine-decision-failure-taxonomy
Stage 0 = MDFT-S0-TECHNICAL-2026-08-29-v1
Stage 1 = MDFT-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = MDFT-S2-FORMAL-2026-08-29-v1
```

日本語研究題目:

> **Baoにおける機械的意思決定失敗の構造分類 — horizon failure, reply undercoverage, ranking instability, tactical oversight, valuation failure, morphology mismatch, and long-horizon structural misvaluation のprospective分離・再現可能なtaxonomy構築**

## 中心課題

単一の「悪手class」を直接作るのではなく、machine/search decision failureを複数のmechanistic signatureへ分解し、fresh development evidenceでtaxonomyを構築した後、fresh held-out evidenceで再現性を検証できるかを調べます。

本Studyはmachine-onlyです。machine failureからhuman difficulty、human confusion、human deception、human error probability、psychological pressure、expert-perceived complexity、traditional Bao terminologyとの同一性を推定しません。

## 文書

- `STUDY_1_OVERVIEW.md` — 人間向け研究概要
- `STUDY_1_PROTOCOL.md` — prospective scientific protocol
- `FAILURE_MODE_DICTIONARY.md` — candidate failure-mode familyの機械的定義境界
- `CURRENT_STATUS.md` — 現在の正式状態
- `DECISION_REGISTER.md` — frozen decisions / no-rescue boundary
- `REPRODUCIBILITY_INDEX.md` — seed / source / artifact / verifier索引
- `RESEARCH_LOG.md` — chronology
- `RESUME_HERE.md` — 再開地点
- `preregistration/` — scientific seed消費前に固定するmachine-readable contract
- `results/` — canonical result保存先
- `checkpoints/` — immutable checkpoints
- `authorizations/` — explicit authorization records

## 現在の実行状態

```text
Stage 0 = DESIGNED / NOT YET EXECUTED
Stage 1 seeds = RESERVED / UNCONSUMED
Stage 1 scientific generation = NOT AUTHORIZED
Stage 2 seeds = RESERVED / UNCONSUMED
Stage 2 scientific generation = NOT AUTHORIZED
scientificInferenceAuthorized = false
```

研究開始時点ではscientific seedを一切消費しません。まずStage 0 technical validation、independent verifier readiness、resource preflight、artifact-preservation preflightを完了し、その後にStage 1 source/spec/hashをfreezeして明示的にauthorizationします。
