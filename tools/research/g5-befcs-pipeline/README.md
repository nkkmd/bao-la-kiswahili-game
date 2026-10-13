# BEFCSのworkerとhost結合

[技術契約](../../../doc/research-generation-5/befcs-pipeline-20261013/TECHNICAL_CONTRACT.md)に従う。driversは技術/科学の入口を分離し、workerは共通のsource・候補・閉包処理、sessionは稼働中mirrorも含む通信順序、runは技術host・保存・独立再生を担当する。

科学driverは最終freeze不在で初期化前に拒否する。科学用hostの資源レビュー・実配備と最終固定が未完のため、科学実行CLIは提供しない。次は[再開位置](../../../doc/research-generation-5/befcs-pipeline-20261013/RESUME_HERE.md)を読む。
