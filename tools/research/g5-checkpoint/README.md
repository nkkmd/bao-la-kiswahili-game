# 第五世代の中間保存を検算する

[保存範囲と再開条件](../../../doc/research-generation-5/checkpoint-20261014/README.md)を参照する。科学sourceを生成せず、元headとのbytes、原ZIP、保存済みGit/ACK/source/停止、現在文書の相対リンクを読み取り専用で検算する。

```bash
python3 tools/research/g5-checkpoint/verify.py
```

`--hashes-only`ではZIPと保存fileのhashまでを確認し、Git/遷移の独立再検算は省略する。完全検算は上記の引数なしで実行する。

verify-v3-raw.cjsは旧取得後検算器の生Git・ACK・prefix照合手順を第3版専用policyへ接続した別実装である。旧policy・検算器・原結果は変更しない。第3版の既存verify-acquired.cjsとの二経路を照合する。比較したJSONは原ZIP取得後の検算結果であり、新しい実験結果ではない。
