# 設計と監査の再現性

## 入力と保持範囲

基底はc4ce50e645ece9eee070b775d1114de430ef6f10、ブランチはresearch/g5-reply-mode-source-design。[SOURCE_MANIFEST.json](SOURCE_MANIFEST.json)で新しい判定器・監査器・fixture・workflow・設計JSON、旧3 Studyの圧縮証拠/要約/検算、準備レビューの入力manifest/結果/bindingをSHA-256結合する。旧source manifestからも原契約・ソース・認可・消費・検算へ辿れる。

[RESULT.json](results/RESULT.json)は構造集計で、[RESULT_BINDING.json](results/RESULT_BINDING.json)はそのバイトhashである。原圧縮証拠を書き換えず、新しい結果を別directoryへ保存した。[ツール入口](../../../tools/research/g5-source-design/README.md)を参照する。

## 再生コマンド

リポジトリrootでNode 24を用いる。次は科学seedを消費しない。

```sh
node --test test/g5-source-design.test.cjs
node tools/research/g5-source-design/audit.cjs --check
node tools/research/g5-readiness/review.cjs --check
```

最後のコマンドは旧4 Studyの保存証拠の一時コピーでverifierを再生し、原VERIFICATIONと同じバイトを確認してコピーを削除する。監査workflowはcontents readである。科学trigger・永続lease・新規区画・新規閉包は本設計に存在しない。
