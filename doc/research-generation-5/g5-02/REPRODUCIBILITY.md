# G5-02 — 再現性と証拠索引

## 固定記録と原証拠

[契約](CONTRACT.md)、[SPEC](SPEC.json)、[SOURCE_MANIFEST](SOURCE_MANIFEST.json)、[認可](AUTHORIZATION.json)をソース固定コミット `7b585bbdbb082dca3889bf5acf212b61bc7b4085` に結合する。旧G5-01の読取集合と依存コードもmanifestのバイトhashで固定した。

[trigger](executions/TRIGGER.json)、[消費lease](executions/LEASE.json)、[CI来歴](results/CI_RECEIPT.json)を経て、原証拠をコミット `c6d6a40cd1a1539b28219d57bffe54c5ce776fb2` で保存した。[結果入口](results/README.md)から要約、圧縮着手記録・部分閉包、消費journal、候補固定、独立検算へ進める。artifactの期限後も研究ブランチの原証拠を正本として利用する。

## 許される再確認

次のコマンドはfixtureの技術確認、保存済みsourceと辺の独立再生、保存グラフの事後記述を行う。科学区画の生成を再実行しない。

```bash
node --test test/g5-02-supply.test.cjs
node tools/research/g5-02/verify.cjs doc/research-generation-5/g5-02/results
node tools/research/g5-02/diagnose-saved.cjs doc/research-generation-5/g5-02/results
```

事後診断のソース・出力・入力証拠は[別manifest](results/DIAGNOSTIC_MANIFEST.json)に結合し、実行前manifestを変更しない。保存距離7〜9を完全展開深さや厳密解へ読み替えない。

`CHECKPOINT.complete: false` と最後の `DOMAIN_IN_PROGRESS.json` は実行中に書いた保存境界の原記録である。最終完了はRESULTとVERIFICATION、CI来歴で判断する。これらのcheckpointからの新規解析再開は認可されていない。
