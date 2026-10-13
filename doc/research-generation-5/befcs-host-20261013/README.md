# BEFCSの専用host通信手順の検証

科学用hostへの接続を段階的に進めるため、全区画lease、必要mirror、読取前consume、remote再照合、読取許可の順序を独立した状態機械へ実装した。[技術契約](TECHNICAL_CONTRACT.md)、[報告](REPORT.md)、[再現性](REPRODUCIBILITY.md)、[再開位置](RESUME_HERE.md)を読む。

これは**host通信手順だけの技術検証**である。保存済み全workloadの[実cgroup合格](../befcs-workload-20261013/CI_CONFIRMATION_V2.md)は保持するが、新hostと科学workerの全体結合や、GitHub上の科学registryの稼働保証へ読み替えない。

BEFCS-STUDY1は未登録・未実行で、科学seed消費0、科学leaseなしである。103355件遮断、最大8候補、全合法手完全閉包、未知の保持、追加・差替え・上限引上げ・retry禁止を保つ。正式関係は未登録・未実行、主課題は勝敗価値損失のまま、main・公開AIは未変更である。

[host通信手順のCI確定](CI_CONFIRMATION.md)で11テストと保存証拠の全step合格を確認した。科学pipeline全体の合格ではなく、科学workerの結合は[次の再開位置](RESUME_HERE.md)に残す。
