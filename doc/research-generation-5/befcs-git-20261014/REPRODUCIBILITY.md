# 再現と取得後検算

科学sourceを使わないローカル検査は次の通りである。

```sh
node --test test/g5-befcs-git.test.cjs test/g5-befcs-pipeline.test.cjs
node tools/research/g5-befcs-git/run.cjs --bindings
node tools/research/g5-befcs-git/run.cjs --check
```

実通信は[専用workflow](../../../.github/workflows/g5-befcs-git-preflight.yml)の専用branch push・attempt 1だけで行う。技術refはrun IDで分け、既存refを拒否する。科学seedの再実行や技術失敗による科学区画補充を再現手順に含めない。PRのworkflowではread権限のlocal検査だけを実行する。

取得artifactの展開先に対して`node tools/research/g5-befcs-git/verify-acquired.cjs <directory>`を実行し、入力manifest、原圧縮証拠、5つのraw bundle、資源と停止境界を再照合する。zip digestと全member hashは取得receiptへ別保存する。旧入力manifestを新hashへ付け直さない。
