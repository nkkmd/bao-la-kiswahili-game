# Bao AI Engineering 文書案内

このディレクトリには、公開Bao AIの改善Program、正式採用判断、AI世代管理、次期改善候補に関する文書を置く。

現在状態の正本は[`../AI_ENGINEERING_INDEX.md`](../AI_ENGINEERING_INDEX.md)とし、このREADMEは補助的な案内として扱う。

## 現在の公開AI

現在の公開AI系統は**`AI-GEN4`**である。正式な採用・配信状態は[`ai-gen4-release/README.md`](ai-gen4-release/README.md)を参照する。

AI世代、Program ID、Candidate IDの命名と区別は[`AI_GENERATION_NAMING.md`](AI_GENERATION_NAMING.md)を参照する。

## 次期改善候補

2026-09-13に、次に検証する価値がある探索改善案として、**「十分良い手を基準にしたマージン制限型選択探索」**（作業名: `Good-Enough / Margin-Bounded Selective Search`）を記録した。

詳細は[`NEXT_IMPROVEMENT_CANDIDATE.md`](NEXT_IMPROVEMENT_CANDIDATE.md)を参照する。

2026年9月14日の[事前調査と開始時の引継ぎ](NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md)では、小規模な計測・検証へ進める価値があると評価した。既存PVSに対して省略可能な比較がどれだけ残るかを先に測ること、過去の追加探索の費用超過、計測・評価時の注意点を記録している。棋力改善は未確認であり、今回の文書整備では開始認可レビュー・新規計測・実装・対局試験を開始していない。

この候補は現時点で`CONCEPT-RECORDED / NOT-AUTHORIZED / NOT-IMPLEMENTED`であり、正式Program IDと正式Candidate IDは未発行である。記録しただけでは公開AI、release、AI世代を変更しない。

実作業へ進む場合は、候補文書と事前調査記録を読み、最新のrepository状態と公開AIの基準構成を確認し、独立した認可レビューから開始する。
