# PBAI-P7 — 再開手順

最初に[現在の状態](CURRENT_STATUS.md)、[検証条件](PROTOCOL.md)、GitHubのPRと`git status`を確認する。ブランチは`engineering/pbai-p7-logic-inference`。未統合のP6ブランチを基にした独立した作業である。

開始markerがなければ技術試験とソース固定・開始前保存を確認する。`artifacts/pbai-p7/run/RUN_STARTED.json`があれば再開始しない。監視器が生存していれば進行を確認し、終了結果があれば検算・保存・文書整備へ進む。プロセスが死亡した不完全実行はHOLDとして記録する。

P6の消費済みseedとHOLDは変更しない。main統合・公開AI変更は別の明示的な指示があるまで行わない。
