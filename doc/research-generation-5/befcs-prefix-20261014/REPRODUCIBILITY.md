# 再現手順

次の検査は科学sourceを初期化せず、保存済み抽象RAWだけを使用する。

```sh
node --test test/g5-befcs-prefix.test.cjs test/g5-befcs-pipeline.test.cjs
node tools/research/g5-befcs-prefix/run.cjs --bindings
node tools/research/g5-befcs-prefix/run.cjs --check
```

技術fixtureを新しい一時出力へ実行する場合は`node tools/research/g5-befcs-prefix/run.cjs --ci-fixture`を使用する。結果は`artifacts/local/befcs-prefix`へ保存する。科学契約の追加、科学gateの偽造、科学seedの再実行を再現手順に含めない。

入力はSOURCE_MANIFEST、旧保護入力はPROTECTED_INPUTS、出力はOUTPUT_BINDINGへ別固定する。旧manifestを新hashへ付け直さない。GitHub Actionsは[専用workflow](../../../.github/workflows/g5-befcs-prefix-preflight.yml)で実行し、途中で会話が途切れても結果をartifactへ残す。
