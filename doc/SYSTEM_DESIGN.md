# Bao la Kiswahili - コンピュータ対戦版 設計書

Version: 0.1.1
Status: Draft

---

# 1. 概要

## 1.1 目的

本システムは **Bao la Kiswahili** のルールに従ったコンピュータ対戦環境を提供する。

実装上のルール基準には、[`bao-la-kiswahili-ja`](https://github.com/nkkmd/bao-la-kiswahili-ja) の公開ドラフト `v0.1.0-draft` における `R-002` を採用する。固定参照コミット、実装範囲、既知の差異、更新方針は [`RULES_BASELINE.md`](RULES_BASELINE.md) を参照する。

以下を目的とする。

* 採用ルール基準に基づく対局
* オフライン対戦
* ブラウザのみで動作
* インストール可能なPWA
* Cloudflare Pagesで公開可能
* サーバー不要
* 完全クライアントサイド

## 1.2 ルール準拠の意味

本設計における「ルール準拠」は、Bao全体の公式規則または特定大会の規則への包括的な適合を意味しない。本リポジトリが採用したルール基準と、文書化された既知の差異に基づいて実装することを意味する。

大会、地域、対局団体などが別の規則を明示している場合は、その規則を優先する。

---

# 2. システム構成

```
Cloudflare Pages

        │
        ▼

ブラウザ(PWA)

├── UI
├── ルールエンジン
├── AIエンジン
├── 棋譜管理
├── IndexedDB
└── Service Worker
```

サーバー側ではゲーム処理を一切行わない。

すべてJavaScript上で実行する。

---

# 3. 採用技術

* HTML5
* CSS3
* JavaScript (ES Modules)
* PWA
* IndexedDB
* Service Worker

サーバーサイドは使用しない。

---

# 4. ディレクトリ構成

```
bao-game/

├── public/
│   ├── icons/
│   ├── manifest.webmanifest
│   └── service-worker.js
│
├── src/
│
│   ├── core/
│   │   ├── board.js
│   │   ├── rules.js
│   │   ├── move.js
│   │   ├── capture.js
│   │   ├── relay.js
│   │   ├── nyumba.js
│   │   ├── mtaji.js
│   │   ├── legalMoves.js
│   │   └── gameover.js
│   │
│   ├── ai/
│   │   ├── random.js
│   │   ├── heuristic.js
│   │   ├── minimax.js
│   │   ├── evaluation.js
│   │   └── difficulty.js
│   │
│   ├── storage/
│   │   ├── db.js
│   │   ├── savegame.js
│   │   └── history.js
│   │
│   ├── ui/
│   │   ├── board.js
│   │   ├── animation.js
│   │   ├── menu.js
│   │   ├── dialog.js
│   │   └── sound.js
│   │
│   └── main.js
│
├── docs/
│   └── DESIGN.md
│
└── README.md
```

---

# 5. ルールエンジン

ゲームの中核。

役割

* 合法手生成
* 石の移動
* 捕獲
* Relay Sowing
* nyumba処理
* namua
* mtaji
* 終局判定

AIは必ずこのルールエンジンを経由して着手する。

人が読むルールの参照基準は [`bao-la-kiswahili-ja`](https://github.com/nkkmd/bao-la-kiswahili-ja) と [`RULES_BASELINE.md`](RULES_BASELINE.md) に置き、実行時の合法手生成と盤面遷移は `public/engine.js` に一元化する。

---

# 6. BoardState

盤面は完全な状態を保持する。

```
BoardState

・盤面
・手番
・Namua / Mtaji
・Nyumba状態
・棋譜
・ターン数
```

ルールエンジンはBoardStateのみを書き換える。

---

# 7. 合法手生成

最重要モジュール。

```
generateLegalMoves(BoardState)
```

返却

```
[
  Move,
  Move,
  Move,
  ...
]
```

AI・人間とも同一の合法手生成を利用する。

---

# 8. AI

## Lv1

ランダム

合法手からランダム選択

---

## Lv2

評価関数

評価項目例

* 勝利
* 捕獲数
* 前列維持
* nyumba維持
* 相手前列減少

---

## Lv3

Minimax

深さ2〜4程度

Alpha-Beta枝刈りを採用

---

## 将来的な拡張

MCTS

十分な速度が得られた場合に追加する。

---

# 9. UI

画面

* タイトル
* 難易度選択
* 対局画面
* 棋譜
* 設定
* ヘルプ

---

# 10. アニメーション

* 石移動
* Relay Sowing
* 捕獲
* 勝敗演出

アニメーション中でも内部状態は同期する。

---

# 11. オフライン対応

Service Workerにより

* HTML
* CSS
* JavaScript
* アイコン
* 効果音

をキャッシュする。

初回アクセス後は通信不要。

---

# 12. データ保存

IndexedDB

保存内容

* 途中局面
* 棋譜
* AI設定
* 対局履歴
* テーマ

---

# 13. PWA

対応内容

* ホーム画面追加
* オフライン起動
* フルスクリーン
* アイコン表示

---

# 14. パフォーマンス

目標

初期表示

1秒以内

AI思考

Lv1

100ms以内

Lv2

300ms以内

Lv3

1秒以内

60fps描画維持

---

# 15. 将来的な拡張

* 棋譜保存
* 棋譜読込
* 棋譜共有
* AI同士対戦
* AI解析
* ヒント機能
* 局面編集
* 詰めBao
* 観戦モード

---

# 16. 開発フェーズ

## Phase 1

盤面モデル

---

## Phase 2

合法手生成

---

## Phase 3

ルールエンジン完成

---

## Phase 4

UI

---

## Phase 5

ランダムAI

---

## Phase 6

評価関数AI

---

## Phase 7

Minimax

---

## Phase 8

PWA化

---

## Phase 9

Cloudflare Pages公開

---

## Phase 10

正式版リリース

---

# 17. 設計方針

本プロジェクトでは、実行時の合法手判定と盤面遷移について、

**`public/engine.js` を実装上の唯一の真実（Single Source of Truth）**

とする。

人間プレイヤー・コンピュータAI・棋譜再生・解析機能はすべて同一のルールエンジンを利用することで、ゲーム内部の一貫性を保証する。

一方、ルールエンジン自体をBaoのルールの出典とはしない。人が読む外部の参照基準は [`bao-la-kiswahili-ja`](https://github.com/nkkmd/bao-la-kiswahili-ja)、このゲームが固定した版・コミット・差異は [`RULES_BASELINE.md`](RULES_BASELINE.md) を正とする。

AIは盤面を書き換えることはできず、合法手生成および盤面遷移は必ずルールエンジンを介して実行される。

採用ルール基準を変更する場合は、ルールエンジン、回帰テスト、ゲーム画面、主要文書を同時に更新し、既存のAI・研究結果への影響を確認する。
