# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`COMPLETED / CLOSED / AUDIT-PASS / AI-GEN4-SUPERIOR`**

Jev Direct PolicyとAI-GEN4 expert standardを比較する独立Studyは完了した。

formal 32 fresh openings / 64 gamesは全局engine terminalまで完走し、完走後の最終 `run.cjs verify` も `VERIFIED`。技術監査は `PASS`、正式判定は事前固定したprimary statisticに基づき **`AI-GEN4-SUPERIOR`** と確定した。

`public/`、main、AI-GEN4、release、本番配信状態は変更していない。事前固定した `NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY` を維持する。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- baseline commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## 比較条件

AI-GEN4:

- `AI-GEN4-RELEASE-001`
- expert standard tier
- `PBAI-C015-v1`
- maxDepth 12
- timeLimit 2,000 ms / move

Jev Direct Policy:

- `jev-1.13.0`
- Bao engineがrules / legal variants / exact after-state / terminal等を権威的に処理
- Jevが合法候補から最終着手を直接選択
- downstream AI-GEN4 search overrideなし
- forced single legal moveはAPI bypass
- Jevは棋力上の2秒制限なし
- 5分watchdogは通信安全用で持ち時間ではない

本比較はcompute-equalではない。

## Pilot

- 4 / 4 terminal
- Jev Direct Policy wins: 0
- AI-GEN4 wins: 4
- AI-GEN4 2-0 pairs: 2
- p-value: 0.5
- pilot plies: 74
- pilot paid requests: 23
- pilot usage: USD `0.002129904`
- technical audit: `PASS`

pilotはtechnical validation用で、formal primary inferenceには含めない。

## Formal確定結果

- planned games: 64
- terminal games: 64
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

25 directional pairsすべてがAI-GEN4方向だったため、正式判定を `AI-GEN4-SUPERIOR` とする。

この判定は今回固定したDirect Policy方式に限定する。Jev一般、別model version、別prompt、別統合方式には一般化しない。

## Technical pauses

formal中に3回のretryable `invalid-response` が発生した。

- Pause 001: `direct-v1-formal-pair-11-game-0` ply 2
- Pause 002: `direct-v1-formal-pair-26-game-1` ply 5
- Pause 003: `direct-v1-formal-pair-17-game-0` ply 3

各attempt-1をオフライン監査し、minimum retry wait経過後に同一logical moveのattempt-2を最大1回だけ認可した。3件ともattempt-2で回復した。attempt-3、opening replacement、sample extension、adaptive extension、optional stoppingはない。

## 最終再生監査

formal完走後、API keyを外して `node tools/jev-direct-policy/run.cjs verify` を実行した。

- status: `VERIFIED`
- timestamp: `2026-09-22T14:51:53.367Z`
- total games: 68
- total plies: 1,103
- formal: 64 / 64 terminal
- pilot: 4 / 4 terminal

保存game、request / response、response digest、candidate binding、selected move、exact after-state、ledger chain、runtime manifest、protocol/openings/spec bindingに不整合は検出されなかった。

技術監査は `AUDIT-PASS`。

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

## 最終文書

- `FINAL_REPORT.md` — Studyの正式結論と解釈範囲
- `FORMAL_RESULT.md` — audited formal結果
- `FORMAL_TECHNICAL_AUDIT.md` — 最終技術監査
- `FORMAL_AUTHORIZATION.md` — formal認可
- `FORMAL_PAUSE_001.md` / `FORMAL_RESUME_AUTHORIZATION_001.md`
- `FORMAL_PAUSE_002.md` / `FORMAL_RESUME_AUTHORIZATION_002.md`
- `FORMAL_PAUSE_003.md` / `FORMAL_RESUME_AUTHORIZATION_003.md`
- `PILOT_RESULT.md` / `PILOT_TECHNICAL_AUDIT.md`

## 非採用境界

**`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`**

本Studyから公開AI採用、AI-GEN4置換、AI世代変更、`public/`へのJev組込み、本番配信へ直接進まない。

将来別のJev統合方式を試験する場合は、別Studyとして新しいprotocol・予算・認可を設定する。
