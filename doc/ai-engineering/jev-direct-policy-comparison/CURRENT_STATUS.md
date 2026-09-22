# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`OFFLINE-PREFLIGHT-PASS / RUNNER-QA-PASS / FINAL-RUNTIME-REFREEZE-REQUIRED / PAID-LIVE-NOT-AUTHORIZED`**

専用branch `experiment/jev-direct-policy-20260922` 上でDirect Policyの中核、strict response validator、fresh opening generator、mock QA、local preflight、費用台帳、resumable client、対局runner、paired statistics、runtime freeze generatorを実装した。

現時点では有料Jev API呼出しを行っていない。`public/`、main、AI-GEN4、release、本番配信状態は変更していない。

## ローカル無課金gate

前回Jev比較と同じユーザーPC・ローカルリポジトリで以下を確認した。

- `mock-qa.cjs`: `PASS`、paid/network requests 0
- `build-openings.cjs`: `PASS`、pilot 2 pairs、formal 32 pairs / 64 games、Namua 16 / Mtaji 16、前回Study opening 34件を除外
- `preflight.cjs`: `PASS-OFFLINE`、前回記録環境とのmeaningful/contextual difference 0
- `runner-qa.cjs`: `PASS`、paid/network requests 0
- runner QAで保存response binding、digest改変検出、raw JSON duplicate-key rejection、manual retry、attempt-2、費用台帳、paired statisticsを確認

実行環境はNode.js `v24.6.0`、Linux、kernel `6.18.33.2-microsoft-standard-WSL2`、Intel Core i5-8250U、8 logical CPUs、Ubuntu 24.04.1 LTSで前回記録と一致した。

fresh openingの固定hashは次であり、`protocol.json`へ反映済みである。

```text
65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882
```

## runner QA履歴

最初の`runner-qa.cjs`実行は`SAVED_REQUEST_MISSING`で停止した。有料API呼出しは0件だった。

原因はQAの一時保存先を`validateDecision()`へ注入していなかったことであり、live runner本体の保存先不具合ではなかった。response rootを明示注入できるよう修正した。

同時に、実API成功responseをraw text段階で検査し、JSON objectのduplicate keyを`invalid-response`として拒否する処理を追加した。その後のrunner QA再試験は`PASS`した。

旧runtime hash `30e9af138b0786dae5d6f938c9d1f2d18ebc1271026df14de340d2063344ebbc`は失効済みである。

runner QA合格時に生成されたruntime hash `9e90783320eb244fe62d944b740a1beaa25eeb67541a17f99e95462d3e09b706`はいったんfreeze候補となったが、その後の最終gate監査でlive authorizationファイル名の不整合を確認したため失効させた。

`.gitignore`はローカル専用`.live-authorization.json`を除外していた一方、runnerが`authorization.json`を参照していた。誤ってGit管理される余地をなくすためrunnerを`.live-authorization.json`へ統一し、旧`runtime-manifest.json`を削除した。試験ロジック、opening、protocol、API client、費用台帳には変更を加えていない。

## 実装済み安全境界

- AI-GEN4 expert standardを`maxDepth=12`、`timeLimitMs=2000`へ固定
- Bao engineによる合法variant完全列挙とexact after-state生成
- opaque candidate IDと決定論的candidate ordering
- Jev Direct Policy固定Choice instruction
- model / choice / probability key set / finite値 / sum / confidenceのstrict validation
- raw JSON duplicate-key rejection
- selected exact legal variantの再検証
- forced move時API bypass
- request保存 → 予算予約 → API → response保存 → 費用確定
- 5分communication watchdog（棋力上の持ち時間ではない）
- automatic retryなし、同一logical move最大2 paid attempts、attempt 2は明示resume必須
- API key / Authorization header非保存
- USD 1.00 hard overall budget
- crash後pending decisionのrequest/response/candidate/move再照合
- formal 32 opening、Namua 16 / Mtaji 16、全opening side swap
- paired exact sign test

## Jev公式仕様

2026年9月22日にTypeSafe公式文書を再確認し、`jev-1.13.0`、入力単価$0.042 / 1M tokens、64k request context、Choice最大255 optionsが現行であることを確認した。正式試験ではversioned IDをpinする。

## 現在の次gate

authorization path修正により`run.cjs` hashだけが変わったため、最終runtime manifestを再生成する。

```bash
git pull --ff-only
node tools/jev-direct-policy/runner-qa.cjs
node tools/jev-direct-policy/freeze-runtime.cjs
```

どちらも実Jev APIを呼ばない。新manifestを監査して`runtime-manifest.json`をbranchへ固定した時点で、有料pilot開始直前の技術準備が完了する。

## 有料実行gate

有料実行は`EXPLICIT-AUTHORIZATION-FILE-REQUIRED`である。認可ファイルはGit管理しないローカル専用`tools/jev-direct-policy/.live-authorization.json`とする。

現時点ではこのファイルを作成していないため、`--live` runnerは有料APIへ進めない。pilot用authorizationは最終runtime manifest固定後、ユーザーから有料pilot開始の明示指示を受けた場合だけ作成する。formal用authorizationはpilot技術監査後に別途扱う。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`は事前固定済みであり、結果にかかわらず変更しない。このStudyからpublic AI採用、AI-GEN4置換、AI世代変更、本番配信へ直接進まない。
