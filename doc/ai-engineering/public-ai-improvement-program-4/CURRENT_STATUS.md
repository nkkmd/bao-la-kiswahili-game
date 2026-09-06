# PBAI-P4 — 現在状態

更新日: 2026-09-06。状態: `HOLDOUT-AUTHORIZED / IN-PROGRESS`。

[事前固定条件](PROTOCOL.md)に基づき、開始認可、baseline固定、実装、正確性、development、validationが完了した。次は最終holdoutの測定・独立検証である。公開AIは引き続きAI-GEN2であり、main統合・公開変更・世代昇格は未認可である。

| Stage | 状態 | 根拠 |
| --- | --- | --- |
| PBAI-P4-A | COMPLETE | 開始認可とbaseline source固定 |
| PBAI-P4-B | COMPLETE | baseline-only診断と契約固定 |
| PBAI-P4-C | PASS | 3,620状態、14,222遷移、741,774イベントの同等性と独立数量再生 |
| PBAI-P4-D | PASS | developmentの速度・運用・既知戦術、先後交換16局、独立検算 |
| PBAI-P4-E | PASS | validationの速度・運用・既知戦術、先後交換32局、独立検算 |
| PBAI-P4-F | IN-PROGRESS | 未使用holdoutへ進む条件が成立 |
| PBAI-P4-G | PENDING | 最終文書とレビュー可能なPR |

正確性では指定した全境界を通過した。relay-limitは1穴1024個の人工盤面で実際の512上限を検証したが、この盤面の到達可能性は主張しない。

既存engine、AI、search、tactical、AI Worker、Worker integration、AI config、diagnostics UI、Namua→Mtajiの回帰と、新規global-script／Worker／flag対象外の回帰がPASS。実Chromiumは利用環境に見つからず、実端末では検証していない。

独立検算はdevelopmentで54 source seed・40採用root・450着手、validationで57 source seed・48採用root・912着手を再構成し、一致した。少数の前段対局を最終棋力証拠へ混ぜない。
