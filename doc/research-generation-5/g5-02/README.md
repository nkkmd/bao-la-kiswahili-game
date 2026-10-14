# G5-02 — 到達局面の完全解析供給確認

## 現在の状態

新しい独立Study `RECSF-STUDY1` の1回の供給診断・独立検算・保存を完了し、区画を消費済みで終了した。新規32 sourceから16適格rootが見つかり、固定した8候補は全て状態上限5000で未完だった。完全閉包供給は0件であり、正式な順位変動・損失の検証は未承認・未実施である。実行完了tokenは供給成功を意味しない。

## 読む順序

1. [最終報告](REPORT.md)、[再現性](REPRODUCIBILITY.md)、[再開位置](RESUME_HERE.md) — 結果、証拠、終了境界。
2. [供給契約](CONTRACT.md) — 問い、選定、重複と停止、解析・保存の境界。
3. [実行前レビュー](PREEXECUTION_REVIEW.md) — ユーザー指示に基づく1回の限定実行認可。
4. [機械仕様](SPEC.json)、[ソース固定](SOURCE_MANIFEST.json)、[認可](AUTHORIZATION.json) — 再現に必要な固定記録。
5. [実行ツール](../../../tools/research/g5-02/README.md) — fixture検証と保存記録の検算。

ID、JSON field、hash、パス、コマンド、判断tokenは機械正本として英語を保持し、その意味を周囲の日本語で説明する。結果確認後の条件緩和や旧区画の再実行は行わない。
