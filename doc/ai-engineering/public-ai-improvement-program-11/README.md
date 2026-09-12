# PBAI-P11：expertの独立再試験

## 目的と現在状態

PBAI-C015-v1はexpertの全3設定で棋力・運用・独立検算に合格し、3ブラウザ確認と約20分の実機で問題なしとの報告を受けた。[正式採用判断](ADOPTION.md)は`PBAI-C015-EXPERT-ADOPTION-001 / ADOPT`。後続の[本番用組込み・配信](../pbai-c015-expert-production/README.md)と[AI-GEN4正式昇格・表示配信確認](../ai-gen4-release/README.md)まで完了した。[最終報告](PROGRAM_FINAL_REPORT.md)の実験終了時判断と固定証拠は保持する。

P10は中断により`TECHNICAL-INVALID / HOLD`で終了した。[P10最終報告](../public-ai-improvement-program-10/PROGRAM_FINAL_REPORT.md)と凍結証拠を保持し、部分結果をP11へ合算しない。hardの既存採用を維持したままexpertも正式採用し、現在は両難易度で論理ゲート型評価器を使用する。

## 読む順序と成果物

1. [固定計画](PROTOCOL.md)で実際の公開設定、候補、比較、合格・停止条件を確認する。
2. [機械定義](SPEC.json)で新しいseed、49バッチ、資源枠を確認する。
3. [再開・照会手順](RESUME.md)で実行IDと保存証拠の確認方法を確認する。
4. [品質監査](QUALITY_AUDIT.md)で準備確認と文書監査の範囲を確認する。
5. [最終報告](PROGRAM_FINAL_REPORT.md)と[正式採用判断](ADOPTION.md)で、実験終了時の判断と後続の採用を確認する。
6. [組込み準備](INTEGRATION_PREPARATION.md)と[実機手順](DEVICE_CHECK.md)で、生成するコピーと確認項目を確認する。

pilot16局の運用確認後、3設定それぞれ256局、計768局を完了した。低・標準は各146勝110敗、高は141勝115敗。全設定が事前条件を満たした。終了証拠510ファイルはリポジトリへ保全済みであり、棋力合格でも実機確認と正式採用は別工程である。

## 採用と世代の境界

試験結果報告後のユーザー明示指示に基づき、main統合、公開切替、AI-GEN4昇格、正式release ID発行を完了した。Cloudflare配信はユーザーが実施した。PBAI-P11は検証プログラムIDであり、採用判断IDでもAI世代release IDでもない。P11の検証記録と、後続の本番用public変更・配信記録を分けて保存する。

実行元commitは`0dd3bb6daf19bf00803d43c91bc832fb38d0213f`。[開始結付け記録](AUTHORIZATION.json)と[PR #129](https://github.com/nkkmd/bao-la-kiswahili-game/pull/129)を参照する。後続commitのrunは正式試験ではない。
