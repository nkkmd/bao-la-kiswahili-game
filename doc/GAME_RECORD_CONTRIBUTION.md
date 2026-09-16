# 任意の棋譜提供機能 — AI改善用収集設計

更新日: 2026-09-16  
対象棋譜形式: `bao-game-record` version `1`  
実装ブランチ: `feat/game-record-contribution-20260916`

## 1. 状態

本機能は、コンピュータ対戦終了後に利用者が**その1局について明示的に同意した場合だけ**、完成棋譜をBao AIの評価・改善用途へ提供できるようにするものである。

2026-09-16時点で、private R2、90日lifecycle、Turnstile、Workers Free上の収集Workerを実Cloudflare環境へ構築し、`cdn-ts.pages.dev` からのcontrolled real submissionとスマートフォン実機送信まで成功した。さらにWorkerへ本番用custom domain `bao-data.cultivationdata.net` を追加し、kill switchを維持したまま到達性とOrigin境界を確認した。

実Cloudflare環境で次を確認済みである。

- `COLLECTION_ENABLED=false` 時にAPIが `503 collection_disabled` でfail closedになる
- R2へ新規record objectが保存される
- 保存recordにTurnstile token、consent envelope、送信元IP、User-Agent、fingerprint、氏名、メール等の不要情報が含まれない
- 同一棋譜はduplicateとして成功応答され、record objectを増やさない
- Workers Metrics / Observabilityで明確なCPU上限超過、Exceeded Resources、異常を認めない
- malformed requestは `400 invalid_request` で拒否される
- Workers Rate Limiting APIはbest-effortのburst緩和として扱い、hard accountingには使用しない
- スマートフォン実機で通常対局、終局、棋譜保存、任意送信UI、Turnstile、実送信、R2保存が正常に動作する
- `https://bao-data.cultivationdata.net/v1/game-records` へ本番Origin相当のsame-site POSTを送るとkill switchで503になる
- 管理下テストOrigin `https://cdn-ts.pages.dev` のcross-site POSTも明示例外を通過してkill switchで503になる
- 未許可Origin `https://example.com` はexact Origin allow-listで `403 origin_not_allowed` となる

`main`への統合および本番収集開始はまだ行わない。custom domainを使ったcontrolled submissionと最終CI・文書整合性確認を完了した後に別途判断する。

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

R2に保存するrecord bodyは、検証済みの既存`bao-game-record` v1 JSONだけとする。含まれる主要情報はルール基準、対局モード、人間側、AI難易度、AI generation / release ID、初期局面、確定着手列、勝敗・終了理由、最終局面である。

収集のために氏名、メールアドレス、自由記述、恒久的なuser ID、Google Analytics client ID、AI探索統計、User-Agentを含む端末fingerprint、送信元IPアドレス、Turnstile tokenを追加しない。

送信元IPアドレスは短時間のabuse防止rate-limit keyとTurnstile Siteverifyの`remoteip`としてWorker実行中に利用するが、R2 record object body・object key・custom metadataへ書き込まない。

## 5. システム構成

```text
completed computer game
        |
        v
explicit per-game consent
        |
        v
Cloudflare Turnstile
        |
        v
POST https://bao-data.cultivationdata.net/v1/game-records
        |
        v
Cloudflare Worker
  - server-side collection kill switch
  - exact origin / fetch metadata / method / content-type
  - request size
  - per-client / location best-effort abuse limits
  - Turnstile server validation
  - strict schema allowlist
  - rules/version check
  - standard initial-position check
  - canonical move-variant check
  - engine replay
  - final-position/result match
  - SHA-256 deduplication
  - R2 conditional-write daily quota
        |
        v
private R2 Standard bucket
```

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

## 8. Worker validation

Workerはbrowserから送られた内容を信頼しない。computer対戦のみを受け付け、strict allowlist、ルールbaseline、石総数、標準初期局面、canonical move、engine replay、最終局面・結果を検証する。replay検証は外さず、CPU上限へ近づく場合は`MAX_PLIES`を引き下げる。

## 9. Origin・Fetch Metadata・Turnstile

exact Origin allow-listを第一の境界とする。Fetch Metadata gateは、許可Originからの状態変更POSTに追加適用する。したがって未許可Originは`origin_not_allowed`で拒否され、許可OriginでもFetch Metadataが不正なら`fetch_metadata_rejected`で拒否される。

本番 `bao-la-kiswahili.cultivationdata.net` から `bao-data.cultivationdata.net` への送信はsame-siteとして扱う。テストサイト `cdn-ts.pages.dev` は完全一致した管理下Originだけをcross-site例外とする。

Turnstileはserver-side Siteverifyを行い、`success`、`action = game_record_contribution`、許可hostnameを照合する。

## 10. 重複排除・R2

棋譜JSONを正規化してSHA-256を計算し、`records/v1/<sha256>.json`へ保存する。同一keyが存在する場合は新規record writeも日次quota消費も行わず、利用者には受信済みとして成功応答を返す。

日次quotaは`control/daily/YYYY-MM-DD.json`に`day`と`accepted`だけを保持する。R2 record custom metadataはformat/version、AI generation、difficulty、winner side、plies、validation levelに限定する。bucket全体へ90日expiration lifecycleを設定する。

## 11. 導入・検証段階

### Stage A — リポジトリ側の隔離実装
完了。

### Stage B — Cloudflare実環境のfail-closed確認
完了。

### Stage C — controlled test site verification
完了。正常受理、R2保存、privacy boundary、duplicate、malformed request、CPU / resource error、スマートフォン実機を確認した。

### Stage D — production custom-domain preflight

2026-09-16に `bao-data.cultivationdata.net` をWorker Custom Domainとして追加した。kill switchをOFFのまま次を確認済み。

- production same-site request → `503 collection_disabled`
- controlled test cross-site exception → `503 collection_disabled`
- disallowed third-party Origin → `403 origin_not_allowed`

client configはcustom domain endpointへ切替済み。Service Worker cacheを更新し、古いworkers.dev endpointが端末キャッシュに残らないようにした。

残る工程:

1. custom-domain endpoint切替後のCIを完了
2. `cdn-ts.pages.dev` を最新`public/`で再deploy
3. `COLLECTION_ENABLED=true` の短いwindowでcustom domain経由の新規棋譜1件を送信
4. R2 / quota / CPU / Turnstile / duplicateをspot check
5. `COLLECTION_ENABLED=false`へ復帰
6. 最終文書・CI・差分確認
7. 明示的な許可後にのみ`main`へ統合
