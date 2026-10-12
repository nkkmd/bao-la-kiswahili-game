# G5-01の技術検証ツール

対象は[技術契約](../../../doc/research-generation-5/g5-01/TECHNICAL_CONTRACT.md)に固定した既知fixtureである。新規対局生成・seed読取・正式推論の入口は実装していない。

```bash
node --test test/g5-01-stage0.test.cjs
node tools/research/g5-01/run.cjs artifacts/local/g5-01-technical
python3 tools/research/g5-01/verify.py artifacts/local/g5-01-technical/result.json artifacts/local/g5-01-technical/verification.json
```

同じ出力先を再利用する場合は `--resume` を指定する。ソース固定とcheckpointが一致しないと拒否する。技術fixtureの再測定には別の出力先も利用できる。科学的な同一証拠の再使用を許可するものではない。

JavaScriptの探索検算は共有ルールエンジン上の別アルゴリズム、Pythonの検算は人工グラフ・順位と損失の意味・RAW識別が対象である。現行Bao全遷移の独立検証とは区別する。
