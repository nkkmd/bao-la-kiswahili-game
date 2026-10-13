# 統合fixture証拠の入口

結果の保存先はここである。caseごとのSCENARIO、保存bundle、全体TECHNICAL_EVIDENCEと取得CI artifactを登録する。実行head・tree・run・job・artifact digest、取得file数・hash・検算結果はreceiptへ記録する。

通常完了、host OOM、全体停止、終了mirror失敗を区別する。deadline caseはprefix保存のみで独立閉包を行わず、証拠保存後を期限内完了へ変更しない。取得後validatorと出力bindingは元の実行manifestから分離する。内容の説明は[報告](../REPORT.md)、手順は[再現性](../REPRODUCIBILITY.md)を参照する。
