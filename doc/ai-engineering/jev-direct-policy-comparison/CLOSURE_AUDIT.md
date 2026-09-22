# `JEV-BAO-DIRECT-POLICY-20260922-v1` — Closure Audit

更新日: 2026年9月22日

## 判定

**`PASS / COMPLETED / CLOSED`**

本Studyのformal比較、最終再生監査、費用監査、固定opening保存、branch差分監査を完了した。

正式判定は **`AI-GEN4-SUPERIOR`**。この判定は今回固定したJev Direct Policy条件に限定し、Jev一般、別model version、別prompt、別統合方式へ一般化しない。

## 1. Formal完了

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- formal planned / terminal games: `64 / 64`
- Jev Direct Policy wins: `7`
- AI-GEN4 wins: `57`
- Jev 2-0 pairs: `0`
- AI-GEN4 2-0 pairs: `25`
- split 1-1 pairs: `7`
- incomplete pairs: `0`
- directional pairs: `25`
- formal plies: `1029`
- primary two-sided exact paired sign-test p-value: `5.960464477539063e-8`
- alpha: `0.05`

事前固定したpaired analysisに従い、25 directional pairsすべてがAI-GEN4側であったため正式判定を `AI-GEN4-SUPERIOR` とする。

## 2. 最終再生監査

formal完走後、API keyを外した状態で `node tools/jev-direct-policy/run.cjs verify` を実行した。

最終確認:

- status: `VERIFIED`
- timestamp: `2026-09-22T15:01:20.844Z`
- pilot terminal: `4 / 4`
- formal terminal: `64 / 64`
- cumulative requests: `413`
- cumulative reported usage USD: `0.036509592`
- uncertain reserved USD: `0`
- ledger halted: `false`

保存game、request / response、response digest、candidate binding、selected move、exact after-state、ledger chain、runtime manifest、protocol/openings/spec bindingに不整合は検出されなかった。

## 3. 固定binding

- baseline commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## 4. Opening archive closure

closure前監査で、実試験に使用した生成opening定義がローカルのみに存在することを検出した。

次の2ファイルを内容変更せずbranchへ固定した。

- `tools/jev-direct-policy/design/openings.json`
- `tools/jev-direct-policy/design/opening-verification.json`

固定commit:

- `61ce1e70c413a6e3def2c2fe1e6ac86268d297fc`
- message: `test(jev-direct): freeze generated openings`

`opening-verification.json` は次を記録する。

- status: `PASS`
- pilot pairs: `2`
- formal pairs: `32`
- formal games: `64`
- phase balance: Namua `16` / Mtaji `16`
- previous-study openings excluded: `34`
- new openings: `34`
- first-game Jev player balance: player0 `16` / player1 `16`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`

固定後に再度 `run.cjs verify` を実行し `VERIFIED` を確認したため、opening保存によるspec変化はない。

## 5. Technical pauses

formal中に3件のretryable `invalid-response` が発生した。

1. `direct-v1-formal-pair-11-game-0` ply 2
2. `direct-v1-formal-pair-26-game-1` ply 5
3. `direct-v1-formal-pair-17-game-0` ply 3

各attempt-1をオフライン監査し、minimum retry wait経過後に同一logical moveのattempt-2を最大1回だけ認可した。3件ともattempt-2で正常回復した。

次は行っていない。

- attempt-3以降
- opening replacement
- sample extension
- adaptive extension
- optional stopping / early conclusion
- runtime / protocol / openingsの結果後変更

## 6. 費用監査

- pilot usage USD: `0.002129904`
- formal usage USD: `0.034379688`
- cumulative usage USD: `0.036509592`
- overall hard limit USD: `1.00`
- formal hard limit USD: `0.75`
- uncertain reserve USD: `0`
- halted: `false`

費用gate違反はない。

## 7. Branch差分監査

`main` と `experiment/jev-direct-policy-20260922` を比較した。

- merge base: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- branchはmainに対してahead、behind `0`
- 差分は本Study文書、試験tool、固定opening定義のみ
- `public/`変更: `0`
- production AI変更: `0`
- AI-GEN4 release変更: `0`

ローカル最終 `git status --short` も空で、作業ツリーはcleanだった。

## 8. 非採用境界

**`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`** を維持する。

本Studyの結果から直接、次へ進まない。

- Jevの公開AIへの正式採用
- AI-GEN4の置換
- AI世代変更
- `public/`へのJev API組込み
- 本番配信

将来これらを検討する場合は、本Studyとは別の明示的な採用評価・運用評価を必要とする。

## 9. Closure

必要なformal実行、再生監査、費用監査、opening archive、branch差分監査は完了した。

本Studyを **`COMPLETED / CLOSED`** とする。
