# JEV-BAO-DIRECT-POLICY-20260922-v1 — Formal Technical Audit

更新日: 2026年9月22日

## 判定

**`PASS`**

formal 32 fresh openings / 64 games完走後、API keyを外した状態で `node tools/jev-direct-policy/run.cjs verify` を実行し、最終status `VERIFIED` を確認した。

この監査により、formal 64局とpilot 4局の保存結果は固定runtime / protocol / openings / specに対して再検証され、正式結果を確定できる状態にある。

## 最終verify

- verify status: `VERIFIED`
- verify timestamp: `2026-09-22T14:51:53.367Z`
- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## 対局再生

最終verifyで確認した対局は次のとおり。

- pilot: 4 / 4 terminal
- formal: 64 / 64 terminal
- incomplete formal pairs: 0
- formal着手数: 1,029 plies
- pilot着手数: 74 plies
- 合計: 1,103 plies

runnerのverifyは保存gameをopeningから再生し、各Jev着手について保存request / response / response digest / candidate ID / candidate-set hash / selected move / exact after-stateを再照合する。また、費用台帳chain、runtime manifest、protocol/openings/spec bindingを検証する。

最終verifyで不整合は検出されなかった。

## Technical pause監査

formal中に3件のretryable technical pauseが発生した。

1. `direct-v1-formal-pair-11-game-0` ply 2
2. `direct-v1-formal-pair-26-game-1` ply 5
3. `direct-v1-formal-pair-17-game-0` ply 3

3件ともattempt-1はHTTP 200で、strict response validatorにより `invalid-response / retryable: true` として保存された。

各pauseについて以下を満たした後だけ同一logical moveのattempt-2を1回認可した。

- API keyを外した状態で `run.cjs verify` が `VERIFIED`
- 保存request / response / request hash / usage / ledger bindingの整合を確認
- minimum retry wait経過を確認

3件ともattempt-2で正常回復した。attempt-3は発生していない。opening replacement、sample extension、adaptive extension、optional stoppingも行っていない。

## 費用台帳

最終verify時点:

- cumulative paid requests: 413
- pilot paid requests: 23
- formal paid requests: 390
- cumulative reported usage: USD `0.036509592`
- pilot stage usage: USD `0.002129904`
- formal stage usage: USD `0.034379688`
- uncertain reserved: USD `0`
- ledger halted: `false`
- overall hard limit: USD `1.00`
- formal hard limit: USD `0.75`

費用gate違反はない。API報告usageは提供元の最終請求額確定を意味しない。

## 監査結論

formal全64局は事前固定したscheduleを満たして完了し、保存データ・局面遷移・Jev選択binding・費用台帳・runtime/spec bindingについて最終verifyが `VERIFIED` となった。

したがってtechnical auditを `PASS` とし、`FORMAL_RESULT.md` の64局集計と事前固定primary statisticを正式結果として確定してよい。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY` は変更しない。本監査PASSは試験結果の技術的妥当性を確定するものであり、公開AI採用、AI-GEN4置換、AI世代変更、本番配信を認可するものではない。
