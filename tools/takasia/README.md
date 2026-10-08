# takasiaの検証ツール

## 目的と対象

[更新工程](../../doc/ai-engineering/takasia-update/README.md)の工程2〜5として、採用仕様の期待値、候補エンジンの合格条件、AI経路・予算、新旧棋譜の検証を保存する。本番配信の完了を宣言するツールではない。

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
| `ai-harness.cjs` | 新ルールの公開Worker相当の読み込み、12局面、固定乱数 |
| `benchmark-ai.cjs` | hard・expertの3予算72条件を逐次保存・再開 |
| `ai-validation-20261008.json` | Actionsで得た全72結果、入力・コードhash、実行環境と参照 |
| `history/ai-worker.js` | 旧AI-GEN3資産のhash検証用に保持した改訂前Worker。現行配信では使わない |
| `../../test/takasia-ai.test.cjs`・`../../test/takasia-ai-worker.test.cjs` | 局面キー、経路、キャッシュ、切戻し、実Worker、旧固定証拠の回帰 |
| `record-fixtures.json` | 標準初期配置から生成した新規79手と旧78手。ルール版、seed、固定ソースを保存 |
| `check-record-fixtures.cjs` | 固定したLCGと手選択条件で再生成し、保存データへ照合。上書きしない |
| `record-validation-20261008.json` | 工程5の対象・ソースhash・回帰結果・Actions参照・追加AI予算の記録 |
| `../../test/takasia-record.test.mjs` | 新旧棋譜・診断・受信・公開経路の18回帰 |

## 実行方法

リポジトリのルートから実行する。Node.jsとPython 3の標準機能だけを使う。

```bash
node --test test/takasia-contract.test.cjs
python3 tools/takasia/verify.py
node tools/takasia/check-engine.cjs
```

最初の2件は準備データと限定計算を検証する。3件目は実際のエンジン対応を検証する。準備時点では全25条件がFAILだったが、工程3の実装後は全件PASSである。例外を捕まえてPASSへ変換せず、未対応を明示する。

`takasia-preparation.yml`は独立検証、候補エンジン検査、追加のエンジン回帰、既存の基本・phase移行試験をCIで再現する。skipや条件付き成功は加えない。工程3の結果は[実装記録](../../doc/ai-engineering/takasia-update/ENGINE_IMPLEMENTATION.md)と`engine-validation-20261008.json`を参照する。追加回帰は`test/takasia-engine.test.cjs`である。

## AI検証の再現

[計測前に固定した条件](../../doc/ai-engineering/takasia-update/AI_BENCHMARK_PROTOCOL.md)と[結果・限界](../../doc/ai-engineering/takasia-update/AI_IMPLEMENTATION.md)を確認する。

```bash
node --test test/takasia-ai.test.cjs test/takasia-ai-worker.test.cjs
node tools/takasia/benchmark-ai.cjs artifacts/local/takasia-ai
node tools/takasia/benchmark-ai.cjs artifacts/local/takasia-ai --resume
```

既存出力は通常実行で上書きしない。再開は入力・コード・実行環境が一致する場合に限る。`--limit=1`は部分実行の動作確認用で、結果は`INCOMPLETE`になり、72条件のPASSとして使わない。Actionsは各条件をJSONLへ保存し、中断時もartifactを保存する。工程4の主結果は全件をリポジトリのJSONにも保持し、期限付きartifactだけに依存しない。

## 計算範囲と限界

両実装は捕獲候補とmtajiのtakataを扱う。namua、捕獲後の再投入、すべてのnyumba機能、全終局条件、安全上限の裁定を実装しない。非停止の構成例は計算を中止し、公開エンジンの終局処理として代用しない。

別言語・別の蒔き計算法の照合は実装ミスの検出を補助するが、同じガイドの解釈を使う。外部競技者のレビューや独立した規則出典2件に相当しない。

## 新旧棋譜の再現

[工程5の結果と限界](../../doc/ai-engineering/takasia-update/RECORD_IMPLEMENTATION.md)を確認する。

```bash
node tools/takasia/check-record-fixtures.cjs --check
node --test test/takasia-record.test.mjs
```

生成条件はLCGのseed 1〜1000、合法なcanonical手の乱択、takasia成立時は対象で停止する応手を優先し、384 ply以内で終局した最初の該当例である。新規例はseed 46・79手で成立と停止を各1回含む。旧例はseed 36・78手で、新ルールへ付け替えると同じ結果にならない。これらは再現・ルール版の隔離を確認する回帰で、棋力や先後差の試験ではない。独立したBao規則実装ではなく、選択した本ゲームの新旧エンジンで生成・再生する。E30の到達可能性を証明するものでもない。

## 出典とライセンス

E30は[Bao la Kiswahili 日本語完全ガイドの固定版](https://github.com/nkkmd/bao-la-kiswahili-ja/blob/aad9fda3ffb12c2ca785509951c71ce8a42bef5a/guide/examples/README.md#e30-takasia対象穴でrelay-sowingを止める)に基づく。同ガイドはK.I.B.A. R-009 §4.5を出典としている。変更内容は本人視点indexへの座標変換、JSON化、独立計算による最終盤面の追加、境界条件の構成例の追加である。

`fixtures.json`の再構成データと本説明は[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)として扱い、ガイドへの帰属を保持する。外部資料の本文・PDFを収録しない。新規検証コードは本ゲームのMIT Licenseに従う。
