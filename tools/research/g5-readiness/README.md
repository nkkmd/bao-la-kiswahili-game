# 第五世代 — 読取専用の準備再評価

[レビュー入口](../../../doc/research-generation-5/readiness-review-20261012/README.md)に沿い、終了済み4 Studyの原記録を再検算し、保存全解の情報量を記述する。新規source、候補再選定、探索比較、正式関係実行は行わない。

## 再現コマンド

```bash
node --test test/g5-readiness.test.cjs
node tools/research/g5-readiness/review.cjs --check
```

core.cjsは勝敗価値とDTFを分離し、未知を0にせず、source/領域共有の推移的成分をまとめ、条件付き精度と証拠・情報のgateを評価する。合格でもformalAuthorizationはfalseのままである。

review.cjsは入力hash・consume-once記録・互いに異なるseed区画を確認し、原結果の一時コピーで4 verifierを順番に再生する。原検算の同一バイトを確認して一時コピーを削除する。保存された全解から内部局面も記述するが、新たな候補として選ばない。

--writeはレビュー出力の保存を行う保守用コマンドで、科学実行や区画消費を開始しない。CIはcontents read権限で--checkだけを実行する。
