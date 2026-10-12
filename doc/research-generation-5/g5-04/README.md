# G5-04 — 三〜四手の自然終局領域の供給確認

## 現在の状態

独立開発Study `MTCS-STUDY1` の限定実行・検算・保存を完了した。新規128 sourceから9適格rootを得て、固定8候補すべての完全閉包・全解を取得した。合計169状態162辺で独立一致。3 rootで同価値内DTF差があり、勝敗価値差があるrootは0件だった。区画を消費済みで閉じる。

保存解から全20 root手の勝敗価値・DTFを記述したが、値を選定・補充条件にしていない。同価値内の手数差を勝敗価値損失へ読み替えない。正式関係検証・main統合・公開AI変更は未実施。旧3 Studyの結果・消費状態は保持する。

## 読む順序

1. [最終報告](REPORT.md)、[再現性](REPRODUCIBILITY.md)、[再開位置](RESUME_HERE.md) — 結果・証拠・終了境界。
2. [契約](CONTRACT.md) — 対象層、構造保証、選定・重複・資源・終了。
3. [実行前レビュー](PREEXECUTION_REVIEW.md) — 継続指示に基づく限定認可。
4. [SPEC](SPEC.json)、[ソースmanifest](SOURCE_MANIFEST.json)、[認可](AUTHORIZATION.json) — 機械正本。
5. [実行ツール](../../../tools/research/g5-04/README.md) — 技術確認と再検算。

ID、JSON field、hash、パス、判断token、コマンドは機械正本として原表記を保持し、意味は日本語で説明する。
