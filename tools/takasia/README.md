# takasiaの検証ツール

## 目的と対象

[更新工程](../../doc/ai-engineering/takasia-update/README.md)の工程2として、採用仕様の期待値と、候補エンジンの合格条件を保存する。公開エンジンの対応完了を宣言するツールではない。

`fixtures.json`はE30の32穴と、17件の成立判定（E30と構成例）、所有中nyumbaから始めて対象穴で止まる追加1件を保存する。全局面は手元・持ち越しを含め64個である。E30の全4応手の最終盤面も固定する。E30以外の構成例や逆算した直前手は、出典の実戦局面や到達可能性を確認した局面として扱わない。

## ファイルと責務

| ファイル | 役割 |
| --- | --- |
| `fixtures.json` | 固定入力、出典・座標・期待値 |
| `oracle.cjs` | 公開エンジンを読まずに、1個ずつ蒔いて成立・停止を計算 |
| `verify.py` | 捕獲候補を式で、蒔きを商・余りで再計算し、固定期待値へ照合 |
| `check-engine.cjs` | 公開エンジンを同じ仕様へ照合。未対応では終了コード1 |
| `engine-gap-20261008.json` | 作業開始時エンジンの既知の不一致。新実装へ合わせて書き換えない |
| `../../test/takasia-contract.test.cjs` | 独立計算・入力不変・例外・全応手・座標等の回帰 |

## 実行方法

リポジトリのルートから実行する。Node.jsとPython 3の標準機能だけを使う。

```bash
node --test test/takasia-contract.test.cjs
python3 tools/takasia/verify.py
node tools/takasia/check-engine.cjs
```

最初の2件は準備データと限定計算を検証する。3件目は実際のエンジン対応を検証し、準備時点では全25条件がFAILになる。例外を捕まえてPASSへ変換せず、未対応を明示する。

`takasia-preparation.yml`は独立検証をCIで再現する。候補エンジンの検査を緑に見せるためのskipや条件付き成功は加えない。工程3で実装後、3件目も対応用CIの必須条件に追加する。

## 計算範囲と限界

両実装は捕獲候補とmtajiのtakataを扱う。namua、捕獲後の再投入、すべてのnyumba機能、全終局条件、安全上限の裁定を実装しない。非停止の構成例は計算を中止し、公開エンジンの終局処理として代用しない。

別言語・別の蒔き計算法の照合は実装ミスの検出を補助するが、同じガイドの解釈を使う。外部競技者のレビューや独立した規則出典2件に相当しない。

## 出典とライセンス

E30は[Bao la Kiswahili 日本語完全ガイドの固定版](https://github.com/nkkmd/bao-la-kiswahili-ja/blob/aad9fda3ffb12c2ca785509951c71ce8a42bef5a/guide/examples/README.md#e30-takasia対象穴でrelay-sowingを止める)に基づく。同ガイドはK.I.B.A. R-009 §4.5を出典としている。変更内容は本人視点indexへの座標変換、JSON化、独立計算による最終盤面の追加、境界条件の構成例の追加である。

`fixtures.json`の再構成データと本説明は[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)として扱い、ガイドへの帰属を保持する。外部資料の本文・PDFを収録しない。新規検証コードは本ゲームのMIT Licenseに従う。
