# 第五世代研究 — 再現性の索引

更新日: 2026-10-12（日本時間）

## G5-01 Stage 0の再現資料

- [技術契約](g5-01/TECHNICAL_CONTRACT.md)・[機械用契約](g5-01/STAGE_0_SPEC.json)。
- [実行前レビュー](g5-01/PREEXECUTION_REVIEW.md)・[技術認可](g5-01/STAGE_0_AUTHORIZATION.json)。
- [使用ソースのbyte hash](g5-01/SOURCE_MANIFEST.json)。
- [測定結果](g5-01/results/stage-0/result.json)・[Python検算](g5-01/results/stage-0/verification.json)。
- [Actions来歴](g5-01/results/stage-0/CI_RECEIPT.json)・[技術検証報告](g5-01/STAGE_0_REPORT.md)。
- [実行コマンドとツールの範囲](../../tools/research/g5-01/README.md)。

実行前固定コミットは `885e3c4152b6979a70a20755c8bf064b8d4dd29c`。ソースmanifestを照合してから、別のローカル出力先で技術fixtureを再現する。core hashから所要時間・メモリ・環境来歴は分離してある。

保存済み結果の検算は次で実行する。これは新規科学的seedを使用しない。

```bash
python3 tools/research/g5-01/verify.py doc/research-generation-5/g5-01/results/stage-0/result.json
```

新規局面、科学的seed、正式標本、正式検定の成果物はまだ存在しない。
