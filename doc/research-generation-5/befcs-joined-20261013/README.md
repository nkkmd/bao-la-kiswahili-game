# 共通128 sourceと監督処理の統合

[監督区画preflight](../befcs-supervisor-20261013/README.md)の次工程として、既存の128 source共通worker、host、Git、再検算を、同じ1 GiB親cgroupの配下へ配置する。source・worker・再検算はwork512 MiB、host・Gitはcontrol448 MiB、watchdog64 MiBとし、親のswapも全区画のswapも0にする。Docker daemonを通さず、外部daemonの未計上分を隠さない構成である。

技術fixtureは既知の抽象`FIRST-48`のみを使用する。4 caseは通常完了、host OOM、全体期限停止、終了mirror失敗で、いずれも128件提案の構造を固定し、新しいBao RAW・科学seedは読み込まない。worker本体のmodule/source/PRNG初期化前に、起動時検査済みbootstrapがそのPIDをworkへ移す。watchdogのcgroup停止用descriptorを先に開き、最終時刻にはworkとcontrolのkillを発行してからfsync保存する。短縮期限fixtureは1秒の停止余裕を含めて停止境界を検査する。

結果、限界、CI状態は[報告](REPORT.md)、[再現手順](REPRODUCIBILITY.md)、[再開位置](RESUME_HERE.md)、[品質監査](AUDIT.md)、[結果入口](results/README.md)を参照する。全資源・期限・通信の科学用ゲートが完了したという意味ではない。
