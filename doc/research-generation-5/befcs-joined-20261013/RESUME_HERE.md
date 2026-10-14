# 共通worker統合の再開位置

V1とV2のSOURCE_MANIFEST・PROTECTED_INPUTSを照合し、5 policy検査・全回帰、4実kernel case、同PRの12 workflow checks、取得artifact digestと全メンバーhashを確定した。[CI receipt一覧](results/README.md)と[実測報告](REPORT.md)を入口とする。失敗・未完fixtureは削除せず、それぞれ入力headとともに保存する。

PR #198で確認した期限caseでは全体停止発動後の同期保存までに約152 msを要した。本段階ではkill descriptorを前置し、workとcontrolの停止命令を同期保存より先に出す。実停止時刻が15秒より前か、marker/ACKが停止後に増えていないか、普通の終了reserveと期限caseで分けて検査する。もしsystemdの末端停止が余裕を越えれば完了とせず、より早い計測済み境界を検討して別fixtureで再検証する。

V2で同じkill descriptorへの反復書込み時にoffset 0を指定し、全12 workflow checkと4 caseがsuccessとなった。completeは128 ACK・独立replay合格、host OOMはACK1で停止・再開なし、deadlineはACK12時点で停止・prefixのみ、mirror失敗は128 ACK後に不完扱いである。

この段階で合格しても、Docker daemonを使う候補経路の資源境界、認証付きremote Git transport、科学途中checkpoint、全起動/終了を含む20分期限保証、最終SPEC/CONTRACT/AUTH/hash/review/別triggerが残る。科学host拒否は維持する。seed消費0・leaseなし・登録/実行なし、追加・差替え・救済・retryなし、main/公開AI未変更で再開する。
