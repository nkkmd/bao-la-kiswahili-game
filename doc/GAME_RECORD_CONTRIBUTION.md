# 任意の棋譜提供機能 — AI改善用収集設計

更新日: 2026-09-16  
対象棋譜形式: `bao-game-record` version `1`  
実装ブランチ: `feat/game-record-contribution-20260916`

## 1. 状態

本機能は、コンピュータ対戦終了後に利用者が**その1局について明示的に同意した場合だけ**、完成棋譜をBao AIの評価・改善用途へ提供できるようにするものである。

2026-09-16時点ではコードと自動検証を専用ブランチで整備中であり、Cloudflare Worker・R2・Turnstileの実リソースはまだ本番接続しない。`public/game-record-contribution-config.js` は `enabled: false` を既定とし、必要なCloudflare側設定と実送信試験が完了するまでは公開画面に送信操作を表示しない。

`main`への統合および本番での収集開始は、Cloudflare側の安全設定、テスト環境での送受信、実機確認を完了した後に別途判断する。

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

R2に保存するbodyは、検証済みの既存`bao-game-record` v1 JSONそのものだけとする。

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

送信元IPアドレスは短時間のabuse防止rate-limit keyとしてWorker実行中に利用するが、R2 object body・object key・custom metadataへ書き込まない。

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
  - origin / method / content-type
  - request size
  - rate limit
  - Turnstile server validation
  - strict schema allowlist
  - rules/version check
  - 64-kete invariant
  - engine replay
  - final-position/result match
  - SHA-256 deduplication
        |
        v
private R2 Standard bucket
records/v1/<sha256>.json
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

2026-09-16時点のCloudflare Free / R2 Standard Freeを前提として、サービス側の上限より十分小さい値をWorkerに設定する。

| 項目 | 初期上限 |
| --- | ---: |
| HTTP request body | 64 KiB |
| 保存棋譜JSON | 48 KiB |
| 棋譜長 | 384 ply |
| 同一接続元のWorker内rate limit | 3 requests / 60 s |
| 全体の正常受理 | 1 record / 60 s |
| raw R2 object retention | 90日を推奨 |

理論上、正常受理が1分に1件で30日連続した場合は約43,200 writes/月となる。各objectが最大48 KiBの場合、90日分のpayload上限概算は約6.37 GBである。通常の棋譜は最大値より小さいことが期待されるが、この計算だけを課金防止保証には使わない。

Worker内Rate Limiting APIはCloudflare拠点単位・eventually consistentな安全弁であり、厳密な請求カウンターではない。またWorkerに到達した不正request自体もWorkers request quotaを消費する。したがって本番custom domainでは、利用可能なCloudflare zone-level WAF rate limiting ruleを`/v1/game-records`へ追加し、Worker実行前にも大量通信を抑える。

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

computer対戦のみを受け付け、ルールbaselineを照合する。局面配列、値範囲、石総数64、着手field、結果等を検証する。

### 8.3 replay

公開ゲームと同じ`public/engine.js`をWorker bundleから使用し、初期局面から全確定着手を`applyMoveForSearch`で再生する。

各plyでは、棋譜の`turn`・`player`・`phase`が再生局面と一致することを確認し、違法手を拒否する。最後に再生結果と`finalPosition`を完全照合する。

Workers FreeのCPU上限内で十分に処理できるかは実Workerで計測する。長大な合法棋譜でCPU上限へ近づく場合は、無料枠を守ることを優先して`MAX_PLIES`を引き下げる。replay検証を外して受理件数を増やすことは初期方針としない。

## 9. Turnstileとrate limit

Turnstileはbot・自動大量投稿に対する追加防御として使用する。browser側の成功callbackだけを信用せず、WorkerからSiteverifyへtokenを送ってserver-side validationする。

追加で次を照合する。

- `success`
- `action = game_record_contribution`
- 許可hostname

同一接続元rate limitはabuse緩和用であり、利用者識別には使わない。携帯回線やproxyではIP共有があり得るため、この制限は過度に厳しくしない。一方、正常検証後のglobal accept limiterでR2 write量にも上限を設ける。

## 10. 重複排除とR2

保存直前の棋譜JSONからSHA-256を計算し、次をobject keyとする。

```text
records/v1/<sha256>.json
```

同一keyが存在する場合は新規writeせず、利用者には受信済みとして成功応答を返す。

R2 custom metadataは分析入口として必要な最小限に限定する。

- format / version
- AI generation
- difficulty
- winner side
- plies
- validation level

raw recordには90日expiration lifecycleを設定する方針とする。本番開始前にR2 DashboardまたはWranglerで実際にruleが設定されたことを確認する。

## 11. 導入手順

### Stage A — リポジトリ側の隔離実装

- 専用branch
- browser contribution client
- fail-closed public config
- Worker
- strict validation / replay / dedup / rate limit
- Privacy Policy
- 自動テスト

この段階では外部送信を有効化しない。

### Stage B — Cloudflare resource provisioning

- private R2 Standard bucket作成
- 90日lifecycle設定
- Turnstile widget作成
- Worker secret登録
- Worker deploy
- zone-level WAF rate limit設定

### Stage C — test site接続

- public configへtest endpointとTurnstile site keyを設定
- test siteだけ収集を有効化
- 正常送信
- duplicate
- malformed request
- rate limit
- R2 object内容
- 90日lifecycle
- Worker CPU
- offline / submission failure isolation

を確認する。

### Stage D — 実機確認

スマートフォン実機で、対局→終局→同意dialog→Turnstile→送信→成功表示まで確認する。同時に「棋譜を保存」や新規対局が従来どおり動くことを確認する。

### Stage E — main / production

実機確認後にのみmain統合候補とする。本番endpoint・hostname・Privacy Policy・Cloudflare resource状態を最終確認して配信し、本番から1件の検証送信を行う。

## 12. rollback

収集機能に問題があった場合、ゲーム本体をrollbackせずとも`public/game-record-contribution-config.js`の`enabled`をfalseにすることでUIから送信操作を停止できる。

Cloudflare側でもWorker route/custom domainまたはR2 bindingを停止できる。収集停止時もローカル棋譜保存、AI対戦、2人対戦、AI改善用診断は独立して維持する。
