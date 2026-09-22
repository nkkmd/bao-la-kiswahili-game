# JEV-BAO-DIRECT-POLICY-20260922-v1 — Formal Pause 003

更新日: 2026年9月22日

## 状態

`FORMAL-PAUSED / RETRY-WAIT / ATTEMPT-1-AUDIT-PENDING`

Pause 002に対するResume 002を実行したところ、`direct-v1-formal-pair-26-game-1` のattempt-2は正常に回復し、当該gameは23 pliesでterminalとなった。その後も事前固定済みformal scheduleを変更せず継続し、`formal-opening-06` の2局もterminalまで完走した。

その後、52局terminal完了後の53局目 `direct-v1-formal-pair-17-game-0` のply 3で、新しいretryable attempt-1が発生した。runnerは固定minimum retry wait未経過を検出し、attempt-2を発行せず `RETRY-WAIT` で安全停止した。

この停止は技術停止であり敗北として扱わない。formalは未完了であり、途中統計から正式な棋力結論を出さない。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Resume 002結果

Pause 002対象のattempt-2は正常に回復した。

- recovered game: `direct-v1-formal-pair-26-game-1`
- final status: `TERMINAL`
- winner: player 0
- Jev player: player 1
- plies: 23

その後:

- `direct-v1-formal-pair-06-game-0`: TERMINAL, 4 plies
- `direct-v1-formal-pair-06-game-1`: TERMINAL, 5 plies

## Pause 003

停止対象:

- game: `direct-v1-formal-pair-17-game-0`
- opening: `formal-opening-17`
- Jev player: player 1
- paused ply: 3
- pause code: `RETRY-WAIT`
- retryNotBefore epoch ms: `1790088118855`
- retryNotBefore: `2026-09-22 23:41:58.855 +09:00`

`RETRY-WAIT`はattempt-2失敗を意味しない。新しいlogical moveのattempt-1がretryableとなった後、同一resume実行内ではminimum retry waitが未経過だったため、attempt-2を発行せず停止した。

## 停止時点のformal集計

- planned games encountered: 53
- terminal games: 52
- Jev Direct Policy wins: 6
- AI-GEN4 wins: 46
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 20
- split 1-1 pairs: 6
- incomplete pairs: 1
- directional pairs: 20
- interim two-sided exact sign-test p-value: `0.0000019073486328125`

このp-valueは64局完了前の中間値であり、正式結論には使用しない。optional stopping / early conclusionは行わない。

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

## 次gate

API keyを外した状態で以下を確認する。

1. `node tools/jev-direct-policy/run.cjs verify` が `VERIFIED`
2. `direct-v1-formal-pair-17-game-0-ply-3-attempt-1` の保存responseが存在
3. attempt-1のstatus / retryable / request hash / usage / HTTP statusを確認
4. runtime/opening/spec/ledger bindingに不整合がない
5. retryNotBeforeを経過済み

すべて正常なら、この同一logical moveについてattempt-2を最大1回だけ別途認可する。attempt-3、opening replacement、sample extension、adaptive extension、runtime/protocol/openings変更は行わない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。本Studyの結果にかかわらず、公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
