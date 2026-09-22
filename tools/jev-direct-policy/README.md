# Jev Direct Policy 比較試験ツール

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- 費用管理ID: `JEV-BAO-DIRECT-20260922`
- 基準commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- 実施branch: `experiment/jev-direct-policy-20260922`
- 状態: **IMPLEMENTATION / LIVE-GATE-CLOSED**

## 目的

Jevを探索順序付けに使うのではなく、Baoエンジンが列挙した合法候補の中からJev自身が最終着手を1つ直接選ぶ `Jev Direct Policy` と、現行 `AI-GEN4-RELEASE-001` expert standard条件を比較する。

本Studyは性能比較と記録のみを目的とする。結果にかかわらず、このStudyだけを根拠にJevを公開AIへ採用しない。`public/`、AI世代、release、本番配信状態は変更しない。

## 権限分離

Baoエンジンを正本とする処理:

- 合法手・house variantの列挙
- capture compulsory等のルール適用
- sowing / relay sowing
- nyumba処理
- phase
- exact after-state
- 捕獲数等の機械的事実
- 終局・勝者
- Jev選択候補の合法性再検証

Jevへ任せる処理:

- 合法候補同士の比較
- 戦術・戦略判断
- 将来局面の見通し
- 最終着手の選択

合法variantが1つしかない局面ではJevを呼ばず、Baoエンジンがその唯一手を実行する。

## 比較対象

AI-GEN4側は以下へ固定する。

- `AI-GEN4-RELEASE-001`
- expert / ビングワ
- standard tier
- `PBAI-C015-v1`
- `maxDepth = 12`
- `timeLimitMs = 2000`

Jev側には棋力評価上の2秒制限を置かない。通信異常検出用watchdogは別物として扱う。

## 現在許可される操作

現段階では無課金操作だけを許可する。

```bash
node tools/jev-direct-policy/mock-qa.cjs
node tools/jev-direct-policy/build-openings.cjs
node tools/jev-direct-policy/preflight.cjs
```

`build-openings.cjs`はJev APIを呼ばず、Baoエンジンだけでfresh openingを生成する。生成した`design/openings.json`は有料pilot前にレビューし、hashを最終プロトコルへ固定する。

## 有料APIの安全境界

現時点では **有料live runnerを有効化しない**。有料pilotへ進む前に、少なくとも次を別gateで満たす。

1. 同一ローカル環境の照合
2. fresh opening 34局面の固定・再生検証
3. Jevモデル・API仕様・料金の公式情報再確認
4. protocol / implementation / openings hash固定
5. 予算上限の固定
6. mock QAとpreflightのPASS
7. ユーザーによる明示的なpilot開始指示

APIキーはGit、ログ、JSON、ZIP、Markdown、CLI引数へ保存しない。

## 前回Studyとの境界

`tools/jev-comparison/` と `doc/ai-engineering/jev-ai-gen4-comparison/` は完了済み `JEV-BAO-STRENGTH-20260921-v1` のarchiveであり、このStudyから変更しない。前回64局や費用台帳を今回へ合算しない。
