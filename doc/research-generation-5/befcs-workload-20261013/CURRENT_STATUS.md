# 保存済み全workload統合の現在状態

ローカル58テスト、8統合シナリオ、実256 MiBの共有容量境界が合格した。実1 GiB全8シナリオは通過したが、後片付けの失敗により第1版CI jobはfailureである。host UID/GID対応の第2版CIを確認する。[機械結果](results/RESULT.json)と[保存量](results/CAPACITY_RESULT.json)を参照する。

科学用専用入口は最終freeze不在を検出して拒否する。科学用host/registry/別triggerの結合と最終SPEC・契約・認可範囲・レビューは未完であり、科学seed消費0・科学leaseなし・科学Study未登録/未実行を保つ。

次は[再開条件](RESUME_HERE.md)に従う。技術合格から科学実行を自動起動しない。

現行の固定入力と結果は[第2版契約](TECHNICAL_CONTRACT_V2.md)、[第2版入力](SOURCE_MANIFEST_V2.json)、[第2版結果](results-v2/README.md)を参照する。第1版は[失敗確認](CI_FAILURE_CONFIRMATION_V1.md)とともに保持する。

## 第2版CIの確認完了

[確定記録](CI_CONFIRMATION_V2.md)のpush/PR両CIで、実1 GiB全8シナリオ、共有256 MiB容量、後片付け、artifact保存まで合格した。科学用host/registry/別triggerと最終科学事前固定は次工程に残す。科学seed消費0・科学leaseなし・未登録/未実行を保持する。
