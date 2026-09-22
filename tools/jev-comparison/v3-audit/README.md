# 監査明細と再計算

- audit-report.json: 提出ZIP、全棋譜、要求・応答、費用の監査集計。
- depth6-plan.json / depth6-report.json / depth6-rows.json: アシスタント側で実施した深さ6の事後比較の条件・集計・全明細。
- cached-positions.json: 正常61回答の局面と確率。
- offline-tool-verification.json: 同梱する時間枠再生ツールの配布前検証。

`depth6-reproduce.cjs`は、同じ61局面の深さ6比較をAPIなしで再計算するためのコードです。必要な場合だけ、リポジトリから`node tools/jev-comparison/v3-audit/depth6-reproduce.cjs`で実行できます。出力先は`results/depth6-reproduction/`で、ここにある参照結果を上書きしません。CPU速度によって10秒の保護上限に達した局面は未完了として記録します。今回案内している時間枠再生の実行に、この再計算は必要ありません。

監査対象の停止を変更したり、API要求や費用台帳の変更を行ったりする機能はありません。
