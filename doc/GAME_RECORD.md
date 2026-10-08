# 棋譜保存・再生機能

更新日: 2026-10-08  
対象形式: 作業ブランチの新規`bao-game-record` version `2`と、旧version `1`

## 1. 目的と現在状態

takasia対応の作業ブランチでは、新規棋譜をversion 2で保存し、ルール版に対応するエンジンで再生・受信検証する。配信済みのversion 1は固定した旧R-002エンジンで扱う。main統合・新形式の配信・Cloudflare実環境での受信確認は未実施である。[工程5の結果と限界](ai-engineering/takasia-update/RECORD_IMPLEMENTATION.md)を参照する。

Bao la Kiswahili の公開ゲームでは、終局した対局について、利用者が明示的に操作した場合だけ完全な着手列をJSONファイルとして保存できる。

この機能は、AI改善用診断とは別の利用者向け機能である。AIの思考内容を調べるための診断ではなく、**1局の初期局面、確定した着手列、対局設定、勝敗、最終局面を保存し、後から機械的に再現できる形で残すこと**を目的とする。

ローカル棋譜保存機能は2026年9月15日にPR #142で`main`へ統合済みである。2026年9月16日には、この同じ`bao-game-record` v1を対象として、完成したコンピュータ対戦の棋譜を利用者が1局ごとに明示同意した場合だけAI改善用に送信できる**任意の棋譜提供機能**を別経路として追加した。2026年9月18日にはPR #152で**保存済み棋譜の再生機能**を`main`へ統合した。ローカル保存・再生・任意提供はそれぞれ独立した操作であり、ローカル保存や再生を行ったことが送信同意を意味することはない。任意提供の設計・検証・サーバー側境界は[`GAME_RECORD_CONTRIBUTION.md`](GAME_RECORD_CONTRIBUTION.md)を正本とする。

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

保存済み棋譜を振り返る場合は、対局設定のMODEで「棋譜再生 / Replay game record」を選び、端末上のJSONを明示的に選択する。作業ブランチはversion 1と2を受け付け、正常な棋譜だけを初期局面から「戻る」「進む」で1 plyずつ閲覧する。「進む」は読み込み検証で選択したルール版のエンジンと表示イベントを使い、捕獲・sow・relay等の既存アニメーションを再利用する。「戻る」は着手の逆演算を行わず、検証済み局面snapshotへ戻る。

棋譜再生モードは一時的な閲覧モードであり、MODE選択をlocalStorageへ保存しない。読み込んだJSONを再生機能から外部送信する処理もない。

## 3. 保存する情報

新規棋譜は`bao-game-record` version `2`として保存する。主要な構造は次のとおりである。旧version 1のファイルは変更せず、対応する旧エンジンで検証する。

```json
{
  "format": "bao-game-record",
  "version": 2,
  "rules": {
    "guide": "bao-la-kiswahili-ja",
    "guideVersion": "v0.2.0",
    "baseline": "BAO-RULES-V0.2.0-TAKASIA-001"
  },
  "settings": {},
  "initialPosition": {},
  "moves": [],
  "result": {},
  "finalPosition": {}
}
```

### 3.1 ルール識別

`guide`は`bao-la-kiswahili-ja`とし、形式版・ガイド版・基準の組合せを完全一致で識別する。

| 形式版 | ガイド版 | 基準 | 再生エンジン |
| --- | --- | --- | --- |
| 1 | v0.1.0-draft | R-002 | `public/engine-r002.js` |
| 2 | v0.2.0 | BAO-RULES-V0.2.0-TAKASIA-001 | `public/engine.js` |

識別と局面の正規化は`public/rule-versions.js`で共用する。未知の版、混在した組合せ、v2と旧エンジンの混在は拒否する。版を手作業で付け替えることは互換変換ではない。

### 3.2 対局設定

`settings`には対戦モードを保存する。コンピューター対戦では、人間側、AI難易度、公開AI世代、release ID、および利用可能な場合は採用ID・評価器識別も保存する。新しい公開経路は`ruleRevision`と`aiRevision`も保存し、ルール改訂とAI-GEN4系統内の対応改訂を区別する。

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
- version 2では`takasia: null | {player, index}`も必須。制約のない局面もnullを保存する。

version 1にはtakasiaを追加しない。version 2の欠落、対象の型・範囲・手番・phase・終局との不整合、対象への任意項目注入を拒否する。初期・最終局面だけを保存し、途中のtakasiaは着手列から選択したエンジンで再構成する。

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

棋譜の記録・基本検証・保存は`public/game-record.js`が担当し、保存済み棋譜の厳格な読み込み境界とviewer用snapshot生成は`public/game-record-replay.js`が担当する。`public/game-record.js`は`public/main.js`の通常対局経路が初期化された後に読み込み、実際に採用された画面上の着手だけを記録する。

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

任意の棋譜提供は、棋譜形式そのものを別形式へ変える機能ではない。検証済みの棋譜を、コンピュータ対戦・1局単位の明示同意という追加条件の下でAI改善用corpusへ提供する別経路である。提供棋譜を人間の正解手や正式なAI採用判断のground truthとは扱わない。

## 6. プライバシーと保存期間

棋譜は対局中だけブラウザのメモリ上に存在し、終局後に利用者が「棋譜を保存」を押した場合だけ利用者端末へJSONファイルとして保存する。この**ローカル保存操作自体は外部送信を行わない**。

棋譜をlocalStorageやIndexedDBへ自動保存する機能はない。任意提供を行わない限り、棋譜は外部へ送信されない。任意提供が有効な場合も、完成したコンピュータ対戦について利用者が1局ごとに明示同意した場合だけ送信し、自動送信、一括同意、バックグラウンド再送、送信用local queueは行わない。

提供先ではCloudflare Workers、Turnstile、private R2を利用する。収集Workerは送信元IPアドレスやTurnstile tokenを保存棋譜またはそのR2 metadataへ書き込まず、raw棋譜には90日後に削除するlifecycle ruleを適用する。詳細は[`GAME_RECORD_CONTRIBUTION.md`](GAME_RECORD_CONTRIBUTION.md)と、公開サイト上のデータ取扱いの正本である[`public/privacy.html`](../public/privacy.html)を参照する。

ページを再読み込みする、または新しい対局へ移行してメモリ上の記録を破棄した場合、ローカル保存も任意提供も行っていない棋譜は復元できない。

## 7. 再現と検証

`public/game-record.js`は保存形式の基本検証と、ルールエンジンを使った着手列の再生処理を持つ。公開UIの棋譜再生は`public/game-record-replay.js`が追加の読み込み境界を担当し、通常対局・AI探索・棋譜記録とは独立した閲覧経路として動作する。

再生開始前には次を確認する。

- `format = bao-game-record`、versionとルール識別が3.1の組合せと一致する
- `settings.mode`が`computer`または`local`
- 初期局面が選択したルール版の標準初期局面と一致する
- 各plyの`turn`、`player`、`side`、`phase`が、その時点で再構成した局面と一致する
- 各canonical moveが選択したルール版の合法なvariantと完全一致し、適用できる
- 全着手後の局面が保存済み`finalPosition`と一致する
- `result.plies`、winner、winnerSide、reasonが再構成した終局と一致する

検証中に各ply後の局面をメモリ上のsnapshot列として生成する。「戻る」はsnapshotを参照し、「進む」は保存済みcanonical moveを通常の`playMove`経路へ渡す。同経路は再生sessionのエンジンを使用し、旧棋譜を現行ルールへ付け替えない。再生中は盤面からの着手入力、AI思考、自動passを無効化する。

読み込み時の防御的な上限は、ファイル256 KiB・1024 plyである。これはローカルviewerの資源保護境界であり、AI改善用任意提供の48 KiB・384 ply上限とは別である。

ローカル棋譜関連の主要テストは次の4ファイルである。

- `test/game-record.test.js`: 形式、着手保存、終局、基本replay
- `test/game-record-replay.test.js`: 標準初期局面、各plyメタデータ、合法手、最終局面・結果、破損・未対応棋譜の拒否
- `test/game-record-browser-hook.test.js`: 実際の画面着手経路との接続、失敗着手時のrollback
- `test/game-record-ui.test.js`: 保存・再生・任意提供UI、モード非永続化、PWAキャッシュ、Privacy Policyとの整合

任意提供の追加境界は次のテストで確認する。

- `test/game-record-contribution-config.test.js`: Custom Domain、kill switch既定値、R2・rate-limit等の設定
- `test/game-record-contribution-worker.test.mjs`: request/schema/replay/deduplication/R2日次quota等のWorker検証
- `test/game-record-contribution-fetch-metadata.test.mjs`: Origin・Fetch Metadata境界

専用CIは`.github/workflows/game-record-verification.yml`で管理し、上記の棋譜保存・棋譜再生・任意提供テストに加え、隣接するengine、locale、診断、AI releaseの回帰も実行する。

工程5では`test/takasia-record.test.mjs`の18件を追加し、標準初期配置からの新規79手・旧78手を保存した。新棋譜はtakasiaの成立・対象での停止・失効を含み、通常／軽量遷移、viewer、診断、受信を照合する。既存48件と隣接UI2件も通過し、エンジン・AIを含む全144件がPASSした。固定AI release検証は別に未合格であり、PR全体の合格・実機検証・配信完了を意味しない。

ローカル棋譜保存は2026年9月15日にPR #142で`main`へ統合済みである。任意提供機能は2026年9月16日にテストサイト・スマートフォン実機・Cloudflare Worker/R2/Turnstile・Custom Domainを使ったcontrolled submissionまで確認し、最終構成では`workers.dev`とPreview URLを無効化して`bao-data.cultivationdata.net`だけを本番Worker入口としている。棋譜再生機能は2026年9月18日にPR #152で`main`へ統合し、モバイル実機でJSON選択、長いファイル名、戻る/進む操作を確認した。統合前の棋譜・AI release・図解ルール・PBAI-C015の4系統CIはいずれも成功している。

## 8. 現在の制限

新旧versionと再生viewerでは次を行わない。

- 対局途中の棋譜ファイル保存
- 自動保存や中断対局の復元
- 複数棋譜のライブラリ管理
- 自動再生・速度指定・任意plyへの直接ジャンプ
- 人間向け棋譜記法への変換
- 棋譜へのAI探索統計の常時埋め込み
- 未対応ルールの棋譜を現在のルールへ読み替えて再生すること

将来これらを追加する場合も、新旧versionの意味を暗黙に変更せず、既存棋譜との互換性、ルール基準、ファイルサイズ上限、読み込み時の厳格なvalidationを明示して設計する。

## 9. 関連文書

- [`GAME_RECORD_CONTRIBUTION.md`](GAME_RECORD_CONTRIBUTION.md): AI改善用の任意棋譜提供、同意、Worker検証、R2・privacy・運用境界
- [`SYSTEM_DESIGN.md`](SYSTEM_DESIGN.md): 現行システム全体での責務とデータ保存・送信境界
- [`RULES_BASELINE.md`](RULES_BASELINE.md): 棋譜再生の前提となるルール実装基準
- [`AI_HUMAN_REVIEW_GUIDE.md`](AI_HUMAN_REVIEW_GUIDE.md): 棋譜とは別系統のAI診断・対人レビュー手順
- [`../public/privacy.html`](../public/privacy.html): 公開サイトのデータ取扱い
- [`../README.md`](../README.md): 利用者・開発者向けの入口

