# 第五世代研究 — 再開位置

更新日: 2026-10-12（日本時間）  
安全な再開点: **独立遷移の技術検証合格・新規局面の開発実行契約前**

## 次に進めること

1. [現在の状態](CURRENT_STATUS.md)、[研究ログ](RESEARCH_LOG.md)、最新mainと研究ブランチを照合する。
2. [G5-01の技術契約](g5-01/TECHNICAL_CONTRACT.md)、ソースmanifest、認可記録を確認する。
3. [Stage 0報告](g5-01/STAGE_0_REPORT.md)と保存済みresult・verification・CI来歴を確認する。Stage 0は完了している。
4. [独立遷移報告](g5-01/transition/REPORT.md)と保存済み結果・CI来歴を確認する。独立遷移の技術検証は合格済みである。
5. [開発診断設計](g5-01/DEVELOPMENT_PLAN.md)を実行契約へ固定し、source生成・独立再生・全閉包照合・durable lease・checkpoint・artifact保存を実装する。
6. 新規証拠を使う前に、source policy、RAW identity、重複遮断、seed、標本単位、閾値、資源上限、停止・復帰規則を固定する。

Stage 0は同じ既知fixtureの反復が許される技術確認である。正式科学実行の再実行・seed再読取・workflow起動を自動的に認可しない。G4-05固定8領域、G4-09未読namespace、G4-10の未完成層を新規の正式証拠に転用しない。

研究の正式結論と公開AIの変更は別判断である。
