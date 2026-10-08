# 任意の棋譜提供機能 — AI改善用収集設計

更新日: 2026-10-08  
対象棋譜形式: 作業ブランチは`bao-game-record` version `1`・`2`、配信済み受信環境はversion `1`  
初回実装ブランチ: `feat/game-record-contribution-20260916`。takasia対応ブランチ: `feat/takasia-preparation-20261008`

## 1. 状態

作業ブランチは新旧ルールで受信検証を行うが、本番Workerのv2対応・移行は未実施である。旧受信環境へ新クライアントを先行配信しない。[工程5の実装・検証・残件](ai-engineering/takasia-update/RECORD_IMPLEMENTATION.md)を確認する。下記の2026年9月の本番開始記録は当時のv1環境の証拠であり、今回の配信完了を示さない。

本機能は、コンピュータ対戦終了後に利用者が**その1局について明示的に同意した場合だけ**、完成棋譜をBao AIの評価・改善用途へ提供できるようにするものである。

2026-09-16時点で、private R2、90日lifecycle、Turnstile、Workers Free上の収集Workerを実Cloudflare環境へ構築し、`cdn-ts.pages.dev` からのcontrolled real submission、スマートフォン実機送信、production custom domain経由のcontrolled submissionまで成功した。Workerの本番入口は `bao-data.cultivationdata.net` とし、Wrangler設定でもCustom Domainを正式なdeploy targetとして管理する。`workers.dev` とPreview URLは無効化している。

PR #144は`main`へ統合済みで、merge commitは`da54b03dd5d8eee345b4b1d08344cb326303aab8`である。その後、`main`の`public/`を本番サイトへ配信し、Cloudflare本番環境の`COLLECTION_ENABLED`を`true`へ切り替え、本番サイトからのproduction E2E送信とR2保存まで正常であることを確認した。本機能は**本番運用開始済み**である。

リポジトリの`cloudflare/game-record-ingest/wrangler.jsonc`では`COLLECTION_ENABLED=false`をfail-closedな既定値として維持する。本番運用時の有効化状態はCloudflare側で明示的に管理し、再deployだけで意図せず収集開始しない構成とする。

実Cloudflare環境で次を確認済みである。

- `COLLECTION_ENABLED=false` 時にAPIが `503 collection_disabled` でfail closedになる
- R2へ新規record objectが保存される
- 保存recordにTurnstile token、consent envelope、送信元IP、User-Agent、fingerprint、氏名、メール等の不要情報が含まれない
- 同一棋譜はduplicateとして成功応答され、record objectを増やさない
- duplicateは日次quotaを消費しない
- Workers Metrics / Observabilityで明確なCPU上限超過、Exceeded Resources、異常を認めない
- malformed requestは `400 invalid_request` で拒否される
- Workers Rate Limiting APIはbest-effortのburst緩和として扱い、hard accountingには使用しない
- スマートフォン実機で通常対局、終局、棋譜保存、任意送信UI、Turnstile、実送信、R2保存が正常に動作する
- `https://bao-data.cultivationdata.net/v1/game-records` へ本番Origin相当のsame-site POSTを送るとkill switchで503になることを本番前preflightで確認した
- 管理下テストOrigin `https://cdn-ts.pages.dev` のcross-site POSTも明示例外を通過してkill switchで503になることを本番前preflightで確認した
- 未許可Origin `https://example.com` はexact Origin allow-listで `403 origin_not_allowed` となる
- Custom Domain経由の新規棋譜送信後も、R2保存数、日次quota、CPU / resource、Turnstileに異常がない
- Wrangler 4.132.0による最終deployで `bao-data.cultivationdata.net (custom domain)` がdeploy targetとして表示され、Worker Version ID `be3409ed-e0e9-4d9b-938f-10aea360110c` が発行された
- `main`統合後の本番サイト配信を完了した
- Cloudflare本番環境で`COLLECTION_ENABLED=true`へ切り替えた
- 本番サイト上のコンピュータ対戦からproduction E2E送信を行い、Turnstile、Custom Domain、Worker validation、R2保存、日次quota、Workers Metrics / Observabilityが正常であることを確認した

本番移行後の運用イベントは[`GAME_RECORD_CONTRIBUTION_OPERATIONS.md`](GAME_RECORD_CONTRIBUTION_OPERATIONS.md)へ日付付きで記録する。

## 2. 目的

提供棋譜は、主に次の用途の補助データとして扱う。

- 公開AIが実戦で到達する局面分布の把握
- 人間対AIで発生した弱点候補局面の抽出
- 次期AI候補を過去の実戦局面で比較するためのcorpus
- 回帰検証候補の作成

提供棋譜は、実際の人間による自然な対局であることまで暗号学的に証明するものではない。Turnstile・schema検証・engine replayを通過しても、`anonymous / unverified contribution`として扱う。人間の着手を正解手とみなして自動学習へ無条件投入したり、公開AI世代の正式採用判断を提供棋譜だけで行ったりしない。

## 3. 利用者から見た流れ

対象は完成した**コンピュータ対戦だけ**とする。ローカル2人対戦は初期版では対象外とする。

終局後、既存の「棋譜を保存」に加えて、収集機能が有効な配信版だけ「AI改善のため棋譜を送信」を表示する。送信ボタンを押しても直ちには送信せず、確認dialogで目的、送る情報、送らない情報、Cloudflareによる通信処理、Privacy Policyへのリンクを表示する。Turnstile検証が完了し、利用者が「同意して送信」を押した場合だけPOSTする。

同意は1局単位であり、自動送信、一括同意、バックグラウンド送信、失敗時の自動queue・再送、localStorageへの送信用棋譜蓄積は行わない。

## 4. 送信内容

R2に保存するrecord bodyは、検証済みの`bao-game-record` JSONだけとする。含まれる主要情報はルール基準、対局モード、人間側、AI難易度、AI generation / release ID、初期局面、確定着手列、勝敗・終了理由、最終局面である。作業ブランチのv2にはtakasiaとAIの`ruleRevision`・`aiRevision`を保持する。v1はR-002、v2はv0.2.0のtakasia対応版として、別エンジンで標準初期局面・canonical move・全着手を検証する。

収集のために氏名、メールアドレス、自由記述、恒久的なuser ID、Google Analytics client ID、AI探索統計、User-Agentを含む端末fingerprint、送信元IPアドレス、Turnstile tokenを追加しない。

送信元IPアドレスは短時間のabuse防止rate-limit keyとTurnstile Siteverifyの`remoteip`としてWorker実行中に利用するが、R2 record object body・object key・custom metadataへ書き込まない。

## 5. システム構成

1. 完成したコンピューター対局について、利用者がその1局の送信に明示同意する。
2. Cloudflare Turnstileを完了し、`POST https://bao-data.cultivationdata.net/v1/game-records`へ送信する。
3. Workerは収集のkill switch、Origin・Fetch Metadata・method・Content-Type、requestサイズ、接続元・location単位のbest-effort制限、Turnstileを確認する。
4. 許可項目、形式・ルール版、標準初期局面、canonical手、全手再生、最終局面・結果を照合する。
5. SHA-256による重複排除とR2 conditional writeの日次quotaを通し、private R2 Standard bucketへ保存する。

## 6. 秘密情報管理

公開リポジトリへ`TURNSTILE_SECRET_KEY`、Cloudflare API token、その他の認証credentialをcommitしない。Turnstile site key、Worker URL、API path、R2 binding名、bucket名は公開情報として扱い、秘密であることに依存して保護しない。

## 7. 上限

| 項目 | 初期上限 |
| --- | ---: |
| HTTP request body | 64 KiB |
| 保存棋譜JSON | 48 KiB |
| 棋譜長 | 384 ply |
| 同一接続元のWorker内rate limit | 3 requests / 60 s（best-effort） |
| 同一Cloudflare locationの受理安全弁 | 6 records / 60 s（best-effort） |
| 全世界共通の正常受理 | **500 records / UTC day** |
| コードが許す日次上限の最大値 | 1,000 records / UTC day |
| raw R2 object retention | **90日** |

Workers Rate Limiting APIは厳密なaccountingには使用せず、private R2の日次quotaをhard stopとする。

<a id="8-worker-validation"></a>

## 8. 受信Workerの検証

Workerはbrowserから送られた内容を信頼しない。computer対戦のみを受け付け、strict allowlist、ルールbaseline、石総数、標準初期局面、canonical move、engine replay、最終局面・結果を検証する。replay検証は外さず、CPU上限へ近づく場合は`MAX_PLIES`を引き下げる。

## 9. Origin・Fetch Metadata・Turnstile

exact Origin allow-listを第一の境界とする。Fetch Metadata gateは、許可Originからの状態変更POSTに追加適用する。したがって未許可Originは`origin_not_allowed`で拒否され、許可OriginでもFetch Metadataが不正なら`fetch_metadata_rejected`で拒否される。

本番 `bao-la-kiswahili.cultivationdata.net` から `bao-data.cultivationdata.net` への送信はsame-siteとして扱う。テストサイト `cdn-ts.pages.dev` は完全一致した管理下Originだけをcross-site例外とする。

Turnstileはserver-side Siteverifyを行い、`success`、`action = game_record_contribution`、許可hostnameを照合する。

## 10. 重複排除・R2

棋譜JSONを正規化してSHA-256を計算し、v1は`records/v1/<sha256>.json`、v2は`records/v2/<sha256>.json`へ保存する。既存v1 keyは移動しない。同一keyが存在する場合は新規record writeも日次quota消費も行わず、利用者には受信済みとして成功応答を返す。版をまたいでも同じ日次quotaを使い、上限を形式ごとに増やさない。

日次quotaは`control/daily/YYYY-MM-DD.json`に`day`と`accepted`だけを保持する。R2 record custom metadataはformat/version、ruleRevision/guideVersion、利用可能なaiRevision、AI generation、difficulty、winner side、plies、validation levelに限定する。bucket全体へ90日expiration lifecycleを設定する。

## 11. 導入・検証段階

### Stage A — リポジトリ側の隔離実装
完了。

### Stage B — Cloudflare実環境のfail-closed確認
完了。

<a id="stage-c--controlled-test-site-verification"></a>

### Stage C — 管理下テストサイトでの検証
完了。正常受理、R2保存、privacy boundary、duplicate、malformed request、CPU / resource error、スマートフォン実機を確認した。

<a id="stage-d--production-custom-domain-verification"></a>

### Stage D — 本番Custom Domainでの検証
完了。

2026-09-16に `bao-data.cultivationdata.net` をWorker Custom Domainとして追加し、次を確認した。

- production same-site request → `503 collection_disabled`
- controlled test cross-site exception → `503 collection_disabled`
- disallowed third-party Origin → `403 origin_not_allowed`
- client configが `https://bao-data.cultivationdata.net/v1/game-records` を使用
- Custom Domain経由の新規棋譜1件を正常受理
- R2 record数と日次quotaがそれぞれ1だけ増加
- CPU / resource、Turnstile、保存内容に異常なし
- `COLLECTION_ENABLED=false`へ復帰
- `workers_dev:false`、`preview_urls:false` を設定
- `routes` に `bao-data.cultivationdata.net` を `custom_domain:true` で明示
- 最終Wrangler deployでCustom Domainがdeploy targetとして表示された

### Stage E — main統合・本番配信

完了。

- PR #144を`main`へ統合
- merge commit `da54b03dd5d8eee345b4b1d08344cb326303aab8`
- `main`の`public/`を本番サイトへ配信
- Cloudflare本番環境で`COLLECTION_ENABLED=true`へ切り替え

### Stage F — production E2E / 運用開始

完了。

本番公開サイト上でコンピュータ対戦を完了し、1局単位の明示同意による任意送信を実行した。Turnstile、Custom Domain API、Worker validation、R2保存、日次quota、Workers Metrics / Observabilityを確認し、正常であった。

この確認をもって、本機能は2026-09-16に本番運用開始済みとする。以後の停止・再開、endpoint、quota、retention、validation、privacy、障害等の重要な運用変更は[`GAME_RECORD_CONTRIBUTION_OPERATIONS.md`](GAME_RECORD_CONTRIBUTION_OPERATIONS.md)へ追記する。

