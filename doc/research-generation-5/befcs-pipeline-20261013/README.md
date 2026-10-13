# BEFCSのworkerとhostの結合検証

source生成・独立再生・値を使わない候補固定・全合法手閉包・保存を同じworkerへ接続し、専用hostのlease・読取前consume・稼働中/終了mirrorへ結合する。[技術契約](TECHNICAL_CONTRACT.md)、[報告](REPORT.md)、[再現性](REPRODUCIBILITY.md)、[再開位置](RESUME_HERE.md)を読む。

技術経路では既知の抽象fixtureとseed 1だけを使用し、全RAWを103355件の既読集合へ照合する。科学用driverは専用source・独立source・閉包入口へ配線したが、最終科学freezeがない間は出力・状態・PRNG初期化前に拒否する。科学用hostの資源契約・永続運用への実配備と最終科学事前固定は未完で、科学実行CLIは公開しない。

新規5単体検査を行う。共通hostの直接APIも技術fixtureに限定し、科学経路を未解放のまま保持する。初期の短いfixture時間枠と負荷中の未合格試行を保持し、長い9シナリオはActionsを優先して確認する。実cgroup全体の合格は未確認である。

科学seed消費0・科学leaseなし・BEFCS-STUDY1未登録/未実行、正式関係未登録/未実行、主課題・完全閉包・未知の保持・追加/差替え/上限引上げ/retry禁止、main・公開AI未変更を保持する。
