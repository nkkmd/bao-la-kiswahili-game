# PBAI-P6 — 再現性と検算

## 固定した入力

[SPEC.json](SPEC.json)が基準commit、公開ファイルhash、候補、入力、教師、学習設定、seed、判定条件を定める。[SOURCE_LOCK.json](SOURCE_LOCK.json)は実行するソースと契約のbyteを固定する。PythonにはNumPy 2.3.5を使用し、学習・線形代数のスレッド数を1にする。公式difflogicライブラリーは使用していない。

## 技術試験

次は人工標本と既知局面だけを用い、新規の評価用seedを開かない。

```sh
node test/pbai-p6.test.js
OPENBLAS_NUM_THREADS=1 python tools/engineering/test-pbai-p6-training.py
python tools/engineering/supervise-pbai-p6.py --self-test
```

公開エンジン、AI、軽量遷移の既存回帰も確認する。

```sh
node test/engine.test.js
node test/ai.test.js
node test/pbai-p4-transitions.test.js
```

## 過去の一回限りの実行

現在は終了済みであり、以下は実行時の記録である。再実行しない。

ソース固定・開始前保存を確認し、開始markerが存在しない場合のみ次を実行する。

```sh
python tools/engineering/supervise-pbai-p6.py
```

既存の`RUN_STARTED.json`を削除しない。開始後に同じコマンドを再実行して測定を取り直すことは禁止する。外側の監視器が連続4時間を監視し、各段階の合否で進行または停止する。

## 検算の役割

`verify-pbai-p6.js`は別記述の乱数実装で採用・棄却sourceを再構成し、保存済み着手を基準ルールエンジンで再生する。教師は同じ固定探索のD3で全件再計算し、時間以外の統計と選択手を照合する。ルールエンジンと探索自体の別実装ではない。時間制限付き対局は再測定しない。

`audit-pbai-p6.py`は、測定行から誤差、時間比、戦術失敗数、実行した場合の対局得点・判定を独立に集計する。サブエージェントを使わず、計算手順を分けて検算する。

## 証拠の保存

実行中は`artifacts/pbai-p6/run/`へ開始marker、seedアクセス、source、教師、モデル、Python期待値、測定行、検算、終了判断を保存する。終了後に全ファイルのSHA-256索引と圧縮archiveを作成し、作業ブランチへ保存する。未完了の測定を完成済みとして扱わない。

## 保存完了の記録

実行ソースcommitは`a47d6391a40005e034a6193be1fbb7a2a57518db`。全22ファイルを[archive](../../../artifacts/pbai-p6/final-evidence.tar.gz)へまとめ、[索引](../../../artifacts/pbai-p6/final-evidence-index.json)と[別経路での照合結果](../../../artifacts/pbai-p6/archive-audit.json)を保存した。開始markerもGitへ保持し、新しいcheckoutでの誤った再実行を防止する。

## 終了後の読み取り専用検算

次のコマンドはarchiveの全byteと集計ファイル、終了判断、再実行防止markerを照合する。局面生成・学習・時間測定は行わない。

```sh
python tools/engineering/verify-pbai-p6-archive.py
```

この検算器は終了後の保存確認用であり、固定した実験ソースへの変更ではない。
