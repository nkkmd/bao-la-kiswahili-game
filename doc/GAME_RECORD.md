# 棋譜保存機能

更新日: 2026-09-15  
対象形式: `bao-game-record` version `1`

## 1. 目的と現在状態

Bao la Kiswahili の公開ゲームでは、終局した対局について、利用者が明示的に操作した場合だけ完全な着手列をJSONファイルとして保存できる。

この機能は、AI改善用診断とは別の利用者向け機能である。AIの思考内容を調べるための診断ではなく、**1局の初期局面、確定した着手列、対局設定、勝敗、最終局面を保存し、後から機械的に再現できる形で残すこと**を目的とする。

2026年9月15日に専用ブランチ`feat/game-record-save-20260915`で実装・自動検証・テスト用`public/`の実機確認まで完了し、利用者から問題なしとの確認を受けた。PR #142で`main`統合対象として最終確認し、本番配信は`main`統合とは別工程としてCloudflare Pagesで行う。

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

## 6. プライバシーと保存期間

棋譜は対局中だけブラウザのメモリ上に存在し、終局後に利用者が「棋譜を保存」を押した場合だけ利用者端末へJSONファイルとして保存する。

棋譜をlocalStorageやIndexedDBへ自動保存する機能はない。ゲームサーバーや外部サービスへ棋譜を送信する機能もない。ページを再読み込みする、または新しい対局へ移行してメモリ上の記録を破棄した場合、保存していない棋譜は復元できない。

公開サイトとしてのデータ取扱いは[`public/privacy.html`](../public/privacy.html)を正本とする。

## 7. 再現と検証

`public/game-record.js`は、保存形式の検証と、ルールエンジンを使った着手列の再生処理を持つ。現在の公開UIには棋譜JSONを読み込む操作は提供していないが、自動テストでは`initialPosition`から`moves`を順に適用し、終局局面を再現できることを確認する。

棋譜専用の主要テストは次の3ファイルである。

- `test/game-record.test.js`: 形式、着手保存、終局、再生
- `test/game-record-browser-hook.test.js`: 実際の画面着手経路との接続、失敗着手時のrollback
- `test/game-record-ui.test.js`: 終局前後の保存UI、PWAキャッシュ、Privacy Policyとの整合

専用CIは`.github/workflows/game-record-verification.yml`で管理する。棋譜テストに加え、隣接するengine、locale、診断、AI releaseの回帰も実行する。

2026年9月15日の実装ブランチでは棋譜専用CIを通過し、既存の公開AI・図解ルールの主要ブラウザー回帰でもChromium、Firefox、WebKitの合格を確認した。その後、テスト用`public/`を用いた実機確認で問題なしとの利用者報告を受けている。

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

- [`SYSTEM_DESIGN.md`](SYSTEM_DESIGN.md): 現行システム全体での責務とデータ保存境界
- [`RULES_BASELINE.md`](RULES_BASELINE.md): 棋譜再生の前提となるルール実装基準
- [`AI_HUMAN_REVIEW_GUIDE.md`](AI_HUMAN_REVIEW_GUIDE.md): 棋譜とは別系統のAI診断・対人レビュー手順
- [`../public/privacy.html`](../public/privacy.html): 公開サイトのデータ取扱い
- [`../README.md`](../README.md): 利用者・開発者向けの入口
