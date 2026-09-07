# PBAI-P5 — 完了後の確認位置

現在は`COMPLETE / ADOPTED / AI-GEN3 / AI-GEN3-RELEASE-001`。測定は終了しており、label再追加、ActionsのRe-run、同一seedの対局再実行はしない。

## 固定した実行と証拠

- PR: [108](https://github.com/nkkmd/bao-la-kiswahili-game/pull/108)
- 準備・報告branch: engineering/pbai-p5-reverification-preparation
- 実行HEAD: b7ec229a7b34eb9266d4bc19506f3e0cd550004b
- 実行: [34041683075](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/34041683075)
- 最終証拠HEAD: 4c3b2687343153436c00b9546b6fb6223be939d1
- baseline main: 548ccead3965fa98602d99c8b3e2a49fbeeed093

同じrunは約40分17秒で完了した。全コマンドが4時間以内で終了し、外部保存とActions artifactの保存も成功した。報告ブランチのHEADは実行HEADより先へ進むため、試験sourceは上記実行HEADとSOURCE_LOCK/PREPARATION_LOCKを正本とする。

## 再開時に行うこと

git status --shortを確認して他作業を上書きせず、artifacts/pbai-p5/final-evidence-index.jsonに記録したarchive hashを照合する。final-evidence.tar.gzに全1,153ファイル、final-result.jsonに正式判断を保存した。[再現手順](REPRODUCIBILITY_INDEX.md)の監査と --check は保存済み観測の検算である。測定runnerや --start は実行しない。

診断予約821 blockは未使用のまま。正確性825000001..825000064は消費済み。822/823/824の局面、826/827/828の対局、829000001の集計は開いている。各run内のseeds.jsonl、source audit、correctness.seedRowsが消費済みseedの正本であり、blockの残りを新規holdoutとして無断追加しない。

## 次の作業と公開境界

結果確認、レビュー指摘の追加監査、PR #107、#108、#109のmain統合、公開用configとPWA cacheの配信、実サイトのasset・Chrome相当動作確認は完了した。公開用configではhard/expertの候補を既定有効にしている。[公開配信検証](PUBLIC_DEPLOYMENT_VERIFICATION.md)に照合結果を保存した。

進行中の科学試験はない。正式判断`ADOPT`、release ID `AI-GEN3-RELEASE-001`、`AI-GEN3`昇格は[正式昇格判断](PROMOTION_DECISION.md)に記録した。昇格表示を含むmain `e6a3936ee6285d606be83987b5ae3aa2ee61ec25`の`public/`は手動Cloudflare配信と実サイト確認まで完了した。

追加対局、使用済みseedの再利用、過去判断の変更は行わない。公開障害時はrelease記録のrollback手順を使う。昇格表示の配信状態は`VERIFIED-PUBLIC-ACTIVE`であり、次に必須の公開作業はない。
