# G5-02 — 供給診断の実行・検算ツール

[研究契約](../../../doc/research-generation-5/g5-02/CONTRACT.md)の固定32 sourceと最大8候補を一度だけ実行する。新規科学区画はActionsのdurable lease取得後に限って生成する。

## 技術確認と保存記録の検算

次の前確認は既知fixtureと固定technical seed 123だけを使う。後半のコマンドは保存済み証拠を独立エンジンで再生し、新規sourceを生成しない。

```bash
node --test test/g5-02-supply.test.cjs
node tools/research/g5-02/verify.cjs doc/research-generation-5/g5-02/results
```

`core.cjs`は旧読取集合、source選定、閉包、資源停止、共有群を扱う。`run.cjs`はソース結合・leaseを検査し、消費journal・候補固定・checkpoint・圧縮証拠を保存する。`verify.cjs`は記録した全source、全保存辺、上限到達時の子状態、完全閉包の解、読取集合を照合する。`lease.cjs`は研究ブランチの既存leaseとattempt 2以降を拒否する。

既存のG5-01実装を独立Study用に複製し、旧ソースを変更せず、旧読取重複の停止と未収容子状態の証跡を追加した。依存元のエンジン・識別・retrograde実装は固定manifestで結合する。
