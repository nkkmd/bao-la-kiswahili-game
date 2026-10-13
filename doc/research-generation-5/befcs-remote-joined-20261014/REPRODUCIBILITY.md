# 再現と取得後検算

開始前の拒否・旧入力と途中prefix検算は次で確認する。

```sh
node --test test/g5-befcs-remote-joined.test.cjs test/g5-befcs-joined.test.cjs test/g5-befcs-pipeline.test.cjs
node tools/research/g5-befcs-remote-joined/run.cjs --bindings
```

local bare Gitで共通128 sourceを再検証する場合は`local.cjs`を使用する。これは実認証・kernel資源の検証ではない。固定結果はresultsのLOCAL_RESULT・LOCAL_EVIDENCEと別出力bindingへ保存する。

実認証は[専用workflow](../../../.github/workflows/g5-befcs-remote-joined-preflight.yml)の専用branch push・attempt1だけで、5 caseを別matrix jobへ分けて行う。各jobは独自の1 GiB cgroupと256 MiB filesystemを使用する。科学実行の予算をcase数分へ増やさない。

取得artifactの展開先は`node tools/research/g5-befcs-remote-joined/verify-acquired.cjs <directory>`で検算する。ZIP digest・全member hash・run/head/attempt・raw bundle・resource・stop記録をCI receiptへ別固定する。失敗fixtureを削除・再分類せず、旧入力manifestを付け直さない。
