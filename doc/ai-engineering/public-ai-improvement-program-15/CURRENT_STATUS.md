# `PBAI-P15` — 現在状態

更新日: 2026-09-28

```text
PBAI-P15 = AUTHORIZED / BASELINE-SUPPORT-PREFLIGHT-REPAIR / SEED-NOT-RUN
focus = F1 / Worker instance reuse without search-state reuse
baseline = AI-GEN4-BASELINE-2026-09-28-v1
baseline main commit = 22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b
release = AI-GEN4-RELEASE-001
support seed block = 2026100201..2026100264
support shards = 8
Candidate ID = NOT-ISSUED
public source change = NONE
main integration = NONE
```

現行Worker lifecycle・計測設計の監査は完了した。計測条件、seed、sample、gateは[`WORKER_SUPPORT_SPEC.md`](WORKER_SUPPORT_SPEC.md)に記録した。preflightの初回試行`36415107712`と再実行`36415634228`は、Chromiumで利用できないページ側memory APIを呼んだため失敗した。後者は契約をCDP Worker isolate heapへ改訂した後もコード更新が漏れていた。preflightのみ修正中で、64 seedのbaseline support計測は未実施・seed未消費。
