# JEV-BAO-DIRECT-POLICY-20260922-v1 — Formal Result

更新日: 2026年9月22日

## 状態

**`FORMAL-COMPLETE / FINAL-REPLAY-AUDIT-PENDING`**

事前固定した32 fresh openings / 64 gamesのformal scheduleは全64局がengine terminalまで完走した。technical pauseは途中3回発生したが、いずれも事前固定したretry設計に従って保存attempt-1を監査し、同一logical moveのattempt-2を最大1回だけ明示認可して回復した。opening replacement、sample extension、adaptive extension、optional stoppingは行っていない。

この文書はrunnerが出力したformal完走時の生集計を記録する。正式判定は、API keyを外した状態で `run.cjs verify` による全保存game / request / response / ledger / bindingの最終再生監査が `VERIFIED` となった後に確定する。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Formal生集計

runner最終status:

```text
FORMAL-COMPLETE
```

- planned games: 64
- terminal games: 64
- incomplete pairs: 0
- Jev Direct Policy wins: 7
- AI-GEN4 wins: 57
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 25
- split 1-1 pairs: 7
- directional pairs: 25
- two-sided exact paired sign-test p-value: `5.960464477539063e-8`

Primary statisticは事前固定どおり、各openingのside-swap 2局を1 pairとして、2-0 pairのみ方向付き観測とするtwo-sided exact binomial sign testである。32 pair中、25 pairがAI-GEN4 2-0、0 pairがJev 2-0、7 pairが1-1 splitだった。

このp-valueはrunner生出力と固定統計実装による値であり、最終再生監査PASS後に正式結果として確定する。

## 費用

formal完走時:

- cumulative paid requests: 413
- cumulative reported usage: USD `0.036509592`
- cumulative estimated/reserved: USD `0.036509592`
- uncertain reserved: USD `0`
- pilot stage usage: USD `0.002129904`
- formal stage usage: USD `0.034379688`
- overall hard limit: USD `1.00`
- formal stage hard limit: USD `0.75`
- ledger halted: false

費用gate違反はない。

## Technical pauses / resumes

formal中に3回のretryable technical pauseが発生した。

1. `direct-v1-formal-pair-11-game-0` ply 2 — `invalid-response`
2. `direct-v1-formal-pair-26-game-1` ply 5 — `invalid-response`
3. `direct-v1-formal-pair-17-game-0` ply 3 — `invalid-response`

各attempt-1はHTTP 200で保存され、`invalid-response / retryable: true` としてrequest / response / usage / ledgerへbindingされた。各pause後、API keyを外した状態で `run.cjs verify` を実行して `VERIFIED` を確認し、retry wait経過後に同一logical moveのattempt-2を1回だけ認可した。3件ともattempt-2で回復し、attempt-3は発生していない。

## 最終audit gate

formal結果確定前に、API keyを外した状態で次を実行する。

```bash
node tools/jev-direct-policy/run.cjs verify
```

このverifyで64 formal gamesおよび4 pilot gamesをopeningから再生し、保存request / response / response digest / candidate binding / selected move / after-state / ledger chain / runtime manifest / protocol / openings / spec bindingを再照合する。

`VERIFIED` を確認した後にのみformal technical auditをPASSとし、事前固定したprimary resultを確定する。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。本Studyの結果にかかわらず、このStudy単独から公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
