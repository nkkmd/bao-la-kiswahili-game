# 応手種別による供給設計ツール

core.cjsは勝敗価値・DTF・評価値・順位を入力に含めない構造判定器と、軌跡の最後の適格rootを固定する関数である。audit.cjsは保存済みグラフだけを走査し、エンジン・solver・source生成器を読み込まない。ここには新規科学実行器がなく、旧内部nodeを候補へ採用しない。[設計入口](../../../doc/research-generation-5/source-design-20261013/README.md)で次の実装・登録の条件を説明する。

再生はリポジトリrootで `node tools/research/g5-source-design/audit.cjs --check` を用いる。fixtureテストは `node --test test/g5-source-design.test.cjs`。JSON field、分類token、ID、hash、コマンドは機械定義として保持する。
