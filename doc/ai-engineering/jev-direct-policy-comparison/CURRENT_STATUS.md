# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`PILOT-COMPLETE / TECHNICAL-AUDIT-PASS / FORMAL-AUTHORIZED / AWAITING-LOCAL-EXECUTION`**

専用branch `experiment/jev-direct-policy-20260922` 上で、Jev Direct PolicyとAI-GEN4 expert standardを比較するためのprotocol、fresh openings、無課金QA、費用台帳、resumable client、対局runner、paired statistics、runtime manifestを固定した。

ユーザーは2026年9月22日に有料4局pilotを明示認可して実行し、4局すべてterminalまで完走、technical pause 0。その後 `run.cjs verify` によるローカル再生監査も `VERIFIED` で正常終了した。

続いてユーザーはformal試験開始を明示指示した。formal 32 fresh openings / 64 gamesは認可済みだが、現時点ではまだローカル実行前である。

`public/`、main、AI-GEN4、release、本番配信状態は変更していない。

## 固定対象

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- 基準commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- fresh openings hash: `65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882`
- final runtime manifest hash: `e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154`
- protocol hash: `90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81`
- spec hash: `8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85`

`tools/jev-direct-policy/runtime-manifest.json`にlive pathのSHA-256を固定済み。runnerはmanifest対象ファイルのhash不一致時に停止する。

## 無課金gate結果

前回Jev比較と同じユーザーPC・ローカル環境で以下を確認した。

- `mock-qa.cjs`: PASS、paid/network requests 0
- `build-openings.cjs`: PASS、pilot 2 pairs、formal 32 pairs / 64 games
- formal phase balance: Namua 16 / Mtaji 16
- 前回Study opening 34件を除外
- first-game Jev player: player0 16 / player1 16
- `preflight.cjs`: PASS-OFFLINE
- 前回環境との差: meaningful 0 / contextual 0
- `runner-qa.cjs`: PASS、paid/network requests 0
- saved response binding: PASS
- response digest tamper detection: PASS
- raw JSON duplicate-key response: REJECTED-AS-INVALID-RESPONSE
- manual retry gate: PASS
- attempt-2 recovery path: PASS
- cost ledger settlement/reservation: PASS
- paired exact sign-test helper: PASS

実行環境はNode.js `v24.6.0`、Linux kernel `6.18.33.2-microsoft-standard-WSL2`、Intel Core i5-8250U、8 logical CPUs、Ubuntu 24.04.1 LTSで前回記録と一致した。

## 有料pilot結果

記録:

- `doc/ai-engineering/jev-direct-policy-comparison/PILOT_RESULT.md`
- `doc/ai-engineering/jev-direct-policy-comparison/PILOT_TECHNICAL_AUDIT.md`

runner最終statusは`PILOT-COMPLETE`。

- terminal games: 4 / 4
- technical pause: 0
- Jev Direct Policy wins: 0
- AI-GEN4 wins: 4
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 2
- split 1-1 pairs: 0
- directional pairs: 2
- two-sided exact sign-test p-value: 0.5
- paid requests: 23
- reported pilot usage: USD `0.002129904`
- uncertain reserved: USD `0`
- ledger halted: false

pilotはtechnical validation用4局であり、formal 64局のprimary inferenceへ含めない。pilotの4-0のみから正式な棋力差を判定しない。

## Pilot再生監査

pilot完走後に `node tools/jev-direct-policy/run.cjs verify` を実行し、最終status `VERIFIED` を確認した。

このverifyで保存済み全gameをopeningから再生し、各Jev着手のrequest / saved response / response digest / candidate ID / candidate-set hash / selected move / after-state、および費用台帳chain・runtime manifest・protocol/openings/spec bindingを再照合した。保存済みpilot結果との不整合は検出されなかった。

したがってpilot技術監査は `PASS` とする。

## Formal認可

formal開始の明示指示を受け、次を記録した。

```text
doc/ai-engineering/jev-direct-policy-comparison/FORMAL_AUTHORIZATION.md
```

認可範囲は32 fresh openings / 64 gamesのみ。追加sample、adaptive extension、opening replacement、public AI採用、本番配信は含まない。

## Formal直前TypeSafe公式再確認

formal開始指示後にTypeSafe公式文書を再確認し、固定条件との不一致はなかった。

- versioned model: `jev-1.13.0`
- input price: USD 0.042 / 1M input tokens
- request context: 64k tokens per request; 32k for state plus the longest question
- Choice limit: 255 options
- endpoint: `POST https://api.typesafe.ai/v1/systemone`

## 固定済み試験条件

AI-GEN4:

- `AI-GEN4-RELEASE-001`
- expert / standard tier
- `PBAI-C015-v1`
- `maxDepth = 12`
- `timeLimitMs = 2000`

Jev Direct Policy:

- Bao engineが合法variantを完全列挙
- exact after-state等の機械的事実だけをJevへ提供
- AI-GEN4の評価値・順位・推奨はJev入力へ含めない
- Jevが合法候補から最終着手を直接1つ選択
- downstream searchによる上書きなし
- forced moveはAPI bypass
- 5分watchdogは通信安全上の制限であり棋力上の持ち時間ではない
- automatic retryなし
- 同一logical move最大2 paid attempts
- attempt 2は明示resumeと待機時間を要求
- API key / Authorization headerを保存しない

formal:

- 32 fresh openings / 64 games
- 全openingでside swap
- Namua 16 / Mtaji 16
- first-game Jev player: player0 16 / player1 16
- 途中打切り・adaptive extensionなし
- 技術停止は敗北として扱わない
- 全64局が有効terminalでない場合はformal判定を完了しない
- primary statisticはpaired two-game openingの2-0対0-2に対するtwo-sided exact binomial sign test
- alpha 0.05
- pilot 4局はformal primary inferenceへ含めない

## 費用境界

費用管理ID: `JEV-BAO-DIRECT-20260922`

- overall hard limit: USD 1.00
- pilot stage limit: USD 0.10
- formal stage limit: USD 0.75
- contingency: USD 0.15
- append-only ledger
- 不確実なrequestは保守的reservationを保持
- pilot台帳をresetしない

pilot完了時の累積使用額はUSD `0.002129904`。

## 現在の次gate

前回と同じローカルPCで、まず `git pull --ff-only` と `node tools/jev-direct-policy/run.cjs verify` を実行してfreeze/pilot audit整合性を再確認する。

その後、Git管理外の `tools/jev-direct-policy/.live-authorization.json` をformal専用へ上書きし、`stage: formal`、固定Study ID / spec hash / openings hashへbindingする。

`TYPESAFE_API_KEY` を環境変数へ設定し、`node tools/jev-direct-policy/run.cjs run formal --live` を実行する。

technical pause、timeout、429、5xx、invalid response、budget stop等が発生した場合は、その時点で停止する。`resume formal --live` は自動実行しない。出力を監査してからresume可否を扱う。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY` は事前固定済みで変更しない。結果がJev側に大きく有利でも、このStudyから公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
