# 可逆保存を用いる全閉包BFSの技術ツール

compactはpacked RAWと辺/metadataを分けたBFS、referenceは独立codecと別走査の参照BFSである。referenceのdecoderとjournalの再生器で、元snapshotと同期記録を独立復元する。groupsは共有観測成分を二方式で検算する。

fixturesは既知Baoと固定抽象例だけを提供する。runの `--check` は元の技術結果を再生する。benchmarkと補助observerは固定小グラフの時間/RSSを測る。科学source生成器や科学run再開器ではない。

[技術契約と結果](../../../doc/research-generation-5/bfs-integration-20261013/README.md)を先に読む。旧RAW/手key・未知state null・全閉包要件・原記録を保持する。JSON field・ID・hash・path・コマンドは機械定義として原表記を保つ。
