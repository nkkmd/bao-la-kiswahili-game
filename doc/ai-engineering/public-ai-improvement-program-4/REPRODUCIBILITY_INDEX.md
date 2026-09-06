# PBAI-P4 — 再現性と検算手順

## 正本と実行環境

[検証条件](PROTOCOL.md)、[baseline](BASELINE.json)、[開始レビュー](AUTHORIZATION_REVIEW.md)は契約固定後に変更しない。実行環境はNode v24.19.0、Linux x64、AMD EPYC 9V74、単一の測定プロセスである。各stageのmanifestには実行commit、source hash、契約hash、argv、開始時刻を保存する。

baselineは開始mainの公開sourceをgit showで取り出して別moduleとして読む。baselineとcandidateが別のエンジンを参照することを保証し、候補コードからbaselineの期待値を作らない。

## 保存した観測

artifacts/pbai-p4に診断・正確性結果、stage別summary.json、全観測のevidence.tar.gzを保存する。summaryのarchive SHA-256を照合してから展開する。archiveにはsource監査、採用root、固定深度の全stats、warmup後の6反復、運用観測、全棋譜、開始marker、完了JSON、独立検証を含める。

RAW identity、opening prefix、source系列の重複をsplit内外で監査する。固定開局より前の短いprefixを共有する可能性は残る。対局の先後ペアを独立した2標本とは扱わない。

## 完了済み観測を検算する

以下は保存済みの既知データの再構成・検算であり、速度や棋力の測定をやり直すコマンドではない。過去研究のholdoutも使わない。

```sh
python3 tools/engineering/audit-pbai-p4-artifacts.py
node tools/engineering/verify-pbai-p4-stage-independent.js development --check
python3 tools/engineering/verify-pbai-p4-metrics-independent.py development --check
node tools/engineering/verify-pbai-p4-stage-independent.js validation --check
python3 tools/engineering/verify-pbai-p4-metrics-independent.py validation --check
```

最終holdoutの保存完了後は、同じ2コマンドのstage引数をholdoutにして検算する。測定runnerを再実行して、消費済みseedの新しい成績に置換してはいけない。

## 数値の読み方

速度の中央値比は、各rootの6反復中央値のcandidate/baseline比を求め、それをphase別に集計する。遅延上側は、各rootの反復p95比を求め、そのroot間p95で判定する。小さい値ほど候補が短い。

heapUsedは各探索の前後、rssは同一プロセス内の観測値である。反復内の真のpeak allocationや端末の最大メモリではない。rss比が1でも、両実装の独立した最大必要メモリが同じと証明したことにはならない。GCを強制せず、測定時間には実行環境のJIT・GC・変動が含まれる。

最終棋力の区間は、完全同一系列を共有する先後ペアを同じclusterへまとめ、phaseを維持した10000回のbootstrapで求める。512局を独立標本とみなしたWilson区間は主要判定に使わない。

## 中断時と独立性

[再開位置](RESUME_HERE.md)の開始marker・完了JSONを確認し、部分実行を無断で再試行しない。独立source verifierは測定runnerの選択処理をimportせず、数量再生器は候補エンジンをimportしない。Pythonの集計器は測定runnerをimportせず、記録値から閾値を再評価する。
