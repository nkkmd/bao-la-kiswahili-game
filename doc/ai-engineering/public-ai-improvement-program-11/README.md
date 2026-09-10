# PBAI-P11：expertの独立再試験

## 目的と現在状態

PBAI-C015-v1が公開expertの低・標準・高の全設定で現在のAI-GEN3を改善するか、新しいseedで検証する。現在は事前固定・開始準備段階であり、結果は未確定。GitHub Actionsの一つの実行へ結び付けた後は、チャットを終了しても対局と検算を継続する。

P10は中断により`TECHNICAL-INVALID / HOLD`で終了した。[P10最終報告](../public-ai-improvement-program-10/PROGRAM_FINAL_REPORT.md)と凍結証拠を保持し、部分結果をP11へ合算しない。hardの正式採用・配信確認状態を維持し、expertはAI-GEN3のままである。

## 読む順序と成果物

1. [固定計画](PROTOCOL.md)で実際の公開設定、候補、比較、合格・停止条件を確認する。
2. [機械定義](SPEC.json)で新しいseed、49バッチ、資源枠を確認する。
3. [再開・照会手順](RESUME.md)で実行IDと保存証拠の確認方法を確認する。
4. [品質監査](QUALITY_AUDIT.md)で準備確認と文書監査の範囲を確認する。

pilot16局の運用確認後、3設定それぞれ256局、計768局を試す。勝率の良い設定だけを選ばず、全設定が事前条件を満たすことを要求する。完了時の`pbai-p11-final-evidence` artifactには日本語報告、判断JSON、棋譜・検算の圧縮証拠を保存する。棋力合格でも実機確認と正式採用は別工程である。

## 採用と世代の境界

main統合、公開切替、AI-GEN4昇格、正式release ID発行は試験結果報告後のユーザー明示指示を待つ。Cloudflare配信はユーザーが行う。PBAI-P11は検証プログラムIDであり、採用判断IDでもAI世代release IDでもない。今回の変更に配信対象ファイルはない。
