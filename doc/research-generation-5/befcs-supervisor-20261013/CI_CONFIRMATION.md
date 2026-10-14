# 監督区画のCI確定

実行入力headは`3efa4e9565b6e46ecffcdeec6f643110202401a7`、treeは`896e7d430981b935a6cafd06569abd859300939f`である。run `38401380127`、job `115309605076`の23検査・4 kernel case・証拠保存・mount終了が合格し、同headのPR側12ワークフローもすべて成功した。

artifact `11815416658`のZIPは75896 byte、SHA256は`c7bdd1a75b200c6ee44bad15a43751200c132f92e014512d3fc86b4c01f209fd`である。取得した原ZIPと全111 fileのhashを保存し、各caseの実上限・raw resource・OOM event・watchdog ready・既知checksum・SIGKILLを独立に検算した。検算器は出力bindingへ固定し、7実行入力と2153保護入力は変更していない。

親memory.peakは最大858345472 byteだった。worker OOMはwork、observer OOMはcontrolのoom_killが各1で、observer OOM後もwatchdogがworker停止を行えた。deadlineでは完了記録がなく、control停止発動は15151.694 msである。15秒以内完了ではなく、約152 msの遅延を保持する。RESOURCE.jsonは停止前の最終sampleで、停止後のsampleを補完しない。

初回head `576a3f9af26fe09202f786cd4a8a939636042038`、run `38401015788`では4 caseが合格した後にlost+foundの権限でartifact保存が失敗した。初回artifactはなく、取得検算済みではない。job log由来の原結果・失敗metadata・第1版manifestを保持し、第2版の権限修正・watchdog移動確認と区別した。

この結果は監督分離機構の技術合格である。共通128 source、Docker daemon、実通信、親OOM後の回収、起動/終了の単一予算、厳密な全体期限、科学用途中checkpoint、最終SPEC/CONTRACT/AUTH/CI/review/専用triggerは未完である。科学seed消費0・leaseなし・Study未登録/未実行、主課題・正式関係未登録/未実行、main/公開AI未変更を維持する。
