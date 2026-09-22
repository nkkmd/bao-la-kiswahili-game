# JEV-BAO-DIRECT-POLICY-20260922-v1 — Formal Resume Authorization 003

更新日: 2026年9月22日

## 判定

**AUTHORIZED — PAUSE 003 TARGET LOGICAL MOVE / ATTEMPT-2 ONLY**

Pause 003対象は `direct-v1-formal-pair-17-game-0` のply 3。ユーザーがAPI keyを外した状態で `run.cjs verify` を実行し、最終status `VERIFIED` を確認した。

保存済みattempt-1:

- ID: `direct-v1-formal-pair-17-game-0-ply-3-attempt-1`
- request hash: `ba2dc5a4186939029fb86565f12b1b49d0a12186335fe268c660a09f4b7a9012`
- HTTP status: `200`
- status: `invalid-response`
- retryable: `true`
- input tokens: `2366`
- output tokens: `143`
- savedAt: `2026-09-22T14:40:58.855Z`
- retryNotBefore: `2026-09-22 23:41:58.855 +09:00`

request / response / usage / ledger / runtime / opening / spec bindingに不整合は検出されなかった。

retryNotBefore経過後の2026年9月22日23:44 JST台に待機条件を確認した。

## 認可範囲

同一logical moveについて `resume formal --live` によりattempt-2を最大1回だけ実行する。

attempt-2成功後は事前固定済みformal scheduleの残りをそのまま継続してよい。

禁止事項:

- attempt-3以降
- opening replacement
- sample extension
- adaptive extension
- optional stopping / early conclusion
- runtime / protocol / openings変更

attempt-2も失敗した場合は停止し、追加再試行を行わない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。