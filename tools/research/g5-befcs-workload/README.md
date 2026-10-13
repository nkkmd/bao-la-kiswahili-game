# BEFCSの保存済み全workloadと科学入口の境界

[技術契約](../../../doc/research-generation-5/befcs-workload-20261013/TECHNICAL_CONTRACT.md)に従い、128件の保存済み技術source再生と8固定閉包を、共有保存予算・読取前marker・mirror・時間監督へ結合する。新規science seedやfixture trajectoryを生成しない。

shared-storeは全directoryの実byteとatomic temporaryを合算する。capture-treeは入れ子pathとjournal prefixを保持する。workerは固定byteを独立再生し、runは隔離Git registryと保存証拠の検算を担当する。independent-registryは主registryをimportしない。

scientific-source、independent-scientific-source、scientific-closureは専用科学入口であり、科学用fixture生成器を呼ばない。science-gateは最終固定ファイルの不在で初期化前に拒否する。科学host/registry/別triggerへの結合は未完である。[報告](../../../doc/research-generation-5/befcs-workload-20261013/REPORT.md)と[再開条件](../../../doc/research-generation-5/befcs-workload-20261013/RESUME_HERE.md)を参照する。

現在のCLIは第2版manifest/結果を選ぶ。第1版の機械原記録を保持し、host UID/GIDでcontainerを動かして後片付けも確認する。[版の差分](../../../doc/research-generation-5/befcs-workload-20261013/TECHNICAL_CONTRACT_V2.md)を参照する。
