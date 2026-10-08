# takasia対応版の手動配信手順

更新日: 2026-10-09（日本時間）

## 現在の状態

ユーザーの指示に基づき、PR #179をmainへ統合した。本番配信はユーザーが手動で行う。Cloudflare本番のv2受信、Android実機、実サイトのキャッシュ移行は未確認であり、配信完了とは記録しない。

- main統合コミット: `56e6a1931541b0bbb3019b25f12406dbee0c07d8`
- 検証済みPR対象: `208402d397ce00b4980760eb11a2e7848abd2eb0`
- ルール改訂: `BAO-RULES-V0.2.0-TAKASIA-001`
- AI改訂: `AI-GEN4-TAKASIA-001`
- 公開AI世代・既存release: `AI-GEN4 / AI-GEN4-RELEASE-001`
- 新キャッシュ: `bao-la-kiswahili-v57`

検証済み対象のActionsはPRの14ワークフローと専用push検証がすべて成功した。main統合のtreeは対象と完全一致する。その後の現在状態・本手順の更新は文書だけで、検証済みゲーム・受信側・モデル・予算を変更しない。ソフトウェア検証の結果と限界は[工程7の記録](INTEGRATION_VALIDATION.md)を参照する。配信用zipの `PACKAGE_MANIFEST.json` に収録元コミットと各ファイルのSHA-256を保存する。

## 配信用zipの構成

| ファイル | 内容 | 使用先 |
| --- | --- | --- |
| `bao-takasia-public-20261009.zip` | mainの `public/` 全体。解凍直下に `index.html`。旧棋譜用エンジン、版選択、AI、ルール12図、PWA資産を含む | Cloudflare Pagesなど、現在の静的ゲーム配信先 |
| `bao-takasia-receiver-20261009.zip` | `cloudflare/game-record-ingest/`、そこから参照する `public/engine.js`・`engine-r002.js`・`rule-versions.js`、ライセンス、本手順 | 既存の棋譜受信Workerの更新 |

受信側zipは相対importを維持するため、内部の `cloudflare/` と `public/` の位置関係を変えない。ゲームzipへ受信側zipを混ぜてアップロードしない。ゲーム画面のアプリ表記は既存の `v0.5.0` を保持し、今回の対応は上記ルール・AI改訂で識別する。新しいGitHub releaseは発行していない。

## 更新順序

1. 現在のゲームとWorkerの配備を戻せる状態にする。既存のR2 bucket、Custom Domain、Turnstile secret、収集有効状態を確認する。
2. 受信側zipを解凍し、既存の `bao-game-record-ingest` Workerをv1／v2対応コードへ更新する。新しいWorkerやR2 bucketを作り直す必要はない。既存のsecretとbindingを保持する。
3. 管理した新v2棋譜の受理・ `records/v2/` への保存・最終局面・結果・CPUと終了処理を確認する。旧v1受理、重複、共通の日次quota、R2の90日削除設定も確認する。送信には実際のTurnstile確認とその1局への明示同意を用いる。
4. 受信側の確認後にゲームzipを解凍し、解凍直下の内容を静的ゲーム配信先へアップロードする。 `public/` の親ディレクトリを重ねない。
5. 本番サイトを再読み込みし、新旧棋譜、通常対局・公開AI、takasia表示、日英ルール、オフライン動作を確認する。Android実機でも表示・タップ・戻る／進むを確認する。
6. 実サイトで `bao-la-kiswahili-v57` の利用と旧v55キャッシュの削除を確認する。公開後の結果を記録し、その時点で配信状態を更新する。

新クライアントを旧v1専用受信環境へ先行配信しない。クライアントの任意棋譜提供は有効で、送信先は `https://bao-data.cultivationdata.net/v1/game-records` のままである。このURLのv1と、棋譜本文のversion 1／2は別の識別子である。

## 受信Workerの配備

Wranglerを使用する場合は、受信側zipの解凍先にある `cloudflare/game-record-ingest/` で、既存アカウントと既存Workerを確認して配備する。

```bash
cd cloudflare/game-record-ingest
npx wrangler deploy
```

収録された `wrangler.jsonc` は、従来どおり `COLLECTION_ENABLED=false` が既定である。この設定で配備すると棋譜収集は停止する。管理した送信試験と公開収集を行う段階では、既存の運用に沿って有効状態を明示的に設定する。ゲーム自体の対局・保存・再生は収集停止中も利用できる。

`TURNSTILE_SECRET_KEY` は既存のWorker secretを保持し、zipやGitへ書き込まない。R2 binding `GAME_RECORDS`、private bucket `bao-game-record-contributions`、Custom Domain `bao-data.cultivationdata.net`、Origin・Fetch Metadata・hostnameの既存設定も保持する。既存の `records/v1/` は移動・削除しない。詳しい仕様は[受信Workerの説明](../../../cloudflare/game-record-ingest/README.md)を参照する。

## 不具合時の戻し方

新ゲームの配信後に受信側の不具合が発生した場合は、まず収集を停止する。クライアントを旧配備へ戻す場合はホスティング側の旧配備を利用し、旧キャッシュ更新も確認する。v2クライアントを公開したまま受信側だけを旧v1専用版へ戻さない。v1／v2対応の受信側は旧v1クライアントも受け付ける。

今回のzip準備は本番配備・管理した送信の成功・実機検証を含まない。過去の研究結果・正式採用判断・旧棋譜を新ルールの結果へ読み替えない。

## 引き渡し時の文書確認

現在状態・配信手順に関わる8文書（ルートREADME、AI索引、採用基準、設計、takasiaの入口・工程7・本手順、受信側README）を横断確認した。相対リンク151件・切れ0、英語だけの説明見出し0、説明済み例外を除く英語の通常完全文0、意図しない既存コードブロック変更0を確認した。正式ゲーム名、takasia規則名、既存の固定書誌・状態ラベル、ID・SHA・path・exact commandは再現用の例外として保持する。過去の固定記録・数値・判断を変更せず、main統合済みと本番未配信を区別する。
