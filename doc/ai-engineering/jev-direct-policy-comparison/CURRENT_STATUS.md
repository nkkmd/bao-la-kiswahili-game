# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`FORMAL-COMPLETE / FINAL-REPLAY-AUDIT-PENDING`**

専用branch `experiment/jev-direct-policy-20260922` 上で、Jev Direct PolicyとAI-GEN4 expert standardを比較するformal 32 fresh openings / 64 gamesは全64局がengine terminalまで完走した。

pilot 4局は完走しtechnical audit PASS済み。formalは明示認可後に開始し、途中3回のretryable technical pauseを事前固定のretry設計に従って処理した。各pauseではAPI keyを外した状態で保存attempt-1とledger bindingを監査し、retry wait経過後に同一logical moveのattempt-2を最大1回だけ明示認可した。3件ともattempt-2で正常回復し、attempt-3、opening replacement、sample extension、adaptive extension、optional stoppingは行っていない。

formal runner最終statusは `FORMAL-COMPLETE`。生集計は `FORMAL_RESULT.md` に記録済み。現在は全64 formal gamesを含む最終再生監査待ちであり、監査PASS前には最終判定を確定しない。

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

## Formal認可・設計

`FORMAL_AUTHORIZATION.md` により32 fresh openings / 64 gamesのみ認可済み。

- Namua 16 / Mtaji 16
- 全opening side swap
- first-game Jev player balance: player0 16 / player1 16
- opening replacementなし
- adaptive/sample extensionなし
- optional stoppingなし
- pilot結果はformal primary inferenceへ不算入
- primary statistic: paired two-game openingの2-0対0-2に対するtwo-sided exact binomial sign test
- alpha: 0.05

## Formal technical pauses / resumes

### Pause 001 / Resume 001

36局terminal完了後、`direct-v1-formal-pair-11-game-0` ply 2で `API-PAUSED / invalid-response`。

API keyを外した状態で `run.cjs verify` が `VERIFIED`、保存attempt-1がHTTP 200 / `invalid-response / retryable: true` として正しくbindingされていることとretry wait経過を確認した後、attempt-2を最大1回認可。正常回復。

### Pause 002 / Resume 002

49局terminal完了後、`direct-v1-formal-pair-26-game-1` ply 5で `RETRY-WAIT`。

保存attempt-1を監査し、HTTP 200 / `invalid-response / retryable: true`、request hash、usage、費用台帳、runtime/opening/spec bindingに不整合がないことを確認。retry wait経過後にattempt-2を最大1回認可。正常回復。

### Pause 003 / Resume 003

52局terminal完了後、`direct-v1-formal-pair-17-game-0` ply 3で `RETRY-WAIT`。

保存attempt-1を監査し、HTTP 200 / `invalid-response / retryable: true`、request hash `ba2dc5a4186939029fb86565f12b1b49d0a12186335fe268c660a09f4b7a9012`、usage、費用台帳、runtime/opening/spec bindingに不整合がないことを確認。retry wait経過後にattempt-2を最大1回認可。正常回復。

3件ともattempt-3は発生していない。

## Formal完走時の生集計

記録:

```text
doc/ai-engineering/jev-direct-policy-comparison/FORMAL_RESULT.md
```

runner最終status:

```text
FORMAL-COMPLETE
```

- planned games: 64
- terminal games: 64
- Jev Direct Policy wins: 7
- AI-GEN4 wins: 57
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 25
- split 1-1 pairs: 7
- incomplete pairs: 0
- directional pairs: 25
- two-sided exact paired sign-test p-value: `5.960464477539063e-8`

この値は最終runner生出力であり、全保存結果の最終再生監査PASS後に正式結果として確定する。

## 費用

formal完走時:

- cumulative paid requests: 413
- cumulative reported usage: USD `0.036509592`
- pilot stage usage: USD `0.002129904`
- formal stage usage: USD `0.034379688`
- uncertain reserved: USD `0`
- overall hard limit: USD `1.00`
- formal hard limit: USD `0.75`
- ledger halted: false

費用gate違反はない。

## 現在の次gate

API keyを外した状態で、同じローカルPCから次を実行する。

```bash
node tools/jev-direct-policy/run.cjs verify
```

このverifyで64 formal gamesおよび4 pilot gamesをopeningから再生し、保存request / response / response digest / candidate ID / candidate-set hash / selected move / after-state、費用台帳chain、runtime manifest、protocol/openings/spec bindingを再照合する。

`VERIFIED` を確認した後にformal technical auditをPASSとし、事前固定したprimary resultを正式確定する。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。本Studyの結果にかかわらず、このStudy単独から公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
