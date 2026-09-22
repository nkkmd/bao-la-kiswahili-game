# Jev Direct Policy 比較試験ツール

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- 費用管理ID: `JEV-BAO-DIRECT-20260922`
- 基準commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- 実施branch: `experiment/jev-direct-policy-20260922`
- 状態: **RUNTIME-FROZEN / PAID-PILOT-NOT-AUTHORIZED**

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

AI-GEN4側:

- `AI-GEN4-RELEASE-001`
- expert / ビングワ
- standard tier
- `PBAI-C015-v1`
- `maxDepth = 12`
- `timeLimitMs = 2000`

Jev側には棋力評価上の2秒制限を置かない。5分watchdogは通信異常検出用であり棋力上の持ち時間ではない。

## 固定hash

```text
openingsHash = 65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882
protocolHash = 90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81
runtimeManifestHash = e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154
```

`runtime-manifest.json`がlive pathの実装hashを固定する。対象ファイルが変更された場合、runnerは停止する。

## 無課金確認

以下は実Jev APIを呼ばない。

```bash
node tools/jev-direct-policy/mock-qa.cjs
node tools/jev-direct-policy/preflight.cjs
node tools/jev-direct-policy/runner-qa.cjs
node tools/jev-direct-policy/freeze-runtime.cjs
```

`build-openings.cjs`は設計生成用であり、`design/openings.json`が既にfreeze済みのため通常は再実行しない。

## 有料APIの安全境界

有料live実行には、固定runtimeと一致するローカル専用認可ファイルが必要。

```text
tools/jev-direct-policy/.live-authorization.json
```

このファイルは`.gitignore`対象でありGit管理しない。現在は作成していないため、pilotは未認可。

さらに以下を要求する。

1. 前回と同一ローカル環境
2. fixed openings / protocol / runtime manifestの一致
3. Jev model / API仕様 / 料金の直前公式再確認
4. stage別費用上限
5. `TYPESAFE_API_KEY`は環境変数のみ
6. userによる明示的なpilot開始指示

API keyはGit、ログ、JSON、ZIP、Markdown、CLI引数へ保存しない。

## retry / resume

- automatic retryなし
- 同一logical move最大2 paid attempts
- retryable failure後は一度停止
- attempt 2は明示的`resume`と待機時間を要求
- request bytes / candidate set / response / selected moveを再照合
- 技術失敗を対局敗北へ変換しない

## formal design

- pilot: 2 openings × side swap = 4 games
- formal: 32 fresh openings × side swap = 64 games
- Namua 16 / Mtaji 16
- adaptive extension / optional stoppingなし
- primary statistic: paired openingの2-0対0-2に対するtwo-sided exact binomial sign test

## 前回Studyとの境界

`tools/jev-comparison/` と `doc/ai-engineering/jev-ai-gen4-comparison/` は完了済み `JEV-BAO-STRENGTH-20260921-v1` のarchiveであり、このStudyから変更しない。前回64局や費用台帳を今回へ合算しない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`。本Studyの結果だけを根拠に公開AI採用、AI-GEN4置換、AI世代更新、本番配信を行わない。
