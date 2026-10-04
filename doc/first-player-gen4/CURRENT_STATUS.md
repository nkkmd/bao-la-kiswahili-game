# 追加研究の現在状態

更新日: 2026-10-04

研究ID: `FPA-GEN4-STUDY1-20261003-v1`

状態: **全17,768局と最終検証が成功終了。追加対局なし。main統合済み（PR #178）。**

**AI-GEN4の公開expert同士では、静的評価の上位3手から序盤を作る条件で先攻有利が示されました。一方、全合法手から均等に序盤を作る条件では方向を確定できませんでした。Bao一般の先攻・後攻差は未確定です。**

## 確定結果と検証

- 主要`uniform-8-G4E2000`: 1,089勝959敗、先攻勝率53.17%、97.5%区間49.21〜57.11%、`INCONCLUSIVE`。
- 主要`top3-8-G4E2000`: 1,165勝883敗、先攻勝率56.88%、97.5%区間52.31〜61.51%、`FIRST-ADVANTAGE-WITHIN-DOMAIN`。
- 標準初期局面診断8局、予備352局、本試験16,384局、感度分析1,024局が完了。未決着0局。
- 正式3領域の全棋譜再生・開局再生成・件数完全性とPython再集計が合格。ルールと区間の独立実装検証は未実施。

[最終報告](FINAL_REPORT.md)を結論の基準とし、[全証拠](../../artifacts/first-player-gen4/README.md)と[再現手順](REPRODUCIBILITY_INDEX.md)を参照します。条件やseedを変更して同じ研究の結果を置換しません。

## 実行記録

- 科学ソースcommit: `542439d33b80275550f07a8ed04295e51fd545e1`
- 統合PR: [#178](https://github.com/nkkmd/bao-la-kiswahili-game/pull/178)
- 正式workflow run: [37121863392 / attempt 1](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/37121863392)
- 正式検証job: `111408555271` / success
- 終了: 2026-10-04 09:59:57 UTC（日本時間18:59:57）
- 検証済みartifact: `11299644872` / `fpa-gen4-verified-1`
- ZIPのSHA256: `fa31ed8f35f445be46dcdaae53468fced91c44233b541e53845ef57a223e55d2`

科学条件・公開AIは凍結時点から不変です。完了証拠の保存専用workflowは科学対局を実行せず、固定artifactのhash一致だけを確認して研究ブランチへ保存します。

## mainへの統合

2026-10-04にPR #178をmerge方式で統合しました。統合commitは`3845b8c6ae1fad964c1df6d38bf6e2dff5d0a2f4`、確認済み研究HEADは`ef26841ba8bba7bf335099db36aae070aa77de30`です。[統合記録](MAIN_INTEGRATION.md)に認可・最終監査・CI・変更範囲を保存しています。統合後の状態記録は文書のみの更新で、科学結果と公開AIは不変です。
