# BEFCSの一度限り運用を調べる技術module

[技術契約](../../../doc/research-generation-5/befcs-operations-20261013/TECHNICAL_CONTRACT.md)に沿い、Git registryの原子的取得、読取前consume、独立履歴検査、byte mirror、process group監督を固定fixtureで検証する。科学用entryはなく、提案科学区画を拒否する。

`run.cjs --check`は保存済みGit bundleと全byteを復元する。`docker-smoke.cjs`はActionsでcontainer OOMと保存prefixを確認する。科学source生成や科学区画再実行に使わない。現在状態と残る統合条件は[研究入口](../../../doc/research-generation-5/befcs-operations-20261013/README.md)を参照する。
