# JEV-BAO-DIRECT-POLICY-20260922-v1 — Formal Result

更新日: 2026年9月22日

## 状態

**`FORMAL-COMPLETE / FINAL-REPLAY-AUDIT-PASS / RESULT-CONFIRMED`**

事前固定した32 fresh openings / 64 gamesのformal scheduleは全64局がengine terminalまで完走した。technical pauseは途中3回発生したが、いずれも事前固定したretry設計に従って保存attempt-1を監査し、同一logical moveのattempt-2を最大1回だけ明示認可して回復した。opening replacement、sample extension、adaptive extension、optional stoppingは行っていない。

formal完走後、API keyを外した状態で `run.cjs verify` を実行し、`VERIFIED` を確認した。実使用opening定義をbranchへ固定した後にも再verifyし、binding不変を確認している。したがって以下の集計を正式結果として確定する。

正式判定は **`AI-GEN4-SUPERIOR`**。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Formal確定集計

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
- formal plies: 1,029

Primary statisticは事前固定どおり、各openingのside-swap 2局を1 pairとして、2-0 pairのみ方向付き観測とするtwo-sided exact binomial sign testである。32 pair中、25 pairがAI-GEN4 2-0、0 pairがJev 2-0、7 pairが1-1 splitだった。

25 directional pairsすべてがAI-GEN4方向であり、two-sided exact p-valueは `2 × (1/2)^25 = 5.960464477539063e-8`。有意水準0.05を下回るため、固定条件における正式判定を `AI-GEN4-SUPERIOR` とする。

## 費用

最終時点:

- cumulative paid requests: 413
- formal paid requests: 390
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

## 最終audit

formal完走後の結果確定verifyは `2026-09-22T14:51:53.367Z` に `VERIFIED`。その後、実使用opening定義をcommit `61ce1e70c413a6e3def2c2fe1e6ac86268d297fc`で固定し、closure用の最終verifyを再実行した。

最終closure verify:

- status: `VERIFIED`
- timestamp: `2026-09-22T15:01:20.844Z`
- pilot: 4 / 4 terminal
- formal: 64 / 64 terminal
- total games: 68
- pilot plies: 74
- formal plies: 1,029
- total plies: 1,103
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

保存game、request / response、response digest、candidate binding、selected move、exact after-state、ledger chain、runtime manifest、protocol/openings/spec bindingに不整合は検出されなかった。

technical auditは `PASS`、closure auditは `PASS / COMPLETED / CLOSED`。詳細は `FORMAL_TECHNICAL_AUDIT.md` と `CLOSURE_AUDIT.md` を参照する。

## 解釈

この正式結果は、今回固定した `jev-1.13.0` Direct Policy入力形式・prompt・候補表現・Baoエンジンbindingの条件において、AI-GEN4 expert standardの対局成績が有意に良かったことを示す。

Jev一般、別model version、別prompt、別統合方式へは一般化しない。また本比較はcompute-equalではない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。本Studyの結果にかかわらず、このStudy単独から公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
