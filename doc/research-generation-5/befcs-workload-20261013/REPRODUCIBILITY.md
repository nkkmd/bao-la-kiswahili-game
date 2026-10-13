# 保存済み全workload統合の再現性

[SOURCE_MANIFEST](SOURCE_MANIFEST.json)は新module・test・workflow・技術契約と保護manifestを固定する。[PROTECTED_INPUTS](PROTECTED_INPUTS.json)は元の584入力と追加技術記録を固定する。[OUTPUT_BINDING](OUTPUT_BINDING.json)は結果、容量記録、Git bundleを含む圧縮証拠を固定する。

以下は保存済みbyteだけの独立検算であり、科学生成を起動しない。

```sh
node tools/research/g5-befcs-workload/binding.cjs
node --test test/g5-befcs-workload.test.cjs
node tools/research/g5-befcs-workload/run.cjs --check
```

Actionsの`--ci-live`は固定技術byteの128件再生と固定抽象閉包8件を実1 GiB cgroupで反復する。論理番号は隔離された技術registryにだけ使用し、科学seedを読まない。host mirrorと独立registry検算の資源は科学workerのcgroup外にあり、別に報告する。科学trajectoryを生成する入口は最終freeze不在で拒否する。

blob再利用版の独立履歴検算は主registryをimportせず、各新mirrorのcommit tree・blob SHA・file hashを照合する。一度一致したblobだけを再利用し、元の137 commitの結果とも一致した。保存mirrorから復元する際にも内容hashを確認する。
