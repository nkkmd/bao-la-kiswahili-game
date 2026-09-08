# PBAI-P7 — 再現性と検算

## 固定するもの

[SPEC.json](SPEC.json)がモデルhash、基準commit、seed、比較条件を定める。[SOURCE_LOCK.json](SOURCE_LOCK.json)は実行コードとP6から使う依存コードのhashを固定する。P6の凍結済みファイルは変更しない。

## 技術試験

次は人工入力と既知局面だけを使い、新しい評価用局面を生成しない。

```sh
node test/pbai-p7.test.js
python tools/engineering/supervise-pbai-p7.py --self-test
```

## 監視実行

開始前保存が完了し、開始markerがない場合のみ実行する。

```sh
python tools/engineering/supervise-pbai-p7.py
```

開始後にmarkerを削除して再実行しない。全工程の連続4時間監視、子プロセスの停止、同一runの上書き拒否を使う。実行中の記録は`artifacts/pbai-p7/run/`へ逐次保存し、終了後にarchive・索引へまとめる。

## 検算の役割

`verify-pbai-p7.js`がsource、教師、保存された固定深度一致、対局の合法性・得点を照合し、`audit-pbai-p7.py`が測定行から指標・判定を別に再集計する。時間測定や時間制限付き対局の取り直しはしない。
