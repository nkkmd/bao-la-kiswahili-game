# 現在のcheckoutで中間保存を監査する

現在のmainでは、リポジトリのルートで次を実行する。完全なGit履歴が必要である。

```bash
python3 tools/research/g5-checkpoint/test-verify-current.py
python3 tools/research/g5-checkpoint/verify-current.py
```

第1のコマンドは固定入力の改変拒否を検査し、第2は原ZIP・保存済みGit・独立検算と現在文書を監査する。科学sourceの生成、旧科学実行、実remote取引は行わない。`--hashes-only`は独立再検算の一部を省略するため、完全監査と区別する。

同じディレクトリのREADME.mdとverify.pyは中間保存のhashに結び付いた旧入力である。現在checkoutでREADME.mdの旧コマンドを実行すると、更新済みworkflowのhash相違により停止する。旧README・旧監査器・旧bindingを変更せず、この文書を現在の入口とする。詳細は[main統合記録](../../../doc/research-generation-5/checkpoint-20261014/MAIN_INTEGRATION_20261015.md)を参照する。

## PR #211の方針更新との照合

2026-10-20のWSL再開監査で、旧保存監査がPR #211のAGENTS.md更新を拒否することを確認した。現在用監査器は方針コミット`d01685a0156e1b56238d24d680d089248720d74b`の祖先性と固定blob `05b34d723d2448ac4e4a7510b39f3bf821ec5b4a`を照合する。AGENTS.mdを無条件の更新許容へ変更せず、追加改変・欠落は拒否する。他の旧保存ファイルは元のblobで照合し、凍結済みverify.py・manifest・bindingを変更しない。

## PR #235の公開ルール案内更新との照合

PR #235の統合commit `1205afe0a2c79c957f5d21bee6b7de47a6665ae4`は公開ルール案内と関連検査を更新した。従来の現在用監査器は旧source全体のbyte保持を要求していたため、`.github/workflows/illustrated-rules.yml`で最初に停止し、その後に続く14ファイルも不一致だった。研究証拠の破損ではなく、正当な後続更新を現在用監査へ対応付けていなかったことが原因である。

現在用監査器は15ファイルについて旧source・更新直前の旧blob、固定統合commitの新blob、現在byteと通常fileであることを照合する。統合commitの祖先性と変更対象集合も確認し、その後の改変・欠落・symlink化は拒否する。旧verify.py・binding・scope・原ZIP・公開ファイル・workflowは変更しない。新規追加ファイルまで旧中間保存が保証するという意味ではなく、本監査は旧sourceの保全と既知の後続更新を区別する。

この監査保守は第五世代研究の凍結解除、契約採用、科学登録・実行の認可ではない。固定入力の監査器テストと既存保存資料の検算だけを行い、新しい科学sourceや外部保存取引を生成しない。
