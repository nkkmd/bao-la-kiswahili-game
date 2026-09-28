# `PBAI-P15` — 現在状態

更新日: 2026-09-28

```text
PBAI-P15 = HOLD / KEEP-AI-GEN4 / CLOSED
focus = F1 / Worker instance reuse without search-state reuse
baseline = AI-GEN4-BASELINE-2026-09-28-v1
baseline main commit = 22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b
release = AI-GEN4-RELEASE-001
support seed block = 2026100201..2026100264
support shards = 8
preflight = PASS / run 36420017985
baseline support = HOLD / run 36420438844 / 64 processed seeds / 171 valid pairs per level
Candidate ID = NOT-ISSUED
public source change = NONE
candidate code main integration = NONE
```

現行Worker lifecycle・計測設計の監査は完了した。計測条件、seed、sample、gateは[`WORKER_SUPPORT_SPEC.md`](WORKER_SUPPORT_SPEC.md)に記録した。preflightの初回試行`36415107712`と再実行`36415634228`は、Chromiumで利用できないページ側memory APIを呼んだため失敗した。後者は契約をCDP Worker isolate heapへ改訂した後もコード更新が漏れていた。改訂契約に合わせたpreflight run `36420017985`はPASSし、Chromium 151のWorker isolate heap、応答、取消・再起動、checkpointの技術条件を確認した。64 seedの正式support run `36420438844`はすべてのshardが終了し、このseed blockを消費した。7 seedは指定plyの局面が欠け、各難易度171件のpaired positionsとなり最低192件を満たさなかった。16 long-sessionのうち6件だけが64要求へ達し、全件memory gateも未達。正式判定は`HOLD / KEEP-AI-GEN4`。Candidate ID発行やcandidate実装へ進まない。[最終報告](PROGRAM_FINAL_REPORT.md)と[結果記録](../../../artifacts/pbai-p15/WORKER_SUPPORT_RESULT.md)を参照する。
