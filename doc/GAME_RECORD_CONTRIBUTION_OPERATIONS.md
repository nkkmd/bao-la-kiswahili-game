# 任意棋譜提供 — 本番運用記録

更新日: 2026-10-08

本書は、AI改善用の任意棋譜提供機能について、実装設計とは分離して本番運用上の主要イベントを記録する。
設計・検証境界の正本は[`GAME_RECORD_CONTRIBUTION.md`](GAME_RECORD_CONTRIBUTION.md)を参照する。

## 2026-10-08 — takasia対応の移行準備

作業ブランチではversion 1・2の受信検証を実装したが、本作業のコードは本番Workerへ未配備である。移行時は受信側を先に確認し、既存v1のcontrolled submission、v2の受理・重複、保存先`records/v2/`、ルール改訂metadata、共通日次quota、CPUと90日lifecycleを検証してから新クライアントを配信する。[工程5の結果と配信前の残件](ai-engineering/takasia-update/RECORD_IMPLEMENTATION.md)を参照する。下記の既存配備・実機記録は当時のv1環境の証拠として保持する。

## 2026-09-16 — 本番運用開始

### 対象

- 公開サイト: `https://bao-la-kiswahili.cultivationdata.net/`
- 収集API: `https://bao-data.cultivationdata.net/v1/game-records`
- Worker: `bao-game-record-ingest`
- R2 bucket: `bao-game-record-contributions`
- 対象棋譜形式: `bao-game-record` version `1`


### 本番移行前に完了した事項

- PR #144を`main`へ統合
- merge commit: `da54b03dd5d8eee345b4b1d08344cb326303aab8`
- 本番用`public/`を公開サイトへ配信
- Worker Custom Domain `bao-data.cultivationdata.net` を正式deploy targetとして設定
- `workers_dev:false`、`preview_urls:false`を設定し、`*.workers.dev`とPreview URLを本番入口として使用しない構成に固定
- Worker Version ID `be3409ed-e0e9-4d9b-938f-10aea360110c` をCustom Domainへdeploy
- private R2、90日lifecycle、Turnstile、Origin / Fetch Metadata、schema / replay validation、duplicate排除、日次quotaを確認
- スマートフォン実機およびCustom Domain経由のcontrolled submissionを確認
- `main`統合前の4系統CIがすべてSUCCESS

### 本番有効化

本番サイト配信後、Cloudflare本番環境の`COLLECTION_ENABLED`を`true`へ切り替え、任意棋譜提供を正式に有効化した。

重要: リポジトリの`cloudflare/game-record-ingest/wrangler.jsonc`では`COLLECTION_ENABLED`の既定値を`false`のまま維持する。これは再deploy時に不用意に収集を開始しないためのfail-closed既定値であり、本番運用時の有効化状態はCloudflare側で明示的に管理する。

### Production E2E確認

本番公開サイト上でコンピュータ対戦を完了し、利用者操作による任意送信を実行して、次のE2E経路が正常であることを確認した。

```text
production game
  -> game end
  -> optional contribution UI
  -> explicit per-game consent
  -> Cloudflare Turnstile
  -> https://bao-data.cultivationdata.net/v1/game-records
  -> Worker validation / replay / dedupe / quota
  -> private R2
```

確認結果:

- 本番サイト上の任意送信UIが正常に動作
- Turnstileが正常に完了
- Custom Domain経由のPOSTが正常に受理
- R2へ新規recordが正常保存
- 日次quotaのaccepted countが想定どおり増加
- Workers Metrics / Observabilityで例外、明確なCPU超過、Exceeded Resourcesを認めない
- 本番E2E確認後も通常対局・ローカル棋譜保存・任意提供の分離が維持される

### 運用状態

この確認をもって、任意棋譜提供機能は**本番運用開始済み**とする。

運用上の安全境界は引き続き次を維持する。

- コンピュータ対戦の完成棋譜のみ
- 1局単位の明示同意
- 自動送信・一括同意・バックグラウンド再送なし
- exact Origin allow-list + Fetch Metadata + Turnstile
- strict schema / 標準初期局面 / canonical move / engine replay / final state validation
- SHA-256 duplicate排除
- Workers Rate Limiting APIはbest-effortのburst緩和としてのみ使用
- private R2の日次quotaをhard stopとして使用
- source IP、Turnstile token、consent envelopeを保存棋譜・R2 metadataへ書き込まない
- raw棋譜は90日retention
- 提供棋譜は`anonymous / unverified contribution`として扱い、自動学習やAI世代採用のground truthにはしない

## 運用変更時の記録方針

次の変更を行った場合は、本書へ日付付きで追記する。

- `COLLECTION_ENABLED`の長期停止・再開
- endpoint / Custom Domainの変更
- Turnstile設定の重要変更
- R2 retention / quotaの変更
- schema / validation levelの変更
- privacy上の保存項目の変更
- 本番障害、rate limit・quota到達、異常なresource消費
- 収集停止または機能廃止

