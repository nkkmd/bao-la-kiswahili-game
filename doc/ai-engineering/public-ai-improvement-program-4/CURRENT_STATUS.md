# PBAI-P4 — 現在状態

更新日: 2026-09-06。状態: `COMPLETE / STRENGTH-NON-ESTIMABLE / HOLD`。

探索専用の軽量な局面遷移を1件実装し、正確性・development・validationを検証した。最終holdout中に全体wall-clock上限4時間の監視漏れを発見し、規定に従って停止した。改善の正式採用判断は出していない。公開AIはAI-GEN2、候補flagは既定falseである。

| Stage | 最終状態 | 根拠 |
| --- | --- | --- |
| PBAI-P4-A | COMPLETE | 開始認可・baseline固定 |
| PBAI-P4-B | COMPLETE | baseline-only診断・条件の事前固定 |
| PBAI-P4-C | PASS | 3,620状態、14,222遷移、741,774イベント、不一致0 |
| PBAI-P4-D | PASS | 固定深度・速度・運用・戦術、16局、独立検算 |
| PBAI-P4-E | PASS | 同じ条件で32局、独立検算 |
| PBAI-P4-F | HOLD / RESOURCE-CAP | 354/512局。全体時間超過、未完了ペアあり |
| PBAI-P4-G | COMPLETE / REVIEW-READY | 証拠保存・最終報告・再開境界・PR用整備 |

進行中の測定プロセスはない。未完了局を敗北・引分・効果なしへ読み替えない。完了済み354局の独立再生はPASSだが、最終棋力証拠の必要条件は満たさない。

[最終報告](PROGRAM_FINAL_REPORT.md)、[判断台帳](DECISION_REGISTER.md)、[再開位置](RESUME_HERE.md)を参照する。main統合・公開変更・世代昇格は行っていない。
