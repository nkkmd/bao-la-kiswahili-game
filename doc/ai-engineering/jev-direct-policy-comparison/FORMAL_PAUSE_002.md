# JEV-BAO-DIRECT-POLICY-20260922-v1 — Formal Pause 002

更新日: 2026年9月22日

## 状態

`FORMAL-PAUSED / RETRY-WAIT / ATTEMPT-1-AUDIT-PENDING`

`FORMAL_RESUME_AUTHORIZATION_001.md` に基づく resume 001 では、最初の停止点 `direct-v1-formal-pair-11-game-0` の retryable attempt-1 から attempt-2 へ進み、正常に回復した。その後、事前固定済みformal scheduleを変更せず継続し、terminal gamesは36局から49局へ増加した。

新たに `direct-v1-formal-pair-26-game-1` のply 5で、別logical moveのattempt-1がretryable failureとなった。resume実行中だったためrunnerはattempt-2へ進もうとしたが、固定60秒minimum retry waitが未経過であり、`RETRY-WAIT`で安全停止した。

この停止は技術停止であり、勝敗には数えない。formalは未完了であり、49/64局時点の統計を正式結論には使用しない。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Pause 002

- paused game: `direct-v1-formal-pair-26-game-1`
- opening: `formal-opening-26`
- Jev player: 1
- paused ply: 5
- pause code: `RETRY-WAIT`
- retryNotBefore epoch ms: `1790087294532`
- retryNotBefore (Asia/Tokyo): `2026-09-22 23:28:14.532 +09:00`

`RETRY-WAIT`はattempt-2そのものの失敗を意味しない。別logical moveのattempt-1がretryableだった一方、attempt-2発行前の最低待機時間を満たしていなかったため停止したものである。

## 停止時点集計

- formal planned/seen games: 50
- formal terminal games: 49
- Jev Direct Policy wins: 6
- AI-GEN4 wins: 43
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 18
- split 1-1 pairs: 6
- incomplete pairs: 1
- directional pairs: 18
- interim two-sided exact sign-test p-value: `0.00000762939453125`

このp-valueは中間値であり、事前固定したno optional stopping条件によりformal primary inferenceには使用しない。全64局が有効terminalで完了した場合のみ正式統計を確定する。

## 費用停止時点

- cumulative paid requests: 334
- cumulative reported usage: USD `0.030058266`
- pilot stage usage: USD `0.002129904`
- formal stage usage: USD `0.027928362`
- uncertain reserved: USD `0`
- overall hard limit: USD `1.00`
- formal hard limit: USD `0.75`
- ledger halted: false

費用gate違反はない。

## 次gate

API keyを外した状態で次を確認する。

1. `node tools/jev-direct-policy/run.cjs verify` が `VERIFIED`
2. `direct-v1-formal-pair-26-game-1-ply-5-attempt-1` の保存responseが存在
3. attempt-1 statusがretryable statusとして台帳・保存responseへbinding
4. retryNotBefore経過
5. runtime/opening/spec freezeに不整合なし

すべて満たす場合だけ、同一logical moveのattempt-2を最大1回 `resume formal --live` で認可する。attempt-3、opening replacement、sample extension、adaptive extensionは行わない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY` を維持する。