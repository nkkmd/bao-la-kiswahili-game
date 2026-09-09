# PBAI-P9：再現性と検算の入口

[SPEC.json](SPEC.json)が機械的な条件、[検証計画](PROTOCOL.md)が判定の意味を定義する。MODEL.jsonはP8と同じモデルである。KNOWN_IDENTITIES.json.gzは過去集団の除外記録であり、新しい勝率データではない。

[BROWSER_PREPARATION.json](BROWSER_PREPARATION.json)はGitHub Actionsの出自、[BROWSER_REPORT.json](BROWSER_REPORT.json)は78件の保存結果である。初回のreport.commitはGitHubのPRイベント用merge SHAであり、実際のcheckoutはcheckedOutCommitに示す1c1d8bdeb9c250f9137b61075abcc77b75371e4bだった。checkoutログで確認し、原記録は修正しない。以降のCIでは実際のgit HEADを記録するよう準備中に修正した。

既知の技術試験は `node --test test/pbai-p9.test.js`、外側期限の自己試験は `python tools/engineering/supervise-pbai-p9.py --self-test` で行う。生成資産は `node tools/engineering/build-pbai-p9-browser.js` で再構築できるが、正式実行中は変更しない。

正式実行は事前固定したコミットで `python tools/engineering/supervise-pbai-p9.py` を一度だけ実行する。RUN_STARTED.jsonが存在する状態では再実行しない。保存棋譜の再生は時間制限付き探索の再測定を行わない。終了後は全raw記録の圧縮アーカイブ、SHA256、ファイル索引、最終判定、独立検算を保存する。
