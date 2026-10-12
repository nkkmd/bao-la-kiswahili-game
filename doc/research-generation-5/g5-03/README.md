# G5-03 — 二手以内に終局する到達領域の供給確認

## 現在の状態

独立Study `BTCS-STUDY1` の供給契約を準備する。新規64 sourceから全合法分岐が2手以内に自然終局するmtaji rootを探し、最初の最大8候補の完全閉包・独立解を確認する。全分岐成立時の最大157状態という構造保証を使う。深さ打切り評価を真値にしない。

対象は終局に近い特殊層であり、一般局面や長期探索の代表ではない。正式な順位変動・価値損失の関係検証は未承認・未実施。旧G5-01・G5-02の結果と消費状態を保持する。

## 読む順序

1. [契約](CONTRACT.md) — 問い、構造保証、選定・資源・重複・終了。
2. [実行前レビュー](PREEXECUTION_REVIEW.md) — 継続指示に基づく限定認可と対象の限界。
3. [SPEC](SPEC.json)、[SOURCE_MANIFEST](SOURCE_MANIFEST.json)、[AUTHORIZATION](AUTHORIZATION.json) — 機械正本。
4. [実行ツール](../../../tools/research/g5-03/README.md) — fixture確認と保存記録の検算。

ID、JSON field、hash、パス、コマンド、判断tokenは原表記を保持し、意味は周囲の日本語で説明する。
