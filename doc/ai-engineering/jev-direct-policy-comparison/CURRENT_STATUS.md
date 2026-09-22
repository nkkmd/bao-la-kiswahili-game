# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`FORMAL-PAUSED / RETRY-WAIT / ATTEMPT-1-AUDIT-PENDING`**

専用branch `experiment/jev-direct-policy-20260922` 上で、Jev Direct PolicyとAI-GEN4 expert standardを比較するformal 32 fresh openings / 64 gamesを実行中である。

pilot 4局は完走しtechnical audit PASS済み。formalは明示認可後に開始し、最初のtechnical pauseについて保存attempt-1を監査したうえでresume 001を認可した。resume 001ではattempt-2が正常に回復し、事前固定scheduleをそのまま継続した。

その後49局terminal完了時点で、別logical move `direct-v1-formal-pair-26-game-1` のply 5において新たなretryable attempt-1が発生した。runnerは固定minimum retry wait未経過を検出し、`RETRY-WAIT`で安全停止した。

この停止は技術停止であり敗北として扱わない。formalは未完了であり、途中統計から正式な棋力結論を出さない。

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

## Formal認可

`FORMAL_AUTHORIZATION.md` により32 fresh openings / 64 gamesのみ認可済み。

- Namua 16 / Mtaji 16
- 全opening side swap
- first-game Jev player balance: player0 16 / player1 16
- opening replacementなし
- adaptive/sample extensionなし
- optional stoppingなし
- pilot結果はformal primary inferenceへ不算入
- 全64局が有効terminalでない限りformal判定を完了しない

## Pause 001 / Resume 001

最初の停止は36局terminal完了後、`direct-v1-formal-pair-11-game-0` ply 2。

- pause: `API-PAUSED`
- attempt-1 status: `invalid-response`
- HTTP status: `200`
- retryable: `true`
- request hash: `e03f26796fd481e50adb1ce5ec86faaefb1db16f6eb85cd536da40a23de6ae77`

API keyを外した状態で`run.cjs verify`が`VERIFIED`となり、保存response・request・ledger bindingとretry wait経過を監査した。その後 `FORMAL_RESUME_AUTHORIZATION_001.md` により同一logical moveのattempt-2を最大1回認可した。

resume 001のattempt-2は正常に回復し、当該gameは24 pliesでterminalとなった。以後も固定scheduleを変更せず継続した。

## Pause 002

記録:

```text
doc/ai-engineering/jev-direct-policy-comparison/FORMAL_PAUSE_002.md
```

49局terminal完了後、50局目 `direct-v1-formal-pair-26-game-1` のply 5で停止した。

- pause code: `RETRY-WAIT`
- retryNotBefore epoch ms: `1790087294532`
- retryNotBefore: `2026-09-22 23:28:14.532 +09:00`

`RETRY-WAIT`はattempt-2失敗ではない。別logical moveのattempt-1がretryableとなった後、同一resume実行内では固定60秒minimum retry waitが未経過だったため、attempt-2を発行せず停止した。

停止時点:

- formal terminal games: 49
- Jev Direct Policy wins: 6
- AI-GEN4 wins: 43
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 18
- split pairs: 6
- incomplete pairs: 1
- directional pairs: 18
- interim p-value: `0.00000762939453125`

interim p-valueは正式結論に使用しない。

## 費用

Pause 002時点:

- cumulative paid requests: 334
- cumulative reported usage: USD `0.030058266`
- pilot stage usage: USD `0.002129904`
- formal stage usage: USD `0.027928362`
- uncertain reserved: USD `0`
- overall hard limit: USD `1.00`
- formal hard limit: USD `0.75`
- ledger halted: false

費用gate違反はない。

## 現在の次gate

API keyを外した状態で次を行う。

1. `node tools/jev-direct-policy/run.cjs verify`
2. `direct-v1-formal-pair-26-game-1-ply-5-attempt-1` の保存responseを確認
3. attempt-1 status / retryable / request hash / usageを監査
4. retryNotBefore経過を確認

すべて正常ならPause 002に対するattempt-2を最大1回だけ別途認可する。自動resume、attempt-3、opening replacement、sample extension、runtime/protocol/openings変更は行わない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。本Studyの結果にかかわらず、公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
