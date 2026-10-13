# 保存済みsource prefixの検算器

`verify.cjs`は途中checkpointとhash journalの保存範囲を独立再生し、未保存の次手やscreenを生成しない。科学gateは未解放のままである。技術fixtureの仕様・結果・境界は[技術文書](../../../doc/research-generation-5/befcs-prefix-20261014/README.md)を参照する。

`fixture.cjs`は既知抽象RAWとseed 1だけの停止試験、`run.cjs`は保存と独立再生、`freeze.cjs`は新規入力と保護入力の固定を担当する。原研究ソースと旧manifestは変更しない。
