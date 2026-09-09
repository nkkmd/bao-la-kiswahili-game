# PBAI-P9：再現性と検算の入口

正式実行は一度だけ完了した。[SPEC.json](SPEC.json)が機械条件、[検証計画](PROTOCOL.md)が判定の意味を定義する。[SOURCE_LOCK.json](SOURCE_LOCK.json)は74依存ファイルを固定する。MODEL.jsonはP8と同じモデル、KNOWN_IDENTITIES.json.gzは119629行の既知集団の除外記録である。

## 保存記録を確認する

[成果物案内](../../../artifacts/pbai-p9/README.md)から最終判定、独立集計、棋譜再生結果、全195ファイルのアーカイブと索引を参照できる。凍結コミットは003b91095d93f94e03b53ea9c65a433a1f525590である。保存記録の完全性は、リポジトリのルートから次の読取専用コマンドで確認する。

```sh
python tools/engineering/verify-pbai-p9-archive.py
```

これは測定を再実行せず、アーカイブ全件、要約との一致、凍結ソースのhashを確認する。RUN_STARTED.jsonが保存されているため、監視実行を再起動しない。元の監視器も保存済みmarkerがある状態での実行を拒否する。新しい棋力試験には別の条件固定と新規集団が必要である。

## ブラウザ試験の出自

初回の[BROWSER_REPORT.json](BROWSER_REPORT.json)は既知試験78件の原記録であり、[BROWSER_PREPARATION.json](BROWSER_PREPARATION.json)が出自を示す。初回report.commitはGitHubのPRイベント用merge SHAを表すが、checkoutログで確認した実行対象は1c1d8bdeb9c250f9137b61075abcc77b75371e4bだった。原記録は修正していない。準備中に、以降のCIは実際のgit HEADを記録するよう修正した。

[凍結コミットのブラウザ結果](../../../artifacts/pbai-p9/browser-frozen-report.json)は78件の成功を再確認し、実際の実行commitが003b91095d93f94e03b53ea9c65a433a1f525590であることを記録する。[出自](../../../artifacts/pbai-p9/browser-frozen-provenance.json)にはrun、job、artifact、SHA256を保存した。

## 技術試験の範囲

既知試験は `node --test test/pbai-p9.test.js`、外側期限の自己試験は `python tools/engineering/supervise-pbai-p9.py --self-test` で確認できる。静的資産はbuild-pbai-p9-browser.jsで生成した。正式データでモデルや閾値を調整せず、時間制限付き対局を取り直さない。棋譜再生のルールエンジンは実行時と共通であり、独立したルール実装の検証とは区別する。
