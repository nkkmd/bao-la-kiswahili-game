# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`OFFLINE-PREFLIGHT-PASS / RUNTIME-FREEZE-PENDING / PAID-LIVE-NOT-AUTHORIZED`**

専用branch `experiment/jev-direct-policy-20260922` 上でDirect Policyの中核、strict response validator、fresh opening generator、mock QA、local preflight、費用台帳、resumable client、対局runner、paired statistics、runtime freeze generatorを実装した。

現時点では有料Jev API呼出しを行っていない。`public/`、main、AI-GEN4、release、本番配信状態は変更していない。

## 2026年9月22日ローカル無課金gate

前回Jev比較と同じユーザーPC・ローカルリポジトリで、次の3工程が実行された。

- `mock-qa.cjs`: `PASS`、paid/network requests 0
- `build-openings.cjs`: `PASS`、pilot 2 pairs、formal 32 pairs / 64 games、Namua 16 / Mtaji 16、前回Study opening 34件を除外
- `preflight.cjs`: `PASS-OFFLINE`、前回記録環境とのmeaningful/contextual difference 0

実行環境はNode.js `v24.6.0`、Linux、kernel `6.18.33.2-microsoft-standard-WSL2`、Intel Core i5-8250U、8 logical CPUs、Ubuntu 24.04.1 LTSで前回記録と一致した。

生成したfresh openingの固定hashは次であり、`protocol.json`へ反映済みである。

```text
65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882
```

## 実装済み

- AI-GEN4 expert standardを`maxDepth=12`、`timeLimitMs=2000`へ固定して検証するproduction adapter
- Bao engineによる合法variant完全列挙と各candidateのexact after-state生成
- stateとmove全体から導出するopaque candidate IDとcandidate ID順への決定論的並べ替え
- Jev Direct Policy用の固定Choice instruction
- model / type / choice / probability key set / finite値 / probability sum / confidenceのstrict validator
- 選択後のexact legal variant再検証
- forced move時のAPI bypass
- request保存→予算予約→API→正規化済みresponse保存→費用確定の順序を固定したclient
- 5分通信watchdog。棋力上の持ち時間として扱わない
- automatic retryなし。同一logical moveは最大2 paid attempts、attempt 2は明示的resumeと待機時間を要求
- API key / Authorization headerを保存しない
- 新Study専用の上限USD 1.00のappend-only費用台帳
- crash後のpending decisionについて、request digest / response digest / candidate ID / candidate-set hash / moveを再照合してからgameへcommitするrunner
- formal 32 openingのNamua 16 / Mtaji 16固定と全opening side swap
- paired 2-game openingを単位とするexact sign-test集計

## Jev公式仕様の再確認

2026年9月22日にTypeSafe公式文書を再確認し、`jev-1.13.0`、入力単価$0.042 / 1M tokens、64k request context、Choice最大255 optionsが現行であることを確認した。versioned IDを正式試験でpinする。

## 現在の次gate

openingは固定済みだが、paid pilot前にrunner実装そのものをruntime manifestへ固定する。

ローカルbranchを最新化した後、次を実行する。

```bash
git pull --ff-only
node tools/jev-direct-policy/runner-qa.cjs
node tools/jev-direct-policy/freeze-runtime.cjs
```

`runner-qa.cjs`はmock transportと一時費用台帳だけを使い、実Jev APIを呼ばない。success path、manual retry、保存responseとのbinding、digest改変検出、統計補助処理を検証する。

`freeze-runtime.cjs`もネットワークを使わず、live pathの実装hashとprotocol/opening hashを表示する。出力を監査した後に`runtime-manifest.json`をbranchへ固定する。

## 有料実行gate

有料実行は`EXPLICIT-AUTHORIZATION-FILE-REQUIRED`である。現時点では`authorization.json`を作成しておらず、`--live` runnerを実行しても有料APIへ進めない。

pilot用authorizationはruntime manifest固定とrunner QA合格を監査した後、ユーザーから有料pilot開始の明示指示を受けた場合だけ別途作成する。formal用authorizationはpilotの技術監査後に別途扱う。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`は事前固定済みであり、結果にかかわらず変更しない。このStudyからpublic AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
