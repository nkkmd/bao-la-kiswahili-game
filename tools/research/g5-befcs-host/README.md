# BEFCSの専用host通信手順

[技術契約](../../../doc/research-generation-5/befcs-host-20261013/TECHNICAL_CONTRACT.md)に従い、sessionは全区画leaseから読取許可までの順序を監督する。hostは科学用最終gate・専用trigger条件のadapterで、未固定時はGit接続前に拒否する。runは科学PRNGを持たない技術fixtureの保存と独立再生だけを行う。

既存技術registryの科学範囲拒否は変更しない。科学worker/container・全資源監督・実行trigger・最終科学固定は[次の工程](../../../doc/research-generation-5/befcs-host-20261013/RESUME_HERE.md)に残る。科学sourceをこのCLIから起動できるとは解釈しない。
