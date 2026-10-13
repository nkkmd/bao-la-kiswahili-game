# 一度限り運用preflightの再現方法

SOURCE_MANIFESTとPROTECTED_INPUTSは技術入力と584保護入力をbyte hashで固定する。OUTPUT_BINDINGは保存結果・Git bundle証拠・実行記録を固定する。機械定義・hash・exact commandは言語監査の例外である。

保存記録を再検算するコマンドは次のとおりである。生成器や提案科学seedを実行しない。

```bash
node --test test/g5-befcs-operations.test.cjs
node tools/research/g5-befcs-operations/run.cjs --check
node --test test/g5-branch-envelope.test.cjs test/g5-compact-bfs.test.cjs
```

保存されたGit bundleを新しいrepositoryへ復元し、137 commit・全128 consume marker・8 mirrorを独立に検査する。mirrorの全分割片とfile hash、journal完全prefix、末尾断片、coverage、終了時のsolution nullを確認する。実行時計・RSS・mirror時刻は環境依存であり、同じ数値の再生成を要求しない。原保存byteと履歴の再生を判定基準とする。

実cgroup確認は新Actions workflow内で`docker-smoke.cjs`を使う。artifactにはcontainerの実cap、swap設定、OOMKilled、exit 137、prefix保存とimage IDを残す。fixture imageはNode 24.19.0を指定し、解決されたimage IDを保存する。科学source-freezeで使用するcontainerのdigest確定とは別である。

Git fixtureは隔離bare remoteを使用するため、GitHubの権限や通信障害を含む運用保証ではない。科学区画はまだlease・triggerがなく、再検算を科学生成へ置換しない。
