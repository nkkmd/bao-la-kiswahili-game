# PBAI-P6 — 現在の状態

更新日: 2026年9月8日。状態は **`COMPLETE / DEVELOPMENT-GATE-FAIL / HOLD`**。

論理ゲート型候補PBAI-C012-v1は教師への誤差と既知戦術の条件を通過したが、速度条件2件を満たさなかった。事前契約に従い開発段階で終了し、対局試験、validation、最終holdoutは未実行。棋力改善も棋力低下も確認したとは扱わない。

学習用1,024 root、開発用128 root、計1,152 rootを生成・評価し、sourceの再生と教師の全件再計算が一致した。PythonとJavaScriptの評価値、別処理の指標・判定集計、archive全22ファイルの照合も通過した。

公開判断は`NO-RELEASE / KEEP-AI-GEN3`。公開AIは`AI-GEN3 / AI-GEN3-RELEASE-001`。作業は[PR #122](https://github.com/nkkmd/bao-la-kiswahili-game/pull/122)に保存し、main統合・公開切替は行っていない。

詳細は[最終報告](PROGRAM_FINAL_REPORT.md)、固定条件は[検証契約](PROTOCOL.md)、再開境界は[再開手順](RESUME_HERE.md)を参照する。
