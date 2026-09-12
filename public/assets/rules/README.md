# 図解ルールの画像と出典

`public/rules.html`で使う10点のSVG図版を配置する。画像のレイアウトは新たに作成し、穴番号、石数、矢印とスワヒリ語の用語を中心に、日英で共用できる構成にした。日本語・英語の説明と代替テキストはHTMLにある。

## 出典と変更内容

- 原著: bao-la-kiswahili-ja contributors（2026）「Bao la Kiswahili 日本語完全ガイド」
- 固定参照: [`1179267b1f19b27a2138791253f2cb9cbfe98c14`](https://github.com/nkkmd/bao-la-kiswahili-ja/tree/1179267b1f19b27a2138791253f2cb9cbfe98c14)
- 参照範囲: 第02〜10章の盤面、初期配置、namua、mtaji、捕獲、連続種まき、nyumba、終局の説明
- 原著のライセンス: [CC BY-SA 4.0](https://github.com/nkkmd/bao-la-kiswahili-ja/blob/1179267b1f19b27a2138791253f2cb9cbfe98c14/LICENSE)
- 翻案・作図: bao-la-kiswahili-game contributors（2026）
- 変更: 本文の要約・英訳・順序変更、実装上の適用範囲の明記、画像の新規レイアウト、説明用局面の構成とエンジン照合

図解の本文とSVGは [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) で提供する。帰属表示、ライセンスへのリンク、変更の明示、改変物の同一ライセンスでの提供については同ライセンスを参照する。HTMLの説明本文が対象であり、CSS・JavaScript・生成プログラム・ゲームのコードは既存のMITライセンスを維持する。

## 図版の内容

| ファイル | 内容 |
| --- | --- |
| `board-overview.svg` | 4列の座標と前列・後列、家の位置 |
| `initial-setup.svg` | 初期配置と各側の盤上10個・手元22個 |
| `sowing-before.svg` | A3の3個を蒔き始める前 |
| `sowing-relay.svg` | A6で3個となり連続種まきを始める前 |
| `sowing-stop.svg` | 元は空のB8へ最後の1個が入り終了 |
| `capture-before.svg` | namuaでA4からa5を捕獲する前 |
| `capture-taken.svg` | a5から3個を取り上げ、入口へ移す途中 |
| `capture-after.svg` | A1から3個を蒔き終えた状態 |
| `nyumba-two.svg` | 家に1個加え、2個だけ蒔いて5個残る例 |
| `front-empty.svg` | 相手の前列が空になった終局例 |

## 再生成と検証

リポジトリルートで `node tools/build-rules-figures.js` を実行するとSVGを再生成する。`node tools/build-rules-figures.js --check` は保存済みSVGとの一致を確認する。実行前にゲームをビルドする必要はない。

初期配置以外は説明用に構成した局面であり、実戦の棋譜や初期配置からの到達可能性を示すものではない。生成時に各開始局面の石の総数64個、選んだ手の合法性、捕獲・連続種まき・停止・家の2個蒔き・前列空の遷移を現行エンジンで照合する。盤の一部のみを表示する図では、本文に表示範囲を明記している。捕獲途中の図では取り上げた石が一時的に盤上から離れており、その数と次の行き先を図と本文で説明している。

ゲームの採用基準は引き続き `v0.1.0-draft / R-002`。図解ページ作成によるルールエンジンやAIの変更はない。
