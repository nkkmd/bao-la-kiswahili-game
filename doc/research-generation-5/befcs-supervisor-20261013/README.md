# 監督処理を含むメモリ区画の技術検証

前工程の[物理容量・停止後保存](../befcs-contained-20261013/README.md)では、primaryの1 GiBとは別にobserver・watchdog・Docker制御が動いていた。本工程は、処理と監督を親cgroupの合計1 GiBへ収めるための最小構成を検証する。科学研究の実行ではない。

親の上限は1073741824 byte、swapは0である。workへ768 MiB、controlへ192 MiB、watchへ64 MiBを割り当てる。親上限もkernelで設定し、親自身のresidentをcontrolへ移す。Gitの子プロセスとfile cacheも対応するcgroupに計上される。watchdogはcontrolとは別区画に置き、observerのOOM後も停止処理を継続する。

既知文字列のメモリfixtureを、正常終了・worker OOM・observer OOM・期限停止の4 caseで試す。15秒の短縮fixture、通常期限5秒は技術試験専用であり、科学提案の全体20分・終了180秒を変更しない。証拠は専用256 MiB ext4へ書く。

現在は実装済みでCI実測待ちである。結果は[報告](REPORT.md)、手順は[再現性](REPRODUCIBILITY.md)、次工程は[再開位置](RESUME_HERE.md)、品質監査は[監査](AUDIT.md)、保存証拠は[結果入口](results/README.md)で追える。

共通128 sourceの処理・Docker daemon・認証付きGitHub通信をこの親cgroupへ統合する工程は残る。filesystem準備・外側のsystemd起動／状態取得・artifact保存はこの短縮fixtureの実測範囲外である。全資源ゲートの完了とは判定しない。科学seed消費0・leaseなし・未登録/未実行を維持する。
