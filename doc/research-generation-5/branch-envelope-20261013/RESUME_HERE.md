# 分岐包絡供給案の再開位置

設計状態はPROPOSAL-NOT-REGISTRATION-NOT-EXECUTEDである。[提案](PROPOSAL.md)と[資源レビュー](RESOURCE_REVIEW.md)を確認し、次は別Studyのsource実装と、sourceを読まないfixture preflightを行う。

1. 提案名/seed範囲/namespaceが依然未使用であることを登録前に再確認し、承認された場合のみSPEC・契約・source selector・独立再生・AUTHORIZATIONを相互hashで固定する。
2. branch envelopeとfirst eligible root、旧read firewallをfixtureで固定し、winner/解/DTFが候補判定へ到達しないことを独立検査する。
3. 10k-state/128k-edge/180s/1GiB/256MiB capと16MiB reserve、gzip bundle全体256 MiB・各片48 MiB以下・最大6片、checkpoint/journalを負荷fixtureで検算する。閉包は全合法手のまま保つ。
4. 最終source freeze後に技術CI・main/旧記録bytesを確認する。別triggerと永続全区画leaseが seed読取前に成功したときだけ一度実行し、attempt 1と常時保存を固定する。
5. 128 source・最初の8適格rootを全て扱い、候補不足・閉包0・値差0でも追加/置換/retryをせず閉じる。開発データは正式holdoutへ使わない。

現在、seed消費0・leaseなし・source未固定・実行未認可である。正式関係は未登録・未実行、公開AIは未変更。main統合は行っていない。
