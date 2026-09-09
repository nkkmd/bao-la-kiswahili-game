# PBAI-P7 — 再現性と検算

## 記録の正本

実行commitは`89276ddf1fcb06f313403028901c417867755a6a`。[SPEC.json](SPEC.json)がモデルhash、基準commit、seedと比較条件を定め、[SOURCE_LOCK.json](SOURCE_LOCK.json)が依存30ファイルを固定する。開始前にGitHubへ保存した。

[正式結果](../../../artifacts/pbai-p7/final-result.json)は`TECHNICAL-INVALID / HOLD`。[全記録の索引](../../../artifacts/pbai-p7/final-evidence-index.json)と[archive](../../../artifacts/pbai-p7/final-evidence.tar.gz)は382ファイルを保存する。開始markerもGitへ保存した。P6の凍結済みファイルは変更していない。

## 読取専用の確認

次はarchiveの全byte・SHA-256、要約との一致、正式結果と追加調査の区別、凍結ソースhashを確認する。新しい局面生成、学習、対局、時間測定を実行しない。

```sh
python tools/engineering/verify-pbai-p7-archive.py
```

技術試験は人工入力と既知局面だけを使う。

```sh
node test/pbai-p7.test.js
python tools/engineering/supervise-pbai-p7.py --self-test
```

## 正式実行と終了後調査の境界

監視実行は完了している。開始markerを削除して監視器を再実行しない。凍結済み`verify-pbai-p7.js`はJSON読込の0と再計算の−0を区別し、正式検算は停止した。`replay-verification.json`と`independent-audit.json`という正式成功ファイルは存在しない。

終了後の`diagnose-pbai-p7-json-zero.js`は元の検算を基に、ゼロ符号差だけを許容して全件を再照合した。`audit-pbai-p7-postclosure.py`は同じ集計式で記述的に再集計した。出力先は`postclosure-*`であり、どちらも正式結果を変更しない。保存済みの追加調査を上書きする再実行も不要である。

[追加調査の記録](../../../artifacts/pbai-p7/postclosure-incident.json)に診断コードのhashを記載した。追加調査は新しい集団や時間測定を生成していない。固定D3教師の再計算と棋譜再生は同一ルールエンジンを信頼する検算であり、ルールの独立再実装ではない。

[最終報告](PROGRAM_FINAL_REPORT.md)と[成果物案内](../../../artifacts/pbai-p7/README.md)を併せて読む。
