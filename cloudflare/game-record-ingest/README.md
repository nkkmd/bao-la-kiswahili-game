# Game Record Contribution Worker

Bao la Kiswahili の終局棋譜を、利用者の明示同意後に受け付ける Cloudflare Worker です。
公開ゲーム本体とは独立させ、R2 bucket は private のまま Worker binding からのみ書き込みます。

## 安全上の境界

- `POST /v1/game-records` と CORS preflight だけを受け付ける。
- 許可 Origin は `ALLOWED_ORIGINS` の完全一致で制限する。
- Turnstile token を server-side で検証し、action と hostname も照合する。
- `bao-game-record` version 1、ルール baseline、computer 対戦、許可 field、型、石総数、最大手数を検証する。
- 公開 engine の `applyMoveForSearch` で全着手を replay し、最終局面と結果を照合する。
- 氏名、自由記述、永続 user ID、端末 fingerprint、AI探索統計などの任意 field は受け付けない。
- `CF-Connecting-IP` は短時間の per-client rate-limit key にだけ使用し、R2 object や metadata へ保存しない。
- Turnstile token、同意 marker も R2 へ保存しない。
- canonical な棋譜 JSON の SHA-256 を object key にし、同一棋譜を重複保存しない。
- R2 は Standard storage を使用し、public access を有効化しない。

## 無料枠を守るための既定上限

2026-09-16 時点の Cloudflare 公開仕様を前提に、Cloudflare の上限より十分低い application-side guard を設定する。

- request body: 最大 64 KiB
- 保存する棋譜 JSON: 最大 48 KiB
- 最大 384 ply
- 同一接続元: 3 requests / 60 s
- 正常検証後の全体受理: 1 record / 60 s
- R2 raw record retention: 90日を推奨

全体受理が理想的に上限まで継続した場合でも、30日で最大約43,200 writes、90日間の48 KiB payloadは約6.37 GBとなる。R2 Free の 10 GB-month、Class A 100万回/月、Class B 1,000万回/月に対して余裕を残す設計である。ただし rate-limit counter は厳密な課金カウンターではなく、分散環境で一時的に超過し得るため、Turnstile と zone-level WAF rate limiting を併用する。

Workers Free の request 数は、Worker code に到達した不正 request も消費する。したがって custom domain を有効化する本番では、Cloudflare Free で利用できる zone-level rate limiting rule を `/v1/game-records` に追加し、Worker より前段でも濫用を抑える。

## Cloudflare 側で必要な作業

実リソースを作るまでは `public/game-record-contribution-config.js` の `enabled` を `false` のままにする。

1. R2 Standard bucket `bao-game-record-contributions` を作成し、Public Access は無効のままにする。
2. raw record を90日後に削除する lifecycle rule を設定する。
3. Turnstile Managed widget を作成し、公開サイトとテストサイトの hostname を登録する。
4. Worker directory で `TURNSTILE_SECRET_KEY` を secret として登録する。
5. `wrangler.jsonc` の Origin / hostname / binding をアカウント構成に合わせて確認する。
6. Worker をまず `workers.dev` へ deploy し、テストサイトから送受信を確認する。
7. 問題なければ `bao-data.cultivationdata.net` 等の custom domain を Worker に設定する。
8. zone-level rate limiting rule を `/v1/game-records` に追加する。
9. 最後に `public/game-record-contribution-config.js` の site key と endpoint を設定し、`enabled: true` とする。

例:

```sh
npx wrangler r2 bucket create bao-game-record-contributions --storage-class Standard
npx wrangler r2 bucket lifecycle add bao-game-record-contributions expire-raw-records --expire-days 90
cd cloudflare/game-record-ingest
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler deploy
```

`TURNSTILE_SECRET_KEY`、Cloudflare API token、その他の認証情報は GitHub に commit しない。

## R2 object

key:

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

## 運用上の位置付け

提供棋譜は Turnstile・schema・engine replay を通すが、「実在する人が自然にプレイしたこと」までは証明しない。したがって `anonymous/unverified contribution` として扱い、自動学習へ直接投入しない。弱点候補抽出、実戦局面 corpus、回帰検証候補などに利用し、正式な AI 世代昇格は従来どおり管理された試験で判断する。
