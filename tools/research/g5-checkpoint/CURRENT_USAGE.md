# 現在のcheckoutで中間保存を監査する

現在のmainでは、リポジトリのルートで次を実行する。完全なGit履歴が必要である。

```bash
python3 tools/research/g5-checkpoint/test-verify-current.py
python3 tools/research/g5-checkpoint/verify-current.py
```

第1のコマンドは固定入力の改変拒否を検査し、第2は原ZIP・保存済みGit・独立検算と現在文書を監査する。科学sourceの生成、旧科学実行、実remote取引は行わない。`--hashes-only`は独立再検算の一部を省略するため、完全監査と区別する。

同じディレクトリのREADME.mdとverify.pyは中間保存のhashに結び付いた旧入力である。現在checkoutでREADME.mdの旧コマンドを実行すると、更新済みworkflowのhash相違により停止する。旧README・旧監査器・旧bindingを変更せず、この文書を現在の入口とする。詳細は[main統合記録](../../../doc/research-generation-5/checkpoint-20261014/MAIN_INTEGRATION_20261015.md)を参照する。
