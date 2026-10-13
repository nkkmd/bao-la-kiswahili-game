# 統合fixture証拠の入口

結果の保存先はここである。caseごとのSCENARIO、保存bundle、全体TECHNICAL_EVIDENCEと取得CI artifactを登録する。実行head・tree・run・job・artifact digest、取得file数・hash・検算結果はreceiptへ記録する。

通常完了、host OOM、全体停止、終了mirror失敗を区別する。deadline caseはprefix保存のみで独立閉包を行わず、証拠保存後を期限内完了へ変更しない。V1/V2の取得ZIP全体hashとメンバーごとのhashを`CI_FILE_HASHES_*.json.gz`へ固定し、run単位の実行入力・結果要約・artifact情報は`CI_RECEIPT_*.json`へ固定した。GitHub Actions artifactの期限後はこのreceiptだけではZIP本文を復元できないため、必要な再検算より前に原ZIPを保存する。

| 版 | Run / artifact | 実行状態 | receipt |
|---|---|---|---|
| V1 初回 | `38410462042` / `11821731603` | 4 case・PR12 checksとpush run success、digest照合済 | [attempt](CI_ATTEMPT_V1.json) / [receipt](CI_RECEIPT_V1.json) / [file hashes](CI_FILE_HASHES_V1.json.gz) |
| V2 offset修正 | `38411182618` / `11822701127` | 4 case・PR12 checksとpush run success、digest照合済 | [attempt](CI_ATTEMPT_V2.json) / [receipt](CI_RECEIPT_V2.json) / [file hashes](CI_FILE_HASHES_V2.json.gz) |

V1の入力manifestは[凍結コピー](SOURCE_MANIFEST_V1.json)として保持する。取得後validatorと出力bindingは元の実行manifestから分離する。内容の説明は[報告](../REPORT.md)、手順は[再現性](../REPRODUCIBILITY.md)を参照する。
