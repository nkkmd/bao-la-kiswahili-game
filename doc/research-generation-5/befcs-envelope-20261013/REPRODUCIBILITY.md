# 全資源包絡の再現性

保存receiptと凍結hashだけを読んで検証する。科学sourceを生成せず、停止した技術sessionも再開しない。

```bash
node --test test/g5-befcs-envelope.test.cjs test/g5-befcs-pipeline.test.cjs
node tools/research/g5-befcs-envelope/run.cjs --bindings
node tools/research/g5-befcs-envelope/verify-remote.cjs
```

GitHubの3保存snapshotと固定prefix hash、marker 1・ACK 0、再試行拒否、実UNKNOWNエラー後のhead不変を照合する。raw Git object復元とCAS拒否理由の検証は未完である。実cgroupのci-liveはActionsで既知固定文字列だけを処理し、停止prefixと各caseのreceiptをalways artifactへ保存する。
