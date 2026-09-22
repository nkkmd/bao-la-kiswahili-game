# JEV-BAO-DIRECT-POLICY-20260922-v1 — Formal Authorization

更新日: 2026年9月22日

## 判定

**AUTHORIZED — FORMAL 32 OPENINGS / 64 GAMES ONLY**

ユーザーは2026年9月22日、pilot 4局の完走および `run.cjs verify` によるtechnical audit PASS確認後、formal試験の開始を明示指示した。

この認可は `JEV-BAO-DIRECT-POLICY-20260922-v1` のformal stage 32 fresh openings / 64 gamesに限る。public AI採用、AI-GEN4置換、AI世代変更、本番配信、追加sample、adaptive extensionは認可しない。

## 固定binding

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- baseline commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

## Formal固定条件

- 32 fresh openings / 64 games
- Namua 16 / Mtaji 16
- 全openingでside swap
- first-game Jev player balance: player0 16 / player1 16
- AI-GEN4: `AI-GEN4-RELEASE-001`, expert standard, `PBAI-C015-v1`, maxDepth 12, timeLimit 2000 ms
- Jev: `jev-1.13.0`, Direct Policyとして合法候補から最終手を直接選択
- forced moveはAPI bypass
- technical failureを敗北として数えない
- 全64局が有効terminalでない場合はformal判定を完了しない
- optional stoppingなし
- adaptive extensionなし
- opening replacementなし
- pilot 4局はformal primary inferenceへ含めない

Primary statisticはpaired two-game opening単位の2-0対0-2に対するtwo-sided exact binomial sign test、alpha 0.05とする。

## Pilot gate

pilotは4/4 terminal、technical pause 0、`run.cjs verify`は `VERIFIED`。保存request/response、response digest、candidate binding、selected move、after-state、費用台帳chain、runtime/opening/spec bindingに不整合は検出されなかった。

pilot累積費用はUSD `0.002129904`、uncertain reservedはUSD `0`、ledger haltedはfalse。

## TypeSafe公式直前再確認

formal開始指示後にTypeSafe公式文書を再確認し、固定条件との不一致はなかった。

- versioned model: `jev-1.13.0`
- input price: USD 0.042 / 1M input tokens
- request context: 64k tokens per request; 32k for state plus the longest question
- Choice limit: 255 options
- endpoint: `POST https://api.typesafe.ai/v1/systemone`

## 費用境界

費用管理ID: `JEV-BAO-DIRECT-20260922`

- overall hard limit: USD 1.00
- formal stage hard limit: USD 0.75
- contingency: USD 0.15
- append-only ledgerを継続し、pilot台帳をresetしない
- unresolved/uncertain paid attemptは保守的reservationを保持する

## 実行gate

Git管理外の `tools/jev-direct-policy/.live-authorization.json` をformal専用に切り替え、次のbindingを要求する。

- `authorized: true`
- `studyId: JEV-BAO-DIRECT-POLICY-20260922-v1`
- `stage: formal`
- `specHash: 8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`
- `openingsHash: 65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`

technical pause、timeout、429、5xx、invalid response、budget stop等が発生した場合は、その時点で停止して結果を監査する。自動resumeは行わない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`を維持する。本formal試験の結果にかかわらず、このStudy単独から公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
