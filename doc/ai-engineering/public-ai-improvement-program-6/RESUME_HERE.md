# PBAI-P6 — 再開手順

最初に[現在の状態](CURRENT_STATUS.md)、[検証条件](PROTOCOL.md)、`git status`を確認する。作業ブランチは`engineering/pbai-p6-logic-gate-evaluator`。

## 開始前

開始markerがない場合のみ、技術試験とソース固定が完了しているかを確認する。契約の数値を結果を見て変更しない。

## 開始後

`artifacts/pbai-p6/run/RUN_STARTED.json`があれば再開始しない。監視器のプロセスが生存していればその進行を確認する。終了結果があれば保存済み証拠の検算と文書化へ進む。プロセスが死亡し、完了結果がなければ不完全実行としてHOLDを記録する。

main統合・公開AI切替は別の明示的な指示があるまで行わない。
