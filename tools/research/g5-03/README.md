# G5-03 — 構造供給診断と独立検算

[供給契約](../../../doc/research-generation-5/g5-03/CONTRACT.md)に従い、新規64 sourceを一度だけ生成する。全分岐が2手以内に自然終局する最初のrootを選び、最大8候補を解析前固定する。構造probeを独立再生し、別の幅優先閉包と2解法で完全性と厳密解を確認する。

## 技術確認と再検算

前確認は既知fixtureとtechnical seed 123を使う。後半は保存済み記録の独立再生であり、新規科学区画を生成しない。

```bash
node --test test/g5-03-supply.test.cjs
node tools/research/g5-03/verify.cjs doc/research-generation-5/g5-03/results
```

`core.cjs`のprobeは正準手順で自然終局を確認し、非終局の深さ境界や幅超過で構造不成立を記録する。`verify.cjs`は別の独立エンジンでprobe・draw・source・閉包辺と全解を再確認する。`run.cjs`と`lease.cjs`はソース結合・耐久lease・読取前journal・保存と再実行拒否を扱う。

旧コードを別ディレクトリへ複製して新しい構造選定を追加し、旧ソース・原証拠を変更しない。全probe状態も既読集合に保存し、後続正式holdoutへ流用しない。

## 終了後の保存解記述

`describe-values.cjs` は保存済み独立一致解の全root手を記述し、新しい生成・探索比較・再選定は行わない。事後記述ソース・入力・出力を実行前manifestと別のhashへ結合する。全手同価値の結果を正式関係の非確認へ読み替えない。
