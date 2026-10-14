# 保存証拠の再現手順

原ZIPは先行文書directoryのresults-v1/results-v2に保存する。大きい2 ZIPはZIP_PARTSの順序で連結する。分割片hash、復元ZIP hash、GitHubのdigest、全member hashを照合する。実remote接続は不要である。

```sh
node tools/research/g5-befcs-remote-joined/run.cjs --bindings
python3 tools/research/g5-befcs-remote-review/check.py --hashes-only
python3 tools/research/g5-befcs-remote-review/check.py
```

最後の命令は一時directoryに展開し、10 caseを直列に独立検算する。source/prefixは最後のmirrorとローカル保存分を別々に照合し、原RESULTのないcaseを技術完了にしない。科学source生成・PRNG・remoteのconsume/mirror・既存refの再試行を行わない。検算は科学実行の予算外の取得後作業である。

BINDINGSは旧入力と今回の検算器・取得結果を別固定し、元の実行入力へ付け直さない。read-only CIが成功しても、第1版期限と第2版2 caseのfailureは残る。
