# 新規局面の開発診断ツール

[開発契約](../../../../doc/research-generation-5/g5-01/development/CONTRACT.md)に従う。source生成を伴う実行はActionsとdurable leaseが必要であり、ローカルで割当科学的seedを使用しない。

技術fixtureだけの確認は次で実行する。

```bash
node --test test/g5-01-development.test.cjs
```

保存済み証拠はsourceを生成し直さず、次で検算できる。

```bash
node tools/research/g5-01/development/verify.cjs doc/research-generation-5/g5-01/development/results
```

新規実行は一度だけのtrigger commitを使用する。既存leaseやrun attempt 2以降ではseed読取前に拒否する。中断時の再実行・候補置換・区画追加による救済は行わない。
