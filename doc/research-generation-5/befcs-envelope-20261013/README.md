# hostを含む全資源と通信不明の検証

[前工程](../befcs-pipeline-20261013/CI_CONFIRMATION.md)で合格したworker/host結合から、全資源と通信不明の停止へ進める技術検証である。host、worker、Git、mirror、検算、離脱子を同じ1 GiB cgroupへ入れる。全作業領域の保存と終了予約を数える。全体20分・領域180秒・256 MiBの提案上限は増やさない。

新規10テストと前工程5テストの計15件、実cgroupの3シナリオが合格した。[CI確定](CI_CONFIRMATION.md)で取得証拠と独立prefix/Git blob復元を照合する。実GitHubへの技術marker書込み後の応答喪失では、marker 1件・ACK 0件・session停止・再試行拒否を確認した。実サービスUNKNOWNエラー後のhead不変も確認したが、CAS拒否理由は未確認である。

まず[契約](TECHNICAL_CONTRACT.md)と[報告](REPORT.md)、次に[再現性](REPRODUCIBILITY.md)と[再開位置](RESUME_HERE.md)、[固定証拠](results/README.md)を読む。科学全workloadと最終host配備は未完であり、科学seed 0・科学leaseなし・科学Study未登録/未実行を保持する。
