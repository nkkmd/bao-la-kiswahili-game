# `JEV-BAO-COMP-20260921` — 保存成果物一覧

## 外部バックアップ

リポジトリ直下にあったJev比較関連の配布ZIP、途中結果ZIP、最終結果ZIPを、次のリポジトリ外パスへ保存した。

```text
/home/oruorane/bao-la-kiswahili-game-artifacts/JEV-BAO-COMP-20260921/20260922/
```

全ファイルを元ファイルと`cmp`で照合し、バイト一致を確認した後に、リポジトリ直下の16 ZIPを整理した。無関係なZIPには触れていない。

## バックアップ済みZIP

| ファイル | bytes | SHA-256 |
| --- | ---: | --- |
| `bao-jev-latency-diagnostic-v1.zip` | 9,057 | `05560845d3042856f88c90d3ab76616265d745bc3ad0e5a77a73ed1c6c783e90` |
| `bao-jev-latency-results.zip` | 113,427 | `2760e7231024dc3f9b563f01f491952a61ab10a2f8ee0438cb5342801b235db6` |
| `bao-jev-local-kit-v0.1.0.zip` | 25,607 | `6bda82bdf9c94655929eb02fda84fdb1204d0980ac2b5713ce4a73653c011887` |
| `bao-jev-offline-comparison-results.zip` | 454,661 | `a3136fae3e25696f61bc1d21693c1d0577f81371327279c31ec03ba44c8043bd` |
| `bao-jev-offline-comparison-v1.zip` | 48,550 | `39758ea3ad38031ba10b8693e50e3d2d5c2419fbf72c1b64e26650f14c63c0a0` |
| `bao-jev-pilot-matches.zip` | 91,886 | `7ea2cdabeb0a919a13e187e42d8476c85d0197b388592808d4f6918028c0ade8` |
| `bao-jev-pilot-positions.zip` | 82,175 | `650a4523029945e26e49e6a9e352438f3fee833d049e57669c6bed87a50d195f` |
| `bao-jev-pilot-v2-results.zip` | 155,933 | `f10649349b3c7fce9fa49b3da7a7c5c1216fd0cb78575225ae1d8ff3d93cbb10` |
| `bao-jev-pilot-v2.zip` | 58,985 | `65f86f0d2e493baea98bc7418b080c8620333bc14b3f187149aa6a7369dc465c` |
| `bao-jev-pilot-v3-results.zip` | 363,147 | `4845e4d39f6673a559bdc531fadadcc46ce8bbab61831b8a83df15e68fa925c2` |
| `bao-jev-pilot-v3.zip` | 12,607 | `684124dc950563f87abc2d672b167c1dcbd21fbff1d5ebc225f4c141c9bd5efd` |
| `bao-jev-response-diagnostic-v1.zip` | 9,822 | `f26a76c183e0a946f76d48aa29db62dcb5a9390fe3ae377eefb92c4b41f90b6a` |
| `bao-jev-response-results.zip` | 161,511 | `5b43d054c0f636030ea6aea94fafb272ff1aa19dbe3f33df9bd52a79d113ea8d` |
| `bao-jev-strength-test-plan-v1.zip` | 66,861 | `1f33c5c07d2a35cbdadd685fed1447ff5d5c2d027858216ea53330348887f008` |
| `bao-jev-strength-v1-results.zip` | 4,740,192 | `92e42b0c735bfc48afd5c33e253667e68fd72fd1990efd5d932dc1b74c006b68` |
| `bao-jev-strength-v1.zip` | 97,118 | `9992b8da9feb58db9207b3ddb69e0e885bce46e44b0b9f7108dff90b2db63546` |

`bao-jev-strength-v1-results.zip`は、依頼で示された`bao-jev-strength-v1-results(20260922-001053).zip`に対応する。最終記録に記載されたSHA-256と完全一致し、ZIPのCRCテストも合格した。

## 元の最終記録

リポジトリ直下にあった`Bao_Jev_Final_Record_20260922.md`の原文も同じ外部バックアップ先に保存した。

```text
SHA-256 = b06367649398b7dc974e79c86aa20e32beb0004d53b8b2c51fd3a18d08959496
size = 7,601 bytes
```

リポジトリ内では、照合後の日本語終了報告を[`FINAL_REPORT.md`](FINAL_REPORT.md)として管理する。原文の事実、数値、正式判定、費用、限界を引き継ぎ、リポジトリ保存完了後の状態説明を追加した。

## Gitに追加しない理由

最終ZIPは要求・応答・着手判断など数千ファイルを含む。そのため、Gitには実装、固定計画、manifest、compactな最終集計だけを追加し、生データはハッシュで識別した外部ZIPで保存する。

この選択は生データの削除を意味しない。作業元の展開済み`tools/jev-comparison/results/`もそのまま保持する。
