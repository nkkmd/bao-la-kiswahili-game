# 統合fixtureの再現手順

静的policyと既存回帰は次のコマンドで行う。

```sh
node --test test/g5-befcs-joined.test.cjs test/g5-befcs-supervisor.test.cjs test/g5-befcs-contained.test.cjs test/g5-befcs-envelope.test.cjs test/g5-befcs-pipeline.test.cjs
node tools/research/g5-befcs-joined/run.cjs --bindings
```

実cgroupと共通128 sourceはGitHub Actions専用workflowで検証する。Actions内に新規作成した256 MiB通常fileだけをext4としてmountし、`PrivateNetwork=yes`の短命systemd serviceを開始する。そのservice親の1 GiB・swap 0を設定し、自分のcgroup v2へcontrollerを委譲する。cgroup IDを含むcase専用unitだけを許可する。systemdの親serviceが強制停止も担う。

起動順は、hostをcontrolへ置く、work/control/watchの上限を設定する、watchdogをwatchへ置きkill descriptorを開く、readyを確認する、protocol/quarantineを作成する、共通workerを起動前にworkへ移す、の順である。external evidence回収の前にwork/cgroup.procsが空であることを確認する。deadlineの保存bundleはforensic prefixであり、期限内完了ではない。

Actionsの4 case終了後にPR再実行とartifact保管を待ち、CI証拠を取得する。科学seed・科学leaseを使用する実行経路は公開しない。日本語の結果は[報告](REPORT.md)を読む。
