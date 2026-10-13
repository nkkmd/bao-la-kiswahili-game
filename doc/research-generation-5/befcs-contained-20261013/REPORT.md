# 共通workloadと停止後回収の報告

## 結合した範囲

前工程の固定workerを変更せず、既知128 sourceの生成・独立replay・値を使わない候補固定・全合法手完全閉包・journalsをprimary hostと同じcgroupへ入れる。science driverは未固定拒否のままである。提案20分・領域180秒・1 GiB・256 MiBの上限を増やさない。

研究writeとlocal/remote両Git object・tmp・回収bundleを容量256 MiBのext4へ入れ、終了16 MiBを物理確保する。外部watchdogは通常期限でcase固有のcgroup.killを使い、全体期限ではisolated observer groupも停止する。起動後にnode timerがGitの同期処理で遅れても、別processのwatchdogが監督する構成である。

## ローカルで確認したこと

新規4検査と前工程15検査、計19件が合格した。科学分類・科学seed消費・source数/上限変更の拒否、cgroup v2と対象containerの照合、root/別cgroup拒否、通常/終了/全体時間境界を確認した。実quota・OOM・kernel deadlineの成立はActions取得後に別記録する。

## Actionsで検証すること

通常128 source、最初のsource checkpoint後のhost OOM・ENOSPC・離脱子、外部deadline、worker完了後の終了mirror失敗を検証する。primary停止の後にだけ回収し、consume marker数の不変、未ACK数0または1、独立registryと保存source/候補/閉包再生を確認する。各caseのheader・quota・inspection・watchdog・保存bundleを途中からartifactへ残す。

外部watchdog/observer・Docker daemonはprimary cgroupに含まれない。外部保存・image準備・CI集約と科学全体の予算の関係、実GitHub認証/CAS/remote pack、最終科学事前固定は未完である。科学費用・新規完全領域・勝敗価値差・IID推論を確認した結果ではない。未知をDRAW/0/敗北へ変換せず、103355件遮断・全閉包・救済禁止・主課題と正式関係未登録/未実行、科学seed 0・leaseなし・main/公開AI未変更を保持する。
