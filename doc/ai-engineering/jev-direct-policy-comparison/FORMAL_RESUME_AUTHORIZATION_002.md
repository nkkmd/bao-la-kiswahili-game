# JEV-BAO-DIRECT-POLICY-20260922-v1 — Formal Resume Authorization 002

更新日: 2026年9月22日

## 判定

**AUTHORIZED — ONE ATTEMPT-2 FOR PAUSE 002 ONLY**

formal 64局の固定schedule実行中、49局terminal完了後に `direct-v1-formal-pair-26-game-1` のply 5で新たなretryable attempt-1が発生し、runnerはminimum retry wait未経過のため `RETRY-WAIT` で安全停止した。

API keyを外した状態で `node tools/jev-direct-policy/run.cjs verify` を再実行し、最終status `VERIFIED` を確認した。保存済みattempt-1は HTTP 200、`invalid-response`、`retryable: true` として記録され、request hash、usage、費用台帳、runtime/opening/spec bindingに不整合はなかった。

retryNotBefore `2026-09-22 23:28:14.532 +09:00` も経過したため、Pause 002対象の同一logical moveについてattempt-2を最大1回だけ認可する。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Pause 002対象

- game: `direct-v1-formal-pair-26-game-1`
- ply: `5`
- logical attempt-1 ID: `direct-v1-formal-pair-26-game-1-ply-5-attempt-1`
- request hash: `b656a0939d4a687690eddcb762c3a484446d09899498d7ada68daebd4d13df6a`
- HTTP status: `200`
- saved status: `invalid-response`
- retryable: `true`
- input tokens: `1735`
- output tokens: `99`
- retryNotBefore: `2026-09-22 23:28:14.532 +09:00`

## 認可範囲

次のコマンドによる同一logical moveのattempt-2を最大1回だけ許可する。

```bash
node tools/jev-direct-policy/run.cjs resume formal --live
```

attempt-2が成功した場合は、事前固定済みformal scheduleの残りをそのまま継続してよい。

禁止事項:

- attempt-3以降
- opening replacement
- sample extension
- adaptive extension
- optional stopping / early conclusion
- runtime / protocol / openingsの変更
- pilotをformal inferenceへ合算すること

attempt-2も失敗した場合はその時点で停止し、追加再試行は認可しない。

## 中間統計の扱い

Pause 002時点では49/64局terminal、Jev 6勝、AI-GEN4 43勝、AI-GEN4 2-0 pairs 18、split pairs 6、interim p-value `0.00000762939453125` である。

これは途中統計であり正式結論には使用しない。全64局が有効terminalで完了した場合に限り、事前固定済みpaired exact sign testでprimary inferenceを確定する。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。本Studyの結果にかかわらず、このStudy単独から公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
