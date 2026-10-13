# workerとhost結合の再現性

固定入力・保護入力を科学sourceの生成なしで照合する。9 Git bundleの全証拠と出力hashはCI合格後に別固定する。

```bash
node --test test/g5-befcs-pipeline.test.cjs
node tools/research/g5-befcs-pipeline/run.cjs --bindings
```

Git履歴とmirror blob、journal prefix、保存sourceの独立再生、候補固定、閉包辺と完全性を照合する。科学seedは読まず、停止したsourceの未保存続きを生成しない。Actionsのci-liveは既知抽象fixtureだけを実1 GiB cgroupで実行する。
