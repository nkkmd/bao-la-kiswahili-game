# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`FORMAL-PAUSED / ATTEMPT-1-AUDITED / RESUME-001-AUTHORIZED`**

専用branch `experiment/jev-direct-policy-20260922` 上で、Jev Direct PolicyとAI-GEN4 expert standardを比較するformal 32 fresh openings / 64 gamesを実行中である。

pilot 4局は完走しtechnical audit PASS済み。formalも明示認可後に開始したが、36局terminal完了後、`direct-v1-formal-pair-11-game-0` のply 2でJev API応答がstrict validatorを満たさず、runnerが`API-PAUSED`で安全停止した。

その後、API keyを外した状態で `run.cjs verify` を再実行し `VERIFIED` を確認し、保存済みattempt-1が `invalid-response / retryable: true` としてrequest、response、費用台帳へbindingされていることを確認した。retry waitも経過したため、`FORMAL_RESUME_AUTHORIZATION_001.md` によりattempt-2を1回だけ認可した。

この停止は技術停止であり敗北として扱わない。formalは未完了であり、途中結果から正式な棋力結論を出さない。

`public/`、main、AI-GEN4、release、本番配信状態は変更していない。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- baseline commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Pilot

- 4 / 4 terminal
- Jev Direct Policy 0 wins / AI-GEN4 4 wins
- paid requests 23
- reported usage USD `0.002129904`
- local replay audit `VERIFIED`
- technical audit `PASS`

pilotはformal primary inferenceへ含めない。

## Formal停止時点

記録:

- `doc/ai-engineering/jev-direct-policy-comparison/FORMAL_PAUSE_001.md`
- `doc/ai-engineering/jev-direct-policy-comparison/FORMAL_RESUME_AUTHORIZATION_001.md`

停止時点:

- terminal games: 36
- paused game: `direct-v1-formal-pair-11-game-0`
- paused ply: 2
- pause code: `API-PAUSED`
- api status: `invalid-response`
- attempt-1 HTTP status: `200`
- attempt-1 request hash: `e03f26796fd481e50adb1ce5ec86faaefb1db16f6eb85cd536da40a23de6ae77`
- attempt-1 retryable: `true`
- retryNotBefore: `2026-09-22 23:16:36.778 +09:00`
- formal Jev wins among completed games: 5
- formal AI-GEN4 wins among completed games: 31
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 13
- split pairs: 5
- incomplete pairs: 1
- directional pairs: 13
- interim p-value: `0.000244140625`

interim p-valueは正式結論に使用しない。事前固定どおりoptional stopping / early conclusionは行わず、64局すべてが有効terminalで完了した場合のみprimary inferenceを確定する。

## 費用停止時点

- cumulative paid requests: 237
- cumulative reported usage: USD `0.020806002`
- formal stage usage: USD `0.018676098`
- uncertain reserved: USD `0`
- overall hard limit: USD `1.00`
- formal hard limit: USD `0.75`
- ledger halted: false

費用gate違反はない。

## Resume 001

`FORMAL_RESUME_AUTHORIZATION_001.md`により、停止した同一logical moveについてattempt-2を最大1回だけ `resume formal --live` で実行することを認可した。

attempt-2成功後は、事前固定済みのformal scheduleをそのまま継続してよい。

禁止事項:

- attempt-3以降
- opening replacement
- sample extension
- adaptive extension
- early conclusion / optional stopping
- runtime / protocol / openings変更

attempt-2も失敗した場合は停止し、追加再試行は認可しない。

## 次の操作

同じローカルPCでbranchを最新化し、API keyを環境変数へ設定したうえで次を実行する。

```bash
node tools/jev-direct-policy/run.cjs resume formal --live
```

終了後はAPI keyをunsetする。再度technical pauseが発生した場合は、その場で停止して出力を監査する。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。本Studyの結果にかかわらず、公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
