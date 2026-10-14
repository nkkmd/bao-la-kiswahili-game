# 第3版の停止と終了管理

[技術契約](../../../doc/research-generation-5/befcs-remote-stop-v3-20261014/TECHNICAL_CONTRACT.md)に固定条件と限界を示す。旧実装を変更せず、未完成の最終mirror拒否、session停止の結合、失敗時のtimer/watch終了を検証する。科学sourceを生成せず、旧refを再実行しない。実環境CIは専用branchのpush・attempt1だけに限定する。
