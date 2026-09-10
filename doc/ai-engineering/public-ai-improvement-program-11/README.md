# PBAI-P11：expertの独立再試験

## 目的と現在状態

PBAI-C015-v1のexpert独立再試験は、低・標準・高の全設定で合格し、全棋譜再生と独立集計も完了した。判断は`EXPERT-STRENGTH-PASS / ADOPTION-PENDING`。実機用コピーの3ブラウザ確認も通過し、現在は約20分のスマートフォン実機報告と診断JSONを受領し、使用感・各操作の所見を確認中である。[最終報告](PROGRAM_FINAL_REPORT.md)に結果と限界をまとめた。

P10は中断により`TECHNICAL-INVALID / HOLD`で終了した。[P10最終報告](../public-ai-improvement-program-10/PROGRAM_FINAL_REPORT.md)と凍結証拠を保持し、部分結果をP11へ合算しない。hardの正式採用・配信確認状態を維持し、expertはAI-GEN3のままである。

## 読む順序と成果物

1. [固定計画](PROTOCOL.md)で実際の公開設定、候補、比較、合格・停止条件を確認する。
2. [機械定義](SPEC.json)で新しいseed、49バッチ、資源枠を確認する。
3. [再開・照会手順](RESUME.md)で実行IDと保存証拠の確認方法を確認する。
4. [品質監査](QUALITY_AUDIT.md)で準備確認と文書監査の範囲を確認する。
5. [組込み準備](INTEGRATION_PREPARATION.md)と[実機手順](DEVICE_CHECK.md)で、生成するコピーと確認項目を確認する。

pilot16局の運用確認後、3設定それぞれ256局、計768局を完了した。低・標準は各146勝110敗、高は141勝115敗。全設定が事前条件を満たした。終了証拠510ファイルはリポジトリへ保全済みであり、棋力合格でも実機確認と正式採用は別工程である。

## 採用と世代の境界

main統合、公開切替、AI-GEN4昇格、正式release ID発行は試験結果報告後のユーザー明示指示を待つ。Cloudflare配信はユーザーが行う。PBAI-P11は検証プログラムIDであり、採用判断IDでもAI世代release IDでもない。今回の変更に配信対象ファイルはない。

実行元commitは`0dd3bb6daf19bf00803d43c91bc832fb38d0213f`。[開始結付け記録](AUTHORIZATION.json)と[PR #129](https://github.com/nkkmd/bao-la-kiswahili-game/pull/129)を参照する。後続commitのrunは正式試験ではない。
