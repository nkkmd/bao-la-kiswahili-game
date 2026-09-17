# Bao AI Engineering 文書案内

このディレクトリには、公開Bao AIの改善Program、正式採用判断、AI世代管理、次期改善候補に関する文書を置く。

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
