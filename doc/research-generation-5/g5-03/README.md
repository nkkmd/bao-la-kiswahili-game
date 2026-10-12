# G5-03 — 二手以内に終局する到達領域の供給確認

## 現在の状態

独立Study `BTCS-STUDY1` の1回の供給診断・独立検算・保存を完了した。新規64 sourceから10適格rootが見つかり、固定8候補すべての完全閉包・厳密解を取得した。各3〜12状態・計45状態37辺で全解が独立一致した。ただし全8 root内の全手は同じ勝敗価値・DTFで、価値損失が変わる事例は得ていない。区画は消費済みで終了する。

対象は終局に近い特殊層であり、一般局面や長期探索の代表ではない。正式な順位変動・価値損失の関係検証は未承認・未実施。旧G5-01・G5-02の結果と消費状態を保持する。

## 読む順序

1. [最終報告](REPORT.md)、[再現性](REPRODUCIBILITY.md)、[再開位置](RESUME_HERE.md) — 結果・証拠・終了境界。
2. [契約](CONTRACT.md) — 問い、構造保証、選定・資源・重複・終了。
3. [実行前レビュー](PREEXECUTION_REVIEW.md) — 継続指示に基づく限定認可と対象の限界。
4. [SPEC](SPEC.json)、[SOURCE_MANIFEST](SOURCE_MANIFEST.json)、[AUTHORIZATION](AUTHORIZATION.json) — 機械正本。
5. [実行ツール](../../../tools/research/g5-03/README.md) — fixture確認と保存記録の検算。

ID、JSON field、hash、パス、コマンド、判断tokenは原表記を保持し、意味は周囲の日本語で説明する。
