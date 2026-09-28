# `PBAI-P15` — 判断記録

| 日付 | 段階 | 判断 | 根拠・境界 |
| --- | --- | --- | --- |
| 2026-09-28 | A | `AUTHORIZED-FOR-P15-STAGED-IMPROVEMENT-WORK` | ユーザーが公開AI改善を着実に進め、長時間試験はGitHub Actionsを第一候補に設計するよう指示。P14とは独立した段階gateで継続。 |
| 2026-09-28 | A | F1をP15として独立評価 | 公開AI改善案の優先候補に従い、Worker instance再利用だけを扱う。前手番のTT、評価cache、検索結果等は持ち越さない。 |
| 2026-09-28 | A | baselineを`AI-GEN4-BASELINE-2026-09-28-v1` / `main@22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`に固定 | P14/C017の実装branchではなく、現行mainの公開releaseをbaselineとする。 |
| 2026-09-28 | B | `WORKER_SUPPORT_SPEC.md`を測定前に固定 | fresh seed `2026100201..2026100264`、Chromium standard hard/expert、cold-vs-warm paired latency、long-session memory、cancellation、Actions shard/checkpoint、coverageとscreening gateを固定。まだseed/clockを消費していない。 |
| pending | C | Actions preflight | Browser version、cross-origin isolation、`measureUserAgentSpecificMemory()`、Worker message path、checkpoint/artifact recoveryをseed sample測定前に確認。 |
| pending | D | baseline support | 64 fresh seedを8 Actions shardで実行。未完了blockは再利用しない。 |
| pending | E | Candidate ID発行または`HOLD` | timing・memory・cancellation・source gatesを満たす場合のみ別のdevelopment contractへ進む。 |
