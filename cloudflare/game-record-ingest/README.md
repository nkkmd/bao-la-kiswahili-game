# Game Record Contribution Worker

Bao la Kiswahili の終局棋譜を、利用者の明示同意後に受け付ける Cloudflare Worker です。
公開ゲーム本体とは独立させ、R2 bucket は private のまま Worker binding からのみ書き込みます。

## 安全上の境界

- `POST /v1/game-records` と CORS preflight だけを受け付ける。
- `COLLECTION_ENABLED=true` を明示するまで server-side でも fail closed とする。
- 許可 Origin は `ALLOWED_ORIGINS` の完全一致で制限する。
- Worker の最外周 `src/entry.mjs` で Fetch Metadata を検証し、通常の browser POST は `Sec-Fetch-Site: same-origin|same-site`、`Sec-Fetch-Mode: cors`、`Sec-Fetch-Dest: empty` を要求する。
- Fetch Metadata gate は許可Originからの状態変更POSTに追加適用する。未許可Originは内側のexact Origin allow-listで `origin_not_allowed` として拒否する。
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
Fetch Metadata isolation for allowed Origins
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

2026-09-16のCustom Domain preflightでは、`COLLECTION_ENABLED=false` のまま以下を確認した。

- 本番Origin相当 + `same-site` → `503 collection_disabled`
- `cdn-ts.pages.dev` + `cross-site` → `503 collection_disabled`
- 未許可Origin `https://example.com` → `403 origin_not_allowed`

最後の結果は、未許可OriginをFetch Metadata gateへ通す前にexact Origin allow-listで拒否する現在の設計どおりである。

## 無料枠を守るための既定上限

- request body: 最大 64 KiB
- 保存する棋譜 JSON: 最大 48 KiB
- 最大 384 ply
- 同一接続元: 3 requests / 60 s（best-effort の burst 緩和）
- 同一 Cloudflare location の正常受理安全弁: 6 records / 60 s（best-effort の burst 緩和）
- **全世界共通の日次受理上限: 既定 500 records / UTC day**
- コード上の日次上限の最大値: 1,000 records / UTC day
- Worker CPU time: Free plan側の既定上限に従う
- Worker subrequests: Free plan側の既定上限に従う。`wrangler.jsonc` では `limits` を明示しない
- R2 raw record retention: 90日を必須運用条件とする

Workers Free では Wrangler の `limits.cpu_ms` を明示設定しない。実Worker試験で長い棋譜がCPU上限へ近づく場合は、`MAX_PLIES` を引き下げて処理量を抑える。

Workers Rate Limiting API は Cloudflare location 単位かつ permissive / eventually consistent であり、厳密な回数制御や正確なaccountingには使用しない。2026-09-16 の実Cloudflare試験では、同一接続元から `limit=3 / period=60` の条件で4回連続した malformed request を送っても4回とも `400 invalid_request` となり、4回目で `429` にはならなかった。このbindingは短時間burstの緩和用に限定し、課金防止・保存件数制御のhard stopとはみなさない。

全世界共通の日次上限は、同じ private R2 bucket の`control/daily/YYYY-MM-DD.json`にaccepted countを保持し、R2 conditional `PUT`のETag / `If-None-Match`を使って競合時に再試行する。quota stateを取得・更新できない場合はfail closedで受理しない。

既定500件/日、48 KiB/件、90日retentionをすべて最大まで使った場合でもraw record payloadは概算約2.2 GBである。1件の新規受理につきrecord writeとquota updateの最大2回のClass A operationを使うため、30日で概ね3万Class A operationsが上限となる。

無料枠の仕様が将来変更される可能性があるため、本番開始前と定期運用時にCloudflareの最新limits/pricingを再確認する。

## Cloudflare 側で必要な作業

1. R2 Standard bucket `bao-game-record-contributions` を作成し、Public Access は無効のままにする。
2. bucket全体を90日後に削除する lifecycle rule を設定する。
3. Turnstile Managed widget を作成し、公開サイトとテストサイトの hostname を登録する。
4. Worker directory で `TURNSTILE_SECRET_KEY` を secret として登録する。
5. `wrangler.jsonc` の Origin / Fetch Metadata cross-site exception / hostname / R2 binding / application limits を確認する。
6. Worker をdeployし、初回は `COLLECTION_ENABLED=false` のまま動作確認する。
7. controlled testで正常送信、重複、日次quota、malformed request、R2保存内容、90日lifecycle、Worker CPUを確認する。
8. 問題なければ `bao-data.cultivationdata.net` をCustom Domainに設定し、fail-closed preflightを行う。
9. client endpointをCustom Domainへ切り替え、Service Worker cacheを更新する。
10. Custom Domain経由でcontrolled submissionを1件だけ行い、再度R2 / quota / CPU / Turnstile / duplicateをspot checkする。

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
