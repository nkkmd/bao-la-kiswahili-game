# 再現・再開手順

## 最初に確認するもの

[事前計画](PROTOCOL.md)、[現在状態](CURRENT_STATUS.md)、[認可根拠](AUTHORIZATION.md)を確認します。機械定義は`tools/research/first-player-gen4/protocol.json`、固定source hashは同ディレクトリの`source-manifest.json`です。

## 技術テストと実行

次のコマンドはリポジトリ直下で実行します。最初に凍結済みsource hashが一致することを確認します。

```sh
node --test test/first-player-gen4.test.cjs
node tools/research/first-player-gen4/run.cjs diagnostic artifacts/first-player-gen4/run
node tools/research/first-player-gen4/run.cjs pilot artifacts/first-player-gen4/run
node tools/research/first-player-gen4/run.cjs formal artifacts/first-player-gen4/run 0 fixed
node tools/research/first-player-gen4/run.cjs formal artifacts/first-player-gen4/run 0 expert-uniform
node tools/research/first-player-gen4/run.cjs formal artifacts/first-player-gen4/run 0 expert-top3
node tools/research/first-player-gen4/run.cjs sensitivity artifacts/first-player-gen4/run
```

正式試験は最後の3つのformalコマンドについてshard 0〜63を実行します。workflowは予備試験合格後に自動的に全shardを実行し、完走後に集計・再生・Python検算を行います。

## 保存点と中断

workflow名は「AI-GEN4 先攻後攻差追加研究」、ファイルは[追加研究workflow](../../.github/workflows/first-player-gen4.yml)です。研究ブランチを対象とするPRの初回作成だけで自動開始します。後続の文書更新では重複実行しません。

各jobのartifactは`fpa-gen4-`で始まり、phase、family、shard、attemptを名前に含みます。保持期限は90日です。失敗jobだけを再実行すると、同じrunの前回attemptの保存点を復元します。成功済みjobを全て再実行して結果を置換しません。中断時も保存点をuploadする設計ですが、runner自体が失われた場合の最後の未保存処理は保証されません。

別runへ移す場合は、元runの保存artifactを必ず手元に復元して同じコマンドで継続します。workflow_dispatchで何も復元せずに本試験を再開始しません。保存済み完了棋譜を最優先に保持し、ソースhash不一致・異なる同一ID記録は拒否します。

## 集計と別言語検算

すべてのartifactを1つのディレクトリへ展開し、以下を実行します。階層は保持してよく、集計器が再帰的に検索します。

```sh
node tools/research/first-player-gen4/aggregate.cjs aggregate artifacts/first-player-gen4/evidence formal
python3 tools/research/first-player-gen4/verify.py artifacts/first-player-gen4/evidence formal
node tools/research/first-player-gen4/aggregate.cjs report artifacts/first-player-gen4/evidence
```

`pilot`と`sensitivity`もそれぞれ同じ集計・検算を行います。欠損、部分対局、改変、開局再生成不一致があれば正式集計を拒否します。Nodeによる全棋譜再生と、Pythonによる独立再集計を区別して記録します。

## 最終保存

科学実行終了後、artifactを取得し、報告・検証JSON・hash付きの圧縮棋譜を`artifacts/first-player-gen4/`へ保存します。完了報告、現在状態、研究ログ、中央索引を一致させ、日本語品質ゲートを確認して研究を閉じます。
