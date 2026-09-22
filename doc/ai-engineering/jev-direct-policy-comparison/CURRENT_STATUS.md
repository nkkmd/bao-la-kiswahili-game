# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`FORMAL-COMPLETE / RESULT-CONFIRMED / AUDIT-PASS / ARCHIVE-CLOSURE-PENDING`**

Jev Direct PolicyとAI-GEN4 expert standardのformal比較は完了し、最終 `run.cjs verify` も `VERIFIED`。正式判定は **`AI-GEN4-SUPERIOR`** と確定した。

ただし最終GitHub差分監査で、実対局に使用したローカル生成ファイル `tools/jev-direct-policy/design/openings.json` と `tools/jev-direct-policy/design/opening-verification.json` がまだbranchへ保存されていないことを確認した。`openingsHash` は最終verifyで一致しているため結果の妥当性は変わらないが、exact opening setの将来再現性を確保するため、この2ファイルを内容変更せずcommitするまでStudyのarchive closureは保留する。

`public/`、main、AI-GEN4、release、本番配信状態は変更していない。`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- baseline commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Formal確定結果

- planned / terminal games: 64 / 64
- Jev Direct Policy wins: 7
- AI-GEN4 wins: 57
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 25
- split 1-1 pairs: 7
- incomplete pairs: 0
- directional pairs: 25
- formal plies: 1,029
- two-sided exact paired sign-test p-value: `5.960464477539063e-8`
- alpha: 0.05
- 正式判定: `AI-GEN4-SUPERIOR`

この判定は今回固定した `jev-1.13.0` Direct Policy方式に限定する。Jev一般、別model version、別prompt、別統合方式へは一般化しない。本比較はcompute-equalでもない。

## 最終再生監査

formal完走後、API keyを外して `node tools/jev-direct-policy/run.cjs verify` を実行した。

- status: `VERIFIED`
- timestamp: `2026-09-22T14:51:53.367Z`
- pilot: 4 / 4 terminal
- formal: 64 / 64 terminal
- total games: 68
- pilot plies: 74
- formal plies: 1,029
- total plies: 1,103

保存game、request / response、response digest、candidate binding、selected move、exact after-state、ledger chain、runtime manifest、protocol/openings/spec bindingに不整合は検出されなかった。technical auditは `AUDIT-PASS`。

## Technical pauses

formal中に3件のretryable `invalid-response` が発生した。

1. `direct-v1-formal-pair-11-game-0` ply 2
2. `direct-v1-formal-pair-26-game-1` ply 5
3. `direct-v1-formal-pair-17-game-0` ply 3

各attempt-1をオフライン監査し、minimum retry wait経過後に同一logical moveのattempt-2を最大1回だけ認可した。3件ともattempt-2で回復し、attempt-3、opening replacement、sample extension、adaptive extension、optional stoppingは行っていない。

## 費用

- cumulative paid requests: 413
- cumulative reported usage: USD `0.036509592`
- pilot stage: USD `0.002129904`
- formal stage: USD `0.034379688`
- uncertain reserved: USD `0`
- ledger halted: false
- overall hard limit: USD `1.00`
- formal hard limit: USD `0.75`

費用gate違反はない。

## Archive closure前の残作業

ローカルで実際に使用した次の2ファイルを内容変更せず専用branchへcommitする。

- `tools/jev-direct-policy/design/openings.json`
- `tools/jev-direct-policy/design/opening-verification.json`

commit後に `run.cjs verify` を再実行し、`openingsHash`とspec bindingが変わらないことを確認する。その後、branch差分と文書整合を最終監査して `COMPLETED / CLOSED` とする。

## 非採用境界

**`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`**

本Studyから公開AI採用、AI-GEN4置換、AI世代変更、`public/`へのJev組込み、本番配信へ直接進まない。
