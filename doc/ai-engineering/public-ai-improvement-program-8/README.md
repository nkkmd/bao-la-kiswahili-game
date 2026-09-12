# PBAI-P8 — 論理ゲート評価器の独立再検証

現在の公開AIは[AI-GEN4](../ai-gen4-release/README.md)（`AI-GEN4-RELEASE-001`）です。本書の公開系統・配信状態・未確認事項は、このプログラムと当時の確認範囲の記録です。後続の採用・配信によって、このプログラムの正式結果や凍結証拠は変更しません。

P7で高速化した固定モデルを、JSON保存後の数値比較契約を修正して、新規データで独立再検証した。候補は同じ`PBAI-C015-v1`であり、モデル・推論・探索は変更していない。

正式判断は`STRENGTH-IMPROVED-IN-FROZEN-DOMAIN`。最終512局は295勝217敗、勝点率57.6171875％、95％区間54.6875〜60.546875％で、事前条件と正式な全件検算を通過した。Node/Linux、100ms・最大深度8という固定範囲で、この論理ゲート評価器を組み込んだ探索AIによる棋力改善を確認した。

Programは完了した。公開判断は`NO-RELEASE / KEEP-AI-GEN3`であり、公開AIは`AI-GEN3 / AI-GEN3-RELEASE-001`のままである。P6・P7のHOLDを変更せず、今回の成績に前回の対局を加えていない。

## 読む順序

1. [最終報告](PROGRAM_FINAL_REPORT.md) — 結果と適用範囲
2. [現在の状態](CURRENT_STATUS.md)と[判断台帳](DECISION_REGISTER.md)
3. [開始レビュー](AUTHORIZATION_REVIEW.md)と[事前固定条件](PROTOCOL.md)
4. [成果物](../../../artifacts/pbai-p8/README.md)と[再現性](REPRODUCIBILITY_INDEX.md)
5. [再開位置](RESUME_HERE.md)と[品質監査](QUALITY_AUDIT.md)
