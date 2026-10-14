# 独立ルール遷移の技術確認ツール

[技術契約](../../../../doc/research-generation-5/g5-01/transition/TECHNICAL_CONTRACT.md)に固定したfixtureだけを扱う。

```bash
node --test test/g5-01-transition.test.cjs
node tools/research/g5-01/transition/run.cjs artifacts/local/g5-01-transition/result.json
```

`runtime-engine.cjs` は基準mainの公開エンジンを固定したコピーである。`independent-engine.cjs` は依存モジュールをimportせず、環状配列で全ルール分類を計算する。

`applyMove` は `guard-free` を既定とし、未完・着手内再帰ではstateをnullにする。runtime照合には `{mode: "runtime"}` を明示する。安全上限による勝敗値を新規の完全解析へ使用しない。

正式な新規seed・局面群の生成入口はまだ実装していない。[開発診断設計](../../../../doc/research-generation-5/g5-01/DEVELOPMENT_PLAN.md)を次の契約化の基準とする。
