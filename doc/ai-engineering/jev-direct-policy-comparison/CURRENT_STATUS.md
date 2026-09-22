# `JEV-BAO-DIRECT-POLICY-20260922-v1` — 現在状態

更新日: 2026年9月22日

## 状態

**`IMPLEMENTED-OFFLINE-GATE / PAID-LIVE-NOT-AUTHORIZED`**

専用branch `experiment/jev-direct-policy-20260922` 上で、Direct Policyの中核、strict response validator、fresh opening generator、mock QA、local preflightを実装した。

現時点では有料Jev API呼出しを行っていない。`public/`、main、AI-GEN4、release、本番配信状態は変更していない。

## 実装済み

- AI-GEN4 expert standardを`maxDepth=12`、`timeLimitMs=2000`へ固定して検証するproduction adapter
- Bao engineによる合法variant完全列挙
- 各candidateのexact after-state生成
- stateとmove全体から導出するopaque candidate ID
- candidate ID順への決定論的並べ替え
- Jev Direct Policy用の固定Choice instruction
- model / type / choice / probability key set / finite値 / probability sum / confidenceのstrict validator
- 選択後のexact legal variant再検証
- forced move時のAPI bypass
- mock responseによる無課金positive / negative QA
- 前回Jev Studyの固定openingを除外するfresh 34 opening生成器
- formal 32 openingのnamua 16 / mtaji 16固定
- 各formal openingのside swap強制
- 前回ローカル環境との照合を行うpreflight

## 次のgate

paid pilot前に、前回と同じローカル作業環境で次を実行する。

```bash
git switch experiment/jev-direct-policy-20260922
node tools/jev-direct-policy/mock-qa.cjs
node tools/jev-direct-policy/build-openings.cjs
node tools/jev-direct-policy/preflight.cjs
```

これらはJev APIを呼ばない。

生成される`tools/jev-direct-policy/design/openings.json`と`opening-verification.json`、およびpreflight結果を監査し、opening hashをprotocolへ固定してからpaid client / runnerを最終固定する。

## 停止条件

preflightが`ENVIRONMENT-PAUSE`を返した場合、paid pilotへ進まない。Node.js、platform、CPU、logical CPU等の差を先に評価する。

mock QA、opening replay、source hash、phase balance、side swapのいずれかが不合格でもpaid pilotへ進まない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`は事前固定済みであり、結果にかかわらず変更しない。
