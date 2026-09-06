# PBAI-P4 — 判断台帳

## A・B: 開始と事前固定

2026-09-06、開始mainを確認し、[開始認可レビュー](AUTHORIZATION_REVIEW.md)によりPBAI-P4を認可した。[検証条件](PROTOCOL.md)は改善効果を観測する前にcommit `f260b252c8f5f00a9a1b5124748c7303d75b252d` で固定した。候補はC011-v1の1件、公開変更は認可対象外とした。

## C: 正確性

`PASS`。3,620状態、14,222遷移、741,774イベントで不一致0。通常出力、軽量出力、最終状態、合法variant、入力非破壊、独立数量再生、全指定境界を確認した。数値・hashは[正確性結果](../../../artifacts/pbai-p4/correctness.json)を正本とする。

## D: 開発段階の検証

`PASS`。固定深度の全比較、速度・運用・戦術gateが成立し、16局の勝点率0.75も次段階条件を満たした。別実装によるsourceと棋譜の再構成、Pythonによる独立集計が一致した。これによりEを認可した。

## E: 独立集団での再確認

`PASS`。同じ機構・同じ閾値で32局まで完了し、勝点率0.6875。速度・運用・戦術gateと独立検算が成立したため、Fの最終holdoutを認可した。前段の成績を受けて候補や条件を調整していない。

## F: 最終holdoutの資源停止

`STRENGTH-NON-ESTIMABLE / HOLD`。全体wall-clock上限4時間の監視漏れを発見し、354/512局で停止した。177clusterで最終readinessも未達。全完了棋譜の独立再生はPASSだが、時間超過を後から除外して有効化しない。部分成績に基づく棋力改善・速度だけ改善の正式判断は出さない。

## G: 証拠保存とレビュー

`COMPLETE / REVIEW-READY`。停止記録、最終判断、全観測archive、独立検算、再現・再開文書を整備した。公開判断は `NO-RELEASE / KEEP-AI-GEN2 / AWAITING-USER-INSTRUCTION`。詳細は[最終報告](PROGRAM_FINAL_REPORT.md)を参照する。
