# PBAI-P8 — 再現性と検算

## 固定情報

[SPEC.json](SPEC.json)がモデルhash、基準commit、新規seedと数値比較契約を定める。[SOURCE_LOCK.json](SOURCE_LOCK.json)で全依存ソースを固定し、新規生成前にGitHubへ保存する。P6・P7の凍結済みファイルを変更しない。

## 事前の技術試験

次は人工入力と既知局面だけを使用する。

```sh
node test/pbai-p8.test.js
python tools/engineering/supervise-pbai-p8.py --self-test
```

## 監視実行

開始前保存が完了し、開始markerがない場合のみ実行する。

```sh
python tools/engineering/supervise-pbai-p8.py
```

外側の単一監視器が生成から最終検算まで連続4時間を監視し、開始markerの排他的作成と出力の上書き拒否を使う。開始markerを削除して取り直さない。

## 照合する内容

別記述のPRNGで採用・棄却sourceを再構成し、固定D3教師を再計算する。保存済み全棋譜の合法性・終局・得点、評価値、固定D2/D3の一致を照合し、別のPython処理で指標と判断を再集計する。時間制限付き対局は再測定しない。

JSON保存後の評価数値は有限値だけを許容し、数値ゼロの符号差を同じ値と扱う。実際の数値差は許容しない。モデルと実行中の新旧評価値の比較条件は変更しない。P7の比較失敗を修正して同じrunへ戻す処理ではない。
