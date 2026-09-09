# PBAI-P8 — 保存済み成果物

[正式結果](final-result.json)は`STRENGTH-IMPROVED-IN-FROZEN-DOMAIN`。新規最終512局295勝217敗と正式検算により、固定条件内の棋力改善を確認した。公開判断は`NO-RELEASE / KEEP-AI-GEN3`である。

## 記録の内容

- [全記録archive](final-evidence.tar.gz)と[SHA-256索引](final-evidence-index.json) — 381ファイルの生記録と正式検算
- [開発用評価](development-summary.json)と[検証用評価](validation-summary.json) — 速度・誤差・戦術の要約
- [開発対局](development-matches.json)、[検証対局](validation-matches.json)、[最終対局](holdout-matches.json)
- [正式な全件照合](replay-verification.json)と[独立集計](independent-audit.json)
- [開始marker](run/RUN_STARTED.json) — 同じrunの再実行を防ぐ記録

archiveのSHA-256は`f86937ee9058bb3446cd70b05278bd2d3578fdbb9ffc4695beba4fcb628866ac`。実行前固定commitは`4b0cf7a662744ce1dd945213f44a1680f8d4bed5`。各ファイルのbyte数とhashは索引を正本とする。

## 読取専用の確認

```sh
python tools/engineering/verify-pbai-p8-archive.py
```

新規生成・学習・時間測定・対局は実行しない。保存済み正式結果と開始markerを保持し、取り直しを行わない。

[最終報告](../../doc/ai-engineering/public-ai-improvement-program-8/PROGRAM_FINAL_REPORT.md)と[再現性](../../doc/ai-engineering/public-ai-improvement-program-8/REPRODUCIBILITY_INDEX.md)を参照する。
