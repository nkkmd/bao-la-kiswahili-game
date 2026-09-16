# Game Record Contribution Worker

Bao la Kiswahili の終局棋譜を、利用者の明示同意後に受け付ける Cloudflare Worker です。
公開ゲーム本体とは独立させ、R2 bucket は private のまま Worker binding からのみ書き込みます。

## 安全上の境界

- `POST /v1/game-records` と CORS preflight だけを受け付ける。
- `COLLECTION_ENABLED=true` を明示するまで server-side でも fail closed とする。
- 許可 Origin は `ALLOWED_ORIGINS` の完全一致で制限する。
- Worker の最外周 `src/entry.mjs` で Fetch Metadata を検証し、通常の browser POST は `Sec-Fetch-Site: same-origin|same-site`、`Sec-Fetch-Mode: cors`、`Sec-Fetch-Dest: empty` を要求する。
- Fetch Metadata が欠落したPOST、`cross-site`、`navigate`、`no-cors`、画像等の用途は原則拒否する。
- `cdn-ts.pages.dev` はテストサイトが本番Workerと別siteになるため、`FETCH_METADATA_CROSS_SITE_ORIGINS` に完全一致で明示した場合だけ `cross-site` を許可する。任意のcross-site Originは許可しない。
- Turnstile token を server-side で検証し、action と hostname も照合する。
- `bao-game-record` version 1、ルール baseline、computer 対戦、許可 field、型、石総数、最大手数を検証する。
- 公開ゲームの標準初期局面と完全一致する棋譜だけを受け付ける。
- `houseChoice` を含む canonical move variant を各 ply で照合してから、公開 engine の `applyMoveForSearch` で全着手を replay し、最終局面と結果を照合する。
- 氏名、自由記述、永続 user ID、端末 fingerprint、AI探索統計などの任意 field は受け付けない。
- `CF-Connecting-IP` は短時間の per-client rate-limit key と Turnstile Siteverify の `remoteip` にだけ使用し、R2 record object や metadata へ保存しない。
- Turnstile token、同意 marker も R2 record object へ保存しない。
- key 順を正規化した棋譜 JSON の SHA-256 を object key にし、同一棋譜を重複保存しない。
- R2 は Standard storage を使用し、public access を有効化しない。

### Fetch Metadata の位置付け

Fetch Metadata は、ブラウザが request context を `Sec-Fetch-Site` / `Sec-Fetch-Mode` / `Sec-Fetch-Dest` 等で伝える仕組みである。これらの `Sec-` prefixed header は通常のWebページのJavaScriptから設定・変更できないため、公開リポジトリを複製した第三者サイトからの通常ブラウザ送信を追加で識別できる。

ただし、独自HTTP clientは同様のheader値を送信できるため、Fetch Metadataだけを認証として扱わない。防御は次の多層構成とする。

```text
exact Origin allow-list
        ↓
Fetch Metadata isolation
        ↓
Turnstile server-side verification
        ↓
schema / standard initial position / canonical move / replay
        ↓
rate limits / R2 daily hard quota
        ↓
private R2
```

本番 `bao-la-kiswahili.cultivationdata.net` から `bao-data.cultivationdata.net` への送信は同一scheme・同一registrable domain配下なので通常 `same-site` になる。テスト用 `cdn-ts.pages.dev` は別siteのため、完全一致した管理下Originだけを `FETCH_METADATA_CROSS_SITE_ORIGINS` へ例外登録する。

## 無料枠を守るための既定上限

2026-09-16 時点の Cloudflare 公開仕様では、Workers Free は 100,000 requests/day・10 ms CPU/request、R2 Standard は月あたり 10 GB-month、Class A 100万回、Class B 1,000万回まで無料枠がある。これより十分小さい application-side guard を設定する。

- request body: 最大 64 KiB
- 保存する棋譜 JSON: 最大 48 KiB
- 最大 384 ply
- 同一接続元: 3 requests / 60 s
- 同一 Cloudflare location の正常受理安全弁: 6 records / 60 s
- **全世界共通の日次受理上限: 既定 500 records / UTC day**
- コード上の日次上限の最大値: 1,000 records / UTC day
- Worker CPU time: 10 ms
- Worker subrequests: 10
- R2 raw record retention: 90日を必須運用条件とする

Workers Rate Limiting API は Cloudflare location 単位かつ eventually consistent であり、厳密な全世界共通カウンターではない。このため課金防止上限には使用しない。

全世界共通の日次上限は、同じ private R2 bucket の `control/daily/YYYY-MM-DD.json` に accepted count を保持し、R2 conditional `PUT` の ETag / `If-None-Match` を使って競合時に再試行する。quota state を取得・更新できない場合は fail closed で受理しない。

既定 500件/日、48 KiB/件、90日retentionをすべて最大まで使った場合でも raw record payload は概算約2.2 GBである。1件の新規受理につき record write と quota update の最大2回の Class A operation を使うため、30日で概ね3万 Class A operationsが上限となり、R2 Standard Free の100万回/月を大きく下回る。

Worker Free の100,000 requests/dayがすべてTurnstile・schemaを通過する極端なケースでも、record duplicate `HEAD` と quota `GET` の2回を行う程度なので、30日換算で約600万 Class B operationsに収まり、R2 Standard Free の1,000万回/月より低い。実際にはOrigin、Fetch Metadata、per-client limit、Turnstile、validationでそれ以前に多くを拒否する。

ただし、上記はこの収集Worker/R2 bucketの設計上の上限であり、同じCloudflare accountで他のWorkers/R2利用がある場合、その利用量は別途合算して監視する。本番ではzone-level WAF rate limitingも併用し、Worker実行前にも大量通信を抑える。

## Cloudflare 側で必要な作業

実リソースを作るまでは、`public/game-record-contribution-config.js` の `enabled` と `wrangler.jsonc` の `COLLECTION_ENABLED` を両方 `false` のままにする。

1. R2 Standard bucket `bao-game-record-contributions` を作成し、Public Access は無効のままにする。
2. bucket全体を90日後に削除する lifecycle rule を設定する。`records/`だけでなく古い `control/daily/` quota objectも削除してよい。
3. Turnstile Managed widget を作成し、公開サイトとテストサイトの hostname を登録する。
4. Worker directory で `TURNSTILE_SECRET_KEY` を secret として登録する。
5. `wrangler.jsonc` の Origin / Fetch Metadata cross-site exception / hostname / R2 binding / application limits を確認する。
6. Worker をまず `workers.dev` へ deploy する。初回deploy時は `COLLECTION_ENABLED=false` のまま動作確認する。
7. test site接続時だけ、Worker側 `COLLECTION_ENABLED=true` と client側 `enabled=true` を有効化する。
8. 正常送信、Fetch Metadata拒否、重複、日次quota、malformed request、R2保存内容、90日lifecycle、Worker CPUを確認する。
9. 問題なければ `bao-data.cultivationdata.net` 等の custom domain を Worker に設定する。
10. zone-level rate limiting rule を `/v1/game-records` に追加する。

例:

```sh
npx wrangler r2 bucket create bao-game-record-contributions --storage-class Standard
npx wrangler r2 bucket lifecycle add bao-game-record-contributions expire-contributions --expire-days 90
cd cloudflare/game-record-ingest
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler deploy
```

`TURNSTILE_SECRET_KEY`、Cloudflare API token、その他の認証情報は GitHub に commit しない。

## R2 objects

検証済み棋譜:

```text
records/v1/<sha256>.json
```

body は検証済みの `bao-game-record` v1 そのものだけで、Turnstile token・IP・同意UIの一時情報は含めない。R2 custom metadata は次に限定する。

- format / version
- AI generation
- difficulty
- winner side
- plies
- validation level

日次quota control object:

```text
control/daily/YYYY-MM-DD.json
```

これは `{ day, accepted }` の集計値だけを持ち、利用者識別子・IP・棋譜hashは保存しない。

## 運用上の位置付け

提供棋譜は Origin・Fetch Metadata・Turnstile・schema・標準初期局面・canonical move・engine replay を通すが、「実在する人が自然にプレイしたこと」までは証明しない。したがって `anonymous/unverified contribution` として扱い、自動学習へ直接投入しない。弱点候補抽出、実戦局面 corpus、回帰検証候補などに利用し、正式な AI 世代昇格は従来どおり管理された試験で判断する。
