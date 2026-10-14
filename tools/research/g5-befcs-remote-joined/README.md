# 実Gitと共通128 sourceの結合fixture

既存worker・registry・pipeline・親cgroup/監督を変更せず、新しいtransport guardで停止後の回復書込みも拒否する。科学sourceは使用せず、既知抽象FIRST-48を128回処理する。

[技術文書](../../../doc/research-generation-5/befcs-remote-joined-20261014/README.md)に契約・結果・再開条件を示す。入力を固定した後、専用branch push・attempt1だけで実Gitを実行する。worker module初期化前にworkへ移し、認証environmentをworkerから削除する。
