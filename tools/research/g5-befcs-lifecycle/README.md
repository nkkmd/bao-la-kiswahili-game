# 起動から保存までの監督台帳

[技術契約と未完条件](../../../doc/research-generation-5/befcs-lifecycle-20261015/README.md)を参照する。ledger.cjsは既知fixture専用であり、科学hostや実OS監督adapterではない。

```bash
node --test test/g5-befcs-lifecycle.test.cjs
```

専用systemd unitで実clock・cgroup・ローカルfsync保存を確認するos-fixture.cjsを追加した。実行は専用Actionsで行い、外側bootstrapと外部保存の接続は未完である。全役割のcoverageや保存ACKのfieldを模擬入力で満たしても、実OSの証明や科学実行認可にはならない。
