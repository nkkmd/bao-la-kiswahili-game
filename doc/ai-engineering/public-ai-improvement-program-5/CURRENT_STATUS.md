# PBAI-P5 — 現在状態

状態: `COMPLETE / ADOPTED / AI-GEN3 / AI-GEN3-RELEASE-001`。全測定と独立検算が完了した。最終512局は328勝184敗、勝点率64.0625％で、固定した100ms/D8の試験範囲における改善条件を満たした。main `650b4312ed9cd318d9981523533dd692bdce6125`の公開assetは実サイトと一致し、Chrome相当経路でhardのAI着手完了を確認した。2026年9月7日に正式判断`ADOPT`と`AI-GEN3`昇格を記録した。

| Stage | 状態 |
| --- | --- |
| PBAI-P5-A 認可・現状・候補同一性 | COMPLETE |
| PBAI-P5-B 事前固定・外部監視器 | COMPLETE |
| PBAI-P5-C 新規正確性 | PASS |
| PBAI-P5-D development | PASS |
| PBAI-P5-E validation | PASS |
| PBAI-P5-F 最終holdout・独立判断 | PASS |
| PBAI-P5-G 証拠保存・最終報告・レビュー用整備 | COMPLETE / REVIEW-READY |

進行中測定なし。新規科学seedは消費済みであり、再実行しない。公開用configではhard/expertの候補を既定有効にしている。正式release IDは`AI-GEN3-RELEASE-001`、現在の公開AI系統は`AI-GEN3`である。ゲーム画面の表示更新とPWA cache v26は手動Cloudflare配信を待つ。P4のHOLDは維持する。

[最終報告](PROGRAM_FINAL_REPORT.md)に数値・根拠・限界を、[main統合前の追加監査](INTEGRATION_READINESS_AUDIT.md)にレビュー指摘と公開前gateを、[公開配信検証](PUBLIC_DEPLOYMENT_VERIFICATION.md)に公開後の照合を、[AI-GEN3正式昇格判断](PROMOTION_DECISION.md)に採用根拠をまとめる。実ブラウザーでは単一の運用確認を行ったが、スマートフォン実機の効果、端末横断の性能、標準500ms対局棋力は未検証である。
