# Bao la Kiswahili - コンピュータ対戦版 設計書

Version: 0.1.0
Status: Draft

---

# 1. 概要

## 1.1 目的

本システムは **Bao la Kiswahili** のルールに従ったコンピュータ対戦環境を提供する。

以下を目的とする。

* 公式ルールに準拠した対局
* オフライン対戦
* ブラウザのみで動作
* インストール可能なPWA
* Cloudflare Pagesで公開可能
* サーバー不要
* 完全クライアントサイド

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

本プロジェクトでは、

**ルールエンジンを唯一の真実（Single Source of Truth）**

とする。

人間プレイヤー・コンピュータAI・棋譜再生・解析機能はすべて同一のルールエンジンを利用することで、実装の一貫性とルール準拠性を保証する。

AIは盤面を書き換えることはできず、合法手生成および盤面遷移は必ずルールエンジンを介して実行される。
