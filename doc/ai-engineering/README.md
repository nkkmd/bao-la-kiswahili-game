# Bao AI Engineering 文書案内

このディレクトリには、公開Bao AIの改善Program、正式採用判断、AI世代管理、次期改善候補、独立した比較試験に関する文書を置く。

現在状態の正本は[`../AI_ENGINEERING_INDEX.md`](../AI_ENGINEERING_INDEX.md)とし、このREADMEは補助的な案内として扱う。

## 現在の公開AI

現在の公開AI系統は**`AI-GEN4`**である。正式な採用・配信状態は[`ai-gen4-release/README.md`](ai-gen4-release/README.md)を参照する。

AI世代、Program ID、Candidate IDの命名と区別は[`AI_GENERATION_NAMING.md`](AI_GENERATION_NAMING.md)を参照する。

## 直近の改善Program

2026-09-17、**「十分良い手を基準にしたマージン制限型選択探索」**（`Good-Enough / Margin-Bounded Selective Search`）を`PBAI-P12 / PBAI-C016-v1`として検証した。

事前のbaseline support計測では、現行PVSにfull-window再探索コストが十分残っていることを確認した。一方、prospectiveに固定したroot margin probe方式は、`Δ = 16 / 32 / 64`のいずれもdevelopment gateを通過しなかった。再探索省略は発生したがprobe費用が節約分を上回り、eligible局面のnode数を削減できなかった。

最終判断は**`COMPLETE / DEVELOPMENT-GATE-FAIL / KEEP-AI-GEN4`**。`PBAI-C016-v1`は不採用・閉鎖、independent validation / release holdoutは未実行、公開AI・release・AI世代の変更はない。

詳細は[`public-ai-improvement-program-12/README.md`](public-ai-improvement-program-12/README.md)と[`public-ai-improvement-program-12/PROGRAM_FINAL_REPORT.md`](public-ai-improvement-program-12/PROGRAM_FINAL_REPORT.md)を参照する。

元の候補概念と開始前調査は[`NEXT_IMPROVEMENT_CANDIDATE.md`](NEXT_IMPROVEMENT_CANDIDATE.md)および[`NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md`](NEXT_IMPROVEMENT_PREFLIGHT_2026-09-14.md)に履歴として保持する。

## 直近の独立比較試験

2026-09-22、JevとAI-GEN4の比較を2つの独立Studyとして完了した。いずれも公開AI採用Programではなく、結果から直接AI世代・release・`public/`・本番配信を変更しない。

1. [`jev-ai-gen4-comparison/`](jev-ai-gen4-comparison/README.md) — `JEV-BAO-STRENGTH-20260921-v1`。Jevをroot move orderingにのみ使った比較で、formal 64局は32勝32敗、全32 pairが1-1、正式判定は`INCONCLUSIVE`。
2. [`jev-direct-policy-comparison/`](jev-direct-policy-comparison/README.md) — `JEV-BAO-DIRECT-POLICY-20260922-v1`。Baoエンジンが合法候補とexact after-stateを固定し、Jevが最終合法手を直接選ぶ方式を比較した。formal 64局はJev 7勝、AI-GEN4 57勝、AI-GEN4 2-0 pairが25、Jev 2-0 pairが0、splitが7で、正式判定は`AI-GEN4-SUPERIOR`（two-sided exact paired sign-test `p = 5.960464477539063e-8`）。Studyは`COMPLETED / CLOSED / AUDIT-PASS`。

Direct Policy Studyの判定は固定した`jev-1.13.0`、prompt、candidate表現、Direct Policy方式に限定する。Jev一般、別model version、別prompt、別統合方式へ一般化しない。[完了後の追加局面解析](jev-direct-policy-comparison/POSTHOC_POSITION_ANALYSIS_20260923.md)では、splitした7開幕の開始局面とAI-GEN4敗局中の41判断局面の強制勝敗、静的評価と実際の着手の違いを記録した。さらに開幕05の同一局面でAI-GEN4は強制勝ちの初手から5手で勝ち、Jevは別の初手から24手で敗れた。Jevは直後の敗北を避けられる97判断局面中31局面で、その敗北を許す手を選んだ（AI-GEN4は同種の59局面中0局面）。局面群が異なるため棋力差や勝てた対局数へ単純換算しない。この探索的な知見は正式判定や公開AIの採用判断を変更しない。`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。
