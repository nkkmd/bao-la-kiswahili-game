# JEV-BAO-DIRECT-POLICY-20260922-v1 — Formal Resume Authorization 001

更新日: 2026年9月22日

## 判定

**AUTHORIZED — ONE ATTEMPT-2 FOR THE PAUSED LOGICAL MOVE, THEN CONTINUE THE PRE-FROZEN FORMAL SCHEDULE**

対象Studyは `JEV-BAO-DIRECT-POLICY-20260922-v1`。

formal実行は36局terminal完了後、`direct-v1-formal-pair-11-game-0` のply 2で `API-PAUSED / invalid-response` により安全停止した。この停止は技術停止であり、勝敗に算入しない。

## 監査結果

API keyを外した状態で `node tools/jev-direct-policy/run.cjs verify` を再実行し、status `VERIFIED` を確認した。

保存済みattempt-1は次のとおり。

- logical attempt ID: `direct-v1-formal-pair-11-game-0-ply-2-attempt-1`
- HTTP status: `200`
- result status: `invalid-response`
- retryable: `true`
- request hash: `e03f26796fd481e50adb1ce5ec86faaefb1db16f6eb85cd536da40a23de6ae77`
- savedAt: `2026-09-22T14:15:36.778Z`
- input tokens: `2074`
- output tokens: `119`
- retryNotBefore: `1790086596778`
- retryNotBefore Asia/Tokyo: `2026-09-22 23:16:36.778 +09:00`

2026年9月22日23:20 JST台にretry wait経過を確認した。

費用台帳は停止時点で以下。

- cumulative requests: `237`
- cumulative reported usage: USD `0.020806002`
- formal usage: USD `0.018676098`
- uncertain reserved: USD `0`
- ledger halted: `false`

## 固定binding

- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Resumeの許可範囲

`resume formal --live` により、停止した同一logical moveについてattempt-2を最大1回だけ実行することを許可する。

attempt-2成功後は、事前固定済みのformal 32 openings / 64 games scheduleをそのまま継続してよい。

禁止事項:

- attempt-3以降
- opening replacement
- sample extension
- early conclusion / optional stopping
- pilot結果のformal primary inferenceへの混入
- runtime / protocol / openingsの変更

attempt-2も失敗した場合は `ATTEMPTS-EXHAUSTED` 等で停止し、追加再試行は認可しない。

## 統計上の扱い

停止時点のinterim p-value `0.000244140625` は正式結論に使用しない。全64局が有効terminalで完了した場合のみ、事前固定primary statisticを確定する。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。formal結果にかかわらず、このStudy単独から公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
