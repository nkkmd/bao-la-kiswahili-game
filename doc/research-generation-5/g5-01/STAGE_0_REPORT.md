# G5-01 Stage 0 — 技術検証報告

実施日: 2026-10-12（日本時間）  
正式な技術判断: **`STAGE0-TECHNICAL-PASS`**  
科学的な関係の判断: **未実施**

## 結果

既知fixture限定の測定基盤は技術契約に従って合格した。現行takasiaルールで探索順位を測り、順位変動と選択手変更を分けて保存できる。人工グラフでは同価値の手への変更、下位順位だけの変動、安定した誤選択、勝ちから負けへの変更、同点、到達手数だけの差、未解決再帰を区別できた。

| 検証 | 結果 |
| --- | --- |
| 既知takasiaの検出・遷移確認 | 25件すべて合格 |
| 全root手の探索順位 | 4局面×深さ1・2の8測定でアルファベータと全幅minimaxが一致 |
| 人工グラフの解 | 10頂点で二つのJavaScript解法が一致し、Pythonの勝者・距離計算も一致 |
| 順位・価値損失の意味確認 | 固定9件で独立一致 |
| G5-01技術テスト | 7件合格。中断復帰・成果物改変・排他lock・上限停止を含む |
| 現行takasiaエンジン・AI回帰 | ローカル36件合格 |
| GitHub Actions | run `38229687584` / attempt 1 / success |

ローカル技術測定は147 ms、最大RSS 49,385,472 bytes、結果JSONは62,613 bytesだった。これは既知fixtureの費用であり、新規領域の完全解析の費用を示さない。

## ソースと来歴

実行前ソース・契約固定コミットは `885e3c4152b6979a70a20755c8bf064b8d4dd29c`、基準mainは `6decdd2bb3979d96420e4da6ff4592be70c8d6c4` である。

ローカルの[測定結果](results/stage-0/result.json)と[Python検算](results/stage-0/verification.json)を保存した。checkpointは技術的な復帰用であり、同じcoreに含まれる行の重複保管を避けるためGitには収録しない。

[Actions run](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38229687584)の測定・検算ログで、ローカルと同じcore SHA-256を確認した。

```text
cb8d2651a40b3576cf5d98a08bd7a7bbcbef7a731af729fdf4d617dc13834ed0
```

ActionsのartifactはID `11738117168`、archive digestは `sha256:4575b774731cd6ab5883ecd4d40a4d4797e5866a30dfb0b43e4dadee2527cebd` である。run・job・artifact・core一致の確認は[CI来歴](results/stage-0/CI_RECEIPT.json)に記録した。Gitへ保存したJSONはローカル実行の結果であり、Actions artifactのbyteコピーではない。

## 判断の意味と限界

今回の合格は測定・保存・復帰・技術検算の準備ができたことを意味する。順位変動が価値損失を予測するという科学的な結論はまだない。Bao fixtureには完全閉包に基づく勝敗値を付与していない。

探索の独立比較はルールエンジンと評価器を共有する。既知takasia oracleの範囲も限定されるため、全ルールの独立遷移検証は未完了である。公開AIの棋力評価、改善効果、採用判断は行っていない。

## 次工程

[次工程の設計事項](NEXT_STAGE_DESIGN.md)に従い、現行ルールの独立遷移検証、開発・正式証拠の分離、root選択、資源診断、Actionsの消費記録と中断規則を具体化する。Stage 0合格を理由に新規証拠へ自動アクセスしない。
