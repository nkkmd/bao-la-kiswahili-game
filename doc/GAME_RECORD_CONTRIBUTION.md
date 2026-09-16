# 任意の棋譜提供機能 — AI改善用収集設計

更新日: 2026-09-16  
対象棋譜形式: `bao-game-record` version `1`  
実装ブランチ: `feat/game-record-contribution-20260916`

## 1. 状態

本機能は、コンピュータ対戦終了後に利用者が**その1局について明示的に同意した場合だけ**、完成棋譜をBao AIの評価・改善用途へ提供できるようにするものである。

2026-09-16時点で、private R2、90日lifecycle、Turnstile、Workers Free上の収集Workerを実Cloudflare環境へ構築し、`cdn-ts.pages.dev` から最初の1局のcontrolled real submissionまで成功した。

実送信後に次を確認した。

- `COLLECTION_ENABLED=false` 復帰後、APIが再び `503 collection_disabled` でfail closedになること
- `control/daily/2026-09-16.json` が `accepted: 1` であること
- `records/v1/` に新規record objectが1件だけ保存されたこと
- 保存recordにTurnstile token、consent envelope、送信元IP、User-Agent、fingerprint、氏名、メール等の不要情報が含まれないこと

`main`への統合および本番収集開始はまだ行わない。duplicate、CPU、rate-limit、quota等の実Cloudflare確認とスマートフォン実機確認を完了した後に別途判断する。

## 2. 目的

提供棋譜は、主に次の用途の補助データとして扱う。

- 公開AIが実戦で到達する局面分布の把握
- 人間対AIで発生した弱点候補局面の抽出
- 次期AI候補を過去の実戦局面で比較するためのcorpus
- 回帰検証候補の作成

提供棋譜は、実際の人間による自然な対局であることまで暗号学的に証明するものではない。Turnstile・schema検証・engine replayを通過しても、`anonymous / unverified contribution`として扱う。人間の着手を正解手とみなして自動学習へ無条件投入したり、公開AI世代の正式採用判断を提供棋譜だけで行ったりしない。

## 3. 利用者から見た流れ

対象は完成した**コンピュータ対戦だけ**とする。ローカル2人対戦は、もう一人の参加者の同意問題を避けるため初期版では対象外とする。

終局後、既存の

```text
棋譜を保存
```

に加えて、収集機能が有効な配信版だけ次を表示する。

```text
AI改善のため棋譜を送信
```

送信ボタンを押しても直ちには送信しない。確認dialogで目的、送る情報、送らない情報、Cloudflareによる通信処理、Privacy Policyへのリンクを表示する。Turnstile検証が完了し、利用者が「同意して送信」を押した場合だけPOSTする。

同意は1局単位であり、次のことを行わない。

- 自動送信
- 将来の対局を含む一括同意
- バックグラウンド送信
- 失敗時の自動queue・再送
- localStorageへの送信用棋譜蓄積

収集APIが停止中・上限到達・ネットワークエラーの場合でも、通常対局と「棋譜を保存」は独立して利用できる。

## 4. 送信内容

R2に保存するrecord bodyは、検証済みの既存`bao-game-record` v1 JSONだけとする。保存前にobject key順を正規化するが、意味上のfieldは変更しない。

含まれる主要情報:

- ルール基準
- 対局モード
- 人間側
- AI難易度
- AI generation / release ID
- 利用可能な場合の採用ID・評価器識別
- 初期局面
- 確定着手列
- 勝敗・終了理由
- 最終局面

収集のために追加しない情報:

- 氏名
- メールアドレス
- 自由記述
- 恒久的なuser ID
- Google Analytics client ID
- AI探索統計
- User-Agentを含む端末fingerprint
- 送信元IPアドレス
- Turnstile token

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
POST /v1/game-records
        |
        v
Cloudflare Worker
  - server-side collection kill switch
  - origin / method / content-type
  - request size
  - per-client / location abuse limits
  - Turnstile server validation
  - strict schema allowlist
  - rules/version check
  - 64-kete invariant
  - standard initial-position check
  - canonical move-variant check
  - engine replay
  - final-position/result match
  - SHA-256 deduplication
  - R2 conditional-write daily quota
        |
        v
private R2 Standard bucket
  records/v1/<sha256>.json
  control/daily/YYYY-MM-DD.json
```

Worker実装は`cloudflare/game-record-ingest/`に独立配置し、公開ゲームのAI探索・ルール処理・画面処理へ収集処理を混在させない。

## 6. 公開リポジトリでの秘密情報管理

Workerコード、API path、R2 binding名、bucket名、Turnstile site keyは公開情報として扱う。これらを秘密であることに依存して保護しない。

公開リポジトリへcommitしないもの:

- `TURNSTILE_SECRET_KEY`
- Cloudflare API token
- その他の認証credential

`TURNSTILE_SECRET_KEY`は`wrangler secret put`等でCloudflare側のsecretとして設定する。R2 bucketはPublic Accessを有効化しない。

## 7. 無料枠を意識したapplication-side上限

2026-09-16時点のCloudflare公開仕様では、Workers Freeは100,000 requests/day・10 ms CPU/request、R2 Standard Freeは月あたり10 GB-month、Class A 100万回、Class B 1,000万回が無料枠である。これに十分な余裕を持たせる。

| 項目 | 初期上限 |
| --- | ---: |
| HTTP request body | 64 KiB |
| 保存棋譜JSON | 48 KiB |
| 棋譜長 | 384 ply |
| 同一接続元のWorker内rate limit | 3 requests / 60 s |
| 同一Cloudflare locationの受理安全弁 | 6 records / 60 s |
| 全世界共通の正常受理 | **500 records / UTC day** |
| コードが許す日次上限の最大値 | 1,000 records / UTC day |
| raw R2 object retention | **90日を本番有効化条件とする** |

Workers Rate Limiting APIはCloudflare location単位・eventually consistentであり、厳密な全世界共通カウンターではない。したがって課金防止の主たる上限には使用しない。

全世界共通の日次受理上限は、private R2 bucket内の`control/daily/YYYY-MM-DD.json`に集計値だけを置き、R2 conditional `PUT`のETag / `If-None-Match`を利用して更新する。競合時は有限回だけ再試行し、quota stateを安全に確定できなければfail closedで新規棋譜を保存しない。

既定500件/日、48 KiB/件、90日保持をすべて上限まで使ってもraw record payloadは概算約2.2 GBである。新規1件につきrecord writeとquota updateで最大2回のClass A operationを使うため、30日で概ね3万Class A operationsとなり、R2 Standard Freeの100万回/月より十分小さい。

Workers Freeの100,000 requests/dayがすべてOrigin・Turnstile・schemaを通過する極端な場合でも、record duplicate `HEAD`とquota `GET`を各1回行う程度なので、30日換算で概ね600万Class B operationsとなり、R2 Standard Freeの1,000万回/月を下回る。通常はそれ以前の拒否でさらに少なくなる。

この計算は本収集Worker/R2 bucketだけを対象とする。同一Cloudflare accountで他のWorkers/R2利用がある場合は合算して監視する。本番custom domainでは利用可能なzone-level WAF rate limitingも`/v1/game-records`へ追加し、Worker実行前にも大量通信を抑える。

無料枠の仕様が将来変更される可能性があるため、本番開始前と定期運用時にCloudflareの最新limits/pricingを再確認する。

## 8. Worker側validation

Workerはbrowserから送られた内容を信頼しない。

### 8.1 envelope

許可するtop-level field:

```text
record
turnstileToken
consent
```

`consent`はversionとpurposeのみを許可し、現在は`purpose = ai-improvement`とする。

### 8.2 record

`bao-game-record` v1で定義したfield以外を拒否する。特に任意の`comment`、端末情報、識別子等を追加して送信できないようallowlist方式にする。

computer対戦のみを受け付け、ルールbaselineを照合する。局面配列、値範囲、石総数64、着手field、結果等を検証する。さらに、公開ゲームの`engine.initialState()`と完全一致する標準初期局面から始まる棋譜だけを受理し、任意局面から生成した「合法そうに見える棋譜」を除外する。

### 8.3 replay

公開ゲームと同じ`public/engine.js`をWorker bundleから使用する。

各plyでは、棋譜の`turn`・`player`・`phase`が再生局面と一致することを確認する。さらに`moveVariantsForSearch`が返すcanonical move variantと、`type / phase / row / index / direction / side / houseChoice / houseTwo`の存在・値を含め完全一致する手だけを許可する。その後`applyMoveForSearch`で着手を進める。最後に再生結果と`finalPosition`を完全照合する。

Workers FreeのCPU上限内で十分に処理できるかは実Workerで計測する。長大な合法棋譜でCPU上限へ近づく場合は、無料枠を守ることを優先して`MAX_PLIES`を引き下げる。replay検証を外して受理件数を増やすことは初期方針としない。

## 9. Turnstileとrate limit

Turnstileはbot・自動大量投稿に対する追加防御として使用する。browser側の成功callbackだけを信用せず、WorkerからSiteverifyへtokenを送ってserver-side validationする。

追加で次を照合する。

- `success`
- `action = game_record_contribution`
- 許可hostname

同一接続元rate limitはabuse緩和用であり、利用者識別には使わない。携帯回線やproxyではIP共有があり得るため、この制限は過度に厳しくしない。

正常検証後のlocation-scoped limiterもburst緩和用であり、課金上限とはみなさない。課金防止上限はR2 conditional writeによる日次quotaで行う。

## 10. 重複排除・日次quota・R2

保存前に棋譜objectのkey順を再帰的に正規化し、そのJSONからSHA-256を計算する。次をrecord object keyとする。

```text
records/v1/<sha256>.json
```

同一keyが存在する場合は新規record writeも日次quota消費も行わず、利用者には受信済みとして成功応答を返す。

日次quotaは次のcontrol objectを使う。

```text
control/daily/YYYY-MM-DD.json
```

内容は`day`と`accepted`だけであり、IP、棋譜hash、利用者識別情報は持たない。条件付き書込みの競合が解決できない場合は安全側に倒して受理を停止する。

R2 record custom metadataは分析入口として必要な最小限に限定する。

- format / version
- AI generation
- difficulty
- winner side
- plies
- validation level

bucket全体へ90日expiration lifecycleを設定し、raw recordと古いquota control objectを自動削除する。本番収集を有効化する前にR2 DashboardまたはWranglerでruleが実際に設定されたことを確認する。

## 11. 導入手順

### Stage A — リポジトリ側の隔離実装

- 専用branch
- browser contribution client
- fail-closed public config
- fail-closed Worker kill switch
- Worker
- private R2 binding
- Turnstile server-side validation
- strict schema / replay / dedupe / quota
- 自動テスト
- Draft PR

### Stage B — Cloudflare実環境のfail-closed確認

2026-09-16に次を完了した。

- private R2 Standard bucket作成
- bucket全体へ90日expiration lifecycle設定
- Turnstile Managed widget作成
- Worker secret `TURNSTILE_SECRET_KEY` 登録
- Workers FreeへWorker deploy
- Fetch Metadata `cross-site` 拒否を実環境確認
- `COLLECTION_ENABLED=false` による `503 collection_disabled` を実環境確認

### Stage C — controlled test

2026-09-16に最初の1局を `cdn-ts.pages.dev` から送信し、次を確認した。

- contribution UI / explicit consent / Turnstileが正常動作
- Workerで正常受理
- R2 record 1件保存
- daily quota `accepted: 1`
- 保存recordへのIP・Turnstile token等の混入なし
- test終了後にkill switchを再びOFF

残る主な確認:

- duplicate送信でrecord数とquotaが増えないこと
- 実Worker CPUの余裕
- rate limit / malformed / quota周辺の実環境spot check
- スマートフォン実機確認

これらを完了するまでは、PR #144をDraftのまま維持し、`main`へ統合しない。
