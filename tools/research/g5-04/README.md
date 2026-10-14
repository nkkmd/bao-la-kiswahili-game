# G5-04 — 二段階構造選定と独立完全解析

[契約](../../../doc/research-generation-5/g5-04/CONTRACT.md)に従い新規128 sourceを一度だけ生成する。2手以内に全分岐が自然終局するrootを除外し、4手以内で全分岐が閉じる最初のrootを選ぶ。全合法手幅8以下の最大4681状態・4680辺を保証し、最大8候補を解析前固定する。

## 技術確認と再検算

前確認は既知fixture・technical seed123・抽象的な構造判定を使う。保存証拠の再検算は新規科学区画を生成しない。

```bash
node --test test/g5-04-supply.test.cjs
node tools/research/g5-04/verify.cjs doc/research-generation-5/g5-04/results
```

`core.cjs`のscreenは深さ2と4の全手構造probeを分離する。`verify.cjs`は独立エンジンで両probeと選定順・source・閉包・全解・既読集合を再生する。`run.cjs`と`lease.cjs`はソース結合、耐久lease、読取前journal、候補固定・checkpoint・保存、再実行拒否を扱う。

旧実装を別ディレクトリへ複製し、二段階の構造選定を追加した。旧ソースと原証拠を変更しない。両probeと非採用局面も既読として保存し、後続正式holdoutへ流用しない。

## 保存解の記述

`describe-values.cjs` は保存済み独立一致解の全root手だけを記述し、新規生成・探索比較・再選定は行わない。ソース・入力・出力を実行前manifestと別のhashに結合し、勝敗価値差と同価値内DTF差を分離する。
