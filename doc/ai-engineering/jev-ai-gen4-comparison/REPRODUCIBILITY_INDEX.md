# `JEV-BAO-STRENGTH-20260921-v1` — 再現性索引

## 再現と再実行の区別

本Studyで認めるのは、保存済み証拠のオフライン検算である。Jev APIへ新規リクエストを送る再実行は再現に含めず、終了条件により禁止する。

## 基準と固定計画

- 基準commit: `252ad27973dbc2b4b674fba3104e38299ac98e9e`
- 実施ブランチ: `experiment/jev-ai-gen4-20260921`
- 固定計画: [`tools/jev-comparison/strength-v1-design/`](../../../tools/jev-comparison/strength-v1-design/)
- 機械可読プロトコル: [`protocol.json`](../../../tools/jev-comparison/strength-v1-design/protocol.json)
- 固定開始局面と順序: [`openings.json`](../../../tools/jev-comparison/strength-v1-design/openings.json)
- 実行実装: [`strength-v1.cjs`](../../../tools/jev-comparison/strength-v1.cjs)
- 実装manifest: [`strength-manifest.json`](../../../tools/jev-comparison/strength-manifest.json)
- 無課金検証結果: [`strength-verification.json`](../../../tools/jev-comparison/strength-verification.json)

固定計画ZIPと配布実装ZIPの各memberは、作業ツリーの対応ファイルとバイト一致した。manifest対象の既存ファイルは終了記録作成時に変更していない。

## Gitで保存する結果

| 証拠 | パス | SHA-256 |
| --- | --- | --- |
| 最終集計 | [`summary.json`](../../../tools/jev-comparison/results/strength-v1/summary.json) | `40043ea6c6b882e477c89fc048886738b8ddf293ea593611355b306ed72fdd26` |
| 仕様識別 | [`plan.json`](../../../tools/jev-comparison/results/strength-v1/plan.json) | `498761b525c83d8cfdeab4bf964cda0ee7c8dae9ef0ad1428403f14393f96c4e` |
| preflight | [`preflight.json`](../../../tools/jev-comparison/results/strength-v1/preflight.json) | `5bb0cd497f5cd5f077c7c5c849ecdd33751a0c8c74d505d0a16ee4fff1ee8774` |
| 実行環境 | [`environment.json`](../../../tools/jev-comparison/results/strength-v1/environment.json) | `ed05b8c45fbf2c04e8b7a5913412122155741d02b6944f7fc24e6c11149cd66d` |

これらは最終結果ZIPの同名memberとバイト一致する。`results/`のその他の生データは意図的にGit管理対象外とし、次の外部アーカイブで保存する。

## 生データの保存先

作業元端末のリポジトリ外保存先:

```text
/home/oruorane/bao-la-kiswahili-game-artifacts/JEV-BAO-COMP-20260921/20260922/
```

最終結果ZIPは作業元で`bao-jev-strength-v1-results.zip`という名前だった。依頼時の`bao-jev-strength-v1-results(20260922-001053).zip`と対応するファイルで、SHA-256は次のとおりである。

```text
92e42b0c735bfc48afd5c33e253667e68fd72fd1990efd5d932dc1b74c006b68
```

このZIPは3,094ファイル、非圧縮23,539,219 bytes、ZIP 4,740,192 bytesである。主な内訳は、棋譜68ファイル、新規棋力試験の要求627ファイル、保存応答627ファイル、着手判断1,449ファイル、費用台帳1ファイルである。

展開済みの棋譜・要求・応答・判断は作業ツリーの`tools/jev-comparison/results/`にも残し、`.gitignore`により生データの大量commitを避けた。生データ自体は削除していない。

費用台帳の作業原本は次のパスにある。

```text
.git/jev-comparison/JEV-BAO-COMP-20260921/budget.jsonl
```

台帳のSHA-256は`1a04d5cb0f9e9e48d184513003fc6280a3ec76f868906b50c5921941c2e84f7e`で、最終ZIP内の`audit/budget.jsonl`とバイト一致する。原本とZIP内コピーのどちらも初期化しない。

## オフライン検算

無課金の実装検証は次で実行できる。このコマンドは模擬HTTP応答と一時台帳を使い、実APIを呼ばない。

```bash
node tools/jev-comparison/strength-qa.cjs
```

保存済み結果の内容確認により、正式集計、ペア別勝敗、着手数、API応答数、探索深度・時間の記述統計を再計算できる。ただし、`--live`を含むコマンドは実行しない。
