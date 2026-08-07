# E-011 / E-017 正式実行ガード — 隔離環境検証チェックポイント

日付: 2026-08-01  
Status: Local isolated validation passed / GitHub Actions latest runs pending

## 目的

GitHub Actionsのキュー待機とは独立に、最新の`research/forced-capture-regime-analysis`ブランチを隔離Gitリポジトリへ展開し、E-011およびE-017の正式実行ガードと判定器の回帰テストを実行する。

この検証では正式自己対局corpusを生成しない。

## 実行方法

1. 最新ブランチのarchiveを取得。
2. 一時ディレクトリへ展開。
3. 新規Gitリポジトリとして初期化し、snapshot commitを作成。
4. 次のNode.js回帰テストを実行。

```text
test/phase-transition-independent-confirmation.test.js
test/phase-transition-independent-confirmation-formal.test.js
test/phase-transition-robustness.test.js
test/phase-transition-robustness-formal.test.js
```

Git初期化を行う理由は、formal guardテストが実際の`git check-ignore`、clean worktree、固定パス規則を検証するためである。

## 結果

4テスト群すべて成功。

検証対象:

- E-011条件別・全体判定ロジック
- E-011 repository許可フラグと完全一致承認トークン
- E-011 C0–C4順序制約
- E-011 formal corpus rootのGit ignore実照合
- E-011 preregistration / execution policy path・SHA-256固定
- E-011 formal integrity成功前の評価拒否
- E-017 trajectory-ply重複除去と構造availability判定
- E-017 `confirmed / not-confirmed / inconclusive`分岐
- E-017 operational failureの`inconclusive`成果物化
- E-017 repository許可フラグと完全一致承認トークン
- E-017 formal corpus rootのGit ignore実照合
- E-017 preregistration corpusとexecution lock corpusの一致
- E-017 source commitとformal integrityの一致

## 解釈

- 最新ブランチのformal guardコードは隔離Git環境で回帰テストを通過した。
- GitHub Actionsの最新runがqueuedである事実は、この隔離検証によって置き換えない。
- Actions成功としては記録せず、`isolated validation passed / Actions pending`と区別する。
- E-011正式2000局およびE-017正式1000局は生成していない。
- 両実験の`formalExecutionAllowed`は`false`のまま維持する。

## 次工程

1. 最新GitHub Actions runが開始された場合、その結果を別チェックポイントへ記録する。
2. 明示的開始承認なしにE-011またはE-017の正式corpusを生成しない。
3. 承認後は対象実験の許可フラグを別コミットで有効化し、そのコミットを固定してexecution lockを生成する。
