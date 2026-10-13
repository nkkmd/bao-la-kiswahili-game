# 監督区画の再現手順

通常の検査は次のコマンドで行う。科学seedを読まず、変更された固定上限と無関係cgroupを拒否する。

```sh
node --test test/g5-befcs-supervisor.test.cjs test/g5-befcs-contained.test.cjs test/g5-befcs-envelope.test.cjs test/g5-befcs-pipeline.test.cjs
node tools/research/g5-befcs-supervisor/run.cjs --bindings
```

実容量・kernel停止試験は専用ActionsのG5 BEFCS Supervisor Partitionで行う。新規wx作成した通常fileだけをformatし、case専用serviceだけを操作する。既存disk/deviceや共有Docker daemonのcgroupへ停止命令を送らない。入力分類がTECHNICAL-SUPERVISOR-CGROUP-FIXTURE以外、科学seed消費が0以外、固定上限が異なる場合はserviceを開始しない。

systemd serviceはDelegate=yes、MemoryMax=1073741824、MemorySwapMax=0、TasksMax=256、RuntimeMaxSec=25を持つ。25秒はfixtureの15秒watchdogが失敗したときの外側停止であり、期限内完了には数えない。各caseのBOUNDARY.json・RESOURCE.json・WATCH.json・RESULT.jsonと、正常／未知／停止の別記録をartifactへ保存する。

機械出力のfield、canonical token、command、hashは厳密な検算用として英語表記を保持する。fixtureの準備・artifact保存は実測範囲外であり、科学用の単一全体予算が成立したという意味ではない。
