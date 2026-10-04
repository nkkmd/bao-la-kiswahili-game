# 再現・再開手順

## 最初に確認するもの

[事前計画](PROTOCOL.md)、[現在状態](CURRENT_STATUS.md)、[認可根拠](AUTHORIZATION.md)を確認します。機械定義は`tools/research/first-player-gen4/protocol.json`、固定source hashは同ディレクトリの`source-manifest.json`です。

## 実行時のコマンド記録

研究は完了しており、以下は実行時の記録です。完了後は新たな対局を生成せず、後節の保存証拠の復元・再集計を使います。

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

## 完了証拠の復元

科学run `37121863392` / attempt 1と、検証済みartifact `11299644872`が確定証拠です。[保存索引](../../artifacts/first-player-gen4/ARCHIVE_INDEX.json)にZIPと分割ファイル、集計JSONのhashを保持します。保存専用run `37194651908`は成功し、全証拠を研究ブランチへ保存しました。元の科学workflowとsource manifestは変更していません。

リポジトリの研究ブランチから、以下を実行します。作業用ディレクトリへ復元し、保存JSONを上書きしません。

```sh
python3 - <<'PY'
import hashlib, json, pathlib, zipfile
root = pathlib.Path('artifacts/first-player-gen4')
index = json.loads((root / 'ARCHIVE_INDEX.json').read_text())
chunks = []
for item in index['parts']:
    data = (root / item['path']).read_bytes()
    assert len(data) == item['bytes']
    assert hashlib.sha256(data).hexdigest() == item['sha256']
    chunks.append(data)
data = b''.join(chunks)
assert len(data) == index['artifactBytes']
assert hashlib.sha256(data).hexdigest() == index['artifactSHA256']
pathlib.Path('/tmp/fpa-gen4-verified.zip').write_bytes(data)
with zipfile.ZipFile('/tmp/fpa-gen4-verified.zip') as archive:
    archive.extractall('/tmp/fpa-gen4-evidence')
PY
```

その後、凍結したソースで、前節の集計・Python検算コマンドの入力先を`/tmp/fpa-gen4-evidence`として3領域を検算できます。Node再生には全棋譜を使用するため時間がかかります。出力JSONの科学的フィールドを記録済みJSONと比較し、再検算結果を元証拠へ置換しません。Node集計の`provenance`は再検算時のHEAD、Node版、run IDなどを記録するため、元runの記録との全byte一致は要求しません。研究ID、manifest hash、領域件数、群別集計、区間、判断、対応比較が一致することを確認し、実行出典の違いは別途記録します。公開expertの時間制限付き探索そのものを再実行すると棋譜が変わる可能性があるため、再集計の再現と対局生成の完全一致を区別します。

本試験の正式状態は`VERIFIED-COMPLETE-DOMAIN`、別言語の再集計状態は`INDEPENDENT-RECOUNT-PASS`です。ルールと区間計算の完全な独立実装検証はしていません。新しい標本・条件の科学実行は本研究の再開として扱わず、独立研究として事前条件を固定します。
