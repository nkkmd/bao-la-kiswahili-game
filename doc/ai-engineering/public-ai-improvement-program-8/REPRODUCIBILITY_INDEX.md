# PBAI-P8 — 再現性と検算

## 記録の正本

実行前固定commitは`4b0cf7a662744ce1dd945213f44a1680f8d4bed5`。[SPEC.json](SPEC.json)がモデルhash、基準commit、新規seedと数値比較契約を定め、[SOURCE_LOCK.json](SOURCE_LOCK.json)が依存44ファイルを固定する。

[正式結果](../../../artifacts/pbai-p8/final-result.json)は`STRENGTH-IMPROVED-IN-FROZEN-DOMAIN`。[全記録archive](../../../artifacts/pbai-p8/final-evidence.tar.gz)と[hash索引](../../../artifacts/pbai-p8/final-evidence-index.json)は381ファイルを保存する。開始markerもGitへ保存した。P6・P7の凍結済み記録は変更していない。

## 読取専用の確認

次はarchiveの全byte・hash、要約と正式結果の一致、凍結ソースを確認する。新しい生成・学習・速度測定・対局を実行しない。

```sh
python tools/engineering/verify-pbai-p8-archive.py
```

技術試験は人工入力と既知局面だけを使用する。

```sh
node test/pbai-p8.test.js
python tools/engineering/supervise-pbai-p8.py --self-test
```

## 正式検算の内容

別記述のPRNGで採用・棄却sourceを再構成し、固定D3教師を再計算した。保存済み全棋譜の合法性・終局・得点、評価値、固定D2/D3の一致を照合し、別のPython処理で指標と判断を再集計した。時間制限付き対局は再測定していない。

JSON保存後の評価数値は有限値だけを許容し、数値ゼロの符号差を同じ値と扱う。実際の数値差は許容しない。モデルと実行中の新旧評価値の比較条件は変更していない。既知のP7診断入力は新規棋力証拠として扱っていない。

## 再実行の制限

監視実行は完了している。開始markerを削除して同じrunを再実行しない。完成済み記録を上書きせず、保存済みarchiveの読取専用確認を使用する。

P8の検算成功でP7の正式判断を変更しない。ルールエンジンは共通の信頼基盤であり、ルールの独立再実装ではない。[最終報告](PROGRAM_FINAL_REPORT.md)と[成果物案内](../../../artifacts/pbai-p8/README.md)を併せて読む。
