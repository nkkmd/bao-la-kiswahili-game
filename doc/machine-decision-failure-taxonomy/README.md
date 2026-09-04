# 機械的意思決定失敗の構造分類 — `G2-08` / `MDFT-STUDY1`

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

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 人間向け研究概要
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — Study 1の科学的・技術的最終統合
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md) — prospective scientific protocol
- [`FAILURE_MODE_DICTIONARY.md`](FAILURE_MODE_DICTIONARY.md) — candidate failure-mode familyの機械的定義境界
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の正式状態
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — frozen decisions / no-rescue boundary
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — seed / source / artifact / verifier索引
- [`RESEARCH_LOG.md`](RESEARCH_LOG.md) — chronology
- [`RESUME_HERE.md`](RESUME_HERE.md) — 再開地点
- [`preregistration/`](preregistration/) — scientific seed消費前に固定するmachine-readable contract
- [`results/`](results/) — canonical result保存先
- [`checkpoints/`](checkpoints/) — immutable checkpoints
- [`authorizations/`](authorizations/) — explicit authorization records

## 現在の実行状態

```text
Study = CLOSED / NON-ESTIMABLE
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 1 seeds 28910001..28914096 = CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
```

Stage 1は4,096 fresh gamesから512 rootsを選択し、production / independent full recomputationとmandatory artifact preservationを完了しました。しかし、prospectively frozen global readiness gateのうちopening-prefix diversity (`2836 < 3000`) とmaximum single source-policy share (`170/512 > 0.32`) が未達でした。

Leaf-level development計算ではF01/F02/F03/F05/F06/F10がpromotion formulaを満たしましたが、global readiness failureのためtaxonomyとしてfreezeせず、Stage 2 targetにも使用しません。詳細は`STUDY_1_FINAL_REPORT.md`を参照してください。
