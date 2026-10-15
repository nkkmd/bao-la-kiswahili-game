# 起動から保存までの監督台帳

[技術契約と未完条件](../../../doc/research-generation-5/befcs-lifecycle-20261015/README.md)を参照する。ledger.cjsは既知fixture専用であり、科学hostや実OS監督adapterではない。

```bash
node --test test/g5-befcs-lifecycle.test.cjs
```

実clock・cgroup・保存通信を注入するadapterは未実装である。全役割のcoverageや保存ACKのfieldを模擬入力で満たしても、実OSの証明や科学実行認可にはならない。
