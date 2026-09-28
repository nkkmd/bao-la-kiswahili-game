# `PBAI-P15` — 判断記録

| 日付 | 段階 | 判断 | 根拠・境界 |
| --- | --- | --- | --- |
| 2026-09-28 | A | `AUTHORIZED-FOR-P15-STAGED-IMPROVEMENT-WORK` | ユーザーが公開AI改善を着実に進め、長時間試験はGitHub Actionsを第一候補に設計するよう指示。P14とは独立した段階gateで継続。 |
| 2026-09-28 | A | F1をP15として独立評価 | 公開AI改善案の優先候補に従い、Worker instance再利用だけを扱う。前手番のTT、評価cache、検索結果等は持ち越さない。 |
| 2026-09-28 | A | baselineを`AI-GEN4-BASELINE-2026-09-28-v1` / `main@22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`に固定 | P14/C017の実装branchではなく、現行mainの公開releaseをbaselineとする。 |
| 2026-09-28 | B | `WORKER_SUPPORT_SPEC.md`を測定前に固定 | fresh seed `2026100201..2026100264`、Chromium standard hard/expert、cold-vs-warm paired latency、long-session memory、cancellation、Actions shard/checkpoint、coverageとscreening gateを固定。まだseed/clockを消費していない。 |
| 2026-09-28 | C | preflight技術的不成立・契約改訂 | 初回preflight `36415107712`でChromiumの`measureUserAgentSpecificMemory()`が使用不可と判明。後続の`36415268461`、`36415317802`、`36415634228`も旧API呼出しが残り失敗した。測定前にWorker isolate heapをCDPで計測する契約へ改訂した。seed・latency標本は未使用。改訂契約に合わせてpreflight実装を修正した。 |
| 2026-09-28 | C | preflight PASS / run `36420017985` | Chromium 151 / Playwright 1.62.1でCOOP/COEP、Worker targetへCDP接続、GC後のisolate heap 3回採取、合法応答・stateKey、取消・再起動、atomic checkpointが成立。artifact `10969117557`。64 seedは未使用。 |
| 2026-09-28 | D | `BASELINE-SUPPORT-HOLD` | run `36420438844`。8 shard・64 seedを処理。7 seedは指定plyの状態を揃えられず、各難易度171 paired positionsで最低192未達。long-session 16件中6件だけが64要求へ到達。raw shardとcanonical JSONを保全。 |
| 2026-09-28 | E | `HOLD / KEEP-AI-GEN4` | 事前gate未達を保持し、同seed再試験・条件変更・Candidate ID発行・実装・validationへ進まない。公開AIは変更なし。 |
