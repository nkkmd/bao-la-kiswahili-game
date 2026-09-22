# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`PILOT-COMPLETE / LOCAL-REPLAY-AUDIT-PENDING / FORMAL-NOT-AUTHORIZED`**

専用branch `experiment/jev-direct-policy-20260922` 上で、Jev Direct PolicyとAI-GEN4 expert standardを比較するためのprotocol、fresh openings、無課金QA、費用台帳、resumable client、対局runner、paired statistics、runtime manifestを固定した。

ユーザーは2026年9月22日に有料4局pilotの開始を明示認可し、同じローカルPCでpilotを実行した。4局すべてterminalまで完走し、technical pauseは0件だった。formal 64局はまだ認可していない。

`public/`、main、AI-GEN4、release、本番配信状態は変更していない。

## 固定対象

Study ID:

```text
JEV-BAO-DIRECT-POLICY-20260922-v1
```

基準commit:

```text
4d072cb862864f25d6ae74363040c8f4a772d8ee
```

fresh openings hash:

```text
65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882
```

final runtime manifest hash:

```text
e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154
```

protocol hash:

```text
90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81
```

pilot spec hash:

```text
8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85
```

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

```text
doc/ai-engineering/jev-direct-policy-comparison/PILOT_RESULT.md
```

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

## QAで発見・修正した事項

最初のrunner QAは`SAVED_REQUEST_MISSING`で停止した。原因はQA用一時response rootを`validateDecision()`へ注入していなかったことで、live保存先そのものの不具合ではなかった。response rootを明示注入できるよう修正し再試験PASS。

同じ監査でraw API responseのduplicate JSON keyを`response.json()`後には検出できない点を修正し、raw text段階のduplicate-key scanを追加した。

さらに、`.gitignore`が`.live-authorization.json`を除外していた一方runnerが`authorization.json`を参照していた不整合を修正し、ローカル専用認可ファイル名を`.live-authorization.json`へ統一した。

旧runtime hash `30e9af138b0786dae5d6f938c9d1f2d18ebc1271026df14de340d2063344ebbc` および `9e90783320eb244fe62d944b740a1beaa25eeb67541a17f99e95462d3e09b706` は失効済みであり、使用しない。

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
- 途中打切り・adaptive extensionなし
- formalは未認可

## 直前のTypeSafe公式再確認

有料pilot開始指示を受けた直後、TypeSafe公式文書を再確認した。固定前提との不一致はなかった。

- versioned model: `jev-1.13.0`
- input price: USD 0.042 / 1M input tokens
- request context: 64k tokens; 32k for state plus the longest question
- Choice limit: 255 options

## 費用境界

費用管理ID:

```text
JEV-BAO-DIRECT-20260922
```

- overall hard limit: USD 1.00
- pilot stage limit: USD 0.10
- formal stage limit: USD 0.75
- contingency: USD 0.15
- append-only ledger
- 不確実なrequestは保守的reservationを保持

## 現在の次gate

formal認可前に、同じローカルPCで次を実行する。

```bash
node tools/jev-direct-policy/run.cjs verify
```

このverifyで、保存済み全gameをopeningから再生し、各Jev着手のrequest / saved response / response digest / candidate ID / candidate-set hash / selected move / after-state、および費用台帳chain・runtime bindingを再照合する。

verifyが正常終了してもformal 64局は自動認可しない。結果を監査した後にformal開始を別gateで扱う。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY` は事前固定済みで変更しない。結果がJev側に大きく有利でも、このStudyから公開AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。