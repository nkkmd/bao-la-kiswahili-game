# 専用host通信手順の再現性

固定した実装と管理用byteだけを使い、科学sourceを再生成しない。次の検査は入力・保護入力・出力hashと、4シナリオの保存Git bundleの全履歴・全mirror blobを照合する。

```bash
node --test test/g5-befcs-host.test.cjs
node tools/research/g5-befcs-host/run.cjs --check
node tools/research/g5-befcs-workload/binding.cjs
```

SOURCE_MANIFESTは本hostと技術契約、PROTECTED_INPUTSは先行623入力と第2版固定証拠、OUTPUT_BINDINGは結果byteを対象とする。これらは技術fixtureの固定であり、科学SPEC・認可記録ではない。

科学trigger条件はunit fixtureで文字列を検査するだけで、GitHubの科学leaseを作らない。新hostの全pipeline cgroup receiptは未取得であり、先行receiptと区別する。
