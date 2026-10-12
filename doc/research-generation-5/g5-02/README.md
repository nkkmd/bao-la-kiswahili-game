# G5-02 — 到達局面の完全解析供給確認

## 現在の状態

新しい独立Study `RECSF-STUDY1` の契約を固定する工程である。G5-01の32 source・候補0件を保持し、新しい32 sourceから狭い合法手幅のrootを事前選定して、完全閉包が固定資源内で供給されるかを調べる。正式な順位変動・損失の検証は未実施である。

## 読む順序

1. [供給契約](CONTRACT.md) — 問い、選定、重複と停止、解析・保存の境界。
2. [実行前レビュー](PREEXECUTION_REVIEW.md) — ユーザー指示に基づく1回の限定実行認可。
3. [機械仕様](SPEC.json)、[ソース固定](SOURCE_MANIFEST.json)、[認可](AUTHORIZATION.json) — 再現に必要な固定記録。
4. [実行ツール](../../../tools/research/g5-02/README.md) — fixture検証と保存記録の検算。

ID、JSON field、hash、パス、コマンド、判断tokenは機械正本として英語を保持し、その意味を周囲の日本語で説明する。結果確認後の条件緩和や旧区画の再実行は行わない。
