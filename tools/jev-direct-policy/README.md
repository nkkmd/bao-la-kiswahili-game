# Jev Direct Policy 比較試験ツール

- Study ID: `JEV-BAO-DIRECT-POLICY-20260922-v1`
- 費用管理ID: `JEV-BAO-DIRECT-20260922`
- 基準commit: `4d072cb862864f25d6ae74363040c8f4a772d8ee`
- 実施branch: `experiment/jev-direct-policy-20260922`
- 状態: **COMPLETED / CLOSED / AUDIT-PASS**
- 正式判定: **`AI-GEN4-SUPERIOR`**

## 目的

Jevを探索順序付けに使うのではなく、Baoエンジンが列挙した合法候補の中からJev自身が最終着手を1つ直接選ぶ `Jev Direct Policy` と、現行 `AI-GEN4-RELEASE-001` expert standard条件を比較した。

本Studyは性能比較と記録のみを目的とする。結果にかかわらず、このStudyだけを根拠にJevを公開AIへ採用しない。`public/`、AI世代、release、本番配信状態は変更していない。

## 最終結果

- pilot: 4 / 4 terminal
- formal: 64 / 64 terminal
- Jev Direct Policy wins: 7
- AI-GEN4 wins: 57
- Jev 2-0 pairs: 0
- AI-GEN4 2-0 pairs: 25
- split 1-1 pairs: 7
- directional pairs: 25
- two-sided exact paired sign-test: `p = 5.960464477539063e-8`
- final verify: `VERIFIED`
- cumulative paid requests: 413
- cumulative reported usage: USD `0.036509592`

正式判定は固定条件における `AI-GEN4-SUPERIOR`。詳細は[`../../doc/ai-engineering/jev-direct-policy-comparison/FINAL_REPORT.md`](../../doc/ai-engineering/jev-direct-policy-comparison/FINAL_REPORT.md)と[`CLOSURE_AUDIT.md`](../../doc/ai-engineering/jev-direct-policy-comparison/CLOSURE_AUDIT.md)を参照する。完了後に保存棋譜から行った探索的な[追加局面解析](../../doc/ai-engineering/jev-direct-policy-comparison/POSTHOC_POSITION_ANALYSIS_20260923.md)は、正式判定を変更しない。

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

Jevへ任せた処理:

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

Jev側には棋力評価上の2秒制限を置かなかった。5分watchdogは通信異常検出用であり棋力上の持ち時間ではない。

## 固定hash

```text
openingsHash = 65677afceb7eb9d7c6936fe029033088509ec15302f2d15b564dc1bf6eb50882
protocolHash = 90216b075d0ea9b92b3119cfced3759fc8bd4d3ab203da6005b2e1dcf28e3b81
runtimeManifestHash = e5eb64abe660a9c7eb233d134d6de667fc540d235c23ae8b05687b041b755154
specHash = 8bb133012b358859e4c25f78dbf82931936220aad5720eb253cb90ca57969a85
```

`runtime-manifest.json`がlive pathの実装hashを固定する。実対局で使用したopening定義は`design/openings.json`と`design/opening-verification.json`としてcommit `61ce1e70c413a6e3def2c2fe1e6ac86268d297fc`で固定済み。

## 無課金確認

以下は実Jev APIを呼ばない。

```bash
node tools/jev-direct-policy/mock-qa.cjs
node tools/jev-direct-policy/preflight.cjs
node tools/jev-direct-policy/runner-qa.cjs
node tools/jev-direct-policy/freeze-runtime.cjs
node tools/jev-direct-policy/run.cjs verify
```

`build-openings.cjs`は設計生成用であり、`design/openings.json`がfreeze済みのため閉鎖Studyで再生成しない。

## 有料APIの安全境界

live試験は完了しており、Studyは閉鎖済みである。`.live-authorization.json`はローカル専用・`.gitignore`対象でGit管理しない。

本Studyの閉鎖後は、既存のpilot/formal認可を新しい有料API呼出しの根拠として再利用しない。追加の有料実行、sample extension、opening replacement、別model/promptでの再試験を行う場合は、別Studyとして新しいprotocol・予算・認可を必要とする。

API keyはGit、ログ、JSON、ZIP、Markdown、CLI引数へ保存しない。

## retry / resume

実施時の固定規則:

- automatic retryなし
- 同一logical move最大2 paid attempts
- retryable failure後は一度停止
- attempt 2は明示的`resume`と待機時間を要求
- request bytes / candidate set / response / selected moveを再照合
- 技術失敗を対局敗北へ変換しない

formal中に3件のretryable `invalid-response` が発生したが、各attempt-1を監査し、規定のattempt-2で回復した。attempt-3は発生していない。

## formal design

- pilot: 2 openings × side swap = 4 games
- formal: 32 fresh openings × side swap = 64 games
- Namua 16 / Mtaji 16
- adaptive extension / optional stoppingなし
- primary statistic: paired openingの2-0対0-2に対するtwo-sided exact binomial sign test

## 前回Studyとの境界

`tools/jev-comparison/` と `doc/ai-engineering/jev-ai-gen4-comparison/` は完了済み `JEV-BAO-STRENGTH-20260921-v1` のarchiveであり、このStudyから変更していない。前回64局や費用台帳を今回へ合算していない。

## 非採用境界

`NO-PRODUCTION-ADOPTION-FROM-THIS-STUDY`。本Studyの結果だけを根拠に公開AI採用、AI-GEN4置換、AI世代更新、本番配信を行わない。
