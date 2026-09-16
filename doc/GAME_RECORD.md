# 棋譜保存機能

更新日: 2026-09-16  
対象形式: `bao-game-record` version `1`

## 1. 目的と現在状態

Bao la Kiswahili の公開ゲームでは、終局した対局について、利用者が明示的に操作した場合だけ完全な着手列をJSONファイルとして保存できる。

この機能は、AI改善用診断とは別の利用者向け機能である。AIの思考内容を調べるための診断ではなく、**1局の初期局面、確定した着手列、対局設定、勝敗、最終局面を保存し、後から機械的に再現できる形で残すこと**を目的とする。

ローカル棋譜保存機能は2026年9月15日にPR #142で`main`へ統合済みである。2026年9月16日には、この同じ`bao-game-record` v1を対象として、完成したコンピュータ対戦の棋譜を利用者が1局ごとに明示同意した場合だけAI改善用に送信できる**任意の棋譜提供機能**を別経路として追加した。ローカル保存と任意提供は独立した操作であり、ローカル保存を行ったことが送信同意を意味することはない。任意提供の設計・検証・サーバー側境界は[`GAME_RECORD_CONTRIBUTION.md`](GAME_RECORD_CONTRIBUTION.md)を正本とする。

## 2. 利用者から見た動作

対局中は棋譜をブラウザのメモリ上だけに保持する。終局するまでは保存ボタンを表示しない。

終局すると、ゲーム画面に次の操作を表示する。

```text
棋譜を保存
```

英語表示では`Save game record`とする。ボタンを押した時だけJSONを生成し、利用者の端末へファイルとして保存する。

ファイル名は次の形式である。

```text
bao-game-record-YYYYMMDD-HHMMSS.json
```

日時は利用者端末のローカル日時を**ファイル名の生成にだけ**使用する。棋譜JSON本文には保存時刻を追加しない。

任意提供が有効な配信版では、完成したコンピュータ対戦に限り「AI改善のため棋譜を送信 / Send game record for AI improvement」も別操作として表示する。送信前に目的と送信内容を確認するdialogとTurnstile検証を通し、利用者がその1局について「同意して送信」を押した場合だけ送信する。自動送信、一括同意、バックグラウンド再送は行わない。

## 3. 保存する情報

棋譜は`bao-game-record` version `1`として保存する。主要な構造は次のとおりである。

```json
{
  "format": "bao-game-record",
  "version": 1,
  "rules": {
    "guide": "bao-la-kiswahili-ja",
    "guideVersion": "v0.1.0-draft",
    "baseline": "R-002"
  },
  "settings": {},
  "initialPosition": {},
  "moves": [],
  "result": {},
  "finalPosition": {}
}
```

### 3.1 ルール識別

`rules`には、棋譜を生成した実装が基準としたルールガイド、ガイド版、実装基準を保存する。現在は次を記録する。

- `guide`: `bao-la-kiswahili-ja`
- `guideVersion`: `v0.1.0-draft`
- `baseline`: `R-002`

将来ルール実装が変わった場合、古い棋譜を現在のエンジンで無条件に同一視しないための識別情報である。

### 3.2 対局設定

`settings`には対戦モードを保存する。コンピューター対戦では、人間側、AI難易度、公開AI世代、release ID、および利用可能な場合は採用ID・評価器識別も保存する。

これらは対局条件を説明するためのメタデータであり、AI探索の内部履歴を保存するものではない。

### 3.3 初期局面と最終局面

`initialPosition`と`finalPosition`には、再現と検算に必要な次の局面情報を保存する。

- `pits`
- `reserve`
- `houseOwned`
- `player`
- `phase`
- `winner`
- `reason`
- `turn`
- `pending`

初期局面と全着手から再生した結果を`finalPosition`と照合できるため、将来の読み込み・検証処理でも局面の不一致を検出しやすい構造になっている。

### 3.4 着手列

`moves`には、実際の対局で確定した着手だけを順番に保存する。各項目は`ply`、着手前の`turn`、`player`、`side`、`phase`と、canonicalな`move`を持つ。

`move`で保存対象とするfieldは次の8個である。

```text
type
phase
row
index
direction
side
houseChoice
houseTwo
```

`houseChoice`を含め、結果を変え得る選択情報を落とさない。一方、画面演出用のsow/relay中間イベント、石を1個ずつ置く途中状態、AI探索ノードは棋譜に含めない。

### 3.5 終局結果

`result`には勝者、勝者側、終了理由、記録したply数を保存する。勝敗が確定していない対局は完成棋譜として保存しない。

## 4. 記録経路と計算資源の境界

棋譜機能は`public/game-record.js`が担当する。`public/main.js`の通常対局経路が初期化された後に読み込み、実際に採用された画面上の着手だけを記録する。

重要な境界は次のとおりである。

- AI探索のWorker要求へ棋譜を渡さない。
- 探索中の局面展開を記録しない。
- `applyMoveForSearch`など探索用軽量遷移へ処理を追加しない。
- 通常着手で生成される`events`全体を棋譜へ保持しない。
- 1着手ごとにlocalStorageへ棋譜全体を書き戻さない。
- 対局中はcanonicalな着手情報だけをメモリ上の配列へ追加する。
- JSON文字列化とBlob生成は、終局後に利用者が保存ボタンを押した時だけ行う。

この構成により、棋譜保存のための処理をAIの探索ループから分離している。棋譜機能の追加によってAIの探索時間予算や探索ノード数を意図的に減らす設計にはしていない。

任意提供時の追加処理も終局後にだけ行う。送信前にブラウザ側で棋譜を検証・再生し、Cloudflare Worker側でも標準初期局面、canonical move、全着手replay、最終局面・結果を再検証する。対局中のAI探索経路へネットワーク処理を追加しない。

## 5. AI改善用診断との区別

棋譜保存とAI改善用診断は目的、保持範囲、保存場所が異なる。

| 項目 | 棋譜保存 | AI改善用診断 |
| --- | --- | --- |
| 主目的 | 1局全体の着手列と結果を残す | 特定のAI判断・局面を調査する |
| 対象 | 人間・AI・自動passを含む確定着手 | 主として直前のAI着手と探索統計 |
| 対局中の保持 | メモリ | 利用者操作時のみlocalStorageへ追加 |
| 自動永続保存 | しない | しない |
| ファイル保存 | 終局後に利用者が明示操作 | 診断ボタンから利用者が明示操作 |
| AI探索統計 | 原則含めない | 含む |
| 形式 | `bao-game-record` | `bao-ai-diagnostic` |

棋譜にAI探索統計を混在させない。AIの判断理由や探索品質を調べる場合は、従来どおり[`AI_HUMAN_REVIEW_GUIDE.md`](AI_HUMAN_REVIEW_GUIDE.md)に従って診断機能を使う。

任意の棋譜提供は、棋譜形式そのものを別形式へ変える機能ではない。検証済み`bao-game-record` v1を、コンピュータ対戦・1局単位の明示同意という追加条件の下でAI改善用corpusへ提供する別経路である。提供棋譜を人間の正解手や正式なAI採用判断のground truthとは扱わない。

## 6. プライバシーと保存期間

棋譜は対局中だけブラウザのメモリ上に存在し、終局後に利用者が「棋譜を保存」を押した場合だけ利用者端末へJSONファイルとして保存する。この**ローカル保存操作自体は外部送信を行わない**。

棋譜をlocalStorageやIndexedDBへ自動保存する機能はない。任意提供を行わない限り、棋譜は外部へ送信されない。任意提供が有効な場合も、完成したコンピュータ対戦について利用者が1局ごとに明示同意した場合だけ送信し、自動送信、一括同意、バックグラウンド再送、送信用local queueは行わない。

提供先ではCloudflare Workers、Turnstile、private R2を利用する。収集Workerは送信元IPアドレスやTurnstile tokenを保存棋譜またはそのR2 metadataへ書き込まず、raw棋譜には90日後に削除するlifecycle ruleを適用する。詳細は[`GAME_RECORD_CONTRIBUTION.md`](GAME_RECORD_CONTRIBUTION.md)と、公開サイト上のデータ取扱いの正本である[`public/privacy.html`](../public/privacy.html)を参照する。

ページを再読み込みする、または新しい対局へ移行してメモリ上の記録を破棄した場合、ローカル保存も任意提供も行っていない棋譜は復元できない。

## 7. 再現と検証

`public/game-record.js`は、保存形式の検証と、ルールエンジンを使った着手列の再生処理を持つ。現在の公開UIには棋譜JSONを読み込む操作は提供していないが、自動テストでは`initialPosition`から`moves`を順に適用し、終局局面を再現できることを確認する。

ローカル棋譜保存の主要テストは次の3ファイルである。

- `test/game-record.test.js`: 形式、着手保存、終局、再生
- `test/game-record-browser-hook.test.js`: 実際の画面着手経路との接続、失敗着手時のrollback
- `test/game-record-ui.test.js`: 終局前後の保存・任意提供UI、PWAキャッシュ、Privacy Policyとの整合

任意提供の追加境界は次のテストで確認する。

- `test/game-record-contribution-config.test.js`: Custom Domain、kill switch既定値、R2・rate-limit等の設定
- `test/game-record-contribution-worker.test.mjs`: request/schema/replay/deduplication/R2日次quota等のWorker検証
- `test/game-record-contribution-fetch-metadata.test.mjs`: Origin・Fetch Metadata境界

専用CIは`.github/workflows/game-record-verification.yml`で管理し、上記の棋譜保存・任意提供テストに加え、隣接するengine、locale、診断、AI releaseの回帰も実行する。

ローカル棋譜保存は2026年9月15日にPR #142で`main`へ統合済みである。任意提供機能は2026年9月16日にテストサイト・スマートフォン実機・Cloudflare Worker/R2/Turnstile・Custom Domainを使ったcontrolled submissionまで確認し、最終構成では`workers.dev`とPreview URLを無効化して`bao-data.cultivationdata.net`だけを本番Worker入口としている。

## 8. 現在の制限

現行version `1`では次を行わない。

- 対局途中の棋譜ファイル保存
- 自動保存や中断対局の復元
- 棋譜ファイルを画面から読み込む機能
- 保存棋譜を手順表示する専用viewer
- 人間向け棋譜記法への変換
- 棋譜へのAI探索統計の常時埋め込み

これらを将来追加する場合も、version `1`の意味を暗黙に変更せず、既存棋譜との互換性、ルール基準、ファイルサイズ上限、読み込み時の厳格なvalidationを明示して設計する。

## 9. 関連文書

- [`GAME_RECORD_CONTRIBUTION.md`](GAME_RECORD_CONTRIBUTION.md): AI改善用の任意棋譜提供、同意、Worker検証、R2・privacy・運用境界
- [`SYSTEM_DESIGN.md`](SYSTEM_DESIGN.md): 現行システム全体での責務とデータ保存・送信境界
- [`RULES_BASELINE.md`](RULES_BASELINE.md): 棋譜再生の前提となるルール実装基準
- [`AI_HUMAN_REVIEW_GUIDE.md`](AI_HUMAN_REVIEW_GUIDE.md): 棋譜とは別系統のAI診断・対人レビュー手順
- [`../public/privacy.html`](../public/privacy.html): 公開サイトのデータ取扱い
- [`../README.md`](../README.md): 利用者・開発者向けの入口
