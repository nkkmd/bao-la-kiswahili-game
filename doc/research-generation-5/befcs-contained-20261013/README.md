# 共通workloadを物理資源内へ閉じ込める検証

[前工程](../befcs-envelope-20261013/CI_CONFIRMATION.md)で確認した全資源controllerから、共通workerのsource/独立再生/候補固定/全閉包をhost・Git・mirrorと同じ1 GiB cgroupへ結合する。256 MiBの専用filesystemで研究writeを制限し、host自身のOOM・ENOSPC・deadlineでも外部監督が保存済み証拠を回収する。

新規4検査と前工程15検査、計19件がローカルで合格した。実cgroup・物理容量の6 caseはActions確認待ちである。技術経路は既知抽象fixtureのみで、全RAWを103355件の既読集合へ照合し、科学seedは読まない。

[技術契約](TECHNICAL_CONTRACT.md)と[報告](REPORT.md)、[再現性](REPRODUCIBILITY.md)、[再開位置](RESUME_HERE.md)、[固定証拠](results/README.md)を読む。外部監督の資源と実GitHub認証/CAS、科学用最終freeze・triggerは未完で、科学Study未登録/未実行・科学leaseなし・main/公開AI未変更を保持する。
