# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`FORMAL-PAUSED / RETRY-WAIT / PAUSE-003-AUDIT-PENDING`**

専用branch `experiment/jev-direct-policy-20260922` 上で、Jev Direct PolicyとAI-GEN4 expert standardを比較するformal 32 fresh openings / 64 gamesを実行中である。

pilot 4局は完走しtechnical audit PASS済み。formalは明示認可後に開始し、Pause 001 / Resume 001およびPause 002 / Resume 002を事前固定のretry設計に従って処理した。いずれのresumeも同一logical moveのattempt-2を1回だけ認可し、正常に回復した。

Resume 002後、formalは52局terminalまで進行した。その後、53局目 `direct-v1-formal-pair-17-game-0` のply 3で新しいretryable attempt-1が発生し、minimum retry wait未経過のためrunnerが `RETRY-WAIT` で安全停止した。

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

36局terminal完了後、`direct-v1-formal-pair-11-game-0` ply 2で `API-PAUSED / invalid-response`。

API keyを外した状態で `run.cjs verify` が `VERIFIED`、保存attempt-1がHTTP 200 / `invalid-response / retryable: true` として正しくbindingされていることとretry wait経過を確認した後、`FORMAL_RESUME_AUTHORIZATION_001.md` によりattempt-2を最大1回認可した。

Resume 001のattempt-2は正常に回復し、当該gameは24 pliesでterminal。その後も固定scheduleを継続した。

## Pause 002 / Resume 002

49局terminal完了後、50局目 `direct-v1-formal-pair-26-game-1` ply 5で `RETRY-WAIT`。

保存attempt-1を監査し、HTTP 200 / `invalid-response / retryable: true`、request hash、usage、費用台帳、runtime/opening/spec bindingに不整合がないことを確認した。retryNotBefore経過後、`FORMAL_RESUME_AUTHORIZATION_002.md` によりattempt-2を最大1回認可した。

Resume 002のattempt-2は正常に回復し、当該gameは23 pliesでterminal。その後 `formal-opening-06` の2局もterminalまで完走した。

## Pause 003

記録:

```text
doc/ai-engineering/jev-direct-policy-comparison/FORMAL_PAUSE_003.md
```

52局terminal完了後、53局目 `direct-v1-formal-pair-17-game-0` のply 3で停止した。

- pause code: `RETRY-WAIT`
- retryNotBefore epoch ms: `1790088118855`
- retryNotBefore: `2026-09-22 23:41:58.855 +09:00`

`RETRY-WAIT`はattempt-2失敗ではない。別logical moveのattempt-1がretryableとなり、同一resume実行内では固定minimum retry waitが未経過だったため、attempt-2を発行せず停止した。

停止時点:

- formal terminal games: 52
- Jev Direct Policy wins: 6
- AI-GEN4 wins: 46
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 20
- split pairs: 6
- incomplete pairs: 1
- directional pairs: 20
- interim p-value: `0.0000019073486328125`

このinterim p-valueは正式結論に使用しない。

## 費用

Pause 003時点:

- cumulative paid requests: 344
- cumulative reported usage: USD `0.030748368`
- pilot stage usage: USD `0.002129904`
- formal stage usage: USD `0.028618464`
- uncertain reserved: USD `0`
- overall hard limit: USD `1.00`
- formal hard limit: USD `0.75`
- ledger halted: false

費用gate違反はない。

## 現在の次gate

API keyを外した状態で次を行う。

1. `node tools/jev-direct-policy/run.cjs verify`
2. `direct-v1-formal-pair-17-game-0-ply-3-attempt-1` の保存responseを確認
3. attempt-1 status / retryable / request hash / usage / HTTP statusを監査
4. runtime/opening/spec/ledger bindingに不整合がないことを確認
5. retryNotBefore経過を確認

すべて正常ならPause 003に対するattempt-2を最大1回だけ別途認可する。自動resume、attempt-3、opening replacement、sample extension、runtime/protocol/openings変更は行わない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。本Studyの結果にかかわらず、公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
