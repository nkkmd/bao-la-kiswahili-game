# 分岐包絡供給案のfixture実装

第五世代の新規供給案を、科学seedを消費せず固定fixtureで検証する実装である。[技術契約](../../../doc/research-generation-5/branch-envelope-preflight-20261013/TECHNICAL_CONTRACT.md)と[解釈確認](../../../doc/research-generation-5/branch-envelope-preflight-20261013/DESIGN_REVIEW.md)を先に読む。

source.cjsは科学用二遷移の照合・第一代表・2-ply screen・既読遮断、independent-source.cjsは独立再生を担当する。closure.cjsは既存BFSへ保存と停止を接続し、independent-closure.cjsは全保存辺を別経路で検算する。storage.cjsはfsync、hash journal、終了reserve、gzip分割を担当する。capacity-smoke.cjsは実上限の保存fixtureだけを実行する。

ローカルとActionsの確認コマンドは以下である。`--check`は保存済み固定fixtureだけを再生する。

```sh
node --test test/g5-branch-envelope.test.cjs
node tools/research/g5-branch-envelope/run.cjs --check
```

run.cjsには科学用CLIがなく、fixture generatorは提案seed範囲を拒否する。新規source、科学候補、旧guard witnessの延長、正式推論、公開AI変更へ使わない。
